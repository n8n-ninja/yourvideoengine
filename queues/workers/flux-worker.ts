import { Job } from "../models/job"
import { WorkerResult } from "../orchestrator/queue-orchestrator"

const FLUX_API_KEY = process.env.FLUX_API_KEY!
const FLUX_API_URL = "https://api.piapi.ai/api/v1/task"
const FLUX_STATUS_URL = "https://api.piapi.ai/api/v1/task" // GET /:task_id

export const fluxWorker = async (job: Job): Promise<WorkerResult> => {
  const params = job.inputData
  // Required: model, task_type, input (prompt, width, height, ...)
  const inputData = {
    model: params.model || "Qubico/flux1-dev",
    task_type: params.task_type || "txt2img",
    input: params.input,
    ...(params.negative_prompt
      ? { negative_prompt: params.negative_prompt }
      : {}),
    ...(params.denoise ? { denoise: params.denoise } : {}),
    ...(params.guidance_scale ? { guidance_scale: params.guidance_scale } : {}),
    ...(params.width ? { width: params.width } : {}),
    ...(params.height ? { height: params.height } : {}),
    ...(params.batch_size ? { batch_size: params.batch_size } : {}),
    ...(params.lora_settings ? { lora_settings: params.lora_settings } : {}),
    ...(params.control_net_settings
      ? { control_net_settings: params.control_net_settings }
      : {}),
    ...(params.config ? { config: params.config } : {}),
    ...(params.webhook_config ? { webhook_config: params.webhook_config } : {}),
    ...(params.service_mode ? { service_mode: params.service_mode } : {}),
  }
  try {
    console.log("[fluxWorker] Calling PiAPI Flux API", FLUX_API_URL, inputData)
    const res = await fetch(FLUX_API_URL, {
      method: "POST",
      headers: {
        "X-API-Key": FLUX_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
    const data: any = await res.json()
    // Gestion des erreurs HTTP ou API
    if (!res.ok || data.code >= 400) {
      return {
        status: "failed",
        outputData: data,
        returnData: { error: data.message || `HTTP error ${res.status}` },
      }
    }
    if (!data.data?.task_id) {
      console.log("[fluxWorker] No task_id returned", data)
      return {
        status: "failed",
        outputData: data,
        returnData: { error: "No task_id returned" },
      }
    }
    if (data.data.status === "failed") {
      return {
        status: "failed",
        outputData: data,
        returnData: {
          error: data.message || "Flux API returned failed status",
        },
      }
    }
    console.log("[fluxWorker] Job launched, task_id:", data.data.task_id)
    return {
      status: "processing",
      outputData: data,
      returnData: undefined,
      externalId: data.data.task_id,
    }
  } catch (error) {
    return {
      status: "failed",
      outputData: {},
      returnData: { error: (error as Error).message },
    }
  }
}

export const fluxPollWorker = async (
  externalId: string,
): Promise<WorkerResult> => {
  try {
    const url = `${FLUX_STATUS_URL}/${externalId}`
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": FLUX_API_KEY,
        Accept: "application/json",
      },
    })
    const data: any = await res.json()
    const status = data.data.status
    if (status === "completed") {
      return {
        status: "ready",
        outputData: data,
        returnData: data.data?.output || undefined,
      }
    } else if (status === "failed") {
      return {
        status: "failed",
        outputData: data,
        returnData: { error: "Flux processing failed" },
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
