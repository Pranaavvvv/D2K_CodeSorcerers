"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, MessageSquare, Zap, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface WorkflowChatbotProps {
  onClose: () => void
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function WorkflowChatbot({ onClose }: WorkflowChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Workflow Assistant. I can help you build and optimize your AI agent workflows. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI thinking
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("workflow")) {
        response =
          "Workflows allow you to connect multiple AI agents together to solve complex problems. Start by dragging agents from the marketplace onto the canvas, then connect their inputs and outputs to create a processing pipeline."
      } else if (input.toLowerCase().includes("agent")) {
        response =
          "Agents are specialized AI components that perform specific tasks. Each agent has defined inputs and outputs. You can create custom agents by clicking the 'New Agent' button in the header."
      } else if (input.toLowerCase().includes("connect")) {
        response =
          "To connect agents, drag from an output port (right side) of one agent to an input port (left side) of another. Make sure the data types are compatible - for example, a text output should connect to a text input."
      } else if (input.toLowerCase().includes("run")) {
        response =
          "To run your workflow, click the 'Run' button in the header. This will process data through all connected agents in your workflow. You'll see the results after processing is complete."
      } else if (input.toLowerCase().includes("template")) {
        response =
          "We offer several pre-built workflow templates for common use cases like marketing analysis, legal document processing, and more. Click the 'Templates' button in the header to browse and select one."
      } else if (input.toLowerCase().includes("save") || input.toLowerCase().includes("export")) {
        response =
          "You can save your workflow by clicking the 'Save' button in the header. To export your workflow as a JSON file, click the three dots menu and select 'Export'."
      } else if (input.toLowerCase().includes("share") || input.toLowerCase().includes("collaborate")) {
        response =
          "You can share your workflow with team members by clicking the 'Share' button. This allows for real-time collaboration. You can also manage team permissions in the Team Settings panel."
      } else {
        response =
          "I can help you with building workflows, connecting agents, running your workflow, using templates, saving and sharing your work, and more. What specific aspect would you like to know about?"
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "How do I create a workflow?",
    "What are agents?",
    "How do I connect agents?",
    "How do I run my workflow?",
    "Can I use templates?",
    "How do I share my workflow?",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 right-4 z-40 w-96 rounded-lg glass-card shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <MessageSquare size={16} className="text-primary-foreground" />
          </div>
          <h3 className="font-heading font-medium">Workflow Assistant</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--accent))" }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="rounded-full p-1 hover:bg-accent transition-colors duration-200"
        >
          <X size={16} />
        </motion.button>
      </div>

      <div className="custom-scrollbar h-96 overflow-y-auto p-3 bg-background/50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Zap size={14} />
                  </AvatarFallback>
                </Avatar>
              )}

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "glass-card"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="mt-1 text-right text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </motion.div>

              {message.role === "user" && (
                <Avatar className="ml-2 h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-secondary">U</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Zap size={14} />
                </AvatarFallback>
              </Avatar>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="max-w-[80%] rounded-lg glass-card p-3"
              >
                <div className="flex gap-2">
                  <motion.span
                    className="inline-block h-2 w-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
                  />
                  <motion.span
                    className="inline-block h-2 w-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
                  />
                  <motion.span
                    className="inline-block h-2 w-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {messages.length === 1 && (
        <div className="px-3 py-2 border-t border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-xs h-auto py-1.5 px-2"
                onClick={() => {
                  setInput(question)
                  setTimeout(() => handleSendMessage(), 100)
                }}
              >
                <ArrowRight size={12} className="mr-1 flex-shrink-0" />
                <span className="truncate">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border/50 p-3 bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="bg-background/80 border-border/50 focus-visible:ring-primary/50"
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping} className="flex-shrink-0">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

