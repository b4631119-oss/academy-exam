"use client"

import Link from "next/link"
import { Play, Copy, Check, FastForward, Award } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import TestStatusBadge from "@/components/ui/TestStatusBadge"
import type { Test, TestSession, ParticipantRow } from "@/lib/types"

interface Props {
  test: Test | null
  session: TestSession | null
  participants: ParticipantRow[]
  isRunning: boolean
  isFinished: boolean
  currentQIndex: number
  totalQuestions: number
  isLastQuestion: boolean
  limitSeconds: number
  remaining: number
  copied: boolean
  starting: boolean
  advancing: boolean
  testId: string
  onCopyCode: () => void
  onStartTest: () => void
  onAdvanceQuestion: () => void
}

export default function LobbyHeader({
  test, session, isRunning, isFinished, currentQIndex, totalQuestions,
  isLastQuestion, limitSeconds, remaining, copied, starting, advancing,
  testId, onCopyCode, onStartTest, onAdvanceQuestion
}: Props) {
  function formatClock(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  function formatLimit(seconds: number): string {
    if (seconds % 60 === 0) return `${seconds / 60} мин`
    if (seconds < 60) return `${seconds} сек`
    return `${Math.floor(seconds / 60)} мин ${seconds % 60} сек`
  }

  return (
    <Card className="p-6 md:p-8 shadow-sm space-y-6 text-center">
      <div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <TestStatusBadge status={session?.status || "draft"} />
          {!isRunning && !isFinished && (
            <span className="text-xs font-medium text-slate-500">Ожидание участников</span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{test?.title}</h1>
        {test?.description && (
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">{test.description}</p>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 inline-block mx-auto">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
          Код аудитории для входа
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-3xl font-extrabold tracking-widest text-sky-600">
            {test?.rooms?.code || "—"}
          </span>
          <button onClick={onCopyCode} className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors" title="Копировать код">
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        {!isRunning && !isFinished ? (
          <div className="space-y-3">
            <Button onClick={onStartTest} disabled={starting} className="w-full sm:w-auto px-8 py-3 text-base gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg">
              <Play className="w-5 h-5 fill-white" />
              {starting ? "Запуск..." : "Начать тест"}
            </Button>
          </div>
        ) : isRunning ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 font-semibold text-base">
              🚀 ТЕКУЩИЙ ВОПРОС №{currentQIndex + 1}
              {totalQuestions > 0 && <> из {totalQuestions}</>}
            </div>
            {limitSeconds > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">
                  Лимит: {formatLimit(limitSeconds)}
                </span>
                {remaining > 0 ? (
                  <span className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 font-bold font-mono text-sm">
                    Осталось: {formatClock(remaining)}
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-bold text-sm">Время вышло</span>
                )}
              </div>
            )}
            <Button onClick={onAdvanceQuestion} disabled={advancing} className="w-full sm:w-auto px-8 py-3 text-base gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-md">
              <FastForward className="w-5 h-5 fill-white" />
              {advancing ? "Переключение..." : isLastQuestion ? "Завершить тест" : "Следующий вопрос"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold text-lg">🏁 Тест полностью завершён</div>
            {session?.id && (
              <Link href={`/teacher/tests/${testId}/results/${session.id}`} className="inline-block">
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Award className="w-4 h-4" /> Посмотреть результаты
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
