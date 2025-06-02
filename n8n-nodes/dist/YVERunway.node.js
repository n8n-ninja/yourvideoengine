"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVERunway = void 0;
class YVERunway {
    constructor() {
        this.description = {
            displayName: "YVE Runway",
            name: "yveRunway",
            group: ["transform"],
            icon: "file:heygen.svg",
            version: 2,
            description: "Create videos from images with Runway",
            defaults: {
                name: "YVE Runway",
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
                    description: "Prompt to generate video",
                },
                {
                    displayName: "Image Url",
                    name: "imageUrl",
                    type: "string",
                    default: "",
                    required: true,
                    description: "Image to generate video from",
                },
                // '"1280:720" | "720:1280" | "1104:832" | "832:1104" | "960:960" | "1584:672" | "1280:768" | "768:1280"
                {
                    displayName: "Ratio",
                    name: "ratio",
                    type: "options",
                    default: "720:1280",
                    required: false,
                    description: "Video ratio (optional)",
                    options: [
                        {
                            name: "1280:720",
                            value: "1280:720",
                        },
                        {
                            name: "720:1280",
                            value: "720:1280",
                        },
                        {
                            name: "1104:832",
                            value: "1104:832",
                        },
                        {
                            name: "832:1104",
                            value: "832:1104",
                        },
                        {
                            name: "960:960",
                            value: "960:960",
                        },
                        {
                            name: "1584:672",
                            value: "1584:672",
                        },
                        {
                            name: "1280:768",
                            value: "1280:768",
                        },
                        {
                            name: "768:1280",
                            value: "768:1280",
                        },
                    ],
                },
                {
                    displayName: "Duration",
                    name: "duration",
                    type: "number",
                    default: 10,
                    required: false,
                    description: "Video duration (optional)",
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
            const imageUrl = this.getNodeParameter("imageUrl", i);
            const ratio = this.getNodeParameter("ratio", i);
            const duration = this.getNodeParameter("duration", i, 5);
            const clientId = this.getNodeParameter("clientId", i, "");
            const callbackUrl = this.evaluateExpression("{{$execution.resumeUrl}}", i);
            const executionId = this.evaluateExpression("{{$execution.id}}", i);
            const params = {
                prompt,
                imageUrl,
                ratio,
                duration,
            };
            const payload = {
                projectId: executionId + "_" + timestamp,
                callbackUrl,
                params,
                queueType: "runway",
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
exports.YVERunway = YVERunway;
