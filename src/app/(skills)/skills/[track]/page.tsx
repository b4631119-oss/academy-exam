import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  getLessonsByTrack,
  isTrackId,
  TRACKS,
  type TrackId,
} from "@/lib/skills/catalog"

type PageProps = {
  params: Promise<{ track: string }>
}

export function generateStaticParams() {
  return (Object.keys(TRACKS) as TrackId[]).map((track) => ({ track }))
}

export async function generateMetadata({ params }: PageProps) {
  const { track } = await params
  if (!isTrackId(track)) return {}
  const meta = TRACKS[track]
  return {
    title: `${meta.title} — Обучение | PROlab Academy`,
    description: meta.description,
  }
}

export default async function TrackPage({ params }: PageProps) {
  const { track } = await params
  if (!isTrackId(track)) notFound()

  const meta = TRACKS[track]
  const lessons = getLessonsByTrack(track)

  return (
    <div className="space-y-8 fade-in">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500">
        <Link href="/skills" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          Обучение
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-900 dark:text-slate-100">{meta.title}</span>
      </nav>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{meta.title}</h1>
        <p className="text-base leading-7 text-slate-500 dark:text-slate-400">{meta.description}</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">{lessons.length} тем</p>
      </div>

      <ol className="space-y-3">
        {lessons.map((lesson, index) => (
          <li key={lesson.slug}>
            <Link
              href={`/skills/${track}/${lesson.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-md hover:shadow-sky-50 dark:hover:shadow-sky-950/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-400 dark:text-slate-500 tabular-nums transition-colors group-hover:bg-sky-50 dark:group-hover:bg-sky-950 group-hover:text-sky-500 dark:group-hover:text-sky-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 truncate">{lesson.summary}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-sky-400 dark:group-hover:text-sky-500" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
