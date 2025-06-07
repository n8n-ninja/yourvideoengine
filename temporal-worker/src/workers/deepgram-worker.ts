import "dotenv/config"
import { Worker } from "@temporalio/worker"
import { runDeepgram } from "../activities/deepgram-activity"

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("../workflows"),
    activities: {
      runDeepgram,
    },
    taskQueue: "deepgram-queue",
    maxConcurrentActivityTaskExecutions: 3,
  })

  await worker.run()
}

run().catch((err) => {
  process.exit(1)
})
