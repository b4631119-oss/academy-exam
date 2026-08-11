"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getExams, getStudent } from "@/lib/actions"

export default function StudentRoomExams() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [exams, setExams] = useState<any[]>([])
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading exams...</div>
  }

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Hello, {student?.name}!
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome to <span className="font-semibold text-slate-700">{student?.rooms?.name}</span>. Here are your available exams.
        </p>
      </div>

      {exams.length === 0 ? (
        <Card className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No exams available</h3>
          <p className="text-slate-500 mt-2">
            Your teacher hasn't created any exams for this room yet. Check back later!
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 mt-8">
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
                  Take Exam
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
