process.env.QUEUES_TABLE = "dummy"

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}))

// @ts-nocheck

import {
  validateEnqueueVideoInput,
  getAvailableSlots,
  fetchWithTimeout,
  enqueueHandler,
} from "./index"
import { mapDynamoItemToJob } from "./utils/check-completion"
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

describe("mapDynamoItemToJob", () => {
  it("maps a DynamoDB item to a generic job object", () => {
    const item = {
      pk: { S: "PROJECT#p1" },
      sk: { S: "VIDEO#123" },
      externalId: { S: "ext1" },
      status: { S: "ready" },
      attempts: { N: "2" },
      inputData: { S: '{"foo":"bar"}' },
      outputData: { S: '{"url":"u"}' },
      outputUrl: { S: "https://output" },
      duration: { N: "42" },
      slug: { S: "intro" },
      queueType: { S: "heygen" },
      callbackUrl: { S: "cb" },
      createdAt: { S: "2024-01-01" },
      updatedAt: { S: "2024-01-02" },
    }
    expect(mapDynamoItemToJob(item)).toEqual({
      jobId: "123",
      externalId: "ext1",
      status: "ready",
      attempts: 2,
      inputData: { foo: "bar" },
      outputData: { url: "u" },
      outputUrl: "https://output",
      duration: 42,
      captionUrl: undefined,
      slug: "intro",
      queueType: "heygen",
      callbackUrl: "cb",
      projectId: "p1",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
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
        { projectId: "p1", callbackUrl: "cb", params: {}, queueType: "heygen" },
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
