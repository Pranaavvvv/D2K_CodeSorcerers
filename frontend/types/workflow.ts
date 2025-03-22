import type { Agent } from "./agent"

export interface WorkflowNodeType {
  id: string
  type: string
  position: { x: number; y: number }
  data: Agent
  inputs: string[]
  outputs: string[]
}

export interface Connection {
  id: string
  from: { nodeId: string; output: string }
  to: { nodeId: string; input: string }
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNodeType[]
  connections: Connection[]
}

export interface WorkflowTemplate extends Workflow {
  steps: string[]
  useCases: string[]
  domain: string
}

