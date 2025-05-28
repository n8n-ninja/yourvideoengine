"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
// This script is meant to be run with ts-node
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Répertoires
const templatesDir = path_1.default.resolve(process.cwd(), "remotion/src/compositions/templates");
const outputDir = path_1.default.join(__dirname, "../n8n-nodes/nodes");
const templateFile = path_1.default.join(__dirname, "../n8n-nodes/nodes/node-template.ts.template");
// Helpers pour le mapping zod -> n8n (simplifié)
const zodToN8nType = (zodType) => {
    switch (zodType._def.typeName) {
        case "ZodString":
            return { type: "string", n8nType: "string" };
        case "ZodNumber":
            return { type: "number", n8nType: "number" };
        case "ZodBoolean":
            return { type: "boolean", n8nType: "boolean" };
        default:
            return { type: "json", n8nType: "json" }; // array, object, etc.
    }
};
// Génère la section properties du node n8n
const generateProperties = (shape, defaultProps) => {
    return Object.entries(shape)
        .map(([key, zodType]) => {
        const { n8nType } = zodToN8nType(zodType);
        let defaultValue = defaultProps?.[key];
        if (n8nType === "json") {
            defaultValue =
                defaultValue === undefined || defaultValue === null
                    ? "''"
                    : `'${JSON.stringify(defaultValue)}'`;
        }
        else if (defaultValue !== undefined) {
            defaultValue = JSON.stringify(defaultValue);
        }
        else {
            defaultValue = "";
        }
        return `{
      displayName: '${key}',
      name: '${key}',
      type: '${n8nType}',
      default: ${defaultValue},
      required: false,
    },`;
    })
        .join("\n      ");
};
// Génère la section params du node n8n
const generateParams = (shape) => {
    return Object.keys(shape)
        .map((key) => `        ${key}: this.getNodeParameter('${key}', i),`)
        .join("\n");
};
// Génère le nom de la classe node
const toPascalCase = (str) => str.replace(/(^|[-_])(\w)/g, (_, __, c) => (c ? c.toUpperCase() : ""));
async function main() {
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    const files = fs_1.default
        .readdirSync(templatesDir)
        .filter((f) => f.endsWith(".props.ts"));
    console.log("Templates trouvés :", files);
    if (files.length === 0) {
        console.log("Aucun template .props.ts trouvé dans", templatesDir);
        return;
    }
    const templateSource = fs_1.default.readFileSync(templateFile, "utf8");
    for (const file of files) {
        const propsPath = path_1.default.join(templatesDir, file);
        // Import dynamique ESM
        const propsModule = require(propsPath);
        const { Schema, CompositionName, defaultProps } = propsModule;
        const shape = Schema.shape;
        const nodeName = "YVERender" + toPascalCase(CompositionName);
        const nodeDescription = `Node auto-généré pour le template ${file}`;
        const properties = generateProperties(shape, defaultProps);
        const params = generateParams(shape);
        const nodeSource = templateSource
            .replace(/\{\{NodeClassName\}\}/g, nodeName)
            .replace(/\{\{NodeDisplayName\}\}/g, nodeName)
            .replace(/\{\{NodeName\}\}/g, nodeName)
            .replace(/\{\{NodeDescription\}\}/g, nodeDescription)
            .replace(/\{\{properties\}\}/g, properties)
            .replace(/\{\{params\}\}/g, params)
            .replace(/\{\{CompositionName\}\}/g, CompositionName);
        const outFile = path_1.default.join(outputDir, `${nodeName}.node.ts`);
        fs_1.default.writeFileSync(outFile, nodeSource, "utf8");
        console.log("Node généré :", outFile);
    }
}
main();
