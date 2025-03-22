"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
              transition={{ duration: 0.2 }}
              key={theme}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

