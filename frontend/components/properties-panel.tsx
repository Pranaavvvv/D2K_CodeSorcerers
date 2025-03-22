"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Settings, Sliders, Palette, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { WorkflowNodeType } from "@/types/workflow"
import type { Agent } from "@/types/agent"

interface PropertiesPanelProps {
  node: WorkflowNodeType
  onUpdateNode: (nodeId: string, data: Partial<Agent>) => void
  onClose: () => void
}

export function PropertiesPanel({ node, onUpdateNode, onClose }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [name, setName] = useState(node.data.name)
  const [description, setDescription] = useState(node.data.description)
  const [color, setColor] = useState(node.data.color)
  const [newTag, setNewTag] = useState("")
  const [tags, setTags] = useState(node.data.tags || [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        const updatedTags = [...tags, newTag.trim()]
        setTags(updatedTags)
        onUpdateNode(node.id, { tags: updatedTags })
      }
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(updatedTags)
    onUpdateNode(node.id, { tags: updatedTags })
  }

  const handleSave = () => {
    onUpdateNode(node.id, {
      name,
      description,
      color,
      tags,
    })
  }

  // If panel is collapsed, render a minimal version
  if (isCollapsed) {
    return (
      <motion.div
        className="flex h-full flex-col border-l border-border bg-card z-20"
        initial={{ width: 60 }}
        animate={{ width: 60 }}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      >
        <div className="flex h-12 items-center justify-center border-b border-border">
          <button
            onClick={() => setIsCollapsed(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`rounded-full p-2 ${
                    activeTab === "general"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setActiveTab("general")
                    setIsCollapsed(false)
                  }}
                >
                  <Settings size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">General Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`rounded-full p-2 ${
                    activeTab === "appearance"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setActiveTab("appearance")
                    setIsCollapsed(false)
                  }}
                >
                  <Palette size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Appearance</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`rounded-full p-2 ${
                    activeTab === "advanced"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setActiveTab("advanced")
                    setIsCollapsed(false)
                  }}
                >
                  <Sliders size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Advanced Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex h-full flex-col border-l border-border bg-card z-20"
      initial={{ width: 320 }}
      animate={{ width: 320 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold">Agent Properties</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Advanced
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => onUpdateNode(node.id, { name })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  onBlur={() => onUpdateNode(node.id, { description })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-accent p-0.5">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag and press Enter"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="rounded-md border border-border p-2 text-sm">{node.data.category}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Domains</label>
                <div className="flex flex-wrap gap-2">
                  {node.data.domains?.map((domain) => (
                    <Badge key={domain} variant="outline">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="color" className="text-sm font-medium">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md border border-border" style={{ backgroundColor: color }} />
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    onBlur={() => onUpdateNode(node.id, { color })}
                    className="w-16 h-8 p-0"
                  />
                  <Input
                    value={color}
                    onChange={handleColorChange}
                    onBlur={() => onUpdateNode(node.id, { color })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div className="rounded-md p-3 text-white" style={{ backgroundColor: color }}>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <span className="text-sm font-bold">{name.charAt(0)}</span>
                    </div>
                    <span className="font-medium">{name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Inputs</label>
                <div className="rounded-md border border-border p-2">
                  <ul className="space-y-1">
                    {node.inputs.map((input) => (
                      <li key={input} className="text-sm">
                        {input}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Outputs</label>
                <div className="rounded-md border border-border p-2">
                  <ul className="space-y-1">
                    {node.outputs.map((output) => (
                      <li key={output} className="text-sm">
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Capabilities</label>
                <div className="rounded-md border border-border p-2">
                  <ul className="space-y-1">
                    {node.data.capabilities?.map((capability, index) => (
                      <li key={index} className="text-sm">
                        {capability}
                      </li>
                    )) || <li className="text-sm text-muted-foreground">No capabilities defined</li>}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Node ID</label>
                <div className="flex items-center gap-2">
                  <Input value={node.id} readOnly className="bg-muted" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                          <Info size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>This is the unique identifier for this node</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <Button onClick={handleSave} className="w-full">
            Apply Changes
          </Button>
        </div>
      </Tabs>
    </motion.div>
  )
}

