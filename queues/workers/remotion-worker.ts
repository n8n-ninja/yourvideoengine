import { WorkerResult } from "../orchestrator/queue-orchestrator"
import { Job } from "../models/job"

const REMOTION_RENDER_URL = process.env.REMOTION_RENDER_URL ?? ""
const REMOTION_STATUS_URL = process.env.REMOTION_STATUS_URL ?? ""

export const remotionWorker = async (job: Job): Promise<WorkerResult> => {
  const { inputData } = job
  try {
    const res = await fetch(REMOTION_RENDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData),
    })
    const data = (await res.json()) as any
    if (!data.renderId) {
      return {
        status: "failed",
        outputData: data,
        returnData: { error: "No renderId returned" },
      }
    }
    return {
      status: "processing",
      outputData: data,
      externalId: data.renderId,
    }
  } catch (error) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: (error as Error).message },
    }
  }
}

export const remotionPollWorker = async (
  externalId: string,
  outputData?: any
): Promise<WorkerResult> => {
  try {
    let url = `${REMOTION_STATUS_URL}?renderId=${externalId}`
    const bucketName = outputData?.bucketName
    if (bucketName) {
      url += `&bucketName=${encodeURIComponent(bucketName)}`
    }
    const res = await fetch(url)
    const data = (await res.json()) as any
    let failed = false
    let errorDetails = null
    if (Array.isArray(data.errors) && data.errors.some((e: any) => e.isFatal)) {
      failed = true
      errorDetails = data.errors.filter((e: any) => e.isFatal)
    }
    if (data.done && !failed) {
      return {
        status: "ready",
        outputData: data,
        returnData: data.outputFile ? { url: data.outputFile } : undefined,
      }
    } else if (failed) {
      return {
        status: "failed",
        outputData: { ...data, error: errorDetails },
        returnData: { errors: errorDetails },
      }
    } else {
      return {
        status: "processing",
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
