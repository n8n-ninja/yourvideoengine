import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

export class YVERenderVideoBackgroundComment implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'YVERenderVideoBackgroundComment',
    name: 'YVERenderVideoBackgroundComment',
    group: ['transform'],
    version: 1,
    icon: "file:heygen.svg",
    description: 'Node auto-généré pour le template VideoBackgroundComment.props.ts',
    defaults: {
      name: 'YVERenderVideoBackgroundComment',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      // Champs dynamiques générés
      {
      displayName: 'hook',
      name: 'hook',
      type: 'string',
      default: 'This guy is a genuis!',
      required: false,
    },
      {
      displayName: 'backgroundUrl',
      name: 'backgroundUrl',
      type: 'string',
      default: 'https://fynsadrjafvxmynpmexz.supabase.co/storage/v1/object/public/yourvideoengines-upload/thais-id/1749056669793-WhatsApp_Video_2025-05-29_at_20.47.28.mp4',
      required: false,
    },
      {
      displayName: 'overlayUrl',
      name: 'overlayUrl',
      type: 'string',
      default: 'https://diwa7aolcke5u.cloudfront.net/jobs/b2ddc2dc-44a5-4790-aff9-33c7b06b0b5f.webm',
      required: false,
    },
      {
      displayName: 'duration',
      name: 'duration',
      type: 'number',
      default: 9.057,
      required: false,
    },
      {
      displayName: 'captions',
      name: 'captions',
      type: 'json',
      default: '[{\"word\":\"those\",\"start\":0.16,\"end\":0.64,\"confidence\":0.9817223},{\"word\":\"people\",\"start\":0.64,\"end\":1.12,\"confidence\":0.86048317},{\"word\":\"they\",\"start\":1.12,\"end\":1.28,\"confidence\":0.9975599},{\"word\":\"are\",\"start\":1.28,\"end\":1.4399999,\"confidence\":0.5323789},{\"word\":\"so\",\"start\":1.4399999,\"end\":1.5999999,\"confidence\":0.98462695},{\"word\":\"hilarious\",\"start\":1.5999999,\"end\":2.24,\"confidence\":0.8230935},{\"word\":\"i\",\"start\":2.24,\"end\":2.32,\"confidence\":0.99965537},{\"word\":\"just\",\"start\":2.32,\"end\":2.48,\"confidence\":0.9954},{\"word\":\"can\'t\",\"start\":2.48,\"end\":2.72,\"confidence\":0.9984536},{\"word\":\"stop\",\"start\":2.72,\"end\":2.96,\"confidence\":0.99904937},{\"word\":\"laughing\",\"start\":2.96,\"end\":3.28,\"confidence\":0.9997142},{\"word\":\"when\",\"start\":3.28,\"end\":3.52,\"confidence\":0.9983791},{\"word\":\"i\",\"start\":3.52,\"end\":3.6,\"confidence\":0.9930443},{\"word\":\"look\",\"start\":3.6,\"end\":3.76,\"confidence\":0.99667335},{\"word\":\"at\",\"start\":3.76,\"end\":3.84,\"confidence\":0.9984792},{\"word\":\"them\",\"start\":3.84,\"end\":4.3199997,\"confidence\":0.8950557},{\"word\":\"and\",\"start\":4.3199997,\"end\":4.56,\"confidence\":0.9982957},{\"word\":\"guess\",\"start\":4.56,\"end\":4.88,\"confidence\":0.98839825},{\"word\":\"why\",\"start\":4.88,\"end\":5.52,\"confidence\":0.8608279},{\"word\":\"their\",\"start\":5.68,\"end\":6,\"confidence\":0.8821414},{\"word\":\"shoes\",\"start\":6,\"end\":6.8,\"confidence\":0.7572926},{\"word\":\"they\",\"start\":6.96,\"end\":7.2,\"confidence\":0.9986212},{\"word\":\"were\",\"start\":7.2,\"end\":7.3599997,\"confidence\":0.9952443},{\"word\":\"crocs\",\"start\":7.3599997,\"end\":7.8399997,\"confidence\":0.88075846}]',
      required: false,
    },
      {
      displayName: 'color',
      name: 'color',
      type: 'string',
      default: '#F92F63',
      required: false,
    },
      {
      displayName: 'position',
      name: 'position',
      type: 'json',
      default: '\"right\"',
      required: false,
    },
      {
      displayName: 'size',
      name: 'size',
      type: 'json',
      default: '\"large\"',
      required: false,
    },
      // Champs fixes
    
       {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        default: "client0",
        required: false,
        description: "Client ID (optionnel)",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const timestamp = Date.now()
    
    const jobs: Record<string, unknown>[] = [];
    for (let i = 0; i < items.length; i++) {
      // Récupérer les paramètres du formulaire
      const params: Record<string, unknown> = {
                hook: this.getNodeParameter('hook', i),
        backgroundUrl: this.getNodeParameter('backgroundUrl', i),
        overlayUrl: this.getNodeParameter('overlayUrl', i),
        duration: this.getNodeParameter('duration', i),
        captions: this.getNodeParameter('captions', i),
        color: this.getNodeParameter('color', i),
        position: this.getNodeParameter('position', i),
        size: this.getNodeParameter('size', i),
      };
      const executionId = this.evaluateExpression(
        "{{$execution.id}}",
        i
      ) as string
      const callbackUrl = this.evaluateExpression(
        "{{$execution.resumeUrl}}",
        i
      ) as string
      const clientId = this.getNodeParameter('clientId', i) as string;
      const payload: Record<string, unknown> = {
        projectId: executionId + "_" + timestamp,
        callbackUrl,
        params: {
          composition: 'VideoBackgroundComment',
          inputProps: params
        },
        queueType: 'remotion',
      };
      if (clientId) {
        payload.clientId = clientId;
      }
      jobs.push(payload);
    }
    await this.helpers.httpRequest({
      method: 'POST',
      url: process.env.QUEUES_URL!,
      body: jobs,
      json: true,
      headers: {
        'X-Api-Key': process.env.QUEUES_APIKEY!,
      },
    });
    return this.prepareOutputData([{ json: { message: "Job enqueued" } }]);
  }
} 