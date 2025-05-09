import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { OpenAI } from 'openai';

const app = express();
const port = process.env.PORT || 3000;
const tmp = '/tmp';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/caption', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('Missing ?url');

  const videoPath = path.join(tmp, 'input.mp4');
  const audioPath = path.join(tmp, 'output.mp3');

  try {
    // 1. Download video
    const response = await axios.get(videoUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(videoPath);
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // 2. Extract MP3
    execSync(`ffmpeg -i ${videoPath} -vn -ar 16000 -ac 1 -f mp3 ${audioPath}`);

    // 3. Send to OpenAI Whisper
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "srt", // ou "verbose_json"
    });

    res.setHeader('Content-Type', 'text/plain');
    res.send(transcript);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Error');
  }
});

app.listen(port, () => {
  console.log(`🚀 extract-and-caption running on port ${port}`);
});
