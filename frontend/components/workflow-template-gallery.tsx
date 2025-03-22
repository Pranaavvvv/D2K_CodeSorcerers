"use client"

import { motion } from "framer-motion"
import { X, ArrowRight, Zap } from "lucide-react"
import type { WorkflowTemplate } from "@/types/workflow"

interface WorkflowTemplateGalleryProps {
  templates: WorkflowTemplate[]
  onSelect: (template: WorkflowTemplate) => void
  onClose: () => void
}

export function WorkflowTemplateGallery({ templates, onSelect, onClose }: WorkflowTemplateGalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-[800px] max-h-[80vh] rounded-lg glass-card shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border/50 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <Zap size={14} className="text-primary-foreground" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Workflow Templates</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--accent))" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent transition-colors duration-200"
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="custom-scrollbar grid grid-cols-2 gap-4 overflow-y-auto p-4 max-h-[calc(80vh-60px)] bg-background/50">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                y: -5,
              }}
              className="flex flex-col rounded-lg glass-card overflow-hidden"
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 border-b border-border/50">
                <h3 className="text-lg font-heading font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-medium">Workflow Steps:</h4>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {template.steps.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <motion.span
                          className="rounded-md bg-secondary px-2 py-1 text-xs"
                          whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                          transition={{ duration: 0.2 }}
                        >
                          {step}
                        </motion.span>
                        {index < template.steps.length - 1 && (
                          <ArrowRight size={12} className="mx-1 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium">Use Cases:</h4>
                  <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground">
                    {template.useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--primary)/90%)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(template)}
                  className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200"
                >
                  Use This Template
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

