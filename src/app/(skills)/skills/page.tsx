import Link from "next/link"
import { Code2, Palette } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { getLessonsByTrack, TRACKS } from "@/lib/skills/catalog"

export const metadata = {
  title: "Обучение HTML и CSS — PROlab Academy",
  description: "Изучай основы веб-разработки: HTML и CSS в PROlab Academy.",
}

const trackMeta = [
  { ...TRACKS.html, icon: Code2, href: "/skills/html" },
  { ...TRACKS.css, icon: Palette, href: "/skills/css" },
]

export default function SkillsPage() {
  return (
    <div className="space-y-8 fade-in">
      <div className="space-y-3">
        <p className="text-sm font-medium text-sky-600">Обучение</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Изучай основы веб-разработки
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Два коротких курса по материалам HTML/CSS: сначала структура страницы, затем стили.
          Открой категорию, выбери тему и читай в удобном темпе.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {trackMeta.map((track) => {
          const Icon = track.icon
          const count = getLessonsByTrack(track.id).length
          return (
            <Link key={track.id} href={track.href} className="group">
              <Card className="h-full space-y-4 transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-full bg-slate-50 p-4 transition-colors group-hover:bg-sky-50">
                    <Icon className="h-8 w-8 text-slate-600 transition-colors group-hover:text-sky-500" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    {count} тем
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{track.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{track.description}</p>
                  <p className="mt-3 text-sm font-medium text-sky-600">Количество тем: {count}</p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
