import {
  polling
} from "./chunk-4CSKVH7P.js";

// src/workflows/heygen-workflow.ts
import {
  proxyActivities,
  sleep
} from "@temporalio/workflow";
var { startHeygen } = proxyActivities({
  taskQueue: "heygen-queue",
  startToCloseTimeout: "2 minutes",
  retry: {
    maximumAttempts: 1
  }
});
var { checkHeygenStatus } = proxyActivities({
  taskQueue: "heygen-queue",
  startToCloseTimeout: "1 minute",
  retry: {
    maximumAttempts: 1,
    initialInterval: "10s",
    backoffCoefficient: 2,
    maximumInterval: "1m",
    nonRetryableErrorTypes: ["InsufficientCreditError"]
  }
});
async function heygenWorkflow(params) {
  const { videoId } = await startHeygen(params);
  const res = await polling({
    checkFn: () => checkHeygenStatus(videoId),
    isDone: (r) => r.status === "done" && !!r.url,
    onError: (err) => err.cause && err.cause.nonRetryable === true,
    maxAttempts: 30,
    intervalMs: 1e4,
    sleepFn: sleep
  });
  if (res.status === "done" && res.url && res.duration) {
    return { videoUrl: res.url, duration: res.duration };
  }
  throw new Error("\u23F0 Video not ready after max polling attempts");
}

export {
  heygenWorkflow
};
