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
    description: "Extract subtitles from a video URL",
    defaults: {
      name: "YVE Video Captions",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
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
          {
            name: "Get Subtitles (Word by Word)",
            value: "getSubtitlesWordByWord",
            description:
              "Extract word-by-word subtitles (JSON) from a video URL.",
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
        placeholder:
          "Instructions to clean or constrain subtitle generation...",
        description:
          "Optional instructions for cleaning or constraining subtitle generation (e.g. brand names, style, etc)",
        required: false,
        displayOptions: {
          show: {
            operation: ["getSubtitles"],
          },
        },
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []
    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string
      const videoUrl = this.getNodeParameter("videoUrl", i) as string
      if (operation === "getSubtitles") {
        const format = this.getNodeParameter("format", i) as string
        const cleaningPrompt = this.getNodeParameter(
          "cleaning_prompt",
          i,
          "",
        ) as string
        const body: Record<string, unknown> = {
          url: videoUrl,
          format,
        }
        if (cleaningPrompt) {
          body.cleaning_prompt = cleaningPrompt
        }
        const response = await this.helpers.httpRequest({
          method: "POST",
          url: `${API_BASE_URL}/captions`,
          headers: {
            Authorization: API_TOKEN,
          },
          body,
          json: true,
        })
        returnData.push({ json: { [format]: response, videoUrl } })
      } else if (operation === "getAudio") {
        const cleaningPrompt = this.getNodeParameter(
          "cleaning_prompt",
          i,
          "",
        ) as string
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
      } else if (operation === "getSubtitlesWordByWord") {
        const cleaningPrompt = this.getNodeParameter(
          "cleaning_prompt",
          i,
          "",
        ) as string
        const body: Record<string, unknown> = {
          url: videoUrl,
        }
        if (cleaningPrompt) {
          body.cleaning_prompt = cleaningPrompt
        }
        const response = await this.helpers.httpRequest({
          method: "POST",
          url: `${API_BASE_URL}/captions-word-by-word`,
          headers: {
            Authorization: API_TOKEN,
          },
          body,
          json: true,
        })
        returnData.push({ json: { wordByWord: response, videoUrl } })
      }
    }
    return this.prepareOutputData(returnData)
  }
}
