"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { FileText, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getStudent, getStudentRoomAssignments } from "@/lib/actions"
import { startOrJoinStudentTest } from "@/lib/test-actions"
import { t } from "@/lib/translations"

interface AssignmentItem {
  id: string
  type: "exam" | "test"
  title: string
  description: string
  question_count: number
  created_at: string
}

export default function StudentRoomAssignments() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [assignments, setAssignments] = useState<AssignmentItem[]>([])
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [startingTestId, setStartingTestId] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError("")

      try {
        const studentData = await getStudent()
        if (!studentData) {
          router.push("/student/enter")
          return
        }

        setStudent(studentData)

        if (studentData.room_id !== roomId) {
          router.push(`/student/rooms/${studentData.room_id}`)
          return
        }

        const { exams = [], tests = [] } = await getStudentRoomAssignments(roomId)

        const merged = [
          ...exams.map((exam: any) => ({
            id: exam.id,
            type: "exam" as const,
            title: exam.title || "Экзамен",
            description: exam.description || "",
            question_count: Number(exam.question_count || 0),
            created_at: exam.created_at || new Date().toISOString()
          })),
          ...tests.map((test: any) => ({
            id: test.id,
            type: "test" as const,
            title: test.title || "Тест",
            description: test.description || "",
            question_count: Number(test.question_count || 0),
            created_at: test.created_at || new Date().toISOString()
          }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setAssignments(merged)
      } catch (err: any) {
        console.error("Student room load error:", err)
        setError(err.message || "Не удалось загрузить доступные задания")
      } finally {
        setLoading(false)
      }
    }

    if (roomId) {
      loadData()
    }
  }, [roomId, router])

  const handleOpenTest = async (testId: string) => {
    setStartingTestId(testId)
    setError("")

    try {
      const result = await startOrJoinStudentTest(testId)
      if (result?.session_id) {
        if (result.is_finished) {
          router.push(`/student/test/result/${result.session_id}`)
        } else {
          router.push(`/student/test/${result.session_id}`)
        }
        return
      }
      throw new Error("Не удалось открыть тест")
    } catch (err: any) {
      setError(err.message || "Не удалось открыть тест")
      setStartingTestId(null)
    }
  }

  const assignmentTitle = useMemo(() => {
    if (assignments.length === 0) return "Нет доступных заданий"
    return "Доступные задания"
  }, [assignments.length])

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t.loadingExams}</div>
  }

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {t.helloStudent.replace('{name}', student?.name || '')}
        </h1>
        <p className="text-slate-500 mt-1">
          {t.welcomeToRoom.split('{room}')[0]}<span className="font-semibold text-slate-700">{student?.rooms?.name}</span>{t.welcomeToRoom.split('{room}')[1]}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">{assignmentTitle}</h2>

        {assignments.length === 0 ? (
          <Card className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Нет доступных заданий</h3>
            <p className="text-slate-500 mt-2">В этой аудитории пока нет экзаменов или тестов.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {assignments.map((item) => {
              const isExam = item.type === "exam"
              const isStarting = startingTestId === item.id

              return (
                <Card
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:border-sky-300 hover:shadow-md transition-all ${
                    isStarting ? "border-sky-400 bg-sky-50/50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="p-3 bg-sky-50 rounded-xl">
                      <FileText className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{isExam ? "Экзамен" : "Тест"}</p>
                      {item.description && <p className="text-sm text-slate-500 mt-1">{item.description}</p>}
                      <p className="text-sm text-slate-500 mt-2">{item.question_count} вопросов</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isExam ? (
                      <Button onClick={() => router.push(`/student/exam/${item.id}`)} className="gap-2">
                        {t.takeExam}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleOpenTest(item.id)}
                        disabled={isStarting}
                        className="gap-2"
                      >
                        {isStarting ? "Открытие..." : (
                          <>
                            Открыть тест
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
