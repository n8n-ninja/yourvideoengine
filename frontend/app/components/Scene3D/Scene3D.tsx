// app/components/Scene3D/Scene3D.tsx
import { Canvas, useFrame } from "@react-three/fiber"
import { useLoader } from "@react-three/fiber"
import { TextureLoader, EquirectangularReflectionMapping } from "three"
import {
  RoundedBox,
  Environment,
  MeshTransmissionMaterial,
  Billboard,
} from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useRef, useMemo } from "react"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"

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

const GradientCube = ({ position = [0, 0, 0], emoji = "🎬" }) => {
  const meshRef = useRef()
  const emojiTexture = useMemo(() => createEmojiTexture(emoji), [emoji])
  const color = "#7B68EE"

  return (
    <group position={position}>
      <RoundedBox ref={meshRef} args={[1, 1, 1]}>
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
  return (
    <div className="w-full h-[80vh] relative">
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        camera={{ position: [4, 3, 4] }}
      >
        {/* Environment map pour les reflets */}
        {/* <Environment
          preset="night"
          blur={89}
          background={false}
          scene={undefined}
        /> */}

        <CustomEnvironment />

        {/* Les cubes avec différentes couleurs et emojis */}
        <GradientCube position={[1, 1, 1]} emoji="🎬" />
        <GradientCube position={[2, 1, 1]} emoji="✂️" />
        <GradientCube position={[1, 1, 2]} emoji="🧠" />
        <GradientCube position={[1, 1, 0]} emoji="🎤" />
        <GradientCube position={[0, 1, 1]} emoji="🎭" />
        <GradientCube position={[1, 0, 1]} emoji="⏱" />
        <GradientCube position={[1, 2, 1]} emoji="📤" />

        {/* <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
            kernelSize={2}
          />
        </EffectComposer> */}

        <OrbitControls />
      </Canvas>
    </div>
  )
}
