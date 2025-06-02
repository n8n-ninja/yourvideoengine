import { heygenWorker, heygenPollWorker } from "../workers/heygen-worker"
import { deepgramWorker } from "../workers/deepgram-worker"
import { WorkerFn } from "../orchestrator/queue-orchestrator"
import { remotionPollWorker, remotionWorker } from "../workers/remotion-worker"
import { fluxWorker, fluxPollWorker } from "../workers/flux-worker"
import { runwayWorker, runwayPollWorker } from "../workers/runway-worker"

export type ServiceConfig = {
  startWorker: WorkerFn
  pollWorker?: (
    externalId: string,
    outputData?: any,
  ) => Promise<ReturnType<WorkerFn>>
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
    maxConcurrency: 3,
  },
  remotion: {
    startWorker: remotionWorker,
    pollWorker: remotionPollWorker,
    async: true,
    maxConcurrency: 2,
  },
  flux: {
    startWorker: fluxWorker,
    pollWorker: fluxPollWorker,
    async: true,
    maxConcurrency: 3,
  },
  runway: {
    startWorker: runwayWorker,
    pollWorker: runwayPollWorker,
    async: true,
    maxConcurrency: 3,
  },
}
