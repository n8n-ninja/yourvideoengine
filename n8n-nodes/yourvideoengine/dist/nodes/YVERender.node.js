"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVERender = void 0;
class YVERender {
    constructor() {
        this.description = {
            displayName: "YVE Render",
            name: "yveRender",
            group: ["transform"],
            icon: "file:heygen.svg",
            version: 1,
            description: "Trigger HeyGen video rendering via custom Lambda with raw JSON input.",
            defaults: {
                name: "YVE Render",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: "Input JSON",
                    name: "input_json",
                    type: "string",
                    typeOptions: {
                        rows: 10,
                    },
                    default: "",
                    required: true,
                    description: "Raw JSON parameters for HeyGen video rendering.",
                },
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
            const inputJsonRaw = this.getNodeParameter("input_json", i);
            let params;
            try {
                params = JSON.parse(inputJsonRaw);
            }
            catch (err) {
                throw new Error("Invalid JSON in Input JSON field: " + err);
            }
            const resumeUrl = this.getNodeParameter("resumeUrl", i);
            const executionId = this.getNodeParameter("executionId", i);
            const environment = this.getNodeParameter("environment", i);
            const projectId = executionId;
            const callbackUrl = resumeUrl;
            const payload = {
                projectId,
                callbackUrl,
                params,
                queueType: "remotion",
            };
            let endpointUrl = "";
            let xApiKey = "";
            if (environment === "dev") {
                endpointUrl =
                    "https://yxtfn5gmm9.execute-api.us-east-1.amazonaws.com/dev/enqueue";
                xApiKey = "qopmdRGiCu1Jj2jhDYNyA9p90j4yfkOC825qlgQx";
            }
            else {
                endpointUrl =
                    "https://r2ds9ljpij.execute-api.us-east-1.amazonaws.com/prod/enqueue";
                xApiKey = "ErQ9qRJaTb1FgvdwbYXMo8Jm4j8dd1nY1f2cD1GY";
            }
            const response = await this.helpers.httpRequest({
                method: "POST",
                url: endpointUrl,
                body: payload,
                json: true,
                headers: {
                    "X-Api-Key": xApiKey,
                },
            });
            returnData.push({ json: response });
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YVERender = YVERender;
