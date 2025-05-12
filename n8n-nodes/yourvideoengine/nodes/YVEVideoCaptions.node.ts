import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

const API_BASE_URL = "http://n04sg488kwcss8ow04kk4c8k.91.107.237.123.sslip.io"
const API_TOKEN = "Bearer sk_live_2b87210c8f3e4d3e9a23a09d5cf7d144"

export class YVEVideoCaptions implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE Video Captions",
    name: "yveVideoCaptions",
    icon: "file:captions.svg",
    group: ["transform"],
    version: 1,
    description: "Extract subtitles, audio, and more from a video URL",
    defaults: {
      name: "YVE Video Captions",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
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
            name: "Add Caption Word by Word",
            value: "captionWordByWord",
            description:
              "Extract word-by-word subtitles (JSON) from a video URL and add the captions directly to the video.",
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
            name: "Get Word by Word",
            value: "getWordByWord",
            description:
              "Extract word-by-word subtitles (JSON) from a video URL.",
          },
        ],
        default: "getWordByWord",
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
        displayName: "Duration (seconds)",
        name: "duration",
        type: "number",
        default: 10,
        description: "Duration of the video in seconds.",
        required: true,
        displayOptions: {
          show: {
            resource: ["video"],
          },
        },
      },
      // VIDEO CAPTION STYLE PARAMS (toujours visibles)
      {
        displayName: "Position (0-100)",
        name: "top",
        type: "number",
        default: 75,
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
        description:
          "Vertical position of the captions as a percentage of the video height. 0 = top, 100 = bottom.",
        required: true,
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["captionWordByWord"],
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
            resource: ["video"],
            operation: ["captionWordByWord"],
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
            resource: ["video"],
            operation: ["captionWordByWord"],
          },
        },
      },
      {
        displayName: "Color",
        name: "color",
        type: "string",
        default: "#ffffff",
        typeOptions: {
          colorPicker: true,
        },
        description: "Text color for the captions.",
        required: true,
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["captionWordByWord"],
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
        required: false,
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["captionWordByWord"],
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
        default: "bump",
        description: "Type of animation for word appearance.",
        required: false,
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["captionWordByWord"],
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
            resource: ["video"],
            operation: ["captionWordByWord"],
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
            displayName: "Combine Tokens Within (ms)",
            name: "combineTokensWithinMilliseconds",
            type: "number",
            default: 1400,
            description:
              "Regroup words into phrases if they are close in time (ms). 0 = word by word.",
            required: false,
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
            description:
              "CSS padding for the caption background (e.g., '0.2em 0.6em').",
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
            description:
              "CSS gradient for the background (ex: linear-gradient(...)).",
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
            displayName: "Highlight Color",
            name: "highlightColor",
            type: "string",
            default: "",
            typeOptions: {
              colorPicker: true,
            },
            description: "Color for the highlighted/active word.",
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
            description:
              "Duration of the phrase in/out animation (in seconds).",
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
            resource: ["video"],
            operation: ["captionWordByWord"],
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
            description:
              "Comma-separated list of keywords or keyterms to boost in the transcript.",
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
            description:
              "Enable automatic punctuation in the Deepgram transcript.",
            required: false,
          },
        ],
        displayOptions: {
          show: {
            resource: ["caption", "video"],
            operation: ["getWordByWord", "captionWordByWord"],
          },
        },
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []
    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter("resource", i) as string
      const operation = this.getNodeParameter("operation", i) as string
      const videoUrl = this.getNodeParameter("videoUrl", i) as string
      const keywordsRaw = this.getNodeParameter("keywords", i, "") as string
      const duration = this.getNodeParameter("duration", i, 10) as number

      const keywordsArr = keywordsRaw
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)

      // Retrieve optional style options for video
      const style = this.getNodeParameter("style", i, {}) as any
      // Retrieve optional style options for captions
      const optionalTranslation = this.getNodeParameter(
        "optionalTranslation",
        i,
        {},
      ) as any

      // Main parameters (always visible)
      const color = this.getNodeParameter("color", i, "#fff") as string
      const fontSize = this.getNodeParameter("fontSize", i, 90) as number
      const fontFamily = this.getNodeParameter(
        "fontFamily",
        i,
        "Montserrat",
      ) as string
      const fontWeight = this.getNodeParameter(
        "fontWeight",
        i,
        "black",
      ) as string
      const animationType = this.getNodeParameter(
        "animationType",
        i,
        "bump",
      ) as string
      const top = this.getNodeParameter("top", i, 75) as number
      const uppercase = this.getNodeParameter("uppercase", i, false) as boolean

      // Extract advanced options (with fallback)
      const getAdv = (key: string, fallback: any) =>
        style && style[key] !== undefined ? style[key] : fallback

      let wordsArr = []
      if (resource === "video") {
        const deepgramOptions = {
          model: optionalTranslation.model ?? "nova-3",
          language: optionalTranslation.language ?? "en",
          punctuation: optionalTranslation.punctuation ?? false,
          keywordsArr: (optionalTranslation.keywords ?? "")
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean),
        }
        if (operation === "captionWordByWord") {
          try {
            console.log("[YVE] Appel Deepgram", { videoUrl })
            const response = await callDeepgramWordByWord({
              videoUrl,
              model: deepgramOptions.model,
              language: deepgramOptions.language,
              keywordsArr: deepgramOptions.keywordsArr,
              punctuation: deepgramOptions.punctuation,
              helpers: this.helpers,
            })
            console.log("[YVE] Deepgram response", { response })

            // Parse the response to extract the words array (Deepgram structure)
            try {
              wordsArr = response.words || []
            } catch (e) {
              wordsArr = []
            }
            console.log("[YVE] Words extraits pour Remotion", { wordsArr })

            // Clean the words to keep only the fields expected by Remotion
            wordsArr = wordsArr.map((w: any) => ({
              word:
                w.punctuated_word !== undefined ? w.punctuated_word : w.word,
              start: w.start,
              end: w.end,
              confidence: w.confidence,
            }))

            if (!wordsArr || wordsArr.length === 0) {
              throw new Error(
                "No words found in Deepgram response. Check if the video/audio URL is valid and accessible.",
              )
            }

            const inputProps: any = {
              videoUrl,
              words: wordsArr,
              color,
              fontSize,
              fontFamily,
              fontWeight,
              animationType,
              top,
              uppercase,
              // Advanced
              colors: (getAdv("colors", "") as string)
                .split(",")
                .map((c: string) => c.trim())
                .filter(Boolean),
              backgroundColor: getAdv("backgroundColor", "rgba(0,0,0,0.7)"),
              backgroundGradient: getAdv("backgroundGradient", ""),
              backgroundBlur: getAdv("backgroundBlur", ""),
              padding: getAdv("padding", "0.2em 0.6em"),
              borderRadius: getAdv("borderRadius", 18),
              boxBorderColor: getAdv("boxBorderColor", ""),
              boxBorderWidth: getAdv("boxBorderWidth", ""),
              boxShadow: getAdv("boxShadow", ""),
              margin: getAdv("margin", ""),
              boxWidth: getAdv("boxWidth", ""),
              fullWidth: getAdv("fullWidth", false),
              boxHeight: getAdv("boxHeight", ""),
              lineSpacing: getAdv("lineSpacing", ""),
              wordSpacing: getAdv("wordSpacing", ""),
              letterSpacing: getAdv("letterSpacing", ""),
              textAlign: getAdv("textAlign", "center"),
              verticalAlign: getAdv("verticalAlign", "center"),
              highlightColor: getAdv("highlightColor", ""),
              combineTokensWithinMilliseconds: getAdv(
                "combineTokensWithinMilliseconds",
                1400,
              ),
              transitionDuration: getAdv("transitionDuration", "0.12s"),
              transitionEasing: getAdv(
                "transitionEasing",
                "cubic-bezier(0.4,0,0.2,1)",
              ),
              phraseInAnimation: getAdv("phraseInAnimation", ""),
              phraseOutAnimation: getAdv("phraseOutAnimation", ""),
              phraseAnimationDuration: getAdv("phraseAnimationDuration", 0.1),
              textOutline: (() => {
                const outline = getAdv("textOutline", {})
                if (
                  outline &&
                  outline.outline &&
                  Array.isArray(outline.outline) &&
                  outline.outline.length > 0
                ) {
                  return outline.outline[0]
                }
                return undefined
              })(),
            }

            const remotionPayload = {
              serveUrl:
                "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine/index.html",
              composition: "Captions",
              framesPerLambda: 12,
              inputProps: inputProps,
              durationInFrames: Math.round(duration * 30),
            }
            console.log("[YVE] Appel Remotion", { remotionPayload })
            const remotionResponse = await this.helpers.httpRequest({
              method: "POST",
              url: "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/render",
              headers: {
                "Content-Type": "application/json",
              },
              body: remotionPayload,
              json: true,
            })
            console.log("[YVE] Remotion response", { remotionResponse })

            // Polling on statusUrl if present
            let outputFile = null
            let statusData = null
            if (remotionResponse.statusUrl) {
              const statusUrl = remotionResponse.statusUrl
              const start = Date.now()
              const timeout = 5 * 60 * 1000 // 5 minutes
              while (Date.now() - start < timeout) {
                await new Promise((r) => setTimeout(r, 10000)) // 10s
                try {
                  statusData = await this.helpers.httpRequest({
                    method: "GET",
                    url: statusUrl,
                    json: true,
                  })
                  console.log("[YVE] Poll Remotion status", statusData)
                  if (statusData.done && statusData.outputFile) {
                    outputFile = statusData.outputFile
                    break
                  }
                } catch (e) {
                  console.error("[YVE] Erreur polling Remotion", e)
                  break
                }
              }
            }
            if (outputFile) {
              returnData.push({
                json: { video_url: outputFile, captions: response },
              })
            } else {
              returnData.push({
                json: {
                  remotion: remotionResponse,
                  status: statusData,
                },
              })
            }
          } catch (err) {
            console.error("[YVE] Error in captionWordByWord", err)
            throw err
          }
        }
      } else if (resource === "caption") {
        const deepgramOptions = {
          model: optionalTranslation.model ?? "nova-3",
          language: optionalTranslation.language ?? "en",
          punctuation: optionalTranslation.punctuation ?? false,
          keywordsArr: (optionalTranslation.keywords ?? "")
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean),
        }
        if (operation === "getWordByWord") {
          const response = await callDeepgramWordByWord({
            videoUrl,
            model: deepgramOptions.model,
            language: deepgramOptions.language,
            keywordsArr: deepgramOptions.keywordsArr,
            punctuation: deepgramOptions.punctuation,
            helpers: this.helpers,
          })
          returnData.push({ json: { response } })
        }
      } else if (resource === "audio") {
        if (operation === "extractAudio") {
          const body: Record<string, unknown> = {
            url: videoUrl,
          }
          const response = await this.helpers.httpRequest({
            method: "POST",
            url: `${API_BASE_URL}/mp3`,
            headers: {
              Authorization: API_TOKEN,
            },
            body,
            encoding: "arraybuffer",
          })
          returnData.push({
            json: { videoUrl },
            binary: {
              audio: {
                data: Buffer.from(response).toString("base64"),
                mimeType: "audio/mpeg",
                fileName: "audio.mp3",
              },
            },
          })
        }
      }
    }
    return this.prepareOutputData(returnData)
  }
}

