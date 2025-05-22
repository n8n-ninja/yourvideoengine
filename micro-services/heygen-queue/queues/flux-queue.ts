import {
  DynamoDBClient,
  UpdateItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb"
import { checkCompletion } from "../utils/check-completion"

const MAX_RETRIES = parseInt(process.env.HEYGEN_MAX_RETRIES ?? "3", 10)
const TABLE_NAME = process.env.HEYGEN_VIDEOS_TABLE

export const handleFluxJob = async (
  job: any,
  client: DynamoDBClient,
  tableName: string,
) => {
  const { params, pk, sk, attempts = 0 } = job
  const now = new Date().toISOString()
  const inputData = params
  // Fake API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Générer un externalId et outputData fake
  const externalId = `flux-fake-id-${Date.now()}`
  const outputData = { status: "started", externalId }
  await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: { pk: { S: pk }, sk: { S: sk } },
      UpdateExpression:
        "SET #status = :p, #externalId = :e, #inputData = :i, #outputData = :o, #attempts = :a, #updatedAt = :u",
      ExpressionAttributeNames: {
        "#status": "status",
        "#externalId": "externalId",
        "#inputData": "inputData",
        "#outputData": "outputData",
        "#attempts": "attempts",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":p": { S: "processing" },
        ":e": { S: externalId },
        ":i": { S: JSON.stringify(inputData) },
        ":o": { S: JSON.stringify(outputData) },
        ":a": { N: (attempts + 1).toString() },
        ":u": { S: now },
      },
    }),
  )
}

export const pollFluxHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("HEYGEN_VIDEOS_TABLE not set")
  const client = new DynamoDBClient({})
  // 1. Get all jobs with status = 'processing' and queueType = 'flux'
  const processingRes = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#status = :processing AND #queueType = :queueType",
      ExpressionAttributeNames: {
        "#status": "status",
        "#queueType": "queueType",
      },
      ExpressionAttributeValues: {
        ":processing": { S: "processing" },
        ":queueType": { S: "flux" },
      },
    }),
  )
  const processingJobs = processingRes.Items ?? []
  const now = new Date().toISOString()
  for (const item of processingJobs) {
    const pk = item.pk?.S ?? ""
    const sk = item.sk?.S ?? ""
    const externalId = item.externalId?.S
    const attempts = parseInt(item.attempts?.N ?? "0", 10)
    const projectId = pk.replace("PROJECT#", "")
    if (!externalId || !pk || !sk) continue
    // Fake polling: après 500ms, on passe en ready
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Générer un outputData/outputUrl/duration fake
    const outputData = {
      status: "done",
      externalId,
      url: `https://fake.flux/${externalId}`,
    }
    const outputUrl = outputData.url
    const duration = 42
    await client.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: { pk: { S: pk }, sk: { S: sk } },
        UpdateExpression:
          "SET #status = :r, #updatedAt = :u, #outputData = :d, #outputUrl = :v, #duration = :du",
        ExpressionAttributeNames: {
          "#status": "status",
          "#updatedAt": "updatedAt",
          "#outputData": "outputData",
          "#outputUrl": "outputUrl",
          "#duration": "duration",
        },
        ExpressionAttributeValues: {
          ":r": { S: "ready" },
          ":u": { S: now },
          ":d": { S: JSON.stringify(outputData) },
          ":v": outputUrl ? { S: outputUrl } : { NULL: true },
          ":du": { N: duration.toString() },
        },
      }),
    )
    // --- Ajout logique callback groupé ---
    const { allReady, callbackUrl, jobs } = await checkCompletion(
      projectId,
      client,
    )
    if (allReady && callbackUrl) {
      await fetch(callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, jobs }),
      })
    }
  }
}
