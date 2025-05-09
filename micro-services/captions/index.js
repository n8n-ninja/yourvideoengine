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

/**
 * 🔐 Middleware de protection
 */
app.use((req, res, next) => {
  const token = req.headers.authorization;
  const expected = process.env.ACCESS_TOKEN;
  if (!expected || token !== `Bearer ${expected}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

/**
 * 🎧 /mp3?url=...
 * Télécharge une vidéo et retourne le MP3 brut
 */
app.get('/mp3', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('Missing ?url');

  const videoPath = path.join(tmp, 'input.mp4');
  const audioPath = path.join(tmp, 'output.mp3');

  try {
    const response = await axios.get(videoUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(videoPath);
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    execSync(`ffmpeg -i ${videoPath} -vn -ar 16000 -ac 1 -f mp3 ${audioPath}`);

    res.setHeader('Content-Type', 'audio/mpeg');
    fs.createReadStream(audioPath).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Error');
  }
});

/**
 * 📝 /captions?url=...&format=srt|json
 * Transcrit l'audio et retourne un fichier de sous-titres
 */
app.get('/captions', async (req, res) => {
  const videoUrl = req.query.url;
  const format = req.query.format === 'json' ? 'verbose_json' : 'srt';

  if (!videoUrl) return res.status(400).send('Missing ?url');

  const videoPath = path.join(tmp, 'input.mp4');
  const audioPath = path.join(tmp, 'output.mp3');

  try {
    const response = await axios.get(videoUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(videoPath);
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    execSync(`ffmpeg -i ${videoPath} -vn -ar 16000 -ac 1 -f mp3 ${audioPath}`);

    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: format,
    });

    res.setHeader('Content-Type', format === 'verbose_json' ? 'application/json' : 'text/plain');
    res.send(transcript);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Error');
  }
});

app.listen(port, () => {
  console.log(`🚀 extract-and-caption running on port ${port}`);
});
