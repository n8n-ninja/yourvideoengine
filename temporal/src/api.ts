import express from 'express';
import { Connection, Client } from '@temporalio/client';
import { commentVideoWorkflow } from './workflows/comment-video-workflow';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.post('/api/comment-video', async (req: Request, res: Response) => {
  try {
    const connection = await Connection.connect();
    const client = new Client({ connection });

    const handle = await client.workflow.start(commentVideoWorkflow, {
      args: [req.body],
      taskQueue: 'main',
      workflowId: `comment-video-${Date.now()}`,
    });

    res.json({
      workflowId: handle.workflowId,
      runId: handle.firstExecutionRunId,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Optionnel : endpoint pour récupérer le résultat
app.get('/api/comment-video/:workflowId', async (req: Request, res: Response) => {
  try {
    const connection = await Connection.connect();
    const client = new Client({ connection });
    const handle = client.workflow.getHandle(req.params.workflowId);
    const result = await handle.result();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
