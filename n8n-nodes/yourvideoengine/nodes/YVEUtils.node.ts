import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

const UTILS_API_BASE_URL =
  "http://n04sg488kwcss8ow04kk4c8k.91.107.237.123.sslip.io"
const UTILS_API_TOKEN = "Bearer sk_live_2b87210c8f3e4d3e9a23a09d5cf7d144"

export class YVEUtils implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE Utils",
    name: "yveUtils",
    icon: "file:utils.svg",
    group: ["transform"],
    version: 1,
    description: "Various video utilities (audio extraction, ...)",
    defaults: {
      name: "YVE Utils",
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
            name: "Extract Audio from Video",
            value: "extractAudioFromVideo",
            description: "Extract audio (mp3) from a video URL.",
          },
          {
            name: "Get Video Duration",
            value: "getVideoDuration",
            description: "Get the duration of a video.",
          },
        ],
        default: "extractAudioFromVideo",
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
            operation: ["extractAudioFromVideo", "getVideoDuration"],
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
      if (operation === "extractAudioFromVideo") {
        const body: Record<string, unknown> = {
          url: videoUrl,
        }
        const response = await this.helpers.httpRequest({
          method: "POST",
          url: `${UTILS_API_BASE_URL}/mp3`,
          headers: {
            Authorization: UTILS_API_TOKEN,
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
      } else if (operation === "getVideoDuration") {
        const body: Record<string, unknown> = {
          url: videoUrl,
        }
        const response = await this.helpers.httpRequest({
          method: "POST",
          url: `${UTILS_API_BASE_URL}/duration`,
          headers: {
            Authorization: UTILS_API_TOKEN,
          },
          body,
          json: true,
        })
        returnData.push({
          json: response,
        })
      }
    }
    return this.prepareOutputData(returnData)
  }
}
