import Link from "next/link"
import {
  Terminal,
  Code2,
  Palette,
  Braces,
  Frame,
  Layers,
  Zap,
  Blocks,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Card } from "@/components/ui/Card"
import {
  getLessonsByTrack,
  TRACK_ORDER,
  TRACKS,
  isOptionalTrack,
  type TrackId,
} from "@/lib/skills/catalog"
import { JsonLd } from "@/components/JsonLd"
import { commonKeywords } from "@/lib/seo/keywords"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prolab-academy.site"

// Russian level names used on the course cards. The English term is kept in
// parentheses because it is the one used across technical literature.
const LEVEL_LABELS: Record<string, string> = {
  Foundation: "Фундамент",
  Beginner: "Начальный",
  Intermediate: "Средний",
  Advanced: "Продвинутый",
}

export const metadata = {
  title: "Курсы программирования — PROlab Academy",
  description: "Изучайте программирование с нуля: HTML, CSS, JavaScript и другие технологии. Современная образовательная платформа PROlab Academy в Оше, Кыргызстан. Programming courses, IT education. Start learning today.",
  keywords: [...commonKeywords, "курсы программирования", "IT обучение", "programming courses", "IT education"],
  openGraph: {
    title: "Курсы программирования — PROlab Academy",
    description: "Изучайте программирование с нуля: HTML, CSS, JavaScript и другие технологии. Современная образовательная платформа PROlab Academy в Оше, Кыргызстан.",
    type: "website",
    url: `${SITE_URL}/skills`,
    siteName: "PROlab Academy",
    images: [
      {
        url: "/hero-image.png",
        width: 1200,
        height: 630,
        alt: "Курсы программирования PROlab Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Курсы программирования — PROlab Academy",
    description: "Изучайте программирование с нуля: HTML, CSS, JavaScript и другие технологии.",
    images: ["/hero-image.png"],
  },
  alternates: {
    canonical: "/skills",
  },
  robots: "index, follow",
}

const TRACK_ICONS: Record<string, typeof Code2> = {
  tools: Terminal,
  html: Code2,
  css: Palette,
  "js-core": Braces,
  "dom-basics": Frame,
  "js-intermediate": Layers,
  "js-async": Zap,
  "dom-advanced": Blocks,
  "js-advanced": Sparkles,
}

const CORE_STAGES = TRACK_ORDER.filter((id) => !isOptionalTrack(id))

// Entry level of a track = level of its first lesson.
function entryLevel(trackId: TrackId): string | undefined {
  return getLessonsByTrack(trackId)[0]?.level
}

function levelLabel(level: string | undefined): string {
  return level ? LEVEL_LABELS[level] || level : ""
}

const trackMeta = TRACK_ORDER.map((id) => {
  const stageNumber = CORE_STAGES.indexOf(id) + 1
  const optional = isOptionalTrack(id)
  return {
    ...TRACKS[id],
    icon: TRACK_ICONS[id] || Code2,
    href: `/skills/${id}`,
    stageNumber,
    optional,
    levelLabel: levelLabel(entryLevel(id)),
  }
})

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: trackMeta.map((track, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Course",
      name: `${track.title} — ${TRACKS[track.id].description}`,
      url: `${SITE_URL}${track.href}`,
      provider: {
        "@type": "EducationalOrganization",
        name: "PROlab Academy",
        url: SITE_URL,
      },
    },
  })),
}

export default function SkillsPage() {
  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <div className="space-y-8 fade-in">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Обучение
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Изучай основы веб-разработки в удобном формате: от инструментов и
            HTML/CSS до JavaScript и работы с браузером.
          </p>
        </div>

        {/* Onboarding signal: where to start and the mandatory path */}
        <div className="rounded-2xl border border-sky-100 dark:border-sky-900 bg-sky-50/60 dark:bg-sky-950/40 p-5">
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-200">
            С чего начать
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
            Проходите курсы по порядку — с Этапа 1 до Этапа 8: каждый следующий
            опирается на предыдущий. Начните с курса «Инструменты».
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {CORE_STAGES.map((id, i) => (
              <Link
                key={id}
                href={`/skills/${id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-sky-600 transition-colors"
              >
                <span className="text-sky-600 dark:text-sky-400 tabular-nums">
                  {i + 1}
                </span>
                {TRACKS[id].title}
              </Link>
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
              Дополнительно · {TRACKS["js-advanced"].title}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trackMeta.map((track) => {
            const Icon = track.icon
            const count = getLessonsByTrack(track.id).length
            const optional = isOptionalTrack(track.id)
            return (
              <Link key={track.id} href={track.href} className="group">
                <Card className="h-full flex flex-col gap-4 transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-lg hover:shadow-sky-50 dark:hover:shadow-sky-950/50">
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 transition-colors group-hover:bg-sky-50 dark:group-hover:bg-sky-950">
                      <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400 transition-colors group-hover:text-sky-500 dark:group-hover:text-sky-400" />
                    </div>
                    <span
                      className={
                        optional
                          ? "rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
                          : "rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
                      }
                    >
                      {optional ? "Дополнительно" : `Этап ${track.stageNumber} из ${CORE_STAGES.length}`} · {count} тем
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{track.title}</h2>
                    </div>
                    <p className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">
                      {optional ? "Не входит в основной путь" : `Этап ${track.stageNumber} из ${CORE_STAGES.length}`}
                      {track.levelLabel ? ` · ${track.levelLabel} уровень` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{track.description}</p>
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
    </>
  )
}