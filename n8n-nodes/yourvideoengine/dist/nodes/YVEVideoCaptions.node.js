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
                    description: "Regroup words into phrases if they are close in time (ms). 0 = word by word.",
                    required: false,
                    displayOptions: {
                        show: {
                            operation: ["addCaptionsToVideo"],
                        },
                    },
                },
                {
                    displayName: "Position (0-100%)",
                    name: "top",
                    type: "number",
                    default: 75,
                    typeOptions: {
                        minValue: 0,
                        maxValue: 100,
                    },
                    description: "Vertical position of the captions as a percentage of the video height. 0 = top, 100 = bottom.",
                    required: true,
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
                    displayName: "Font Weight",
                    name: "fontWeight",
                    type: "options",
                    options: [
                        { name: "Light", value: "light" },
                        { name: "Regular", value: "regular" },
                        { name: "Bold", value: "bold" },
                        { name: "Black", value: "black" },
                    ],
                    default: "black",
                    description: "Font weight for the captions.",
                    required: true,
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
                // Regroupe toutes les options de style dans une seule collection
                {
                    displayName: "Optional Style",
                    name: "style",
                    type: "collection",
                    placeholder: "Add Option",
                    default: {},
                    options: [
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
                            default: "black",
                            description: "Font weight for the captions.",
                            required: false,
                        },
                        {
                            displayName: "Colors (comma separated)",
                            name: "colors",
                            type: "string",
                            default: "",
                            placeholder: "#fff,#000,#f00",
                            description: "Array of colors to use (comma separated).",
                            required: false,
                        },
                        {
                            displayName: "Background Color",
                            name: "backgroundColor",
                            type: "string",
                            default: "rgba(0,0,0,0.7)",
                            typeOptions: {
                                colorPicker: true,
                            },
                            description: "Background color for the captions.",
                            required: false,
                        },
                        {
                            displayName: "Padding",
                            name: "padding",
                            type: "string",
                            default: "0.2em 0.6em",
                            description: "CSS padding for the caption background (e.g., '0.2em 0.6em').",
                            required: false,
                        },
                        {
                            displayName: "Border Radius",
                            name: "borderRadius",
                            type: "number",
                            default: 18,
                            description: "Border radius for the caption background (in px).",
                            required: false,
                        },
                        {
                            displayName: "Background Gradient (CSS)",
                            name: "backgroundGradient",
                            type: "string",
                            default: "",
                            description: "CSS gradient for the background (ex: linear-gradient(...)).",
                            required: false,
                        },
                        {
                            displayName: "Background Blur (CSS, px)",
                            name: "backgroundBlur",
                            type: "string",
                            default: "",
                            description: "Blur effect for the background (ex: 8px).",
                            required: false,
                        },
                        {
                            displayName: "Box Border Color",
                            name: "boxBorderColor",
                            type: "string",
                            default: "",
                            typeOptions: {
                                colorPicker: true,
                            },
                            description: "Border color for the caption box.",
                            required: false,
                        },
                        {
                            displayName: "Box Border Width (CSS)",
                            name: "boxBorderWidth",
                            type: "string",
                            default: "",
                            description: "Border width for the caption box (ex: 2px).",
                            required: false,
                        },
                        {
                            displayName: "Box Shadow (CSS)",
                            name: "boxShadow",
                            type: "string",
                            default: "",
                            description: "CSS box-shadow for the caption box.",
                            required: false,
                        },
                        {
                            displayName: "Margin (CSS)",
                            name: "margin",
                            type: "string",
                            default: "",
                            description: "CSS margin for the caption box.",
                            required: false,
                        },
                        {
                            displayName: "Box Width (CSS)",
                            name: "boxWidth",
                            type: "string",
                            default: "",
                            description: "Width of the caption box (ex: 80%).",
                            required: false,
                        },
                        {
                            displayName: "Full Width",
                            name: "fullWidth",
                            type: "boolean",
                            default: false,
                            description: "If true, the caption box takes 100% width.",
                            required: false,
                        },
                        {
                            displayName: "Box Height (CSS or px)",
                            name: "boxHeight",
                            type: "string",
                            default: "",
                            description: "Height of the caption box (ex: 120px or 100%).",
                            required: false,
                        },
                        {
                            displayName: "Line Spacing (CSS)",
                            name: "lineSpacing",
                            type: "string",
                            default: "",
                            description: "CSS line-height for the captions.",
                            required: false,
                        },
                        {
                            displayName: "Word Spacing (CSS)",
                            name: "wordSpacing",
                            type: "string",
                            default: "",
                            description: "CSS word-spacing for the captions.",
                            required: false,
                        },
                        {
                            displayName: "Letter Spacing (CSS)",
                            name: "letterSpacing",
                            type: "string",
                            default: "",
                            description: "CSS letter-spacing for the captions.",
                            required: false,
                        },
                        {
                            displayName: "Text Align",
                            name: "textAlign",
                            type: "options",
                            options: [
                                { name: "Left", value: "left" },
                                { name: "Center", value: "center" },
                                { name: "Right", value: "right" },
                                { name: "Justify", value: "justify" },
                            ],
                            default: "center",
                            description: "Text alignment for the captions.",
                            required: false,
                        },
                        {
                            displayName: "Vertical Align",
                            name: "verticalAlign",
                            type: "options",
                            options: [
                                { name: "Top", value: "top" },
                                { name: "Center", value: "center" },
                                { name: "Bottom", value: "bottom" },
                            ],
                            default: "center",
                            description: "Vertical alignment of the caption box.",
                            required: false,
                        },
                        {
                            displayName: "Transition Duration (CSS)",
                            name: "transitionDuration",
                            type: "string",
                            default: "0.12s",
                            description: "Transition duration for word highlight (ex: 0.12s).",
                            required: false,
                        },
                        {
                            displayName: "Transition Easing (CSS)",
                            name: "transitionEasing",
                            type: "string",
                            default: "cubic-bezier(0.4,0,0.2,1)",
                            description: "Transition easing for word highlight.",
                            required: false,
                        },
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
                            displayName: "Text Outline (contour)",
                            name: "textOutline",
                            type: "fixedCollection",
                            typeOptions: { multipleValues: false },
                            default: {},
                            options: [
                                {
                                    name: "outline",
                                    displayName: "Outline",
                                    values: [
                                        {
                                            displayName: "Color",
                                            name: "color",
                                            type: "string",
                                            default: "#000000",
                                            typeOptions: { colorPicker: true },
                                            required: false,
                                        },
                                        {
                                            displayName: "Width (px)",
                                            name: "width",
                                            type: "number",
                                            default: 2,
                                            required: false,
                                        },
                                        {
                                            displayName: "Shadow Color",
                                            name: "shadowColor",
                                            type: "string",
                                            default: "",
                                            typeOptions: { colorPicker: true },
                                            required: false,
                                        },
                                        {
                                            displayName: "Shadow Spread (px)",
                                            name: "shadowSpread",
                                            type: "number",
                                            default: 2,
                                            required: false,
                                        },
                                        {
                                            displayName: "Shadow Blur (px)",
                                            name: "shadowBlur",
                                            type: "number",
                                            default: 8,
                                            required: false,
                                        },
                                    ],
                                },
                            ],
                            description: "Text outline and shadow.",
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
                const fontSize = this.getNodeParameter("fontSize", i);
                const fontFamily = this.getNodeParameter("fontFamily", i);
                const fontWeight = this.getNodeParameter("fontWeight", i);
                const animationType = this.getNodeParameter("animationType", i);
                const top = this.getNodeParameter("top", i);
                const uppercase = this.getNodeParameter("uppercase", i);
                const combineTokensWithinMilliseconds = this.getNodeParameter("combineTokensWithinMilliseconds", i);
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
                    if (fontSize !== undefined)
                        inputProps.fontSize = fontSize;
                    if (fontFamily !== undefined)
                        inputProps.fontFamily = fontFamily;
                    if (fontWeight !== undefined)
                        inputProps.fontWeight = fontWeight;
                    if (animationType !== undefined)
                        inputProps.animationType = animationType;
                    if (top !== undefined)
                        inputProps.top = top;
                    if (uppercase !== undefined)
                        inputProps.uppercase = uppercase;
                    Object.entries(style || {}).forEach(([key, value]) => {
                        if (value !== undefined && value !== "") {
                            inputProps[key] = value;
                        }
                    });
                    const remotionPayload = {
                        serveUrl: "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine/index.html",
                        composition: "Captions",
                        framesPerLambda: 12,
                        inputProps: inputProps,
                        durationInFrames: Math.round(duration * 30),
                    };
                    const remotionResponse = await this.helpers.httpRequest({
                        method: "POST",
                        url: "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/render",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: remotionPayload,
                        json: true,
                    });
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
                    if (outputFile) {
                        returnData.push({
                            json: { video_url: outputFile, captions: response },
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
