import { ICredentialType, INodeProperties } from "n8n-workflow"

export class DeepgramApi implements ICredentialType {
  name = "deepgramApi"
  displayName = "Deepgram API"
  documentationUrl = "https://developers.deepgram.com/docs/authentication"
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      default: "",
      typeOptions: {
        password: true,
      },
      required: true,
      description: "Your Deepgram API Key",
    },
  ]
}
