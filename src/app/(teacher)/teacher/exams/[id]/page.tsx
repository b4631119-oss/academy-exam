"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash, Plus } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { getQuestions, deleteQuestion, updateQuestion, createQuestion } from "@/lib/actions"
import { t } from "@/lib/translations"

export default function ManageExamQuestions() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const examId = params.id as string

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }

      try {
        const { data: examData } = await supabase
          .from("exams")
          .select("*, rooms(id, name)")
          .eq("id", examId)
          .single()
        
        if (examData) setExam(examData)

        const qData = await getQuestions(examId)
        setQuestions(qData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [examId, router, supabase])

  const handleEditQuestion = async (qId: string, currentText: string) => {
    const newText = window.prompt(t.editQuestionPrompt, currentText)
    if (newText && newText !== currentText) {
      try {
        const updated = await updateQuestion(qId, newText)
        setQuestions(questions.map(q => q.id === qId ? updated : q))
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const handleDeleteQuestion = async (qId: string) => {
    if (window.confirm(t.deleteQuestionAlert)) {
      try {
        await deleteQuestion(qId)
        setQuestions(questions.filter(q => q.id !== qId))
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const handleAddQuestion = async () => {
    const text = window.prompt(t.newQuestionPrompt)
    if (text) {
      try {
        const newQ = await createQuestion(examId, text)
        setQuestions([...questions, newQ])
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t.loadingQuestions}</div>
  }

  if (!exam) {
    return <div className="text-center py-20 text-red-500">{t.examNotFound}</div>
  }

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <Link 
        href={`/teacher/rooms/${exam.rooms.id}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t.backToRoomWith} {exam.rooms.name}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.manageQuestionsTitle}</h1>
          <p className="text-slate-500 mt-1">{t.examLabel} {exam.title}</p>
        </div>
        <Button onClick={handleAddQuestion} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" />
          {t.addQuestionBtn}
        </Button>
      </div>

      <div className="space-y-4 mt-8">
        {questions.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-900">{t.noQuestionsTitle}</h3>
            <p className="text-slate-500 mt-1">{t.noQuestionsDesc}</p>
          </Card>
        ) : (
          questions.map((q, i) => (
            <Card key={q.id} className="p-5 flex items-start gap-4 hover:border-sky-200 transition-colors">
              <div className="w-8 h-8 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md mt-1">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-slate-900 text-lg whitespace-pre-wrap">{q.text}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEditQuestion(q.id, q.text)} className="p-2 text-slate-400 hover:text-sky-600 transition-colors bg-slate-50 hover:bg-sky-50 rounded-lg" title="Edit question">
                  <Pencil className="w-5 h-5" />
                </button>
                <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50 rounded-lg" title="Delete question">
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
