"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getStudent, getQuestions, getExam, saveAnswer, getStudentAnswersForExam, completeExam, saveAllAnswers } from "@/lib/actions"
import { initAntiCheat } from "@/lib/anti-cheat"
import { t } from "@/lib/translations"
import { toast } from "sonner"

export default function TakeExam() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [student, setStudent] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [exam, setExam] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const answersRef = useRef<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    const cleanupAntiCheat = initAntiCheat(async (reason) => {
      console.warn("Anti-cheat violation:", reason);
      toast.error(`⚠️ Нарушение правил: ${reason}. Экзамен будет завершён.`);

      // Auto-finish exam on violation
      try {
        const currentStudent = await getStudent();
        if (currentStudent?.id) {
          await completeExam(currentStudent.id);
          router.push(`/student/result/${examId}`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    async function loadData() {
      try {
        const studentData = await getStudent()
        if (!studentData) {
          router.push("/student/enter")
          return
        }
        setStudent(studentData)

        // Get Exam info via server action (uses admin client, bypasses RLS)
        const examData = await getExam(examId)
        if (examData) setExam(examData)

        // Get questions via server action (uses admin client, bypasses RLS)
        const qData = await getQuestions(examId)
        setQuestions(qData || [])

        // Initialize answers state if needed
        const studentAnswers = await getStudentAnswersForExam(studentData.id, examId);
        if (studentAnswers && studentAnswers.length > 0) {
          const loadedAnswers: Record<string, string> = {}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
          studentAnswers.forEach((item: any) => {
            if (item.answer) {
              loadedAnswers[item.question.id] = item.answer.answer_text || "";
            }
          })
          answersRef.current = loadedAnswers
          setAnswers(loadedAnswers)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    return () => {
      cleanupAntiCheat?.();
    }
  }, [examId, router])

  const handleAnswerChange = (questionId: string, text: string) => {
    answersRef.current = { ...answersRef.current, [questionId]: text }
    setAnswers(prev => ({ ...prev, [questionId]: text }))
  }

  const handleNext = async () => {
    const currentQ = questions[currentIndex]
    const answerText = answersRef.current[currentQ.id] || ""

    if (currentIndex === questions.length - 1) {
      const updatedAnswers: Record<string, string> = { ...answers, [currentQ.id]: answerText }
      let emptyCount = 0
      for (const q of questions) {
        const qId = String(q.id)
        if (!updatedAnswers[qId] || updatedAnswers[qId].trim() === "") {
          emptyCount++
        }
      }

      if (emptyCount > 0) {
        const confirmed = window.confirm(t.unansweredWarning.replace('{count}', String(emptyCount)))
        if (!confirmed) {
          return
        }
      }
    }

    setSaving(true)
    setSaveError("")
    try {
      if (currentIndex < questions.length - 1) {
        // Navigate immediately, save best-effort
        setCurrentIndex(currentIndex + 1)
        await saveAnswer(student.id, currentQ.id, answerText)
      } else {
        // Save all answers just to be sure, then finish
        await saveAllAnswers(student.id, { ...answersRef.current, [currentQ.id]: answerText })
        await completeExam(student.id)
        router.push(`/student/result/${examId}`)
      }
    } catch (err: unknown) {
      console.error(err)
      setSaveError((err as Error).message || t.saveError)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t.loadingExam}</div>
  }

  if (questions.length === 0) {
    return <div className="text-center py-20 text-red-500">{t.noQuestions}</div>
  }

  const currentQ = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">{exam?.title}</h1>
        <div className="text-sm font-medium text-slate-500">
          {t.questionXofY.replace('{current}', String(currentIndex + 1)).replace('{total}', String(questions.length))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-sky-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="p-6 md:p-10 slide-up shadow-md">
        <h2 className="text-xl md:text-2xl font-medium text-slate-900 mb-8 leading-relaxed">
          {currentQ.text}
        </h2>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600 block">{t.yourAnswer}</label>
          <textarea
            value={answers[currentQ.id] || ""}
            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-slate-800 transition-shadow"
            placeholder={t.typeAnswerHere}
          />
        </div>

        {saveError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center justify-between">
            <span>{saveError}</span>
            <button
              onClick={() => { setSaveError(""); handleNext(); }}
              className="ml-3 text-red-600 underline hover:text-red-800 whitespace-nowrap"
            >
              Повторить
            </button>
          </div>
        )}

        <div className="mt-10 flex justify-between items-center pt-6 border-t border-slate-100">
          <Button
            variant="ghost"
            onClick={async () => {
              setSaving(true);
              setSaveError("");
              const prevIndex = Math.max(0, currentIndex - 1);
              setCurrentIndex(prevIndex);
              try {
                await saveAnswer(student.id, currentQ.id, answersRef.current[currentQ.id] || "");
              } catch (err: unknown) {
                console.error(err);
                setSaveError((err as Error).message || t.saveError);
              } finally {
                setSaving(false);
              }
            }}
            disabled={currentIndex === 0 || saving}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t.previous}
          </Button>

          <Button
            onClick={handleNext}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              t.saving
            ) : currentIndex === questions.length - 1 ? (
              <>
                {t.finishExam}
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                {t.next}
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
