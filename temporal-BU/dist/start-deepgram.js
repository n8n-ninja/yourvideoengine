import { Connection, Client } from "@temporalio/client";
import { deepgramWorkflow } from "./workflows/deepgram-workflow";
async function main() {
    const connection = await Connection.connect();
    const client = new Client({ connection });
    const handle = await client.workflow.start(deepgramWorkflow, {
        args: [
            {
                videoUrl: "https://files2.heygen.ai/aws_pacific/avatar_tmp/c330096d4fe2412196a174937603458f/a5554f3f1011496baf0506de88fe4c0c.mp4?Expires=1749661566&Signature=kpIfWS8U6p3w7WBW6PkrJYZyXh8476940Qe2HKBn8JjDRFUYfEe0EPJFEHrsbB27LqZ0kjHWhG2Lsw-O3kydpNvYOo7FUhl517xBYktvmv3RcfrDD2zo40-RA9MEBpwxsi6JQxA2NyAe91OripGxb41wGAVdO9i5~fNUzVQkE93VvOogkPX8GGVXoJHfxQy~w0j8l2ss222I8LqwutI9nQMUvG6mN0ZHfJb9iJv~DtYvwqtImnmOcFGo6QwgOU3uzBG6cYx-iumr6rpSeD3SDmCd8yHj8jQPTTnn-iZqOwsOE8oLaEYdLjTTVOcNGTJCJ2g4I0kH0R1mExMW5eXy0w__&Key-Pair-Id=K38HBHX5LX3X2H",
                language: "en",
                model: "nova-3",
                punctuate: false,
                keywords: ["deepgram", "nova-3"],
            },
        ],
        taskQueue: "deepgram-queue",
        workflowId: `deepgram-${Date.now()}`,
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
