import { handleRemotionJob } from "../queues/remotion-queue"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import * as genericQueue from "../utils/generic-queue"
import type {} from "jest"

jest.mock("../utils/generic-queue")

const mockStartJobGeneric = jest.fn()
Object.defineProperty(genericQueue, "startJobGeneric", {
  value: mockStartJobGeneric,
})

describe("handleRemotionJob", () => {
  const client = {} as DynamoDBClient
  const tableName = "fake-table"
  const baseJob = {
    jobId: "job1",
    projectId: "proj1",
    status: "pending",
    attempts: 0,
    inputData: { foo: "bar" },
    outputData: {},
    queueType: "remotion",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("appelle startJobGeneric avec les bons paramètres (succès)", async () => {
    await handleRemotionJob(baseJob as any, client, tableName)
    expect(mockStartJobGeneric).toHaveBeenCalledWith(
      expect.objectContaining({
        inputData: baseJob.inputData,
        job: baseJob,
        client,
        tableName,
        apiCall: expect.any(Function),
      })
    )
  })

  it("gère une erreur réseau dans apiCall (échec)", async () => {
    mockStartJobGeneric.mockImplementationOnce(async ({ apiCall, ...args }) => {
      await expect(apiCall({})).rejects.toThrow("network error")
      return undefined
    })
    // Patch fetchWithTimeout pour throw
    jest
      .spyOn(require("../index"), "fetchWithTimeout")
      .mockImplementationOnce(() => {
        throw new Error("network error")
      })
    await expect(
      handleRemotionJob(baseJob as any, client, tableName)
    ).resolves.toBeUndefined()
  })

  it("gère une réponse API sans renderId (échec)", async () => {
    mockStartJobGeneric.mockImplementationOnce(async ({ apiCall, ...args }) => {
      const res = await apiCall({})
      expect(res.externalId).toBe("")
      return undefined
    })
    jest
      .spyOn(require("../index"), "fetchWithTimeout")
      .mockImplementationOnce(async () => ({
        json: async () => ({}),
      }))
    await expect(
      handleRemotionJob(baseJob as any, client, tableName)
    ).resolves.toBeUndefined()
  })

  it("gère une réponse API correcte (succès)", async () => {
    mockStartJobGeneric.mockImplementationOnce(async ({ apiCall, ...args }) => {
      const res = await apiCall({})
      expect(res.externalId).toBe("abc123")
      expect(res.outputData).toEqual({ renderId: "abc123" })
      return undefined
    })
    jest
      .spyOn(require("../index"), "fetchWithTimeout")
      .mockImplementationOnce(async () => ({
        json: async () => ({ renderId: "abc123" }),
      }))
    await expect(
      handleRemotionJob(baseJob as any, client, tableName)
    ).resolves.toBeUndefined()
  })
})
