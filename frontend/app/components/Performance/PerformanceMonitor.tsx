import { useState, useEffect, useRef } from "react"
import { Stats } from "@react-three/drei"
import { createPortal } from "react-dom"
import { Canvas } from "@react-three/fiber"

// Type definitions for Performance API
interface PerformanceMemory {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory
}

// Composant pour mesures personnalisées
const CustomPerformanceMonitor = () => {
  const [stats, setStats] = useState({
    fps: 0,
    memory: 0,
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let frameRate = 0

    // Mesurer le FPS
    const measureFPS = () => {
      const now = performance.now()
      frameCount++

      if (now - lastTime > 1000) {
        frameRate = Math.round((frameCount * 1000) / (now - lastTime))
        frameCount = 0
        lastTime = now

        setStats((prev) => ({
          ...prev,
          fps: frameRate,
        }))
      }

      requestAnimationFrame(measureFPS)
    }

    // Mesurer la mémoire
    const measureMemory = () => {
      const extendedPerformance = performance as ExtendedPerformance

      if (extendedPerformance.memory) {
        const memory = Math.round(
          extendedPerformance.memory.usedJSHeapSize / (1024 * 1024)
        )

        setStats((prev) => ({
          ...prev,
          memory,
        }))
      }

      setTimeout(measureMemory, 1000)
    }

    const measureFrames = requestAnimationFrame(measureFPS)
    let memoryInterval: ReturnType<typeof setTimeout> | null = null

    const extendedPerformance = performance as ExtendedPerformance
    if (extendedPerformance.memory) {
      memoryInterval = setTimeout(measureMemory, 1000)
    }

    return () => {
      cancelAnimationFrame(measureFrames)
      if (memoryInterval) clearTimeout(memoryInterval)
    }
  }, [])

  return (
    <div
      className="fixed left-2 bottom-2 bg-black/70 text-white p-2 rounded text-xs"
      style={{ zIndex: 1000 }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-4">
          <span>FPS:</span>
          <span
            className={
              stats.fps > 50
                ? "text-green-400"
                : stats.fps > 30
                ? "text-yellow-400"
                : "text-red-400"
            }
          >
            {stats.fps}
          </span>
        </div>

        {(window.performance as ExtendedPerformance).memory && (
          <div className="flex justify-between gap-4">
            <span>Mémoire:</span>
            <span>{stats.memory} MB</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant pour injecter les stats dans le Canvas
interface StatsInjectorProps {
  targetCanvasId: string
}

const StatsInjector = ({ targetCanvasId }: StatsInjectorProps) => {
  const [canvasElement, setCanvasElement] = useState<Element | null>(null)

  useEffect(() => {
    // Rechercher le canvas cible
    const targetCanvas = document.getElementById(targetCanvasId)
    if (targetCanvas) {
      setCanvasElement(targetCanvas)
    }
  }, [targetCanvasId])

  if (!canvasElement) return null

  // Utiliser createPortal pour injecter les Stats dans le canvas existant
  return createPortal(<Stats className="stats" />, canvasElement)
}

// Options du composant principal
export interface PerformanceMonitorProps {
  defaultShowStats?: boolean
  defaultShowDetailedPerf?: boolean
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  targetCanvasId?: string
}

// Composant principal qui contient tous les éléments de monitoring
export const PerformanceMonitor = ({
  defaultShowStats = true,
  defaultShowDetailedPerf = false,
  position = "top-right",
  targetCanvasId = "scene3d-canvas",
}: PerformanceMonitorProps) => {
  const [showStats, setShowStats] = useState(defaultShowStats)
  const [showDetailedPerf, setShowDetailedPerf] = useState(
    defaultShowDetailedPerf
  )
  const [canInjectStats, setCanInjectStats] = useState(false)
  const dummyCanvasRef = useRef<HTMLDivElement>(null)

  // Vérifier si on peut injecter les stats dans un canvas existant
  useEffect(() => {
    const targetCanvas = document.getElementById(targetCanvasId)
    setCanInjectStats(!!targetCanvas)
  }, [targetCanvasId])

  // Toggle stats with keyboard shortcut (Option+S on Mac, Alt+S on Windows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Touche Option/Alt (18) + S (83)
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "s") {
        setShowStats((prev) => !prev)
      }
      // Touche Option/Alt (18) + D (68)
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "d") {
        setShowDetailedPerf((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Calculer la position des contrôles
  const getControlPosition = () => {
    switch (position) {
      case "top-right":
        return "top-2 right-2"
      case "top-left":
        return "top-2 left-2"
      case "bottom-right":
        return "bottom-2 right-2"
      case "bottom-left":
        return "bottom-2 left-2"
      default:
        return "top-2 right-2"
    }
  }

  return (
    <>
      {/* Injecter Stats dans le canvas existant si possible */}
      {showStats && canInjectStats && (
        <StatsInjector targetCanvasId={targetCanvasId} />
      )}

      {/* Créer un canvas fallback pour Stats si nécessaire */}
      {showStats && !canInjectStats && (
        <div
          ref={dummyCanvasRef}
          className="absolute top-0 left-0 w-40 h-32 z-[1000]"
        >
          <Canvas>
            <Stats className="stats" />
          </Canvas>
        </div>
      )}

      {/* Moniteur personnalisé pour plus de détails */}
      {showDetailedPerf && <CustomPerformanceMonitor />}

      {/* Contrôles */}
      <div
        className={`absolute ${getControlPosition()} flex flex-col gap-2 z-50`}
      >
        <button
          onClick={() => setShowStats((prev) => !prev)}
          className="bg-black/70 text-white px-3 py-1.5 text-sm rounded cursor-pointer"
          aria-label={
            showStats
              ? "Hide performance statistics"
              : "Show performance statistics"
          }
        >
          {showStats ? "Hide Stats" : "Show Stats"}
        </button>
        <button
          onClick={() => setShowDetailedPerf((prev) => !prev)}
          className="bg-black/70 text-white px-3 py-1.5 text-sm rounded cursor-pointer"
          aria-label={
            showDetailedPerf ? "Hide detailed monitor" : "Show detailed monitor"
          }
        >
          {showDetailedPerf ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Styles pour les stats */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .stats {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            height: auto !important;
            z-index: 1000 !important;
          }
          .stats > canvas {
            width: 80px !important;
            height: 48px !important;
            display: block !important;
          }
        `,
        }}
      />
    </>
  )
}

export default PerformanceMonitor
