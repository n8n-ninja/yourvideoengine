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
                    default: "",
                    required: true,
                    description: "HeyGen avatar_id",
                },
                {
                    displayName: "Avatar Style",
                    name: "avatar_style",
                    type: "string",
                    default: "normal",
                    required: false,
                    description: "HeyGen avatar_style (optional)",
                },
                {
                    displayName: "Input Text",
                    name: "input_text",
                    type: "string",
                    default: "",
                    required: true,
                    description: "Text to be spoken by the avatar",
                },
                {
                    displayName: "Voice ID",
                    name: "voice_id",
                    type: "string",
                    default: "",
                    required: true,
                    description: "HeyGen voice_id",
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
                            displayName: "Project ID",
                            name: "projectId",
                            type: "string",
                            default: "",
                            description: "Project ID (optional, will use workflow run ID if empty)",
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
                        {
                            displayName: "Callback URL",
                            name: "callbackUrl",
                            type: "string",
                            default: "",
                            description: "Override callback URL (optional)",
                        },
                    ],
                    description: "Optional advanced options for video generation.",
                },
                {
                    displayName: "Width",
                    name: "width",
                    type: "number",
                    default: 1280,
                    required: false,
                    description: "Video width (optional)",
                },
                {
                    displayName: "Height",
                    name: "height",
                    type: "number",
                    default: 720,
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
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const avatar_id = this.getNodeParameter("avatar_id", i);
            const avatar_style = this.getNodeParameter("avatar_style", i);
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
                avatar_style,
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
            };
            const endpointUrl = environment === "dev"
                ? "https://lh2xhhl3vg.execute-api.us-east-1.amazonaws.com/dev/enqueue"
                : "https://lh2xhhl3vg.execute-api.us-east-1.amazonaws.com/prod/enqueue";
            const response = await this.helpers.httpRequest({
                method: "POST",
                url: endpointUrl,
                body: payload,
                json: true,
                headers: {
                    "X-Api-Key": "t1U7r2TUopagmyvGqYJXE4lWrQ6Lzsc48a1pZ0J7",
                },
            });
            returnData.push({ json: response });
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YVEHeyGen = YVEHeyGen;
