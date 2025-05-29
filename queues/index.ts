import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { v4 as uuidv4 } from "uuid"
import { handleRemotionJob, pollRemotionHandler } from "./queues/remotion-queue"
import { handleFluxJob, pollFluxHandler } from "./queues/flux-queue"
import { handleHeygenJob, pollHeygenHandler } from "./queues/heygen-queue"
import { putJob, fromDynamoItem, Job } from "./utils/dynamo-helpers"

// --- Utilitaire fetch avec timeout ---
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<any> => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    ),
  ])
}

interface EnqueueVideoInput {
  projectId: string
  clientId: string
  callbackUrl: string
  params: Record<string, unknown>
  slug?: string
  queueType?: string
}

const TABLE_NAME = process.env.QUEUES_TABLE

// --- Validation stricte d'un input vidéo ---
export const validateEnqueueVideoInput = (video: any): boolean => {
  return (
    typeof video === "object" &&
    typeof video.projectId === "string" &&
    typeof video.clientId === "string" &&
    typeof video.callbackUrl === "string" &&
    typeof video.params === "object" &&
    video.projectId.length > 0 &&
    video.clientId.length > 0 &&
    video.callbackUrl.length > 0
  )
}

// --- Calcul du nombre de slots disponibles ---
export const getAvailableSlots = (
  processingCount: number,
  maxConcurrency: number
): number => {
  return Math.max(0, maxConcurrency - processingCount)
}

// --- Config de queues centralisée ---
const queueConfigs = {
  heygen: {
    maxConcurrency: 2,
    handler: handleHeygenJob,
    poller: pollHeygenHandler,
    maxRetries: 3,
  },
  remotion: {
    maxConcurrency: 1,
    handler: handleRemotionJob,
    poller: pollRemotionHandler,
    maxRetries: 3,
  },
  flux: {
    maxConcurrency: 2,
    handler: handleFluxJob,
    poller: pollFluxHandler,
    maxRetries: 3,
  },
}

export const enqueueHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing body" }),
    }
  }
  let videos: EnqueueVideoInput[] = []
  try {
    const parsed = JSON.parse(event.body)
    videos = Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    }
  }
  const client = new DynamoDBClient({})
  const now = new Date().toISOString()
  for (const video of videos) {
    // --- Validation stricte ---
    if (!validateEnqueueVideoInput(video)) {
      console.error(
        JSON.stringify({
          event: "invalid-video-input",
          video,
          timestamp: now,
        })
      )
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid video input" }),
      }
    }
    if (!video.queueType) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing queueType in job" }),
      }
    }
    const videoId = uuidv4()
    try {
      const job: Job = {
        jobId: videoId,
        projectId: video.projectId,
        clientId: video.clientId,
        status: "pending",
        attempts: 0,
        inputData: video.params,
        outputData: {},
        returnData: undefined,
        queueType: video.queueType,
        callbackUrl: video.callbackUrl,
        createdAt: now,
        updatedAt: now,
      }
      await putJob(client, TABLE_NAME!, job)
      console.log(
        JSON.stringify({
          event: "video-enqueued",
          projectId: video.projectId,
          videoId,
          timestamp: now,
        })
      )
    } catch (err) {
      console.error(
        JSON.stringify({
          event: "dynamodb-put-error",
          error: (err as Error).message,
          projectId: video.projectId,
          videoId,
          timestamp: now,
        })
      )
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "DynamoDB error" }),
      }
    }
  }
  // Appel direct du worker pour lancer le traitement immédiatement
  try {
    await workerHandler()
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "worker-trigger-error",
        error: (err as Error).message,
        timestamp: now,
      })
    )
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Enqueued!", count: videos.length }),
  }
}

export const workerHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const client = new DynamoDBClient({})
  for (const [queueType, config] of Object.entries(queueConfigs)) {
    // 1. Get all jobs with status = 'pending' and queueType
    let pendingRes
    try {
      pendingRes = await client.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: "#status = :pending AND #queueType = :queueType",
          ExpressionAttributeNames: {
            "#status": "status",
            "#queueType": "queueType",
          },
          ExpressionAttributeValues: {
            ":pending": { S: "pending" },
            ":queueType": { S: queueType },
          },
        })
      )
    } catch (err) {
      continue
    }
    const pendingJobs = pendingRes.Items ?? []
    // 2. Get all jobs with status = 'processing' and queueType
    let processingRes
    try {
      processingRes = await client.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: "#status = :processing AND #queueType = :queueType",
          ExpressionAttributeNames: {
            "#status": "status",
            "#queueType": "queueType",
          },
          ExpressionAttributeValues: {
            ":processing": { S: "processing" },
            ":queueType": { S: queueType },
          },
        })
      )
    } catch (err) {
      continue
    }
    const processingCount = (processingRes.Items ?? []).length
    const availableSlots = getAvailableSlots(
      processingCount,
      config.maxConcurrency
    )
    if (availableSlots === 0) continue
    // 3. Launch up to availableSlots jobs
    const toLaunch = pendingJobs.slice(0, availableSlots)
    for (const item of toLaunch) {
      const job = {
        ...item,
        params: item.params?.S ? JSON.parse(item.params.S) : {},
        pk: item.pk?.S ?? "",
        sk: item.sk?.S ?? "",
        attempts: parseInt(item.attempts?.N ?? "0", 10),
      }
      await config.handler(fromDynamoItem(item), client, TABLE_NAME)
    }
  }
}

export const workerHttpHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await workerHandler()
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "workerHandler triggered" }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: (error as Error).message }),
    }
  }
}

const checkCompletion = async (
  projectId: string,
  client: DynamoDBClient
): Promise<{ allReady: boolean; callbackUrl?: string; videos: any[] }> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const res = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "pk" },
      ExpressionAttributeValues: { ":pk": { S: `PROJECT#${projectId}` } },
    })
  )
  const items = res.Items ?? []
  const allReady =
    items.length > 0 && items.every((item) => item.status?.S === "ready")
  const callbackUrl = items[0]?.callbackUrl?.S
  // Map videos to a clean array
  const videos = items.map(fromDynamoItem)
  return { allReady, callbackUrl, videos }
}

export const pollAllQueuesHandler = async (): Promise<void> => {
  for (const { poller } of Object.values(queueConfigs)) {
    if (poller) await poller()
  }
}

export const pollHttpHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await pollAllQueuesHandler()
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "All pollers triggered" }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: (error as Error).message }),
    }
  }
}

export { fetchWithTimeout }
