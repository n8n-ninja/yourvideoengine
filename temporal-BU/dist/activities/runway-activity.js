import RunwayML from "@runwayml/sdk";
const RUNWAYML_API_KEY = process.env.RUNWAYML_API_KEY;
const client = new RunwayML({
    apiKey: RUNWAYML_API_KEY,
});
export async function startRunway(params) {
    const { prompt, imageUrl, duration = 5, ratio = "720:1280", model = "gen4_turbo", } = params;
    if (!prompt || !imageUrl) {
        throw new Error("Missing prompt or imageUrl");
    }
    const task = await client.imageToVideo.create({
        model: model || "gen4_turbo",
        promptImage: imageUrl,
        promptText: prompt,
        ratio: ratio || "720:1280",
        duration: duration || 5,
    });
    if (!task.id) {
        throw new Error("No task id returned");
    }
    return { externalId: task.id };
}
export async function checkRunwayStatus(externalId) {
    const task = await client.tasks.retrieve(externalId);
    if (task.status === "SUCCEEDED") {
        return {
            status: "ready",
            outputData: task,
            returnData: { url: task.output?.[0] },
        };
    }
    else if (task.status === "FAILED") {
        return {
            status: "failed",
            outputData: task,
            returnData: { error: "Runway processing failed" },
        };
    }
    else {
        return {
            status: "processing",
            outputData: task,
        };
    }
}
