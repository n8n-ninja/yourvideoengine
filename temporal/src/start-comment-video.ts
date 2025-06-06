import { Connection, Client } from "@temporalio/client"
import { commentVideoWorkflow } from "./workflows/comment-video-workflow"

async function main() {
  const connection = await Connection.connect()
  const client = new Client({ connection })

  const handle = await client.workflow.start(commentVideoWorkflow, {
    args: [
      {
        hook: "A próxima geração de autores… nem é humana.",
        backgroundUrl:
          "https://fynsadrjafvxmynpmexz.supabase.co/storage/v1/object/public/yourvideoengines-upload/thais-id/1749084040391-claude.mp4",
        color: "#2cc421",
        position: "center",
        size: "medium",
        script:
          "A Anthropic vient de mettre Claude comme auteur officiel du blog.",
        avatar_id: "f2ae650f1f8648a09b1809bef5480fd8",
        voice_id: "0e6ef9dc61bf47c7a507bb4f15c74ebc",
      },
    ],
    taskQueue: "main",
    workflowId: `comment-video-${Date.now()}`,
  })

  console.log("🌀 Workflow CommentVideo lancé, attente du résultat...")
  try {
    const result = await handle.result()
    console.log("✅ Résultat :", result)
  } catch (err) {
    console.error("❌ Workflow CommentVideo a échoué :", err)
  }
}

main().catch(console.error)
