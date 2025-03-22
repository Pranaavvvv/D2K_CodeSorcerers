"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Plus, Zap, Palette, Puzzle, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Agent } from "@/types/agent"

interface CreateAgentModalProps {
  onClose: () => void
  onCreate: (agent: Agent) => void
}

export function CreateAgentModal({ onClose, onCreate }: CreateAgentModalProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Processing")
  const [domain, setDomain] = useState("custom")
  const [color, setColor] = useState("#8b5cf6")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [inputs, setInputs] = useState<string[]>([])
  const [newInput, setNewInput] = useState("")
  const [outputs, setOutputs] = useState<string[]>([])
  const [newOutput, setNewOutput] = useState("")
  const [capabilities, setCapabilities] = useState<string[]>([])
  const [newCapability, setNewCapability] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddInput = () => {
    if (newInput.trim() && !inputs.includes(newInput.trim())) {
      setInputs([...inputs, newInput.trim()])
      setNewInput("")
    }
  }

  const handleRemoveInput = (input: string) => {
    setInputs(inputs.filter((i) => i !== input))
  }

  const handleAddOutput = () => {
    if (newOutput.trim() && !outputs.includes(newOutput.trim())) {
      setOutputs([...outputs, newOutput.trim()])
      setNewOutput("")
    }
  }

  const handleRemoveOutput = (output: string) => {
    setOutputs(outputs.filter((o) => o !== output))
  }

  const handleAddCapability = () => {
    if (newCapability.trim() && !capabilities.includes(newCapability.trim())) {
      setCapabilities([...capabilities, newCapability.trim()])
      setNewCapability("")
    }
  }

  const handleRemoveCapability = (capability: string) => {
    setCapabilities(capabilities.filter((c) => c !== capability))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !description.trim() || inputs.length === 0 || outputs.length === 0) {
      return
    }

    const newAgent: Agent = {
      id: `custom-${Date.now()}`,
      name,
      description,
      category,
      color,
      tags,
      rating: 5,
      usageCount: 0,
      inputs,
      outputs,
      input: inputs.join(", "),
      output: outputs.join(", "),
      domains: [domain],
      capabilities,
    }

    onCreate(newAgent)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-full max-w-2xl rounded-lg border border-border bg-card shadow-lg max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Create New AI Agent</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full max-h-[calc(90vh-60px)]">
          <div className="border-b border-border">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="basic"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="io"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Inputs & Outputs
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="capabilities"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Capabilities
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="custom-scrollbar overflow-y-auto p-6">
            <TabsContent value="basic" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Agent Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter agent name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this agent does"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Input">Input</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Output">Output</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="domain" className="text-sm font-medium">
                      Domain
                    </label>
                    <Select value={domain} onValueChange={setDomain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 rounded-full hover:bg-accent p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddTag}>
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="io" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Inputs <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground">Define what data this agent can receive</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {inputs.map((input) => (
                      <Badge key={input} variant="secondary" className="flex items-center gap-1">
                        {input}
                        <button
                          onClick={() => handleRemoveInput(input)}
                          className="ml-1 rounded-full hover:bg-accent p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newInput}
                      onChange={(e) => setNewInput(e.target.value)}
                      placeholder="Add an input (e.g., text, image, data)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddInput()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddInput}>
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Outputs <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground">Define what data this agent produces</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {outputs.map((output) => (
                      <Badge key={output} variant="secondary" className="flex items-center gap-1">
                        {output}
                        <button
                          onClick={() => handleRemoveOutput(output)}
                          className="ml-1 rounded-full hover:bg-accent p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newOutput}
                      onChange={(e) => setNewOutput(e.target.value)}
                      placeholder="Add an output (e.g., summary, analysis, recommendation)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddOutput()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddOutput}>
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Connection Tips</h3>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    <li>Inputs define what data your agent can receive from other agents</li>
                    <li>Outputs define what data your agent can send to other agents</li>
                    <li>Be specific with naming to ensure compatibility with other agents</li>
                    <li>Common input/output types: text, data, analysis, image, audio, summary</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="color" className="text-sm font-medium">
                    Agent Color
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md" style={{ backgroundColor: color }} />
                    <div className="flex-1">
                      <Input
                        id="color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preview</label>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div
                      className="flex items-center justify-between rounded-t-lg p-3"
                      style={{ backgroundColor: color }}
                    >
                      <div className="flex items-center gap-2 z-10">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                          <span className="text-sm font-bold text-white">{name ? name.charAt(0) : "A"}</span>
                        </div>
                        <h3 className="text-sm font-medium text-white">{name || "Agent Name"}</h3>
                      </div>
                    </div>
                    <div className="p-3 bg-card">
                      <p className="text-xs text-muted-foreground">
                        {description || "Agent description will appear here"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Appearance Tips</h3>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    <li>Choose a color that represents the agent's function</li>
                    <li>Use distinct colors for different types of agents</li>
                    <li>Consider using your brand colors for consistency</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="capabilities" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agent Capabilities</label>
                  <p className="text-xs text-muted-foreground">
                    List the specific capabilities and features of your agent
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {capabilities.map((capability) => (
                      <Badge key={capability} variant="secondary" className="flex items-center gap-1">
                        {capability}
                        <button
                          onClick={() => handleRemoveCapability(capability)}
                          className="ml-1 rounded-full hover:bg-accent p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newCapability}
                      onChange={(e) => setNewCapability(e.target.value)}
                      placeholder="Add a capability"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCapability()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddCapability}>
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Capability Examples</h3>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md bg-background p-2">Text summarization</div>
                    <div className="rounded-md bg-background p-2">Sentiment analysis</div>
                    <div className="rounded-md bg-background p-2">Data visualization</div>
                    <div className="rounded-md bg-background p-2">Language translation</div>
                    <div className="rounded-md bg-background p-2">Content generation</div>
                    <div className="rounded-md bg-background p-2">Image recognition</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="border-t border-border p-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name || !description || inputs.length === 0 || outputs.length === 0}
            >
              Create Agent
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

