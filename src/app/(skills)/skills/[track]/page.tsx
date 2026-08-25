import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
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
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/skills" className="hover:text-sky-600">
          Обучение
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">{meta.title}</span>
      </nav>

      <div className="space-y-3">
        <Link
          href="/skills"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к обучению
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{meta.title}</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600">{meta.description}</p>
        <p className="text-sm text-slate-500">Количество тем: {lessons.length}</p>
      </div>

      <ol className="space-y-4">
        {lessons.map((lesson, index) => (
          <li key={lesson.slug}>
            <Link href={`/skills/${track}/${lesson.slug}`} className="group block">
              <Card className="flex items-start gap-4 transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/50">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-sm font-bold text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-600">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{lesson.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{lesson.summary}</p>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 group-hover:text-sky-500" />
              </Card>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
