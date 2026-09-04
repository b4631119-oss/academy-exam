import { toolsLessons } from "./content/tools-lessons"
import { htmlLessons } from "./content/html-lessons"
import { cssLessons } from "./content/css-lessons"
import { jsCoreLessons } from "./content/js-core-lessons"
import { domBasicsLessons } from "./content/dom-basics-lessons"
import { jsIntermediateLessons } from "./content/js-intermediate-lessons"
import { jsAsyncLessons } from "./content/js-async-lessons"
import { domAdvancedLessons } from "./content/dom-advanced-lessons"
import { jsAdvancedLessons } from "./content/js-advanced-lessons"

export const COURSE_SOURCE = ""

/**
 * Track identifiers.
 *
 * The catalog follows the Knowledge Map v3 stage order:
 *   Tools → HTML → CSS → JS Core → DOM Basics → JS Intermediate →
 *   JS Async → DOM Advanced → JS Advanced (optional).
 *
 * "js" and "dom" are LEGACY aggregate ids used by the old merged courses.
 * They are not part of the mandatory path: pages keep them only to redirect
 * to the corresponding first stage (js → js-core, dom → dom-basics).
 */
export type TrackId =
  | "html"
  | "css"
  | "js"
  | "dom"
  | "tools"
  | "js-core"
  | "dom-basics"
  | "js-intermediate"
  | "js-async"
  | "dom-advanced"
  | "js-advanced"

export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "note"; text: string }

export type Example = {
  level: string
  code: string
  explanation: string
}

export type CommonMistake = {
  wrong: string
  why: string
  right: string
}

export type ExternalSource = {
  title: string
  url: string
}

export type NewLesson = {
  slug: string
  track: TrackId
  order: number
  title: string
  summary: string
  level: string
  prerequisites: string[]
  learningObjective: string
  shortExplanation: string
  detailedExplanation: string
  mentalModel?: string
  examples?: Example[]
  commonMistakes?: CommonMistake[]
  importantToRemember?: string[]
  connection?: { back: string; forward: string }
  sources?: ExternalSource[]
}

export type Lesson = {
  slug: string
  track: TrackId
  order: number
  title: string
  summary: string
  sourceTitle?: string
  blocks?: ContentBlock[]
  level?: string
  prerequisites?: string[]
  learningObjective?: string
  shortExplanation?: string
  detailedExplanation?: string
  mentalModel?: string
  examples?: Example[]
  commonMistakes?: CommonMistake[]
  importantToRemember?: string[]
  connection?: { back: string; forward: string }
  sources?: ExternalSource[]
}

export type TrackMeta = {
  id: TrackId
  title: string
  description: string
  optional?: boolean
}

/** Canonical stage order — the Knowledge Map mandatory path. */
export const TRACK_ORDER: TrackId[] = [
  "tools",
  "html",
  "css",
  "js-core",
  "dom-basics",
  "js-intermediate",
  "js-async",
  "dom-advanced",
  "js-advanced",
]

/** Stages marked as optional / not part of the mandatory path. */
export const OPTIONAL_TRACKS: TrackId[] = ["js-advanced"]

/** Legacy aggregate course ids → canonical first stage. */
export const LEGACY_TRACK_REDIRECT: Record<string, TrackId> = {
  js: "js-core",
  dom: "dom-basics",
}

export const TRACKS: Record<TrackId, TrackMeta> = {
  tools: {
    id: "tools",
    title: "Инструменты",
    description: "Терминал, Git, npm и инструменты разработчика",
  },
  html: {
    id: "html",
    title: "HTML",
    description: "Основы HTML и структура веб-страницы",
  },
  css: {
    id: "css",
    title: "CSS",
    description: "Стилизация и оформление веб-страниц",
  },
  "js-core": {
    id: "js-core",
    title: "JS Core",
    description: "Основы языка: переменные, типы, функции, массивы, объекты",
  },
  "dom-basics": {
    id: "dom-basics",
    title: "DOM Basics",
    description:
      "DOM-дерево, поиск элементов, навигация и изменение страницы",
  },
  "js-intermediate": {
    id: "js-intermediate",
    title: "JS Intermediate",
    description: "Области видимости, замыкания, this, классы, прототипы",
  },
  "js-async": {
    id: "js-async",
    title: "JS Async",
    description: "Промисы, async/await, таймеры и Fetch API",
  },
  "dom-advanced": {
    id: "dom-advanced",
    title: "DOM Advanced",
    description: "События, делегирование, формы и браузерные API",
  },
  "js-advanced": {
    id: "js-advanced",
    title: "JS Advanced",
    description:
      "Дополнительный курс для углубления: Proxy, генераторы, память, продвинутые темы",
    optional: true,
  },
  // Legacy aliases — only used for redirects.
  js: {
    id: "js",
    title: "JavaScript",
    description: "Полный курс JavaScript (объединяет все JS-ступени)",
  },
  dom: {
    id: "dom",
    title: "DOM и браузер",
    description: "Полный курс DOM (объединяет Basics и Advanced)",
  },
}

const lessons = [
  ...toolsLessons,
  ...htmlLessons,
  ...cssLessons,
  ...jsCoreLessons,
  ...domBasicsLessons,
  ...jsIntermediateLessons,
  ...jsAsyncLessons,
  ...domAdvancedLessons,
  ...jsAdvancedLessons,
] as unknown as Lesson[]

export function isTrackId(value: string): value is TrackId {
  return Object.prototype.hasOwnProperty.call(TRACKS, value)
}

export function isCanonicalTrack(track: TrackId): boolean {
  return TRACK_ORDER.includes(track)
}

export function isOptionalTrack(track: TrackId): boolean {
  return OPTIONAL_TRACKS.includes(track)
}

export function getLessonsByTrack(track: TrackId): Lesson[] {
  return lessons
    .filter((lesson) => lesson.track === track)
    .sort((a, b) => a.order - b.order)
}

export function getLesson(track: TrackId, slug: string): Lesson | undefined {
  return lessons.find(
    (lesson) => lesson.track === track && lesson.slug === slug,
  )
}

export function findLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug)
}

/**
 * Knowledge-Map path adjacency.
 *
 * The mandatory path is a single chain across canonical stages
 * (tools → html → css → js-core → dom-basics → js-intermediate →
 * js-async → dom-advanced). The optional stage (js-advanced) keeps its
 * own internal adjacency so it never looks like a required continuation.
 */
export function getAdjacentLessons(track: TrackId, slug: string) {
  const inOptional = isOptionalTrack(track)

  if (inOptional) {
    const list = getLessonsByTrack(track)
    const index = list.findIndex((lesson) => lesson.slug === slug)
    return {
      previous: index > 0 ? list[index - 1] : undefined,
      next: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
    }
  }

  const pathTracks = TRACK_ORDER.filter((id) => !isOptionalTrack(id))
  const chain: Lesson[] = pathTracks.flatMap((id) => getLessonsByTrack(id))
  const index = chain.findIndex((lesson) => lesson.slug === slug)
  if (index < 0) {
    return { previous: undefined, next: undefined }
  }
  return {
    previous: index > 0 ? chain[index - 1] : undefined,
    next: index >= 0 && index < chain.length - 1 ? chain[index + 1] : undefined,
  }
}

export function getAllLessonParams() {
  return lessons.map((lesson) => ({
    track: lesson.track,
    slug: lesson.slug,
  }))
}
