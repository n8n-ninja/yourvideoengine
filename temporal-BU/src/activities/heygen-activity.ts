import { ApplicationFailure } from "@temporalio/common"

export type HeyGenParams = {
  script: string
  avatar_id: string
  voice_id: string
  style?: string
  speed?: number
  width?: number
  height?: number
}

export async function startHeygen(
  params: HeyGenParams,
): Promise<{ videoId: string }> {
  const { HEYGEN_API_KEY, HEYGEN_RENDER_URL } = process.env

  if (!HEYGEN_API_KEY || !HEYGEN_RENDER_URL) {
    throw new Error("HeyGen config missing")
  }

  const {
    script,
    avatar_id,
    voice_id,
    style = "normal",
    speed = 1.0,
    width = 1080,
    height = 1920,
  } = params

  const payload = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id,
          avatar_style: style,
        },
        voice: {
          type: "text",
          input_text: script,
          voice_id,
          speed,
        },
      },
    ],
    dimension: {
      width,
      height,
    },
  }

  return { videoId: "sample-id" }

  // TEMP MOCK DATA >>>

  // const res = await fetch(HEYGEN_RENDER_URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-Api-Key": HEYGEN_API_KEY,
  //   },
  //   body: JSON.stringify(payload),
  // })

  // const data = await res.json()
  // if (!res.ok) {
  //   console.error("❌ Erreur API HeyGen:", data)
  //   throw new Error(`HeyGen API error: ${res.status}`)
  // }

  // return { videoId: data.data.video_id }
}

export async function checkHeygenStatus(
  videoId: string,
): Promise<{ status: "pending" | "done"; url?: string; duration?: number }> {
  const { HEYGEN_STATUS_URL, HEYGEN_API_KEY } = process.env

  if (!HEYGEN_STATUS_URL || !HEYGEN_API_KEY) {
    throw new Error("HeyGen config missing")
  }

  return {
    status: "done",
    url: "https://diwa7aolcke5u.cloudfront.net/uploads/0d9256b1c3494d71adc592ffebf7ba85.mp4",
    duration: 10,
  }

  // TEMP MOCK DATA >>>

  // const url = `${HEYGEN_STATUS_URL}?video_id=${videoId}`
  // const res = await fetch(url, {
  //   method: "GET",
  //   headers: {
  //     Accept: "application/json",
  //     "X-Api-Key": HEYGEN_API_KEY,
  //   },
  // })

  // if (!res.ok) {
  //   const err = await res.text()
  //   console.error("❌ Erreur API HeyGen Status:", err)
  //   throw new Error(`HeyGen status error: ${res.status}`)
  // }

  // const data = await res.json()
  // // console.log("📥 Status response:", JSON.stringify(data, null, 2))

  // const status = data.data?.status
  // const urlVideo = data.data?.video_url
  // const error = data.data?.error

  // if (status === "completed") {
  //   return { status: "done", url: urlVideo, duration: data.data?.duration }
  // }

  // if (data.data?.status === "failed") {
  //   const error = data.data.error
  //   const code = error?.code || "UNKNOWN"
  //   const message = error?.message || "Unknown failure"

  //   if (data.data.error?.code === "MOVIO_PAYMENT_INSUFFICIENT_CREDIT") {
  //     throw ApplicationFailure.nonRetryable(
  //       "💥 Crédit HeyGen insuffisant",
  //       "InsufficientCreditError",
  //     )
  //   }

  //   throw new Error(`HeyGen rendering failed: ${code} - ${message}`)
  // }

  // return { status: "pending" }
}
