import Link from "next/link"
import { BookOpen, LogIn } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { PublicHeader } from "@/components/PublicHeader"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PROlab Academy",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://prolab-academy.site",
    description: "Образовательная платформа для изучения основ веб-разработки и проведения экзаменов.",
  }

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <div className="max-w-2xl mx-auto text-center space-y-6 fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              PROlab Academy
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
              Изучай IT и развивай практические навыки
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 max-w-xl mx-auto slide-up">
            <Link href="/skills" className="group">
              <Card className="h-full flex flex-col items-center gap-3 p-7 text-center transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-lg hover:shadow-sky-50 dark:hover:shadow-sky-950/50">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 transition-colors group-hover:bg-sky-50 dark:group-hover:bg-sky-950">
                  <BookOpen className="w-6 h-6 text-slate-600 dark:text-slate-400 transition-colors group-hover:text-sky-500 dark:group-hover:text-sky-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Обучение</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">HTML и CSS — основы веб-разработки</p>
                </div>
              </Card>
            </Link>

            <Link href="/login" className="group">
              <Card className="h-full flex flex-col items-center gap-3 p-7 text-center transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-lg hover:shadow-sky-50 dark:hover:shadow-sky-950/50">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 transition-colors group-hover:bg-sky-50 dark:group-hover:bg-sky-950">
                  <LogIn className="w-6 h-6 text-slate-600 dark:text-slate-400 transition-colors group-hover:text-sky-500 dark:group-hover:text-sky-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Войти</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Для преподавателей и студентов</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          PROlab Academy
        </div>
      </footer>
    </>
  )
}
