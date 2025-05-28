import { UpdateItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import { checkCompletion } from "./check-completion"
import { fetchWithTimeout } from "../index"

const MAX_RETRIES = parseInt(process.env.HEYGEN_MAX_RETRIES ?? "3", 10)

export const startJobGeneric = async ({
  inputData,
  apiCall,
  job,
  client,
  tableName,
}: {
  inputData: any
  apiCall: (
    inputData: any,
  ) => Promise<{ externalId: string; outputData: any; bucketName?: string }>
  job: any
  client: any
  tableName: string
}) => {
  const { pk, sk, attempts = 0 } = job
  const now = new Date().toISOString()
  let externalId = ""
  let outputData: any = null
  let bucketName: string | undefined
  let failed = false
  try {
    const res = await apiCall(inputData)
    externalId = res.externalId
    outputData = res.outputData
    bucketName = res.bucketName
    if (!externalId) {
      failed = true
      console.error(
        "[startJobGeneric] Pas de externalId dans la réponse API:",
        JSON.stringify(res),
      )
    }
  } catch (err) {
    failed = true
    console.error("[startJobGeneric] Erreur lors de l'appel API:", err)
  }
  if (failed) {
    const newAttempts = attempts + 1
    console.error(
      "[startJobGeneric] Job échoué, attempts:",
      newAttempts,
      "pk:",
      pk,
      "sk:",
      sk,
    )
    await client.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: { pk: { S: pk }, sk: { S: sk } },
        UpdateExpression:
          "SET #attempts = :a, #updatedAt = :u" +
          (newAttempts >= MAX_RETRIES ? ", #status = :f" : ""),
        ExpressionAttributeNames: {
          "#attempts": "attempts",
          "#updatedAt": "updatedAt",
          ...(newAttempts >= MAX_RETRIES ? { "#status": "status" } : {}),
        },
        ExpressionAttributeValues: {
          ":a": { N: newAttempts.toString() },
          ":u": { S: now },
          ...(newAttempts >= MAX_RETRIES ? { ":f": { S: "failed" } } : {}),
        },
      }),
    )
    return
  }
  // Success: set to processing, store inputData, externalId, outputData, bucketName (optionnel)
  await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: { pk: { S: pk }, sk: { S: sk } },
      UpdateExpression:
        "SET #status = :p, #externalId = :e, #inputData = :i, #outputData = :o" +
        (bucketName ? ", #bucketName = :b" : "") +
        ", #attempts = :a, #updatedAt = :u",
      ExpressionAttributeNames: {
        "#status": "status",
        "#externalId": "externalId",
        "#inputData": "inputData",
        "#outputData": "outputData",
        ...(bucketName ? { "#bucketName": "bucketName" } : {}),
        "#attempts": "attempts",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":p": { S: "processing" },
        ":e": { S: externalId },
        ":i": { S: JSON.stringify(inputData) },
        ":o": { S: JSON.stringify(outputData) },
        ...(bucketName ? { ":b": { S: bucketName } } : {}),
        ":a": { N: (attempts + 1).toString() },
        ":u": { S: now },
      },
    }),
  )
}

export const pollJobGeneric = async ({
  pollApi,
  job,
  client,
  tableName,
  queueType,
}: {
  pollApi: (job: any) => Promise<{
    done: boolean
    failed: boolean
    outputData: any
    outputUrl?: string
    duration?: number
  }>
  job: any
  client: any
  tableName: string
  queueType: string
}) => {
  const pk = job.pk?.S ?? ""
  const sk = job.sk?.S ?? ""
  const externalId = job.externalId?.S
  const bucketName = job.bucketName?.S
  const attempts = parseInt(job.attempts?.N ?? "0", 10)
  const projectId = pk.replace("PROJECT#", "")
  if (!externalId || !pk || !sk) return
  const now = new Date().toISOString()
  let done = false
  let failed = false
  let outputData: any = null
  let outputUrl: string | undefined
  let duration: number | undefined
  try {
    const res = await pollApi({ externalId, bucketName, job })
    done = res.done
    failed = res.failed
    outputData = res.outputData
    outputUrl = res.outputUrl
    duration = res.duration
    console.log("[pollJobGeneric] Résultat pollApi:", JSON.stringify(res))
  } catch (err) {
    console.error("[pollJobGeneric] Erreur lors du polling:", err)
    return
  }
  if (done && !failed) {
    await client.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: { pk: { S: pk }, sk: { S: sk } },
        UpdateExpression:
          "SET #status = :r, #updatedAt = :u, #outputData = :d" +
          ", #outputUrl = :v, #duration = :du",
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
          ":du":
            duration !== undefined && duration !== null
              ? { N: duration.toString() }
              : { NULL: true },
        },
      }),
    )
    // Callback groupé
    const { allReady, callbackUrl, jobs } = await checkCompletion(
      projectId,
      client,
    )
    if (allReady && callbackUrl) {
      await fetchWithTimeout(callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, jobs }),
      })
    }
  } else if (failed) {
    const newAttempts = attempts + 1
    console.error(
      "[pollJobGeneric] Job failed, attempts:",
      newAttempts,
      "pk:",
      pk,
      "sk:",
      sk,
      "outputData:",
      JSON.stringify(outputData),
    )
    await client.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: { pk: { S: pk }, sk: { S: sk } },
        UpdateExpression:
          "SET #attempts = :a, #updatedAt = :u" +
          (newAttempts >= MAX_RETRIES ? ", #status = :f" : ", #status = :p"),
        ExpressionAttributeNames: {
          "#attempts": "attempts",
          "#updatedAt": "updatedAt",
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":a": { N: newAttempts.toString() },
          ":u": { S: now },
          ":f": { S: "failed" },
          ":p": { S: "pending" },
        },
      }),
    )
  }
  // else: still processing, do nothing
}

export const getProcessingJobs = async ({
  client,
  tableName,
  queueType,
}: {
  client: any
  tableName: string
  queueType: string
}) => {
  const res = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: "#status = :processing AND #queueType = :queueType",
      ExpressionAttributeNames: {
        "#status": "status",
        "#queueType": "queueType",
      },
      ExpressionAttributeValues: {
        ":processing": { S: "processing" },
        ":queueType": { S: queueType },
      },
    }),
  )
  return res.Items ?? []
}
