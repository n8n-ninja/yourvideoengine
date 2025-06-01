import { JobRepository } from "../repository/job-repository"
import { QueueOrchestrator } from "../orchestrator/queue-orchestrator"
import { services } from "../config/services"

export const processAllJobs = async () => {
  for (const [queueType, config] of Object.entries(services)) {
    // --- Traitement des jobs pending (lancement) ---
    const pendingJobs = await JobRepository.listJobsByStatus(
      queueType,
      "pending"
    )
    // Respecte le maxConcurrency pour le lancement
    let processingCount = (
      await JobRepository.listJobsByStatus(queueType, "processing")
    ).length
    const availableSlots = Math.max(0, config.maxConcurrency - processingCount)
    const toLaunch = pendingJobs.slice(0, availableSlots)
    for (const job of toLaunch) {
      await QueueOrchestrator.processJob(job, config.startWorker)
    }
    // --- Traitement des jobs processing (polling, si async) ---
    if (config.async && config.pollWorker) {
      const processingJobs = await JobRepository.listJobsByStatus(
        queueType,
        "processing"
      )
      for (const job of processingJobs) {
        if (job.externalId) {
          await QueueOrchestrator.processJob(job, async () =>
            config.pollWorker!(job.externalId!)
          )
        }
      }
    }
  }
}
