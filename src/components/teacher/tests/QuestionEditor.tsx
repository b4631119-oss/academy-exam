"use client"

import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Trash2, Plus, Clock, Award } from "lucide-react"

export interface OptionItem {
  id?: string
  text: string
  position: number
  is_correct: boolean
}

export interface QuestionItem {
  id?: string
  text: string
  position: number
  time_limit_seconds: number
  points: number
  test_options: OptionItem[]
}

const MIN_TIME = 5
const MAX_TIME = 300
const MIN_PTS = 5
const MAX_PTS = 100

export function validateQuestions(list: QuestionItem[]): Record<number, string[]> {
  const result: Record<number, string[]> = {}
  list.forEach((q, i) => {
    const errs: string[] = []
    if (!q.text.trim()) errs.push("Введите текст вопроса")
    const opts = q.test_options || []
    if (opts.length < 2) errs.push("Добавьте минимум 2 варианта")
    opts.forEach((o, idx) => {
      if (!o.text.trim()) errs.push(`Введите вариант ответа (${String.fromCharCode(65 + idx)})`)
    })
    const correctCount = opts.filter((o) => o.is_correct).length
    if (correctCount === 0) errs.push("Выберите правильный вариант")
    if (correctCount > 1) errs.push("Выберите только один правильный вариант")
    const tl = Number(q.time_limit_seconds)
    if (isNaN(tl) || tl < MIN_TIME || tl > MAX_TIME) errs.push(`Время на вопрос должно быть от ${MIN_TIME} до ${MAX_TIME} секунд`)
    const pts = Number(q.points)
    if (isNaN(pts) || pts < MIN_PTS || pts > MAX_PTS) errs.push(`Баллы за вопрос должны быть от ${MIN_PTS} до ${MAX_PTS}`)
    if (errs.length) result[i] = errs
  })
  return result
}

export function createBlankQuestion(pos: number): QuestionItem {
  return {
    text: "", position: pos, time_limit_seconds: 60, points: 20,
    test_options: [
      { text: "", position: 1, is_correct: true },
      { text: "", position: 2, is_correct: false },
      { text: "", position: 3, is_correct: false },
      { text: "", position: 4, is_correct: false }
    ]
  }
}

interface Props {
  question: QuestionItem
  index: number
  totalQuestions: number
  validationErrors?: string[]
  onQuestionChange: (index: number, field: keyof QuestionItem, value: string | number | boolean) => void
  onRemoveQuestion: (index: number) => void
  onAddOption: (qIndex: number) => void
  onRemoveOption: (qIndex: number, optIndex: number) => void
  onOptionChange: (qIndex: number, optIndex: number, text: string) => void
  onSetCorrectOption: (qIndex: number, optIndex: number) => void
}

export default function QuestionEditor({
  question: q, index: qIdx, validationErrors = [],
  onQuestionChange, onRemoveQuestion, onAddOption, onRemoveOption, onOptionChange, onSetCorrectOption
}: Props) {
  const hasQErrors = validationErrors.length > 0

  return (
    <Card className={`p-6 md:p-8 shadow-sm space-y-6 relative border-slate-200 hover:border-slate-300 transition-colors ${hasQErrors ? "border-red-300 ring-1 ring-red-200" : ""}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <span className="font-semibold text-slate-700 text-lg">Вопрос {qIdx + 1}</span>
        <button onClick={() => onRemoveQuestion(qIdx)} className="text-slate-400 hover:text-red-600 transition-colors p-2.5 rounded-lg hover:bg-red-50 flex items-center gap-1.5 text-xs font-medium" title="Удалить вопрос">
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Удалить вопрос</span>
        </button>
      </div>

      <div className="space-y-2">
        <Label>Текст вопроса *</Label>
        <textarea value={q.text} onChange={(e) => onQuestionChange(qIdx, "text", e.target.value)} placeholder="Введите вопрос здесь..." rows={2} maxLength={500}
          className={`w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-slate-900 font-medium ${hasQErrors && !q.text.trim() ? "border-red-300" : "border-slate-200"}`} />
      </div>

      {hasQErrors && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm space-y-1">
          {validationErrors.map((e, i) => (<p key={i}>• {e}</p>))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-sky-500" /> Время на вопрос (секунды)
          </Label>
          <Input type="number" min={MIN_TIME} max={MAX_TIME} step={1} value={q.time_limit_seconds} onChange={(e) => onQuestionChange(qIdx, "time_limit_seconds", Number(e.target.value))} className="bg-white" />
          <p className="text-[11px] text-slate-400">От 5 до 300 секунд</p>
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-500" /> Баллы
          </Label>
          <Input type="number" min={MIN_PTS} max={MAX_PTS} step={1} value={q.points} onChange={(e) => onQuestionChange(qIdx, "points", Number(e.target.value))} className="bg-white" />
          <p className="text-[11px] text-slate-400">От 5 до 100 баллов</p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {hasQErrors && validationErrors.some((e) => e.includes("правильный вариант")) && (
          <p className="text-xs text-red-600 font-medium">{validationErrors.find((e) => e.includes("правильный вариант"))}</p>
        )}
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 font-medium">Варианты ответа (от 2 до 4):</Label>
          {q.test_options.length < 4 && (
            <button onClick={() => onAddOption(qIdx)} className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Добавить вариант
            </button>
          )}
        </div>
        <div className="space-y-3">
          {q.test_options.map((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx)
            return (
              <div key={opt.id || `opt-${optIdx}`} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${opt.is_correct ? "bg-green-50/70 border-green-300 ring-1 ring-green-300" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs">{letter}</span>
                <Input value={opt.text} onChange={(e) => onOptionChange(qIdx, optIdx, e.target.value)} placeholder={`Текст варианта ${letter}...`} maxLength={300}
                  className={`flex-1 bg-transparent focus:border-slate-300 shadow-none text-slate-800 ${hasQErrors && !opt.text.trim() ? "border-red-300" : "border-transparent"}`} />
                <button type="button" onClick={() => onSetCorrectOption(qIdx, optIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${opt.is_correct ? "bg-green-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${opt.is_correct ? "border-white bg-white" : "border-slate-400"}`}>
                    {opt.is_correct && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
                  </span>
                  {opt.is_correct ? "Правильный" : "Выбрать"}
                </button>
                {q.test_options.length > 2 && (
                  <button onClick={() => onRemoveOption(qIdx, optIdx)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-md transition-colors" title="Удалить вариант">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
