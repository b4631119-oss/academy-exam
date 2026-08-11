"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, Clock, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getStudent, getStudentAnswersForExam } from "@/lib/actions"
import { cn } from "@/lib/utils"

export default function StudentResult() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [student, setStudent] = useState<any>(null)
  const [data, setData] = useState<any[]>([])
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

        const results = await getStudentAnswersForExam(studentData.id, examId)
        setData(results)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [examId, router])

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading your results...</div>
  }

  const correctCount = data.filter(d => d.answer?.is_correct === true).length
  const wrongCount = data.filter(d => d.answer?.is_correct === false).length
  const pendingCount = data.filter(d => d.answer && d.answer.is_correct === null).length
  const totalCount = data.length

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in pb-12">
      <Link 
        href={student?.room_id ? `/student/rooms/${student.room_id}` : "/"}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Exams
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Your Exam Results</h1>
        <p className="text-slate-500 text-lg">
          Here's how you did, {student?.name}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-3xl font-bold text-slate-700">{totalCount}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Questions</span>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-green-100 bg-green-50/50">
          <span className="text-3xl font-bold text-green-600 flex items-center gap-2">
            {correctCount}
          </span>
          <span className="text-sm font-medium text-green-600/80 uppercase tracking-wider">Correct</span>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-red-100 bg-red-50/50">
          <span className="text-3xl font-bold text-red-500 flex items-center gap-2">
            {wrongCount}
          </span>
          <span className="text-sm font-medium text-red-500/80 uppercase tracking-wider">Incorrect</span>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-amber-100 bg-amber-50/50">
          <span className="text-3xl font-bold text-amber-500 flex items-center gap-2">
            {pendingCount}
          </span>
          <span className="text-sm font-medium text-amber-500/80 uppercase tracking-wider">Pending</span>
        </Card>
      </div>

      <div className="space-y-6 mt-12">
        <h2 className="text-xl font-bold text-slate-900 px-1">Detailed Breakdown</h2>
        {data.map((item, index) => {
          const ans = item.answer
          const isPending = ans && ans.is_correct === null
          const isCorrect = ans && ans.is_correct === true
          const isWrong = ans && ans.is_correct === false
          const notAnswered = !ans

          return (
            <Card 
              key={item.question.id} 
              className={cn(
                "p-6 md:p-8 border-l-4 transition-all",
                isPending ? "border-l-amber-400" :
                isCorrect ? "border-l-green-500" :
                isWrong ? "border-l-red-500" : "border-l-slate-300 opacity-70"
              )}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                      Question {index + 1}
                    </h3>
                    
                    {/* Status Badge */}
                    <div className={cn(
                      "flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                      isCorrect ? "bg-green-100 text-green-700" :
                      isWrong ? "bg-red-100 text-red-700" :
                      isPending ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {isCorrect && <><CheckCircle2 className="w-3.5 h-3.5" /><span>Correct</span></>}
                      {isWrong && <><XCircle className="w-3.5 h-3.5" /><span>Incorrect</span></>}
                      {isPending && <><Clock className="w-3.5 h-3.5" /><span>In Review</span></>}
                      {notAnswered && <span>Skipped</span>}
                    </div>
                  </div>
                  
                  <p className="text-lg text-slate-900 font-medium">{item.question.text}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold tracking-wide text-slate-400 uppercase mb-2">Your Answer</h4>
                    {notAnswered ? (
                      <p className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">You did not provide an answer.</p>
                    ) : (
                      <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                        {ans.answer_text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
