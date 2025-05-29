import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fetchWithTimeout } from "../index"
import {
  scanJobs,
  Job,
} from "../utils/dynamo-helpers"
import {
  startJobGeneric,
  pollJobGeneric,
} from "../utils/generic-queue"

const TABLE_NAME = process.env.QUEUES_TABLE
const REMOTION_RENDER_URL = process.env.REMOTION_RENDER_URL ?? ""
const REMOTION_STATUS_URL = process.env.REMOTION_STATUS_URL ?? ""

export const handleRemotionJob = async (
  job: Job,
  client: DynamoDBClient,
  tableName: string,
) => {
  console.log("[Remotion][handleRemotionJob] Job reçu:", JSON.stringify(job))
  const { inputData } = job
  console.log(
    "[Remotion][handleRemotionJob] inputData:",
    JSON.stringify(inputData),
  )
  const remotionApiCall = async (inputData: any) => {
    console.log(
      "[Remotion][remotionApiCall] Appel API avec:",
      JSON.stringify(inputData),
    )
    let res
    try {
      res = await fetchWithTimeout(REMOTION_RENDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      })
    } catch (err) {
      console.error("[Remotion][remotionApiCall] Erreur fetch:", err)
      throw err
    }
    let data
    try {
      data = await res.json()
    } catch (err) {
      console.error("[Remotion][remotionApiCall] Erreur parsing JSON:", err)
      throw err
    }
    console.log(
      "[Remotion][remotionApiCall] Réponse API:",
      JSON.stringify(data),
    )
    return {
      externalId: data.renderId ?? "",
      outputData: data,
    }
  }
  try {
    console.log("[Remotion][handleRemotionJob] Lancement startJobGeneric")
    await startJobGeneric({
      inputData,
      apiCall: remotionApiCall,
      job,
      client,
      tableName,
      maxRetries: 3,
    })
    console.log("[Remotion][handleRemotionJob] startJobGeneric terminé")
  } catch (err) {
    console.error("[Remotion][handleRemotionJob] Erreur générale:", err)
    throw err
  }
}

export const pollRemotionHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const client = new DynamoDBClient({})
  const processingJobs = (await scanJobs(client, TABLE_NAME)).filter(
    (job) => job.status === "processing" && job.queueType === "remotion",
  )
  const remotionPollApi = async (job: Job) => {
    const { externalId, outputData } = job
    const bucketName = outputData?.bucketName
    const res = await fetchWithTimeout(
      `${REMOTION_STATUS_URL}?renderId=${externalId}&bucketName=${bucketName}`,
    )
    const data = await res.json()
    let failed = false
    let errorDetails = null
    if (Array.isArray(data.errors) && data.errors.some((e: any) => e.isFatal)) {
      failed = true
      errorDetails = data.errors.filter((e: any) => e.isFatal)
    }
    return {
      done: data.done,
      failed,
      outputData: failed ? { ...data, error: errorDetails } : data,
      returnData: failed ? { errors: errorDetails } : (data.outputFile ? { url: data.outputFile } : undefined),
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
