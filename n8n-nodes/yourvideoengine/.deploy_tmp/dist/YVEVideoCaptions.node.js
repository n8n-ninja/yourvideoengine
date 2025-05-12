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
            description: "Extract subtitles, audio, and more from a video URL",
            defaults: {
                name: "YVE Video Captions",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: "Resource",
                    name: "resource",
                    type: "options",
                    options: [
                        { name: "Video", value: "video" },
                        { name: "Caption", value: "caption" },
                        { name: "Audio", value: "audio" },
                    ],
                    default: "video",
                    required: true,
                },
                // VIDEO METHODS
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    displayOptions: {
                        show: {
                            resource: ["video"],
                        },
                    },
                    options: [
                        {
                            name: "Caption Word by Word",
                            value: "captionWordByWord",
                            description: "Extract word-by-word subtitles (JSON) from a video URL.",
                        },
                    ],
                    default: "captionWordByWord",
                    required: true,
                },
                // CAPTION METHODS
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    displayOptions: {
                        show: {
                            resource: ["caption"],
                        },
                    },
                    options: [
                        {
                            name: "Get SRT",
                            value: "getSrt",
                            description: "Extract subtitles in SRT format from a video URL.",
                        },
                        {
                            name: "Get Text",
                            value: "getText",
                            description: "Extract subtitles as plain text from a video URL.",
                        },
                        {
                            name: "Get Word by Word",
                            value: "getWordByWord",
                            description: "Extract word-by-word subtitles (JSON) from a video URL.",
                        },
                        {
                            name: "Get Language",
                            value: "getLanguage",
                            description: "Detect the language of the video.",
                        },
                    ],
                    default: "getSrt",
                    required: true,
                },
                // AUDIO METHODS
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    displayOptions: {
                        show: {
                            resource: ["audio"],
                        },
                    },
                    options: [
                        {
                            name: "Extract Audio",
                            value: "extractAudio",
                            description: "Extract audio (mp3) from a video URL.",
                        },
                    ],
                    default: "extractAudio",
                    required: true,
                },
                // COMMON PARAMS
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
                            resource: ["video", "caption", "audio"],
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
                            resource: ["caption", "video"],
                        },
                    },
                },
                {
                    displayName: "Format",
                    name: "format",
                    type: "options",
                    options: [
                        { name: "SRT", value: "srt" },
                        { name: "JSON", value: "json" },
                        { name: "Text", value: "text" },
                    ],
                    default: "srt",
                    description: "Format of the subtitles.",
                    displayOptions: {
                        show: {
                            resource: ["caption"],
                            operation: ["getSrt", "getText"],
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
            const resource = this.getNodeParameter("resource", i);
            const operation = this.getNodeParameter("operation", i);
            const videoUrl = this.getNodeParameter("videoUrl", i);
            if (resource === "video") {
                if (operation === "captionWordByWord") {
                    try {
                        console.log("[YVE] Appel Deepgram", { videoUrl });
                        const cleaningPrompt = this.getNodeParameter("cleaning_prompt", i, "");
                        const body = {
                            url: videoUrl,
                        };
                        if (cleaningPrompt) {
                            body.cleaning_prompt = cleaningPrompt;
                        }
                        const wordsResponse = await this.helpers.httpRequest({
                            method: "POST",
                            url: "https://api.deepgram.com/v1/listen?language=en&model=nova-3",
                            headers: {
                                Authorization: "Token 955ff624d0af44bf5ef57c78cf15448422c5d32a",
                                "Content-Type": "application/json",
                            },
                            body: {
                                url: videoUrl,
                            },
                            json: true,
                        });
                        console.log("[YVE] Réponse Deepgram", { wordsResponse });
                        // On parse la réponse pour extraire le tableau words (structure Deepgram)
                        let wordsArr = [];
                        try {
                            wordsArr =
                                wordsResponse?.results?.channels?.[0]?.alternatives?.[0]
                                    ?.words || [];
                        }
                        catch (e) {
                            wordsArr = [];
                        }
                        console.log("[YVE] Words extraits pour Remotion", { wordsArr });
                        // Nettoie les mots pour ne garder que les champs attendus par Remotion
                        wordsArr = wordsArr.map((w) => ({
                            word: w.word,
                            start: w.start,
                            end: w.end,
                            confidence: w.confidence,
                        }));
                        console.log("[YVE] Payload final pour Remotion", JSON.stringify({
                            videoUrl,
                            words: wordsArr,
                            style: {
                                color: "#fff",
                                fontSize: 70,
                                backgroundColor: "rgba(0,0,0,0.7)",
                                fontFamily: "Arial Black, Arial, sans-serif",
                            },
                        }, null, 2));
                        if (!wordsArr || wordsArr.length === 0) {
                            throw new Error("No words found in Deepgram response. Check if the video/audio URL is valid and accessible.");
                        }
                        const remotionPayload = {
                            serveUrl: "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine/index.html",
                            composition: "Captions",
                            inputProps: {
                                videoUrl,
                                words: wordsArr,
                                style: {
                                    color: "#fff",
                                    fontSize: 70,
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                    fontFamily: "Arial Black, Arial, sans-serif",
                                },
                            },
                        };
                        console.log("[YVE] Appel Remotion", { remotionPayload });
                        const remotionResponse = await this.helpers.httpRequest({
                            method: "POST",
                            url: "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/render",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: remotionPayload,
                            json: true,
                        });
                        console.log("[YVE] Réponse Remotion", { remotionResponse });
                        // Polling sur statusUrl si présent
                        let outputFile = null;
                        let statusData = null;
                        if (remotionResponse.statusUrl) {
                            const statusUrl = remotionResponse.statusUrl;
                            const start = Date.now();
                            const timeout = 5 * 60 * 1000; // 5 minutes
                            while (Date.now() - start < timeout) {
                                await new Promise((r) => setTimeout(r, 10000)); // 10s
                                try {
                                    statusData = await this.helpers.httpRequest({
                                        method: "GET",
                                        url: statusUrl,
                                        json: true,
                                    });
                                    console.log("[YVE] Poll Remotion status", statusData);
                                    if (statusData.done && statusData.outputFile) {
                                        outputFile = statusData.outputFile;
                                        break;
                                    }
                                }
                                catch (e) {
                                    console.error("[YVE] Erreur polling Remotion", e);
                                    break;
                                }
                            }
                        }
                        if (outputFile) {
                            returnData.push({ json: { videoUrl, outputFile } });
                        }
                        else {
                            returnData.push({
                                json: {
                                    videoUrl,
                                    remotion: remotionResponse,
                                    status: statusData,
                                },
                            });
                        }
                    }
                    catch (err) {
                        console.error("[YVE] Erreur dans captionWordByWord", err);
                        throw err;
                    }
                }
            }
            else if (resource === "caption") {
                if (operation === "getSrt") {
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
                else if (operation === "getText") {
                    const response = await this.helpers.httpRequest({
                        method: "GET",
                        url: `${API_BASE_URL}/captions-text`,
                        headers: {
                            Authorization: API_TOKEN,
                        },
                        qs: {
                            url: videoUrl,
                        },
                    });
                    returnData.push({ json: { text: response, videoUrl } });
                }
                else if (operation === "getWordByWord") {
                    const cleaningPrompt = this.getNodeParameter("cleaning_prompt", i, "");
                    const body = {
                        url: videoUrl,
                    };
                    if (cleaningPrompt) {
                        body.cleaning_prompt = cleaningPrompt;
                    }
                    const response = await this.helpers.httpRequest({
                        method: "POST",
                        url: `${API_BASE_URL}/captions-word-by-word`,
                        headers: {
                            Authorization: API_TOKEN,
                        },
                        body,
                        json: true,
                    });
                    returnData.push({ json: { wordByWord: response, videoUrl } });
                }
                else if (operation === "getLanguage") {
                    const response = await this.helpers.httpRequest({
                        method: "GET",
                        url: `${API_BASE_URL}/captions-language`,
                        headers: {
                            Authorization: API_TOKEN,
                        },
                        qs: {
                            url: videoUrl,
                        },
                    });
                    returnData.push({ json: { language: response, videoUrl } });
                }
            }
            else if (resource === "audio") {
                if (operation === "extractAudio") {
                    const cleaningPrompt = this.getNodeParameter("cleaning_prompt", i, "");
                    const body = {
                        url: videoUrl,
                    };
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
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YVEVideoCaptions = YVEVideoCaptions;
