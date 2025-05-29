import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fetchWithTimeout } from "../index"
import { startJobGeneric, pollJobGeneric } from "../utils/generic-queue"
import { scanJobs, Job } from "../utils/dynamo-helpers"

const TABLE_NAME = process.env.QUEUES_TABLE
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
const HEYGEN_RENDER_URL = process.env.HEYGEN_RENDER_URL
const HEYGEN_STATUS_URL = process.env.HEYGEN_STATUS_URL

export const handleHeygenJob = async (
  job: Job,
  client: DynamoDBClient,
  tableName: string
) => {
  const { inputData: params } = job
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
    const res = await fetchWithTimeout(HEYGEN_RENDER_URL!, {
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
    maxRetries: 3,
  })
}

export const pollHeygenHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const client = new DynamoDBClient({})
  const processingJobs = (await scanJobs(client, TABLE_NAME)).filter(
    (job) => job.status === "processing" && job.queueType === "heygen"
  )
  const heygenPollApi = async (job: Job) => {
    const { externalId } = job
    const res = await fetchWithTimeout(
      `${HEYGEN_STATUS_URL}?video_id=${externalId}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": HEYGEN_API_KEY as string,
          Accept: "application/json",
        } as Record<string, string>,
      }
    )
    const data = await res.json()
    let failed = false
    let errorDetails = null
    if (data.data?.status === "failed") {
      failed = true
      errorDetails = data.data
    }
    return {
      done: data.data?.status === "completed",
      failed,
      outputData: data.data,
      returnData: failed
        ? { errors: errorDetails }
        : data.data?.video_url
        ? { url: data.data.video_url }
        : undefined,
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
