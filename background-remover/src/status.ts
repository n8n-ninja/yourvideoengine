import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"

const ddb = new DynamoDBClient({})
const JOBS_TABLE = process.env.JOBS_TABLE!

export const handler = async (event: any) => {
  const jobId = event.pathParameters?.jobId
  if (!jobId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing jobId" }) }
  }
  const res = await ddb.send(
    new GetItemCommand({
      TableName: JOBS_TABLE,
      Key: { jobId: { S: jobId } },
    }),
  )
  if (!res.Item) {
    return { statusCode: 404, body: JSON.stringify({ error: "Job not found" }) }
  }
  const status = res.Item.status.S
  const outputUrl = res.Item.outputUrl?.S
  const error = res.Item.error?.S
  return {
    statusCode: 200,
    body: JSON.stringify({
      status,
      ...(outputUrl ? { outputUrl } : {}),
      ...(error ? { error } : {}),
    }),
  }
}
