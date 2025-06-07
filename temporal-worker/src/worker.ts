import dotenv from "dotenv"
import { Worker, NativeConnection } from "@temporalio/worker"
import * as activities from "./activities"

dotenv.config()

async function run() {
  console.log(process.env.TEMPORAL_ADDRESS)
  console.log(process.env.TEMPORAL_TASK_QUEUE)
  console.log(process.env.TEMPORAL_NAMESPACE)
  console.log(process.env.TEMPORAL_API_KEY)

  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS,
    tls: {},
    apiKey: process.env.TEMPORAL_API_KEY,
  })

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows"),
    activities,
    taskQueue: process.env.TEMPORAL_TASK_QUEUE!,
    namespace: process.env.TEMPORAL_NAMESPACE,
  })

  await worker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
