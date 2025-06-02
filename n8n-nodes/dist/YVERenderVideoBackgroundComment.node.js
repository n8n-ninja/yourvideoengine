"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVERenderVideoBackgroundComment = void 0;
class YVERenderVideoBackgroundComment {
    constructor() {
        this.description = {
            displayName: 'YVERenderVideoBackgroundComment',
            name: 'YVERenderVideoBackgroundComment',
            group: ['transform'],
            version: 1,
            icon: "file:heygen.svg",
            description: 'Node auto-généré pour le template VideoBackgroundComment.props.ts',
            defaults: {
                name: 'YVERenderVideoBackgroundComment',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                // Champs dynamiques générés
                {
                    displayName: 'hook',
                    name: 'hook',
                    type: 'string',
                    default: "You will be amazed!",
                    required: false,
                },
                {
                    displayName: 'backgroundUrl',
                    name: 'backgroundUrl',
                    type: 'string',
                    default: "https://diwa7aolcke5u.cloudfront.net/uploads/1748871894318-samplevbg.mp4",
                    required: false,
                },
                {
                    displayName: 'overlayUrl',
                    name: 'overlayUrl',
                    type: 'string',
                    default: "https://your-video-engine-uploads.s3.amazonaws.com/jobs/32c5d93d-b82e-4f32-b9d4-d0f9cd353638.webm",
                    required: false,
                },
                {
                    displayName: 'duration',
                    name: 'duration',
                    type: 'number',
                    default: 2.03,
                    required: false,
                },
                {
                    displayName: 'captions',
                    name: 'captions',
                    type: 'string',
                    default: [{ "word": "the", "start": 0.16, "end": 0.48, "confidence": 0.9627397 }, { "word": "most", "start": 0.48, "end": 0.71999997, "confidence": 0.9995771 }, { "word": "powerful", "start": 0.71999997, "end": 1.04, "confidence": 0.99909914 }, { "word": "solution", "start": 1.04, "end": 1.4399999, "confidence": 0.9988889 }],
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
    }
    async execute() {
        const items = this.getInputData();
        const timestamp = Date.now();
        const jobs = [];
        for (let i = 0; i < items.length; i++) {
            // Récupérer les paramètres du formulaire
            const params = {
                hook: this.getNodeParameter('hook', i),
                backgroundUrl: this.getNodeParameter('backgroundUrl', i),
                overlayUrl: this.getNodeParameter('overlayUrl', i),
                duration: this.getNodeParameter('duration', i),
                captions: this.getNodeParameter('captions', i),
            };
            const executionId = this.evaluateExpression("{{$execution.id}}", i);
            const callbackUrl = this.evaluateExpression("{{$execution.resumeUrl}}", i);
            const clientId = this.getNodeParameter('clientId', i);
            const payload = {
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
            url: process.env.QUEUES_URL,
            body: jobs,
            json: true,
            headers: {
                'X-Api-Key': process.env.QUEUES_APIKEY,
            },
        });
        return this.prepareOutputData([{ json: { message: "Job enqueued" } }]);
    }
}
exports.YVERenderVideoBackgroundComment = YVERenderVideoBackgroundComment;
