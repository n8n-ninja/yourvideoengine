import { proxyActivities } from "@temporalio/workflow"
import type * as deepgramActivities from "../activities/deepgram-activity"

const { runDeepgram } = proxyActivities<typeof deepgramActivities>({
  taskQueue: "deepgram-queue",
  startToCloseTimeout: "5 minutes", // adapte selon la durée max d'une transcription
  retry: {
    maximumAttempts: 3,
    initialInterval: "5s",
    backoffCoefficient: 2,
    maximumInterval: "1m",
  },
})

export interface DeepgramWorkflowParams {
  videoUrl: string
  language?: string
  model?: string
  punctuate?: boolean
  keywords?: string[]
}

export interface DeepgramWorkflowResult {
  transcript: string
  keywordsDetected?: string[]
}

export async function deepgramWorkflow(
  params: DeepgramWorkflowParams,
): Promise<DeepgramWorkflowResult> {
  console.log("🟡 Avant runDeepgram")
  const { captions } = await runDeepgram(params)
  console.log("🟢 Après runDeepgram", captions)
  return {
    transcript: captions.transcript,
    keywordsDetected: captions.words.map((word) => word.word),
  }
}
