import { Connection, Client } from "@temporalio/client";
import { runwayWorkflow } from "./workflows/runway-workflow";
async function main() {
    const connection = await Connection.connect();
    const client = new Client({ connection });
    const handle = await client.workflow.start(runwayWorkflow, {
        args: [
            {
                prompt: "A cat astronaut, cinematic, trending on artstation",
                imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=512&h=512&q=80",
                duration: 5,
                ratio: "720:1280",
                model: "gen4_turbo",
            },
        ],
        taskQueue: "runway-queue",
        workflowId: `runway-${Date.now()}`,
    });
    console.log("🌀 Workflow Runway lancé, attente du résultat...");
    try {
        const result = await handle.result();
        console.log("✅ Résultat :", result);
    }
    catch (err) {
        console.error("❌ Workflow Runway a échoué :", err);
    }
}
main().catch(console.error);
