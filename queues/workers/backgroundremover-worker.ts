import { Job } from "../models/job"
import { WorkerResult } from "../orchestrator/queue-orchestrator"

const SUBMIT_URL = process.env.BACKGROUNDREMOVER_SUBMIT_URL!
const STATUS_URL = process.env.BACKGROUNDREMOVER_STATUS_URL!

export const backgroundRemoverWorker = async (
  job: Job,
): Promise<WorkerResult> => {
  const params = job.inputData
  try {
    // Submit job
    const submitRes = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputUrl: params.inputUrl }),
    })
    const submitData: any = await submitRes.json()
    if (!submitRes.ok || !submitData.jobId) {
      return {
        status: "failed",
        outputData: submitData,
        returnData: { error: submitData.error || "No jobId returned" },
      }
    }
    return {
      status: "processing",
      outputData: submitData,
      externalId: submitData.jobId,
    }
  } catch (error) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: (error as Error).message },
    }
  }
}

export const backgroundRemoverPollWorker = async (
  externalId: string,
): Promise<WorkerResult> => {
  try {
    const res = await fetch(`${STATUS_URL}/${externalId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
    const data: any = await res.json()
    if (data.status === "DONE") {
      return {
        status: "ready",
        outputData: data,
        returnData: data.outputUrl ? { url: data.outputUrl } : undefined,
      }
    } else if (data.status === "ERROR") {
      return {
        status: "failed",
        outputData: data,
        returnData: { error: data.error || "Background remover failed" },
      }
    } else {
      return {
        status: "processing",
        outputData: data,
      }
    }
  } catch (error) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: (error as Error).message },
    }
  }
}
