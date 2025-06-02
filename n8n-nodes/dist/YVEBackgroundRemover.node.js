"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEBackgroundRemover = void 0;
class YVEBackgroundRemover {
    constructor() {
        this.description = {
            displayName: "YVE Background Remover",
            name: "yveBackgroundRemover",
            group: ["transform"],
            icon: "file:heygen.svg",
            version: 2,
            description: "Remove background from video",
            defaults: {
                name: "YVE Background Remover",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: "Video URL",
                    name: "videoUrl",
                    type: "string",
                    default: "",
                    required: true,
                    description: "Video URL to remove background from",
                },
                {
                    displayName: "Chroma Key Filter",
                    name: "chromakeyFilter",
                    type: "string",
                    default: "chromakey=0x00FF00:0.39:0.25",
                    required: false,
                    description: "Chroma key filter to use",
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
            const videoUrl = this.getNodeParameter("videoUrl", i);
            const clientId = this.getNodeParameter("clientId", i, "");
            const chromakeyFilter = this.getNodeParameter("chromakeyFilter", i, "");
            const callbackUrl = this.evaluateExpression("{{$execution.resumeUrl}}", i);
            const executionId = this.evaluateExpression("{{$execution.id}}", i);
            const params = {
                inputUrl: videoUrl,
                chromakeyFilter,
            };
            const payload = {
                projectId: executionId + "_" + timestamp,
                callbackUrl,
                params,
                queueType: "backgroundremover",
            };
            if (clientId) {
                payload.clientId = clientId;
            }
            jobs.push(payload);
        }
        console.log("jobs", jobs);
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
exports.YVEBackgroundRemover = YVEBackgroundRemover;
