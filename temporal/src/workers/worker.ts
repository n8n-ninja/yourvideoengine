import 'dotenv/config';
import { Worker } from '@temporalio/worker';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('../workflows'),
    taskQueue: 'main',
  });

  await worker.run();
}

run().catch((err) => {
  process.exit(1);
});
