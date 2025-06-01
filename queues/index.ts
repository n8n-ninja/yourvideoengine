import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { v4 as uuidv4 } from "uuid"
import { processAllJobs } from "./handlers/process-all-jobs"
import { JobRepository } from "./repository/job-repository"
import { Job } from "./models/job"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

interface EnqueueVideoInput {
  projectId: string
  clientId: string
  callbackUrl: string
  params: Record<string, unknown>
  slug?: string
  queueType?: string
}

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

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL!
const sqsClient = new SQSClient({})

export const enqueueHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("[enqueueHandler] called")
  if (!event.body) {
    console.log("[enqueueHandler] Missing body")
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing body" }),
    }
  }
  let videos: EnqueueVideoInput[] = []
  try {
    const parsed = JSON.parse(event.body)
    if (!Array.isArray(parsed)) {
      console.log("[enqueueHandler] Body must be an array of jobs")
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Body must be an array of jobs" }),
      }
    }
    videos = parsed
  } catch {
    console.log("[enqueueHandler] Invalid JSON")
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    }
  }
  const now = new Date().toISOString()
  let enqueued = 0
  for (const [i, video] of videos.entries()) {
    if (!validateEnqueueVideoInput(video)) {
      console.log("[enqueueHandler] Invalid video input", video)
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid video input" }),
      }
    }
    if (!video.queueType) {
      console.log("[enqueueHandler] Missing queueType", video)
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing queueType in job" }),
      }
    }
    // Envoie le job dans la SQS
    const jobPayload = {
      ...video,
      createdAt: now,
      updatedAt: now,
      batchIndex: i,
    }
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        MessageBody: JSON.stringify(jobPayload),
      })
    )
    enqueued++
  }
  console.log(`[enqueueHandler] All jobs enqueued in SQS: ${enqueued}`)
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Enqueued!", count: enqueued }),
  }
}

// Nouveau handler Lambda pour SQS
export const jobWorker = async (event: any) => {
  for (const [i, record] of event.Records.entries()) {
    const jobData = JSON.parse(record.body)
    // Création du job complet (avec jobId, status, etc)
    const videoId = uuidv4()
    const now = new Date().toISOString()
    const job: Job = {
      jobId: videoId,
      projectId: jobData.projectId,
      clientId: jobData.clientId,
      status: "pending",
      attempts: 0,
      inputData: jobData.params,
      outputData: {},
      returnData: undefined,
      queueType: jobData.queueType,
      callbackUrl: jobData.callbackUrl,
      createdAt: now,
      updatedAt: now,
      batchIndex: jobData.batchIndex ?? i,
    }
    console.log("[jobWorker] Adding job to DB", job)
    await JobRepository.addJob(job)
    // Lance le traitement (option: processAllJobs ou processJob direct)
    await processAllJobs()
  }
}

export { processAllJobs } from "./handlers/process-all-jobs"
