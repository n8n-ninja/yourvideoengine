import "dotenv/config"
import { Worker } from "@temporalio/worker"
import { startHeygen, checkHeygenStatus } from "../activities/heygen-activity"

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("../workflows"),
    activities: {
      startHeygen,
      checkHeygenStatus,
    },
    taskQueue: "heygen-queue",
    maxConcurrentActivityTaskExecutions: 3,
  })

  await worker.run()
}

run().catch((err) => {
  process.exit(1)
})
