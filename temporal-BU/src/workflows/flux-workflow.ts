import { proxyActivities, sleep } from "@temporalio/workflow"
import type * as fluxActivities from "../activities/flux-activity"
import { polling } from "../polling-helper"

const { startFlux } = proxyActivities<typeof fluxActivities>({
  taskQueue: "flux-queue",
  startToCloseTimeout: "2 minutes",
  retry: {
    maximumAttempts: 1,
  },
})

const { checkFluxStatus } = proxyActivities<typeof fluxActivities>({
  taskQueue: "flux-queue",
  startToCloseTimeout: "1 minute",
  retry: {
    maximumAttempts: 5,
    initialInterval: "10s",
    backoffCoefficient: 2,
    maximumInterval: "1m",
    nonRetryableErrorTypes: ["ApplicationFailure"],
  },
})

export interface FluxWorkflowParams {
  model?: string
  task_type?: string
  input: any
  negative_prompt?: string
  denoise?: number
  guidance_scale?: number
  width?: number
  height?: number
  batch_size?: number
  lora_settings?: any
  control_net_settings?: any
  config?: any
  webhook_config?: any
  service_mode?: any
}

export interface FluxWorkflowResult {
  url?: string
  error?: string
}

export async function fluxWorkflow(
  params: FluxWorkflowParams,
): Promise<FluxWorkflowResult> {
  const { externalId } = await startFlux(params)

  const res = await polling({
    checkFn: () => checkFluxStatus(externalId),
    isDone: (r) => r.status === "ready" && !!r.returnData?.url,
    isFailed: (r) => r.status === "failed",
    maxAttempts: 60,
    intervalMs: 10_000,
    sleepFn: sleep,
  })

  if (res.status === "ready" && res.returnData?.url) {
    return { url: res.returnData.url }
  }
  if (res.status === "failed") {
    return { error: res.returnData?.error || "Flux failed" }
  }
  throw new Error("⏰ Flux not ready after max polling attempts")
}
