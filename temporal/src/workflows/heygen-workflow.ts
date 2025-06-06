import {
  ApplicationFailure,
  proxyActivities,
  sleep,
} from "@temporalio/workflow"
import type * as heygenActivities from "../activities/heygen-activity"
import { polling } from "../polling-helper"

const { startHeygen } = proxyActivities<typeof heygenActivities>({
  taskQueue: "heygen-queue",
  startToCloseTimeout: "2 minutes",
  retry: {
    maximumAttempts: 1,
  },
})

const { checkHeygenStatus } = proxyActivities<typeof heygenActivities>({
  taskQueue: "heygen-queue",
  startToCloseTimeout: "1 minute",
  retry: {
    maximumAttempts: 1,
    initialInterval: "10s",
    backoffCoefficient: 2,
    maximumInterval: "1m",
    nonRetryableErrorTypes: ["InsufficientCreditError"],
  },
})

export interface HeygenWorkflowParams {
  script: string
  avatar_id: string
  voice_id: string
  language?: string
  style?: string
  speed?: number
}

export interface HeygenWorkflowResult {
  videoUrl: string
  duration: number
}

export async function heygenWorkflow(
  params: HeygenWorkflowParams,
): Promise<HeygenWorkflowResult> {
  const { videoId } = await startHeygen(params)

  const res = await polling({
    checkFn: () => checkHeygenStatus(videoId),
    isDone: (r) => r.status === "done" && !!r.url,
    onError: (err) => err.cause && err.cause.nonRetryable === true,
    maxAttempts: 30,
    intervalMs: 10_000,
    sleepFn: sleep,
  })

  if (res.status === "done" && res.url && res.duration) {
    return { videoUrl: res.url, duration: res.duration }
  }
  throw new Error("⏰ Video not ready after max polling attempts")
}

function extractMessage(err: any): string {
  return (
    err?.cause?.message?.toLowerCase?.() ??
    err?.message?.toLowerCase?.() ??
    JSON.stringify(err).toLowerCase()
  )
}
