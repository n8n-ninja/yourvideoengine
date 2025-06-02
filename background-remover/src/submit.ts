import { v4 as uuidv4 } from "uuid"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

const ddb = new DynamoDBClient({})
const sqs = new SQSClient({})

const JOBS_TABLE = process.env.JOBS_TABLE!
const QUEUE_URL = process.env.JOB_QUEUE_URL!

export const handler = async (event: any) => {
  const body =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body
  const inputUrl = body.inputUrl
  const chromakeyFilter = body.chromakeyFilter
  if (!inputUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing inputUrl" }),
    }
  }
  const jobId = uuidv4()
  const createdAt = new Date().toISOString()
  // Save job in DynamoDB
  await ddb.send(
    new PutItemCommand({
      TableName: JOBS_TABLE,
      Item: {
        jobId: { S: jobId },
        inputUrl: { S: inputUrl },
        status: { S: "PENDING" },
        createdAt: { S: createdAt },
      },
    }),
  )
  // Push job to SQS
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify({ jobId, inputUrl, chromakeyFilter }),
    }),
  )
  return {
    statusCode: 200,
    body: JSON.stringify({ jobId, status: "PENDING" }),
  }
}
