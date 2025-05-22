import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fetchWithTimeout } from "../index"
import {
  startJobGeneric,
  pollJobGeneric,
  getProcessingJobs,
} from "../utils/generic-queue"

const TABLE_NAME = process.env.QUEUES_TABLE
const REMOTION_RENDER_URL =
  "https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod/render"
const REMOTION_STATUS_URL =
  "https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod/status"
const MAX_RETRIES = parseInt(process.env.HEYGEN_MAX_RETRIES ?? "3", 10)

export const handleRemotionJob = async (
  job: any,
  client: DynamoDBClient,
  tableName: string,
) => {
  const { params } = job
  const inputData = params
  const remotionApiCall = async (inputData: any) => {
    const res = await fetchWithTimeout(REMOTION_RENDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData),
    })
    const data = await res.json()
    return {
      externalId: data.renderId ?? "",
      outputData: data,
      bucketName: data.bucketName ?? "",
    }
  }
  await startJobGeneric({
    inputData,
    apiCall: remotionApiCall,
    job,
    client,
    tableName,
  })
}

export const pollRemotionHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const client = new DynamoDBClient({})
  const processingJobs = await getProcessingJobs({
    client,
    tableName: TABLE_NAME,
    queueType: "remotion",
  })
  const remotionPollApi = async ({
    externalId,
    bucketName,
  }: {
    externalId: string
    bucketName: string
  }) => {
    const res = await fetchWithTimeout(
      `${REMOTION_STATUS_URL}?renderId=${externalId}&bucketName=${bucketName}`,
    )
    const data = await res.json()
    return {
      done: data.done,
      failed: data.fatalErrorEncountered,
      outputData: data,
      outputUrl: data.outputFile,
      duration: data.duration,
    }
  }
  for (const job of processingJobs) {
    await pollJobGeneric({
      pollApi: remotionPollApi,
      job,
      client,
      tableName: TABLE_NAME,
      queueType: "remotion",
    })
  }
}
