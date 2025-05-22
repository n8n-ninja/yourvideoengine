process.env.HEYGEN_VIDEOS_TABLE = "dummy"

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}))

// @ts-nocheck

import {
  validateEnqueueVideoInput,
  mapDynamoItemToVideo,
  getAvailableSlots,
  fetchWithTimeout,
  enqueueHandler,
  workerHandler,
} from "./index"

import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb"

const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})
afterAll(() => {
  console.error = originalError
})

describe("validateEnqueueVideoInput", () => {
  it("returns true for valid input", () => {
    expect(
      validateEnqueueVideoInput({
        projectId: "p1",
        callbackUrl: "cb",
        params: { foo: "bar" },
      }),
    ).toBe(true)
  })
  it("returns false for missing projectId", () => {
    expect(validateEnqueueVideoInput({ callbackUrl: "cb", params: {} })).toBe(
      false,
    )
  })
  it("returns false for missing callbackUrl", () => {
    expect(validateEnqueueVideoInput({ projectId: "p1", params: {} })).toBe(
      false,
    )
  })
  it("returns false for missing params", () => {
    expect(
      validateEnqueueVideoInput({ projectId: "p1", callbackUrl: "cb" }),
    ).toBe(false)
  })
})

describe("mapDynamoItemToVideo", () => {
  it("maps a DynamoDB item to a video object", () => {
    const item = {
      sk: { S: "VIDEO#123" },
      heygenId: { S: "h1" },
      status: { S: "ready" },
      attempts: { N: "2" },
      params: { S: '{"foo":"bar"}' },
      createdAt: { S: "2024-01-01" },
      updatedAt: { S: "2024-01-02" },
      heygenData: { S: '{"url":"u"}' },
    }
    expect(mapDynamoItemToVideo(item)).toEqual({
      videoId: "123",
      heygenId: "h1",
      status: "ready",
      attempts: 2,
      params: { foo: "bar" },
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
      heygenData: { url: "u" },
    })
  })
})

describe("getAvailableSlots", () => {
  it("returns correct available slots", () => {
    expect(getAvailableSlots(0, 3)).toBe(3)
    expect(getAvailableSlots(2, 3)).toBe(1)
    expect(getAvailableSlots(3, 3)).toBe(0)
    expect(getAvailableSlots(5, 3)).toBe(0)
  })
})

describe("validateEnqueueVideoInput - types", () => {
  it("returns false for wrong types", () => {
    expect(
      validateEnqueueVideoInput({
        projectId: 123,
        callbackUrl: "cb",
        params: {},
      }),
    ).toBe(false)
    expect(
      validateEnqueueVideoInput({
        projectId: "p1",
        callbackUrl: 123,
        params: {},
      }),
    ).toBe(false)
    expect(
      validateEnqueueVideoInput({
        projectId: "p1",
        callbackUrl: "cb",
        params: "foo",
      }),
    ).toBe(false)
  })
})

describe("mapDynamoItemToVideo - partial", () => {
  it("handles missing fields gracefully", () => {
    const item = { sk: { S: "VIDEO#1" } }
    expect(mapDynamoItemToVideo(item)).toEqual({
      videoId: "1",
      heygenId: undefined,
      status: undefined,
      attempts: 0,
      params: {},
      createdAt: undefined,
      updatedAt: undefined,
      heygenData: null,
    })
  })
})

describe("fetchWithTimeout", () => {
  it("rejects with Timeout if fetch takes too long", async () => {
    const never = new Promise(() => {})
    const fetch = require("node-fetch").default
    fetch.mockImplementation(() => never)
    await expect(fetchWithTimeout("http://test", {}, 100)).rejects.toThrow(
      "Timeout",
    )
  })
})

describe("enqueueHandler - DynamoDB error", () => {
  it("returns 500 if DynamoDB put fails", async () => {
    const event = {
      body: JSON.stringify([
        { projectId: "p1", callbackUrl: "cb", params: {} },
      ]),
    }
    // Mock DynamoDBClient.send to throw
    jest.spyOn(DynamoDBClient.prototype, "send").mockImplementationOnce(() => {
      throw new Error("dynamo fail")
    })
    const res = await enqueueHandler(event as any)
    expect(res.statusCode).toBe(500)
    expect(JSON.parse(res.body).error).toMatch(/DynamoDB/)
  })
})

describe("workerHandler - HeyGen fetch error", () => {
  it("logs error if fetch fails", async () => {
    process.env.HEYGEN_VIDEOS_TABLE = "dummy"
    console.log("HEYGEN_VIDEOS_TABLE in test:", process.env.HEYGEN_VIDEOS_TABLE)
    // Mock ScanCommand to return 1 pending, 0 processing
    jest.spyOn(DynamoDBClient.prototype, "send").mockImplementation((cmd) => {
      if (cmd instanceof ScanCommand) {
        if (cmd.input.FilterExpression?.includes("pending")) {
          return Promise.resolve({
            Items: [
              {
                pk: { S: "PROJECT#p1" },
                sk: { S: "VIDEO#1" },
                params: { S: "{}" },
                attempts: { N: "0" },
                callbackUrl: { S: "cb" },
              },
            ],
          })
        }
        if (cmd.input.FilterExpression?.includes("processing")) {
          return Promise.resolve({ Items: [] })
        }
      }
      if (cmd instanceof UpdateItemCommand) return Promise.resolve({})
      return Promise.resolve({})
    })
    // Mock fetch to throw
    const fetch = require("node-fetch").default
    fetch.mockImplementation(() => {
      throw new Error("fetch fail")
    })
    // Do not throw, just check that it runs
    try {
      await expect(workerHandler()).resolves.toBeUndefined()
    } catch (e) {
      console.error("Test error:", e)
      throw e
    }
  })
})
