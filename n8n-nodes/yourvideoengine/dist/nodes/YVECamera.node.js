"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVECamera = void 0;
class YVECamera {
    constructor() {
        this.description = {
            displayName: "YVE Camera",
            name: "yveCamera",
            icon: "file:camera.svg",
            group: ["transform"],
            version: 2,
            description: "Trigger HeyGen video creation via custom Lambda.",
            defaults: {
                name: "YVE Camera",
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
                    displayName: "Speed",
                    name: "speed",
                    type: "number",
                    default: 1.0,
                    required: false,
                    description: "Speech speed (optional)",
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
                    displayName: "Project ID",
                    name: "projectId",
                    type: "string",
                    default: "",
                    required: false,
                    description: "Project ID (optional, will use workflow run ID if empty)",
                    displayOptions: {
                        show: {
                        // n8n advanced options
                        },
                    },
                },
                {
                    displayName: "Custom HeyGen API Key",
                    name: "apiKey",
                    type: "string",
                    default: "",
                    required: false,
                    description: "Custom HeyGen API Key (optional)",
                    displayOptions: {
                        show: {
                        // n8n advanced options
                        },
                    },
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
                    required: false,
                    description: "Choose environment (prod/dev)",
                    displayOptions: {
                        show: {
                        // n8n advanced options
                        },
                    },
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
            const speed = this.getNodeParameter("speed", i);
            const width = this.getNodeParameter("width", i);
            const height = this.getNodeParameter("height", i);
            let projectId = this.getNodeParameter("projectId", i, "");
            const apiKey = this.getNodeParameter("apiKey", i, "");
            const environment = this.getNodeParameter("environment", i, "prod");
            // Use workflow run id if projectId not provided
            if (!projectId) {
                const globalData = this.getWorkflowStaticData("global");
                const nodeData = this.getWorkflowStaticData("node");
                projectId =
                    globalData?.$execution?.id ||
                        nodeData?.$execution?.id ||
                        `run-${Date.now()}`;
            }
            // n8n provides $execution.resumeUrl for callback
            const globalData = this.getWorkflowStaticData("global");
            const nodeData = this.getWorkflowStaticData("node");
            const callbackUrl = globalData?.$execution
                ?.resumeUrl ||
                nodeData?.$execution
                    ?.resumeUrl ||
                "";
            const endpointUrl = environment === "dev"
                ? "https://lh2xhhl3vg.execute-api.us-east-1.amazonaws.com/dev/enqueue"
                : "https://lh2xhhl3vg.execute-api.us-east-1.amazonaws.com/prod/enqueue";
            const params = {
                avatar_id,
                avatar_style,
                input_text,
                voice_id,
                speed,
                width,
                height,
            };
            if (apiKey) {
                params.apiKey = apiKey;
            }
            const payload = {
                projectId,
                callbackUrl,
                params,
            };
            const response = await this.helpers.httpRequest({
                method: "POST",
                url: endpointUrl,
                body: payload,
                json: true,
            });
            returnData.push({ json: response });
        }
        return this.prepareOutputData(returnData);
    }
}
exports.YVECamera = YVECamera;
