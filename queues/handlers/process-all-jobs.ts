import { JobRepository } from "../repository/job-repository"
import { QueueOrchestrator } from "../orchestrator/queue-orchestrator"
import { services } from "../config/services"

let isProcessing = false

export const processAllJobs = async () => {
  if (isProcessing) {
    console.log("[processAllJobs] already running, skip")
    return
  }
  isProcessing = true
  try {
    console.log("[processAllJobs] called")
    for (const [queueType, config] of Object.entries(services)) {
      console.log(`[processAllJobs] Processing queueType: ${queueType}`)
      // --- Traitement des jobs pending (lancement) ---
      const pendingJobs = await JobRepository.listJobsByQueueTypeAndStatus(
        queueType,
        "pending"
      )
      console.log(
        `[processAllJobs] Found ${pendingJobs.length} pending jobs for ${queueType}`
      )
      // Respecte le maxConcurrency pour le lancement
      let processingCount = (
        await JobRepository.listJobsByQueueTypeAndStatus(
          queueType,
          "processing"
        )
      ).length
      const availableSlots = Math.max(
        0,
        config.maxConcurrency - processingCount
      )
      const toLaunch = pendingJobs
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(0, availableSlots)
      console.log(
        `[processAllJobs] Launching ${toLaunch.length} jobs for ${queueType}`
      )
      if (!config.async) {
        // SYNC: on traite les jobs un par un avec un buffer
        for (const job of toLaunch) {
          await JobRepository.updateJob(job.jobId, job.projectId, {
            status: "processing",
            attempts: job.attempts + 1,
          })
          const processingJob = {
            ...job,
            status: "processing" as import("../models/job").JobStatus,
            attempts: job.attempts + 1,
          }
          console.log(`[processAllJobs] Launching job ${job.jobId}`)
          await QueueOrchestrator.processJob(
            processingJob,
            config.startWorker,
            false
          )
          // Buffer de 1 seconde
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } else {
        // ASYNC: on garde le traitement en parallèle
        await Promise.all(
          toLaunch.map(async (job) => {
            await JobRepository.updateJob(job.jobId, job.projectId, {
              status: "processing",
              attempts: job.attempts + 1,
            })
            const processingJob = {
              ...job,
              status: "processing" as import("../models/job").JobStatus,
              attempts: job.attempts + 1,
            }
            console.log(`[processAllJobs] Launching job ${job.jobId}`)
            return QueueOrchestrator.processJob(
              processingJob,
              config.startWorker,
              false
            )
          })
        )
      }
      // --- Traitement des jobs processing (polling, si async) ---
      if (config.async && config.pollWorker) {
        const processingJobs = await JobRepository.listJobsByQueueTypeAndStatus(
          queueType,
          "processing"
        )
        console.log(
          `[processAllJobs] Found ${processingJobs.length} processing jobs for ${queueType}`
        )
        for (const job of processingJobs) {
          if (job.externalId) {
            console.log(
              `[processAllJobs] Polling job ${job.jobId} (externalId: ${job.externalId})`
            )
            await QueueOrchestrator.processJob(
              job,
              async () => config.pollWorker!(job.externalId!, job.outputData),
              false
            )
          }
        }
      }
    }
    console.log("[processAllJobs] finished")
  } finally {
    isProcessing = false
  }
}
