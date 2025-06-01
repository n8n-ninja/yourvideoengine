import { Job } from "../models/job"
import { WorkerResult } from "../orchestrator/queue-orchestrator"

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY!
const HEYGEN_RENDER_URL = process.env.HEYGEN_RENDER_URL!
const HEYGEN_STATUS_URL = process.env.HEYGEN_STATUS_URL!

export const heygenWorker = async (job: Job): Promise<WorkerResult> => {
  const params = job.inputData
  const inputData = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: params.avatar_id,
          avatar_style: "normal",
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
      width: params.width ?? 1080,
      height: params.height ?? 1920,
    },
  }
  try {
    console.log(
      "[heygenWorker] Calling Heygen API",
      HEYGEN_RENDER_URL,
      inputData
    )
    const res = await fetch(HEYGEN_RENDER_URL, {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
    const data: any = await res.json()
    console.log("[heygenWorker] API response", data)
    if (!data.data?.video_id) {
      console.log("[heygenWorker] No video_id returned", data)
      return {
        status: "failed",
        outputData: data,
        returnData: { error: "No video_id returned" },
      }
    }
    console.log("[heygenWorker] Job launched, video_id:", data.data.video_id)
    return {
      status: "processing",
      outputData: data,
      returnData: undefined,
      externalId: data.data.video_id,
    }
  } catch (error) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: (error as Error).message },
    }
  }
}

export const heygenPollWorker = async (
  externalId: string
): Promise<WorkerResult> => {
  try {
    const res = await fetch(`${HEYGEN_STATUS_URL}?video_id=${externalId}`, {
      method: "GET",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        Accept: "application/json",
      },
    })
    const data: any = await res.json()
    if (data.data.status === "completed") {
      return {
        status: "ready",
        outputData: data,
        returnData: data.data?.video_url
          ? { url: data.data.video_url, duration: data.data.duration }
          : undefined,
      }
    } else if (data.data.status === "failed") {
      return {
        status: "failed",
        outputData: data,
        returnData: { error: "Video processing failed" },
      }
    } else {
      return {
        status: "processing",
        outputData: data,
        returnData: undefined,
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
