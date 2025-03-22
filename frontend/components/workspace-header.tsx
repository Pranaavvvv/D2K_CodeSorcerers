"use client"

import { useState } from "react"
import {
  Save,
  Share,
  Download,
  Upload,
  Users,
  Sparkles,
  Menu,
  Zap,
  Play,
  Pause,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Plus,
  MessageSquare,
} from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Workflow } from "@/types/workflow"

// Update the WorkspaceHeaderProps interface to include the chatbot toggle
interface WorkspaceHeaderProps {
  workflow: Workflow
  onShowTemplates: () => void
  onToggleCollaboration: () => void
  onToggleAIAssistant: () => void
  showCollaboration: boolean
  showAIAssistant: boolean
  onToggleSidebar: () => void
  isMobileView: boolean
  isWorkflowRunning?: boolean
  onRunWorkflow?: () => void
  onCreateAgent?: () => void
  onToggleChatbot?: () => void
  showChatbot?: boolean
}

export function WorkspaceHeader({
  workflow,
  onShowTemplates,
  onToggleCollaboration,
  onToggleAIAssistant,
  showCollaboration,
  showAIAssistant,
  onToggleSidebar,
  isMobileView,
  isWorkflowRunning = false,
  onRunWorkflow,
  onCreateAgent,
  onToggleChatbot,
  showChatbot = false,
}: WorkspaceHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [workflowName, setWorkflowName] = useState(workflow.name)

  const handleSaveWorkflow = () => {
    // In a real app, this would save to a database
    alert("Workflow saved successfully!")
  }

  const handleShareWorkflow = () => {
    // In a real app, this would generate a shareable link
    alert("Shareable link copied to clipboard!")
  }

  const handleExportWorkflow = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflow))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${workflow.name.toLowerCase().replace(/\s+/g, "-")}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImportWorkflow = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const importedWorkflow = JSON.parse(event.target?.result as string) as Workflow
            // In a real app, this would update the workflow
            alert(`Imported workflow: ${importedWorkflow.name}`)
          } catch (error) {
            alert("Invalid workflow file")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleNameSubmit = () => {
    // In a real app, this would update the workflow name
    setIsEditing(false)
    // Update workflow name logic would go here
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        {isMobileView && (
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Menu size={20} />
          </button>
        )}

        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleNameSubmit()
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="h-8 w-48 text-sm"
              autoFocus
              onBlur={handleNameSubmit}
            />
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{workflow.name}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Edit size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isWorkflowRunning ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={onRunWorkflow}
              >
                {isWorkflowRunning ? <Pause size={16} /> : <Play size={16} />}
                {!isMobileView && (isWorkflowRunning ? "Stop" : "Run")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isWorkflowRunning ? "Stop Workflow" : "Run Workflow"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={onCreateAgent}>
                <Plus size={16} />
                {!isMobileView && "New Agent"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create New Agent</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={onShowTemplates}>
                <Zap size={16} />
                {!isMobileView && "Templates"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Workflow Templates</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {!isMobileView && (
          <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSaveWorkflow}>
              <Save size={16} />
              Save
            </Button>

            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShareWorkflow}>
              <Share size={16} />
              Share
            </Button>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isMobileView && (
              <>
                <DropdownMenuItem onClick={handleSaveWorkflow}>
                  <Save size={14} className="mr-2" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareWorkflow}>
                  <Share size={14} className="mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleExportWorkflow}>
              <Download size={14} className="mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportWorkflow}>
              <Upload size={14} className="mr-2" />
              Import
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {}}>
              <Copy size={14} className="mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleAIAssistant}
                className={showAIAssistant ? "bg-primary text-primary-foreground" : ""}
              >
                <Sparkles size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Assistant</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleCollaboration}
                className={showCollaboration ? "bg-primary text-primary-foreground" : ""}
              >
                <Users size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Collaboration</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleChatbot}
                className={showChatbot ? "bg-primary text-primary-foreground" : ""}
              >
                <MessageSquare size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Workflow Chatbot</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ThemeSwitcher />
      </div>
    </div>
  )
}

