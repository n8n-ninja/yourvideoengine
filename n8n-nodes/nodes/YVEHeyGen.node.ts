import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

import { QUEUES_ENDPOINTS } from "./nodes.config"

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
        displayName: "Avatar ID",
        name: "avatar_id",
        type: "string",
        default: "8438bf0d9f6d447b91b9151d5f6b752b",
        required: true,
        description: "HeyGen avatar_id",
      },

      {
        displayName: "Input Text",
        name: "input_text",
        type: "string",
        default: "Hello, how are you?",
        required: true,
        description: "Text to be spoken by the avatar",
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
        displayName: "Slug",
        name: "slug",
        type: "string",
        default: "={{'shot_' + ($itemIndex + 1)}}",
        required: false,
        description: "HeyGen slug (optional)",
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
      const avatar_id = this.getNodeParameter("avatar_id", i) as string
      const input_text = this.getNodeParameter("input_text", i) as string
      const voice_id = this.getNodeParameter("voice_id", i) as string
      const speed = this.getNodeParameter("speed", i, 1.0) as number
      let projectId = this.getNodeParameter("projectId", i, "") as string
      const apiKey = this.getNodeParameter("apiKey", i, "") as string
      const environment = this.getNodeParameter(
        "environment",
        i,
        "prod"
      ) as string
      const resumeUrl = this.getNodeParameter("resumeUrl", i) as string
      const executionId = this.getNodeParameter("executionId", i) as string
      let callbackUrl = this.getNodeParameter("callbackUrl", i, "") as string
      if (!callbackUrl) {
        callbackUrl = resumeUrl
      }
      // Use executionId if projectId not provided
      if (!projectId) {
        projectId = executionId
      }
      const clientId = this.getNodeParameter("clientId", i, "") as string

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
        projectId,
        callbackUrl,
        params,
        queueType: "heygen",
      }
      if (clientId) {
        payload.clientId = clientId
      }

      const { url: endpointUrl, apiKey: xApiKey } =
        QUEUES_ENDPOINTS[environment as "dev" | "prod"]

      const response = await this.helpers.httpRequest({
        method: "POST",
        url: endpointUrl,
        body: payload,
        json: true,
        headers: {
          "X-Api-Key": xApiKey,
        },
      })
      returnData.push({ json: response })
    }
    return this.prepareOutputData(returnData)
  }
}
