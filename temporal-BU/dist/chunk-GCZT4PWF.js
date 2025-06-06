// src/workflows/deepgram-workflow.ts
import { proxyActivities } from "@temporalio/workflow";
var { runDeepgram } = proxyActivities({
  taskQueue: "deepgram-queue",
  startToCloseTimeout: "5 minutes",
  // adapte selon la durée max d'une transcription
  retry: {
    maximumAttempts: 3,
    initialInterval: "5s",
    backoffCoefficient: 2,
    maximumInterval: "1m"
  }
});
async function deepgramWorkflow(params) {
  console.log("\u{1F7E1} Avant runDeepgram");
  const { captions } = await runDeepgram(params);
  console.log("\u{1F7E2} Apr\xE8s runDeepgram", captions);
  return {
    transcript: captions.transcript,
    keywordsDetected: captions.words.map((word) => word.word)
  };
}

export {
  deepgramWorkflow
};
