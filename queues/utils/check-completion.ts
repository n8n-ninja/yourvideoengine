import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"

const TABLE_NAME = process.env.QUEUES_TABLE

export const mapDynamoItemToJob = (item: any) => ({
  jobId: item.sk?.S?.replace("VIDEO#", ""),
  externalId: item.externalId?.S,
  status: item.status?.S,
  attempts: parseInt(item.attempts?.N ?? "0", 10),
  inputData: item.inputData?.S ? JSON.parse(item.inputData.S) : {},
  outputData: item.outputData?.S ? JSON.parse(item.outputData.S) : {},
  outputUrl: item.outputUrl?.S,
  duration: item.duration?.N ? parseFloat(item.duration.N) : undefined,
  captionUrl: item.captionUrl?.S,
  slug: item.slug?.S,
  queueType: item.queueType?.S,
  callbackUrl: item.callbackUrl?.S,
  projectId: item.pk?.S?.replace("PROJECT#", ""),
  createdAt: item.createdAt?.S,
  updatedAt: item.updatedAt?.S,
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
  return { allReady, callbackUrl, jobs }
}
