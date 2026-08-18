"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Play, Copy, Check, RefreshCw, CheckCircle2, ShieldAlert, FastForward, Award, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import TestStatusBadge from "@/components/ui/TestStatusBadge"
import { getLobbyDetails, startTestSession, advanceTestQuestion } from "@/lib/test-actions"
import { friendlyError } from "@/lib/error-messages"

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatLimit(seconds: number): string {
  if (seconds % 60 === 0) return `${seconds / 60} мин`
  if (seconds < 60) return `${seconds} сек`
  return `${Math.floor(seconds / 60)} мин ${seconds % 60} сек`
}

export default function TeacherTestLobbyPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [infoMsg, setInfoMsg] = useState("")
  const [now, setNow] = useState(Date.now())
  // Tracks the last known session status so stale info messages are cleared
  const lastStatusRef = useRef<string | null>(null)

  // Local countdown for the teacher: computed from server timestamps only
  useEffect(() => {
    if (session?.status !== "running") return
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [session?.status, session?.id])

  async function loadData(silent = false) {
    if (!silent) setLoading(true)
    try {
      const data = await getLobbyDetails(testId)
      setTest(data.test)
      setSession(data.session)
      setParticipants(data.participants || [])
      // L4: only show a status message when the session state actually changed
      const status = data.session?.status || null
      if (status !== lastStatusRef.current) {
        lastStatusRef.current = status
        if (status === "running") setInfoMsg("Тест запущен")
        else if (status === "finished") setInfoMsg("Тест завершён")
        else setInfoMsg("")
      }
    } catch (err: any) {
      setError(friendlyError(err.message || "Ошибка загрузки лобби"))
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Poll participants every 3 seconds
    const interval = setInterval(() => {
      loadData(true)
    }, 3000)
    return () => clearInterval(interval)
  }, [testId])

  const copyCode = () => {
    if (!test?.rooms?.code) return
    navigator.clipboard.writeText(test.rooms.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartTest = async () => {
    if (!session?.id) return
    setStarting(true)
    setError("")
    try {
      const updated = await startTestSession(session.id)
      setSession(updated)
      lastStatusRef.current = updated.status
      setInfoMsg("Тест начат")
    } catch (err: any) {
      setError(friendlyError(err.message || "Не удалось начать тест"))
    } finally {
      setStarting(false)
    }
  }

  const handleAdvanceQuestion = async () => {
    if (!session?.id) return
    setAdvancing(true)
    setError("")
    try {
      const updated = await advanceTestQuestion(session.id)
      setSession(updated)
      lastStatusRef.current = updated.status
      if (updated.status === "finished") {
        setInfoMsg("Тест полностью завершён")
      } else {
        setInfoMsg(`Перешли к вопросу №${(updated.current_question_index || 0) + 1}`)
      }
    } catch (err: any) {
      setError(friendlyError(err.message || "Ошибка переключения вопроса"))
    } finally {
      setAdvancing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-slate-500 font-medium">Загрузка лобби...</p>
      </div>
    )
  }

  if (error && !test) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <Button onClick={() => router.back()}>Назад</Button>
      </div>
    )
  }

  const isRunning = session?.status === "running"
  const isFinished = session?.status === "finished"

  const totalQuestions = (test?.test_questions || []).length
  const currentQIndex = session?.current_question_index || 0
  const isLastQuestion = totalQuestions > 0 && currentQIndex + 1 >= totalQuestions
  const currentQuestion = (test?.test_questions || [])[currentQIndex]
  const limitSeconds = currentQuestion?.time_limit_seconds ?? 0
  const startedAt = session?.question_started_at ? new Date(session.question_started_at).getTime() : null
  const remaining = startedAt ? Math.max(0, limitSeconds - Math.floor((now - startedAt) / 1000)) : 0

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in py-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/teacher/tests/${testId}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Вернуться к тесту
        </Link>
        <button
          onClick={() => loadData(true)}
          className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
          title="Обновить"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications */}
      {infoMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 font-medium slide-up">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{infoMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium slide-up flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header Card */}
      <Card className="p-6 md:p-8 shadow-sm space-y-6 text-center">
        <div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <TestStatusBadge status={session?.status || "draft"} />
            {!isRunning && !isFinished && (
              <span className="text-xs font-medium text-slate-500">Ожидание участников</span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{test?.title}</h1>
          {test?.description && (
            <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">{test.description}</p>
          )}
        </div>

        {/* Room Code Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 inline-block mx-auto">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Код аудитории для входа
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-3xl font-extrabold tracking-widest text-sky-600">
              {test?.rooms?.code || "—"}
            </span>
            <button
              onClick={copyCode}
              className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors"
              title="Копировать код"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="pt-2">
          {!isRunning && !isFinished ? (
            <div className="space-y-3">
              <Button
                onClick={handleStartTest}
                disabled={starting || participants.length === 0}
                className="w-full sm:w-auto px-8 py-3 text-base gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                <Play className="w-5 h-5 fill-white" />
                {starting ? "Запуск..." : "Начать тест"}
              </Button>
              {participants.length === 0 && (
                <p className="text-xs text-slate-500">
                  Подключите хотя бы одного ученика, чтобы начать тест. Сейчас участников: 0.
                </p>
              )}
            </div>
          ) : isRunning ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 font-semibold text-base">
                🚀 ТЕКУЩИЙ ВОПРОС №{currentQIndex + 1}
                {totalQuestions > 0 && <> из {totalQuestions}</>}
              </div>

              {limitSeconds > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">
                    Лимит: {formatLimit(limitSeconds)}
                  </span>
                  {remaining > 0 ? (
                    <span className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 font-bold font-mono text-sm">
                      Осталось: {formatClock(remaining)}
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-bold text-sm">
                      Время вышло
                    </span>
                  )}
                </div>
              )}

              <Button
                onClick={handleAdvanceQuestion}
                disabled={advancing}
                className="w-full sm:w-auto px-8 py-3 text-base gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-md"
              >
                <FastForward className="w-5 h-5 fill-white" />
                {advancing ? "Переключение..." : isLastQuestion ? "Завершить тест" : "Следующий вопрос"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold text-lg">
                🏁 Тест полностью завершён
              </div>
              {session?.id && (
                <Link href={`/teacher/tests/${testId}/results/${session.id}`} className="inline-block">
                  <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                    <Award className="w-4 h-4" />
                    Посмотреть результаты
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Participants Card */}
      <Card className="p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-900">Подключенные участники</h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
            Участников: {participants.length}
          </span>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">Пока нет подключенных участников.</p>
            <p className="text-xs text-slate-400 mt-1">
              Ученики должны войти в комнату по коду <span className="font-mono font-bold text-slate-600">{test?.rooms?.code}</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl"
              >
                <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 animate-ping" />
                <span className="font-medium text-slate-800 text-sm truncate">{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
