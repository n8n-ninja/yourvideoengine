import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

export class YVEFlux implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE Flux",
    name: "yveFlux",
    group: ["transform"],
    icon: "file:heygen.svg",
    version: 2,
    description: "Create images with flux ",
    defaults: {
      name: "YVE Flux",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: "Prompt",
        name: "prompt",
        type: "string",
        default: "A cute cat in a hat.",
        required: true,
        description: "Prompt to generate image",
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
      const prompt = this.getNodeParameter("prompt", i) as string
      const clientId = this.getNodeParameter("clientId", i, "") as string

      const callbackUrl = this.evaluateExpression(
        "{{$execution.resumeUrl}}",
        i,
      ) as string

      const executionId = this.evaluateExpression(
        "{{$execution.id}}",
        i,
      ) as string

      const params: Record<string, unknown> = {
        input: {
          prompt,
          width: this.getNodeParameter("width", i) as number,
          height: this.getNodeParameter("height", i) as number,
        },
      }

      const payload: Record<string, unknown> = {
        projectId: executionId + "_" + timestamp,
        callbackUrl,
        params,
        queueType: "flux",
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
