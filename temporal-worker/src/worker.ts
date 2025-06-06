import { Worker, NativeConnection } from "@temporalio/worker"
import * as activities from "./activities"
import * as workflows from "./workflows"

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || "",
    tls: {},
  })

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows"),
    activities,
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || "default",
  })

  await worker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
