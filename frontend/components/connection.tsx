"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Trash2 } from "lucide-react"

interface ConnectionProps {
  id: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  fromNodeWidth: number
  toNodeWidth: number
  fromNodeHeight: number
  toNodeHeight: number
  isTemp?: boolean
  isSelected?: boolean
  isActive?: boolean
  fromOutput: string
  toInput: string
  onRemove?: (id: string) => void
}

export function Connection({
  id,
  from,
  to,
  fromNodeWidth,
  toNodeWidth,
  fromNodeHeight,
  toNodeHeight,
  isTemp = false,
  isSelected = false,
  isActive = false,
  fromOutput,
  toInput,
  onRemove,
}: ConnectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate start and end points
  const startX = from.x + fromNodeWidth
  const startY = from.y + fromNodeHeight / 2
  const endX = to.x
  const endY = to.y + toNodeHeight / 2

  // Calculate control points for the bezier curve
  const distance = Math.abs(endX - startX)
  const controlPointX1 = startX + Math.min(100, distance / 3)
  const controlPointX2 = endX - Math.min(100, distance / 3)

  // Create the path
  const path = `M ${startX} ${startY} C ${controlPointX1} ${startY}, ${controlPointX2} ${endY}, ${endX} ${endY}`

  // Calculate midpoint for the delete button and label
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2

  // Calculate the angle of the connection for proper button orientation
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)

  // Determine the stroke color based on state
  const getStrokeColor = () => {
    if (isTemp) return "hsl(var(--primary))"
    if (isActive) return "hsl(142.1 76.2% 36.3%)" // Green color for active connections
    if (isHovered || isSelected) return "hsl(var(--primary))"
    return "hsl(var(--border))"
  }

  return (
    <g onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="connection group">
      {/* Connection path */}
      <motion.path
        d={path}
        fill="none"
        strokeWidth={isHovered || isSelected || isActive ? 3 : 2}
        stroke={getStrokeColor()}
        strokeDasharray={isTemp ? "5,5" : "none"}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
          stroke: isTemp ? ["hsl(var(--primary))", "hsl(var(--primary)/70%)", "hsl(var(--primary))"] : getStrokeColor(),
        }}
        transition={{
          pathLength: { duration: 0.5, ease: "easeInOut" },
          opacity: { duration: 0.3 },
          stroke: { repeat: isTemp ? Number.POSITIVE_INFINITY : 0, duration: 1.5 },
        }}
        style={{ pointerEvents: "stroke" }}
      />

      {/* Connection label */}
      {!isTemp && (fromOutput || toInput) && (isHovered || isSelected || isActive) && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x="-60"
            y="-12"
            width="120"
            height="24"
            rx="4"
            fill="hsl(var(--card))"
            stroke={isActive ? "hsl(142.1 76.2% 36.3%)" : "hsl(var(--border))"}
            strokeWidth="1"
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="currentColor"
            className="text-foreground"
          >
            {fromOutput} → {toInput}
          </text>
        </g>
      )}

      {/* Data flow animation */}
      {!isTemp && (
        <>
          <motion.circle
            r={3}
            fill={isActive ? "hsl(142.1 76.2% 36.3%)" : "hsl(var(--primary))"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <animateMotion dur={isActive ? "0.8s" : "1.5s"} repeatCount="indefinite" path={path} rotate="auto" />
          </motion.circle>

          {/* Add a second particle for more dynamic flow */}
          <motion.circle
            r={2}
            fill={isActive ? "hsl(142.1 76.2% 36.3%/70%)" : "hsl(var(--primary)/70%)"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <animateMotion
              dur={isActive ? "0.8s" : "1.5s"}
              repeatCount="indefinite"
              path={path}
              rotate="auto"
              begin="0.5s"
            />
          </motion.circle>

          {/* Add a third particle when active */}
          {isActive && (
            <motion.circle
              r={2.5}
              fill="hsl(142.1 76.2% 36.3%/60%)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <animateMotion dur="0.8s" repeatCount="indefinite" path={path} rotate="auto" begin="0.25s" />
            </motion.circle>
          )}
        </>
      )}

      {/* Delete button */}
      {!isTemp && onRemove && isHovered && (
        <motion.g
          transform={`translate(${midX}, ${midY - 30})`}
          onClick={() => onRemove(id)}
          style={{ cursor: "pointer" }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="connection-delete"
        >
          <circle r={12} fill="hsl(var(--destructive))" />
          <Trash2
            size={14}
            className="text-destructive-foreground"
            style={{
              transform: "translate(-7px, -7px)",
            }}
          />
        </motion.g>
      )}
    </g>
  )
}

