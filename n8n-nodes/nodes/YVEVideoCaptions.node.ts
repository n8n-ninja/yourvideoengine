import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

interface DeepgramWord {
  word: string
  start: number
  end: number
  confidence: number
  punctuated_word?: string
}

interface DeepgramResponse {
  words: DeepgramWord[]
  transcript: string
  [key: string]: unknown
}

const DEEPGRAM_API_KEY = "41c7a04040a50fa21f6267d0647dc0603ace9325"

export class YVEVideoCaptions implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE Video Captions",
    name: "yveVideoCaptions",
    icon: "file:captions.svg",
    group: ["transform"],
    version: 1,
    description: "Extract word-by-word subtitles (JSON) from a video URL.",
    defaults: {
      name: "YVE Video Captions",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
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
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []
    for (let i = 0; i < items.length; i++) {
      const videoUrl = this.getNodeParameter("videoUrl", i) as string
      const language = this.getNodeParameter("language", i, "en") as string
      const model = this.getNodeParameter("model", i, "nova-3") as string
      const punctuation = this.getNodeParameter(
        "punctuation",
        i,
        false,
      ) as boolean
      const keywords = this.getNodeParameter("keywords", i, "") as string

      const keywordsArr = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)

      const response = await callDeepgramWordByWord({
        videoUrl,
        model,
        language,
        keywordsArr,
        punctuation,
        helpers: this.helpers,
        apiKey: DEEPGRAM_API_KEY,
      })
      returnData.push({ json: { response } })
    }
    return this.prepareOutputData(returnData)
  }
}

interface CallDeepgramParams {
  videoUrl: string
  model: string
  language: string
  keywordsArr: string[]
  punctuation: boolean
  helpers: IExecuteFunctions["helpers"]
  apiKey: string
}

async function callDeepgramWordByWord({
  videoUrl,
  model,
  language,
  keywordsArr,
  punctuation,
  helpers,
  apiKey,
}: CallDeepgramParams): Promise<DeepgramResponse> {
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
  })
  if (
    !response.results ||
    !response.results.channels ||
    !response.results.channels[0] ||
    !response.results.channels[0].alternatives ||
    !response.results.channels[0].alternatives[0]
  ) {
    throw new Error("Unexpected Deepgram response structure")
  }
  return response.results.channels[0].alternatives[0] as DeepgramResponse
}
