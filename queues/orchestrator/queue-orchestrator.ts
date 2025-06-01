import { Job, JobStatus } from "../models/job"
import { JobRepository } from "../repository/job-repository"
import { processAllJobs } from "../handlers/process-all-jobs"

export type WorkerResult = {
  status: JobStatus
  outputData: Record<string, any>
  returnData?: any
  error?: any
  externalId?: string
}

export type WorkerFn = (job: Job) => Promise<WorkerResult> | WorkerResult

export class QueueOrchestrator {
  static async processJob(job: Job, worker: WorkerFn, isLaunchOrRetry = true) {
    if (
      job.status === "ready" ||
      (job.status === "failed" && job.attempts >= 3)
    ) {
      console.log(
        `[QueueOrchestrator] Skip processing job ${job.jobId} (already ${job.status} or max retries)`
      )
      return
    }

    // 1. Exécute le worker (sync ou async)
    let result: WorkerResult
    try {
      console.log(
        "[QueueOrchestrator] Calling worker for job",
        job.jobId,
        job.queueType
      )
      result = await worker(job)
      console.log("[QueueOrchestrator] Worker result", result)
    } catch (error) {
      result = {
        status: "failed",
        outputData: {},
        returnData: { error: (error as Error).message },
        error,
      }
      console.log("[QueueOrchestrator] Worker threw error", error)
    }

    // 2. Met à jour le job dans la base
    const update: any = {
      status: result.status,
      outputData: result.outputData,
      returnData: result.returnData,
      ...(result.externalId ? { externalId: result.externalId } : {}),
    }
    if (isLaunchOrRetry) {
      update.attempts = (job.attempts ?? 0) + 1
    }
    await JobRepository.updateJob(job.jobId, job.projectId, update)

    // 3. Si failed et attempts < 3, repasse en pending pour retry
    if (
      result.status === "failed" &&
      isLaunchOrRetry &&
      (job.attempts ?? 0) + 1 < 3
    ) {
      console.log(
        `[QueueOrchestrator] Retry job ${job.jobId}, attempt ${
          (job.attempts ?? 0) + 1
        }`
      )
      await JobRepository.updateJob(job.jobId, job.projectId, {
        status: "pending",
      })
    }

    // 4. Vérifie si tous les jobs du projet sont terminés
    const jobs = await JobRepository.listJobsByProject(job.projectId)
    const allDone =
      jobs.length > 0 &&
      jobs.every((j) => j.status === "ready" || j.status === "failed")
    const callbackAlreadySent = jobs.some((j) => j.callbackSent)
    console.log(
      "[QueueOrchestrator] Project",
      job.projectId,
      "allDone:",
      allDone,
      "callbackAlreadySent:",
      callbackAlreadySent
    )
    if (allDone && job.callbackUrl && !callbackAlreadySent) {
      // 5. Déclenche le callback projet (POST)
      try {
        // Trie les jobs par createdAt (ordre croissant)
        const jobsSorted = [...jobs].sort((a, b) => {
          if (!a.createdAt) return -1
          if (!b.createdAt) return 1
          return a.createdAt.localeCompare(b.createdAt)
        })

        console.log(
          "[QueueOrchestrator] Calling callback",
          job.callbackUrl,
          jobsSorted
        )

        await fetch(job.callbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: job.projectId,
            success: jobsSorted.every((j) => j.status === "ready"),
            results: jobsSorted.map((j) => j.returnData ?? null),
          }),
        })
        // Marque tous les jobs du projet comme callbackSent: true
        await Promise.all(
          jobs.map((j) =>
            JobRepository.updateJob(j.jobId, j.projectId, {
              callbackSent: true,
            })
          )
        )
        console.log(
          "[QueueOrchestrator] Marked all jobs callbackSent=true for project",
          job.projectId
        )
      } catch (err) {
        console.log("[QueueOrchestrator] Callback error", err)
      }
    }

    // 6. Auto-trigger processAllJobs si le job vient de passer en ready ou failed
    if (["ready", "failed"].includes(result.status)) {
      console.log(
        "[QueueOrchestrator] Auto-trigger processAllJobs after job completion"
      )
      await processAllJobs()
    }
  }
}
