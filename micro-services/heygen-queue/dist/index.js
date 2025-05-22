"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
const helloWorld = async (event) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Hello, world!" }),
    };
};
exports.helloWorld = helloWorld;
//# sourceMappingURL=index.js.map