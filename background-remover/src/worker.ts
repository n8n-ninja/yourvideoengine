import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import axios from "axios"
import { spawn } from "child_process"
import * as fs from "fs/promises"
import * as path from "path"

const s3 = new S3Client({})
const ddb = new DynamoDBClient({})
const OUTPUT_BUCKET = process.env.OUTPUT_BUCKET!
const JOBS_TABLE = process.env.JOBS_TABLE!
const CHROMAKEY_FILTER =
  process.env.CHROMAKEY_FILTER || "chromakey=0x00FF00:0.39:0.25"

async function runFfmpeg(
  inputPath: string,
  outputPath: string,
  chromakeyFilter?: string,
) {
  console.log(`[runFfmpeg DEBUG] ${chromakeyFilter}`)
  const filter = (chromakeyFilter || CHROMAKEY_FILTER) + ",format=yuva420p"
  console.log(
    `[runFfmpeg] Start: inputPath=${inputPath}, outputPath=${outputPath}, filter=${filter}`,
  )
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("/opt/bin/ffmpeg", [
      "-i",
      inputPath,
      "-vf",
      filter,
      "-c:v",
      "libvpx",
      "-auto-alt-ref",
      "0",
      "-threads",
      "2",
      "-deadline",
      "realtime",
      "-b:v",
      "4M",
      "-quality",
      "best",
      "-crf",
      "10",
      "-pix_fmt",
      "yuva420p",
      outputPath,
    ])
    let stderr = ""
    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString()
    })
    ffmpeg.on("close", (code) => {
      console.log(`[runFfmpeg] ffmpeg closed with code ${code}`)
      if (code === 0) resolve(true)
      else {
        console.error(`[runFfmpeg] ffmpeg stderr:`, stderr)
        reject(new Error("FFmpeg failed with code " + code))
      }
    })
    ffmpeg.on("error", (err) => {
      console.error(`[runFfmpeg] ffmpeg error`, err)
      reject(err)
    })
  })
}

export const handler = async (event: any) => {
  console.log(`[worker] Event received`, JSON.stringify(event))
  for (const record of event.Records) {
    const { jobId, inputUrl, chromakeyFilter } = JSON.parse(record.body)
    console.log(`[worker] Processing jobId=${jobId}, inputUrl=${inputUrl}`)
    const inputPath = `/tmp/${jobId}.mp4`
    const outputPath = `/tmp/${jobId}.webm`
    try {
      // Download input video
      console.log(`[worker] Downloading input video from ${inputUrl}`)
      const res = await axios.get(inputUrl, { responseType: "arraybuffer" })
      await fs.writeFile(inputPath, Buffer.from(res.data))
      console.log(`[worker] Input video saved to ${inputPath}`)
      // Run ffmpeg
      await runFfmpeg(inputPath, outputPath, chromakeyFilter)
      console.log(`[worker] ffmpeg finished, output at ${outputPath}`)
      // Upload to S3
      const s3Key = `jobs/${jobId}.webm`
      const fileData = await fs.readFile(outputPath)
      console.log(
        `[worker] Uploading output to S3: bucket=${OUTPUT_BUCKET}, key=${s3Key}`,
      )
      await s3.send(
        new PutObjectCommand({
          Bucket: OUTPUT_BUCKET,
          Key: s3Key,
          Body: fileData,
          ContentType: "video/webm",
        }),
      )
      const outputUrl = `https://diwa7aolcke5u.cloudfront.net/${s3Key}`
      console.log(`[worker] Uploaded to S3, outputUrl=${outputUrl}`)
      // Update DynamoDB
      console.log(`[worker] Updating DynamoDB: jobId=${jobId}, status=DONE`)
      await ddb.send(
        new UpdateItemCommand({
          TableName: JOBS_TABLE,
          Key: { jobId: { S: jobId } },
          UpdateExpression: "SET #s = :done, outputUrl = :url",
          ExpressionAttributeNames: { "#s": "status" },
          ExpressionAttributeValues: {
            ":done": { S: "DONE" },
            ":url": { S: outputUrl },
          },
        }),
      )
      console.log(`[worker] DynamoDB updated: jobId=${jobId}, status=DONE`)
    } catch (err: any) {
      console.error(`[worker] Error processing jobId=${jobId}:`, err)
      await ddb.send(
        new UpdateItemCommand({
          TableName: JOBS_TABLE,
          Key: { jobId: { S: jobId } },
          UpdateExpression: "SET #s = :err, #e = :msg",
          ExpressionAttributeNames: { "#s": "status", "#e": "error" },
          ExpressionAttributeValues: {
            ":err": { S: "ERROR" },
            ":msg": { S: err.message },
          },
        }),
      )
      console.log(`[worker] DynamoDB updated: jobId=${jobId}, status=ERROR`)
    } finally {
      console.log(`[worker] Cleaning up files: ${inputPath}, ${outputPath}`)
      await fs.rm(inputPath, { force: true })
      await fs.rm(outputPath, { force: true })
      console.log(`[worker] Cleanup done for jobId=${jobId}`)
    }
  }
}
