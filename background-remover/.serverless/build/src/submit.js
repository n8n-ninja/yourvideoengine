"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/submit.ts
var submit_exports = {};
__export(submit_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(submit_exports);

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-node/native.js
var import_crypto2 = __toESM(require("crypto"));
var native_default = {
  randomUUID: import_crypto2.default.randomUUID
};

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/submit.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_client_sqs = require("@aws-sdk/client-sqs");
var ddb = new import_client_dynamodb.DynamoDBClient({});
var sqs = new import_client_sqs.SQSClient({});
var JOBS_TABLE = process.env.JOBS_TABLE;
var QUEUE_URL = process.env.JOB_QUEUE_URL;
var handler = async (event) => {
  console.log("submit event", JSON.stringify(event));
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  console.log("submit body", JSON.stringify(body));
  const inputUrl = body.inputUrl;
  const chromakeyFilter = body.chromakeyFilter;
  if (!inputUrl) {
    console.log("Missing inputUrl", body);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing inputUrl" })
    };
  }
  const jobId = v4_default();
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  console.log("putItem", jobId, inputUrl);
  await ddb.send(
    new import_client_dynamodb.PutItemCommand({
      TableName: JOBS_TABLE,
      Item: {
        jobId: { S: jobId },
        inputUrl: { S: inputUrl },
        status: { S: "PENDING" },
        createdAt: { S: createdAt }
      }
    })
  );
  console.log("putItem done", jobId);
  await sqs.send(
    new import_client_sqs.SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify({ jobId, inputUrl, chromakeyFilter })
    })
  );
  console.log("sendMessage SQS done", jobId);
  return {
    statusCode: 200,
    body: JSON.stringify({ jobId, status: "PENDING" })
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=submit.js.map
