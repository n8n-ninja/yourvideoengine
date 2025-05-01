// app/components/Scene3D/Scene3D.tsx
import { Canvas, useFrame } from "@react-three/fiber"
import { useLoader } from "@react-three/fiber"
import { TextureLoader, EquirectangularReflectionMapping } from "three"
import { useCubeStore } from "./cubeStore"
import { useState, useEffect } from "react"
import {
  RoundedBox,
  MeshTransmissionMaterial,
  Billboard,
} from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"

type CubePose = {
  position: [number, number, number]
  rotation: [number, number, number]
}[]
export const poses: CubePose[] = [
  // Pose 0 — Éparpillement organique
  [
    { position: [-7, 2, 2], rotation: [0, 0, 0] },
    { position: [3, -1.5, -2], rotation: [0.1, 0.2, 0] },
    { position: [2, 2.5, -2], rotation: [0.2, -0.1, 0.1] },
    { position: [-3.5, 0.3, 3], rotation: [0, 0.3, -0.1] },
    { position: [-2, -1, 2.2], rotation: [0, -0.2, 0.2] },
    { position: [-2.2, -4, -1.5], rotation: [-0.1, 0, 0.1] },
    { position: [2.5, 0.5, -1.5], rotation: [0, 0.1, 0] },
  ],
  // Pose 1 — Grille modulaire plane
  [
    { position: [-2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 0], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 0], rotation: [0, 0, 0] },
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 1, 0], rotation: [0, 0, 0] },
    { position: [1, 1, 0], rotation: [0, 0, 0] },
  ],
  // Pose 1 — Grille modulaire plane
  [
    { position: [-2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 0], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 0], rotation: [0, 0, 0] },
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 1, 0], rotation: [0, 0, 0] },
    { position: [1, 1, 0], rotation: [0, 0, 0] },
  ],
  // Pose 1 — Grille modulaire plane
  [
    { position: [-2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 1], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 1], rotation: [0, 0, 0] },
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 1, 0], rotation: [0, 0, 0] },
    { position: [1, 1, 0], rotation: [0, 0, 0] },
  ],
  // Pose 1 — Grille modulaire plane
  [
    { position: [-2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 1], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 1], rotation: [0, 0, 0] },
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [-1, 0, 0], rotation: [0, 0, 0] },
    { position: [1, 0, 0], rotation: [0, 0, 0] },
  ],
  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],
  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],
  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],

  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],

  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],

  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],

  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],
  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],
  // Pose 3 — Vitrine dynamique (plus visible)
  [
    { position: [15.5, 1.2, 0], rotation: [0, 0.2, 0] },
    { position: [-10.2, -0.8, 10], rotation: [0, -0.2, 0] },
    { position: [10, 10, 0], rotation: [0.1, 0.3, -0.1] },
    { position: [19.2, -1.2, 0.4], rotation: [-0.1, 0.1, 0.1] },
    { position: [10, 0.5, -0.1], rotation: [0, 0, 0.2] },
    { position: [-10.5, 0.8, 8.2], rotation: [0.2, -0.2, 0] },
    { position: [1.8, -20.3, -0.8], rotation: [-0.2, 0.2, 0.2] },
  ],
  // Pose 2 — Cercle dans l’espace
  [
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [1.4, 0, 1.4], rotation: [0, 0.5, 0] },
    { position: [0, 0, 2], rotation: [0, 1.0, 0] },
    { position: [-1.4, 0, 1.4], rotation: [0, 1.5, 0] },
    { position: [-2, 0, 0], rotation: [0, 2.0, 0] },
    { position: [-1.4, 0, -1.4], rotation: [0, 2.5, 0] },
    { position: [1.4, 0, -1.4], rotation: [0, 3.0, 0] },
  ],
  // Pose 2 — Cercle dans l’espace
  [
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [1.4, 0, 1.4], rotation: [0, 0.5, 0] },
    { position: [0, 0, 2], rotation: [0, 1.0, 0] },
    { position: [-1.4, 0, 1.4], rotation: [0, 1.5, 0] },
    { position: [-2, 0, 0], rotation: [0, 2.0, 0] },
    { position: [-1.4, 0, -1.4], rotation: [0, 2.5, 0] },
    { position: [1.4, 0, -1.4], rotation: [0, 3.0, 0] },
  ],
  // Pose 2 — Cercle dans l’espace
  [
    { position: [2, 0, 0], rotation: [0, 0, 0] },
    { position: [1.4, 0, 1.4], rotation: [0, 0.5, 0] },
    { position: [0, 0, 2], rotation: [0, 1.0, 0] },
    { position: [-1.4, 0, 1.4], rotation: [0, 1.5, 0] },
    { position: [-2, 0, 0], rotation: [0, 2.0, 0] },
    { position: [-1.4, 0, -1.4], rotation: [0, 2.5, 0] },
    { position: [1.4, 0, -1.4], rotation: [0, 3.0, 0] },
  ],
  // Pose 4 — Colonne verticale
  [
    { position: [0, 3, 0], rotation: [0, 0, 0] },
    { position: [0, 2, 0], rotation: [0, 0, 0] },
    { position: [0, 1, 0], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [0, -1, 0], rotation: [0, 0, 0] },
    { position: [0, -2, 0], rotation: [0, 0, 0] },
    { position: [0, -3, 0], rotation: [0, 0, 0] },
  ],
  // Pose 4 — Colonne verticale
  [
    { position: [0, 3, 0], rotation: [0, 0, 0] },
    { position: [0, 2, 0], rotation: [0, 0, 0] },
    { position: [0, 1, 0], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [0, -1, 0], rotation: [0, 0, 0] },
    { position: [0, -2, 0], rotation: [0, 0, 0] },
    { position: [0, -3, 0], rotation: [0, 0, 0] },
  ],
  // Pose 4 — Colonne verticale
  [
    { position: [0, 3, 0], rotation: [0, 0, 0] },
    { position: [0, 2, 0], rotation: [0, 0, 0] },
    { position: [0, 1, 0], rotation: [0, 0, 0] },
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [0, -1, 0], rotation: [0, 0, 0] },
    { position: [0, -2, 0], rotation: [0, 0, 0] },
    { position: [0, -3, 0], rotation: [0, 0, 0] },
  ],
  // Pose 6 — Arche verticale
  [
    { position: [-2.5, -1, 0], rotation: [0, 0, 0] },
    { position: [-1.5, 0.5, 0], rotation: [0, 0.1, 0] },
    { position: [-0.5, 1.5, 0], rotation: [0, 0.2, 0] },
    { position: [0.5, 1.5, 0], rotation: [0, -0.2, 0] },
    { position: [1.5, 0.5, 0], rotation: [0, -0.1, 0] },
    { position: [2.5, -1, 0], rotation: [0, 0, 0] },
    { position: [-2, -2.3, 0], rotation: [0, 0, 0.2] }, // centre bas
  ],
  // Pose 6 — Arche verticale
  [
    { position: [-2.5, -1, 0], rotation: [0, 0, 0] },
    { position: [-1.5, 0.5, 0], rotation: [0, 0.1, 0] },
    { position: [-0.5, 1.5, 0], rotation: [0, 0.2, 0] },
    { position: [0.5, 1.5, 0], rotation: [0, -0.2, 0] },
    { position: [1.5, 0.5, 0], rotation: [0, -0.1, 0] },
    { position: [2.5, -1, 0], rotation: [0, 0, 0] },
    { position: [-2, -2.3, 0], rotation: [0, 0, 0.2] }, // centre bas
  ],
]

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

