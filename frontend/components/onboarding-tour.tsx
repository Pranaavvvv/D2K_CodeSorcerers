"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, ArrowLeft, Layers, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingTourProps {
  onClose: () => void
}

export function OnboardingTour({ onClose }: OnboardingTourProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to AI Agent Marketplace",
      description: "Build powerful AI workflows by connecting specialized agents. Let's take a quick tour!",
      icon: <Zap size={24} className="text-primary" />,
    },
    {
      title: "Create Workflows",
      description:
        "Create multiple workflows for different tasks. Each workflow can have its own set of agents and connections.",
      icon: <Layers size={24} className="text-primary" />,
    },
    {
      title: "Connect Agents",
      description:
        "Drag agents from the marketplace to the canvas, then connect them by dragging from outputs to inputs.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02 11.5894 2.02 13.02C2.02 13.294 2.24102 13.52 2.52 13.52C2.79898 13.52 3.02 13.294 3.02 13.02C3.02 11.8606 3.42216 10.7806 4.2181 9.97357C5.01953 9.16105 6.0933 8.75 7.25 8.75C8.4067 8.75 9.48047 9.16105 10.2819 9.97357C11.0778 10.7806 11.48 11.8606 11.48 13.02C11.48 13.294 11.701 13.52 11.98 13.52C12.259 13.52 12.48 13.294 12.48 13.02C12.48 11.5894 11.9778 10.2794 10.9959 9.31167C10.2244 8.55134 9.2003 8.12901 8.00627 7.98351C9.51876 7.54738 10.625 6.15288 10.625 4.5C10.625 2.49797 9.00203 0.875 7 0.875Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Collaborate with Others",
      description:
        "Invite team members to collaborate on workflows in real-time. Share your workflows with others to get feedback.",
      icon: <Users size={24} className="text-primary" />,
    },
  ]

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
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
        className="relative w-full max-w-md rounded-lg border border-border bg-card shadow-lg overflow-hidden"
      >
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">{steps[step].icon}</div>
              <h2 className="mb-2 text-xl font-semibold">{steps[step].title}</h2>
              <p className="text-muted-foreground">{steps[step].description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={step === 0}
              className={step === 0 ? "opacity-0" : ""}
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </Button>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 w-6 rounded-full ${i === step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            <Button size="sm" onClick={nextStep}>
              {step === steps.length - 1 ? "Get Started" : "Next"}
              {step !== steps.length - 1 && <ArrowRight size={16} className="ml-2" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

