import { Connection, Client } from "@temporalio/client"
import { fluxWorkflow } from "./workflows/flux-workflow"

async function main() {
  const connection = await Connection.connect()
  const client = new Client({ connection })

  const handle = await client.workflow.start(fluxWorkflow, {
    args: [
      {
        input: {
          prompt:
            "A futuristic cityscape at sunset, vibrant colors, high detail",
        },
        width: 512,
        height: 512,
        task_type: "txt2img",
      },
    ],
    taskQueue: "flux-queue",
    workflowId: `flux-${Date.now()}`,
  })

  console.log("🌀 Workflow Flux lancé, attente du résultat...")
  try {
    const result = await handle.result()
    console.log("✅ Résultat :", result)
  } catch (err) {
    console.error("❌ Workflow Flux a échoué :", err)
  }
}

main().catch(console.error)
