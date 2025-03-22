"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, HelpCircle, Search, Book, Video, MessageSquare, ExternalLink, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface HelpCenterProps {
  onClose: () => void
}

// Mock help articles
const helpArticles = [
  {
    id: 1,
    title: "Getting Started with AI Agent Marketplace",
    category: "Basics",
    content: `
      <h3>Welcome to AI Agent Marketplace!</h3>
      <p>This guide will help you get started with creating your first AI workflow.</p>
      <h4>Step 1: Create a new workflow</h4>
      <p>Click the "+" button in the sidebar to create a new workflow.</p>
      <h4>Step 2: Add agents to your canvas</h4>
      <p>Drag agents from the left panel onto the canvas to start building your workflow.</p>
      <h4>Step 3: Connect your agents</h4>
      <p>Connect agents by dragging from an output port to an input port.</p>
      <h4>Step 4: Run your workflow</h4>
      <p>Click the "Run" button to execute your workflow.</p>
    `,
  },
  {
    id: 2,
    title: "Understanding Agent Types",
    category: "Agents",
    content: `
      <h3>Agent Types Explained</h3>
      <p>AI Agent Marketplace offers various types of agents for different purposes:</p>
      <ul>
        <li><strong>Data Processing Agents:</strong> Handle data transformation and analysis</li>
        <li><strong>NLP Agents:</strong> Process and generate natural language</li>
        <li><strong>Integration Agents:</strong> Connect with external services and APIs</li>
        <li><strong>Decision Agents:</strong> Make decisions based on input data</li>
        <li><strong>Custom Agents:</strong> Create your own specialized agents</li>
      </ul>
      <p>Each agent has specific inputs and outputs that determine how it can connect with other agents.</p>
    `,
  },
  {
    id: 3,
    title: "Creating Complex Workflows",
    category: "Advanced",
    content: `
      <h3>Building Advanced Workflows</h3>
      <p>For complex AI tasks, you'll want to create multi-stage workflows:</p>
      <h4>Parallel Processing</h4>
      <p>Connect multiple agents to a single output to process data in parallel.</p>
      <h4>Conditional Branching</h4>
      <p>Use decision agents to create different paths based on the data.</p>
      <h4>Feedback Loops</h4>
      <p>Create loops in your workflow for iterative processing.</p>
      <h4>Multi-Agent Selection</h4>
      <p>Select multiple agents at once by holding Shift while clicking on them.</p>
      <p>You can then move, configure, or delete them as a group.</p>
    `,
  },
  {
    id: 4,
    title: "Troubleshooting Connection Issues",
    category: "Troubleshooting",
    content: `
      <h3>Fixing Connection Problems</h3>
      <p>If you're having trouble connecting agents:</p>
      <ul>
        <li>Ensure the output and input types are compatible</li>
        <li>Check that you're dragging from an output port (right side) to an input port (left side)</li>
        <li>Verify that the input port isn't already connected (one input can only have one connection)</li>
        <li>Try repositioning your agents for better visibility</li>
        <li>If a connection line appears red, it indicates an incompatible connection</li>
      </ul>
      <p>You can delete a connection by hovering over it and clicking the trash icon that appears.</p>
    `,
  },
  {
    id: 5,
    title: "Collaboration Features",
    category: "Teams",
    content: `
      <h3>Working with Your Team</h3>
      <p>AI Agent Marketplace supports team collaboration:</p>
      <h4>Sharing Workflows</h4>
      <p>Share your workflows with team members by clicking the "Share" button.</p>
      <h4>Real-time Collaboration</h4>
      <p>Multiple team members can work on the same workflow simultaneously.</p>
      <h4>Role-based Permissions</h4>
      <p>Assign different roles (Admin, Editor, Viewer) to control what team members can do.</p>
      <h4>Version History</h4>
      <p>Access previous versions of your workflows to track changes or revert if needed.</p>
    `,
  },
]

