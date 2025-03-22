"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, Lightbulb } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AIAssistantProps {
  onClose: () => void
}

const suggestions = [
  "Suggest a workflow for sentiment analysis",
  "How do I connect a text processing agent to a visualization?",
  "What's the best way to structure a data transformation pipeline?",
  "Recommend agents for image recognition",
]

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Assistant. I can help you build workflows, suggest agents, and answer questions about the marketplace. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")

    // Simulate AI thinking
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("sentiment")) {
        response =
          "For sentiment analysis, I recommend starting with a Text Input agent, connecting it to a Sentiment Analysis agent, and then to a Visualization agent. This will allow you to process text data, analyze sentiment, and display the results in a meaningful way."
      } else if (input.toLowerCase().includes("workflow")) {
        response =
          "To create an effective workflow, start with your data source agents on the left, processing agents in the middle, and output/visualization agents on the right. This creates a clear data flow that's easy to understand and debug."
      } else if (input.toLowerCase().includes("connect")) {
        response =
          "To connect agents, drag from an output port (right side) of one agent to an input port (left side) of another. Make sure the data types are compatible - for example, a text output should connect to a text input."
      } else {
        response =
          "I can help you build workflows by suggesting agents and connections based on your goals. Try asking about specific use cases like 'text analysis', 'image processing', or 'data visualization' for more targeted recommendations."
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 right-4 z-40 w-80 rounded-lg glass-card shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Sparkles size={14} className="text-primary-foreground" />
          </div>
          <h3 className="font-heading font-medium">AI Assistant</h3>
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

      <div className="custom-scrollbar h-80 overflow-y-auto p-3 bg-background/50">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "glass-card"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </motion.div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="max-w-[85%] rounded-lg glass-card p-3"
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
        </AnimatePresence>
      </div>

      <div className="border-t border-border/50 p-3 bg-card/50 backdrop-blur-sm">
        <div className="mb-2 flex flex-wrap gap-1">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs transition-colors duration-200"
              onClick={() => setInput(suggestion)}
            >
              <Lightbulb size={10} className="text-primary" />
              {suggestion.length > 20 ? suggestion.substring(0, 20) + "..." : suggestion}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for suggestions..."
            className="text-sm bg-background/80 border-border/50 focus-visible:ring-primary/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary)/90%)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors duration-200"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

