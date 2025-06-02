"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEFlux = void 0;
class YVEFlux {
    constructor() {
        this.description = {
            displayName: "YVE Flux",
            name: "yveFlux",
            group: ["transform"],
            icon: "file:heygen.svg",
            version: 2,
            description: "Create images with flux ",
            defaults: {
                name: "YVE Flux",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: "Prompt",
                    name: "prompt",
                    type: "string",
                    default: "A cute cat in a hat.",
                    required: true,
                    description: "Prompt to generate image",
                },
                {
                    displayName: "Width",
                    name: "width",
                    type: "number",
                    default: 1080,
                    required: false,
                    description: "Video width (optional)",
                },
                {
                    displayName: "Height",
                    name: "height",
                    type: "number",
                    default: 1920,
                    required: false,
                    description: "Video height (optional)",
                },
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
            const prompt = this.getNodeParameter("prompt", i);
            const clientId = this.getNodeParameter("clientId", i, "");
            const callbackUrl = this.evaluateExpression("{{$execution.resumeUrl}}", i);
            const executionId = this.evaluateExpression("{{$execution.id}}", i);
            const params = {
                input: {
                    prompt,
                    width: this.getNodeParameter("width", i),
                    height: this.getNodeParameter("height", i),
                },
            };
            const payload = {
                projectId: executionId + "_" + timestamp,
                callbackUrl,
                params,
                queueType: "flux",
            };
            if (clientId) {
                payload.clientId = clientId;
            }
            jobs.push(payload);
        }
        await this.helpers.httpRequest({
            method: "POST",
            url: process.env.QUEUES_URL,
            body: jobs,
            json: true,
            headers: {
                "X-Api-Key": process.env.QUEUES_APIKEY,
            },
        });
        return this.prepareOutputData([{ json: { message: "Job enqueued" } }]);
    }
}
exports.YVEFlux = YVEFlux;
