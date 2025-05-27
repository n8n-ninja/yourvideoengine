import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"
import { REMOTION_ENDPOINTS } from './remotion-nodes.config';

export class YVERenderThreeShots implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'YVERenderThreeShots',
    name: 'YVERenderThreeShots',
    group: ['transform'],
    version: 1,
    icon: "file:heygen.svg",
    description: 'Node auto-généré pour le template ThreeShots.props.ts',
    defaults: {
      name: 'YVERenderThreeShots',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      // Champs dynamiques générés
      {
      displayName: 'title',
      name: 'title',
      type: 'string',
      default: "Sample text",
      required: false,
    },
      // Champs fixes
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
        displayName: "Environment",
        name: "environment",
        type: "options",
        options: [
          { name: "Production", value: "prod" },
          { name: "Development", value: "dev" },
        ],
        default: "prod",
        description: "Choose environment (prod/dev)",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    for (let i = 0; i < items.length; i++) {
      // Récupérer les paramètres du formulaire
      const params: Record<string, unknown> = {
                title: this.getNodeParameter('title', i),
      };
      const resumeUrl = this.getNodeParameter('resumeUrl', i) as string;
      const executionId = this.getNodeParameter('executionId', i) as string;
      const environment = this.getNodeParameter('environment', i) as 'dev' | 'prod';
      const projectId = executionId;
      const callbackUrl = resumeUrl;
      const payload = {
        projectId,
        callbackUrl,
        params: {
          composition: 'ThreeShots',
          inputProps: params
        },
        queueType: 'remotion',
      };
      const { url: endpointUrl, apiKey: xApiKey } = REMOTION_ENDPOINTS[environment];
      const response = await this.helpers.httpRequest({
        method: 'POST',
        url: endpointUrl,
        body: payload,
        json: true,
        headers: {
          'X-Api-Key': xApiKey,
        },
      });
      returnData.push({ json: response });
    }
    return this.prepareOutputData(returnData);
  }
} 