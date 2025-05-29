import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { updateJobStatus, scanJobs, Job } from "../utils/dynamo-helpers"


const TABLE_NAME = process.env.QUEUES_TABLE

export const handleFluxJob = async (
  job: Job,
  client: DynamoDBClient,
  tableName: string,
) => {
  const { inputData, attempts = 0 } = job
  // Fake API call
  let attempt = 0
  let failed = false
  while (attempt < 3) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      failed = false
      break
    } catch (err) {
      failed = true
    }
    attempt++
    if (failed && attempt < 3) {
      const backoff = 500 * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, backoff))
    }
  }
  // Générer un externalId et outputData fake
  const externalId = `flux-fake-id-${Date.now()}`
  const outputData = { status: "started", externalId }
  await updateJobStatus(client, tableName, job, "processing", {
    externalId,
    inputData,
    outputData,
    attempts: attempts + 1,
  })
}

export const pollFluxHandler = async (): Promise<void> => {
  if (!TABLE_NAME) throw new Error("QUEUES_TABLE not set")
  const client = new DynamoDBClient({})
  const processingJobs = (await scanJobs(client, TABLE_NAME)).filter(
    (job) => job.status === "processing" && job.queueType === "flux",
  )
  for (const job of processingJobs) {
    // Fake polling: après 500ms, on passe en ready
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Générer un outputData fake
    const outputData = {
      status: "done",
      externalId: job.externalId,
      url: `https://fake.flux/${job.externalId}`,
    }
    const returnData = outputData.url ? { url: outputData.url } : undefined
    await updateJobStatus(client, TABLE_NAME, job, "ready", {
      outputData,
      returnData,
    })
    // Le callback groupé est géré par pollJobGeneric dans la logique générique
  }
}
