import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  ScanCommand,
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
  }
}

function fromDynamoItem(item: any): Job {
  return {
    jobId: item.sk?.S?.replace("VIDEO#", ""),
    projectId: item.pk?.S?.replace("PROJECT#", ""),
    clientId: item.clientId?.S,
    status: item.status?.S as JobStatus,
    attempts: parseInt(item.attempts?.N ?? "0", 10),
    inputData: item.inputData?.S ? JSON.parse(item.inputData.S) : {},
    outputData: item.outputData?.S ? JSON.parse(item.outputData.S) : {},
    returnData: item.returnData?.S ? JSON.parse(item.returnData.S) : undefined,
    queueType: item.queueType?.S,
    callbackUrl: item.callbackUrl?.S,
    createdAt: item.createdAt?.S,
    updatedAt: item.updatedAt?.S,
    externalId: item.externalId?.S,
  }
}

export class JobRepository {
  static async addJob(job: Job) {
    await dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: toDynamoItem(job),
      })
    )
  }

  static async updateJob(
    jobId: string,
    projectId: string,
    patch: Partial<Job>
  ) {
    const now = new Date().toISOString()
    const updateFields = { ...patch, updatedAt: now }
    const updateExpr =
      "SET " +
      Object.keys(updateFields)
        .map((k) => `#${k} = :${k}`)
        .join(", ")
    const exprAttrNames = Object.fromEntries(
      Object.keys(updateFields).map((k) => [`#${k}`, k])
    )
    const exprAttrValues = Object.fromEntries(
      Object.entries(updateFields).map(([k, v]) => [
        `:${k}`,
        typeof v === "object" ? { S: JSON.stringify(v) } : { S: String(v) },
      ])
    )
    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: { S: `PROJECT#${projectId}` },
          sk: { S: `VIDEO#${jobId}` },
        },
        UpdateExpression: updateExpr,
        ExpressionAttributeNames: exprAttrNames,
        ExpressionAttributeValues: exprAttrValues,
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
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#pk = :pk",
        ExpressionAttributeNames: { "#pk": "pk" },
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
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#pk = :pk AND #status = :status",
        ExpressionAttributeNames: { "#pk": "pk", "#status": "status" },
        ExpressionAttributeValues: {
          ":pk": { S: `PROJECT#${projectId}` },
          ":status": { S: status },
        },
      })
    )
    return (res.Items ?? []).map(fromDynamoItem)
  }
}
