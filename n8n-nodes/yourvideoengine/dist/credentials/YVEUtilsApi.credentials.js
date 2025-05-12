"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YVEUtilsApi = void 0;
class YVEUtilsApi {
    constructor() {
        this.name = "yveUtilsApi";
        this.displayName = "YVE Utils API";
        this.documentationUrl = "";
        this.properties = [
            {
                displayName: "API URL",
                name: "apiUrl",
                type: "string",
                default: "",
                required: true,
                description: "Base URL of the YVE Utils API",
            },
            {
                displayName: "API Token",
                name: "apiToken",
                type: "string",
                default: "",
                typeOptions: {
                    password: true,
                },
                required: true,
                description: "API Token for YVE Utils",
            },
        ];
    }
}
exports.YVEUtilsApi = YVEUtilsApi;
