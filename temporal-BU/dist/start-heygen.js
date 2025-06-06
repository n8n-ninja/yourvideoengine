import { Connection, Client } from "@temporalio/client";
import { heygenWorkflow } from "./workflows/heygen-workflow";
async function main() {
    const connection = await Connection.connect();
    const client = new Client({ connection });
    const handle = await client.workflow.start(heygenWorkflow, {
        args: [
            {
                script: "Bonjour, ceci est une vidéo IA.",
                avatar_id: "f2ae650f1f8648a09b1809bef5480fd8",
                voice_id: "0e6ef9dc61bf47c7a507bb4f15c74ebc",
                language: "fr",
            },
        ],
        taskQueue: "main",
        workflowId: `heygen-${Date.now()}`,
    });
    console.log("🌀 Workflow lancé, attente du résultat...");
    try {
        const result = await handle.result();
        console.log("✅ Résultat :", result);
    }
    catch (err) {
        console.error("❌ Workflow a échoué :", err);
    }
}
main().catch(console.error);
