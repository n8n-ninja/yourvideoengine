import { Connection, Client } from "@temporalio/client"
import dotenv from "dotenv"

dotenv.config()

async function main() {
  if (
    !process.env.TEMPORAL_ADDRESS ||
    !process.env.TEMPORAL_API_KEY ||
    !process.env.TEMPORAL_NAMESPACE ||
    !process.env.TEMPORAL_TASK_QUEUE
  ) {
    throw new Error("Missing environment variables")
  }

  const {
    TEMPORAL_ADDRESS,
    TEMPORAL_API_KEY,
    TEMPORAL_NAMESPACE,
    TEMPORAL_TASK_QUEUE,
  } = process.env

  const connection = await Connection.connect({
    address: TEMPORAL_ADDRESS,
    tls: true,
    apiKey: TEMPORAL_API_KEY,
  })

  const client = new Client({
    connection,
    namespace: TEMPORAL_NAMESPACE,
  })

  const handle = await client.workflow.start("commentVideoWorkflow", {
    args: ["John"],
    taskQueue: TEMPORAL_TASK_QUEUE,
    workflowId: `wf-${Date.now()}`,
  })

  const result = await handle.result()

  console.log("Résultat :", result)
}

main().catch(console.error)
