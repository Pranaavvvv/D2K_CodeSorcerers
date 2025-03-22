"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building,
  Scale,
  GraduationCap,
  Code,
  Zap,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentCard } from "@/components/agent-card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Agent } from "@/types/agent"

interface AgentPanelProps {
  agents: Agent[]
  onToggle: () => void
}

export function AgentPanel({ agents, onToggle }: AgentPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isMobileView, setIsMobileView] = useState(false)
  const [draggedAgent, setDraggedAgent] = useState<Agent | null>(null)

  // Add state for multi-selection
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  const [isMultiDragging, setIsMultiDragging] = useState(false)

  const categories = [...new Set(agents.map((agent) => agent.category))]
  const domains = ["Marketing", "Corporate", "Legal", "Education", "Development", "Custom"]

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? agent.category === selectedCategory : true
    const matchesDomain = activeTab !== "all" ? agent.domains.includes(activeTab.toLowerCase()) : true
    return matchesSearch && matchesCategory && matchesDomain
  })

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "marketing":
        return <Briefcase size={16} />
      case "corporate":
        return <Building size={16} />
      case "legal":
        return <Scale size={16} />
      case "education":
        return <GraduationCap size={16} />
      case "development":
        return <Code size={16} />
      case "custom":
        return <Zap size={16} />
      default:
        return <Filter size={16} />
    }
  }

  // Toggle agent selection
  const toggleAgentSelection = (agent: Agent, e: React.MouseEvent) => {
    e.stopPropagation()

    if (selectedAgents.some((a) => a.id === agent.id)) {
      setSelectedAgents(selectedAgents.filter((a) => a.id !== agent.id))
    } else {
      setSelectedAgents([...selectedAgents, agent])
    }
  }

  // Clear all selections
  const clearSelections = () => {
    setSelectedAgents([])
  }

  // Check the AgentCard component's drag functionality
  const handleMultiDragStart = () => {
    if (selectedAgents.length > 0) {
      setIsMultiDragging(true)
    }
  }

  // Handle drag end for multiple agents
  const handleMultiDragEnd = () => {
    setIsMultiDragging(false)
    // Optionally clear selections after drag
    // setSelectedAgents([]);
  }

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    checkMobileView()
    window.addEventListener("resize", checkMobileView)
    return () => window.removeEventListener("resize", checkMobileView)
  }, [])

  // If panel is collapsed, render a minimal version
  if (isCollapsed) {
    return (
      <motion.div
        className="flex h-full flex-col border-r border-border bg-card z-20"
        initial={{ width: 60 }}
        animate={{ width: 60 }}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      >
        <div className="flex h-12 items-center justify-center border-b border-border">
          <button
            onClick={() => setIsCollapsed(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 p-2">
          <div className="rounded-full bg-primary p-2 text-primary-foreground">
            <Filter size={16} />
          </div>
          <div className="h-px w-8 bg-border" />
          {domains.map((domain) => (
            <TooltipProvider key={domain}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`rounded-full p-2 ${
                      activeTab === domain.toLowerCase()
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                    onClick={() => {
                      setActiveTab(domain.toLowerCase())
                      setIsCollapsed(false)
                    }}
                  >
                    {getDomainIcon(domain)}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{domain}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex h-full flex-col border-r border-border bg-card z-20"
      initial={{ width: 320 }}
      animate={{ width: 320 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold">Agent Marketplace</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8 bg-background/50 border-border/50 focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-2 bg-background/50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="marketing"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Marketing
            </TabsTrigger>
            <TabsTrigger
              value="corporate"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Corporate
            </TabsTrigger>
          </TabsList>
          <TabsList className="grid grid-cols-3 bg-background/50">
            <TabsTrigger
              value="legal"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Legal
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="development"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Dev
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="text-xs h-7 px-2.5"
            onClick={() => setSelectedCategory(null)}
          >
            All Types
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2.5"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Multi-selection controls */}
        {selectedAgents.length > 0 && (
          <div className="flex items-center justify-between bg-primary/10 rounded-md p-2 border border-primary/20">
            <div className="text-sm font-medium">
              {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 px-2" onClick={clearSelections}>
                Clear
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-7 px-2"
                onClick={handleMultiDragStart}
                draggable
                onDragStart={(e) => {
                  // Set up the drag data for multiple agents
                  e.dataTransfer.setData("application/json", JSON.stringify(selectedAgents))
                  e.dataTransfer.effectAllowed = "copy"
                }}
                onDragEnd={handleMultiDragEnd}
              >
                Drag All
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
        <div className="grid gap-3">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <div key={agent.id} className="relative">
                {/* Selection checkbox */}
                <div
                  className="absolute left-2 top-2 z-10 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  onClick={(e) => toggleAgentSelection(agent, e)}
                  style={{
                    backgroundColor: selectedAgents.some((a) => a.id === agent.id)
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))",
                  }}
                >
                  {selectedAgents.some((a) => a.id === agent.id) && (
                    <Check size={12} className="text-primary-foreground" />
                  )}
                </div>

                <AgentCard
                  agent={agent}
                  onDragStart={() => setDraggedAgent(agent)}
                  onDragEnd={() => setDraggedAgent(null)}
                  isSelected={selectedAgents.some((a) => a.id === agent.id)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-secondary p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-medium">No agents found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {draggedAgent && (
        <div className="border-t border-border p-3 bg-card/50">
          <div className="flex items-center gap-2 text-sm">
            <div
              className="h-6 w-6 rounded-md flex items-center justify-center text-white"
              style={{ backgroundColor: draggedAgent.color }}
            >
              {draggedAgent.name.charAt(0)}
            </div>
            <span>
              Drag to add <strong>{draggedAgent.name}</strong> to canvas
            </span>
          </div>
        </div>
      )}

      {isMultiDragging && selectedAgents.length > 0 && (
        <div className="border-t border-border p-3 bg-card/50">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-6 w-6 rounded-md flex items-center justify-center bg-primary text-white">
              {selectedAgents.length}
            </div>
            <span>
              Drag to add <strong>{selectedAgents.length} agents</strong> to canvas
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

