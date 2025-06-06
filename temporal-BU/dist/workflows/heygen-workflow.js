import { proxyActivities, sleep, } from "@temporalio/workflow";
import { polling } from "../polling-helper";
const { startHeygen } = proxyActivities({
    taskQueue: "heygen-queue",
    startToCloseTimeout: "2 minutes",
    retry: {
        maximumAttempts: 1,
    },
});
const { checkHeygenStatus } = proxyActivities({
    taskQueue: "heygen-queue",
    startToCloseTimeout: "1 minute",
    retry: {
        maximumAttempts: 1,
        initialInterval: "10s",
        backoffCoefficient: 2,
        maximumInterval: "1m",
        nonRetryableErrorTypes: ["InsufficientCreditError"],
    },
});
export async function heygenWorkflow(params) {
    const { videoId } = await startHeygen(params);
    const res = await polling({
        checkFn: () => checkHeygenStatus(videoId),
        isDone: (r) => r.status === "done" && !!r.url,
        onError: (err) => err.cause && err.cause.nonRetryable === true,
        maxAttempts: 30,
        intervalMs: 10000,
        sleepFn: sleep,
    });
    if (res.status === "done" && res.url && res.duration) {
        return { videoUrl: res.url, duration: res.duration };
    }
    throw new Error("⏰ Video not ready after max polling attempts");
}
function extractMessage(err) {
    return (err?.cause?.message?.toLowerCase?.() ??
        err?.message?.toLowerCase?.() ??
        JSON.stringify(err).toLowerCase());
}
