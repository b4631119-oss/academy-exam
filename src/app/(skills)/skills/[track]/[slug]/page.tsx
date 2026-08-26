import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LessonBody } from "@/components/skills/LessonBody"
import { cn } from "@/lib/utils"
import {
  COURSE_SOURCE,
  getAdjacentLessons,
  getAllLessonParams,
  getLesson,
  isTrackId,
  TRACKS,
} from "@/lib/skills/catalog"

type PageProps = {
  params: Promise<{ track: string; slug: string }>
}

export function generateStaticParams() {
  return getAllLessonParams()
}

export async function generateMetadata({ params }: PageProps) {
  const { track, slug } = await params
  if (!isTrackId(track)) return {}
  const lesson = getLesson(track, slug)
  if (!lesson) return {}
  return {
    title: `${lesson.title} — ${TRACKS[track].title} | PROlab Academy`,
    description: lesson.summary,
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { track, slug } = await params
  if (!isTrackId(track)) notFound()

  const lesson = getLesson(track, slug)
  if (!lesson) notFound()

  const meta = TRACKS[track]
  const { previous, next } = getAdjacentLessons(track, slug)

  return (
    <div className="mx-auto max-w-3xl space-y-8 fade-in">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500">
        <Link href="/skills" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          Обучение
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href={`/skills/${track}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          {meta.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="font-medium text-slate-900 dark:text-slate-100">{lesson.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{meta.title}</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">{lesson.summary}</p>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-8">
        <LessonBody blocks={lesson.blocks} />
      </div>

      {/* Source */}
      <p className="text-xs leading-5 text-slate-400 dark:text-slate-500">
        Материал адаптирован из курса{" "}
        <a
          href={COURSE_SOURCE}
          className="underline decoration-slate-300 dark:decoration-slate-600 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          html-css-course-start
        </a>
        .
      </p>

      {/* Prev / Next */}
      <div className="grid gap-3 sm:grid-cols-2 pt-2">
        {previous ? (
          <Link
            href={`/skills/${track}/${previous.slug}`}
            className={cn(
              "inline-flex min-h-[44px] min-w-0 items-center justify-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <span className="min-w-0">
              <span className="block text-xs font-normal text-slate-400 dark:text-slate-500">Предыдущая тема</span>
              <span className="block truncate">{previous.title}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/skills/${track}/${next.slug}`}
            className="inline-flex min-h-[44px] min-w-0 items-center justify-end gap-3 rounded-xl bg-sky-500 px-4 py-3 text-right text-sm font-medium text-white shadow-sm shadow-sky-500/20 transition-all hover:bg-sky-600 sm:col-start-2"
          >
            <span className="min-w-0">
              <span className="block text-xs font-normal text-sky-100">Следующая тема</span>
              <span className="block truncate">{next.title}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
