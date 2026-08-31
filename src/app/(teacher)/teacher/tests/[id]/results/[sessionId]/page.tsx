"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Trophy, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getTestSessionResults } from "@/lib/test-actions"
import { friendlyError } from "@/lib/error-messages"

export default function TeacherTestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string
  const sessionId = params.sessionId as string

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase session results data
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await getTestSessionResults(sessionId)
        setData(res)
      } catch (err: unknown) {
        setError(friendlyError((err as Error).message || "Ошибка загрузки результатов"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-slate-500 font-medium">Загрузка результатов...</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <Button onClick={() => router.back()}>Назад</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in py-6 px-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/teacher/tests/${testId}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Вернуться к тесту
        </Link>
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
          Максимум: {data?.max_points ?? 0} б.
        </span>
      </div>

      <Card className="p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{data?.title}</h1>
            <p className="text-slate-500 text-sm">
              Результаты теста ({data?.results?.length ?? 0} участников)
            </p>
          </div>
        </div>

        {data?.results?.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-1">
            <p>У этого теста пока нет ответов.</p>
            {data?.total_participants > 0 && (
              <p className="text-xs text-slate-400">
                Подключено участников: {data.total_participants}, но ответов пока нет.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase result row */}
            {data?.results?.map((r: any, i: number) => (
              <div
                key={r.student_id}
                className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-200 text-slate-700 font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{r.name}</p>
                  <p className="text-xs text-slate-500">
                    <CheckCircle2 className="inline w-3.5 h-3.5 text-green-500 mr-1" />
                    Верных: {r.total_correct}/{r.total_questions} · Отвечено: {r.total_answered}/{r.total_questions}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-slate-900">
                    {r.total_points} / {r.max_points} б.
                  </p>
                  <p className="text-sm font-bold text-purple-600">{r.percentage}%</p>
                </div>
              </div>
            ))}

            {data?.total_participants > data?.results?.length && (
              <p className="text-xs text-slate-400 pt-2">
                Ответили {data.results.length} из {data.total_participants} участников.
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
