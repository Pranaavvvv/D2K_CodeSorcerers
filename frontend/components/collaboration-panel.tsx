"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CollaborationPanelProps {
  onClose: () => void
}

const mockUsers = [
  { id: 1, name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", color: "#4f46e5" },
  { id: 2, name: "Maria Garcia", avatar: "/placeholder.svg?height=40&width=40", color: "#0ea5e9" },
  { id: 3, name: "Sam Taylor", avatar: "/placeholder.svg?height=40&width=40", color: "#10b981" },
]

const mockMessages = [
  { id: 1, userId: 1, text: "I've added the text processing agent", time: "10:23 AM" },
  { id: 2, userId: 2, text: "Looks good! Can we connect it to the sentiment analysis?", time: "10:25 AM" },
  { id: 3, userId: 3, text: "I'll work on the visualization component", time: "10:30 AM" },
]

export function CollaborationPanel({ onClose }: CollaborationPanelProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [cursorPositions, setCursorPositions] = useState<Record<number, { x: number; y: number }>>({})

  // Simulate cursor movements
  useEffect(() => {
    const interval = setInterval(() => {
      const newPositions: Record<number, { x: number; y: number }> = {}

      mockUsers.forEach((user) => {
        if (user.id !== 1) {
          // Not current user
          newPositions[user.id] = {
            x: Math.random() * window.innerWidth * 0.6,
            y: Math.random() * window.innerHeight * 0.6,
          }
        }
      })

      setCursorPositions(newPositions)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          userId: 1, // Current user
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute right-0 top-0 z-40 flex h-full w-80 flex-col glass-card shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <Users size={14} className="text-primary-foreground" />
          </div>
          <h2 className="text-lg font-heading font-semibold">Collaboration</h2>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2 bg-background/50">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare size={16} className="mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users size={16} className="mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex h-[calc(100%-40px)] flex-col">
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 bg-background/50">
            {messages.map((message) => {
              const user = mockUsers.find((u) => u.id === message.userId)
              return (
                <motion.div
                  key={message.id}
                  className={`mb-4 flex ${message.userId === 1 ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.userId === 1 ? "bg-primary text-primary-foreground" : "glass-card"
                    }`}
                  >
                    {message.userId !== 1 && (
                      <div className="mb-1 flex items-center gap-2">
                        <Avatar className="h-5 w-5 ring-2 ring-background">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback style={{ backgroundColor: user?.color }}>
                            {user?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{user?.name}</span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <span className="mt-1 block text-right text-xs opacity-70">{message.time}</span>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          <div className="border-t border-border/50 p-4 bg-card/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="bg-background/80 border-border/50 focus-visible:ring-primary/50"
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
                className="flex h-10 min-w-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-3"
              >
                Send
              </motion.button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="h-[calc(100%-40px)] p-4 bg-background/50">
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <motion.div
                key={user.id}
                className="flex items-center justify-between rounded-lg glass-card p-3"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="ring-2 ring-background">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback style={{ backgroundColor: user.color }}>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.id === 1 ? "You" : "Online"}</p>
                  </div>
                </div>
                <div className="relative h-3 w-3 rounded-full bg-green-500">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    style={{ opacity: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Remote cursors with enhanced animations */}
      <AnimatePresence>
        {Object.entries(cursorPositions).map(([userId, position]) => {
          const user = mockUsers.find((u) => u.id === Number(userId))
          if (!user) return null

          return (
            <motion.div
              key={userId}
              className="pointer-events-none absolute z-50"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: position.x,
                y: position.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: user.color }}>
                <path
                  d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.0664062 17.2664V0.575C0.0664062 0.437501 0.200407 0.325001 0.359375 0.325001H0.473375L5.65376 12.3673Z"
                  fill="currentColor"
                />
              </svg>

              <motion.div
                className="ml-2 rounded-md px-2 py-1 text-xs text-white"
                style={{ backgroundColor: user.color }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {user.name}
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

