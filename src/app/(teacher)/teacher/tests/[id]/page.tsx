"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Save, CheckCircle2, Clock, Award, HelpCircle, Play, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import TestStatusBadge from "@/components/ui/TestStatusBadge"
import { getTest, getTestQuestions, saveTestQuestions, createTestSession } from "@/lib/test-actions"
import { friendlyError } from "@/lib/error-messages"

interface OptionItem {
  id?: string
  text: string
  position: number
  is_correct: boolean
}

interface QuestionItem {
  id?: string
  text: string
  position: number
  time_limit_seconds: number
  points: number
  test_options: OptionItem[]
}

const MIN_TIME_LIMIT_SECONDS = 5
const MAX_TIME_LIMIT_SECONDS = 300
const MIN_POINTS = 5
const MAX_POINTS = 100

// Per-question inline validation errors
function validateQuestions(list: QuestionItem[]): Record<number, string[]> {
  const result: Record<number, string[]> = {}
  list.forEach((q, i) => {
    const errs: string[] = []
    if (!q.text.trim()) errs.push("Введите текст вопроса")

    const opts = q.test_options || []
    if (opts.length < 2) errs.push("Добавьте минимум 2 варианта")
    opts.forEach((o, idx) => {
      if (!o.text.trim()) errs.push(`Введите вариант ответа (${String.fromCharCode(65 + idx)})`)
    })

    const correctCount = opts.filter((o) => o.is_correct).length
    if (correctCount === 0) errs.push("Выберите правильный вариант")
    if (correctCount > 1) errs.push("Выберите только один правильный вариант")

    const timeLimit = Number(q.time_limit_seconds)
    if (isNaN(timeLimit) || timeLimit < MIN_TIME_LIMIT_SECONDS || timeLimit > MAX_TIME_LIMIT_SECONDS) {
      errs.push(`Время на вопрос должно быть от ${MIN_TIME_LIMIT_SECONDS} до ${MAX_TIME_LIMIT_SECONDS} секунд`)
    }

    const pts = Number(q.points)
    if (isNaN(pts) || pts < MIN_POINTS || pts > MAX_POINTS) {
      errs.push(`Баллы за вопрос должны быть от ${MIN_POINTS} до ${MAX_POINTS}`)
    }

    if (errs.length) result[i] = errs
  })
  return result
}

