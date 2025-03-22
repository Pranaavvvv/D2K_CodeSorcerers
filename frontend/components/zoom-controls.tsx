"use client"

import { motion } from "framer-motion"
import { Minus, Plus, RotateCcw, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ZoomControlsProps {
  scale: number
  setScale: (scale: number) => void
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
  showMiniMap: boolean
  setShowMiniMap: (show: boolean) => void
}

export function ZoomControls({
  scale,
  setScale,
  position,
  setPosition,
  showMiniMap,
  setShowMiniMap,
}: ZoomControlsProps) {
  const zoomIn = () => {
    setScale(Math.min(scale + 0.1, 2))
  }

  const zoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.5))
  }

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const toggleMiniMap = () => {
    setShowMiniMap(!showMiniMap)
  }

  return (
    <motion.div
      className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-border bg-card p-1 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8">
              <Minus size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="px-2 text-sm font-medium">{Math.round(scale * 100)}%</div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={zoomIn} className="h-8 w-8">
              <Plus size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mx-1 h-6 w-px bg-border" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={resetView} className="h-8 w-8">
              <RotateCcw size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset View</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMiniMap}
              className={`h-8 w-8 ${showMiniMap ? "bg-accent" : ""}`}
            >
              <Map size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Mini Map</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  )
}

