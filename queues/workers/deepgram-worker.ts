import { Job } from "../models/job"
import { WorkerResult } from "../orchestrator/queue-orchestrator"

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY!
const DEEPGRAM_URL = process.env.DEEPGRAM_URL!

export const deepgramWorker = async (job: Job): Promise<WorkerResult> => {
  const params = job.inputData
  // Construction de la requête Deepgram
  const url = new URL(DEEPGRAM_URL)
  if (params.model) url.searchParams.set("model", params.model)
  if (params.language) url.searchParams.set("language", params.language)
  if (params.punctuate) url.searchParams.set("punctuate", "true")
  if (params.model === "nova-3" && Array.isArray(params.keywords)) {
    params.keywords.forEach((k: string) =>
      url.searchParams.append("keyterm", k)
    )
  } else if (params.keywords && Array.isArray(params.keywords)) {
    params.keywords.forEach((k: string) =>
      url.searchParams.append("keywords", k)
    )
  }
  const inputData = {
    url: params.videoUrl,
  }
  try {
    console.log(
      "[deepgramWorker] Calling Deepgram API",
      url.toString(),
      inputData
    )
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
    const data: any = await res.json()
    console.log("[deepgramWorker] API response", data)
    if (data.error) {
      console.log("[deepgramWorker] Deepgram error", data.error)
      return {
        status: "failed",
        outputData: data,
        returnData: { error: data.error },
      }
    }
    return {
      status: "ready",
      outputData: data,
      returnData: data?.results?.channels?.[0]?.alternatives?.[0] ?? undefined,
    }
  } catch (error) {
    console.log("[deepgramWorker] Exception", error)
    return {
      status: "failed",
      outputData: {},
      returnData: { error: (error as Error).message },
    }
  }
}
