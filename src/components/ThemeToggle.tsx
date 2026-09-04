"use client"

import { useState, useRef, useEffect, useSyncExternalStore } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"
import { cn } from "@/lib/utils"

const options = [
  { value: "light" as const, icon: Sun, label: "Светлая" },
  { value: "dark" as const, icon: Moon, label: "Тёмная" },
  { value: "system" as const, icon: Monitor, label: "Системная" },
]

const emptySubscribe = () => () => {}
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const mounted = useIsMounted()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  const CurrentIcon = mounted
    ? (options.find((o) => o.value === theme)?.icon || Sun)
    : Monitor

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "p-2.5 rounded-lg transition-colors text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
          className
        )}
        aria-label="Тема"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <CurrentIcon className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 fade-in" role="listbox" aria-label="Выбор темы">
          {options.map((opt) => {
            const Icon = opt.icon
            const active = theme === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value)
                  setOpen(false)
                }}
                role="option"
                aria-selected={active}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-inset",
                  active
                    ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 font-medium"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
