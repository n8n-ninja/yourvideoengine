import {
  polling
} from "./chunk-4CSKVH7P.js";

// src/workflows/runway-workflow.ts
import { proxyActivities, sleep } from "@temporalio/workflow";
var { startRunway } = proxyActivities({
  taskQueue: "runway-queue",
  startToCloseTimeout: "2 minutes",
  retry: {
    maximumAttempts: 1
  }
});
var { checkRunwayStatus } = proxyActivities({
  taskQueue: "runway-queue",
  startToCloseTimeout: "1 minute",
  retry: {
    maximumAttempts: 5,
    initialInterval: "10s",
    backoffCoefficient: 2,
    maximumInterval: "1m",
    nonRetryableErrorTypes: ["ApplicationFailure"]
  }
});
async function runwayWorkflow(params) {
  const { externalId } = await startRunway(params);
  const res = await polling({
    checkFn: () => checkRunwayStatus(externalId),
    isDone: (r) => r.status === "ready" && !!r.returnData?.url,
    isFailed: (r) => r.status === "failed",
    maxAttempts: 60,
    intervalMs: 1e4,
    sleepFn: sleep
  });
  if (res.status === "ready" && res.returnData?.url) {
    return { url: res.returnData.url };
  }
  if (res.status === "failed") {
    return { error: res.returnData?.error || "Runway failed" };
  }
  throw new Error("\u23F0 Runway not ready after max polling attempts");
}

export {
  runwayWorkflow
};