// Fonction pour créer une position cible aléatoire
const getRandomPosition = () => {
  return [
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
  ]
}

const GradientCube = ({
  cubeId = 0,
  color = "#F8C734",
  emoji = "🎬",
  scrollProgress = 0,
}) => {
  const meshRef = useRef()
  const groupRef = useRef()
  const emojiTexture = useMemo(() => createEmojiTexture(emoji), [emoji])

  let t = scrollProgress

  useEffect(() => {
    if (groupRef.current) {
      useCubeStore.getState().addCube(groupRef.current)
      return () => {
        useCubeStore.getState().removeCube(groupRef.current)
      }
    }
  }, [])

  useFrame(() => {
    const self = groupRef.current as any
    if (!self) return

    const t = scrollProgress // entre 0 et 1
    const max = poses.length - 1
    const floatIndex = t * max
    const base = Math.floor(floatIndex)
    const next = Math.min(base + 1, max)
    const alpha = floatIndex - base

    const currentPose = poses[base]?.[cubeId]
    const nextPose = poses[next]?.[cubeId]
    if (!currentPose || !nextPose) return

    // Interpolation position
    const interpolatedPos = new THREE.Vector3()
      .fromArray(currentPose.position)
      .lerp(new THREE.Vector3().fromArray(nextPose.position), alpha)
    self.position.lerp(interpolatedPos, 0.1)

    // Interpolation rotation
    const lerpRot = (a: number, b: number) => a + (b - a) * alpha
    self.rotation.x +=
      (lerpRot(currentPose.rotation[0], nextPose.rotation[0]) -
        self.rotation.x) *
      0.1
    self.rotation.y +=
      (lerpRot(currentPose.rotation[1], nextPose.rotation[1]) -
        self.rotation.y) *
      0.1
    self.rotation.z +=
      (lerpRot(currentPose.rotation[2], nextPose.rotation[2]) -
        self.rotation.z) *
      0.1
  })

  return (
    <group ref={groupRef}>
      <RoundedBox ref={meshRef} args={[1, 1, 1]} radius={0.1} smoothness={2}>
        <MeshTransmissionMaterial
          thickness={0.2} // Plus fin pour un rendu plus clair
          chromaticAberration={0.1} // Réduction drastique pour limiter l'effet flou coloré
          anisotropy={0.5}
          envMapIntensity={1.5} // Plus subtil
          clearcoat={1}
          clearcoatRoughness={0.1} // Un peu de douceur dans les reflets
          iridescence={0.3}
          iridescenceIOR={1.3}
          ior={1.1}
          distortion={0.05} // Légère touche artistique
          distortionScale={0.1}
          temporalDistortion={0}
          metalness={0.1}
          roughness={0.05} // Presque pas de grain
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

export const Scene3D = () => {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpacity(1)
    }, 600) // attend 1 seconde

    return () => clearTimeout(timeout)
  }, [])
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(progress)
    }

    handleScroll() // initial call
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

        {poses[0].map((_, i) => (
          <GradientCube
            key={i}
            cubeId={i}
            scrollProgress={scrollProgress}
            emoji={["🎬", "✂️", "🧠", "🎤", "🎭", "⏱", "📤"][i]}
          />
        ))}

        <OrbitControls />
      </Canvas>
    </div>
  )
}
