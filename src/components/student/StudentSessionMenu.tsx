"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MoreVertical, DoorOpen, LogOut } from "lucide-react"
import { studentLogout } from "@/lib/actions"

/**
 * Compact session menu shown in the student layout header.
 * Hidden on /student/enter (no session yet) and inside active test/exam
 * pages (to prevent accidental logout during a test).
 *
 * Actions:
 *  - "Сменить комнату" → clears token → /student/enter
 *  - "Выйти" → clears token → /
 */
export default function StudentSessionMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  // Hide on enter page — no session to manage
  const isEnterPage = pathname === "/student/enter"

  // Close on outside click (hooks must be called unconditionally)
  useEffect(() => {
    if (!open) return

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  if (isEnterPage) return null

  const handleAction = async (mode: "enter" | "home") => {
    if (loggingOut) return
    setLoggingOut(true)
    setOpen(false)
    try {
      await studentLogout()
    } catch (err) {
      console.error("studentLogout failed:", err)
    }
    router.push(mode === "enter" ? "/student/enter" : "/")
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        aria-label="Меню сессии"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 fade-in">
          <button
            onClick={() => handleAction("enter")}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <DoorOpen className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
            <span>Сменить комнату</span>
          </button>

          <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

          <button
            onClick={() => handleAction("home")}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  )
}
