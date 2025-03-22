"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { WorkspaceHeader } from "@/components/workspace-header"
import { Canvas } from "@/components/canvas"
import { AIAssistant } from "@/components/ai-assistant"
import { CollaborationPanel } from "@/components/collaboration-panel"
import { WorkflowTemplateGallery } from "@/components/workflow-template-gallery"
import { CreateWorkflowModal } from "@/components/create-workflow-modal"
import { CreateAgentModal } from "@/components/create-agent-modal"
import { OnboardingTour } from "@/components/onboarding-tour"
import { TeamSettings } from "@/components/team-settings"
import { HelpCenter } from "@/components/help-center"
import { WorkflowOutput } from "@/components/workflow-output"
import { WorkflowChatbot } from "@/components/workflow-chatbot"
import { initialAgents } from "@/data/agents"
import { workflowTemplates } from "@/data/workflow-templates"
import type { Agent } from "@/types/agent"
import type { Workflow, WorkflowTemplate } from "@/types/workflow"

export default function WorkflowPage() {
  const { theme } = useTheme()
  const searchParams = useSearchParams()
  const templateParam = searchParams.get("template")

  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "custom-workflow",
      name: "My First Workflow",
      description: "Your custom AI workflow",
      nodes: [],
      connections: [],
    },
  ])
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>("custom-workflow")
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  // Add new states for team settings and help center
  const [showTeamSettings, setShowTeamSettings] = useState(false)
  const [showHelpCenter, setShowHelpCenter] = useState(false)

  // Add state for running nodes and workflow
  const [runningNodes, setRunningNodes] = useState<string[]>([])
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false)

  // Add a new state for showing the output
  const [showWorkflowOutput, setShowWorkflowOutput] = useState(false)

  // Add state for chatbot
  const [showChatbot, setShowChatbot] = useState(false)

  // Get the active workflow
  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0]

  // Update the active workflow
  const updateActiveWorkflow = (updatedWorkflow: Workflow) => {
    setWorkflows((prev) => prev.map((workflow) => (workflow.id === activeWorkflowId ? updatedWorkflow : workflow)))
  }

  // Handle template selection
  const handleTemplateSelect = (template: WorkflowTemplate) => {
    const newWorkflow = {
      ...template,
      id: `${template.id}-${Date.now()}`,
    }
    setWorkflows((prev) => [...prev, newWorkflow])
    setActiveWorkflowId(newWorkflow.id)
    setShowTemplateGallery(false)
  }

  // Create a new workflow
  const handleCreateWorkflow = (name: string, description: string) => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      nodes: [],
      connections: [],
    }
    setWorkflows((prev) => [...prev, newWorkflow])
    setActiveWorkflowId(newWorkflow.id)
    setShowCreateModal(false)
  }

  // Create a new agent
  const handleCreateAgent = (agent: Agent) => {
    setAgents((prev) => [...prev, agent])
    setShowCreateAgentModal(false)
  }

  // Delete a workflow
  const handleDeleteWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((workflow) => workflow.id !== id))
    if (activeWorkflowId === id) {
      setActiveWorkflowId(workflows[0].id)
    }
  }

  // Duplicate a workflow
  const handleDuplicateWorkflow = (id: string) => {
    const workflowToDuplicate = workflows.find((w) => w.id === id)
    if (workflowToDuplicate) {
      const duplicatedWorkflow = {
        ...workflowToDuplicate,
        id: `${workflowToDuplicate.id}-copy-${Date.now()}`,
        name: `${workflowToDuplicate.name} (Copy)`,
      }
      setWorkflows((prev) => [...prev, duplicatedWorkflow])
    }
  }

  // Modify the runWorkflow function to ensure the output is shown
  const runWorkflow = () => {
    if (isWorkflowRunning) {
      // Stop the workflow
      setRunningNodes([])
      setIsWorkflowRunning(false)
      setShowWorkflowOutput(false)
    } else {
      // Start the workflow - run all nodes
      setRunningNodes(activeWorkflow.nodes.map((node) => node.id))
      setIsWorkflowRunning(true)

      // Show the output component immediately when running starts
      setShowWorkflowOutput(true)
    }
  }

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkMobileView()
    window.addEventListener("resize", checkMobileView)
    return () => window.removeEventListener("resize", checkMobileView)
  }, [])

  // Show onboarding for first-time users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
      localStorage.setItem("hasSeenOnboarding", "true")
    }
  }, [])

  // Load template if specified in URL
  useEffect(() => {
    if (templateParam) {
      const template = workflowTemplates.find((t) => t.id === `${templateParam}-workflow`)
      if (template) {
        handleTemplateSelect(template)
      }
    }
  }, [templateParam])

  return (
    <DndProvider backend={HTML5Backend}>
      <main className={`flex h-screen w-full overflow-hidden bg-background ${theme === "dark" ? "dark" : ""}`}>
        <Sidebar
          workflows={workflows}
          activeWorkflowId={activeWorkflowId}
          onSelectWorkflow={setActiveWorkflowId}
          onCreateWorkflow={() => setShowCreateModal(true)}
          onDeleteWorkflow={handleDeleteWorkflow}
          onDuplicateWorkflow={handleDuplicateWorkflow}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          isMobileView={isMobileView}
          onShowTeamSettings={() => setShowTeamSettings(true)}
          onShowHelpCenter={() => setShowHelpCenter(true)}
          onCreateAgent={() => setShowCreateAgentModal(true)}
        />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <WorkspaceHeader
            workflow={activeWorkflow}
            onShowTemplates={() => setShowTemplateGallery(true)}
            onToggleCollaboration={() => setShowCollaboration(!showCollaboration)}
            onToggleAIAssistant={() => setShowAIAssistant(!showAIAssistant)}
            showCollaboration={showCollaboration}
            showAIAssistant={showAIAssistant}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            isMobileView={isMobileView}
            isWorkflowRunning={isWorkflowRunning}
            onRunWorkflow={runWorkflow}
            onCreateAgent={() => setShowCreateAgentModal(true)}
            onToggleChatbot={() => setShowChatbot(!showChatbot)}
            showChatbot={showChatbot}
          />

          <div className="relative flex-1 overflow-hidden">
            <Canvas
              workflow={activeWorkflow}
              setWorkflow={updateActiveWorkflow}
              agents={agents}
              runningNodes={runningNodes}
              setRunningNodes={setRunningNodes}
              isWorkflowRunning={isWorkflowRunning}
            />
          </div>

          <AnimatePresence>
            {showCollaboration && <CollaborationPanel onClose={() => setShowCollaboration(false)} />}
          </AnimatePresence>

          <AnimatePresence>
            {showAIAssistant && <AIAssistant onClose={() => setShowAIAssistant(false)} />}
          </AnimatePresence>

          <AnimatePresence>
            {showTemplateGallery && (
              <WorkflowTemplateGallery
                templates={workflowTemplates}
                onSelect={handleTemplateSelect}
                onClose={() => setShowTemplateGallery(false)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCreateModal && (
              <CreateWorkflowModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateWorkflow} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCreateAgentModal && (
              <CreateAgentModal onClose={() => setShowCreateAgentModal(false)} onCreate={handleCreateAgent} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showOnboarding && <OnboardingTour onClose={() => setShowOnboarding(false)} />}
          </AnimatePresence>

          <AnimatePresence>
            {showTeamSettings && <TeamSettings onClose={() => setShowTeamSettings(false)} />}
          </AnimatePresence>

          <AnimatePresence>{showHelpCenter && <HelpCenter onClose={() => setShowHelpCenter(false)} />}</AnimatePresence>

          <AnimatePresence>
            {showWorkflowOutput && isWorkflowRunning && (
              <WorkflowOutput workflow={activeWorkflow} onClose={() => setShowWorkflowOutput(false)} />
            )}
          </AnimatePresence>

          <AnimatePresence>{showChatbot && <WorkflowChatbot onClose={() => setShowChatbot(false)} />}</AnimatePresence>
        </AnimatePresence>
      </main>
    </DndProvider>
  )
}

