import type {
  IExecuteFunctions,
  IWebhookFunctions,
  INodeTypeDescription,
  INodeExecutionData,
  IWebhookResponseData,
} from "n8n-workflow"
import { NodeConnectionType } from "n8n-workflow"

export class YVEWait {
  description: INodeTypeDescription = {
    displayName: "YVE Wait",
    name: "yveWait",
    icon: "fa:pause-circle",
    group: ["organization"],
    version: 1,
    description:
      "Pause workflow and resume on POST to resumeUrl, passing body.",
    defaults: {
      name: "YVE Wait",
      color: "#804050",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    webhooks: [
      {
        name: "default",
        httpMethod: "POST",
        responseMode: "onReceived",
        path: "",
        restartWebhook: true,
      },
    ],
    properties: [],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    await this.putExecutionToWait(new Date("2999-12-31T23:59:59Z"))
    return []
  }

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject()
    return {
      workflowData: [
        [
          {
            json: req.body,
          },
        ],
      ],
    }
  }
}
