"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEVideoCaptions = void 0;
const UTILS_API_BASE_URL = "http://n04sg488kwcss8ow04kk4c8k.91.107.237.123.sslip.io";
const UTILS_API_TOKEN = "Bearer sk_live_2b87210c8f3e4d3e9a23a09d5cf7d144";
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
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    options: [
                        {
                            name: "Add Captions to Video",
                            value: "addCaptionsToVideo",
                            description: "Extract word-by-word subtitles (JSON) from a video URL and add the captions directly to the video.",
                        },
                        {
                            name: "Extract Captions from Video",
                            value: "extractCaptionsFromVideo",
                            description: "Extract word-by-word subtitles (JSON) from a video URL.",
                        },
                    ],
                    default: "addCaptionsToVideo",
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
                            operation: ["addCaptionsToVideo", "extractCaptionsFromVideo"],
                        },
                    },
                },
                // VIDEO CAPTION STYLE PARAMS (toujours visibles pour addCaptionsToVideo)
                {
                    displayName: "Combine Tokens Within (ms)",
                    name: "combineTokensWithinMilliseconds",
                    type: "number",
                    default: 1400,
                    description: "Regroup words into phrases if they are close in time (ms). 0 = word by word. 1000 words = normal length. 2000 words = long length.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Font Size (px)",
                    name: "fontSize",
                    type: "number",
                    default: 90,
                    description: "Font size for the captions (in px).",
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Font Family",
                    name: "fontFamily",
                    type: "options",
                    options: [
                        { name: "Arial", value: "Arial" },
                        { name: "Arial Black", value: "Arial Black" },
                        { name: "Montserrat", value: "Montserrat" },
                        { name: "Poppins", value: "Poppins" },
                        { name: "Roboto", value: "Roboto" },
                        { name: "Lato", value: "Lato" },
                        { name: "Inter", value: "Inter" },
                        { name: "Open Sans", value: "Open Sans" },
                        { name: "Bebas Neue", value: "Bebas Neue" },
                        { name: "Impact", value: "Impact" },
                        { name: "Anton", value: "Anton" },
                    ],
                    default: "Montserrat",
                    description: "Font family for the captions.",
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Font Weight",
                    name: "fontWeight",
                    type: "options",
                    options: [
                        { name: "Light", value: "light" },
                        { name: "Regular", value: "regular" },
                        { name: "Bold", value: "bold" },
                        { name: "Black", value: "black" },
                    ],
                    default: "bold",
                    description: "Font weight for the captions.",
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Color",
                    name: "color",
                    type: "color",
                    default: "#ffffff",
                    description: "Text color for the captions.",
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Highlight Color",
                    name: "highlightColor",
                    type: "color",
                    default: "#F2E905",
                    description: "Color for the highlighted/active word.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Background Color",
                    name: "backgroundColor",
                    type: "string",
                    default: "rgba(0,0,0,0.7)",
                    description: "Background color of the captions container.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Animation Type",
                    name: "animationType",
                    type: "options",
                    options: [
                        { name: "None", value: "none" },
                        { name: "Bump", value: "bump" },
                        { name: "Grow", value: "grow" },
                        { name: "Lift", value: "lift" },
                    ],
                    default: "none",
                    description: "Type of animation for word appearance.",
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Uppercase",
                    name: "uppercase",
                    type: "boolean",
                    default: false,
                    description: "Make all captions uppercase.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                // POSITION FIELDS (top, bottom, left, right)
                {
                    displayName: "Top (%)",
                    name: "topPos",
                    type: "number",
                    default: 75,
                    description: "Top position of the captions container as a percentage of the video height.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Bottom (%)",
                    name: "bottomPos",
                    type: "number",
                    default: 0,
                    description: "Bottom position of the captions container as a percentage of the video height.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Left (%)",
                    name: "leftPos",
                    type: "number",
                    default: 0,
                    description: "Left position of the captions container as a percentage of the video width.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Right (%)",
                    name: "rightPos",
                    type: "number",
                    default: 0,
                    description: "Right position of the captions container as a percentage of the video width.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                // POSITION JSON + ALIGN DROPDOWNS
                {
                    displayName: "Horizontal Align",
                    name: "horizontalAlign",
                    type: "options",
                    options: [
                        { name: "Start", value: "start" },
                        { name: "Center", value: "center" },
                        { name: "End", value: "end" },
                    ],
                    default: "center",
                    description: "Horizontal alignment of the captions container.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Vertical Align",
                    name: "verticalAlign",
                    type: "options",
                    options: [
                        { name: "Start", value: "start" },
                        { name: "Center", value: "center" },
                        { name: "End", value: "end" },
                    ],
                    default: "center",
                    description: "Vertical alignment of the captions container.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Box Style (JSON)",
                    name: "boxStyle",
                    type: "json",
                    default: "{}",
                    description: 'Custom JSON for the captions container (e.g. {"backgroundColor":"#000","borderRadius":18})',
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Text Style (JSON)",
                    name: "textStyle",
                    type: "json",
                    default: "{}",
                    description: 'Custom JSON for the captions text (e.g. {"textShadow":"2px 2px 8px #000"})',
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Active Word Style (JSON)",
                    name: "activeWordStyle",
                    type: "json",
                    default: "{}",
                    description: 'Custom JSON for the active word (e.g. {"textShadow":"2px 2px 8px #F2E905","fontWeight":"bold"})',
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                // Regroupe toutes les options de style dans une seule collection
                {
                    displayName: "Optional Style",
                    name: "style",
                    type: "collection",
                    placeholder: "Add Option",
                    default: {},
                    options: [
                        {
                            displayName: "Phrase In Animation",
                            name: "phraseInAnimation",
                            type: "options",
                            options: [
                                { name: "None", value: "" },
                                { name: "Fade", value: "fade" },
                                { name: "Slide Up", value: "slide-up" },
                            ],
                            default: "",
                            description: "Phrase in animation (fade, slide-up).",
                            required: false,
                        },
                        {
                            displayName: "Phrase Out Animation",
                            name: "phraseOutAnimation",
                            type: "options",
                            options: [
                                { name: "None", value: "" },
                                { name: "Fade", value: "fade" },
                                { name: "Slide Up", value: "slide-up" },
                                { name: "Slide Down", value: "slide-down" },
                            ],
                            default: "",
                            description: "Phrase out animation.",
                            required: false,
                        },
                        {
                            displayName: "Phrase Animation Duration (s)",
                            name: "phraseAnimationDuration",
                            type: "number",
                            default: 0.1,
                            description: "Duration of the phrase in/out animation (in seconds).",
                            required: false,
                        },
                        {
                            displayName: "Multi Colors",
                            name: "multiColors",
                            type: "string",
                            default: "",
                            placeholder: "#FF0000,#00FF00,#0000FF",
                            description: "Comma-separated list of colors to use for captions (e.g. #FF0000,#00FF00,#0000FF)",
                            required: false,
                        },
                        {
                            displayName: "Floating",
                            name: "floating",
                            type: "number",
                            typeOptions: {
                                minValue: 0,
                                maxValue: 100,
                            },
                            default: 0,
                            description: "Floating effect intensity (0-100).",
                            required: false,
                        },
                        {
                            displayName: "Random Word Size",
                            name: "randomWordSize",
                            type: "number",
                            typeOptions: {
                                minValue: 0,
                                maxValue: 100,
                            },
                            default: 0,
                            description: "Vary the difference in word sizes (0-100).",
                            required: false,
                        },
                    ],
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Optional Transcript",
                    name: "optionalTranslation",
                    type: "collection",
                    placeholder: "Add Option",
                    default: {},
                    options: [
                        {
                            displayName: "Keywords",
                            name: "keywords",
                            type: "string",
                            default: "",
                            placeholder: "n8n, workflow, automation",
                            description: "Comma-separated list of keywords or keyterms to boost in the transcript.",
                            required: false,
                        },
                        {
                            displayName: "Language",
                            name: "language",
                            type: "options",
                            options: [
                                { name: "English (en)", value: "en" },
                                { name: "Spanish (es)", value: "es" },
                                { name: "French (fr)", value: "fr" },
                                { name: "German (de)", value: "de" },
                                { name: "Italian (it)", value: "it" },
                                { name: "Portuguese (pt)", value: "pt" },
                                { name: "Dutch (nl)", value: "nl" },
                                { name: "Russian (ru)", value: "ru" },
                                { name: "Ukrainian (uk)", value: "uk" },
                                { name: "Turkish (tr)", value: "tr" },
                                { name: "Polish (pl)", value: "pl" },
                                { name: "Romanian (ro)", value: "ro" },
                                { name: "Czech (cs)", value: "cs" },
                                { name: "Greek (el)", value: "el" },
                                { name: "Bulgarian (bg)", value: "bg" },
                                { name: "Hungarian (hu)", value: "hu" },
                                { name: "Finnish (fi)", value: "fi" },
                                { name: "Swedish (sv)", value: "sv" },
                                { name: "Danish (da)", value: "da" },
                                { name: "Norwegian (no)", value: "no" },
                                { name: "Hebrew (he)", value: "he" },
                                { name: "Arabic (ar)", value: "ar" },
                                { name: "Hindi (hi)", value: "hi" },
                                { name: "Chinese (zh)", value: "zh" },
                                { name: "Japanese (ja)", value: "ja" },
                                { name: "Korean (ko)", value: "ko" },
                                { name: "Indonesian (id)", value: "id" },
                                { name: "Malay (ms)", value: "ms" },
                                { name: "Tagalog (tl)", value: "tl" },
                                { name: "Vietnamese (vi)", value: "vi" },
                                { name: "Thai (th)", value: "th" },
                            ],
                            default: "en",
                            description: "Language of the audio for Deepgram transcription.",
                            required: false,
                        },
                        {
                            displayName: "Model",
                            name: "model",
                            type: "options",
                            options: [
                                { name: "Nova-3", value: "nova-3" },
                                { name: "Nova-2", value: "nova-2" },
                                { name: "Enhanced", value: "enhanced" },
                                { name: "Base", value: "base" },
                            ],
                            default: "nova-3",
                            description: "Choose the Deepgram model to use.",
                            required: false,
                        },
                        {
                            displayName: "Punctuation",
                            name: "punctuation",
                            type: "boolean",
                            default: false,
                            description: "Enable automatic punctuation in the Deepgram transcript.",
                            required: false,
                        },
                    ],
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo", "extractCaptionsFromVideo"],
                        },
                    },
                },
            ],
            credentials: [
                {
                    name: "deepgramApi",
                    required: true,
                    testedBy: "testDeepgramAuth",
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = (await this.getCredentials("deepgramApi"));
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter("operation", i);
            const videoUrl = this.getNodeParameter("videoUrl", i);
            const style = this.getNodeParameter("style", i, {});
            const optionalTranslation = this.getNodeParameter("optionalTranslation", i, {});
            let words = [];
            if (operation === "addCaptionsToVideo") {
                // Main params
                const color = this.getNodeParameter("color", i);
                const highlightColor = this.getNodeParameter("highlightColor", i);
                const backgroundColor = this.getNodeParameter("backgroundColor", i);
                const fontSize = this.getNodeParameter("fontSize", i);
                const fontFamily = this.getNodeParameter("fontFamily", i);
                const fontWeight = this.getNodeParameter("fontWeight", i);
                const animationType = this.getNodeParameter("animationType", i);
                const uppercase = this.getNodeParameter("uppercase", i);
                const combineTokensWithinMilliseconds = this.getNodeParameter("combineTokensWithinMilliseconds", i);
                // Style params
                const boxStyleStr = this.getNodeParameter("boxStyle", i, "");
                const textStyleStr = this.getNodeParameter("textStyle", i, "");
                const activeWordStyleStr = this.getNodeParameter("activeWordStyle", i, "");
                // Position params
                const topPos = this.getNodeParameter("topPos", i);
                const bottomPos = this.getNodeParameter("bottomPos", i);
                const leftPos = this.getNodeParameter("leftPos", i);
                const rightPos = this.getNodeParameter("rightPos", i);
                const horizontalAlign = this.getNodeParameter("horizontalAlign", i);
                const verticalAlign = this.getNodeParameter("verticalAlign", i);
                // Deepgram params
                const deepgramOptions = {
                    model: optionalTranslation.model ?? "nova-3",
                    language: optionalTranslation.language ?? "en",
                    punctuation: optionalTranslation.punctuation ?? false,
                    keywordsArr: (optionalTranslation.keywords ?? "")
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean),
                };
                try {
                    const response = await callDeepgramWordByWord({
                        videoUrl,
                        model: deepgramOptions.model,
                        language: deepgramOptions.language,
                        keywordsArr: deepgramOptions.keywordsArr,
                        punctuation: deepgramOptions.punctuation,
                        helpers: this.helpers,
                        apiKey: credentials.apiKey,
                    });
                    words = response.words || [];
                    words = words.map((w) => ({
                        word: w.punctuated_word !== undefined ? w.punctuated_word : w.word,
                        start: w.start,
                        end: w.end,
                        confidence: w.confidence,
                    }));
                    if (!words || words.length === 0) {
                        throw new Error("No words found in Deepgram response. Check if the video/audio URL is valid and accessible.");
                    }
                    const body = {
                        url: videoUrl,
                    };
                    const durationResponse = await this.helpers.httpRequest({
                        method: "POST",
                        url: `${UTILS_API_BASE_URL}/duration`,
                        headers: {
                            Authorization: UTILS_API_TOKEN,
                        },
                        body,
                        json: true,
                    });
                    const duration = durationResponse.duration;
                    if (!duration || isNaN(duration)) {
                        throw new Error("Could not fetch video duration from utils API.");
                    }
                    const inputProps = {
                        videoUrl,
                        words: words,
                        combineTokensWithinMilliseconds,
                    };
                    if (color !== undefined)
                        inputProps.color = color;
                    if (highlightColor !== undefined)
                        inputProps.highlightColor = highlightColor;
                    if (backgroundColor !== undefined)
                        inputProps.backgroundColor = backgroundColor;
                    if (fontSize !== undefined)
                        inputProps.fontSize = fontSize;
                    if (fontFamily !== undefined)
                        inputProps.fontFamily = fontFamily;
                    if (fontWeight !== undefined)
                        inputProps.fontWeight = fontWeight;
                    if (animationType !== undefined)
                        inputProps.animationType = animationType;
                    if (uppercase !== undefined)
                        inputProps.uppercase = uppercase;
                    if (boxStyleStr && boxStyleStr.trim() !== "") {
                        try {
                            inputProps.boxStyle = JSON.parse(boxStyleStr);
                        }
                        catch (e) {
                            throw new Error("boxStyle is not valid JSON: " + e);
                        }
                    }
                    if (textStyleStr && textStyleStr.trim() !== "") {
                        try {
                            inputProps.textStyle = JSON.parse(textStyleStr);
                        }
                        catch (e) {
                            throw new Error("textStyle is not valid JSON: " + e);
                        }
                    }
                    if (activeWordStyleStr && activeWordStyleStr.trim() !== "") {
                        try {
                            inputProps.activeWordStyle = JSON.parse(activeWordStyleStr);
                        }
                        catch (e) {
                            throw new Error("activeWordStyle is not valid JSON: " + e);
                        }
                    }
                    // Position & align
                    inputProps.top = topPos;
                    inputProps.bottom = bottomPos;
                    inputProps.left = leftPos;
                    inputProps.right = rightPos;
                    if (horizontalAlign)
                        inputProps.horizontalAlign = horizontalAlign;
                    if (verticalAlign)
                        inputProps.verticalAlign = verticalAlign;
                    // Optional style
                    Object.entries(style || {}).forEach(([key, value]) => {
                        if (value !== undefined && value !== "") {
                            if (key === "multiColors" && typeof value === "string") {
                                // Split and pass as array if not empty
                                const arr = value
                                    .split(",")
                                    .map((c) => c.trim())
                                    .filter(Boolean);
                                if (arr.length > 0) {
                                    inputProps.multiColors = arr;
                                }
                            }
                            else if (key === "floating") {
                                inputProps.floating = value;
                            }
                            else if (key === "randomWordSize") {
                                inputProps.randomWordSize = value;
                            }
                            else {
                                inputProps[key] = value;
                            }
                        }
                    });
                    // Remotion payload
                    const remotionPayload = {
                        serveUrl: "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine/index.html",
                        composition: "Captions",
                        framesPerLambda: 12,
                        inputProps: inputProps,
                        durationInFrames: Math.round(duration * 30),
                    };
                    // Remotion response
                    const remotionResponse = await this.helpers.httpRequest({
                        method: "POST",
                        url: "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/render",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: remotionPayload,
                        json: true,
                    });
                    // Output file
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
                                if (statusData.done && statusData.outputFile) {
                                    outputFile = statusData.outputFile;
                                    break;
                                }
                            }
                            catch (e) {
                                break;
                            }
                        }
                    }
                    // Output data
                    if (outputFile) {
                        returnData.push({
                            json: {
                                video_url: outputFile,
                                captions: response,
                                status: statusData,
                            },
                        });
                    }
                    else {
                        returnData.push({
                            json: {
                                remotion: remotionResponse,
                                status: statusData,
                            },
                        });
                    }
                }
                catch (err) {
                    throw err;
                }
            }
            else if (operation === "extractCaptionsFromVideo") {
                const deepgramOptions = {
                    model: optionalTranslation.model ?? "nova-3",
                    language: optionalTranslation.language ?? "en",
                    punctuation: optionalTranslation.punctuation ?? false,
                    keywordsArr: (optionalTranslation.keywords ?? "")
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean),
                };
                const response = await callDeepgramWordByWord({
                    videoUrl,
                    model: deepgramOptions.model,
                    language: deepgramOptions.language,
                    keywordsArr: deepgramOptions.keywordsArr,
                    punctuation: deepgramOptions.punctuation,
                    helpers: this.helpers,
                    apiKey: credentials.apiKey,
                });
                returnData.push({ json: { response } });
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YVEVideoCaptions = YVEVideoCaptions;
// Shared Deepgram call function
async function callDeepgramWordByWord({ videoUrl, model, language, keywordsArr, punctuation, helpers, apiKey, }) {
    const url = new URL("https://api.deepgram.com/v1/listen");
    url.searchParams.set("model", model);
    url.searchParams.set("language", language);
    if (punctuation) {
        url.searchParams.set("punctuate", "true");
    }
    if (model === "nova-3" && keywordsArr.length > 0) {
        keywordsArr.forEach((k) => url.searchParams.append("keyterm", k));
    }
    else if (model !== "nova-3" && keywordsArr.length > 0) {
        keywordsArr.forEach((k) => url.searchParams.append("keywords", k));
    }
    const response = await helpers.httpRequest({
        method: "POST",
        url: url.toString(),
        headers: {
            Authorization: `Token ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: {
            url: videoUrl,
        },
        json: true,
    });
    if (!response.results ||
        !response.results.channels ||
        !response.results.channels[0] ||
        !response.results.channels[0].alternatives ||
        !response.results.channels[0].alternatives[0]) {
        throw new Error("Unexpected Deepgram response structure");
    }
    return response.results.channels[0].alternatives[0];
}
