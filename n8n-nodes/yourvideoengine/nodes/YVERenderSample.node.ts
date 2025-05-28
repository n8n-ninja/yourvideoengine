import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"
import { REMOTION_ENDPOINTS } from './remotion-nodes.config';

export class YVERenderSample implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'YVERenderSample',
    name: 'YVERenderSample',
    group: ['transform'],
    version: 1,
    icon: "file:heygen.svg",
    description: 'Node auto-généré pour le template Sample.props.ts',
    defaults: {
      name: 'YVERenderSample',
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
      {
      displayName: 'intro',
      name: 'intro',
      type: 'string',
      default: "https://diwa7aolcke5u.cloudfront.net/uploads/0d9256b1c3494d71adc592ffebf7ba85.mp4",
      required: false,
    },
      {
      displayName: 'introDuration',
      name: 'introDuration',
      type: 'number',
      default: 5.36,
      required: false,
    },
      {
      displayName: 'body',
      name: 'body',
      type: 'string',
      default: "https://diwa7aolcke5u.cloudfront.net/uploads/9720d87ed3ef47418eaff1bb8b3af4eb.mp4",
      required: false,
    },
      {
      displayName: 'bodyDuration',
      name: 'bodyDuration',
      type: 'number',
      default: 2.8,
      required: false,
    },
      {
      displayName: 'outro',
      name: 'outro',
      type: 'string',
      default: "https://diwa7aolcke5u.cloudfront.net/uploads/ddcc9b95cc87473fa66f9501a44f1907.mp4",
      required: false,
    },
      {
      displayName: 'outroDuration',
      name: 'outroDuration',
      type: 'number',
      default: 3,
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
        intro: this.getNodeParameter('intro', i),
        introDuration: this.getNodeParameter('introDuration', i),
        body: this.getNodeParameter('body', i),
        bodyDuration: this.getNodeParameter('bodyDuration', i),
        outro: this.getNodeParameter('outro', i),
        outroDuration: this.getNodeParameter('outroDuration', i),
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
          composition: 'Sample',
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