import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { fromDynamoItem } from "./dynamo-helpers"

const TABLE_NAME = process.env.QUEUES_TABLE

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
  const jobs = items.map(fromDynamoItem)
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
  const jobs = items.map(fromDynamoItem)
  jobs.sort((a, b) => {
    if (!a.createdAt) return -1;
    if (!b.createdAt) return 1;
    return a.createdAt.localeCompare(b.createdAt);
  })
  return { allDone, callbackUrl, jobs }
}
