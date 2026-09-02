"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, Plus, Copy, Check, Pencil, Trash, Zap } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { getExams, deleteRoom, updateRoom, deleteExam, updateExam } from "@/lib/actions"
import { getTeacherTests } from "@/lib/test-actions"
import TestStatusBadge from "@/components/ui/TestStatusBadge"
import { t } from "@/lib/translations"
import { toast } from "sonner"

export default function RoomDetails() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [room, setRoom] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [exams, setExams] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [tests, setTests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"exams" | "tests">("exams")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [editingRoomName, setEditingRoomName] = useState(false)
  const [roomNameInput, setRoomNameInput] = useState("")
  const [editingExamId, setEditingExamId] = useState<string | null>(null)
  const [examTitleInput, setExamTitleInput] = useState("")
  const [deletingRoom, setDeletingRoom] = useState(false)
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null)

  const roomId = params.id as string

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        router.push("/teacher/login")
        return
      }

      try {
        // Get room details
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", roomId)
          .single()

        if (roomError) throw roomError
        setRoom(roomData)

        // Get exams
        const examsData = await getExams(roomId)
        setExams(examsData || [])

        // Get tests
        try {
          const testsData = await getTeacherTests(roomId)
          setTests(testsData || [])
        } catch (testErr) {
          console.error("Error loading tests:", testErr)
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [roomId, router, supabase])

  const handleEditRoom = () => {
    setRoomNameInput(room?.name || "")
    setEditingRoomName(true)
  }

  const handleSaveRoomName = async () => {
    if (!roomNameInput.trim() || roomNameInput === room?.name) {
      setEditingRoomName(false)
      return
    }
    try {
      const updated = await updateRoom(roomId, roomNameInput)
      setRoom(updated)
      toast.success("Название аудитории обновлено")
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setEditingRoomName(false)
    }
  }

  const handleDeleteRoom = () => {
    setDeletingRoom(true)
  }

  const handleConfirmDeleteRoom = async () => {
    try {
      await deleteRoom(roomId)
      toast.success("Аудитория удалена")
      router.push("/teacher/dashboard")
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setDeletingRoom(false)
    }
  }

  const handleEditExam = (examId: string, currentTitle: string) => {
    setExamTitleInput(currentTitle)
    setEditingExamId(examId)
  }

  const handleSaveExamTitle = async () => {
    const examId = editingExamId
    if (!examId || !examTitleInput.trim() || examTitleInput === exams.find(e => e.id === examId)?.title) {
      setEditingExamId(null)
      return
    }
    try {
      const updated = await updateExam(examId, examTitleInput)
      setExams(exams.map(e => e.id === examId ? updated : e))
      toast.success("Название экзамена обновлено")
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setEditingExamId(null)
    }
  }

  const handleDeleteExam = (examId: string) => {
    setDeletingExamId(examId)
  }

  const handleConfirmDeleteExam = async () => {
    const examId = deletingExamId
    if (!examId) return
    try {
      await deleteExam(examId)
      setExams(exams.filter(e => e.id !== examId))
      toast.success("Экзамен удалён")
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setDeletingExamId(null)
    }
  }

  const copyCode = () => {
    if (!room) return
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    toast.success("Код аудитории скопирован")
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t.loadingRoom}</div>
  }

  if (!room) {
    return <div className="text-center py-20 text-red-500">{t.roomNotFound}</div>
  }

  return (
    <>
      {editingRoomName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Редактировать название аудитории</h2>
            <Input
              value={roomNameInput}
              onChange={(e) => setRoomNameInput(e.target.value)}
              placeholder="Название аудитории"
              autoFocus
              className="mb-4"
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveRoomName(); if (e.key === "Escape") setEditingRoomName(false); }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingRoomName(false)}>Отмена</Button>
              <Button onClick={handleSaveRoomName}>Сохранить</Button>
            </div>
          </div>
        </div>
      )}

      {deletingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Удалить аудиторию?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{t.deleteRoomAlert}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeletingRoom(false)}>Отмена</Button>
              <Button variant="secondary" onClick={handleConfirmDeleteRoom} className="text-red-600 hover:bg-red-50">
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingExamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Редактировать название экзамена</h2>
            <Input
              value={examTitleInput}
              onChange={(e) => setExamTitleInput(e.target.value)}
              placeholder="Название экзамена"
              autoFocus
              className="mb-4"
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveExamTitle(); if (e.key === "Escape") setEditingExamId(null); }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingExamId(null)}>Отмена</Button>
              <Button onClick={handleSaveExamTitle}>Сохранить</Button>
            </div>
          </div>
        </div>
      )}

      {deletingExamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Удалить экзамен?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{t.deleteExamAlert}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeletingExamId(null)}>Отмена</Button>
              <Button variant="secondary" onClick={handleConfirmDeleteExam} className="text-red-600 hover:bg-red-50">
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 fade-in">
      <Link
        href="/teacher/dashboard"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t.backToDashboard}
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{room.name}</h1>
            <button onClick={handleEditRoom} className="p-2 text-slate-400 hover:text-sky-600 transition-colors" title={t.editRoom}>
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={handleDeleteRoom} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title={t.deleteRoom}>
              <Trash className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center space-x-3">
            <span className="text-sm text-slate-500">{t.roomAccessCode}</span>
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="font-mono font-bold text-sky-600 tracking-wider text-lg">{room.code}</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                title={t.copyCodeBtn}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? t.copied : t.copyCodeBtn}
              </button>
            </div>
          </div>
        </div>

        <Link href={activeTab === "exams" ? `/teacher/exams/create?roomId=${roomId}` : `/teacher/tests/create?roomId=${roomId}`}>
          <Button className="w-full md:w-auto gap-2">
            <Plus className="w-4 h-4" />
            {activeTab === "exams" ? t.createExam : "Создать тест"}
          </Button>
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="mt-8">
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "exams"
                ? "border-sky-600 text-sky-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            {t.examsTitle} ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "tests"
                ? "border-sky-600 text-sky-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Zap className="w-4 h-4" />
            Тесты ({tests.length})
          </button>
        </div>

        {/* TAB 1: EXAMS */}
        {activeTab === "exams" && (
          <div>
            {exams.length === 0 ? (
              <Card className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">{t.noExamsYet}</h3>
                <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">
                  {t.createExamDesc}
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {exams.map((exam) => (
                  <Card key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:border-sky-200 transition-colors">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="p-3 bg-sky-50 rounded-xl">
                        <FileText className="w-6 h-6 text-sky-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{exam.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {t.createdOn} {new Date(exam.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
                      <button onClick={() => handleEditExam(exam.id, exam.title)} className="p-2 text-slate-400 hover:text-sky-600 transition-colors" title={t.editExam}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteExam(exam.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title={t.deleteExam}>
                        <Trash className="w-4 h-4" />
                      </button>
                      <Link href={`/teacher/exams/${exam.id}/results`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full">
                          {t.viewResults}
                        </Button>
                      </Link>
                      <Link href={`/teacher/exams/${exam.id}`} className="w-full sm:w-auto">
                        <Button className="w-full">
                          {t.manageQuestions}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TESTS */}
        {activeTab === "tests" && (
          <div>
            {tests.length === 0 ? (
              <Card className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                  <Zap className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">В этой комнате пока нет тестов</h3>
                <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">
                  Создайте интерактивный тест с выбором вариантов для проведения онлайн-тестирования.
                </p>
                <div className="mt-6">
                  <Link href={`/teacher/tests/create?roomId=${roomId}`}>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Создать тест
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tests.map((test) => (
                  <Card key={test.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:border-sky-200 transition-colors">
                    <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                      <div className="p-3 bg-amber-50 rounded-xl mt-1">
                        <Zap className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900">{test.title}</h3>
                          <TestStatusBadge status={test.status} />
                        </div>
                        {test.description && (
                          <p className="text-xs text-slate-600 mt-1 max-w-lg line-clamp-2">
                            {test.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>Вопросов: {test.questions_count ?? 0}</span>
                          <span>•</span>
                          <span>Создан: {new Date(test.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
                      <Link href={`/teacher/tests/${test.id}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full">
                          Настроить
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </>
)
}