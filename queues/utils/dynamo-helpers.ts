import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb"

const TABLE_NAME = process.env.QUEUES_TABLE!

export type Job = {
  jobId: string
  projectId: string
  clientId: string
  status: string
  attempts: number
  inputData: any
  outputData: any
  returnData?: any
  queueType: string
  callbackUrl?: string
  createdAt: string
  updatedAt: string
  externalId?: string
}

export function toDynamoItem(job: Job) {
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

export function fromDynamoItem(item: any): Job {
  return {
    jobId: item.sk?.S?.replace("VIDEO#", ""),
    projectId: item.pk?.S?.replace("PROJECT#", ""),
    clientId: item.clientId?.S,
    status: item.status?.S,
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

export const dynamoClient = new DynamoDBClient({})

export async function putJob(job: Job) {
  await dynamoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: toDynamoItem(job),
    })
  )
}

export async function updateJobStatus(
  job: Job,
  status: string,
  patch: Partial<Job> = {}
) {
  const now = new Date().toISOString()
  const updateFields = {
    ...patch,
    status,
    updatedAt: now,
  }
  const updateExpr =
    "SET " +
    Object.keys(updateFields)
      .map((k, i) => `#${k} = :${k}`)
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
        pk: { S: `PROJECT#${job.projectId}` },
        sk: { S: `VIDEO#${job.jobId}` },
      },
      UpdateExpression: updateExpr,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
    })
  )
}

export async function getJob(
  projectId: string,
  jobId: string
): Promise<Job | null> {
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

export async function scanJobs(filter?: { [k: string]: any }): Promise<Job[]> {
  const res = await dynamoClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      // Ajoute un filter si besoin
    })
  )
  return (res.Items ?? []).map(fromDynamoItem)
}
