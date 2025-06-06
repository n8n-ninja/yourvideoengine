import "dotenv/config";
import { Worker } from "@temporalio/worker";
import { startRemotion, checkRemotionStatus, } from "../activities/remotion-activity";
async function run() {
    const worker = await Worker.create({
        workflowsPath: new URL("../workflows", import.meta.url).pathname,
        activities: {
            startRemotion,
            checkRemotionStatus,
        },
        taskQueue: "remotion-queue",
        maxConcurrentActivityTaskExecutions: 1,
    });
    console.log("🚀 Worker Remotion lancé ");
    await worker.run();
}
run().catch((err) => {
    console.error("❌ Erreur dans le worker Remotion", err);
    process.exit(1);
});
