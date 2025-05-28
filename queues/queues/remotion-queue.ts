import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fetchWithTimeout } from "../index"
import {
  startJobGeneric,
  pollJobGeneric,
  getProcessingJobs,
} from "../utils/generic-queue"

const TABLE_NAME = process.env.QUEUES_TABLE
const REMOTION_RENDER_URL = process.env.REMOTION_RENDER_URL ?? ""
const REMOTION_STATUS_URL = process.env.REMOTION_STATUS_URL ?? ""
const MAX_RETRIES = parseInt(process.env.HEYGEN_MAX_RETRIES ?? "3", 10)

export const handleRemotionJob = async (
  job: any,
  client: DynamoDBClient,
  tableName: string,
) => {
  console.log("[Remotion][handleRemotionJob] Job reçu:", JSON.stringify(job))
  const { params } = job
  const inputData = params
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
      bucketName: data.bucketName ?? "",
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
    // Gestion d'erreur spécifique Remotion
    let failed = false
    let errorDetails = null
    if (data.fatalErrorEncountered) {
      failed = true
      errorDetails = data.errors || data
    } else if (Array.isArray(data.errors) && data.errors.some((e: any) => e.isFatal)) {
      failed = true
      errorDetails = data.errors
    }
    return {
      done: data.done,
      failed,
      outputData: failed ? { ...data, remotionError: errorDetails } : data,
      outputUrl: data.outputFile,
      duration: data.duration,
      returnData: data.outputFile ? { url: data.outputFile } : undefined,
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
