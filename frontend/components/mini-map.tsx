"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import type { Workflow } from "@/types/workflow"

interface MiniMapProps {
  workflow: Workflow
  position: { x: number; y: number }
  scale: number
  setPosition: (position: { x: number; y: number }) => void
}

export function MiniMap({ workflow, position, scale, setPosition }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  // Constants for the minimap
  const MINIMAP_WIDTH = 200
  const MINIMAP_HEIGHT = 150
  const MINIMAP_SCALE = 0.05

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT)

    // Draw background
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT)

    // Draw nodes
    workflow.nodes.forEach((node) => {
      ctx.fillStyle = node.data.color || "#4f46e5"
      ctx.fillRect(node.position.x * MINIMAP_SCALE, node.position.y * MINIMAP_SCALE, 10, 6)
    })

    // Draw connections
    ctx.strokeStyle = "rgba(100, 100, 100, 0.5)"
    ctx.lineWidth = 1

    workflow.connections.forEach((connection) => {
      const fromNode = workflow.nodes.find((node) => node.id === connection.from.nodeId)
      const toNode = workflow.nodes.find((node) => node.id === connection.to.nodeId)

      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo((fromNode.position.x + 200) * MINIMAP_SCALE, (fromNode.position.y + 50) * MINIMAP_SCALE)
        ctx.lineTo(toNode.position.x * MINIMAP_SCALE, (toNode.position.y + 50) * MINIMAP_SCALE)
        ctx.stroke()
      }
    })

    // Draw viewport
    const viewportX = -position.x * MINIMAP_SCALE
    const viewportY = -position.y * MINIMAP_SCALE
    const viewportWidth = (window.innerWidth * MINIMAP_SCALE) / scale
    const viewportHeight = (window.innerHeight * MINIMAP_SCALE) / scale

    ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
    ctx.lineWidth = 2
    ctx.strokeRect(viewportX, viewportY, viewportWidth, viewportHeight)
  }, [workflow, position, scale])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    handleMouseMove(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert minimap coordinates to canvas coordinates
    const canvasX = -(x / MINIMAP_SCALE) * scale
    const canvasY = -(y / MINIMAP_SCALE) * scale

    // Adjust for viewport center
    const adjustedX = canvasX + (window.innerWidth / 2) * scale
    const adjustedY = canvasY + (window.innerHeight / 2) * scale

    setPosition({ x: adjustedX, y: adjustedY })
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute bottom-4 left-4 rounded-lg border border-border bg-card p-1 shadow-lg overflow-hidden"
      style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT} className="cursor-move" />
    </div>
  )
}

