import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fetchWithTimeout } from "../index"
import {
  startJobGeneric,
  pollJobGeneric,
  getProcessingJobs,
} from "../utils/generic-queue"

const TABLE_NAME = process.env.QUEUES_TABLE
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
const HEYGEN_API_URL = "https://api.heygen.com/v2/video/generate"
const HEYGEN_STATUS_URL = "https://api.heygen.com/v1/video_status.get"

export const handleHeygenJob = async (
  job: any,
  client: DynamoDBClient,
  tableName: string,
) => {
  const { params } = job
  const apiKey = params.apiKey || HEYGEN_API_KEY
  if (!apiKey) return
  const inputData = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: params.avatar_id,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: params.input_text,
          voice_id: params.voice_id,
          speed: params.speed ?? 1.0,
        },
      },
    ],
    dimension: {
      width: params.width ?? 1080,
      height: params.height ?? 1920,
    },
  }
  const heygenApiCall = async (inputData: any) => {
    const res = await fetchWithTimeout(HEYGEN_API_URL, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
    const data = await res.json()
    return {
      externalId: data.data?.video_id ?? "",
      outputData: data,
    }
  }
  await startJobGeneric({
    inputData,
    apiCall: heygenApiCall,
    job,
    client,
    tableName,
  })
}

export const pollHeygenHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const client = new DynamoDBClient({})
  const processingJobs = await getProcessingJobs({
    client,
    tableName: TABLE_NAME,
    queueType: "heygen",
  })
  const heygenPollApi = async ({ externalId }: { externalId: string }) => {
    const res = await fetchWithTimeout(
      `${HEYGEN_STATUS_URL}?video_id=${externalId}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": HEYGEN_API_KEY as string,
          Accept: "application/json",
        } as Record<string, string>,
      },
    )
    const data = await res.json()
    return {
      done: data.data?.status === "completed",
      failed: data.data?.status === "failed",
      outputData: data.data,
      outputUrl: data.data?.video_url,
      duration: data.data?.duration,
    }
  }
  for (const job of processingJobs) {
    await pollJobGeneric({
      pollApi: heygenPollApi,
      job,
      client,
      tableName: TABLE_NAME,
      queueType: "heygen",
    })
  }
}
