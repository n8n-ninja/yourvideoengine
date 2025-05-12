"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepgramApi = void 0;
class DeepgramApi {
    constructor() {
        this.name = "deepgramApi";
        this.displayName = "Deepgram API";
        this.documentationUrl = "https://developers.deepgram.com/docs/authentication";
        this.properties = [
            {
                displayName: "API Key",
                name: "apiKey",
                type: "string",
                default: "",
                typeOptions: {
                    password: true,
                },
                required: true,
                description: "Your Deepgram API Key",
            },
        ];
    }
}
exports.DeepgramApi = DeepgramApi;
