"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEUtils = void 0;
const UTILS_API_BASE_URL = "http://n04sg488kwcss8ow04kk4c8k.91.107.237.123.sslip.io";
const UTILS_API_TOKEN = "Bearer sk_live_2b87210c8f3e4d3e9a23a09d5cf7d144";
class YVEUtils {
    constructor() {
        this.description = {
            displayName: "YVE Utils",
            name: "yveUtils",
            icon: "file:utils.svg",
            group: ["transform"],
            version: 1,
            description: "Various video utilities (audio extraction, ...)",
            defaults: {
                name: "YVE Utils",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    options: [
                        {
                            name: "Extract Audio from Video",
                            value: "extractAudioFromVideo",
                            description: "Extract audio (mp3) from a video URL.",
                        },
                        {
                            name: "Get Video Duration",
                            value: "getVideoDuration",
                            description: "Get the duration of a video.",
                        },
                    ],
                    default: "extractAudioFromVideo",
                    required: true,
                },
                {
                    displayName: "Video URL",
                    name: "videoUrl",
                    type: "string",
                    default: "",
                    placeholder: "https://...",
                    description: "URL of the video to process.",
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ["extractAudioFromVideo", "getVideoDuration"],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter("operation", i);
            const videoUrl = this.getNodeParameter("videoUrl", i);
            if (operation === "extractAudioFromVideo") {
                const body = {
                    url: videoUrl,
                };
                const response = await this.helpers.httpRequest({
                    method: "POST",
                    url: `${UTILS_API_BASE_URL}/mp3`,
                    headers: {
                        Authorization: UTILS_API_TOKEN,
                    },
                    body,
                    encoding: "arraybuffer",
                });
                returnData.push({
                    json: { videoUrl },
                    binary: {
                        audio: {
                            data: Buffer.from(response).toString("base64"),
                            mimeType: "audio/mpeg",
                            fileName: "audio.mp3",
                        },
                    },
                });
            }
            else if (operation === "getVideoDuration") {
                const body = {
                    url: videoUrl,
                };
                const response = await this.helpers.httpRequest({
                    method: "POST",
                    url: `${UTILS_API_BASE_URL}/duration`,
                    headers: {
                        Authorization: UTILS_API_TOKEN,
                    },
                    body,
                    json: true,
                });
                returnData.push({
                    json: response,
                });
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YVEUtils = YVEUtils;
