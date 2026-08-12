"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getStudent, getQuestions, saveAnswer } from "@/lib/actions"
import { createClient } from "@/lib/supabase/client"

export default function TakeExam() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const examId = params.id as string

  const [student, setStudent] = useState<any>(null)
  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const studentData = await getStudent()
        if (!studentData) {
          router.push("/student/enter")
          return
        }
        setStudent(studentData)

        // Get Exam info
        const { data: examData } = await supabase
          .from("exams")
          .select("*")
          .eq("id", examId)
          .single()
        
        if (examData) setExam(examData)

        // Get questions
        const qData = await getQuestions(examId)
        setQuestions(qData || [])

        // Initialize answers state if needed
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [examId, router, supabase])

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }))
  }

  const handleNext = async () => {
    const currentQ = questions[currentIndex]
    const answerText = answers[currentQ.id] || ""
    
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
        const confirm = window.confirm(`У вас осталось ${emptyCount} вопросов без ответа. Вы уверены, что хотите завершить экзамен?`)
        if (!confirm) {
          return
        }
      }
    }

    setSaving(true)
    try {
      // Save current answer
      await saveAnswer(student.id, currentQ.id, answerText)
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Finish exam
        router.push(`/student/result/${examId}`)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to save answer. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading exam...</div>
  }

  if (questions.length === 0) {
    return <div className="text-center py-20 text-red-500">No questions found for this exam.</div>
  }

  const currentQ = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">{exam?.title}</h1>
        <div className="text-sm font-medium text-slate-500">
          Question {currentIndex + 1} of {questions.length}
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
          <label className="text-sm font-medium text-slate-600 block">Your Answer:</label>
          <textarea
            value={answers[currentQ.id] || ""}
            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-slate-800 transition-shadow"
            placeholder="Type your answer here..."
          />
        </div>

        <div className="mt-10 flex justify-between items-center pt-6 border-t border-slate-100">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0 || saving}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>

          <Button 
            onClick={handleNext}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              "Saving..."
            ) : currentIndex === questions.length - 1 ? (
              <>
                Finish Exam
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
