import {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IExecuteFunctions,
  NodeConnectionType,
  IDataObject,
} from "n8n-workflow"

type HeyGenGenerateResponse = {
  data?: { video_id: string }
  [key: string]: unknown
}
type HeyGenStatusResponse = {
  data?: { status: string }
  [key: string]: unknown
}

export class YVEHeyGen implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE HeyGen",
    name: "yveHeyGen",
    group: ["transform"],
    icon: "file:heygen.svg",
    version: 1,
    description: "Create videos with HeyGen avatars",
    defaults: {
      name: "YVE HeyGen",
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
            name: "Create Video",
            value: "createVideo",
            description: "Create a video with an avatar and voice",
          },
        ],
        default: "createVideo",
        required: true,
      },
      {
        displayName: "Avatar ID",
        name: "avatar_id",
        type: "string",
        default: "",
        required: true,
        description: "The ID of the avatar to use",
      },
      {
        displayName: "Voice ID",
        name: "voice_id",
        type: "string",
        default: "",
        required: true,
        description: "The ID of the voice to use",
      },
      {
        displayName: "Text",
        name: "text",
        type: "string",
        typeOptions: {
          rows: 6,
        },
        default: "",
        required: true,
        description: "The text to be spoken in the video (max 1500 characters)",
      },
      {
        displayName: "Additional Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        options: [
          {
            displayName: "API Key",
            name: "apiKey",
            type: "string",
            default:
              "NTA1ZDliMjc3OTE5NDFmYmIxMGIzZWI3ZTVkZDg4MjAtMTcxOTU5NzI0Nw==",
            description: "The API key to use for this request",
          },
          {
            displayName: "Speed",
            name: "speed",
            type: "number",
            default: 1,
            description: "Voice speed",
          },
          {
            displayName: "Title",
            name: "title",
            type: "string",
            default: "",
            description: "Optional video title",
          },
          {
            displayName: "Emotion",
            name: "emotion",
            type: "options",
            options: [
              { name: "Excited", value: "Excited" },
              { name: "Friendly", value: "Friendly" },
              { name: "Serious", value: "Serious" },
              { name: "Soothing", value: "Soothing" },
              { name: "Broadcaster", value: "Broadcaster" },
            ],
            default: "",
            description: "Voice emotion, if supported by the selected voice.",
          },
          {
            displayName: "Folder ID",
            name: "folder_id",
            type: "string",
            default: "",
            description: "Optional folder ID to organize the video in HeyGen.",
          },
          {
            displayName: "Width",
            name: "width",
            type: "number",
            default: 1080,
            description: "Width of the video in pixels",
          },
          {
            displayName: "Height",
            name: "height",
            type: "number",
            default: 1920,
            description: "Height of the video in pixels",
          },
          {
            displayName: "Caption",
            name: "caption",
            type: "boolean",
            default: false,
            description: "Generate a caption file with the video.",
          },
        ],
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []

    for (let i = 0; i < items.length; i++) {
      const avatar_id = this.getNodeParameter("avatar_id", i) as string
      const voice_id = this.getNodeParameter("voice_id", i) as string
      const text = this.getNodeParameter("text", i) as string
      if (text.length > 1500) {
        throw new Error("Text must not exceed 1500 characters.")
      }
      const options = this.getNodeParameter("options", i, {}) as IDataObject
      const apiKey = options.apiKey as string
      const speed = (options.speed as number) ?? 1
      const title = (options.title as string) ?? ""
      const emotion = (options.emotion as string) ?? ""
      const folder_id = (options.folder_id as string) ?? ""
      const width = (options.width as number) ?? 1080
      const height = (options.height as number) ?? 1920
      const caption = (options.caption as boolean) ?? false

      const voice: Record<string, unknown> = {
        type: "text",
        input_text: text,
        voice_id,
        speed,
      }
      if (emotion) {
        voice.emotion = emotion
      }

      const body: Record<string, unknown> = {
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id,
              avatar_style: "normal",
            },
            voice,
          },
        ],
        dimension: {
          width,
          height,
        },
      }
      if (title) {
        body.title = title
      }
      if (folder_id) {
        body.folder_id = folder_id
      }
      if (caption) {
        body.caption = true
      }

      const response = (await this.helpers.httpRequest({
        method: "POST",
        url: "https://api.heygen.com/v2/video/generate",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
        body,
        json: true,
      })) as HeyGenGenerateResponse

      const videoId = response.data?.video_id

      let statusResponse: HeyGenStatusResponse | null = null
      let attempts = 0
      const maxAttempts = 50
      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 10000))
        statusResponse = (await this.helpers.httpRequest({
          method: "GET",
          url: `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
          headers: {
            "X-Api-Key": apiKey,
            Accept: "application/json",
          },
          json: true,
        })) as HeyGenStatusResponse
        if (statusResponse.data?.status === "completed") {
          break
        }
        attempts++
      }

      if (statusResponse && typeof statusResponse === "object") {
        returnData.push({ json: statusResponse as unknown as IDataObject })
      } else {
        returnData.push({
          json: { error: "No valid response from HeyGen status API" },
        })
      }
    }

    return [returnData]
  }
}
