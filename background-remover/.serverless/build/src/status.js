"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/status.ts
var status_exports = {};
__export(status_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(status_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var ddb = new import_client_dynamodb.DynamoDBClient({});
var JOBS_TABLE = process.env.JOBS_TABLE;
var handler = async (event) => {
  const jobId = event.pathParameters?.jobId;
  if (!jobId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing jobId" }) };
  }
  const res = await ddb.send(
    new import_client_dynamodb.GetItemCommand({
      TableName: JOBS_TABLE,
      Key: { jobId: { S: jobId } }
    })
  );
  if (!res.Item) {
    return { statusCode: 404, body: JSON.stringify({ error: "Job not found" }) };
  }
  const status = res.Item.status.S;
  const outputUrl = res.Item.outputUrl?.S;
  const error = res.Item.error?.S;
  return {
    statusCode: 200,
    body: JSON.stringify({
      status,
      ...outputUrl ? { outputUrl } : {},
      ...error ? { error } : {}
    })
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=status.js.map
