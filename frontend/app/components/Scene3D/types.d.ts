import { Object3D } from "three"
import { UseSpringProps } from "@react-spring/three"

declare module "@react-spring/three" {
  interface WithAnimated {
    group: Object3D
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    ambientLight: {
      intensity?: number
    }
    pointLight: {
      position?: [number, number, number]
      intensity?: number
    }
  }
}

declare module "@react-three/drei" {
  interface ThreeElements {
    meshStandardMaterial: {
      color?: string
      emissive?: string
      emissiveIntensity?: number
    }
  }
}
