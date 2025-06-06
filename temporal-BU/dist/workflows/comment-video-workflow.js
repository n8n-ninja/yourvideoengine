import { proxyActivities, startChild } from "@temporalio/workflow";
import { heygenWorkflow } from "./heygen-workflow";
import { remotionWorkflow } from "./remotion-workflow";
const { runDeepgram } = proxyActivities({
    taskQueue: "deepgram-queue",
    startToCloseTimeout: "5 minutes",
    retry: {
        maximumAttempts: 3,
        initialInterval: "5s",
        backoffCoefficient: 2,
        maximumInterval: "1m",
    },
});
export async function commentVideoWorkflow(params) {
    // 1. Générer la vidéo Heygen via le workflow enfant
    const heygenChild = await startChild(heygenWorkflow, {
        args: [
            {
                script: params.script,
                avatar_id: params.avatar_id,
                voice_id: params.voice_id,
            },
        ],
        taskQueue: "heygen-queue",
    });
    const heygenRes = (await heygenChild.result());
    const overlayUrl = heygenRes.videoUrl;
    const duration = heygenRes.duration;
    // 2. Générer les sous-titres avec Deepgram
    const deepgramRes = await runDeepgram({
        videoUrl: overlayUrl,
        language: "en",
        model: "nova-3",
        punctuate: true,
    });
    const captions = deepgramRes.captions.words;
    // 3. Générer la vidéo finale avec Remotion via workflow enfant
    const remotionChild = await startChild(remotionWorkflow, {
        args: [
            {
                composition: "VideoBackgroundComment",
                inputProps: {
                    hook: params.hook,
                    backgroundUrl: params.backgroundUrl,
                    overlayUrl,
                    duration: duration,
                    captions,
                    color: params.color,
                    position: params.position,
                    size: params.size,
                },
                // width, height, fps, durationInFrames peuvent être ajoutés ici si besoin
            },
        ],
        taskQueue: "remotion-queue",
    });
    const remotionRes = (await remotionChild.result());
    // 4. Retourner le résultat
    return {
        videoUrl: remotionRes.videoUrl,
        captions,
        duration,
    };
}