// Shared Deepgram call function
async function callDeepgramWordByWord({
  videoUrl,
  model,
  language,
  keywordsArr,
  punctuation,
  helpers,
}: {
  videoUrl: string
  model: string
  language: string
  keywordsArr: string[]
  punctuation: boolean
  helpers: any
}): Promise<any> {
  const url = new URL("https://api.deepgram.com/v1/listen")
  url.searchParams.set("model", model)
  url.searchParams.set("language", language)
  if (punctuation) {
    url.searchParams.set("punctuate", "true")
  }
  if (model === "nova-3" && keywordsArr.length > 0) {
    keywordsArr.forEach((k) => url.searchParams.append("keyterm", k))
  } else if (model !== "nova-3" && keywordsArr.length > 0) {
    keywordsArr.forEach((k) => url.searchParams.append("keywords", k))
  }
  // LOG: debug Deepgram params and request
  console.log("[YVEVideoCaptions] Deepgram url:", url.toString())
  console.log("[YVEVideoCaptions] model:", model)
  console.log("[YVEVideoCaptions] keywordsArr:", keywordsArr)
  const response = await helpers.httpRequest({
    method: "POST",
    url: url.toString(),
    headers: {
      Authorization: "Token 955ff624d0af44bf5ef57c78cf15448422c5d32a",
      "Content-Type": "application/json",
    },
    body: {
      url: videoUrl,
    },
    json: true,
  })
  console.log("[YVEVideoCaptions] Deepgram response:", JSON.stringify(response))
  return response.results.channels[0].alternatives[0]
}
