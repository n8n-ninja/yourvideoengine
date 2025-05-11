import { ICredentialType, INodeProperties } from "n8n-workflow"

export class YVEHeyGenApi implements ICredentialType {
  name = "YVEHeyGenApi"
  displayName = "YVE HeyGen API"
  documentationUrl = "https://docs.heygen.com/reference/overview"
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      default: "",
      required: true,
      description: "Your HeyGen API Key.",
    },
  ]
}
