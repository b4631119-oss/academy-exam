"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Clock, HelpCircle, User, LogOut, Loader2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getStudentTestSessionStatus } from "@/lib/test-actions"

function formatTimeLimit(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return "—"
  if (seconds < 60) return `${seconds} сек`
  if (seconds % 60 === 0) return `${seconds / 60} мин`
  return `${Math.floor(seconds / 60)} мин ${seconds % 60} сек`
}

export default function StudentTestWaitingRoomPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function checkStatus(isFirstLoad = false) {
      if (isFirstLoad) setLoading(true)
      try {
        const data = await getStudentTestSessionStatus(sessionId)
        setSessionData(data)

        if (data.status === "running") {
          router.push(`/student/test/${sessionId}`)
        } else if (data.status === "finished") {
          // L2: don't leave the student on a dead-end — go to the result screen
          router.push(`/student/test/result/${sessionId}`)
        }
      } catch (err: any) {
        setError(err.message || "Ошибка получения статуса теста")
      } finally {
        if (isFirstLoad) setLoading(false)
      }
    }

    checkStatus(true)

    // Poll every 2 seconds
    intervalRef.current = setInterval(() => {
      checkStatus(false)
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [sessionId, router])

  const handleExit = () => {
    router.push("/student/enter")
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-slate-500 font-medium">Подключение к комнате ожидания...</p>
      </div>
    )
  }

  if (error && !sessionData) {
    return (
      <div className="max-w-md mx-auto py-12 text-center fade-in">
        <Card className="p-8 space-y-4 shadow-sm border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Ошибка подключения</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <Button onClick={handleExit} variant="outline" className="w-full">
            Вернуться
          </Button>
        </Card>
      </div>
    )
  }

  const isFinished = sessionData?.status === "finished"

  return (
    <div className="max-w-xl mx-auto space-y-6 fade-in py-8 px-4">
      <Card className="p-8 text-center space-y-6 shadow-md border-sky-100 relative">
        {/* Header Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
            isFinished
              ? "bg-slate-100 text-slate-600"
              : "bg-amber-100 text-amber-800 animate-pulse"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {isFinished ? "Тест завершён" : "⏳ Ожидание начала теста"}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {sessionData?.title || "Интерактивный тест"}
          </h1>

          {sessionData?.description && (
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              {sessionData.description}
            </p>
          )}
        </div>

        {/* Status Message */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
          {isFinished ? (
            <p className="text-slate-700 font-medium text-base">
              Учитель завершил этот тест. Ответы больше не принимаются.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-800 font-semibold text-base">
                Учитель ещё не начал тест.
              </p>
              <p className="text-slate-500 text-xs sm:text-sm">
                Пожалуйста, подождите. Учитель запустит тест, когда все участники будут готовы.
              </p>
            </div>
          )}
        </div>

        {/* Student Profile Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-sky-50/50 py-2.5 px-4 rounded-xl border border-sky-100/60 inline-flex mx-auto">
          <User className="w-4 h-4 text-sky-600" />
          <span>Ученик:</span>
          <span className="font-semibold text-slate-900">{sessionData?.student_name}</span>
        </div>

        {/* Test Parameters Bar */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-slate-600 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
              Вопросов
            </span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">
              {sessionData?.question_count ?? 0}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Время на вопрос
            </span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">
              {formatTimeLimit(sessionData?.time_limit_seconds)}
            </span>
          </div>
        </div>

        {/* Exit Button */}
        <div className="pt-2">
          <Button
            onClick={handleExit}
            variant="outline"
            className="w-full sm:w-auto gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Выйти из теста
          </Button>
        </div>
      </Card>
    </div>
  )
}
