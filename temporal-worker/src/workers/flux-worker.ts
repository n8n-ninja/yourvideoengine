import "dotenv/config"
import { Worker } from "@temporalio/worker"
import { startFlux, checkFluxStatus } from "../activities/flux-activity"

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("../workflows"),
    activities: {
      startFlux,
      checkFluxStatus,
    },
    taskQueue: "flux-queue",
    maxConcurrentActivityTaskExecutions: 1,
  })

  console.log("🚀 Worker Flux lancé ")
  await worker.run()
}

run().catch((err) => {
  console.error("❌ Erreur dans le worker Flux", err)
  process.exit(1)
})
