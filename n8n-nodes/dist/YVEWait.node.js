"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEWait = void 0;
class YVEWait {
    constructor() {
        this.description = {
            displayName: "YVE Wait",
            name: "yveWait",
            icon: "fa:pause-circle",
            group: ["organization"],
            version: 1,
            description: "Pause workflow and resume on POST to resumeUrl, passing body.",
            defaults: {
                name: "YVE Wait",
                color: "#804050",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            webhooks: [
                {
                    name: "default",
                    httpMethod: "POST",
                    responseMode: "onReceived",
                    path: "",
                    restartWebhook: true,
                },
            ],
            properties: [],
        };
    }
    async execute() {
        await this.putExecutionToWait(new Date("2999-12-31T23:59:59Z"));
        return [];
    }
    async webhook() {
        const req = this.getRequestObject();
        return {
            workflowData: [
                [
                    {
                        json: req.body,
                    },
                ],
            ],
        };
    }
}
exports.YVEWait = YVEWait;
