// app/components/Scene3D/Scene3D.tsx
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import {
  TextureLoader,
  EquirectangularReflectionMapping,
  Mesh,
  Group,
} from "three"
import { useCubeStore } from "./cubeStore"
import { useState, useEffect, useRef, useMemo } from "react"
import {
  RoundedBox,
  MeshTransmissionMaterial,
  Billboard,
  OrbitControls,
} from "@react-three/drei"
import * as THREE from "three"

// Define named formations for better control and reusability
export const formations = {
  organic: [
    { position: [-7, 2, 2], rotation: [0, 0, 0] },
    { position: [3, -1.5, -2], rotation: [0.1, 0.2, 0] },
    { position: [2, 2.5, -2], rotation: [0.2, -0.1, 0.1] },
    { position: [-3.5, 0.3, 3], rotation: [0, 0.3, -0.1] },
    { position: [-2, -1, 2.2], rotation: [0, -0.2, 0.2] },
    { position: [-2.2, -4, -1.5], rotation: [-0.1, 0, 0.1] },
    { position: [2.5, 0.5, -1.5], rotation: [0, 0.1, 0] },
  ],
  grid: [
    { position: [-2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 0], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 0], rotation: [0, 0, 0] },
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 1, 0], rotation: [0, 0, 0] },
    { position: [1, 1, 0], rotation: [0, 0, 0] },
  ],
  alternateGrid: [
    { position: [-2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 1], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 1], rotation: [0, 0, 0] },
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 1, 0], rotation: [0, 0, 0] },
    { position: [1, 1, 0], rotation: [0, 0, 0] },
  ],
  alternateGridFinal: [
    { position: [-2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 1], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 1], rotation: [0, 0, 0] },
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 0], rotation: [0, 0, 0] },
  ],
  showcase: [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],
  circle: [
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [1.4, 0, 1.4], rotation: [0, 0.5, 0] },
    { position: [0, 0, 2], rotation: [0, 1.0, 0] },
    { position: [-1.4, 0, 1.4], rotation: [0, 1.5, 0] },
    { position: [-2, 0, 0], rotation: [0, 2.0, 0] },
    { position: [-1.4, 0, -1.4], rotation: [0, 2.5, 0] },
    { position: [1.4, 0, -1.4], rotation: [0, 3.0, 0] },
  ],
  column: [
    { position: [0, 3, 0], rotation: [0, 0, 0] },
    { position: [0, 2, 0], rotation: [0, 0, 0] },
    { position: [0, 1, 0], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [0, -1, 0], rotation: [0, 0, 0] },
    { position: [0, -2, 0], rotation: [0, 0, 0] },
    { position: [0, -3, 0], rotation: [0, 0, 0] },
  ],
  arch: [
    { position: [-2.5, -1, 0], rotation: [0, 0, 0] },
    { position: [-1.5, 0.5, 0], rotation: [0, 0.1, 0] },
    { position: [-0.5, 1.5, 0], rotation: [0, 0.2, 0] },
    { position: [0.5, 1.5, 0], rotation: [0, -0.2, 0] },
    { position: [1.5, 0.5, 0], rotation: [0, -0.1, 0] },
    { position: [2.5, -1, 0], rotation: [0, 0, 0] },
    { position: [-2, -2.3, 0], rotation: [0, 0, 0.2] },
  ],
}

// Type definitions for better type safety
export type FormationName = keyof typeof formations

export type FormationTrigger = {
  elementRef: React.RefObject<HTMLDivElement>
  formation: FormationName
}

const CustomEnvironment = () => {
  const texture = useLoader(TextureLoader, "/hdri/aesthetic.jpg")
  texture.mapping = EquirectangularReflectionMapping
  return <primitive attach="environment" object={texture} />
}

// Fonction pour créer une texture avec un emoji
const createEmojiTexture = (emoji: string) => {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.fillStyle = "transparent"
    ctx.fillRect(0, 0, 256, 256)
    ctx.fillStyle = "white"
    ctx.font = "250px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(emoji, 128, 150)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const GradientCube = ({
  cubeId,
  emoji,
  currentFormation,
  targetFormation,
  transitionProgress,
}: {
  cubeId: number
  emoji: string
  currentFormation: FormationName
  targetFormation: FormationName
  transitionProgress: number
}) => {
  const color = "#ff9a9e"
  const meshRef = useRef<Mesh>(null!)
  const groupRef = useRef<Group>(null!)
  const emojiTexture = useMemo(() => createEmojiTexture(emoji), [emoji])

  useEffect(() => {
    const group = groupRef.current
    if (group) {
      useCubeStore.getState().addCube(group)
      return () => {
        useCubeStore.getState().removeCube(group)
      }
    }
  }, [])

  useFrame(() => {
    const self = groupRef.current
    if (!self) return

    const currentPose = formations[currentFormation]?.[cubeId]
    const targetPose = formations[targetFormation]?.[cubeId]
    if (!currentPose || !targetPose) return

    // Interpolation position
    const interpolatedPos = new THREE.Vector3()
      .fromArray(currentPose.position)
      .lerp(
        new THREE.Vector3().fromArray(targetPose.position),
        transitionProgress
      )
    self.position.lerp(interpolatedPos, 0.1)

    // Interpolation rotation
    const lerpRot = (a: number, b: number) => a + (b - a) * transitionProgress
    self.rotation.x +=
      (lerpRot(currentPose.rotation[0], targetPose.rotation[0]) -
        self.rotation.x) *
      0.1
    self.rotation.y +=
      (lerpRot(currentPose.rotation[1], targetPose.rotation[1]) -
        self.rotation.y) *
      0.1
    self.rotation.z +=
      (lerpRot(currentPose.rotation[2], targetPose.rotation[2]) -
        self.rotation.z) *
      0.1
  })

  return (
    <group ref={groupRef}>
      <RoundedBox ref={meshRef} args={[1, 1, 1]} radius={0.1} smoothness={2}>
        <MeshTransmissionMaterial
          thickness={0.2}
          chromaticAberration={0.1}
          anisotropy={0.5}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={0.3}
          iridescenceIOR={1.3}
          ior={1.1}
          distortion={0.05}
          distortionScale={0.1}
          temporalDistortion={0}
          metalness={0.1}
          roughness={0.05}
          transmission={0.98}
          color={color}
          opacity={0.95}
          transparent={true}
          reflectivity={0.1}
          attenuationDistance={1.2}
          attenuationColor={color}
        />
      </RoundedBox>

      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 0, 0.1]}
      >
        <mesh scale={0.5}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={emojiTexture}
            side={THREE.DoubleSide}
            alphaTest={0.1}
            depthTest={true}
            depthWrite={true}
          />
        </mesh>
      </Billboard>
    </group>
  )
}

