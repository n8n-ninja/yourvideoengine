// cubeStore.ts
import { create } from "zustand"
import * as THREE from "three"

type CubeStore = {
  cubes: THREE.Group[]
  addCube: (ref: THREE.Group) => void
  removeCube: (ref: THREE.Group) => void
}

export const useCubeStore = create<CubeStore>((set) => ({
  cubes: [],
  addCube: (ref) =>
    set((state) => ({
      cubes: [...state.cubes, ref],
    })),
  removeCube: (ref) =>
    set((state) => ({
      cubes: state.cubes.filter((cube) => cube !== ref),
    })),
}))
