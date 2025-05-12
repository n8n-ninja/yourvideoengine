import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

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
    credentials: [
      {
        name: "yveUtilsApi",
        required: true,
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []
    const credentials = (await this.getCredentials("yveUtilsApi")) as {
      apiUrl: string
      apiToken: string
    }
    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string
      const videoUrl = this.getNodeParameter("videoUrl", i) as string
      if (operation === "extractAudioFromVideo") {
        const body: Record<string, unknown> = {
          url: videoUrl,
        }
        const response = await this.helpers.httpRequest({
          method: "POST",
          url: `${credentials.apiUrl}/mp3`,
          headers: {
            Authorization: `Bearer ${credentials.apiToken}`,
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
          url: `${credentials.apiUrl}/duration`,
          headers: {
            Authorization: `Bearer ${credentials.apiToken}`,
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
