import { ICredentialType, INodeProperties } from "n8n-workflow"

export class YVEUtilsApi implements ICredentialType {
  name = "yveUtilsApi"
  displayName = "YVE Utils API"
  documentationUrl = ""
  properties: INodeProperties[] = [
    {
      displayName: "API URL",
      name: "apiUrl",
      type: "string",
      default: "",
      required: true,
      description: "Base URL of the YVE Utils API",
    },
    {
      displayName: "API Token",
      name: "apiToken",
      type: "string",
      default: "",
      typeOptions: {
        password: true,
      },
      required: true,
      description: "API Token for YVE Utils",
    },
  ]
}
