import { updateJobStatus, scanJobs, Job } from "../utils/dynamo-helpers"

export const handleFluxJob = (job: Job) => {
  const { inputData, attempts = 0 } = job
  // Fake API call
  let attempt = 0
  let failed = false
  const doUpdate = async () => {
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
    await updateJobStatus(job, "processing", {
      externalId,
      inputData,
      outputData,
      attempts: attempts + 1,
    })
  }
  // Fire-and-forget
  doUpdate().catch((err) => {
    console.error("[handleFluxJob] Erreur async:", err)
  })
  // Retour immédiat
}

export const pollFluxHandler = async (): Promise<void> => {
  const processingJobs = (await scanJobs()).filter(
    (job) => job.status === "processing" && job.queueType === "flux"
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
    await updateJobStatus(job, "ready", {
      outputData,
      returnData,
    })
    // Le callback groupé est géré par pollJobGeneric dans la logique générique
  }
}
