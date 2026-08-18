"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Clock, CheckCircle2, AlertCircle, HelpCircle, Loader2, RefreshCw, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getCurrentTestQuestionAction, submitTestAnswerAction, getStudentTestSessionStatus } from "@/lib/test-actions"

interface OptionItem {
  id: string
  option_text: string
  position: number
}

interface QuestionData {
  participant_id: string
  question_id: string
  question_text: string
  position: number
  total_questions: number
  time_limit_seconds: number
  points: number
  question_started_at?: string
  has_answered?: boolean
  selected_option_id?: string | null
  options: OptionItem[]
}

export default function StudentLiveQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [timeExceeded, setTimeExceeded] = useState(false)

  const [timeLeft, setTimeLeft] = useState<number>(15)
  const [errorCode, setErrorCode] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string>("")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const currentQIdRef = useRef<string | null>(null)
  // Question id for which a submit is currently in flight (or was last sent)
  const submittedQIdRef = useRef<string | null>(null)

  async function loadQuestion(isInitial = false) {
    if (isInitial) setLoading(true)
    setErrorCode("")
    setErrorMsg("")

    try {
      // 1. Check if session is finished
      const statusData = await getStudentTestSessionStatus(sessionId)
      if (statusData.status === "finished") {
        router.push(`/student/test/result/${sessionId}`)
        return
      }

      // 2. Load current question
      const data: QuestionData = await getCurrentTestQuestionAction(sessionId)

      // If transition to new question occurred: reset stale per-question state
      if (currentQIdRef.current && currentQIdRef.current !== data.question_id) {
        setHasAnswered(data.has_answered || false)
        setSelectedOptionId(data.selected_option_id || null)
        setTimeExceeded(false)
        // Any in-flight submit belongs to the previous question — it must be ignored
        submittedQIdRef.current = null
      } else if (data.has_answered) {
        setHasAnswered(true)
        setSelectedOptionId(data.selected_option_id || null)
      }

      currentQIdRef.current = data.question_id
      setQuestionData(data)

      // Calculate initial countdown
      const timeLimit = data.time_limit_seconds || 15
      let initialLeft = timeLimit

      if (data.question_started_at) {
        const elapsed = Math.floor((Date.now() - new Date(data.question_started_at).getTime()) / 1000)
        initialLeft = Math.max(0, timeLimit - elapsed)
      }

      setTimeLeft(initialLeft)
      if (initialLeft === 0 && !data.has_answered) {
        setTimeExceeded(true)
      }
    } catch (err: any) {
      const msg = err.message || ""
      if (msg === "INVALID_PARTICIPANT_OR_SESSION") {
        router.push("/student/enter")
        return
      }
      setErrorCode(msg)
      setErrorMsg(
        msg === "CURRENT_QUESTION_NOT_FOUND_OR_NOT_STARTED"
          ? "Учитель ещё не начал этот вопрос."
          : msg === "QUESTION_TIME_EXCEEDED"
          ? "Время этого вопроса истекло."
          : msg
      )
    } finally {
      if (isInitial) setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestion(true)

    // Poll every 2 seconds for new question or test finish
    pollRef.current = setInterval(() => {
      loadQuestion(false)
    }, 2000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [sessionId])

  // Countdown timer effect
  useEffect(() => {
    if (loading || hasAnswered || timeExceeded || !questionData) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setTimeExceeded(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, hasAnswered, timeExceeded, questionData])

  const handleSelectOption = async (optionId: string) => {
    if (hasAnswered || submitting || timeExceeded || !questionData) return

    const targetQuestionId = questionData.question_id
    submittedQIdRef.current = targetQuestionId

    setSelectedOptionId(optionId)
    setSubmitting(true)
    setErrorMsg("")

    try {
      const res = await submitTestAnswerAction(
        questionData.participant_id,
        targetQuestionId,
        optionId
      )

      // M3: if the question changed while this request was in flight,
      // ignore the stale response — never mark the NEW question as answered
      if (submittedQIdRef.current !== currentQIdRef.current) return

      if (res && res.success) {
        setHasAnswered(true)
      }
    } catch (err: any) {
      if (submittedQIdRef.current !== currentQIdRef.current) return
      if (err.message === "QUESTION_TIME_EXCEEDED") {
        setTimeExceeded(true)
        setErrorMsg("Время этого вопроса истекло.")
      } else {
        setErrorMsg(err.message || "Ошибка отправки ответа")
        setSelectedOptionId(null)
      }
    } finally {
      setSubmitting(false)
      submittedQIdRef.current = null
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-slate-500 font-medium">Загрузка вопроса...</p>
      </div>
    )
  }

  if (errorCode && !questionData) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 fade-in">
        <Card className="p-8 text-center space-y-6 shadow-md border-amber-100">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ожидание вопроса</h2>
            <p className="text-sm text-slate-600">{errorMsg}</p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={() => loadQuestion(true)} className="gap-2 w-full">
              <RefreshCw className="w-4 h-4" />
              Обновить
            </Button>
            <Button onClick={() => router.push("/student/enter")} variant="outline" className="gap-2 w-full">
              <ArrowLeft className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const optionLetters = ["A", "B", "C", "D"]
  const timerPercentage = questionData ? Math.max(0, (timeLeft / questionData.time_limit_seconds) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in py-6 px-4">
      {/* Top Status Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
          <span className="font-semibold text-slate-800 text-sm sm:text-base">
            Вопрос {questionData?.position} из {questionData?.total_questions}
          </span>
        </div>

        {/* Timer Bar */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-sm transition-colors ${
          timeLeft <= 3 ? "bg-red-100 text-red-700 animate-pulse" : "bg-slate-100 text-slate-700"
        }`}>
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            timeLeft <= 3 ? "bg-red-500" : "bg-sky-500"
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Question Text Card */}
      <Card className="p-6 sm:p-8 shadow-md border-sky-100 space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          {questionData?.question_text}
        </h2>
      </Card>

      {/* State Feedback Messages */}
      {hasAnswered && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center justify-between font-medium slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>Ответ принят. Ожидаем завершения вопроса...</span>
          </div>
        </div>
      )}

      {timeExceeded && !hasAnswered && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 font-medium slide-up">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>Время этого вопроса истекло.</span>
        </div>
      )}

      {errorMsg && !timeExceeded && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium slide-up">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Option Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {questionData?.options.map((opt, idx) => {
          const letter = optionLetters[idx] || `${idx + 1}`
          const isSelected = selectedOptionId === opt.id
          const isDisabled = hasAnswered || timeExceeded || submitting

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              disabled={isDisabled}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 shadow-sm ${
                isSelected
                  ? "border-sky-500 bg-sky-50 ring-2 ring-sky-300"
                  : isDisabled
                  ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                  : "border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/50 active:scale-[0.98]"
              }`}
            >
              <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-mono font-bold text-base transition-colors shrink-0 ${
                isSelected
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700"
              }`}>
                {letter}
              </span>

              <span className="font-semibold text-slate-800 text-base sm:text-lg flex-1 leading-snug">
                {opt.option_text}
              </span>

              {isSelected && submitting && (
                <Loader2 className="w-5 h-5 text-sky-600 animate-spin shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
