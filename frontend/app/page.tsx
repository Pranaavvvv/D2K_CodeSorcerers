"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Zap, Puzzle, Workflow, Brain, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold">AI Agent Marketplace</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/templates" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Templates
            </Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <ThemeSwitcher />
            <Link href="/workflow">
              <Button>Launch App</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-heading font-bold leading-tight sm:text-5xl md:text-6xl">
              Build Your Own <span className="text-primary">AI Workflows</span> with Drag-and-Drop Simplicity
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Connect specialized AI agents into powerful workflows tailored to your industry needs. No coding required.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/workflow">
                <Button size="lg" className="gap-2">
                  Start Building <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg">
                  Explore Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-heading font-bold sm:text-4xl">
            Redefine How <span className="text-primary">AI Agents</span> Work Together
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Instead of static models, our marketplace offers modular AI agents that can be combined into custom
            workflows
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Puzzle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-heading font-semibold">Modular AI Agents</h3>
            <p className="mt-2 text-muted-foreground">
              Choose from a marketplace of specialized AI agents designed for specific tasks across industries
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Workflow className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-heading font-semibold">Visual Workflow Builder</h3>
            <p className="mt-2 text-muted-foreground">
              Drag, drop, and connect agents with our intuitive visual interface. No coding skills required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-heading font-semibold">Intelligent Connections</h3>
            <p className="mt-2 text-muted-foreground">
              Agents communicate seamlessly, passing data and insights to create powerful AI workflows
            </p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-heading font-bold sm:text-4xl">
              Ready-to-Use <span className="text-primary">Workflow Templates</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start with our pre-built templates designed for specific industries and use cases
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
            >
              <h3 className="text-xl font-heading font-semibold">Marketing Agency</h3>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>SEO Optimizer</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Competitor Watchdog</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Product Recommendation AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Post Creator</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Smart Email Manager</span>
                </div>
              </div>
              <Link href="/workflow?template=marketing">
                <Button variant="outline" className="mt-6 w-full">
                  Use Template
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
            >
              <h3 className="text-xl font-heading font-semibold">Corporate Productivity</h3>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Meeting Summarizer</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Smart Email Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Competitor Watchdog</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Customer Feedback Analyzer</span>
                </div>
              </div>
              <Link href="/workflow?template=corporate">
                <Button variant="outline" className="mt-6 w-full">
                  Use Template
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
            >
              <h3 className="text-xl font-heading font-semibold">Legal & Compliance</h3>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Contract Summarizer</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>AI Research Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Regulatory Compliance Watchdog</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span>Smart Email Manager</span>
                </div>
              </div>
              <Link href="/workflow?template=legal">
                <Button variant="outline" className="mt-6 w-full">
                  Use Template
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/templates">
              <Button variant="outline" size="lg">
                View All Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="mx-auto max-w-4xl rounded-lg bg-primary p-10 text-center text-primary-foreground">
          <h2 className="text-3xl font-heading font-bold sm:text-4xl">Ready to Build Your AI Workflow?</h2>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Start creating custom AI workflows tailored to your specific needs today.
          </p>
          <div className="mt-8">
            <Link href="/workflow">
              <Button variant="secondary" size="lg" className="gap-2">
                Launch Workflow Builder <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-heading font-bold sm:text-4xl">
              Trusted by <span className="text-primary">Innovative Teams</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how organizations are transforming their workflows with our AI Agent Marketplace
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
              </div>
              <p className="mt-4 text-muted-foreground">
                "The AI Agent Marketplace has revolutionized our marketing operations. We've automated our content
                pipeline and increased productivity by 300%."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">Marketing Director, TechCorp</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
              </div>
              <p className="mt-4 text-muted-foreground">
                "As a legal firm, we've reduced document review time by 75% using the Contract Summarizer and Research
                Assistant agents. Game-changing technology."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">MS</span>
                </div>
                <div>
                  <p className="font-medium">Michael Smith</p>
                  <p className="text-sm text-muted-foreground">Partner, Legal Solutions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border border-border/50 bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
                <Star className="fill-yellow-400 h-4 w-4" />
              </div>
              <p className="mt-4 text-muted-foreground">
                "The ability to create custom educational workflows has transformed how we deliver personalized learning
                experiences to our students."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">AR</span>
                </div>
                <div>
                  <p className="font-medium">Amanda Rodriguez</p>
                  <p className="text-sm text-muted-foreground">EdTech Director, Learning Future</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold">AI Agent Marketplace</span>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 AI Agent Marketplace. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

