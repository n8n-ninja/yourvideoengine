import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb"
import { v4 as uuidv4 } from "uuid"
import fetch from "node-fetch"

export const helloWorld = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Hello world! This is a test" }),
  }
}

interface EnqueueVideoInput {
  projectId: string
  callbackUrl: string
  params: Record<string, unknown>
}

const TABLE_NAME = process.env.HEYGEN_VIDEOS_TABLE

export const enqueueHandler = async (
  event: APIGatewayProxyEvent,
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
    const videoId = uuidv4()
    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: { S: `PROJECT#${video.projectId}` },
          sk: { S: `VIDEO#${videoId}` },
          status: { S: "pending" },
          attempts: { N: "0" },
          callbackUrl: { S: video.callbackUrl },
          params: { S: JSON.stringify(video.params) },
          createdAt: { S: now },
          updatedAt: { S: now },
        },
      }),
    )
  }
  // Appel direct du worker pour lancer le traitement immédiatement
  try {
    await workerHandler()
  } catch (err) {
    console.error("Could not trigger worker immediately:", err)
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Enqueued!", count: videos.length }),
  }
}

const MAX_CONCURRENCY = parseInt(process.env.HEYGEN_MAX_CONCURRENCY ?? "1", 10)
const MAX_RETRIES = parseInt(process.env.HEYGEN_MAX_RETRIES ?? "3", 10)
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
const HEYGEN_API_URL = "https://api.heygen.com/v2/video/generate"
const HEYGEN_STATUS_URL = "https://api.heygen.com/v1/video_status.get"

export const workerHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("HEYGEN_VIDEOS_TABLE not set")
  // 1. Get all videos with status = 'pending'
  const client = new DynamoDBClient({})
  const pendingRes = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#status = :pending",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":pending": { S: "pending" } },
    }),
  )
  const pendingVideos = pendingRes.Items ?? []

  // 2. Get all videos with status = 'processing'
  const processingRes = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#status = :processing",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":processing": { S: "processing" } },
    }),
  )
  const processingCount = (processingRes.Items ?? []).length
  const availableSlots = Math.max(0, MAX_CONCURRENCY - processingCount)
  if (availableSlots === 0) return

  // 3. Launch up to availableSlots videos
  const toLaunch = pendingVideos.slice(0, availableSlots)
  const now = new Date().toISOString()
  for (const item of toLaunch) {
    const projectId = item.pk.S?.replace("PROJECT#", "") ?? ""
    const videoId = item.sk.S?.replace("VIDEO#", "") ?? ""
    const params = item.params?.S ? JSON.parse(item.params.S) : {}
    const attempts = parseInt(item.attempts?.N ?? "0", 10)
    const callbackUrl = item.callbackUrl?.S ?? ""
    // API key: params.apiKey > env
    const apiKey = params.apiKey || HEYGEN_API_KEY
    if (!apiKey) continue

    // Build HeyGen payload
    const payload = {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: params.avatar_id,
            avatar_style: params.avatar_style ?? "normal",
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
        width: params.width ?? 1280,
        height: params.height ?? 720,
      },
    }
    let heygenId = ""
    let failed = false
    try {
      const res = await fetch(HEYGEN_API_URL, {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      type HeygenResponse = { data?: { video_id?: string } }
      const data = (await res.json()) as HeygenResponse
      if (!res.ok || !data.data?.video_id) {
        failed = true
      } else {
        heygenId = data.data.video_id
      }
    } catch {
      failed = true
    }
    // Update DynamoDB
    const pk = item.pk?.S ?? ""
    const sk = item.sk?.S ?? ""
    if (!pk || !sk) continue
    if (failed) {
      const newAttempts = attempts + 1
      await client.send(
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: { pk: { S: pk }, sk: { S: sk } },
          UpdateExpression:
            "SET #attempts = :a, #updatedAt = :u" +
            (newAttempts >= MAX_RETRIES ? ", #status = :f" : ""),
          ExpressionAttributeNames: {
            "#attempts": "attempts",
            "#updatedAt": "updatedAt",
            ...(newAttempts >= MAX_RETRIES ? { "#status": "status" } : {}),
          },
          ExpressionAttributeValues: {
            ":a": { N: newAttempts.toString() },
            ":u": { S: now },
            ...(newAttempts >= MAX_RETRIES ? { ":f": { S: "failed" } } : {}),
          },
        }),
      )
      continue
    }
    // Success: set to processing
    await client.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: { pk: { S: pk }, sk: { S: sk } },
        UpdateExpression:
          "SET #status = :p, #heygenId = :h, #attempts = :a, #updatedAt = :u",
        ExpressionAttributeNames: {
          "#status": "status",
          "#heygenId": "heygenId",
          "#attempts": "attempts",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":p": { S: "processing" },
          ":h": { S: heygenId },
          ":a": { N: (attempts + 1).toString() },
          ":u": { S: now },
        },
      }),
    )
  }
}

