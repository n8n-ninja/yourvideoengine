import { AbsoluteFill } from "remotion"
import { useState, useEffect } from "react"
import { RenderTrack } from "@/components/RenderTrack"
import type { TrackType } from "@/schemas/project"

interface RenderTracksProps<T> {
  getTracks: (props: T) => Promise<TrackType[]>
  props: T
}

export const RenderTracks = <T,>({
  getTracks,
  props,
}: RenderTracksProps<T>) => {
  const [tracks, setTracks] = useState<TrackType[]>([])

  useEffect(() => {
    let isMounted = true
    const fetchTracks = async () => {
      const result = await getTracks(props)
      if (isMounted) setTracks(result)
    }
    fetchTracks()
    return () => {
      isMounted = false
    }
  }, [props, getTracks])

  if (!tracks.length) return null

  const duration = tracks[0].duration

  tracks.forEach((track) => {
    track.duration = duration
  })

  console.log(tracks)

  return (
    <AbsoluteFill>
      {tracks.map((track) => (
        <RenderTrack key={track.id} track={track} />
      ))}
    </AbsoluteFill>
  )
}
