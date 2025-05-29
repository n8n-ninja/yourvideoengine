import { handleHeygenJob } from "../queues/heygen-queue"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import * as genericQueue from "../utils/generic-queue"
import type {} from "jest"

jest.mock("../utils/generic-queue")

const mockStartJobGeneric = jest.fn()
Object.defineProperty(genericQueue, "startJobGeneric", {
  value: mockStartJobGeneric,
})

describe("handleHeygenJob", () => {
  const client = {} as DynamoDBClient
  const tableName = "fake-table"
  const baseJob = {
    jobId: "job1",
    projectId: "proj1",
    status: "pending",
    attempts: 0,
    inputData: {
      apiKey: "fake-key",
      avatar_id: "avatar1",
      input_text: "Hello!",
      voice_id: "voice1",
      speed: 1.0,
      width: 720,
      height: 1280,
    },
    outputData: {},
    queueType: "heygen",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("appelle startJobGeneric avec les bons paramètres (succès)", async () => {
    await handleHeygenJob(baseJob as any, client, tableName)
    expect(mockStartJobGeneric).toHaveBeenCalledWith(
      expect.objectContaining({
        inputData: expect.any(Object),
        job: baseJob,
        client,
        tableName,
        apiCall: expect.any(Function),
      })
    )
  })

  it("gère une erreur réseau dans apiCall (échec)", async () => {
    mockStartJobGeneric.mockImplementationOnce(async ({ apiCall }) => {
      await expect(apiCall({})).rejects.toThrow("network error")
      return undefined
    })
    jest
      .spyOn(require("../index"), "fetchWithTimeout")
      .mockImplementationOnce(() => {
        throw new Error("network error")
      })
    await expect(
      handleHeygenJob(baseJob as any, client, tableName)
    ).resolves.toBeUndefined()
  })

  it("gère une réponse API sans video_id (échec)", async () => {
    mockStartJobGeneric.mockImplementationOnce(async ({ apiCall }) => {
      const res = await apiCall({})
      expect(res.externalId).toBe("")
      return undefined
    })
    jest
      .spyOn(require("../index"), "fetchWithTimeout")
      .mockImplementationOnce(async () => ({
        json: async () => ({ data: {} }),
      }))
    await expect(
      handleHeygenJob(baseJob as any, client, tableName)
    ).resolves.toBeUndefined()
  })

  it("gère une réponse API correcte (succès)", async () => {
    mockStartJobGeneric.mockImplementationOnce(async ({ apiCall }) => {
      const res = await apiCall({})
      expect(res.externalId).toBe("vid123")
      expect(res.outputData).toEqual({ data: { video_id: "vid123" } })
      return undefined
    })
    jest
      .spyOn(require("../index"), "fetchWithTimeout")
      .mockImplementationOnce(async () => ({
        json: async () => ({ data: { video_id: "vid123" } }),
      }))
    await expect(
      handleHeygenJob(baseJob as any, client, tableName)
    ).resolves.toBeUndefined()
  })
})