// Mock FAQ items
const faqItems = [
  {
    question: "How do I add multiple agents at once?",
    answer:
      "Select multiple agents in the agent panel by clicking the checkbox on each agent card. Then click 'Drag All' to drag them to the canvas together.",
  },
  {
    question: "Can I run only specific agents in my workflow?",
    answer:
      "Yes, you can select specific agents and click the 'Run' button in the toolbar that appears, or right-click and select 'Run Selected Agents'.",
  },
  {
    question: "How do I duplicate a workflow?",
    answer:
      "In the sidebar, click the three dots next to the workflow name and select 'Duplicate'. You can also use the 'Export' and 'Import' options to copy workflows between accounts.",
  },
  {
    question: "What's the difference between agent roles?",
    answer:
      "Admin can manage team members and all workflows. Editor can create and modify workflows. Viewer can only view and run workflows but cannot modify them.",
  },
  {
    question: "How do I save my workflow?",
    answer:
      "Workflows are saved automatically as you work. You can also click the 'Save' button in the header to manually save your progress.",
  },
  {
    question: "Can I use my own custom agents?",
    answer:
      "Yes, you can create custom agents by defining their inputs, outputs, and connecting them to your own API endpoints or code.",
  },
]

// Mock video tutorials
const videoTutorials = [
  {
    id: 1,
    title: "Getting Started Tutorial",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "5:32",
    url: "#",
  },
  {
    id: 2,
    title: "Creating Your First Workflow",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "8:15",
    url: "#",
  },
  {
    id: 3,
    title: "Advanced Agent Connections",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "12:47",
    url: "#",
  },
  {
    id: 4,
    title: "Team Collaboration Features",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "7:23",
    url: "#",
  },
]

export function HelpCenter({ onClose }: HelpCenterProps) {
  const [activeTab, setActiveTab] = useState("guides")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null)

  // Filter articles based on search query
  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter FAQ items based on search query
  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute right-0 top-0 z-40 flex h-full w-[500px] flex-col glass-card shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <HelpCircle size={14} className="text-primary-foreground" />
          </div>
          <h2 className="text-lg font-heading font-semibold">Help Center</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--accent))" }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="rounded-full p-1 hover:bg-accent transition-colors duration-200"
        >
          <X size={18} />
        </motion.button>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-8 bg-background/50 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="px-4 bg-transparent justify-start">
          <TabsTrigger
            value="guides"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Book size={16} className="mr-2" />
            Guides
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare size={16} className="mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Video size={16} className="mr-2" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="flex-1 flex flex-col px-4 pb-4">
          {selectedArticle === null ? (
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              <div className="space-y-3">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      className="flex items-center justify-between rounded-lg glass-card p-3 cursor-pointer"
                      whileHover={{
                        scale: 1.01,
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={() => setSelectedArticle(article.id)}
                    >
                      <div>
                        <h3 className="font-medium">{article.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{article.category}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground" />
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-secondary p-3">
                      <Book className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 font-medium">No guides found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              <Button
                variant="ghost"
                className="mb-4 -ml-2 text-muted-foreground"
                onClick={() => setSelectedArticle(null)}
              >
                <ArrowRight size={16} className="mr-2 rotate-180" />
                Back to guides
              </Button>

              {helpArticles.find((article) => article.id === selectedArticle) && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: helpArticles.find((article) => article.id === selectedArticle)!.content,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="faq" className="flex-1 px-4 pb-4">
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-secondary p-3">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-medium">No FAQs found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try a different search term</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="flex-1 px-4 pb-4">
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {videoTutorials.map((video) => (
                <motion.a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col rounded-lg glass-card overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <ExternalLink size={12} className="mr-1" />
                      Watch tutorial
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t border-border/50 p-4">
        <Button variant="outline" className="w-full">
          <MessageSquare size={16} className="mr-2" />
          Contact Support
        </Button>
      </div>
    </motion.div>
  )
}

