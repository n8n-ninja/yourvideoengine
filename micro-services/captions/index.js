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

    execSync(`ffmpeg -i ${videoPath} -vn -ar 16000 -ac 1 -f mp3 ${audioPath}`)

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
  let format =
    req.body.format === "json"
      ? "verbose_json"
      : req.body.format === "text"
        ? "text"
        : "srt"
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

    execSync(`ffmpeg -i ${videoPath} -vn -ar 16000 -ac 1 -f mp3 ${audioPath}`)

    // For Whisper, we use srt or verbose_json, never text directly
    const whisperFormat = format === "verbose_json" ? "verbose_json" : "srt"
    let transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: whisperFormat,
    })

    // If cleaningPrompt is provided, clean the text with GPT
    if (cleaningPrompt) {
      let transcriptText = transcript
      if (whisperFormat === "verbose_json" && transcript.text) {
        transcriptText = transcript.text
      }
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: cleaningPrompt },
          { role: "user", content: transcriptText },
        ],
      })
      transcript = gptResponse.choices[0].message.content
    }

    // If format == text, do a LLM post-processing to get pure text
    // Prompt to get pure text from subtitles
    const pureTextPrompt =
      "Transform these subtitles into continuous text, without timecodes, formatting, or comments. Only the spoken text, well written."
    if (format === "text") {
      const gptTextResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: pureTextPrompt },
          { role: "user", content: transcript },
        ],
      })
      transcript = gptTextResponse.choices[0].message.content
      res.setHeader("Content-Type", "text/plain")
      res.send(transcript)
      return
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
