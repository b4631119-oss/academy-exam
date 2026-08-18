"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Award, CheckCircle2, HelpCircle, User, ArrowLeft, Loader2, Trophy } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getMyTestResultAction } from "@/lib/test-actions"

export default function StudentTestResultPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadResult() {
      try {
        const data = await getMyTestResultAction(sessionId)
        setResult(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки результатов теста")
      } finally {
        setLoading(false)
      }
    }
    loadResult()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-slate-500 font-medium">Подсчет результатов теста...</p>
      </div>
    )
  }

  if (error && !result) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 fade-in text-center">
        <Card className="p-8 space-y-4 shadow-sm border-red-100">
          <p className="text-red-500 font-medium">{error}</p>
          <Button onClick={() => router.push("/student/enter")}>На главную</Button>
        </Card>
      </div>
    )
  }

  const percentage = result?.percentage ?? 0

  return (
    <div className="max-w-xl mx-auto space-y-6 fade-in py-8 px-4">
      <Card className="p-8 text-center space-y-6 shadow-lg border-sky-100 relative overflow-hidden">
        {/* Header Icon & Title */}
        <div>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-sky-100 text-sky-600">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 mb-2">
            🏁 Тест завершён
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {result?.test_title || "Результаты теста"}
          </h1>

          {result?.test_description && (
            <p className="text-slate-500 text-sm mt-1">{result.test_description}</p>
          )}
        </div>

        {/* Big Percentage Card */}
        <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 border border-slate-200/80 rounded-2xl p-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Результат
          </p>
          <div className="text-5xl font-black tracking-tight text-sky-600 my-1">
            {percentage}%
          </div>
          <p className="text-sm font-medium text-slate-600">Тест завершён</p>
          <p className="text-xs text-slate-400 mt-1">Результат: {percentage}%</p>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-6">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Баллы
            </span>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {result?.total_points} / {result?.max_points}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Верных
            </span>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {result?.total_correct} / {result?.total_questions}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
              Отвечено
            </span>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {result?.total_answered} / {result?.total_questions}
            </p>
          </div>
        </div>

        {/* Student Profile Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-100/70 py-2 px-4 rounded-xl inline-flex mx-auto">
          <User className="w-4 h-4 text-slate-500" />
          <span>Ученик:</span>
          <span className="font-semibold text-slate-900">{result?.student_name}</span>
        </div>

        {/* Back Button */}
        <div className="pt-2">
          <Button
            onClick={() => router.push("/student/enter")}
            className="w-full sm:w-auto px-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться на главную
          </Button>
        </div>
      </Card>
    </div>
  )
}
