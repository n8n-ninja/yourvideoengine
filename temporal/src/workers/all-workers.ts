import 'dotenv/config';
import { Worker } from '@temporalio/worker';
import { startHeygen, checkHeygenStatus } from '../activities/heygen-activity';
import { runDeepgram } from '../activities/deepgram-activity';
import { startRemotion, checkRemotionStatus } from '../activities/remotion-activity';
import { startFlux, checkFluxStatus } from '../activities/flux-activity';
import { startRunway, checkRunwayStatus } from '../activities/runway-activity';

async function run() {
  const workers = [
    Worker.create({
      workflowsPath: require.resolve('../workflows'),
      taskQueue: 'main',
    }),
    Worker.create({
      workflowsPath: require.resolve('../workflows'),
      activities: { startHeygen, checkHeygenStatus },
      taskQueue: 'heygen-queue',
      maxConcurrentActivityTaskExecutions: 3,
    }),
    Worker.create({
      workflowsPath: require.resolve('../workflows'),
      activities: { runDeepgram },
      taskQueue: 'deepgram-queue',
      maxConcurrentActivityTaskExecutions: 3,
    }),
    Worker.create({
      workflowsPath: require.resolve('../workflows'),
      activities: { startRemotion, checkRemotionStatus },
      taskQueue: 'remotion-queue',
      maxConcurrentActivityTaskExecutions: 1,
    }),
    Worker.create({
      workflowsPath: require.resolve('../workflows'),
      activities: { startFlux, checkFluxStatus },
      taskQueue: 'flux-queue',
      maxConcurrentActivityTaskExecutions: 1,
    }),
    Worker.create({
      workflowsPath: require.resolve('../workflows'),
      activities: { startRunway, checkRunwayStatus },
      taskQueue: 'runway-queue',
      maxConcurrentActivityTaskExecutions: 1,
    }),
  ];

  const startedWorkers = await Promise.all(workers);
  await Promise.all(startedWorkers.map((w) => w.run()));
}

run().catch((err) => {
  console.error('❌ Erreur dans all-workers', err);
  process.exit(1);
});
