import { lessons as allLessons, source as COURSE_SOURCE } from "./content"
import { jsLessons } from "./content/js-lessons-data"
import { domLessons } from "./content/dom-lessons-data"

export type TrackId = "html" | "css" | "js" | "dom"

export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "note"; text: string }

export type Lesson = {
  slug: string
  track: TrackId
  order: number
  title: string
  summary: string
  sourceTitle: string
  blocks: ContentBlock[]
}

export const TRACKS: Record<
  TrackId,
  { id: TrackId; title: string; description: string }
> = {
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
  js: {
    id: "js",
    title: "JavaScript",
    description: "Основы языка программирования для веба",
  },
  dom: {
    id: "dom",
    title: "DOM и браузер",
    description:
      "Изучите взаимодействие с веб-страницей: DOM-дерево, события, стили, формы, загрузка документов.",
  },
}

export { COURSE_SOURCE }

const lessons = [
  ...(allLessons as Lesson[]),
  ...jsLessons,
  ...domLessons,
] as Lesson[]

export function isTrackId(value: string): value is TrackId {
  return (
    value === "html" || value === "css" || value === "js" || value === "dom"
  )
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

export function getAdjacentLessons(track: TrackId, slug: string) {
  const list = getLessonsByTrack(track)
  const index = list.findIndex((lesson) => lesson.slug === slug)
  return {
    previous: index > 0 ? list[index - 1] : undefined,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
  }
}

export function getAllLessonParams() {
  return lessons.map((lesson) => ({
    track: lesson.track,
    slug: lesson.slug,
  }))
}
