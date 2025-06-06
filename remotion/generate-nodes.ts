import fs from "fs"
import path from "path"

// Répertoires
const templatesDir = path.join(__dirname, "./src/compositions/templates")
const outputDir = path.join(__dirname, "../n8n-nodes/nodes")
const templateFile = path.join(
  __dirname,
  "../n8n-nodes/nodes/node-template.ts.template",
)

// Helpers pour le mapping zod -> n8n (simplifié)
const zodToN8nType = (zodType: any) => {
  const typeName = zodType._def.typeName
  if (typeName === "ZodEnum") {
    return { type: "enum", n8nType: "options", options: zodType._def.values }
  }
  if (typeName === "ZodArray" || typeName === "ZodObject") {
    return { type: "json", n8nType: "string" }
  }
  switch (typeName) {
    case "ZodString":
      return { type: "string", n8nType: "string" }
    case "ZodNumber":
      return { type: "number", n8nType: "number" }
    case "ZodBoolean":
      return { type: "boolean", n8nType: "boolean" }
    default:
      return { type: "json", n8nType: "string" } // fallback
  }
}

// Helper to escape special chars for single-quoted JS strings
function escapeForSingleQuotedString(str: string) {
  return str
    .replace(/\\/g, "\\\\") // backslash
    .replace(/'/g, "\\'") // single quote
    .replace(/\"/g, '\\"') // double quote
    .replace(/\n/g, "\\n") // newline
    .replace(/\r/g, "\\r") // carriage return
    .replace(/\t/g, "\\t") // tab
}

// Génère la section properties du node n8n
const generateProperties = (
  shape: Record<string, any>,
  defaultProps: Record<string, any>,
) => {
  return Object.entries(shape)
    .map(([key, zodType]) => {
      const zodInfo = zodToN8nType(zodType)
      let defaultValue = defaultProps?.[key]
      let defaultString

      if (zodInfo.type === "enum") {
        const optionsArr = zodInfo.options
          .map((v: string) => `          { name: '${v}', value: '${v}' }`)
          .join(",\n")
        defaultString =
          defaultValue !== undefined
            ? `'${escapeForSingleQuotedString(String(defaultValue))}'`
            : "''"
        return `{
      displayName: '${key}',
      name: '${key}',
      type: 'options',
      options: [
${optionsArr}
      ],
      default: ${defaultString},
      required: false,
    },`
      }

      if (zodInfo.type === "json") {
        defaultString =
          defaultValue !== undefined
            ? `'${escapeForSingleQuotedString(JSON.stringify(defaultValue))}'`
            : "''"
      } else if (zodInfo.n8nType === "string") {
        defaultString =
          defaultValue !== undefined
            ? `'${escapeForSingleQuotedString(String(defaultValue))}'`
            : "''"
      } else if (
        zodInfo.n8nType === "number" ||
        zodInfo.n8nType === "boolean"
      ) {
        defaultString = defaultValue !== undefined ? String(defaultValue) : ""
      } else {
        defaultString = "''"
      }

      return `{
      displayName: '${key}',
      name: '${key}',
      type: '${zodInfo.type}',
      default: ${defaultString},
      required: false,
    },`
    })
    .join("\n      ")
}

// Génère la section params du node n8n
const generateParams = (shape: Record<string, any>) => {
  return Object.keys(shape)
    .map((key) => `        ${key}: this.getNodeParameter('${key}', i),`)
    .join("\n")
}

// Génère le nom de la classe node
const toPascalCase = (str: string) =>
  str.replace(/(^|[-_])(\w)/g, (_, __, c) => (c ? c.toUpperCase() : ""))

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  const files = fs
    .readdirSync(templatesDir)
    .filter((f) => f.endsWith(".props.ts"))

  const templateSource = fs.readFileSync(templateFile, "utf8")

  for (const file of files) {
    const propsPath = path.join(templatesDir, file)
    // Import dynamique ESM
    const propsModule = await import(propsPath)
    const { Schema, CompositionName, defaultProps } = propsModule
    const shape = Schema.shape

    const nodeName = "YVERender" + toPascalCase(CompositionName)
    const nodeDescription = `Node auto-généré pour le template ${file}`
    const properties = generateProperties(shape, defaultProps)
    const params = generateParams(shape)
    const nodeSource = templateSource
      .replace(/\{\{NodeClassName\}\}/g, nodeName)
      .replace(/\{\{NodeDisplayName\}\}/g, nodeName)
      .replace(/\{\{NodeName\}\}/g, nodeName)
      .replace(/\{\{NodeDescription\}\}/g, nodeDescription)
      .replace(/\{\{properties\}\}/g, properties)
      .replace(/\{\{params\}\}/g, params)
      .replace(/\{\{CompositionName\}\}/g, CompositionName)
    const outFile = path.join(outputDir, `${nodeName}.node.ts`)
    fs.writeFileSync(outFile, nodeSource, "utf8")
  }
}

main()
