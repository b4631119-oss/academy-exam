import Link from "next/link"
import { Code2, Palette, Braces, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { getLessonsByTrack, TRACKS } from "@/lib/skills/catalog"

export const metadata = {
  title: "Обучение — PROlab Academy",
  description: "Изучай основы веб-разработки: HTML, CSS и JavaScript в PROlab Academy. Бесплатные уроки.",
}

const trackMeta = [
  { ...TRACKS.html, icon: Code2, href: "/skills/html" },
  { ...TRACKS.css, icon: Palette, href: "/skills/css" },
  { ...TRACKS.js, icon: Braces, href: "/skills/js" },
]

export default function SkillsPage() {
  return (
    <div className="space-y-10 fade-in">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Обучение
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
          Изучай основы веб-разработки в удобном формате
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {trackMeta.map((track) => {
          const Icon = track.icon
          const count = getLessonsByTrack(track.id).length
          return (
            <Link key={track.id} href={track.href} className="group">
              <Card className="h-full flex flex-col gap-4 transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-lg hover:shadow-sky-50 dark:hover:shadow-sky-950/50">
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 transition-colors group-hover:bg-sky-50 dark:group-hover:bg-sky-950">
                    <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400 transition-colors group-hover:text-sky-500 dark:group-hover:text-sky-400" />
                  </div>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {count} тем
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{track.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{track.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                  Открыть
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
