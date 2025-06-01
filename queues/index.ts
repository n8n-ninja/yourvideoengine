import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { v4 as uuidv4 } from "uuid"
import { processAllJobs } from "./handlers/process-all-jobs"
import { JobRepository } from "./repository/job-repository"
import { Job } from "./models/job"

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
  const now = new Date().toISOString()
  for (const video of videos) {
    if (!validateEnqueueVideoInput(video)) {
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
    await JobRepository.addJob(job)
  }
  // Optionnel: trigger immédiat du worker (sinon laisser le cron faire)
  // await processAllJobs()
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Enqueued!", count: videos.length }),
  }
}

export const workerHttpHandler = async (): Promise<void> => {
  await processAllJobs()
}
