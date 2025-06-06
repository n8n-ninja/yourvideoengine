import { proxyActivities, sleep } from "@temporalio/workflow";
import { polling } from "../polling-helper";
const { startRunway } = proxyActivities({
    taskQueue: "runway-queue",
    startToCloseTimeout: "2 minutes",
    retry: {
        maximumAttempts: 1,
    },
});
const { checkRunwayStatus } = proxyActivities({
    taskQueue: "runway-queue",
    startToCloseTimeout: "1 minute",
    retry: {
        maximumAttempts: 5,
        initialInterval: "10s",
        backoffCoefficient: 2,
        maximumInterval: "1m",
        nonRetryableErrorTypes: ["ApplicationFailure"],
    },
});
export async function runwayWorkflow(params) {
    const { externalId } = await startRunway(params);
    const res = await polling({
        checkFn: () => checkRunwayStatus(externalId),
        isDone: (r) => r.status === "ready" && !!r.returnData?.url,
        isFailed: (r) => r.status === "failed",
        maxAttempts: 60,
        intervalMs: 10000,
        sleepFn: sleep,
    });
    if (res.status === "ready" && res.returnData?.url) {
        return { url: res.returnData.url };
    }
    if (res.status === "failed") {
        return { error: res.returnData?.error || "Runway failed" };
    }
    throw new Error("⏰ Runway not ready after max polling attempts");
}
