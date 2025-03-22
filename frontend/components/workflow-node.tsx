"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Play, Pause, Settings, Maximize2, Minimize2, Copy, Trash2 } from "lucide-react"
import type { WorkflowNodeType } from "@/types/workflow"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WorkflowNodeProps {
  node: WorkflowNodeType
  onRemove: (id: string) => void
  onPositionChange: (id: string, position: { x: number; y: number }) => void
  onStartConnection: (nodeId: string, output: string, position: { x: number; y: number }) => void
  onCompleteConnection: (nodeId: string, input: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
  onStartMultiDrag?: (e: React.MouseEvent, nodeId: string) => void
  isRunning?: boolean
  onToggleRunning?: (nodeId: string) => void
}

export function WorkflowNode({
  node,
  onRemove,
  onPositionChange,
  onStartConnection,
  onCompleteConnection,
  isSelected,
  onSelect,
  onStartMultiDrag,
  isRunning = false,
  onToggleRunning,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isExpanded, setIsExpanded] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const [nodeWidth, setNodeWidth] = useState(220)
  const [nodeHeight, setNodeHeight] = useState(100)
  const [progress, setProgress] = useState(0)

  // Add effect to animate progress when running
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1
          return newProgress > 100 ? 0 : newProgress
        })
      }, 100)
    } else {
      setProgress(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  useEffect(() => {
    if (nodeRef.current) {
      const { width, height } = nodeRef.current.getBoundingClientRect()
      setNodeWidth(width)
      setNodeHeight(height)
    }
  }, [isExpanded, isMaximized])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (nodeRef.current && (e.target as HTMLElement).closest(".node-header")) {
      const rect = nodeRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })

      // If shift key is pressed or onStartMultiDrag is provided, use multi-drag
      if (e.shiftKey && onStartMultiDrag) {
        onStartMultiDrag(e, node.id)
      } else {
        setIsDragging(true)
        onSelect(node.id)
      }

      e.stopPropagation()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && nodeRef.current) {
      const x = e.clientX - dragOffset.x
      const y = e.clientY - dragOffset.y
      const rect = nodeRef.current.getBoundingClientRect()

      onPositionChange(node.id, {
        x: node.position.x + (x - rect.left),
        y: node.position.y + (y - rect.top),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleStartConnection = (output: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect()
      onStartConnection(node.id, output, {
        x: node.position.x + rect.width,
        y: node.position.y + 30 + node.outputs.indexOf(output) * 20,
      })
    }
  }

  const handleCompleteConnection = (input: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onCompleteConnection(node.id, input)
  }

  const toggleRunning = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleRunning) {
      onToggleRunning(node.id)
    }
  }

  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowSettings(!showSettings)
  }

  const toggleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMaximized(!isMaximized)
  }

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(node.id)
  }

  return (
    <motion.div
      ref={nodeRef}
      className={`workflow-node absolute flex flex-col rounded-lg overflow-hidden ${
        isSelected ? "ring-2 ring-primary" : "glass-card"
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: isMaximized ? 400 : 220,
        zIndex: isDragging || isMaximized || isSelected ? 10 : 1,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        boxShadow: isRunning
          ? "0 0 0 2px rgba(var(--primary), 0.3), 0 4px 20px rgba(0, 0, 0, 0.1)"
          : isSelected
            ? "0 0 0 2px hsl(var(--primary)), 0 4px 20px rgba(0, 0, 0, 0.1)"
            : "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        boxShadow: { duration: 0.2 },
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleNodeClick}
    >
      {/* Node header with gradient overlay */}
      <div
        className="node-header flex cursor-move items-center justify-between rounded-t-lg p-3 relative overflow-hidden"
        style={{ backgroundColor: node.data.color }}
        onMouseDown={handleMouseDown}
      >
        {/* Add subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />

        <div className="flex items-center gap-2 z-10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-sm font-bold text-white">{node.data.name.charAt(0)}</span>
          </div>
          <h3 className="text-sm font-medium text-white">{node.data.name}</h3>
          {node.data.domains && node.data.domains.length > 0 && (
            <Badge variant="outline" className="bg-white/20 text-white text-xs backdrop-blur-sm">
              {node.data.domains[0]}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-1 text-white hover:bg-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <Settings size={14} />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={toggleRunning}>
                {isRunning ? <Pause size={14} className="mr-2" /> : <Play size={14} className="mr-2" />}
                {isRunning ? "Pause Agent" : "Run Agent"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleMaximize}>
                {isMaximized ? <Minimize2 size={14} className="mr-2" /> : <Maximize2 size={14} className="mr-2" />}
                {isMaximized ? "Minimize" : "Maximize"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  // Duplicate node logic would go here
                }}
              >
                <Copy size={14} className="mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(node.id)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 size={14} className="mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="rounded-full p-1 text-white hover:bg-white/20"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </motion.button>
        </div>
      </div>

      {/* Add a running indicator with animation */}
      {isRunning && (
        <div className="bg-green-500/10 border-b border-green-500/20 px-3 py-1 text-xs text-green-600 dark:text-green-400 flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500 relative">
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
          </div>
          <div className="flex-1">Agent is running...</div>
          <div className="text-xs font-mono">{progress}%</div>
        </div>
      )}

      <motion.div
        initial={{ height: "auto" }}
        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden bg-card"
      >
        <div className="p-3">
          <p className="text-xs text-muted-foreground">{node.data.description}</p>

          {isMaximized && node.data.capabilities && (
            <div className="mt-3 rounded-md bg-secondary/50 p-2">
              <h4 className="text-xs font-medium">Capabilities</h4>
              <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
                {node.data.capabilities.map((capability, index) => (
                  <li key={index}>{capability}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between p-2 border-t border-border/50">
          <div className="flex flex-col gap-1">
            {node.inputs.map((input, index) => (
              <div
                key={input}
                className="flex items-center gap-2 group"
                onClick={(e) => handleCompleteConnection(input, e)}
              >
                <div className="relative">
                  <div
                    className={`h-3 w-3 cursor-pointer rounded-full border border-border bg-background group-hover:bg-primary group-hover:border-primary transition-colors duration-200 ${
                      isRunning ? "border-green-500 bg-green-500/20" : ""
                    }`}
                  />
                  <motion.div
                    className="absolute -left-1 -top-1 h-5 w-5 rounded-full bg-primary/20 opacity-0"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                  />
                </div>
                <span className="text-xs">{input}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1 items-end">
            {node.outputs.map((output, index) => (
              <div
                key={output}
                className="flex items-center gap-2 group"
                onMouseDown={(e) => handleStartConnection(output, e)}
              >
                <span className="text-xs">{output}</span>
                <div className="relative">
                  <div
                    className={`h-3 w-3 cursor-pointer rounded-full border border-border bg-background group-hover:bg-primary group-hover:border-primary transition-colors duration-200 ${
                      isRunning ? "border-green-500 bg-green-500/20" : ""
                    }`}
                  />
                  <motion.div
                    className="absolute -left-1 -top-1 h-5 w-5 rounded-full bg-primary/20 opacity-0"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {isRunning && (
        <div className="absolute -bottom-2 left-0 right-0 mx-auto h-1 overflow-hidden rounded-full bg-background">
          <div
            className="h-full bg-green-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}

