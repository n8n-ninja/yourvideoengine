import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"

const TABLE_NAME = process.env.QUEUES_TABLE

export const mapDynamoItemToJob = (item: any) => ({
  jobId: item.sk?.S?.replace("VIDEO#", ""),
  externalId: item.externalId?.S,
  status: item.status?.S,
  attempts: parseInt(item.attempts?.N ?? "0", 10),
  inputData: item.inputData?.S ? JSON.parse(item.inputData.S) : {},
  outputData: item.outputData?.S ? JSON.parse(item.outputData.S) : {},
  queueType: item.queueType?.S,
  callbackUrl: item.callbackUrl?.S,
  projectId: item.pk?.S?.replace("PROJECT#", ""),
  createdAt: item.createdAt?.S,
  updatedAt: item.updatedAt?.S,
  returnData: item.returnData?.S ? JSON.parse(item.returnData.S) : undefined,
})

export const checkCompletion = async (
  projectId: string,
  client: DynamoDBClient,
): Promise<{ allReady: boolean; callbackUrl?: string; jobs: any[] }> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const res = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "pk" },
      ExpressionAttributeValues: { ":pk": { S: `PROJECT#${projectId}` } },
    }),
  )
  const items = res.Items ?? []
  const allReady =
    items.length > 0 && items.every((item) => item.status?.S === "ready")
  const callbackUrl = items[0]?.callbackUrl?.S
  const jobs = items.map(mapDynamoItemToJob)
  jobs.sort((a, b) => {
    if (!a.createdAt) return -1;
    if (!b.createdAt) return 1;
    return a.createdAt.localeCompare(b.createdAt);
  })
  return { allReady, callbackUrl, jobs }
}

export const checkAllDone = async (
  projectId: string,
  client: DynamoDBClient,
): Promise<{ allDone: boolean; callbackUrl?: string; jobs: any[] }> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const res = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "pk" },
      ExpressionAttributeValues: { ":pk": { S: `PROJECT#${projectId}` } },
    }),
  )
  const items = res.Items ?? []
  const allDone =
    items.length > 0 && items.every((item) => {
      const s = item.status?.S
      return s === "ready" || s === "failed"
    })
  const callbackUrl = items[0]?.callbackUrl?.S
  const jobs = items.map(mapDynamoItemToJob)
  jobs.sort((a, b) => {
    if (!a.createdAt) return -1;
    if (!b.createdAt) return 1;
    return a.createdAt.localeCompare(b.createdAt);
  })
  return { allDone, callbackUrl, jobs }
}
