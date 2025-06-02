import { Job } from "../models/job"
import { WorkerResult } from "../orchestrator/queue-orchestrator"
import RunwayML from "@runwayml/sdk"

const RUNWAYML_API_KEY = process.env.RUNWAYML_API_KEY!

const client = new RunwayML({
  apiKey: RUNWAYML_API_KEY,
})

export const runwayWorker = async (job: Job): Promise<WorkerResult> => {
  const params = job.inputData
  const prompt = params.prompt
  const imageUrl = params.imageUrl
  const duration = params.duration || 5
  const ratio = params.ratio || "720:1280"

  if (!prompt || !imageUrl) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: "Missing prompt or imageUrl" },
    }
  }

  try {
    const task = await client.imageToVideo.create({
      model: "gen4_turbo",
      promptImage: imageUrl,
      promptText: prompt,
      ratio,
      duration,
    })
    if (!task.id) {
      return {
        status: "failed",
        outputData: task,
        returnData: { error: "No task id returned" },
      }
    }
    return {
      status: "processing",
      outputData: task,
      externalId: task.id,
    }
  } catch (error: any) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: error.message },
    }
  }
}

export const runwayPollWorker = async (
  externalId: string,
): Promise<WorkerResult> => {
  try {
    const task = await client.tasks.retrieve(externalId)
    if (task.status === "SUCCEEDED") {
      return {
        status: "ready",
        outputData: task,
        returnData: { url: task.output?.[0] },
      }
    } else if (task.status === "FAILED") {
      return {
        status: "failed",
        outputData: task,
        returnData: { error: "Runway processing failed" },
      }
    } else {
      return {
        status: "processing",
        outputData: task,
      }
    }
  } catch (error: any) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: error.message },
    }
  }
}
