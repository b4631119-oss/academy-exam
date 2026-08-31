"use client"

import Link from "next/link"
import { FileText, Pencil, Trash } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { t } from "@/lib/translations"

interface Exam {
  id: string
  title: string
  created_at: string
}

interface Props {
  exams: Exam[]
  onEdit: (examId: string, currentTitle: string) => void
  onDelete: (examId: string) => void
}

export default function ExamsTab({ exams, onEdit, onDelete }: Props) {
  if (exams.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
          <FileText className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">{t.noExamsYet}</h3>
        <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">{t.createExamDesc}</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {exams.map((exam) => (
        <Card key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:border-sky-200 transition-colors">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="p-3 bg-sky-50 rounded-xl"><FileText className="w-6 h-6 text-sky-500" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">{exam.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.createdOn} {new Date(exam.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
            <button onClick={() => onEdit(exam.id, exam.title)} className="p-2 text-slate-400 hover:text-sky-600 transition-colors" title={t.editExam}><Pencil className="w-4 h-4" /></button>
            <button onClick={() => onDelete(exam.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title={t.deleteExam}><Trash className="w-4 h-4" /></button>
            <Link href={`/teacher/exams/${exam.id}/results`} className="w-full sm:w-auto"><Button variant="outline" className="w-full">{t.viewResults}</Button></Link>
            <Link href={`/teacher/exams/${exam.id}`} className="w-full sm:w-auto"><Button className="w-full">{t.manageQuestions}</Button></Link>
          </div>
        </Card>
      ))}
    </div>
  )
}
