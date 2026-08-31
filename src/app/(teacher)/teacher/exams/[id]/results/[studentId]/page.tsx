"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, X } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { getStudentAnswersForExam, approveAnswer } from "@/lib/actions"
import { cn } from "@/lib/utils"
import { t } from "@/lib/translations"

export default function ReviewStudent() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const examId = params.id as string
  const studentId = params.studentId as string

  const [studentName, setStudentName] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- // Supabase data shape — runtime-validated server-side, no runtime risk
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        router.push("/teacher/login")
        return
      }

      try {
        const { data: studentData } = await supabase
          .from("students")
          .select("name")
          .eq("id", studentId)
          .single()
        if (studentData) setStudentName(studentData.name)

        const results = await getStudentAnswersForExam(studentId, examId)
        setData(results)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [examId, studentId, router, supabase])

  const handleGrade = async (answerId: string, isCorrect: boolean, index: number) => {
    try {
      await approveAnswer(answerId, isCorrect)

      // Update local state optimistically
      const newData = [...data]
      newData[index].answer.is_correct = isCorrect
      setData(newData)
    } catch (err) {
      console.error(err)
      alert(t.error)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t.loadingResults}</div>
  }

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <Link
        href={`/teacher/exams/${examId}/results`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t.backToResults}
      </Link>

      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl">
          {studentName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{studentName} - {t.reviewStudentTitle}</h1>
          <p className="text-slate-500">{t.reviewSubmissions}</p>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((item, index) => {
          const ans = item.answer
          const isPending = ans && ans.is_correct === null
          const isCorrect = ans && ans.is_correct === true
          const isWrong = ans && ans.is_correct === false

          return (
            <Card
              key={item.question.id}
              className={cn(
                "p-6 border-l-4 transition-colors",
                isPending ? "border-l-amber-400" :
                isCorrect ? "border-l-green-500" :
                isWrong ? "border-l-red-500" : "border-l-slate-200"
              )}
            >
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-1">
                      {t.questionIndex.replace('{index}', String(index + 1))}
                    </h3>
                    <p className="text-lg text-slate-900 font-medium">{item.question.text}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-semibold tracking-wide text-slate-400 uppercase mb-2">{t.studentAnswer}</h4>
                    {ans ? (
                      <p className="text-slate-800 whitespace-pre-wrap">{ans.answer_text}</p>
                    ) : (
                      <p className="text-slate-400 italic">{t.noAnswerProvided}</p>
                    )}
                  </div>
                </div>

                {ans && (
                  <div className="mt-4 md:mt-0 flex md:flex-col gap-3 justify-start md:justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <button
                      onClick={() => handleGrade(ans.id, true, index)}
                      className={cn(
                        "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all flex-1",
                        isCorrect
                          ? "bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2"
                          : "bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-600"
                      )}
                    >
                      <Check className="w-5 h-5" />
                      <span>{t.markCorrect}</span>
                    </button>
                    <button
                      onClick={() => handleGrade(ans.id, false, index)}
                      className={cn(
                        "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all flex-1",
                        isWrong
                          ? "bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2"
                          : "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                      )}
                    >
                      <X className="w-5 h-5" />
                      <span>{t.markIncorrect}</span>
                    </button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
