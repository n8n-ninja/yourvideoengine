import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

export class YVEHeyGen implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE HeyGen",
    name: "yveHeyGen",
    group: ["transform"],
    icon: "file:heygen.svg",
    version: 2,
    description: "Trigger HeyGen video creation via custom Lambda.",
    defaults: {
      name: "YVE HeyGen",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: "Input Text",
        name: "input_text",
        type: "string",
        default: "Hello, how are you?",
        required: true,
        description: "Text to be spoken by the avatar",
      },
      {
        displayName: "Avatar ID",
        name: "avatar_id",
        type: "string",
        default: "8438bf0d9f6d447b91b9151d5f6b752b",
        required: true,
        description: "HeyGen avatar_id",
      },
      {
        displayName: "Voice ID",
        name: "voice_id",
        type: "string",
        default: "0e6ef9dc61bf47c7a507bb4f15c74ebc",
        required: true,
        description: "HeyGen voice_id",
      },
      {
        displayName: "Width",
        name: "width",
        type: "number",
        default: 1080,
        required: false,
        description: "Video width (optional)",
      },
      {
        displayName: "Height",
        name: "height",
        type: "number",
        default: 1920,
        required: false,
        description: "Video height (optional)",
      },
      {
        displayName: "Speed",
        name: "speed",
        type: "number",
        default: 1.0,
        required: false,
        description: "Speech speed (optional)",
      },
      {
        displayName: "Custom HeyGen API Key",
        name: "apiKey",
        type: "string",
        default: "",
        required: false,
        description: "Custom HeyGen API Key (optional)",
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
      const avatar_id = this.getNodeParameter("avatar_id", i) as string
      const input_text = this.getNodeParameter("input_text", i) as string
      const voice_id = this.getNodeParameter("voice_id", i) as string
      const speed = this.getNodeParameter("speed", i, 1.0) as number
      const apiKey = this.getNodeParameter("apiKey", i, "") as string
      const clientId = this.getNodeParameter("clientId", i, "") as string

      const callbackUrl = this.evaluateExpression(
        "{{$execution.resumeUrl}}",
        i
      ) as string

      const executionId = this.evaluateExpression(
        "{{$execution.id}}",
        i
      ) as string

      const params: Record<string, unknown> = {
        avatar_id,
        input_text,
        voice_id,
        speed,
        width: this.getNodeParameter("width", i) as number,
        height: this.getNodeParameter("height", i) as number,
      }
      if (apiKey) {
        params.apiKey = apiKey
      }
      const payload: Record<string, unknown> = {
        projectId: executionId + "_" + timestamp,
        callbackUrl,
        params,
        queueType: "heygen",
      }
      if (clientId) {
        payload.clientId = clientId
      }
      jobs.push(payload)
    }
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
