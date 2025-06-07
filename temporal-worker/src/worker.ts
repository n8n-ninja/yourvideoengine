import dotenv from "dotenv"
import { Worker, NativeConnection } from "@temporalio/worker"
import { startHeygen, checkHeygenStatus } from "./activities/heygen-activity"
import { runDeepgram } from "./activities/deepgram-activity"
import {
  startRemotion,
  checkRemotionStatus,
} from "./activities/remotion-activity"
import { startFlux, checkFluxStatus } from "./activities/flux-activity"
import { startRunway, checkRunwayStatus } from "./activities/runway-activity"

dotenv.config()

async function run() {
  if (
    !process.env.TEMPORAL_ADDRESS ||
    !process.env.TEMPORAL_API_KEY ||
    !process.env.TEMPORAL_NAMESPACE ||
    !process.env.TEMPORAL_TASK_QUEUE
  ) {
    throw new Error("Missing environment variables")
  }

  const {
    TEMPORAL_ADDRESS,
    TEMPORAL_API_KEY,
    TEMPORAL_NAMESPACE,
    TEMPORAL_TASK_QUEUE,
  } = process.env

  const connection = await NativeConnection.connect({
    address: TEMPORAL_ADDRESS,
    tls: {},
    apiKey: TEMPORAL_API_KEY,
  })

  const workers = [
    Worker.create({
      connection,
      workflowsPath: require.resolve("./workflows"),
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: TEMPORAL_TASK_QUEUE,
    }),
    Worker.create({
      connection,
      workflowsPath: require.resolve("./workflows"),
      activities: { startHeygen, checkHeygenStatus },
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: "heygen-queue",
      maxConcurrentActivityTaskExecutions: 3,
    }),
    Worker.create({
      connection,
      workflowsPath: require.resolve("./workflows"),
      activities: { runDeepgram },
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: "deepgram-queue",
      maxConcurrentActivityTaskExecutions: 3,
    }),
    Worker.create({
      connection,
      workflowsPath: require.resolve("./workflows"),
      activities: { startRemotion, checkRemotionStatus },
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: "remotion-queue",
      maxConcurrentActivityTaskExecutions: 1,
    }),
    Worker.create({
      connection,
      workflowsPath: require.resolve("./workflows"),
      activities: { startFlux, checkFluxStatus },
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: "flux-queue",
      maxConcurrentActivityTaskExecutions: 1,
    }),
    Worker.create({
      connection,
      workflowsPath: require.resolve("./workflows"),
      activities: { startRunway, checkRunwayStatus },
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: "runway-queue",
      maxConcurrentActivityTaskExecutions: 1,
    }),
  ]

  const startedWorkers = await Promise.all(workers)
  await Promise.all(startedWorkers.map((w) => w.run()))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
