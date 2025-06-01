import { updateJobStatus, Job } from "./dynamo-helpers"

export const startJobGeneric = async ({
  inputData,
  apiCall,
  job,
  maxRetries = 3,
}: {
  inputData: any
  apiCall: (inputData: any) => Promise<{
    externalId: string
    outputData: any
  }>
  job: Job
  maxRetries?: number
}) => {
  let externalId = ""
  let outputData: any = null
  let lastError: any = null
  let attempt = 0
  let failed = false
  while (attempt < maxRetries) {
    try {
      const res = await apiCall(inputData)
      externalId = res.externalId
      outputData = res.outputData
      if (!externalId) {
        failed = true
        console.error(
          `[startJobGeneric] Pas de externalId dans la réponse API (tentative ${
            attempt + 1
          }):`,
          JSON.stringify(res)
        )
        lastError = new Error("No externalId returned")
      } else {
        failed = false
        break
      }
    } catch (err) {
      failed = true
      lastError = err
      console.error(
        `[startJobGeneric] Erreur lors de l'appel API (tentative ${
          attempt + 1
        }):`,
        err
      )
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
      "jobId:",
      job.jobId,
      lastError
    )
    await updateJobStatus(
      job,
      newAttempts >= maxRetries ? "failed" : job.status,
      {
        attempts: newAttempts,
        outputData: outputData ?? undefined,
        returnData: lastError
          ? { error: lastError.message ?? String(lastError) }
          : undefined,
      }
    )
    return
  }
  // Toujours set to processing, jamais ready ici
  await updateJobStatus(job, "processing", {
    externalId,
    inputData,
    outputData,
    attempts: (job.attempts ?? 0) + 1,
  })
}

export const pollJobGeneric = async ({
  pollApi,
  job,
  queueType,
}: {
  pollApi: (job: Job) => Promise<{
    done: boolean
    failed: boolean
    outputData: any
    returnData?: any
  }>
  job: Job
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
    await updateJobStatus(job, "ready", {
      outputData,
      returnData,
    })
    // Callback si tous les jobs sont terminés (ready ou failed)
    // NOTE: checkAllDone attend encore un client, à refactorer si besoin
    // const { allDone, callbackUrl, jobs } = await checkAllDone(projectId, client)
  } else if (failed) {
    await updateJobStatus(job, "failed", {
      outputData,
      returnData,
    })
    // Callback si tous les jobs sont terminés (ready ou failed)
    // NOTE: checkAllDone attend encore un client, à refactorer si besoin
    // const { allDone, callbackUrl, jobs } = await checkAllDone(projectId, client)
  }
  // else: still processing, do nothing
}
