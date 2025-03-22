"use client"

import type React from "react"

import { useCallback, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useDrop } from "react-dnd"
import { AlertCircle, Info, Grid, Maximize, Minimize, Copy, Trash2, Play, Pause } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WorkflowNode } from "@/components/workflow-node"
import { Connection } from "@/components/connection"
import { ZoomControls } from "@/components/zoom-controls"
import { MiniMap } from "@/components/mini-map"
import { AgentPanel } from "@/components/agent-panel"
import { PropertiesPanel } from "@/components/properties-panel"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Workflow } from "@/types/workflow"
import type { Agent } from "@/types/agent"

// Update the CanvasProps interface to include runningNodes
interface CanvasProps {
  workflow: Workflow
  setWorkflow: (workflow: Workflow) => void
  agents: Agent[]
  runningNodes: string[]
  setRunningNodes: (nodeIds: string[]) => void
  isWorkflowRunning: boolean
}

// Update the Canvas component to include runningNodes and setRunningNodes
export function Canvas({
  workflow,
  setWorkflow,
  agents,
  runningNodes,
  setRunningNodes,
  isWorkflowRunning,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState<{
    fromId: string
    fromOutput: string
    position: { x: number; y: number }
  } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showConnectionHint, setShowConnectionHint] = useState(true)
  const [showMiniMap, setShowMiniMap] = useState(true)
  const [showAgentPanel, setShowAgentPanel] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Add new states for multi-selection
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [selectionBox, setSelectionBox] = useState<{
    startX: number
    startY: number
    endX: number
    endY: number
  } | null>(null)
  const [isMultiDragging, setIsMultiDragging] = useState(false)
  const [multiDragStart, setMultiDragStart] = useState({ x: 0, y: 0 })
  const [nodeDragOffsets, setNodeDragOffsets] = useState<Record<string, { x: number; y: number }>>({})

  // Get the selected node
  const selectedNode = selectedNodeId ? workflow.nodes.find((node) => node.id === selectedNodeId) : null

  // Fix the useDrop hook in Canvas
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["AGENT", "MULTI_AGENT"],
    drop: (item: Agent | Agent[], monitor) => {
      const offset = monitor.getClientOffset()
      if (offset && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect()

        // Handle dropping multiple agents
        if (Array.isArray(item)) {
          const agents = item as Agent[]
          const newNodes = agents.map((agent, index) => {
            let x = (offset.x - canvasRect.left - position.x) / scale + index * 50
            let y = (offset.y - canvasRect.top - position.y) / scale + index * 50

            // Snap to grid if enabled
            if (snapToGrid) {
              x = Math.round(x / gridSize) * gridSize
              y = Math.round(y / gridSize) * gridSize
            }

            return {
              id: `node-${Date.now()}-${index}`,
              type: agent.id,
              position: { x, y },
              data: { ...agent },
              inputs: agent.inputs,
              outputs: agent.outputs,
            }
          })

          // Ensure we're preserving existing nodes
          const updatedWorkflow = {
            ...workflow,
            nodes: [...workflow.nodes, ...newNodes],
          }

          // Update the workflow
          setWorkflow(updatedWorkflow)

          // Select all newly created nodes
          setSelectedNodes(newNodes.map((node) => node.id))
        }
        // Handle dropping a single agent
        else {
          const agent = item as Agent
          let x = (offset.x - canvasRect.left - position.x) / scale
          let y = (offset.y - canvasRect.top - position.y) / scale

          // Snap to grid if enabled
          if (snapToGrid) {
            x = Math.round(x / gridSize) * gridSize
            y = Math.round(y / gridSize) * gridSize
          }

          // Check if there's already a node at this position and offset if needed
          const existingNodeAtPosition = workflow.nodes.some(
            (node) => Math.abs(node.position.x - x) < 50 && Math.abs(node.position.y - y) < 50,
          )

          if (existingNodeAtPosition) {
            x += 50
            y += 50
          }

          const newNode = {
            id: `node-${Date.now()}`,
            type: agent.id,
            position: { x, y },
            data: { ...agent },
            inputs: agent.inputs,
            outputs: agent.outputs,
          }

          // Ensure we're preserving existing nodes
          const updatedWorkflow = {
            ...workflow,
            nodes: [...workflow.nodes, newNode],
          }

          // Update the workflow
          setWorkflow(updatedWorkflow)

          // Select the newly created node
          setSelectedNodeId(newNode.id)
          setSelectedNodes([newNode.id])
        }
      }
      return undefined
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || e.button === 0) {
        // Only start dragging if not clicking on a node or connection
        if (
          (e.target as HTMLElement).closest(".workflow-node") === null &&
          (e.target as HTMLElement).closest(".connection") === null
        ) {
          // If shift key is pressed, start selection box
          if (e.shiftKey) {
            const canvasRect = canvasRef.current?.getBoundingClientRect()
            if (canvasRect) {
              const startX = (e.clientX - canvasRect.left - position.x) / scale
              const startY = (e.clientY - canvasRect.top - position.y) / scale
              setSelectionBox({
                startX,
                startY,
                endX: startX,
                endY: startY,
              })
            }
          } else {
            setIsDragging(true)
            setDragStart({ x: e.clientX - position.x, y: e.clientY - dragStart.y })
            // Deselect nodes when clicking on canvas without shift
            setSelectedNodeId(null)
            setSelectedNodes([])
          }
        }
      }
    },
    [position, scale],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      } else if (isMultiDragging && selectedNodes.length > 0) {
        // Handle multi-drag
        const dx = (e.clientX - multiDragStart.x) / scale
        const dy = (e.clientY - multiDragStart.y) / scale

        const newNodes = workflow.nodes.map((node) => {
          if (selectedNodes.includes(node.id)) {
            const offset = nodeDragOffsets[node.id] || { x: 0, y: 0 }
            let newX = offset.x + dx
            let newY = offset.y + dy

            // Snap to grid if enabled
            if (snapToGrid) {
              newX = Math.round(newX / gridSize) * gridSize
              newY = Math.round(newY / gridSize) * gridSize
            }

            return {
              ...node,
              position: { x: newX, y: newY },
            }
          }
          return node
        })

        setWorkflow({
          ...workflow,
          nodes: newNodes,
        })
      } else if (selectionBox) {
        // Update selection box
        const canvasRect = canvasRef.current?.getBoundingClientRect()
        if (canvasRect) {
          const endX = (e.clientX - canvasRect.left - position.x) / scale
          const endY = (e.clientY - canvasRect.top - position.y) / scale
          setSelectionBox({
            ...selectionBox,
            endX,
            endY,
          })

          // Select nodes within the box
          const minX = Math.min(selectionBox.startX, endX)
          const maxX = Math.max(selectionBox.startX, endX)
          const minY = Math.min(selectionBox.startY, endY)
          const maxY = Math.max(selectionBox.startY, endY)

          const nodesInBox = workflow.nodes.filter((node) => {
            return (
              node.position.x >= minX && node.position.x <= maxX && node.position.y >= minY && node.position.y <= maxY
            )
          })

          setSelectedNodes(nodesInBox.map((node) => node.id))
          if (nodesInBox.length === 1) {
            setSelectedNodeId(nodesInBox[0].id)
          } else {
            setSelectedNodeId(null)
          }
        }
      }
    },
    [
      isDragging,
      dragStart,
      selectionBox,
      isMultiDragging,
      multiDragStart,
      selectedNodes,
      nodeDragOffsets,
      workflow,
      scale,
      position,
      snapToGrid,
      gridSize,
      setWorkflow,
    ],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsMultiDragging(false)
    setSelectionBox(null)
  }, [])

  // Start multi-drag operation
  const startMultiDrag = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if (!selectedNodes.includes(nodeId)) {
        if (e.shiftKey) {
          setSelectedNodes([...selectedNodes, nodeId])
        } else {
          setSelectedNodes([nodeId])
        }
        setSelectedNodeId(nodeId)
      }

      setIsMultiDragging(true)
      setMultiDragStart({ x: e.clientX, y: e.clientY })

      // Store initial positions of all selected nodes
      const offsets: Record<string, { x: number; y: number }> = {}
      workflow.nodes.forEach((node) => {
        if (selectedNodes.includes(node.id) || node.id === nodeId) {
          offsets[node.id] = { x: node.position.x, y: node.position.y }
        }
      })
      setNodeDragOffsets(offsets)

      e.stopPropagation()
    },
    [selectedNodes, workflow.nodes],
  )

  // Add function to duplicate selected nodes
  const duplicateSelectedNodes = useCallback(() => {
    if (selectedNodes.length === 0) return

    const nodesToDuplicate = workflow.nodes.filter((node) => selectedNodes.includes(node.id))
    const newNodes = nodesToDuplicate.map((node, index) => ({
      ...node,
      id: `node-${Date.now()}-${index}`,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
    }))

    setWorkflow({
      ...workflow,
      nodes: [...workflow.nodes, ...newNodes],
    })

    // Select the newly created nodes
    setSelectedNodes(newNodes.map((node) => node.id))
  }, [selectedNodes, workflow, setWorkflow])

  // Add function to delete selected nodes
  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodes.length === 0) return

    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.filter((node) => !selectedNodes.includes(node.id)),
      connections: workflow.connections.filter(
        (conn) => !selectedNodes.includes(conn.from.nodeId) && !selectedNodes.includes(conn.to.nodeId),
      ),
    })

    setSelectedNodes([])
    setSelectedNodeId(null)
  }, [selectedNodes, workflow, setWorkflow])

  // Add function to toggle running state for selected nodes
  const toggleRunningForSelectedNodes = useCallback(() => {
    if (selectedNodes.length === 0) return

    const allRunning = selectedNodes.every((nodeId) => runningNodes.includes(nodeId))

    if (allRunning) {
      // Stop running for selected nodes
      setRunningNodes(runningNodes.filter((nodeId) => !selectedNodes.includes(nodeId)))
    } else {
      // Start running for selected nodes
      const newRunningNodes = [...runningNodes]
      selectedNodes.forEach((nodeId) => {
        if (!newRunningNodes.includes(nodeId)) {
          newRunningNodes.push(nodeId)
        }
      })
      setRunningNodes(newRunningNodes)
    }
  }, [selectedNodes, runningNodes, setRunningNodes])

  // Rest of the component remains the same...

  const selectNode = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId)
      setSelectedNodes([nodeId])
    },
    [setSelectedNodeId, setSelectedNodes],
  )

  const cancelConnection = useCallback(() => {
    setConnecting(null)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const zoomSpeed = 0.1
        const newScale = scale + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed)
        setScale(Math.min(Math.max(0.1, newScale), 2))
      }
    },
    [scale],
  )

  const removeConnection = useCallback(
    (connectionId: string) => {
      setWorkflow({
        ...workflow,
        connections: workflow.connections.filter((connection) => connection.id !== connectionId),
      })
    },
    [workflow, setWorkflow],
  )

  const removeNode = useCallback(
    (nodeId: string) => {
      setWorkflow({
        ...workflow,
        nodes: workflow.nodes.filter((node) => node.id !== nodeId),
        connections: workflow.connections.filter(
          (connection) => connection.from.nodeId !== nodeId && connection.to.nodeId !== nodeId,
        ),
      })
    },
    [workflow, setWorkflow],
  )

  const updateNodePosition = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      setWorkflow({
        ...workflow,
        nodes: workflow.nodes.map((node) => (node.id === nodeId ? { ...node, position: position } : node)),
      })
    },
    [workflow, setWorkflow],
  )

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setWorkflow({
        ...workflow,
        nodes: workflow.nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)),
      })
    },
    [workflow, setWorkflow],
  )

  const startConnection = useCallback((fromId: string, fromOutput: string, position: { x: number; y: number }) => {
    setConnecting({ fromId, fromOutput, position })
  }, [])

  const completeConnection = useCallback(
    (toId: string, toInput: string) => {
      if (!connecting) return

      if (connecting.fromId === toId) {
        cancelConnection()
        return
      }

      const newConnection = {
        id: `connection-${Date.now()}`,
        from: { nodeId: connecting.fromId, output: connecting.fromOutput },
        to: { nodeId: toId, input: toInput },
      }

      setWorkflow({
        ...workflow,
        connections: [...workflow.connections, newConnection],
      })

      cancelConnection()
    },
    [connecting, workflow, setWorkflow, cancelConnection],
  )

  // Add keyboard shortcuts for multi-selection operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected nodes with Delete key
      if (e.key === "Delete" && selectedNodes.length > 0) {
        deleteSelectedNodes()
      }

      // Duplicate selected nodes with Ctrl+D
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault()
        duplicateSelectedNodes()
      }

      // Select all nodes with Ctrl+A
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault()
        setSelectedNodes(workflow.nodes.map((node) => node.id))
      }

      // Escape key to cancel connection, selection, or deselect nodes
      if (e.key === "Escape") {
        if (connecting) {
          cancelConnection()
        } else if (selectionBox) {
          setSelectionBox(null)
        } else if (selectedNodes.length > 0) {
          setSelectedNodes([])
          setSelectedNodeId(null)
        }
      }

      // Ctrl+G to toggle grid
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault()
        setShowGrid(!showGrid)
      }

      // Ctrl+S to toggle snap to grid
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        setSnapToGrid(!snapToGrid)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    selectedNodes,
    connecting,
    cancelConnection,
    selectionBox,
    showGrid,
    snapToGrid,
    workflow.nodes,
    deleteSelectedNodes,
    duplicateSelectedNodes,
    selectNode,
  ])

  // Remove the debugging useEffect we added earlier
  // useEffect(() => {
  //   console.log("Canvas received workflow:", workflow);
  //   console.log("Workflow nodes:", workflow.nodes);
  // }, [workflow]);

  return (
    <div className="flex h-full">
      {showAgentPanel && <AgentPanel agents={agents} onToggle={() => setShowAgentPanel(!showAgentPanel)} />}

      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-card p-2">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                    className={showGrid ? "bg-accent" : ""}
                  >
                    <Grid size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showGrid ? "Hide Grid" : "Show Grid"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSnapToGrid(!snapToGrid)}
                    className={snapToGrid ? "bg-accent" : ""}
                  >
                    <span className="text-xs font-medium">Snap</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{snapToGrid ? "Disable Snap to Grid" : "Enable Snap to Grid"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="text-sm text-muted-foreground">
              {workflow.nodes.length} Agents • {workflow.connections.length} Connections • {selectedNodes.length}{" "}
              Selected
            </div>
          </div>

          {selectedNodes.length > 0 && (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={duplicateSelectedNodes}>
                      <Copy size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate Selected</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={toggleRunningForSelectedNodes}>
                      {selectedNodes.every((nodeId) => runningNodes.includes(nodeId)) ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {selectedNodes.every((nodeId) => runningNodes.includes(nodeId))
                      ? "Stop Selected Agents"
                      : "Run Selected Agents"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={deleteSelectedNodes}>
                      <Trash2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Selected</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div
          ref={(node) => {
            drop(node)
            if (node) canvasRef.current = node
          }}
          className={`relative h-full flex-1 overflow-hidden bg-background ${
            isOver && canDrop ? "bg-primary/5 ring-2 ring-primary/20 ring-inset" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Grid background with subtle pattern */}
          {showGrid && (
            <div
              className="absolute inset-0 w-full h-full grid-pattern opacity-70"
              style={{
                backgroundPosition: `${position.x}px ${position.y}px`,
                transform: `scale(${scale})`,
                backgroundSize: `${gridSize * 2}px ${gridSize * 2}px`,
              }}
            />
          )}

          {showConnectionHint && workflow.nodes.length > 1 && workflow.connections.length === 0 && (
            <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 transform">
              <Alert className="w-96 bg-card shadow-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Hint</AlertTitle>
                <AlertDescription>
                  Connect agents by dragging from an output port (right side) to an input port (left side).
                </AlertDescription>
              </Alert>
            </div>
          )}

          {workflow.nodes.length === 0 && (
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center">
              <div className="rounded-full bg-secondary p-6">
                <Info className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Start Building Your Workflow</h3>
              <p className="mt-2 text-sm text-muted-foreground">Drag agents from the panel to the canvas to begin</p>
            </div>
          )}

          {isOver && canDrop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-lg font-medium text-primary"
              >
                Drop to add agent
              </motion.div>
            </div>
          )}

          <motion.div
            className="relative h-[5000px] w-[5000px] origin-top-left"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          >
            {/* Connections */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              {workflow.connections.map((connection) => {
                const fromNode = workflow.nodes.find((node) => node.id === connection.from.nodeId)
                const toNode = workflow.nodes.find((node) => node.id === connection.to.nodeId)

                if (!fromNode || !toNode) return null

                return (
                  <Connection
                    key={connection.id}
                    id={connection.id}
                    from={fromNode.position}
                    to={toNode.position}
                    fromNodeWidth={220}
                    toNodeWidth={220}
                    fromNodeHeight={100}
                    toNodeHeight={100}
                    onRemove={removeConnection}
                    fromOutput={connection.from.output}
                    toInput={connection.to.input}
                    isSelected={false}
                    isActive={
                      isWorkflowRunning && runningNodes.includes(fromNode.id) && runningNodes.includes(toNode.id)
                    }
                  />
                )
              })}

              {connecting && (
                <Connection
                  id="temp-connection"
                  from={connecting.position}
                  to={{
                    x: (mousePosition.x - position.x) / scale,
                    y: (mousePosition.y - position.y) / scale,
                  }}
                  fromNodeWidth={0}
                  toNodeWidth={0}
                  fromNodeHeight={0}
                  toNodeHeight={0}
                  isTemp
                  fromOutput={connecting.fromOutput}
                  toInput=""
                  isSelected={false}
                />
              )}
            </svg>

            {/* Selection box */}
            {selectionBox && (
              <div
                className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
                style={{
                  left: Math.min(selectionBox.startX, selectionBox.endX),
                  top: Math.min(selectionBox.startY, selectionBox.endY),
                  width: Math.abs(selectionBox.endX - selectionBox.startX),
                  height: Math.abs(selectionBox.endY - selectionBox.startY),
                }}
              />
            )}

            {/* Nodes */}
            {workflow.nodes.map((node) => (
              <WorkflowNode
                key={node.id}
                node={node}
                onRemove={removeNode}
                onPositionChange={updateNodePosition}
                onStartConnection={startConnection}
                onCompleteConnection={completeConnection}
                isSelected={selectedNodeId === node.id || selectedNodes.includes(node.id)}
                onSelect={selectNode}
                onStartMultiDrag={startMultiDrag}
                isRunning={runningNodes.includes(node.id)}
                onToggleRunning={(nodeId) => {
                  if (runningNodes.includes(nodeId)) {
                    setRunningNodes(runningNodes.filter((id) => id !== nodeId))
                  } else {
                    setRunningNodes([...runningNodes, nodeId])
                  }
                }}
              />
            ))}
          </motion.div>

          <ZoomControls
            scale={scale}
            setScale={setScale}
            position={position}
            setPosition={setPosition}
            showMiniMap={showMiniMap}
            setShowMiniMap={setShowMiniMap}
          />

          {showMiniMap && <MiniMap workflow={workflow} position={position} scale={scale} setPosition={setPosition} />}
        </div>
      </div>

      {selectedNode && (
        <PropertiesPanel node={selectedNode} onUpdateNode={updateNodeData} onClose={() => setSelectedNodeId(null)} />
      )}
    </div>
  )
}

