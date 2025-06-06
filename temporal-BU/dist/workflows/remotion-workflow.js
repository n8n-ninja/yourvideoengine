import { proxyActivities, sleep } from "@temporalio/workflow";
import { polling } from "../polling-helper";
const { startRemotion } = proxyActivities({
    taskQueue: "remotion-queue",
    startToCloseTimeout: "2 minutes",
    retry: {
        maximumAttempts: 1,
    },
});
const { checkRemotionStatus } = proxyActivities({
    taskQueue: "remotion-queue",
    startToCloseTimeout: "1 minute",
    retry: {
        maximumAttempts: 5,
        initialInterval: "10s",
        backoffCoefficient: 2,
        maximumInterval: "1m",
        nonRetryableErrorTypes: ["ApplicationFailure"],
    },
});
export async function remotionWorkflow(params) {
    const { renderId, bucketName } = await startRemotion(params);
    const res = await polling({
        checkFn: () => checkRemotionStatus(renderId, bucketName),
        isDone: (r) => r.status === "done" && !!r.url,
        isFailed: (r) => r.status === "failed",
        onError: (err) => {
            return ((err?.type === "ApplicationFailure" ||
                err?.name === "ApplicationFailure") &&
                err?.nonRetryable === true);
        },
        maxAttempts: 100,
        intervalMs: 10000,
        sleepFn: sleep,
    });
    if (res.status === "done" && res.url) {
        return { videoUrl: res.url };
    }
    throw new Error("⏰ Video not ready after max polling attempts");
}
