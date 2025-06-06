import "dotenv/config";
import { Worker } from "@temporalio/worker";
async function run() {
    const worker = await Worker.create({
        workflowsPath: new URL("../workflows", import.meta.url).pathname,
        taskQueue: "main",
    });
    await worker.run();
}
run().catch((err) => {
    process.exit(1);
});
