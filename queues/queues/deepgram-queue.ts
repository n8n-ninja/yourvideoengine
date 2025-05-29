import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fetchWithTimeout } from "../index"
import { startJobGeneric, pollJobGeneric } from "../utils/generic-queue"
import { scanJobs, Job } from "../utils/dynamo-helpers"

const TABLE_NAME = process.env.QUEUES_TABLE
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY
const DEEPGRAM_URL = process.env.DEEPGRAM_URL

export const handleDeepgramJob = async (
  job: Job,
  client: DynamoDBClient,
  tableName: string
) => {
  const { inputData: params } = job
  const apiKey = params.apiKey || DEEPGRAM_API_KEY
  if (!apiKey) return
  // Construction de la requête Deepgram
  const url = new URL(DEEPGRAM_URL!)
  if (params.model) url.searchParams.set("model", params.model)
  if (params.language) url.searchParams.set("language", params.language)
  if (params.punctuate) url.searchParams.set("punctuate", "true")
  if (params.model === "nova-3" && Array.isArray(params.keywords)) {
    params.keywords.forEach((k: string) =>
      url.searchParams.append("keyterm", k)
    )
  } else if (params.keywords && Array.isArray(params.keywords)) {
    params.keywords.forEach((k: string) =>
      url.searchParams.append("keywords", k)
    )
  }
  const inputData = {
    url: params.videoUrl,
  }
  const deepgramApiCall = async (_inputData: any) => {
    const res = await fetchWithTimeout(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
    const data = await res.json()
    // On stocke tout le retour dans outputData, et le transcript dans returnData si dispo
    return {
      externalId: data.request_id ?? job.jobId,
      outputData: data,
      returnData: data.results?.channels?.[0]?.alternatives?.[0] ?? undefined,
    }
  }
  await startJobGeneric({
    inputData,
    apiCall: deepgramApiCall,
    job,
    client,
    tableName,
    maxRetries: 3,
  })
}

export const pollDeepgramHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const client = new DynamoDBClient({})
  const processingJobs = (await scanJobs(client, TABLE_NAME)).filter(
    (job) => job.status === "processing" && job.queueType === "deepgram"
  )
  const deepgramPollApi = async (job: Job) => {
    // Pas de polling API, juste un buffer pour éviter la surcharge
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // On considère le job comme done après le buffer
    return {
      done: true,
      failed: false,
      outputData: job.outputData,
      returnData: job.returnData,
    }
  }
  for (const job of processingJobs) {
    await pollJobGeneric({
      pollApi: deepgramPollApi,
      job,
      client,
      tableName: TABLE_NAME,
      queueType: "deepgram",
    })
  }
}
