import "dotenv/config"
import { Worker } from "@temporalio/worker"
import { startRunway, checkRunwayStatus } from "../activities/runway-activity"

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("../workflows"),
    activities: {
      startRunway,
      checkRunwayStatus,
    },
    taskQueue: "runway-queue",
    maxConcurrentActivityTaskExecutions: 1,
  })

  console.log("🚀 Worker Runway lancé ")
  await worker.run()
}

run().catch((err) => {
  console.error("❌ Erreur dans le worker Runway", err)
  process.exit(1)
})
