import express from "express"
import axios from "axios"
import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { OpenAI } from "openai"

const app = express()
const port = process.env.PORT || 3000
const tmp = "/tmp"
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(express.json())

/**
 * 🔐 Protection middleware
 */
app.use((req, res, next) => {
  const token = req.headers.authorization
  const expected = process.env.ACCESS_TOKEN
  if (!expected || token !== `Bearer ${expected}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  next()
})

/**
 * 🎧 /mp3?url=...
 * Downloads a video and returns the raw MP3
 */
app.post("/mp3", async (req, res) => {
  const videoUrl = req.body.url
  if (!videoUrl) return res.status(400).send("Missing url")

  const videoPath = path.join(tmp, "input.mp4")
  const audioPath = path.join(tmp, "output.mp3")

  try {
    const response = await axios.get(videoUrl, { responseType: "stream" })
    const writer = fs.createWriteStream(videoPath)
    await new Promise((resolve, reject) => {
      response.data.pipe(writer)
      writer.on("finish", resolve)
      writer.on("error", reject)
    })

    execSync(
      `ffmpeg -y -i ${videoPath} -vn -ar 16000 -ac 1 -f mp3 ${audioPath}`,
    )

    res.setHeader("Content-Type", "audio/mpeg")
    fs.createReadStream(audioPath).pipe(res)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message || "Error")
  }
})

/**
 * 📝 /captions?url=...&format=srt|json|text
 * Transcribes audio and returns a subtitle file
 */
app.post("/captions", async (req, res) => {
  const videoUrl = req.body.url
  const requestedFormat = req.body.format
  const format = requestedFormat === "json" ? "verbose_json" : "srt"
  const cleaningPrompt = req.body.cleaning_prompt

  if (!videoUrl) return res.status(400).send("Missing url")

  const videoPath = path.join(tmp, "input.mp4")
  const audioPath = path.join(tmp, "output.mp3")

  try {
    const response = await axios.get(videoUrl, { responseType: "stream" })
    const writer = fs.createWriteStream(videoPath)
    await new Promise((resolve, reject) => {
      response.data.pipe(writer)
      writer.on("finish", resolve)
      writer.on("error", reject)
    })

    execSync(
      `ffmpeg -y -i ${videoPath} -vn -ar 16000 -ac 1 -f mp3 ${audioPath}`,
    )

    let transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: format,
    })

    if (cleaningPrompt) {
      const basePrompt =
        "You are a subtitle cleaning assistant. Your job is to clean and improve subtitles, strictly respecting the original subtitle format (SRT or JSON), but applying the following user rules:"
      const fullPrompt = `${basePrompt}\n${cleaningPrompt}`
      let transcriptText = transcript
      if (format === "verbose_json" && transcript.text) {
        transcriptText = transcript.text
      }
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: fullPrompt },
          { role: "user", content: transcriptText },
        ],
      })
      transcript = gptResponse.choices[0].message.content
    }

    res.setHeader(
      "Content-Type",
      format === "verbose_json" ? "application/json" : "text/plain",
    )
    res.send(transcript)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message || "Error")
  }
})

app.listen(port, () => {
  console.log(`🚀 extract-and-caption running on port ${port}`)
})
