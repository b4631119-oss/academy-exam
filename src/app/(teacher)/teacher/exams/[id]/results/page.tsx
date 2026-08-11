"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, UserCircle2, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { getExamResults } from "@/lib/actions"

export default function ExamResults() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [exam, setExam] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const examId = params.id as string

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        router.push("/login")
        return
      }

      try {
        const { data: examData, error: examError } = await supabase
          .from("exams")
          .select("*, rooms(id, name)")
          .eq("id", examId)
          .single()
        
        if (examError) throw examError
        setExam(examData)

        const results = await getExamResults(examId)
        setStudents(results.students)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [examId, router, supabase])

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading results...</div>
  }

  if (!exam) {
    return <div className="text-center py-20 text-red-500">Exam not found.</div>
  }

  return (
    <div className="space-y-6 fade-in">
      <Link 
        href={`/teacher/rooms/${exam.rooms.id}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to {exam.rooms.name}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Results: {exam.title}</h1>
        <p className="text-slate-500 mt-1">Review student submissions</p>
      </div>

      {students.length === 0 ? (
        <Card className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <UserCircle2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No submissions yet</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Students haven't started taking this exam yet.
          </p>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900">Student Name</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Progress</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900">{student.answered}</span>
                      <span className="text-slate-400">/ {student.total}</span>
                    </div>
                    <div className="w-24 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-sky-500" 
                        style={{ width: `${(student.answered / student.total) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-green-600" title="Correct">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">{student.correct}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-red-500" title="Incorrect">
                        <XCircle className="w-4 h-4" />
                        <span className="font-medium">{student.incorrect}</span>
                      </div>
                      {student.pending > 0 && (
                        <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full" title="Pending review">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-medium text-xs">{student.pending} to check</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/teacher/exams/${examId}/results/${student.id}`}>
                      <Button variant="outline" className="text-xs py-1.5 px-4 h-auto">
                        Review
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
