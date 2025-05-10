"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YourVideoEngine = void 0;
const API_BASE_URL = "http://n04sg488kwcss8ow04kk4c8k.91.107.237.123.sslip.io";
const API_TOKEN = "Bearer sk_live_2b87210c8f3e4d3e9a23a09d5cf7d144";
class YourVideoEngine {
    constructor() {
        this.description = {
            displayName: "YourVideoEngine",
            name: "yourVideoEngine",
            group: ["transform"],
            version: 1,
            description: "Swiss Army Knife for video automation",
            defaults: {
                name: "YourVideoEngine",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: "Resource",
                    name: "resource",
                    type: "options",
                    options: [
                        {
                            name: "Video",
                            value: "video",
                        },
                    ],
                    default: "video",
                    description: "The resource to operate on.",
                },
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    options: [
                        {
                            name: "Get Subtitles",
                            value: "getSubtitles",
                            description: "Extract subtitles (.srt) from a video URL.",
                        },
                        {
                            name: "Get Audio",
                            value: "getAudio",
                            description: "Extract audio (mp3) from a video URL.",
                        },
                    ],
                    default: "getSubtitles",
                    description: "The operation to perform.",
                },
                {
                    displayName: "Video URL",
                    name: "videoUrl",
                    type: "string",
                    default: "",
                    placeholder: "https://...",
                    description: "URL of the video to process.",
                    required: true,
                },
                {
                    displayName: "Format",
                    name: "format",
                    type: "options",
                    options: [
                        { name: "SRT", value: "srt" },
                        { name: "JSON", value: "json" },
                    ],
                    default: "srt",
                    description: "Format of the subtitles.",
                    displayOptions: {
                        show: {
                            resource: ["video"],
                            operation: ["getSubtitles"],
                        },
                    },
                },
                {
                    displayName: "Cleaning Prompt",
                    name: "cleaning_prompt",
                    type: "string",
                    typeOptions: {
                        rows: 4,
                    },
                    default: "",
                    placeholder: "Instructions pour nettoyer ou contraindre la génération des sous-titres...",
                    description: "Instructions facultatives pour le nettoyage ou la génération des sous-titres (ex: noms de marque, style, etc)",
                    required: false,
                    displayOptions: {
                        show: {
                            resource: ["video"],
                            operation: ["getSubtitles"],
                        },
                    },
                },
            ],
        };
        console.log("YourVideoEngine node loaded");
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter("resource", i);
            const operation = this.getNodeParameter("operation", i);
            const videoUrl = this.getNodeParameter("videoUrl", i);
            if (resource === "video") {
                if (operation === "getSubtitles") {
                    const format = this.getNodeParameter("format", i);
                    const cleaningPrompt = this.getNodeParameter("cleaning_prompt", i, "");
                    const body = {
                        url: videoUrl,
                        format,
                    };
                    if (cleaningPrompt) {
                        body.cleaning_prompt = cleaningPrompt;
                    }
                    const response = await this.helpers.httpRequest({
                        method: "POST",
                        url: `${API_BASE_URL}/captions`,
                        headers: {
                            Authorization: API_TOKEN,
                        },
                        body,
                        json: true,
                    });
                    returnData.push({ json: { [format]: response, videoUrl } });
                }
                else if (operation === "getAudio") {
                    const response = await this.helpers.httpRequest({
                        method: "POST",
                        url: `${API_BASE_URL}/mp3`,
                        headers: {
                            Authorization: API_TOKEN,
                        },
                        body: {
                            url: videoUrl,
                        },
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
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YourVideoEngine = YourVideoEngine;
