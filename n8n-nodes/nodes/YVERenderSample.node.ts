import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

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
      default: 'Sample text',
      required: false,
    },
      {
      displayName: 'intro',
      name: 'intro',
      type: 'string',
      default: 'https://diwa7aolcke5u.cloudfront.net/uploads/0d9256b1c3494d71adc592ffebf7ba85.mp4',
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
      displayName: 'introCaption',
      name: 'introCaption',
      type: 'json',
      default: '[{\"word\":\"the\",\"start\":0.16,\"end\":0.48,\"confidence\":0.9627397},{\"word\":\"most\",\"start\":0.48,\"end\":0.71999997,\"confidence\":0.9995771},{\"word\":\"powerful\",\"start\":0.71999997,\"end\":1.04,\"confidence\":0.99909914},{\"word\":\"solution\",\"start\":1.04,\"end\":1.4399999,\"confidence\":0.9988889},{\"word\":\"to\",\"start\":1.4399999,\"end\":1.68,\"confidence\":0.9996848},{\"word\":\"automate\",\"start\":1.68,\"end\":2,\"confidence\":0.9996444},{\"word\":\"your\",\"start\":2,\"end\":2.24,\"confidence\":0.99906975},{\"word\":\"video\",\"start\":2.24,\"end\":2.56,\"confidence\":0.9994635},{\"word\":\"production\",\"start\":2.56,\"end\":2.96,\"confidence\":0.9990239},{\"word\":\"using\",\"start\":2.96,\"end\":3.28,\"confidence\":0.99762136},{\"word\":\"the\",\"start\":3.28,\"end\":3.4399998,\"confidence\":0.9985489},{\"word\":\"latest\",\"start\":3.4399998,\"end\":3.76,\"confidence\":0.9998343},{\"word\":\"ai\",\"start\":3.76,\"end\":4.16,\"confidence\":0.9933907},{\"word\":\"technology\",\"start\":4.16,\"end\":4.64,\"confidence\":0.9472135}]',
      required: false,
    },
      {
      displayName: 'body',
      name: 'body',
      type: 'string',
      default: 'https://diwa7aolcke5u.cloudfront.net/uploads/9720d87ed3ef47418eaff1bb8b3af4eb.mp4',
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
      displayName: 'bodyCaption',
      name: 'bodyCaption',
      type: 'json',
      default: '[{\"word\":\"the\",\"start\":0.16,\"end\":0.48,\"confidence\":0.9627397},{\"word\":\"most\",\"start\":0.48,\"end\":0.71999997,\"confidence\":0.9995771},{\"word\":\"powerful\",\"start\":0.71999997,\"end\":1.04,\"confidence\":0.99909914},{\"word\":\"solution\",\"start\":1.04,\"end\":1.4399999,\"confidence\":0.9988889},{\"word\":\"to\",\"start\":1.4399999,\"end\":1.68,\"confidence\":0.9996848},{\"word\":\"automate\",\"start\":1.68,\"end\":2,\"confidence\":0.9996444},{\"word\":\"your\",\"start\":2,\"end\":2.24,\"confidence\":0.99906975},{\"word\":\"video\",\"start\":2.24,\"end\":2.56,\"confidence\":0.9994635},{\"word\":\"production\",\"start\":2.56,\"end\":2.96,\"confidence\":0.9990239},{\"word\":\"using\",\"start\":2.96,\"end\":3.28,\"confidence\":0.99762136},{\"word\":\"the\",\"start\":3.28,\"end\":3.4399998,\"confidence\":0.9985489},{\"word\":\"latest\",\"start\":3.4399998,\"end\":3.76,\"confidence\":0.9998343},{\"word\":\"ai\",\"start\":3.76,\"end\":4.16,\"confidence\":0.9933907},{\"word\":\"technology\",\"start\":4.16,\"end\":4.64,\"confidence\":0.9472135}]',
      required: false,
    },
      {
      displayName: 'outro',
      name: 'outro',
      type: 'string',
      default: 'https://diwa7aolcke5u.cloudfront.net/uploads/ddcc9b95cc87473fa66f9501a44f1907.mp4',
      required: false,
    },
      {
      displayName: 'outroDuration',
      name: 'outroDuration',
      type: 'number',
      default: 3,
      required: false,
    },
      {
      displayName: 'outroCaption',
      name: 'outroCaption',
      type: 'json',
      default: '[{\"word\":\"the\",\"start\":0.16,\"end\":0.48,\"confidence\":0.9627397},{\"word\":\"most\",\"start\":0.48,\"end\":0.71999997,\"confidence\":0.9995771},{\"word\":\"powerful\",\"start\":0.71999997,\"end\":1.04,\"confidence\":0.99909914},{\"word\":\"solution\",\"start\":1.04,\"end\":1.4399999,\"confidence\":0.9988889},{\"word\":\"to\",\"start\":1.4399999,\"end\":1.68,\"confidence\":0.9996848},{\"word\":\"automate\",\"start\":1.68,\"end\":2,\"confidence\":0.9996444},{\"word\":\"your\",\"start\":2,\"end\":2.24,\"confidence\":0.99906975},{\"word\":\"video\",\"start\":2.24,\"end\":2.56,\"confidence\":0.9994635},{\"word\":\"production\",\"start\":2.56,\"end\":2.96,\"confidence\":0.9990239},{\"word\":\"using\",\"start\":2.96,\"end\":3.28,\"confidence\":0.99762136},{\"word\":\"the\",\"start\":3.28,\"end\":3.4399998,\"confidence\":0.9985489},{\"word\":\"latest\",\"start\":3.4399998,\"end\":3.76,\"confidence\":0.9998343},{\"word\":\"ai\",\"start\":3.76,\"end\":4.16,\"confidence\":0.9933907},{\"word\":\"technology\",\"start\":4.16,\"end\":4.64,\"confidence\":0.9472135}]',
      required: false,
    },
      {
      displayName: 'music',
      name: 'music',
      type: 'string',
      default: 'https://diwa7aolcke5u.cloudfront.net/uploads/1748099564616-mbgrk0.mp3',
      required: false,
    },
      {
      displayName: 'emoji',
      name: 'emoji',
      type: 'string',
      default: '100',
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
                title: this.getNodeParameter('title', i),
        intro: this.getNodeParameter('intro', i),
        introDuration: this.getNodeParameter('introDuration', i),
        introCaption: this.getNodeParameter('introCaption', i),
        body: this.getNodeParameter('body', i),
        bodyDuration: this.getNodeParameter('bodyDuration', i),
        bodyCaption: this.getNodeParameter('bodyCaption', i),
        outro: this.getNodeParameter('outro', i),
        outroDuration: this.getNodeParameter('outroDuration', i),
        outroCaption: this.getNodeParameter('outroCaption', i),
        music: this.getNodeParameter('music', i),
        emoji: this.getNodeParameter('emoji', i),
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
          composition: 'Sample',
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