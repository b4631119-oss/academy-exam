import { MetadataRoute } from "next"
import { getAllLessonParams, TRACK_ORDER, isCanonicalTrack } from "@/lib/skills/catalog"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prolab-academy.site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lessons = getAllLessonParams()
  const tracks = TRACK_ORDER.filter((t) => isCanonicalTrack(t))

  const trackUrls = tracks.map((track) => ({
    url: `${SITE_URL}/skills/${track}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const lessonUrls = lessons.map((lesson) => ({
    url: `${SITE_URL}/skills/${lesson.track}/${lesson.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...trackUrls,
    ...lessonUrls,
  ]
}
