"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEHeyGenApi = void 0;
class YVEHeyGenApi {
    constructor() {
        this.name = "YVEHeyGenApi";
        this.displayName = "YVE HeyGen API";
        this.documentationUrl = "https://docs.heygen.com/reference/overview";
        this.properties = [
            {
                displayName: "API Key",
                name: "apiKey",
                type: "string",
                default: "",
                required: true,
                description: "Your HeyGen API Key.",
            },
        ];
    }
}
exports.YVEHeyGenApi = YVEHeyGenApi;
