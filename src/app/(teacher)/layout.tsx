"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { GraduationCap, LogOut } from "lucide-react"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Hide nav on login page (no longer needed here as login is outside, but keep just in case)
  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/teacher/dashboard" className="flex items-center space-x-2 text-sky-600">
            <GraduationCap className="w-6 h-6" />
            <span className="font-bold text-lg hidden sm:inline">Academy Exam</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/teacher/dashboard" 
              className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
