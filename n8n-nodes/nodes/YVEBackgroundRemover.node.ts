import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

export class YVEBackgroundRemover implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE Background Remover",
    name: "yveBackgroundRemover",
    group: ["transform"],
    icon: "file:heygen.svg",
    version: 2,
    description: "Remove background from video",
    defaults: {
      name: "YVE Background Remover",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: "Video URL",
        name: "videoUrl",
        type: "string",
        default: "",
        required: true,
        description: "Video URL to remove background from",
      },
      {
        displayName: "Chroma Key Filter",
        name: "chromakeyFilter",
        type: "string",
        default: "chromakey=0x00FF00:0.39:0.25",
        required: false,
        description: "Chroma key filter to use",
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
      const clientId = this.getNodeParameter("clientId", i, "") as string
      const chromakeyFilter = this.getNodeParameter(
        "chromakeyFilter",
        i,
        "",
      ) as string
      const callbackUrl = this.evaluateExpression(
        "{{$execution.resumeUrl}}",
        i,
      ) as string

      const executionId = this.evaluateExpression(
        "{{$execution.id}}",
        i,
      ) as string

      const params: Record<string, unknown> = {
        inputUrl: videoUrl,
        chromakeyFilter,
      }

      const payload: Record<string, unknown> = {
        projectId: executionId + "_" + timestamp,
        callbackUrl,
        params,
        queueType: "backgroundremover",
      }
      if (clientId) {
        payload.clientId = clientId
      }
      jobs.push(payload)
    }

    console.log("jobs", jobs)
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
