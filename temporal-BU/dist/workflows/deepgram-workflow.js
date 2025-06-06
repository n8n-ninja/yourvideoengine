import { proxyActivities } from "@temporalio/workflow";
const { runDeepgram } = proxyActivities({
    taskQueue: "deepgram-queue",
    startToCloseTimeout: "5 minutes", // adapte selon la durée max d'une transcription
    retry: {
        maximumAttempts: 3,
        initialInterval: "5s",
        backoffCoefficient: 2,
        maximumInterval: "1m",
    },
});
export async function deepgramWorkflow(params) {
    console.log("🟡 Avant runDeepgram");
    const { captions } = await runDeepgram(params);
    console.log("🟢 Après runDeepgram", captions);
    return {
        transcript: captions.transcript,
        keywordsDetected: captions.words.map((word) => word.word),
    };
}
