"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash, Plus, Save, X } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { getQuestions, deleteQuestion, updateQuestion, createQuestion } from "@/lib/actions"
import { t } from "@/lib/translations"
import { toast } from "sonner"

export default function ManageExamQuestions() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const examId = params.id as string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [exam, setExam] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/teacher/login")
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

  const handleEditStart = (qId: string, currentText: string) => {
    setEditingId(qId)
    setEditText(currentText)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditText("")
  }

  const handleEditSave = async (qId: string) => {
    if (!editText.trim()) return
    if (editText === questions.find(q => q.id === qId)?.text) {
      handleEditCancel()
      return
    }
    try {
      const updated = await updateQuestion(qId, editText)
      setQuestions(questions.map(q => q.id === qId ? updated : q))
      toast.success(t.questionUpdated || "Вопрос обновлён")
      handleEditCancel()
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  const handleDeleteQuestion = async (qId: string) => {
    if (deletingId === qId) {
      // Second click - confirm deletion
      try {
        await deleteQuestion(qId)
        setQuestions(questions.filter(q => q.id !== qId))
        toast.success(t.questionDeleted || "Вопрос удалён")
      } catch (err: unknown) {
        toast.error((err as Error).message)
      }
      setDeletingId(null)
    } else {
      // First click - show confirmation
      setDeletingId(qId)
      toast.warning(t.deleteQuestionConfirm || "Нажмите ещё раз для подтверждения удаления", {
        duration: 3000,
      })
      // Auto-cancel after 3 seconds
      setTimeout(() => {
        if (deletingId === qId) setDeletingId(null)
      }, 3000)
    }
  }

  const handleAddStart = () => {
    setAddingQuestion(true)
    setNewQuestionText("")
  }

  const handleAddCancel = () => {
    setAddingQuestion(false)
    setNewQuestionText("")
  }

  const handleAddSave = async () => {
    if (!newQuestionText.trim()) return
    try {
      const newQ = await createQuestion(examId, newQuestionText)
      setQuestions([...questions, newQ])
      toast.success(t.questionAdded || "Вопрос добавлен")
      handleAddCancel()
    } catch (err: unknown) {
      toast.error((err as Error).message)
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
        <Button onClick={handleAddStart} className="w-full sm:w-auto gap-2">
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
              {editingId === q.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(q.id)
                      if (e.key === "Escape") handleEditCancel()
                    }}
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleEditSave(q.id)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleEditCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-slate-900 text-lg whitespace-pre-wrap">{q.text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditStart(q.id, q.text)}
                      className="p-2 text-slate-400 hover:text-sky-600 transition-colors bg-slate-50 hover:bg-sky-50 rounded-lg"
                      title="Редактировать вопрос"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className={`p-2 transition-colors rounded-lg ${
                        deletingId === q.id
                          ? "text-red-600 bg-red-50"
                          : "text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50"
                      }`}
                      title={deletingId === q.id ? "Подтвердить удаление" : "Удалить вопрос"}
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </Card>
          ))
        )}
        {addingQuestion && (
          <Card className="p-5 flex items-center gap-2">
            <Input
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder={t.newQuestionPlaceholder || "Текст нового вопроса"}
              className="flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSave()
                if (e.key === "Escape") handleAddCancel()
              }}
            />
            <Button variant="ghost" size="sm" onClick={handleAddSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleAddCancel}>
              <X className="w-4 h-4" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
