"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, ChevronRight, Zap, Play } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getExams, getStudent } from "@/lib/actions"
import { joinTestSessionAction } from "@/lib/test-actions"
import { t } from "@/lib/translations"

export default function StudentRoomExams() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [exams, setExams] = useState<any[]>([])
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joiningTest, setJoiningTest] = useState(false)
  const [testError, setTestError] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const studentData = await getStudent()
        if (!studentData) {
          router.push("/student/enter")
          return
        }
        setStudent(studentData)

        // Ensure the student is in the correct room
        if (studentData.room_id !== roomId) {
          router.push(`/student/rooms/${studentData.room_id}`)
          return
        }

        const examsData = await getExams(roomId)
        setExams(examsData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [roomId, router])

  const handleJoinTest = async () => {
    if (!student?.rooms?.code) return
    setJoiningTest(true)
    setTestError("")

    try {
      const result = await joinTestSessionAction(student.rooms.code)
      if (result && result.session_id) {
        router.push(`/student/test/lobby/${result.session_id}`)
      }
    } catch (err: any) {
      setTestError(err.message || "Не удалось подключиться к тесту")
    } finally {
      setJoiningTest(false)
    }
  }

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

      {/* Test Join Card */}
      <Card className="p-6 bg-gradient-to-r from-amber-500/10 to-sky-500/10 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Интерактивное тестирование</h3>
            <p className="text-slate-600 text-sm">
              Подключитесь к живому тесту преподавателя в этой аудитории
            </p>
          </div>
        </div>
        <Button
          onClick={handleJoinTest}
          disabled={joiningTest}
          className="w-full sm:w-auto gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          {joiningTest ? "Подключение..." : "Войти в онлайн-тест"}
        </Button>
      </Card>

      {testError && (
        <p className="text-red-500 text-sm font-medium px-2">{testError}</p>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">{t.examsTitle}</h2>
        {exams.length === 0 ? (
          <Card className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{t.noExamsAvailable}</h3>
            <p className="text-slate-500 mt-2">
              {t.teacherNoExams}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <Link key={exam.id} href={`/student/exam/${exam.id}`}>
                <Card className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="p-3 bg-sky-50 rounded-xl group-hover:bg-sky-100 transition-colors">
                      <FileText className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                        {exam.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center text-sky-600 font-medium">
                    {t.takeExam}
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