export default function TestConstructorPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [launching, setLaunching] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const testData = await getTest(testId)
        if (!testData) {
          setError("Тест не найден")
          return
        }
        setTest(testData)
        setTitle(testData.title || "")
        setDescription(testData.description || "")

        const qData = await getTestQuestions(testId)
        if (qData && qData.length > 0) {
          setQuestions(
            qData.map((q: any) => ({
              id: q.id,
              text: q.question_text || q.text || "",
              position: q.position || 1,
              time_limit_seconds: q.time_limit_seconds ?? 15,
              points: q.points ?? 20,
              test_options: (q.test_options || []).map((opt: any) => ({
                id: opt.id,
                text: opt.option_text || opt.text || "",
                position: opt.position || 1,
                is_correct: !!opt.is_correct
              }))
            }))
          )
        } else {
          // Initialize with 1 default question
          setQuestions([createBlankQuestion(1)])
        }
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки теста")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [testId])

  function createBlankQuestion(pos: number): QuestionItem {
    return {
      text: "",
      position: pos,
      time_limit_seconds: 60, // default 1 minute
      points: 20,
      test_options: [
        { text: "", position: 1, is_correct: true },
        { text: "", position: 2, is_correct: false },
        { text: "", position: 3, is_correct: false },
        { text: "", position: 4, is_correct: false }
      ]
    }
  }

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createBlankQuestion(prev.length + 1)])
  }

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert("Тест должен содержать хотя бы один вопрос")
      return
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const clearQuestionErrors = (index: number) => {
    setValidationErrors((prev) => {
      if (!prev[index]) return prev
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  const handleQuestionChange = (index: number, field: keyof QuestionItem, value: any) => {
    clearQuestionErrors(index)
    setQuestions((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleAddOption = (qIndex: number) => {
    clearQuestionErrors(qIndex)
    setQuestions((prev) => {
      const next = [...prev]
      const currentOpts = next[qIndex].test_options || []
      if (currentOpts.length >= 4) {
        alert("Максимальное количество вариантов: 4")
        return prev
      }
      const newOpt: OptionItem = {
        text: "",
        position: currentOpts.length + 1,
        is_correct: false
      }
      next[qIndex] = {
        ...next[qIndex],
        test_options: [...currentOpts, newOpt]
      }
      return next
    })
  }

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    clearQuestionErrors(qIndex)
    setQuestions((prev) => {
      const next = [...prev]
      const currentOpts = next[qIndex].test_options || []
      if (currentOpts.length <= 2) {
        alert("Минимальное количество вариантов: 2")
        return prev
      }
      const wasCorrect = currentOpts[optIndex].is_correct
      const filtered = currentOpts.filter((_, i) => i !== optIndex)
      
      // If deleted option was correct, set first remaining as correct
      if (wasCorrect && filtered.length > 0) {
        filtered[0].is_correct = true
      }
      
      next[qIndex] = {
        ...next[qIndex],
        test_options: filtered.map((o, idx) => ({ ...o, position: idx + 1 }))
      }
      return next
    })
  }

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    clearQuestionErrors(qIndex)
    setQuestions((prev) => {
      const next = [...prev]
      const opts = [...next[qIndex].test_options]
      opts[optIndex] = { ...opts[optIndex], text }
      next[qIndex] = { ...next[qIndex], test_options: opts }
      return next
    })
  }

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    clearQuestionErrors(qIndex)
    setQuestions((prev) => {
      const next = [...prev]
      const opts = next[qIndex].test_options.map((opt, i) => ({
        ...opt,
        is_correct: i === optIndex
      }))
      next[qIndex] = { ...next[qIndex], test_options: opts }
      return next
    })
  }

  const handleSave = async () => {
    // Inline validation: show errors next to the specific question card
    const errors = validateQuestions(questions)
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError("Исправьте ошибки в вопросах перед сохранением")
      setSuccessMsg("")
      return
    }

    setSaving(true)
    setError("")
    setSuccessMsg("")

    try {
      await saveTestQuestions(testId, title, description, questions)
      setSuccessMsg("Тест сохранён")
      setTimeout(() => setSuccessMsg(""), 4000)
    } catch (err: any) {
      setError(friendlyError(err.message || "Ошибка при сохранении теста"))
    } finally {
      setSaving(false)
    }
  }

  const handlePublishTest = async () => {
    const errors = validateQuestions(questions)
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError("Исправьте ошибки в вопросах перед публикацией теста")
      setSuccessMsg("")
      return
    }

    setLaunching(true)
    setError("")
    setSuccessMsg("")

    try {
      await saveTestQuestions(testId, title, description, questions)
      const sess = await createTestSession(testId)
      setTest((prev: any) => ({ ...prev, status: "running" }))
      setSuccessMsg("Тест успешно опубликован и открыт для учеников!")
      setTimeout(() => setSuccessMsg(""), 5000)
      
      if (sess?.id) {
        // Option to directly navigate to results page
        router.push(`/teacher/tests/${testId}/results/${sess.id}`)
      }
    } catch (err: any) {
      setError(friendlyError(err.message || "Ошибка при публикации теста"))
    } finally {
      setLaunching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-slate-500 font-medium">Загрузка конструктора теста...</p>
      </div>
    )
  }

  if (error && !test) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <Button onClick={() => router.back()}>Назад</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href={test?.room_id ? `/teacher/rooms/${test.room_id}` : "/teacher/dashboard"}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Вернуться к аудитории
        </Link>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <TestStatusBadge status={test?.status} />
          <Button onClick={handleSave} disabled={saving || launching} variant="outline" className="gap-2 flex-1 sm:flex-initial">
            <Save className="w-4 h-4" />
            {saving ? "Сохраняю..." : "Сохранить"}
          </Button>
          <Button onClick={handlePublishTest} disabled={saving || launching} className="gap-2 bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial">
            <Play className="w-4 h-4 fill-white" />
            {launching ? "Публикация..." : "Опубликовать тест"}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 font-medium slide-up">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium slide-up">
          ⚠️ {error}
        </div>
      )}

      {/* Test Meta Info Card */}
      <Card className="p-6 md:p-8 shadow-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-title" className="text-base font-semibold">Название теста</Label>
          <Input
            id="test-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название теста..."
            className="text-lg font-medium"
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-desc">Описание теста</Label>
          <textarea
            id="test-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите короткое описание..."
            rows={2}
            maxLength={1000}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-slate-800 text-sm"
          />
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-500" />
            Вопросы теста ({questions.length})
          </h2>
        </div>

        {questions.map((q, qIdx) => {
          const hasQErrors = !!validationErrors[qIdx]?.length
          return (
          <Card key={q.id || `q-${qIdx}`} className={`p-6 md:p-8 shadow-sm space-y-6 relative border-slate-200 hover:border-slate-300 transition-colors ${hasQErrors ? "border-red-300 ring-1 ring-red-200" : ""}`}>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-semibold text-slate-700 text-lg">
                Вопрос {qIdx + 1}
              </span>
              <button
                onClick={() => handleRemoveQuestion(qIdx)}
                className="text-slate-400 hover:text-red-600 transition-colors p-2.5 rounded-lg hover:bg-red-50 flex items-center gap-1.5 text-xs font-medium"
                title="Удалить вопрос"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Удалить вопрос</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <Label>Текст вопроса *</Label>
              <textarea
                value={q.text}
                onChange={(e) => handleQuestionChange(qIdx, "text", e.target.value)}
                placeholder="Введите вопрос здесь..."
                rows={2}
                maxLength={500}
                className={`w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-slate-900 font-medium ${
                  hasQErrors && !q.text.trim() ? "border-red-300" : "border-slate-200"
                }`}
              />
            </div>

            {/* Inline validation errors for this question */}
            {hasQErrors && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm space-y-1">
                {validationErrors[qIdx].map((e, i) => (
                  <p key={i}>• {e}</p>
                ))}
              </div>
            )}

            {/* Settings: Time & Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  Время на вопрос (секунды)
                </Label>
                <Input
                  type="number"
                  min={MIN_TIME_LIMIT_SECONDS}
                  max={MAX_TIME_LIMIT_SECONDS}
                  step={1}
                  value={q.time_limit_seconds}
                  onChange={(e) => handleQuestionChange(qIdx, "time_limit_seconds", Number(e.target.value))}
                  className="bg-white"
                />
                <p className="text-[11px] text-slate-400">
                  От 5 до 300 секунд
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Баллы
                </Label>
                <Input
                  type="number"
                  min={MIN_POINTS}
                  max={MAX_POINTS}
                  step={1}
                  value={q.points}
                  onChange={(e) => handleQuestionChange(qIdx, "points", Number(e.target.value))}
                  className="bg-white"
                />
                <p className="text-[11px] text-slate-400">
                  От 5 до 100 баллов
                </p>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {hasQErrors && validationErrors[qIdx].some((e) => e.includes("правильный вариант")) && (
                <p className="text-xs text-red-600 font-medium">
                  {validationErrors[qIdx].find((e) => e.includes("правильный вариант"))}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-medium">Варианты ответа (от 2 до 4):</Label>
                {q.test_options.length < 4 && (
                  <button
                    onClick={() => handleAddOption(qIdx)}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Добавить вариант
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {q.test_options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx) // A, B, C, D
                  return (
                    <div
                      key={opt.id || `opt-${optIdx}`}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                        opt.is_correct
                          ? "bg-green-50/70 border-green-300 ring-1 ring-green-300"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                        {letter}
                      </span>

                      <Input
                        value={opt.text}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        placeholder={`Текст варианта ${letter}...`}
                        maxLength={300}
                        className={`flex-1 bg-transparent focus:border-slate-300 shadow-none text-slate-800 ${
                          hasQErrors && !opt.text.trim() ? "border-red-300" : "border-transparent"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => handleSetCorrectOption(qIdx, optIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          opt.is_correct
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          opt.is_correct ? "border-white bg-white" : "border-slate-400"
                        }`}>
                          {opt.is_correct && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
                        </span>
                        {opt.is_correct ? "Правильный" : "Выбрать"}
                      </button>

                      {q.test_options.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(qIdx, optIdx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                          title="Удалить вариант"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
          )
        })}

        {/* Add Question Button */}
        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddQuestion}
            className="w-full sm:w-auto gap-2 border-dashed border-2 border-slate-300 hover:border-sky-400 text-slate-700"
          >
            <Plus className="w-4 h-4 text-sky-500" />
            Добавить вопрос
          </Button>
        </div>
      </div>
    </div>
  )
}
