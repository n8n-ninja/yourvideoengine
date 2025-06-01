import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"
import { QUEUES_ENDPOINTS } from "./nodes.config"

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
        displayName: "Resume Url",
        name: "resumeUrl",
        type: "string",
        default: "={{$execution.resumeUrl}}",
        required: true,
      },
      {
        displayName: "Execution Id",
        name: "executionId",
        type: "string",
        default: "={{$execution.id}}",
        required: true,
      },
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        default: "client0",
        required: false,
        description: "Client ID (optionnel)",
      },
      {
        displayName: "Environment",
        name: "environment",
        type: "options",
        options: [
          { name: "Production", value: "prod" },
          { name: "Development", value: "dev" },
        ],
        default: "prod",
        required: false,
        description: "Choose environment (prod/dev)",
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
        false
      ) as boolean
      const keywords = this.getNodeParameter("keywords", i, "") as string
      const resumeUrl = this.getNodeParameter("resumeUrl", i) as string
      const executionId = this.getNodeParameter("executionId", i) as string
      const clientId = this.getNodeParameter("clientId", i, "") as string
      const environment = this.getNodeParameter(
        "environment",
        i,
        "prod"
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
        projectId: executionId,
        callbackUrl: resumeUrl,
        params,
        queueType: "deepgram",
      }
      if (clientId) {
        payload.clientId = clientId
      }

      const { url: endpointUrl, apiKey: xApiKey } =
        QUEUES_ENDPOINTS[environment as "dev" | "prod"]

      this.helpers.httpRequest({
        method: "POST",
        url: endpointUrl,
        body: payload,
        json: true,
        headers: {
          "X-Api-Key": xApiKey,
        },
      })

      returnData.push({ json: {} })
    }
    return this.prepareOutputData(returnData)
  }
}
