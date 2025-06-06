import {
  heygenWorkflow
} from "./chunk-F2XTYFD3.js";
import {
  remotionWorkflow
} from "./chunk-VA6VLZCA.js";

// src/workflows/comment-video-workflow.ts
import { proxyActivities, startChild } from "@temporalio/workflow";
var { runDeepgram } = proxyActivities({
  taskQueue: "deepgram-queue",
  startToCloseTimeout: "5 minutes",
  retry: {
    maximumAttempts: 3,
    initialInterval: "5s",
    backoffCoefficient: 2,
    maximumInterval: "1m"
  }
});
async function commentVideoWorkflow(params) {
  const heygenChild = await startChild(heygenWorkflow, {
    args: [
      {
        script: params.script,
        avatar_id: params.avatar_id,
        voice_id: params.voice_id
      }
    ],
    taskQueue: "heygen-queue"
  });
  const heygenRes = await heygenChild.result();
  const overlayUrl = heygenRes.videoUrl;
  const duration = heygenRes.duration;
  const deepgramRes = await runDeepgram({
    videoUrl: overlayUrl,
    language: "en",
    model: "nova-3",
    punctuate: true
  });
  const captions = deepgramRes.captions.words;
  const remotionChild = await startChild(remotionWorkflow, {
    args: [
      {
        composition: "VideoBackgroundComment",
        inputProps: {
          hook: params.hook,
          backgroundUrl: params.backgroundUrl,
          overlayUrl,
          duration,
          captions,
          color: params.color,
          position: params.position,
          size: params.size
        }
        // width, height, fps, durationInFrames peuvent être ajoutés ici si besoin
      }
    ],
    taskQueue: "remotion-queue"
  });
  const remotionRes = await remotionChild.result();
  return {
    videoUrl: remotionRes.videoUrl,
    captions,
    duration
  };
}

export {
  commentVideoWorkflow
};
