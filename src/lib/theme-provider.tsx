"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"
type Resolved = "light" | "dark"

interface ThemeCtx {
  theme: Theme
  resolved: Resolved
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function getSystemTheme(): Resolved {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolve(theme: Theme): Resolved {
  return theme === "system" ? getSystemTheme() : theme
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system"
  return (localStorage.getItem("theme") as Theme) || "system"
}

function getInitialResolved(): Resolved {
  if (typeof window === "undefined") return "light"
  const stored = localStorage.getItem("theme") as Theme | null
  return resolve(stored || "system")
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [resolved, setResolved] = useState<Resolved>(getInitialResolved)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (theme === "system") {
        setResolved(getSystemTheme())
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolved)
  }, [resolved])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    setResolved(resolve(t))
    localStorage.setItem("theme", t)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
