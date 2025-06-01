import { Job, JobStatus } from "../models/job"
import { JobRepository } from "../repository/job-repository"

export type WorkerResult = {
  status: JobStatus
  outputData: Record<string, any>
  returnData?: any
  error?: any
}

export type WorkerFn = (job: Job) => Promise<WorkerResult> | WorkerResult

export class QueueOrchestrator {
  static async processJob(job: Job, worker: WorkerFn) {
    // 1. Exécute le worker (sync ou async)
    let result: WorkerResult
    try {
      result = await worker(job)
    } catch (error) {
      result = {
        status: "failed",
        outputData: {},
        returnData: { error: (error as Error).message },
        error,
      }
    }

    // 2. Met à jour le job dans la base
    await JobRepository.updateJob(job.jobId, job.projectId, {
      status: result.status,
      outputData: result.outputData,
      returnData: result.returnData,
      attempts: (job.attempts ?? 0) + 1,
    })

    // 3. Vérifie si tous les jobs du projet sont terminés
    const jobs = await JobRepository.listJobsByProject(job.projectId)
    const allDone =
      jobs.length > 0 &&
      jobs.every((j) => j.status === "ready" || j.status === "failed")
    if (allDone && job.callbackUrl) {
      // 4. Déclenche le callback projet (POST)
      try {
        await fetch(job.callbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: job.projectId,
            success: jobs.every((j) => j.status === "ready"),
            results: jobs.map((j) => j.returnData ?? null),
          }),
        })
      } catch (err) {
        // Optionnel: log ou retry
        // console.error('Callback error:', err)
      }
    }
  }
}
