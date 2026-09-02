import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LessonBody } from "@/components/skills/LessonBody"
import { ShareButtons } from "@/components/skills/ShareButtons"
import { JsonLd } from "@/components/JsonLd"
import { cn } from "@/lib/utils"
import {
  COURSE_SOURCE,
  getAdjacentLessons,
  getAllLessonParams,
  getLesson,
  isTrackId,
  TRACKS,
} from "@/lib/skills/catalog"
import { getLessonKeywords, getTrackTitle } from "@/lib/seo/keywords"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prolab-academy.site"

function extractTextFromBlocks(blocks: import("@/lib/skills/catalog").ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "heading" || block.type === "p" || block.type === "note") {
        return block.text
      }
      if (block.type === "list") {
        return block.items.join(" ")
      }
      if (block.type === "code") {
        return block.code
      }
      return ""
    })
    .join(" ")
    .replace(/[#*`_\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

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

  const meta = TRACKS[track]
  const titles = getTrackTitle(track)
  const url = `${SITE_URL}/skills/${track}/${slug}`

  const fullContent = extractTextFromBlocks(lesson.blocks)
  const baseDescription = lesson.summary || fullContent.slice(0, 140)
  const description = `Урок «${lesson.title}» из курса ${titles.ru} / Lesson "${lesson.title}" from ${titles.en} course. ${baseDescription} Начните обучение сегодня / Start learning today.`

  return {
    title: `${lesson.title} — ${titles.ru} | PROlab Academy`,
    description,
    keywords: getLessonKeywords(track, lesson.title),
    openGraph: {
      title: `${lesson.title} — ${titles.ru} | PROlab Academy`,
      description,
      type: "article",
      url,
      siteName: "PROlab Academy",
      images: [
        {
          url: "/hero-image.png",
          width: 1200,
          height: 630,
          alt: lesson.title,
        },
      ],
      publishedTime: new Date().toISOString(),
      authors: ["PROlab Academy"],
      section: meta.title,
      tags: [meta.title, track, "programming", "tutorial"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lesson.title} — ${titles.ru} | PROlab Academy`,
      description,
      images: ["/hero-image.png"],
    },
    alternates: {
      canonical: `/skills/${track}/${slug}`,
    },
    robots: "index, follow",
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { track, slug } = await params
  if (!isTrackId(track)) notFound()

  const lesson = getLesson(track, slug)
  if (!lesson) notFound()

  const meta = TRACKS[track]
  const { previous, next } = getAdjacentLessons(track, slug)

  const headersList = await headers()
  const host = headersList.get("host") || process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  const url = `${baseUrl}/skills/${track}/${slug}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lesson.title,
    description: lesson.summary,
    url,
    image: `${SITE_URL}/hero-image.png`,
    author: {
      "@type": "Organization",
      name: "PROlab Academy",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "PROlab Academy",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/hero-image.png`,
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: meta.title,
    keywords: [meta.title, track, "programming", "tutorial", lesson.title],
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <div className="mx-auto max-w-3xl space-y-8 fade-in">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-500" aria-label="Хлебные крошки">
          <Link href="/skills" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
            Обучение
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <Link href={`/skills/${track}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
            {meta.title}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-[300px]">{lesson.title}</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{meta.title}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {lesson.title}
          </h1>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">{lesson.summary}</p>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-8">
          <LessonBody blocks={lesson.blocks} />
        </div>

        {/* Share Buttons */}
        <ShareButtons title={lesson.title} url={url} />

        {/* Source */}
        <p className="text-sm leading-6 text-slate-500 dark:text-slate-500">
          {track === "js" || track === "dom" ? (
            <>Материалы курса {meta.title} — PROlab Academy.</>
          ) : (
            <>
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
            </>
          )}
        </p>

        {/* Prev / Next */}
        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          {previous ? (
            <Link
              href={`/skills/${track}/${previous.slug}`}
              className={cn(
                "inline-flex min-h-[48px] min-w-0 items-center justify-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              )}
            >
              <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs font-normal text-slate-500 dark:text-slate-500">Предыдущая тема</span>
                <span className="block truncate">{previous.title}</span>
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/skills/${track}/${next.slug}`}
              className="inline-flex min-h-[48px] min-w-0 items-center justify-end gap-3 rounded-xl bg-sky-500 px-4 py-3 text-right text-sm font-medium text-white shadow-sm shadow-sky-500/20 transition-all hover:bg-sky-600 sm:col-start-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <span className="min-w-0">
                <span className="block text-xs font-normal text-sky-100">Следующая тема</span>
                <span className="block truncate">{next.title}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </>
  )
}