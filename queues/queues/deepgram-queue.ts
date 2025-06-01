import { fetchWithTimeout } from "../index"
import { startJobGeneric, pollJobGeneric } from "../utils/generic-queue"
import { scanJobs, Job } from "../utils/dynamo-helpers"

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY
const DEEPGRAM_URL = process.env.DEEPGRAM_URL

export const handleDeepgramJob = (job: Job) => {
  const { inputData: params } = job
  const apiKey = params.apiKey || DEEPGRAM_API_KEY
  if (!apiKey) return
  // Construction de la requête Deepgram
  const url = new URL(DEEPGRAM_URL!)
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
  const deepgramApiCall = async (_inputData: any) => {
    const res = await fetchWithTimeout(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
    const data = await res.json()
    return {
      externalId: data.request_id ?? job.jobId,
      outputData: data,
    }
  }
  // Fire-and-forget
  startJobGeneric({
    inputData,
    apiCall: deepgramApiCall,
    job,

    maxRetries: 3,
  })
    .then(() => pollDeepgramHandler())
    .catch((err) => {
      console.error("[handleDeepgramJob] Erreur async:", err)
    })
  // Retour immédiat
}

export const pollDeepgramHandler = async (): Promise<void> => {
  const processingJobs = (await scanJobs()).filter(
    (job) => job.status === "processing" && job.queueType === "deepgram"
  )
  const deepgramPollApi = async (job: Job) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = job.outputData
    return {
      done: true,
      failed: false,
      outputData: data,
      returnData: data?.results?.channels?.[0]?.alternatives?.[0] ?? undefined,
    }
  }
  for (const job of processingJobs) {
    await pollJobGeneric({
      pollApi: deepgramPollApi,
      job,
      queueType: "deepgram",
    })
  }
}
