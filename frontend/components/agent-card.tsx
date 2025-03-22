"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useDrag } from "react-dnd"
import type { Agent } from "@/types/agent"
import { ChevronDown, Star, Briefcase, Building, Scale, GraduationCap, Code, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AgentCardProps {
  agent: Agent
  onDragStart?: () => void
  onDragEnd?: () => void
  isSelected?: boolean
}

export function AgentCard({ agent, onDragStart, onDragEnd, isSelected = false }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "AGENT",
    item: () => {
      if (onDragStart) onDragStart()
      return { ...agent }
    },
    end: () => {
      if (onDragEnd) onDragEnd()
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "marketing":
        return <Briefcase size={12} />
      case "corporate":
        return <Building size={12} />
      case "legal":
        return <Scale size={12} />
      case "education":
        return <GraduationCap size={12} />
      case "development":
        return <Code size={12} />
      case "custom":
        return <Zap size={12} />
      default:
        return null
    }
  }

  return (
    <motion.div
      ref={drag}
      initial={{ scale: 1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        y: -2,
      }}
      className={`cursor-grab rounded-lg glass-card p-3 transition-shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${isExpanded ? "shadow-md" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-start justify-between pl-6">
        <div className="flex items-center gap-2">
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-md relative overflow-hidden"
            style={{ backgroundColor: agent.color }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Add subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
            <span className="text-lg font-bold text-white relative z-10">{agent.name.charAt(0)}</span>
          </motion.div>
          <div>
            <h3 className="font-medium">{agent.name}</h3>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < agent.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({agent.usageCount})</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--accent))" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full p-1 hover:bg-accent transition-colors duration-200"
        >
          <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </motion.button>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground">{agent.description}</p>

          <div className="flex flex-wrap gap-1">
            {agent.domains.map((domain) => (
              <Badge
                key={domain}
                variant="outline"
                className="flex items-center gap-1 text-xs transition-colors duration-200 hover:bg-accent"
              >
                {getDomainIcon(domain)}
                {domain}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {agent.tags.map((tag) => (
              <motion.span
                key={tag}
                className="rounded-full bg-secondary px-2 py-1 text-xs"
                whileHover={{
                  backgroundColor: "hsl(var(--accent))",
                  scale: 1.05,
                }}
                transition={{ duration: 0.2 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-secondary p-2 hover:bg-accent/50 transition-colors duration-200">
              <span className="block font-medium">Input</span>
              <span className="text-muted-foreground">{agent.input}</span>
            </div>
            <div className="rounded-md bg-secondary p-2 hover:bg-accent/50 transition-colors duration-200">
              <span className="block font-medium">Output</span>
              <span className="text-muted-foreground">{agent.output}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

