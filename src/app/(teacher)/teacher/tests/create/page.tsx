"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { createTest } from "@/lib/test-actions"

function CreateTestForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomId = searchParams.get("roomId") || ""

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!roomId) {
    return (
      <Card className="p-8 text-center text-red-500">
        Не указан ID аудитории.
      </Card>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const newTest = await createTest(roomId, title, description)
      router.push(`/teacher/tests/${newTest.id}`)
    } catch (err: any) {
      setError(err.message || "Ошибка при создании теста")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <Link
        href={`/teacher/rooms/${roomId}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Вернуться к аудитории
      </Link>

      <Card className="p-6 sm:p-8 shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Создать новый тест</h1>
          <p className="text-slate-500 text-sm mt-1">
            Задайте название и описание теста. Вопросы можно будет добавить на следующем шаге.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Название теста *</Label>
            <Input
              id="title"
              placeholder="например, Интерактивный тест по физике"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание (опционально)</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Добавьте краткие инструкции или описание теста..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-slate-800 text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/teacher/rooms/${roomId}`)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading || !title.trim()} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default function CreateTestPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Загрузка...</div>}>
      <CreateTestForm />
    </Suspense>
  )
}
