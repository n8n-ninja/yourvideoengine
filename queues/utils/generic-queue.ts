import { UpdateItemCommand, ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { checkCompletion, checkAllDone } from "./check-completion"
import { fetchWithTimeout } from "../index"
import { fromDynamoItem, updateJobStatus, putJob, scanJobs, Job } from "./dynamo-helpers"

const MAX_RETRIES = parseInt(process.env.HEYGEN_MAX_RETRIES ?? "3", 10)

export const startJobGeneric = async ({
  inputData,
  apiCall,
  job,
  client,
  tableName,
  maxRetries = 3,
}: {
  inputData: any
  apiCall: (
    inputData: any,
  ) => Promise<{ externalId: string; outputData: any }>
  job: Job
  client: DynamoDBClient
  tableName: string
  maxRetries?: number
}) => {
  const now = new Date().toISOString()
  let externalId = ""
  let outputData: any = null
  let failed = false
  let lastError: any = null
  let attempt = 0
  while (attempt < maxRetries) {
    try {
      const res = await apiCall(inputData)
      externalId = res.externalId
      outputData = res.outputData
      if (!externalId) {
        failed = true
        console.error(
          `[startJobGeneric] Pas de externalId dans la réponse API (tentative ${attempt + 1}):`,
          JSON.stringify(res),
        )
        lastError = new Error("No externalId returned")
      } else {
        failed = false
        break
      }
    } catch (err) {
      failed = true
      lastError = err
      console.error(`[startJobGeneric] Erreur lors de l'appel API (tentative ${attempt + 1}):`, err)
    }
    attempt++
    if (failed && attempt < maxRetries) {
      const backoff = 500 * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, backoff))
    }
  }
  if (failed) {
    const newAttempts = (job.attempts ?? 0) + 1
    console.error(
      `[startJobGeneric] Job échoué après ${attempt} tentatives, attempts:`,
      newAttempts,
      "jobId:", job.jobId,
      lastError,
    )
    await updateJobStatus(client, tableName, job, newAttempts >= maxRetries ? "failed" : job.status, {
      attempts: newAttempts,
      outputData: outputData ?? undefined,
      returnData: lastError ? { error: lastError.message ?? String(lastError) } : undefined,
    })
    return
  }
  // Success: set to processing, store inputData, externalId, outputData
  await updateJobStatus(client, tableName, job, "processing", {
    externalId,
    inputData,
    outputData,
    attempts: (job.attempts ?? 0) + 1,
  })
}

export const pollJobGeneric = async ({
  pollApi,
  job,
  client,
  tableName,
  queueType,
}: {
  pollApi: (job: Job) => Promise<{
    done: boolean
    failed: boolean
    outputData: any
    returnData?: any
  }>
  job: Job
  client: DynamoDBClient
  tableName: string
  queueType: string
}) => {
  const projectId = job.projectId
  if (!job.externalId || !job.jobId || !job.projectId) return
  const now = new Date().toISOString()
  let done = false
  let failed = false
  let outputData: any = null
  let returnData: any = undefined
  try {
    const res = await pollApi(job)
    done = res.done
    failed = res.failed
    outputData = res.outputData
    returnData = res.returnData
    console.log("[pollJobGeneric] Résultat pollApi:", JSON.stringify(res))
  } catch (err) {
    console.error("[pollJobGeneric] Erreur lors du polling:", err)
    return
  }
  if (done && !failed) {
    await updateJobStatus(client, tableName, job, "ready", {
      outputData,
      returnData,
    })
    // Callback si tous les jobs sont terminés (ready ou failed)
    const { allDone, callbackUrl, jobs } = await checkAllDone(projectId, client)
    if (allDone && callbackUrl) {
      const jobsReturnData = jobs.map((job: Job) => {
        if (job.status === "ready" && job.returnData) {
          return job.returnData
        }
        if (job.status === "failed" && job.returnData) {
          return job.returnData
        }
        return null
      })
      const success = jobs.every((job: Job) => job.status === "ready")
      await fetchWithTimeout(callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, success, results: jobsReturnData }),
      })
    }
  } else if (failed) {
    await updateJobStatus(client, tableName, job, "failed", {
      outputData,
      returnData,
    })
    // Callback si tous les jobs sont terminés (ready ou failed)
    const { allDone, callbackUrl, jobs } = await checkAllDone(projectId, client)
    if (allDone && callbackUrl) {
      const jobsReturnData = jobs.map((job: Job) => {
        if (job.status === "ready" && job.returnData) {
          return job.returnData
        }
        if (job.status === "failed" && job.returnData) {
          return job.returnData
        }
        return null
      })
      const success = jobs.every((job: Job) => job.status === "ready")
      await fetchWithTimeout(callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, success, results: jobsReturnData }),
      })
    }
  }
  // else: still processing, do nothing
}
