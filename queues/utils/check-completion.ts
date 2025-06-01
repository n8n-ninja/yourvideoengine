import { scanJobs } from "./dynamo-helpers"

export const checkCompletion = async (
  projectId: string
): Promise<{ allReady: boolean; callbackUrl?: string; jobs: any[] }> => {
  const jobs = (await scanJobs()).filter((job) => job.projectId === projectId)
  const allReady =
    jobs.length > 0 && jobs.every((job) => job.status === "ready")
  const callbackUrl = jobs[0]?.callbackUrl
  jobs.sort((a, b) => {
    if (!a.createdAt) return -1
    if (!b.createdAt) return 1
    return a.createdAt.localeCompare(b.createdAt)
  })
  return { allReady, callbackUrl, jobs }
}

export const checkAllDone = async (
  projectId: string
): Promise<{ allDone: boolean; callbackUrl?: string; jobs: any[] }> => {
  const jobs = (await scanJobs()).filter((job) => job.projectId === projectId)
  const allDone =
    jobs.length > 0 &&
    jobs.every((job) => job.status === "ready" || job.status === "failed")
  const callbackUrl = jobs[0]?.callbackUrl
  jobs.sort((a, b) => {
    if (!a.createdAt) return -1
    if (!b.createdAt) return 1
    return a.createdAt.localeCompare(b.createdAt)
  })
  return { allDone, callbackUrl, jobs }
}
