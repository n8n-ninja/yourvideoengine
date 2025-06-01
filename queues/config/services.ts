import { heygenWorker, heygenPollWorker } from "../workers/heygen-worker"
import { deepgramWorker } from "../workers/deepgram-worker"
import { WorkerFn } from "../orchestrator/queue-orchestrator"

export type ServiceConfig = {
  startWorker: WorkerFn
  pollWorker?: (externalId: string) => Promise<ReturnType<WorkerFn>>
  async: boolean
  maxConcurrency: number
}

export const services: Record<string, ServiceConfig> = {
  heygen: {
    startWorker: heygenWorker,
    pollWorker: heygenPollWorker,
    async: true,
    maxConcurrency: 2,
  },
  deepgram: {
    startWorker: deepgramWorker,
    async: false,
    maxConcurrency: 4,
  },
  // Ajoute ici tes nouveaux services
}