type Scene3DProps = {
  formationTriggers: FormationTrigger[]
  transitionDuration?: number // Now used for smoothing factor rather than explicit duration
  defaultFormation?: FormationName
  emojis?: string[]
}

export const Scene3D = ({
  formationTriggers,
  defaultFormation = "organic",
  emojis = ["🎬", "✂️", "🧠", "🎤", "🎭", "⏱", "📤"],
}: Scene3DProps) => {
  const [opacity, setOpacity] = useState(0)
  const [currentFormation, setCurrentFormation] =
    useState<FormationName>(defaultFormation)
  const [targetFormation, setTargetFormation] =
    useState<FormationName>(defaultFormation)
  const [transitionProgress, setTransitionProgress] = useState(1)

  // Store valid triggers (those with refs that exist in DOM)
  const [validTriggers, setValidTriggers] = useState<
    Array<{
      elementRef: React.RefObject<HTMLDivElement>
      formation: FormationName
      topPosition: number
    }>
  >([])

  // Setup for tracking scroll position
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpacity(1)
    }, 600)

    return () => clearTimeout(timeout)
  }, [])

  // Calculate trigger positions and update on resize
  useEffect(() => {
    const calculateTriggerPositions = () => {
      const validTriggersList = formationTriggers
        .filter((trigger) => trigger.elementRef.current !== null)
        .map((trigger) => ({
          elementRef: trigger.elementRef,
          formation: trigger.formation,
          topPosition:
            trigger.elementRef.current!.getBoundingClientRect().top +
            window.scrollY,
        }))
        .sort((a, b) => a.topPosition - b.topPosition) // Sort by position in document

      setValidTriggers(validTriggersList)
    }

    // Initial calculation
    calculateTriggerPositions()

    // Recalculate on window resize
    window.addEventListener("resize", calculateTriggerPositions)

    return () => {
      window.removeEventListener("resize", calculateTriggerPositions)
    }
  }, [formationTriggers])

  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Return early if we don't have at least 2 triggers to interpolate between
      if (validTriggers.length < 2) {
        if (validTriggers.length === 1) {
          setCurrentFormation(validTriggers[0].formation)
          setTargetFormation(validTriggers[0].formation)
          setTransitionProgress(1)
        }
        return
      }

      const currentScrollPosition = window.scrollY

      // Find which section we're currently in
      let currentSectionIndex = 0

      // Find the last trigger that we've scrolled past
      for (let i = 0; i < validTriggers.length - 1; i++) {
        if (currentScrollPosition >= validTriggers[i].topPosition) {
          currentSectionIndex = i
        } else {
          break
        }
      }

      // If we're before the first trigger
      if (currentScrollPosition < validTriggers[0].topPosition) {
        setCurrentFormation(validTriggers[0].formation)
        setTargetFormation(validTriggers[0].formation)
        setTransitionProgress(1)
        return
      }

      // If we're after the last trigger
      if (currentSectionIndex === validTriggers.length - 1) {
        setCurrentFormation(validTriggers[validTriggers.length - 1].formation)
        setTargetFormation(validTriggers[validTriggers.length - 1].formation)
        setTransitionProgress(1)
        return
      }

      // Calculate progress between the current and next trigger
      const currentTrigger = validTriggers[currentSectionIndex]
      const nextTrigger = validTriggers[currentSectionIndex + 1]

      const sectionLength = nextTrigger.topPosition - currentTrigger.topPosition
      const scrollPositionInSection =
        currentScrollPosition - currentTrigger.topPosition

      // Calculate progress as a value between 0 and 1
      const rawProgress =
        sectionLength > 0 ? scrollPositionInSection / sectionLength : 0
      const progress = Math.max(0, Math.min(1, rawProgress))

      setCurrentFormation(currentTrigger.formation)
      setTargetFormation(nextTrigger.formation)
      setTransitionProgress(progress)
    }

    // Initial calculation
    handleScroll()

    // Add scroll listener
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [validTriggers])

  return (
    <div
      className="w-full h-full relative"
      style={{
        opacity,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        camera={{ position: [3, 3, 3] }}
      >
        <CustomEnvironment />

        {formations[currentFormation]?.map((_, i) => (
          <GradientCube
            key={i}
            cubeId={i}
            currentFormation={currentFormation}
            targetFormation={targetFormation}
            transitionProgress={transitionProgress}
            emoji={emojis[i] || "⚡"}
          />
        ))}

        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Scene3D
