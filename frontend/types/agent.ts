export interface Agent {
  id: string
  name: string
  description: string
  category: string
  color: string
  tags: string[]
  rating: number
  usageCount: number
  inputs: string[]
  outputs: string[]
  input: string
  output: string
  domains: string[]
  capabilities?: string[]
}

