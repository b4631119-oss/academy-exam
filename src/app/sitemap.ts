import { MetadataRoute } from 'next'
import { getAllLessonParams, isTrackId, TRACKS, type TrackId } from '@/lib/skills/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teacher/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/student/enter`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // Add track pages
  const trackIds = Object.keys(TRACKS) as TrackId[]
  for (const trackId of trackIds) {
    entries.push({
      url: `${baseUrl}/skills/${trackId}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  // Add individual lesson pages
  const allLessons = getAllLessonParams()
  for (const { track, slug } of allLessons) {
    if (!isTrackId(track)) continue
    entries.push({
      url: `${baseUrl}/skills/${track}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    })
  }

  return entries
}
