"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Copy,
  Trash2,
  Settings,
  Home,
  Layers,
  Users,
  HelpCircle,
  LogOut,
  Zap,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Workflow } from "@/types/workflow"

interface SidebarProps {
  workflows: Workflow[]
  activeWorkflowId: string
  onSelectWorkflow: (id: string) => void
  onCreateWorkflow: () => void
  onDeleteWorkflow: (id: string) => void
  onDuplicateWorkflow: (id: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  isMobileView: boolean
  onShowTeamSettings?: () => void
  onShowHelpCenter?: () => void
  onCreateAgent?: () => void
}

export function Sidebar({
  workflows,
  activeWorkflowId,
  onSelectWorkflow,
  onCreateWorkflow,
  onDeleteWorkflow,
  onDuplicateWorkflow,
  collapsed,
  setCollapsed,
  isMobileView,
  onShowTeamSettings,
  onShowHelpCenter,
  onCreateAgent,
}: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("workflows")

  // If sidebar is collapsed in mobile view, don't render content
  if (collapsed && isMobileView) {
    return null
  }

  return (
    <motion.div
      className="flex h-full flex-col border-r border-border bg-card z-30"
      initial={{ width: collapsed ? 72 : 280 }}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.28856 0.796908C7.42258 0.734364 7.57742 0.734364 7.71144 0.796908L13.7114 3.59691C13.8875 3.67906 14 3.85574 14 4.05V10.95C14 11.1443 13.8875 11.3209 13.7114 11.4031L7.71144 14.2031C7.57742 14.2656 7.42258 14.2656 7.28856 14.2031L1.28856 11.4031C1.11252 11.3209 1 11.1443 1 10.95V4.05C1 3.85574 1.11252 3.67906 1.28856 3.59691L7.28856 0.796908ZM2 4.80578L7 6.93078V12.9649L2 10.6316V4.80578ZM8 12.9649L13 10.6316V4.80578L8 6.93078V12.9649ZM7.5 6.05672L12.2719 4.02866L7.5 1.80176L2.72809 4.02866L7.5 6.05672Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className="text-primary-foreground"
                ></path>
              </svg>
            </div>
            <h1 className="text-lg font-semibold">AI Marketplace</h1>
          </motion.div>
        )}

        {collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary mx-auto"
          >
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.28856 0.796908C7.42258 0.734364 7.57742 0.734364 7.71144 0.796908L13.7114 3.59691C13.8875 3.67906 14 3.85574 14 4.05V10.95C14 11.1443 13.8875 11.3209 13.7114 11.4031L7.71144 14.2031C
7.57742 14.2656 7.42258 14.2656 7.28856 14.2031L1.28856 11.4031C1.11252 11.3209 1 11.1443 1 10.95V4.05C1 3.85574 1.11252 3.67906 1.28856 3.59691L7.28856 0.796908ZM2 4.80578L7 6.93078V12.9649L2 10.6316V4.80578ZM8 12.9649L13 10.6316V4.80578L8 6.93078V12.9649ZM7.5 6.05672L12.2719 4.02866L7.5 1.80176L2.72809 4.02866L7.5 6.05672Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                className="text-primary-foreground"
              ></path>
            </svg>
          </motion.div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeSection === "home" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
                onClick={() => setActiveSection("home")}
              >
                <Home size={18} />
                {!collapsed && <span>Home</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Home</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeSection === "workflows" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
                onClick={() => setActiveSection("workflows")}
              >
                <Layers size={18} />
                {!collapsed && <span>Workflows</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Workflows</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeSection === "agents" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
                onClick={() => {
                  setActiveSection("agents")
                  if (onCreateAgent) onCreateAgent()
                }}
              >
                <Zap size={18} />
                {!collapsed && <span>Create Agent</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Create Agent</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeSection === "team" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
                onClick={() => {
                  setActiveSection("team")
                  if (onShowTeamSettings) onShowTeamSettings()
                }}
              >
                <Users size={18} />
                {!collapsed && <span>Team</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Team</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeSection === "settings" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
                onClick={() => setActiveSection("settings")}
              >
                <Settings size={18} />
                {!collapsed && <span>Settings</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeSection === "help" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
                onClick={() => {
                  setActiveSection("help")
                  if (onShowHelpCenter) onShowHelpCenter()
                }}
              >
                <HelpCircle size={18} />
                {!collapsed && <span>Help</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Help</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Workflows Section */}
      {activeSection === "workflows" && (
        <div className="mt-2 flex-1 overflow-y-auto">
          {!collapsed && (
            <div className="flex items-center justify-between px-4 py-2">
              <h2 className="text-sm font-semibold">My Workflows</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onCreateWorkflow}
                      className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Plus size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Create Workflow</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {collapsed && (
            <div className="flex justify-center py-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onCreateWorkflow}
                      className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Plus size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Create Workflow</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="space-y-1 px-2">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                          ${activeWorkflowId === workflow.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
                        onClick={() => onSelectWorkflow(workflow.id)}
                      >
                        {activeWorkflowId === workflow.id ? (
                          <FolderOpen size={18} className="flex-shrink-0" />
                        ) : (
                          <Folder size={18} className="flex-shrink-0" />
                        )}
                        {!collapsed && <span className="truncate">{workflow.name}</span>}
                      </button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{workflow.name}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>

                {!collapsed && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                          <MoreHorizontal size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onDuplicateWorkflow(workflow.id)}>
                          <Copy size={14} className="mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteWorkflow(workflow.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" />
            <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">User Name</p>
              <p className="truncate text-xs text-muted-foreground">user@example.com</p>
            </div>
          )}

          {!collapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Settings size={14} className="mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut size={14} className="mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.div>
  )
}

