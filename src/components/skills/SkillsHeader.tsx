import Link from "next/link"
import { BookOpen } from "lucide-react"

export function SkillsHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 text-sky-600">
          <BookOpen className="h-6 w-6" />
          <span className="hidden font-bold text-lg sm:inline">PROlab Academy</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/skills" className="text-sky-600">
            Обучение
          </Link>
          <Link href="/" className="text-slate-500 hover:text-sky-600 transition-colors">
            На главную
          </Link>
        </nav>
      </div>
    </header>
  )
}
