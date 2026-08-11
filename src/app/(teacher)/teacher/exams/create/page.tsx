"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { createExam, createQuestion } from "@/lib/actions"

function CreateExamForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get("roomId")

  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<string[]>([""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const addQuestion = () => {
    setQuestions([...questions, ""])
  }

  const updateQuestion = (index: number, text: string) => {
    const newQs = [...questions]
    newQs[index] = text
    setQuestions(newQs)
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return
    const newQs = [...questions]
    newQs.splice(index, 1)
    setQuestions(newQs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomId) {
      setError("Room ID is missing.")
      return
    }

    // Filter out empty questions
    const validQuestions = questions.filter(q => q.trim() !== "")
    if (validQuestions.length === 0) {
      setError("Please add at least one question.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create exam
      const exam = await createExam(roomId, title)
      
      // Create questions
      for (const qText of validQuestions) {
        await createQuestion(exam.id, qText)
      }

      router.push(`/teacher/rooms/${roomId}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!roomId) {
    return <div className="text-red-500">Error: No Room ID provided.</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 slide-up">
      <Link 
        href={`/teacher/rooms/${roomId}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Room
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create New Exam</h1>
        <p className="text-slate-500 mt-1">Add details and questions for the exam.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Exam Title</Label>
            <Input
              id="title"
              placeholder="e.g. Midterm Test, Chapter 4 Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
            />
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Questions</h2>
          </div>

          {questions.map((q, i) => (
            <Card key={i} className="p-6 relative group">
              <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {i + 1}
              </div>
              <div className="flex gap-4 items-start pt-2">
                <div className="flex-1 space-y-2">
                  <Label>Question Text</Label>
                  <textarea
                    value={q}
                    onChange={(e) => updateQuestion(i, e.target.value)}
                    placeholder="Enter the question here..."
                    required
                    rows={2}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                  <p className="text-xs text-slate-500">Students will answer with a text field.</p>
                </div>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(i)}
                    className="text-slate-400 hover:text-red-500 transition-colors mt-7 p-2 bg-slate-50 hover:bg-red-50 rounded-lg"
                    title="Remove question"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </Card>
          ))}

          <Button 
            type="button" 
            variant="outline" 
            onClick={addQuestion}
            className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Question
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div className="flex justify-end gap-4 pb-12">
          <Link href={`/teacher/rooms/${roomId}`}>
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading ? "Saving Exam..." : "Save Exam & Finish"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function CreateExam() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateExamForm />
    </Suspense>
  )
}
