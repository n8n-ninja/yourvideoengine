import { Connection, Client } from "@temporalio/client"
import dotenv from "dotenv"

dotenv.config()

async function main() {
  console.log(process.env.TEMPORAL_API_KEY)
  console.log(process.env.TEMPORAL_ADDRESS)
  console.log(process.env.TEMPORAL_TASK_QUEUE)

  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS!,
    tls: true,
    apiKey: process.env.TEMPORAL_API_KEY!,
  })

  const client = new Client({
    connection,
    namespace: "default.quickstart-yourvideoengine.qwr30",
  })

  console.log("Connection établie")

  const handle = await client.workflow.start("helloWorkflow", {
    args: ["Manu"],
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || "default",
    workflowId: `wf-${Date.now()}`,
  })

  console.log(handle)

  const result = await handle.result()
  console.log("Résultat :", result)
}

main().catch(console.error)
