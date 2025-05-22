import { json } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"

interface HeyGenVideoStatus {
  callback_id: string | null
  caption_url: string | null
  duration: number | null
  error: {
    code: number
    detail: string
    message: string
  } | null
  gif_url: string | null
  id: string
  status: "processing" | "completed" | "failed" | "pending" | "waiting"
  thumbnail_url: string | null
  video_url: string | null
  video_url_caption: string | null
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 })
  }

  try {
    const data = (await request.json()) as { data: HeyGenVideoStatus }
    return json(data)
  } catch (error) {
    console.error("Error processing HeyGen status:", error)
    return json({ error: "Invalid request body" }, { status: 400 })
  }
}
