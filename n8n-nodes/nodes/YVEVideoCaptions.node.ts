import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

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
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        default: "client0",
        required: false,
        description: "Client ID (optionnel)",
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const timestamp = Date.now()

    const jobs: Record<string, unknown>[] = []
    for (let i = 0; i < items.length; i++) {
      const videoUrl = this.getNodeParameter("videoUrl", i) as string
      const language = this.getNodeParameter("language", i, "en") as string
      const model = this.getNodeParameter("model", i, "nova-3") as string
      const punctuation = this.getNodeParameter(
        "punctuation",
        i,
        false
      ) as boolean
      const keywords = this.getNodeParameter("keywords", i, "") as string
      const clientId = this.getNodeParameter("clientId", i, "") as string

      const executionId = this.evaluateExpression(
        "{{$execution.id}}",
        i
      ) as string

      const callbackUrl = this.evaluateExpression(
        "{{$execution.resumeUrl}}",
        i
      ) as string
      const keywordsArr = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)

      const params: Record<string, unknown> = {
        videoUrl,
        language,
        model,
        punctuation,
        keywords: keywordsArr,
      }

      const payload: Record<string, unknown> = {
        projectId: executionId + "_" + timestamp,
        callbackUrl,
        params,
        queueType: "deepgram",
      }
      if (clientId) {
        payload.clientId = clientId
      }

      jobs.push(payload)
    }

    console.log("[YVEVideoCaptions] Enqueuing jobs", jobs)

    await this.helpers.httpRequest({
      method: "POST",
      url: process.env.QUEUES_URL!,
      body: jobs,
      json: true,
      headers: {
        "X-Api-Key": process.env.QUEUES_APIKEY!,
      },
    })
    return this.prepareOutputData([{ json: { message: "Job enqueued" } }])
  }
}
