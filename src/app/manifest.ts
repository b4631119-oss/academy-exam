import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PROlab Academy Exam',
    short_name: 'Academy Exam',
    description: 'Система проведения и оценки экзаменов PROlab Academy',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc', // slate-50
    theme_color: '#0ea5e9', // sky-500
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
