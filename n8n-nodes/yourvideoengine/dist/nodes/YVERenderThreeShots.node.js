"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVERenderThreeShots = void 0;
const remotion_nodes_config_1 = require("./remotion-nodes.config");
class YVERenderThreeShots {
    constructor() {
        this.description = {
            displayName: 'YVERenderThreeShots',
            name: 'YVERenderThreeShots',
            group: ['transform'],
            version: 1,
            icon: "file:heygen.svg",
            description: 'Node auto-généré pour le template ThreeShots.props.ts',
            defaults: {
                name: 'YVERenderThreeShots',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
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
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            // Récupérer les paramètres du formulaire
            const params = {
                title: this.getNodeParameter('title', i),
            };
            const resumeUrl = this.getNodeParameter('resumeUrl', i);
            const executionId = this.getNodeParameter('executionId', i);
            const environment = this.getNodeParameter('environment', i);
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
            const { url: endpointUrl, apiKey: xApiKey } = remotion_nodes_config_1.REMOTION_ENDPOINTS[environment];
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
exports.YVERenderThreeShots = YVERenderThreeShots;
