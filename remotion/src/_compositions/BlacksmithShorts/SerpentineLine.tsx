import React from "react"
import {
  useCurrentFrame,
  interpolate,
  Easing,
  Audio,
  staticFile,
  Sequence,
} from "remotion"
import { ForgedNodeStep } from "./ForgedNodeStep"
import { NodeStepLabels } from "./NodeStepLabels"

type Step = {
  logo: string
  note: string
  node: string
}

type SerpentineLineProps = {
  steps: Step[]
}

type ScrollSegment = {
  start: number
  end: number
  y: number
}

export const SerpentineLine: React.FC<SerpentineLineProps> = ({ steps }) => {
  const initialDelay = 40
  const frame = useCurrentFrame()
  const heightPerStep = 3800
  const amplitude = 350
  const width = 1080
  const viewportHeight = 1920
  const pauseDuration = 95
  const scrollDuration = 40
  const centerX = width / 2
  const offsetY = viewportHeight / 4

  const getY = (i: number) => offsetY + i * heightPerStep
  const totalHeight = getY(steps.length - 1)

  const scrollPlan: ScrollSegment[] = []

  const totalFrames = steps.length * (pauseDuration + scrollDuration) + 30
  const fadeOutStart = totalFrames - 45

  for (let i = 0; i < steps.length; i++) {
    const pauseStart =
      scrollPlan.length === 0
        ? initialDelay
        : scrollPlan[scrollPlan.length - 1].end

    const pauseEnd = pauseStart + pauseDuration

    scrollPlan.push({
      start: pauseStart,
      end: pauseEnd,
      y: -i * heightPerStep,
    })

    if (i < steps.length - 1) {
      const scrollEnd = pauseEnd + scrollDuration
      scrollPlan.push({
        start: pauseEnd,
        end: scrollEnd,
        y: -(i + 1) * heightPerStep,
      })
    }
  }

  const globalOpacity = interpolate(
    frame,
    [fadeOutStart, totalFrames],
    [1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  )

  const getScrollY = (frame: number, plan: ScrollSegment[]) => {
    if (frame < plan[0].start) return 0 // 👈 On affiche le premier point avant tout scroll

    const segment = plan.find(
      ({ start, end }) => frame >= start && frame <= end,
    )
    if (!segment) return plan[plan.length - 1].y

    const { start, end, y } = segment
    const prevY = plan.findLast(({ end: e }) => e === start)?.y ?? 0

    return interpolate(frame, [start, end], [prevY, y], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateRight: "clamp",
    })
  }
  const scrollY = getScrollY(frame, scrollPlan)

  const getZoomForFrame = (frame: number, scrollPlan: ScrollSegment[]) => {
    const segment = scrollPlan.find(
      ({ start, end }) => frame >= start && frame <= end,
    )
    if (!segment) return 1

    const index = scrollPlan.indexOf(segment)
    const isScroll = index % 2 === 1 // scroll segments are always odd-indexed (pause-scroll-pause-scroll...)

    if (!isScroll) return 1

    return interpolate(
      frame,
      [segment.start, (segment.start + segment.end) / 2, segment.end],
      [1, 1.2, 1],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    )
  }

  const zoom = getZoomForFrame(frame, scrollPlan)

  const pathD = Array.from({ length: steps.length - 1 }, (_, i) => {
    const y1 = getY(i)
    const y2 = getY(i + 1)
    const direction = i % 2 === 0 ? 1 : -1
    const ctrlX = centerX + direction * amplitude

    return `C ${ctrlX},${y1 + heightPerStep / 2} ${ctrlX},${y2 - heightPerStep / 2} ${centerX},${y2}`
  }).reduce(
    (acc, curve, i) =>
      i === 0 ? `M ${centerX},${getY(0)} ${curve}` : `${acc} ${curve}`,
    "",
  )

  const fadeIn = interpolate(frame, [0, initialDelay], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        width,
        height: "100%",
        overflow: "hidden",
        position: "relative",
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
        paddingTop: offsetY,
        opacity: globalOpacity,
      }}
    >
      <svg
        width={width}
        height={totalHeight + offsetY}
        viewBox={`0 0 ${width} ${totalHeight + offsetY}`}
        style={{
          transform: `translateY(${scrollY}px)`,
          opacity: fadeIn,
          transition: "opacity 0.3s ease",
        }}
      >
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={pathD}
          stroke="#FFD700"
          strokeWidth={12}
          fill="none"
          strokeDasharray="24 24"
          filter="url(#glow)"
        />
        {steps.map((step, i) => {
          const y = getY(i)
          const pulse = 1 + 0.3 * Math.sin((frame + i * 10) / 4)
          const pulseOpacity = 1 + 0.2 * Math.sin((frame + i * 10) / 4)
          return (
            <g key={i}>
              <circle
                cx={centerX}
                cy={y}
                r={30}
                fill="white"
                stroke="#FFD700"
                strokeWidth={12}
                filter="url(#glow)"
                style={{
                  transform: `scale(${pulse})`,
                  transformOrigin: "center center",
                  opacity: pulseOpacity,
                  transformBox: "fill-box",
                }}
              />
            </g>
          )
        })}
      </svg>

      {/* Calque DOM par-dessus le SVG */}
      {steps.map((step, i) => {
        const y = getY(i) + scrollY + 500 // Ajuste si besoin
        const appearFrame = initialDelay + i * (pauseDuration + scrollDuration)

        return (
          <React.Fragment key={`node-${i}`}>
            <ForgedNodeStep
              x={centerX}
              y={y}
              logo={step.logo}
              node={step.node}
              appearFrame={appearFrame + 9}
            />
            <NodeStepLabels
              stepIndex={i}
              appearFrame={appearFrame}
              pauseDuration={pauseDuration}
              label={step.note}
            />

            {/* Step */}
            <Sequence from={appearFrame + 2} durationInFrames={80}>
              <Audio
                src={staticFile("sound/stomp.mp3")}
                startFrom={0}
                volume={0.03}
              />
            </Sequence>

            {/* Node */}
            <Sequence from={appearFrame + 5} durationInFrames={80}>
              <Audio
                src={staticFile("sound/stomp.mp3")}
                startFrom={0}
                volume={0.2}
              />
            </Sequence>

            {/* Explenation */}
            <Sequence from={appearFrame + 30} durationInFrames={80}>
              <Audio
                src={staticFile("sound/appear-wind.mp3")}
                startFrom={0}
                volume={0.1}
              />
            </Sequence>

            {/* Wind */}
            {i < steps.length - 1 && (
              <Sequence
                from={appearFrame + pauseDuration}
                durationInFrames={80}
              >
                <Audio
                  src={staticFile("sound/woosh-4.mp3")}
                  startFrom={0}
                  volume={0.2}
                />
              </Sequence>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
