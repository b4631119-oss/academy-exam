"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getStudent, getStudentRoomAssignments } from "@/lib/actions"
import { startOrJoinStudentTest } from "@/lib/test-actions"
import { t } from "@/lib/translations"
import { RoomHeader } from "@/components/student/rooms/RoomHeader"
import { ErrorBanner } from "@/components/student/rooms/ErrorBanner"
import { EmptyAssignments } from "@/components/student/rooms/EmptyAssignments"
import { AssignmentCard } from "@/components/student/rooms/AssignmentCard"

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
          ...exams.map((exam: any) => ({
            id: exam.id,
            type: "exam" as const,
            title: exam.title || "Экзамен",
            description: exam.description || "",
            question_count: Number(exam.question_count || 0),
            created_at: exam.created_at || new Date().toISOString()
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
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
      } catch (err: unknown) {
        console.error("Student room load error:", err)
        setError((err as Error).message || "Не удалось загрузить доступные задания")
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
    } catch (err: unknown) {
      setError((err as Error).message || "Не удалось открыть тест")
      setStartingTestId(null)
    }
  }

  const handleOpenExam = (examId: string) => {
    router.push(`/student/exam/${examId}`)
  }

  const assignmentTitle = useMemo(() => {
    if (assignments.length === 0) return "Нет доступных заданий"
    return "Доступные задания"
  }, [assignments.length])

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        {t.loadingExams}
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <RoomHeader
        studentName={student?.name || ""}
        roomName={student?.rooms?.name || ""}
      />

      {error && <ErrorBanner message={error} />}

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {assignmentTitle}
        </h2>

        {assignments.length === 0 ? (
          <EmptyAssignments />
        ) : (
          <div className="grid gap-4">
            {assignments.map((item) => (
              <AssignmentCard
                key={item.id}
                item={item}
                isStarting={startingTestId === item.id}
                onOpenExam={handleOpenExam}
                onOpenTest={handleOpenTest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
