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
    credentials: [
      {
        name: "YVEHeyGenApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Create Video",
            value: "createVideo",
            description:
              "Create a video with an avatar and voice using HeyGen.",
          },
        ],
        default: "createVideo",
        required: true,
        description:
          "The operation to perform. Only 'Create Video' is currently supported.",
      },
      {
        displayName: "Avatar ID",
        name: "avatar_id",
        type: "string",
        default: "",
        required: true,
        description: "The unique ID of the HeyGen avatar to use in the video.",
      },
      {
        displayName: "Voice ID",
        name: "voice_id",
        type: "string",
        default: "",
        required: true,
        description:
          "The unique ID of the HeyGen voice to use for speech synthesis.",
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
        description:
          "The text to be spoken in the video (max 1500 characters).",
      },
      {
        displayName: "Additional Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        options: [
          {
            displayName: "Speed",
            name: "speed",
            type: "number",
            default: 1,
            description:
              "Voice speed. 1 is normal speed. Values < 1 are slower, > 1 are faster.",
          },
          {
            displayName: "Title",
            name: "title",
            type: "string",
            default: "",
            description: "Optional title for the generated video.",
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
            description:
              "Voice emotion, if supported by the selected voice. Not all voices support all emotions.",
          },
          {
            displayName: "Folder ID",
            name: "folder_id",
            type: "string",
            default: "",
            description: "Optional HeyGen folder ID to organize the video.",
          },
          {
            displayName: "Width",
            name: "width",
            type: "number",
            default: 1080,
            description:
              "Width of the generated video in pixels (e.g., 1080 for portrait).",
          },
          {
            displayName: "Height",
            name: "height",
            type: "number",
            default: 1920,
            description:
              "Height of the generated video in pixels (e.g., 1920 for portrait).",
          },
          {
            displayName: "Caption",
            name: "caption",
            type: "boolean",
            default: false,
            description:
              "If true, generate a caption file (subtitles) with the video.",
          },
        ],
        description: "Optional advanced options for video generation.",
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []

    // Get credentials
    const credentials = (await this.getCredentials("YVEHeyGenApi")) as any

    const apiKey = credentials.apiKey ?? ""

    if (!apiKey) {
      throw new Error(
        "[YVEHeyGen] No API key found in credentials. Please check your credential configuration.",
      )
    }

    for (let i = 0; i < items.length; i++) {
      const avatar_id = this.getNodeParameter("avatar_id", i) as string
      const voice_id = this.getNodeParameter("voice_id", i) as string
      const text = this.getNodeParameter("text", i) as string
      if (text.length > 1500) {
        throw new Error("Text must not exceed 1500 characters.")
      }
      const options = this.getNodeParameter("options", i, {}) as IDataObject
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

      let response: HeyGenGenerateResponse
      try {
        response = (await this.helpers.httpRequest({
          method: "POST",
          url: "https://api.heygen.com/v2/video/generate",
          headers: {
            "X-Api-Key": apiKey,
            "Content-Type": "application/json",
          },
          body,
          json: true,
        })) as HeyGenGenerateResponse
      } catch (err: any) {
        let status = err?.response?.status || err?.response?.statusCode
        let body = err?.response?.body
        let msg = err?.message || "Unknown error"
        throw new Error(
          `[YVEHeyGen] API error: ${msg}${status ? ` (status: ${status})` : ""}${body ? ` - ${typeof body === "string" ? body : JSON.stringify(body)}` : ""}`,
        )
      }

      const videoId = response.data?.video_id

      let statusResponse: HeyGenStatusResponse | null = null
      const pollingStart = Date.now()
      const pollingTimeout = 10 * 60 * 1000 // 10 minutes
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 10000))
        try {
          statusResponse = (await this.helpers.httpRequest({
            method: "GET",
            url: `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
            headers: {
              "X-Api-Key": apiKey,
              Accept: "application/json",
            },
            json: true,
          })) as HeyGenStatusResponse
        } catch (err: any) {
          let status = err?.response?.status || err?.response?.statusCode
          let body = err?.response?.body
          let msg = err?.message || "Unknown error"
          throw new Error(
            `[YVEHeyGen] Polling error: ${msg}${status ? ` (status: ${status})` : ""}${body ? ` - ${typeof body === "string" ? body : JSON.stringify(body)}` : ""}`,
          )
        }
        const status = statusResponse.data?.status
        if (status === "completed") {
          break
        }
        if (status === "failed" || status === "error") {
          throw new Error(
            `[YVEHeyGen] Video generation failed: ${(statusResponse.data as any)?.error || "Unknown error"}`,
          )
        }
        if (Date.now() - pollingStart > pollingTimeout) {
          throw new Error(
            "[YVEHeyGen] Polling timed out after 10 minutes. Video generation did not complete in time.",
          )
        }
      }

      if (statusResponse && typeof statusResponse === "object") {
        const d = statusResponse.data
          ? (statusResponse.data as Record<string, any>)
          : {}
        if (d.error) {
          throw new Error(`[YVEHeyGen] API returned error: ${d.error}`)
        }
        returnData.push({
          json: {
            video_url: d.video_url ?? null,
            duration: d.duration ?? null,
            data: {
              caption_url: d.caption_url ?? null,
              created_at: d.created_at ?? null,
              id: d.id ?? null,
              thumbnail_url: d.thumbnail_url ?? null,
              video_url_caption: d.video_url_caption ?? null,
            },
          },
        })
      } else {
        throw new Error("[YVEHeyGen] No valid response from HeyGen status API.")
      }
    }

    return [returnData]
  }
}
