"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEVideoCaptions = void 0;
const API_BASE_URL = "http://n04sg488kwcss8ow04kk4c8k.91.107.237.123.sslip.io";
const API_TOKEN = "Bearer sk_live_2b87210c8f3e4d3e9a23a09d5cf7d144";
class YVEVideoCaptions {
    constructor() {
        this.description = {
            displayName: "YVE Video Captions",
            name: "yveVideoCaptions",
            icon: "file:captions.svg",
            group: ["transform"],
            version: 1,
            description: "Extract subtitles from a video URL",
            defaults: {
                name: "YVE Video Captions",
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
                            name: "Get Subtitles",
                            value: "getSubtitles",
                            description: "Extract subtitles (.srt or .json) from a video URL.",
                        },
                        {
                            name: "Get Audio",
                            value: "getAudio",
                            description: "Extract audio (mp3) from a video URL.",
                        },
                    ],
                    default: "getSubtitles",
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
                    placeholder: "Instructions to clean or constrain subtitle generation...",
                    description: "Optional instructions for cleaning or constraining subtitle generation (e.g. brand names, style, etc)",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["getSubtitles"],
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
                const cleaningPrompt = this.getNodeParameter("cleaning_prompt", i, "");
                const body = {
                    url: videoUrl,
                };
                if (cleaningPrompt) {
                    body.cleaning_prompt = cleaningPrompt;
                }
                //   const response = await this.helpers.httpRequest({
                //     method: "POST",
                //     url: `${API_BASE_URL}/mp3`,
                //     headers: {
                //         Authorization: API_TOKEN,
                //     },
                //     body: {
                //         url: videoUrl,
                //     },
                //     encoding: "arraybuffer",
                // });
                // returnData.push({
                //     json: { videoUrl },
                //     binary: {
                //         audio: {
                //             data: Buffer.from(response).toString("base64"),
                //             mimeType: "audio/mpeg",
                //             fileName: "audio.mp3",
                //         },
                //     },
                // });
                const response = await this.helpers.httpRequest({
                    method: "POST",
                    url: `${API_BASE_URL}/mp3`,
                    headers: {
                        Authorization: API_TOKEN,
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
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YVEVideoCaptions = YVEVideoCaptions;
