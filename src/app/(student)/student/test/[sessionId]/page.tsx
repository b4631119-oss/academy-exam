"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Clock, CheckCircle2, HelpCircle, Loader2, ArrowLeft, ArrowRight, Flag } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getStudentTestQuestions, submitStudentAnswer, finishStudentTest } from "@/lib/test-actions"

interface OptionItem {
  id: string
  option_text: string
  position: number
}

interface QuestionItem {
  id: string
  question_text: string
  text?: string
  position: number
  time_limit_seconds: number
  points: number
  has_answered?: boolean
  selected_option_id?: string | null
  options: OptionItem[]
}

export default function StudentAutonomousTestPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [testTitle, setTestTitle] = useState<string>("Тест")
    const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState<number>(15)
  const [timedQuestionId, setTimedQuestionId] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const finishingRef = useRef(false)
  const selectedAnswersRef = useRef<Record<string, string>>({})

  const finishTestAtomic = useCallback(async () => {
    if (finishingRef.current) return
    finishingRef.current = true
    setFinishing(true)
    setErrorMsg("")
    try {
      await finishStudentTest(sessionId)
      router.push(`/student/test/result/${sessionId}`)
    } catch (err: unknown) {
      console.error("finishStudentTest failed:", err)
      setErrorMsg((err as Error).message || "Ошибка завершения теста")
      finishingRef.current = false
      setFinishing(false)
    }
  }, [sessionId, router])

  const advanceToNextOrFinish = useCallback(
    (nextIdx = currentIndex + 1) => {
      if (nextIdx < questions.length) {
        setCurrentIndex(nextIdx)
      } else {
        finishTestAtomic()
      }
    },
    [currentIndex, questions.length, finishTestAtomic]
  )

  const handleTimeout = useCallback(() => {
    if (finishingRef.current) return
    advanceToNextOrFinish()
  }, [advanceToNextOrFinish])

  useEffect(() => {
    let isMounted = true

    async function loadTestData() {
      setLoading(true)
      setErrorMsg("")

      try {
        const data = await getStudentTestQuestions(sessionId)

        if (!isMounted) return

        if (data.is_finished) {
          router.push(`/student/test/result/${sessionId}`)
          return
        }

        const qList: QuestionItem[] = data.questions || []
        if (qList.length === 0) {
          setErrorMsg("В этом тесте пока нет вопросов")
          setLoading(false)
          return
        }

        setTestTitle(data.test_title || "Тест")
                setQuestions(qList)

        const initialAnswers: Record<string, string> = {}
        qList.forEach((q) => {
          if (q.selected_option_id) {
            initialAnswers[q.id] = q.selected_option_id
          }
        })
        setSelectedAnswers(initialAnswers)
        selectedAnswersRef.current = initialAnswers

        const firstUnanswered = qList.findIndex((q) => !q.has_answered)
        if (firstUnanswered !== -1) {
          setCurrentIndex(firstUnanswered)
        } else {
          finishTestAtomic()
          return
        }
      } catch (err: unknown) {
        if (!isMounted) return
        setErrorMsg((err as Error).message || "Ошибка загрузки вопросов теста")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (sessionId) {
      loadTestData()
    }

    return () => {
      isMounted = false
    }
  }, [sessionId, router, finishTestAtomic])

  const currentQuestion = questions[currentIndex] || null

  const currentQuestionId = currentQuestion?.id ?? null
  if (currentQuestionId !== timedQuestionId) {
    setTimedQuestionId(currentQuestionId)
    setTimeLeft(currentQuestion?.time_limit_seconds || 15)
  }

  useEffect(() => {
    if (loading || finishing || !currentQuestion) return

    const alreadyAnswered = !!currentQuestion.has_answered || !!selectedAnswers[currentQuestion.id]
    if (alreadyAnswered) return

    if (timerRef.current) clearInterval(timerRef.current)
    let remaining = currentQuestion.time_limit_seconds || 15

    timerRef.current = setInterval(() => {
      remaining -= 1
      setTimeLeft(remaining > 0 ? remaining : 0)
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        handleTimeout()
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, finishing, currentQuestion, selectedAnswers, handleTimeout])

  const handleFinishTest = async () => {
    if (finishing || submitting) return

    const latestAnswers = selectedAnswersRef.current
    const latestQuestion = questions[currentIndex] || null

    if (latestQuestion) {
      const currentQuestionId = latestQuestion.id
      const selectedOptionId = latestAnswers[currentQuestionId] || latestQuestion.selected_option_id || null

      if (currentQuestionId && selectedOptionId) {
        setSubmitting(true)
        try {
          const result = await submitStudentAnswer(sessionId, currentQuestionId, selectedOptionId)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (result && !(result as any).already_answered) {
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === currentQuestionId ? { ...q, has_answered: true, selected_option_id: selectedOptionId } : q
              )
            )
          }
        } catch (err: unknown) {
          setSubmitting(false)
          setErrorMsg((err as Error).message || "Ошибка сохранения ответа")
          return
        }
        setSubmitting(false)
      }
    }

    await finishTestAtomic()
  }

  const handleSelectOption = async (optionId: string) => {
    if (!currentQuestion || submitting || finishing) return

    const qId = currentQuestion.id
    const alreadyAnswered = !!currentQuestion.has_answered || !!selectedAnswers[qId]
    if (alreadyAnswered) return

    setSubmitting(true)
    setErrorMsg("")

    try {
      await submitStudentAnswer(sessionId, qId, optionId)

      const updatedAnswers = { ...selectedAnswers, [qId]: optionId }
      setSelectedAnswers(updatedAnswers)
      selectedAnswersRef.current = updatedAnswers
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId ? { ...q, has_answered: true, selected_option_id: optionId } : q
        )
      )

      if (currentIndex >= questions.length - 1) {
        await finishTestAtomic()
        return
      }
      setCurrentIndex((prev) => prev + 1)
    } catch (err: unknown) {
      console.error("Answer submission error:", err)
      setErrorMsg((err as Error).message || "Ошибка сохранения ответа")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 dark:text-sky-400 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Загрузка теста...</p>
      </div>
    )
  }

  if (errorMsg && questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 fade-in">
        <Card className="p-8 text-center space-y-6 shadow-md border-amber-100 dark:border-amber-900">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{testTitle}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{errorMsg}</p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={() => router.back()} variant="outline" className="gap-2 w-full">
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (finishing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 dark:text-sky-400 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Завершение теста и подсчет результатов...</p>
      </div>
    )
  }

  const optionLetters = ["A", "B", "C", "D", "E", "F"]
  const currentAnswered = !!currentQuestion?.has_answered || !!selectedAnswers[currentQuestion?.id || ""]
  const selectedOptId = selectedAnswers[currentQuestion?.id || ""] || currentQuestion?.selected_option_id || null
      const progressPercentage = Math.round(((currentIndex + 1) / questions.length) * 100)

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in py-6 px-4">
      {/* Top Status Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
            Вопрос {currentIndex + 1} из {questions.length}
          </span>
        </div>

        {!currentAnswered && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-sm transition-colors ${
              timeLeft <= 3 ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="p-6 sm:p-8 shadow-md border-sky-100 dark:border-sky-900 space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>Баллы: {currentQuestion?.points || 20}</span>
          <span>Время: {currentQuestion?.time_limit_seconds || 15} сек</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQuestion?.question_text || currentQuestion?.text}
        </h2>
      </Card>

      {/* Feedback Alert */}
      {currentAnswered && (
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl flex items-center justify-between font-medium slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <span>Ответ сохранён</span>
          </div>
          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              variant="outline"
              className="gap-1 bg-white dark:bg-slate-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900 text-sm py-1.5 px-3"
            >
              <span>Следующий</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinishTest}
              disabled={submitting || finishing}
              className="gap-1 bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 px-3"
            >
              {submitting || finishing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Сохранение...</>
              ) : (
                <><span>Завершить тест</span><Flag className="w-4 h-4" /></>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Option Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion?.options.map((opt, idx) => {
          const letter = optionLetters[idx] || `${idx + 1}`
          const isSelected = selectedOptId === opt.id
          const isDisabled = currentAnswered || submitting || finishing

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              disabled={isDisabled}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 shadow-sm ${
                isSelected
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-950 ring-2 ring-sky-300 dark:ring-sky-700"
                  : isDisabled
                  ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-70 cursor-not-allowed"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/50 active:scale-[0.98]"
              }`}
            >
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-mono font-bold text-base transition-colors shrink-0 ${
                  isSelected ? "bg-sky-600 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {letter}
              </span>

              <span className="font-semibold text-slate-800 dark:text-slate-200 text-base sm:text-lg flex-1 leading-snug">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase option text fallback */}
                {opt.option_text || (opt as any).text}
              </span>

              {isSelected && submitting && <Loader2 className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-spin shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || submitting}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={submitting}
            className="gap-2 bg-sky-600 hover:bg-sky-700 text-white"
          >
            Далее
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinishTest}
            disabled={submitting || finishing}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Завершить тест
            <Flag className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
