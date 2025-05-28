"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEHeyGen = void 0;
class YVEHeyGen {
    constructor() {
        this.description = {
            displayName: "YVE HeyGen",
            name: "yveHeyGen",
            group: ["transform"],
            icon: "file:heygen.svg",
            version: 2,
            description: "Trigger HeyGen video creation via custom Lambda.",
            defaults: {
                name: "YVE HeyGen",
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: "Avatar ID",
                    name: "avatar_id",
                    type: "string",
                    default: "8438bf0d9f6d447b91b9151d5f6b752b",
                    required: true,
                    description: "HeyGen avatar_id",
                },
                {
                    displayName: "Input Text",
                    name: "input_text",
                    type: "string",
                    default: "Hello, how are you?",
                    required: true,
                    description: "Text to be spoken by the avatar",
                },
                {
                    displayName: "Voice ID",
                    name: "voice_id",
                    type: "string",
                    default: "0e6ef9dc61bf47c7a507bb4f15c74ebc",
                    required: true,
                    description: "HeyGen voice_id",
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
                    displayName: "Slug",
                    name: "slug",
                    type: "string",
                    default: "={{'shot_' + ($itemIndex + 1)}}",
                    required: false,
                    description: "HeyGen slug (optional)",
                },
                {
                    displayName: "Additional Options",
                    name: "options",
                    type: "collection",
                    placeholder: "Add Option",
                    default: {},
                    options: [
                        {
                            displayName: "Speed",
                            name: "speed",
                            type: "number",
                            default: 1.0,
                            description: "Speech speed (optional)",
                        },
                        {
                            displayName: "Custom HeyGen API Key",
                            name: "apiKey",
                            type: "string",
                            default: "",
                            description: "Custom HeyGen API Key (optional)",
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
                    description: "Optional advanced options for video generation.",
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const avatar_id = this.getNodeParameter("avatar_id", i);
            const input_text = this.getNodeParameter("input_text", i);
            const voice_id = this.getNodeParameter("voice_id", i);
            const options = this.getNodeParameter("options", i, {});
            const speed = options.speed ?? 1.0;
            let projectId = options.projectId ?? "";
            const apiKey = options.apiKey ?? "";
            const environment = options.environment ?? "prod";
            const resumeUrl = this.getNodeParameter("resumeUrl", i);
            const executionId = this.getNodeParameter("executionId", i);
            let callbackUrl = options.callbackUrl ?? "";
            if (!callbackUrl) {
                callbackUrl = resumeUrl;
            }
            // Use executionId if projectId not provided
            if (!projectId) {
                projectId = executionId;
            }
            const params = {
                avatar_id,
                input_text,
                voice_id,
                speed,
                width: this.getNodeParameter("width", i),
                height: this.getNodeParameter("height", i),
            };
            if (apiKey) {
                params.apiKey = apiKey;
            }
            const payload = {
                projectId,
                callbackUrl,
                params,
                queueType: "heygen",
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
exports.YVEHeyGen = YVEHeyGen;
