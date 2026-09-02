import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  getLessonsByTrack,
  isTrackId,
  TRACKS,
  type TrackId,
} from "@/lib/skills/catalog"
import { JsonLd } from "@/components/JsonLd"
import { trackKeywords, getTrackTitle, getTrackDescription, commonKeywords } from "@/lib/seo/keywords"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prolab-academy.site"

const TRACK_LESSON_COUNT: Record<TrackId, number> = {
  html: 21,
  css: 30,
  js: 109,
}

type PageProps = {
  params: Promise<{ track: string }>
}

export function generateStaticParams() {
  return (Object.keys(TRACKS) as TrackId[]).map((track) => ({ track }))
}

export async function generateMetadata({ params }: PageProps) {
  const { track } = await params
  if (!isTrackId(track)) return {}

  const titles = getTrackTitle(track)
  const descriptions = getTrackDescription(track)
  const url = `${SITE_URL}/skills/${track}`

  return {
    title: `${titles.ru} — ${track === "js" ? "109 уроков" : `${TRACK_LESSON_COUNT[track]} тем`} | PROlab Academy`,
    description: `${descriptions.ru} ${descriptions.en} Start learning today.`,
    keywords: [...trackKeywords[track], ...commonKeywords.slice(0, 4)],
    openGraph: {
      title: `${titles.ru} — ${track === "js" ? "109 уроков" : `${TRACK_LESSON_COUNT[track]} тем`} | PROlab Academy`,
      description: `${descriptions.ru} ${descriptions.en}`,
      type: "website",
      url,
      siteName: "PROlab Academy",
      images: [
        {
          url: "/hero-image.png",
          width: 1200,
          height: 630,
          alt: `${titles.ru} — PROlab Academy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titles.ru} — ${track === "js" ? "109 уроков" : `${TRACK_LESSON_COUNT[track]} тем`} | PROlab Academy`,
      description: `${descriptions.ru} ${descriptions.en}`,
      images: ["/hero-image.png"],
    },
    alternates: {
      canonical: `/skills/${track}`,
    },
    robots: "index, follow",
  }
}

export default async function TrackPage({ params }: PageProps) {
  const { track } = await params
  if (!isTrackId(track)) notFound()

  const meta = TRACKS[track]
  const descriptions = getTrackDescription(track)
  const lessons = getLessonsByTrack(track)

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${meta.title} — ${meta.description}`,
    description: descriptions.ru,
    provider: {
      "@type": "EducationalOrganization",
      name: "PROlab Academy",
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${TRACK_LESSON_COUNT[track]}H`,
    },
    url: `${SITE_URL}/skills/${track}`,
    image: `${SITE_URL}/hero-image.png`,
  }

  return (
    <>
      <JsonLd data={courseJsonLd} />
      <div className="space-y-8 fade-in">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500" aria-label="Хлебные крошки">
          <Link href="/skills" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
            Обучение
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="font-medium text-slate-900 dark:text-slate-100">{meta.title}</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">{meta.title}</h1>
          <p className="text-base leading-7 text-slate-500 dark:text-slate-400">{meta.description}</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">{lessons.length} тем</p>
        </div>

        <ol className="space-y-2">
          {lessons.map((lesson, index) => (
            <li key={lesson.slug}>
              <Link
                href={`/skills/${track}/${lesson.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 min-h-[52px] transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-md hover:shadow-sky-50 dark:hover:shadow-sky-950/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-400 dark:text-slate-500 tabular-nums transition-colors group-hover:bg-sky-50 dark:group-hover:bg-sky-950 group-hover:text-sky-500 dark:group-hover:text-sky-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 truncate">{lesson.summary}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-sky-400 dark:group-hover:text-sky-500" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}