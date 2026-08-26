"use client"

import Link from "next/link"
import { Users } from "lucide-react"
import StudentSessionMenu from "@/components/student/StudentSessionMenu"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-sky-600 dark:text-sky-400">
            <Users className="w-6 h-6" />
            <span className="font-bold text-lg hidden sm:inline">Academy Exam Student</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <StudentSessionMenu />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
