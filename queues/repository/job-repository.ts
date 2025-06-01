import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb"
import { Job, JobStatus } from "../models/job"

const TABLE_NAME = process.env.QUEUES_TABLE!
const dynamoClient = new DynamoDBClient({})

function toDynamoItem(job: Job) {
  return {
    pk: { S: `PROJECT#${job.projectId}` },
    sk: { S: `VIDEO#${job.jobId}` },
    clientId: { S: job.clientId },
    status: { S: job.status },
    attempts: { N: job.attempts.toString() },
    inputData: { S: JSON.stringify(job.inputData) },
    outputData: { S: JSON.stringify(job.outputData) },
    ...(job.returnData !== undefined
      ? { returnData: { S: JSON.stringify(job.returnData) } }
      : {}),
    queueType: { S: job.queueType },
    ...(job.callbackUrl ? { callbackUrl: { S: job.callbackUrl } } : {}),
    createdAt: { S: job.createdAt },
    updatedAt: { S: job.updatedAt },
    ...(job.externalId ? { externalId: { S: job.externalId } } : {}),
    ...(job.callbackSent !== undefined
      ? { callbackSent: { BOOL: job.callbackSent } }
      : {}),
    ...(job.batchIndex !== undefined
      ? { batchIndex: { N: job.batchIndex.toString() } }
      : {}),
  }
}

function fromDynamoItem(item: any): Job {
  return {
    jobId: item.sk?.S?.replace("VIDEO#", ""),
    projectId: item.pk?.S?.replace("PROJECT#", ""),
    clientId: item.clientId?.S,
    status: item.status?.S as JobStatus,
    attempts: parseInt(item.attempts?.N ?? "0", 10),
    inputData:
      item.inputData?.S && item.inputData.S !== "undefined"
        ? JSON.parse(item.inputData.S)
        : {},
    outputData:
      item.outputData?.S && item.outputData.S !== "undefined"
        ? JSON.parse(item.outputData.S)
        : {},
    returnData:
      item.returnData?.S && item.returnData.S !== "undefined"
        ? JSON.parse(item.returnData.S)
        : undefined,
    queueType: item.queueType?.S,
    callbackUrl: item.callbackUrl?.S,
    createdAt: item.createdAt?.S,
    updatedAt: item.updatedAt?.S,
    externalId: item.externalId?.S,
    callbackSent: item.callbackSent?.BOOL,
    batchIndex:
      item.batchIndex && item.batchIndex.N !== undefined
        ? parseInt(item.batchIndex.N, 10)
        : 0,
  }
}

export class JobRepository {
  static async addJob(job: Job) {
    const item = toDynamoItem(job)
    await dynamoClient.send(
      new PutItemCommand({ TableName: TABLE_NAME, Item: item })
    )
  }

  static async updateJob(
    jobId: string,
    projectId: string,
    updates: Partial<Job>
  ) {
    const updateExpressions = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}
    if (updates.status) {
      updateExpressions.push("#status = :status")
      expressionAttributeNames["#status"] = "status"
      expressionAttributeValues[":status"] = { S: updates.status }
    }
    if (updates.outputData) {
      updateExpressions.push("#outputData = :outputData")
      expressionAttributeNames["#outputData"] = "outputData"
      expressionAttributeValues[":outputData"] = {
        S: JSON.stringify(updates.outputData),
      }
    }
    if (updates.returnData !== undefined) {
      updateExpressions.push("#returnData = :returnData")
      expressionAttributeNames["#returnData"] = "returnData"
      expressionAttributeValues[":returnData"] = {
        S: JSON.stringify(updates.returnData),
      }
    }
    if (updates.attempts !== undefined) {
      updateExpressions.push("#attempts = :attempts")
      expressionAttributeNames["#attempts"] = "attempts"
      expressionAttributeValues[":attempts"] = {
        N: updates.attempts.toString(),
      }
    }
    if (updates.externalId) {
      updateExpressions.push("#externalId = :externalId")
      expressionAttributeNames["#externalId"] = "externalId"
      expressionAttributeValues[":externalId"] = { S: updates.externalId }
    }
    if (updates.callbackSent !== undefined) {
      updateExpressions.push("#callbackSent = :callbackSent")
      expressionAttributeNames["#callbackSent"] = "callbackSent"
      expressionAttributeValues[":callbackSent"] = {
        BOOL: updates.callbackSent,
      }
    }
    updateExpressions.push("#updatedAt = :updatedAt")
    expressionAttributeNames["#updatedAt"] = "updatedAt"
    expressionAttributeValues[":updatedAt"] = { S: new Date().toISOString() }
    const UpdateExpression = "SET " + updateExpressions.join(", ")
    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: { S: `PROJECT#${projectId}` },
          sk: { S: `VIDEO#${jobId}` },
        },
        UpdateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    )
  }

  static async getJob(projectId: string, jobId: string): Promise<Job | null> {
    const res = await dynamoClient.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: { S: `PROJECT#${projectId}` },
          sk: { S: `VIDEO#${jobId}` },
        },
      })
    )
    if (!res.Item) return null
    return fromDynamoItem(res.Item)
  }

  static async listJobsByProject(projectId: string): Promise<Job[]> {
    const res = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": { S: `PROJECT#${projectId}` } },
      })
    )
    return (res.Items ?? []).map(fromDynamoItem)
  }

  static async listJobsByStatus(
    projectId: string,
    status: JobStatus
  ): Promise<Job[]> {
    const res = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":pk": { S: `PROJECT#${projectId}` },
          ":status": { S: status },
        },
      })
    )
    return (res.Items ?? []).map(fromDynamoItem)
  }

  static async listJobsByQueueTypeAndStatus(
    queueType: string,
    status: JobStatus
  ): Promise<Job[]> {
    const res = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "QueueTypeStatusIndex",
        KeyConditionExpression: "queueType = :queueType AND #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":queueType": { S: queueType },
          ":status": { S: status },
        },
      })
    )
    return (res.Items ?? []).map(fromDynamoItem)
  }

  static async tryAcquireCallbackLock(projectId: string): Promise<boolean> {
    // Prend le job du projet avec le plus petit batchIndex comme "lock owner"
    const res = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: `PROJECT#${projectId}` },
        },
      })
    )
    const items = res.Items ?? []
    if (items.length === 0) return false
    // Cherche le job avec le plus petit batchIndex
    let minBatchIndex = Number.POSITIVE_INFINITY
    let lockJob: any = null
    for (const item of items) {
      const batchIndex =
        item.batchIndex && item.batchIndex.N !== undefined
          ? parseInt(item.batchIndex.N, 10)
          : 0
      if (batchIndex < minBatchIndex) {
        minBatchIndex = batchIndex
        lockJob = item
      }
    }
    if (!lockJob) return false
    const job = fromDynamoItem(lockJob)
    // Tente de mettre callbackSent à true si ce n'est pas déjà fait
    try {
      await dynamoClient.send(
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: {
            pk: { S: `PROJECT#${String(job.projectId ?? "")}` },
            sk: { S: `VIDEO#${String(job.jobId ?? "")}` },
          },
          UpdateExpression: "SET callbackSent = :true",
          ConditionExpression:
            "attribute_not_exists(callbackSent) OR callbackSent = :false",
          ExpressionAttributeValues: {
            ":true": { BOOL: true },
            ":false": { BOOL: false },
          },
        })
      )
      return true
    } catch (err) {
      // Condition non remplie, lock déjà pris
      return false
    }
  }
}
