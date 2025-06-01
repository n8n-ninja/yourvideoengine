export type JobStatus = "pending" | "processing" | "ready" | "failed"

export interface Job {
  jobId: string
  projectId: string
  clientId: string
  status: JobStatus
  attempts: number
  inputData: Record<string, any>
  outputData: Record<string, any>
  returnData?: any
  queueType: string
  callbackUrl?: string
  createdAt: string
  updatedAt: string
  externalId?: string
  callbackSent?: boolean
}
