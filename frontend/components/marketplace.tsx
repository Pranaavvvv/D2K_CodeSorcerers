"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Briefcase, Building, Scale, GraduationCapIcon as Graduation, Code, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AgentCard } from "@/components/agent-card"
import type { Agent } from "@/types/agent"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MarketplaceProps {
  agents: Agent[]
}

export function Marketplace({ agents }: MarketplaceProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const categories = [...new Set(agents.map((agent) => agent.category))]
  const domains = ["Marketing", "Corporate", "Legal", "Education", "Development", "Custom"]

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? agent.category === selectedCategory : true
    const matchesDomain = activeTab !== "all" ? agent.domains.includes(activeTab) : true
    return matchesSearch && matchesCategory && matchesDomain
  })

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "marketing":
        return <Briefcase size={16} />
      case "corporate":
        return <Building size={16} />
      case "legal":
        return <Scale size={16} />
      case "education":
        return <Graduation size={16} />
      case "development":
        return <Code size={16} />
      case "custom":
        return <Zap size={16} />
      default:
        return <Filter size={16} />
    }
  }

  return (
    <motion.div
      className="flex h-full flex-col border-r border-border glass-effect shadow-lg"
      initial={{ width: 320 }}
      animate={{ width: isCollapsed ? 60 : 320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between border-b border-border/50 p-4 backdrop-blur-sm">
        <motion.div className="flex items-center gap-2" animate={{ opacity: isCollapsed ? 0 : 1 }}>
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <Zap size={14} className="text-primary-foreground" />
          </div>
          <h2 className="text-lg font-heading font-semibold">AI Marketplace</h2>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--accent))" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full p-1 hover:bg-accent transition-colors duration-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300"
            style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path
              d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4 p-4"
          >
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  value="custom"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Custom
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: selectedCategory === null ? "hsl(var(--primary)/90%)" : "hsl(var(--accent))",
                }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Types
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: selectedCategory === category ? "hsl(var(--primary)/90%)" : "hsl(var(--accent))",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-secondary p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-medium">No agents found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

