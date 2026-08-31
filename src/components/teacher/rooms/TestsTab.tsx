"use client"

import Link from "next/link"
import { Plus, Zap } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import TestStatusBadge from "@/components/ui/TestStatusBadge"

interface Test {
  id: string
  title: string
  description?: string
  status: string
  questions_count?: number
  created_at: string
}

interface Props {
  tests: Test[]
  roomId: string
}

export default function TestsTab({ tests, roomId }: Props) {
  if (tests.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
          <Zap className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">В этой комнате пока нет тестов</h3>
        <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">
          Создайте интерактивный тест с выбором вариантов для проведения онлайн-тестирования.
        </p>
        <div className="mt-6">
          <Link href={`/teacher/tests/create?roomId=${roomId}`}>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Создать тест</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {tests.map((test) => (
        <Card key={test.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:border-sky-200 transition-colors">
          <div className="flex items-start space-x-4 mb-4 sm:mb-0">
            <div className="p-3 bg-amber-50 rounded-xl mt-1"><Zap className="w-6 h-6 text-amber-500" /></div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-slate-900">{test.title}</h3>
                <TestStatusBadge status={test.status} />
              </div>
              {test.description && <p className="text-xs text-slate-600 mt-1 max-w-lg line-clamp-2">{test.description}</p>}
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>Вопросов: {test.questions_count ?? 0}</span>
                <span>•</span>
                <span>Создан: {new Date(test.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
            <Link href={`/teacher/tests/${test.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">Настроить</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}