export const workerHttpHandler = async (
  event: APIGatewayProxyEvent,
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
  client: DynamoDBClient,
): Promise<{ allReady: boolean; callbackUrl?: string; videos: any[] }> => {
  if (!TABLE_NAME) throw new Error("HEYGEN_VIDEOS_TABLE not set")
  const res = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "pk" },
      ExpressionAttributeValues: { ":pk": { S: `PROJECT#${projectId}` } },
    }),
  )
  const items = res.Items ?? []
  const allReady =
    items.length > 0 && items.every((item) => item.status?.S === "ready")
  const callbackUrl = items[0]?.callbackUrl?.S
  // Map videos to a clean array
  const videos = items.map((item) => ({
    videoId: item.sk?.S?.replace("VIDEO#", ""),
    heygenId: item.heygenId?.S,
    status: item.status?.S,
    attempts: parseInt(item.attempts?.N ?? "0", 10),
    params: item.params?.S ? JSON.parse(item.params.S) : {},
    createdAt: item.createdAt?.S,
    updatedAt: item.updatedAt?.S,
    heygenData: item.heygenData?.S ? JSON.parse(item.heygenData.S) : null,
  }))
  return { allReady, callbackUrl, videos }
}

export const pollHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("HEYGEN_VIDEOS_TABLE not set")
  const client = new DynamoDBClient({})
  // 1. Get all videos with status = 'processing'
  const processingRes = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#status = :processing",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":processing": { S: "processing" } },
    }),
  )
  const processingVideos = processingRes.Items ?? []
  const now = new Date().toISOString()
  const completedProjects = new Set<string>()
  for (const item of processingVideos) {
    const projectId = item.pk.S?.replace("PROJECT#", "") ?? ""
    const videoId = item.sk.S?.replace("VIDEO#", "") ?? ""
    const heygenId = item.heygenId?.S
    const params = item.params?.S ? JSON.parse(item.params.S) : {}
    const attempts = parseInt(item.attempts?.N ?? "0", 10)
    const callbackUrl = item.callbackUrl?.S ?? ""
    const apiKey = params.apiKey || HEYGEN_API_KEY
    const pk = item.pk?.S ?? ""
    const sk = item.sk?.S ?? ""
    if (!heygenId || !apiKey || !pk || !sk) continue
    // 2. Call HeyGen status API
    let status: string | undefined
    let heygenData: any = null
    try {
      const res = await fetch(`${HEYGEN_STATUS_URL}?video_id=${heygenId}`, {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
          Accept: "application/json",
        },
      })
      const data = (await res.json()) as { data?: any }
      status = data.data?.status
      heygenData = data.data ?? null
    } catch {
      // ignore error, will retry next poll
      continue
    }
    if (status === "completed") {
      // 3. Mark video as ready and store heygenData
      await client.send(
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: { pk: { S: pk }, sk: { S: sk } },
          UpdateExpression:
            "SET #status = :r, #updatedAt = :u, #heygenData = :d",
          ExpressionAttributeNames: {
            "#status": "status",
            "#updatedAt": "updatedAt",
            "#heygenData": "heygenData",
          },
          ExpressionAttributeValues: {
            ":r": { S: "ready" },
            ":u": { S: now },
            ":d": { S: JSON.stringify(heygenData) },
          },
        }),
      )
      // 4. Check if all videos for the project are ready
      if (!completedProjects.has(projectId)) {
        const {
          allReady,
          callbackUrl: cb,
          videos,
        } = await checkCompletion(projectId, client)
        if (allReady && cb) {
          completedProjects.add(projectId)
          // 5. Call callbackUrl
          try {
            await fetch(cb, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ projectId, videos }),
            })
          } catch {}
        }
      }
    } else if (status === "failed") {
      const newAttempts = attempts + 1
      await client.send(
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: { pk: { S: pk }, sk: { S: sk } },
          UpdateExpression:
            "SET #attempts = :a, #updatedAt = :u" +
            (newAttempts >= MAX_RETRIES ? ", #status = :f" : ", #status = :p"),
          ExpressionAttributeNames: {
            "#attempts": "attempts",
            "#updatedAt": "updatedAt",
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":a": { N: newAttempts.toString() },
            ":u": { S: now },
            ":f": { S: "failed" },
            ":p": { S: "pending" },
          },
        }),
      )
    }
    // else: still processing, do nothing
  }
  // Ajout : relancer le worker après chaque polling
  try {
    await workerHandler()
  } catch (err) {
    console.error("Could not trigger worker after polling:", err)
  }
}

export const pollHttpHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    await pollHandler()
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "pollHandler triggered" }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: (error as Error).message }),
    }
  }
}
