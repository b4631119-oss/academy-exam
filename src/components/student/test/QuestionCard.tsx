"use client"

import { Loader2 } from "lucide-react"

interface OptionItem {
  id: string
  option_text: string
  text?: string
  position: number
}

const LETTERS = ["A", "B", "C", "D", "E", "F"]

interface Props {
  question: {
    id: string
    question_text: string
    text?: string
    points: number
    time_limit_seconds: number
    options: OptionItem[]
  }
  selectedOptionId: string | null
  hasAnswered: boolean
  submitting: boolean
  finishing: boolean
  onSelectOption: (optionId: string) => void
}

export default function QuestionCard({ question, selectedOptionId, hasAnswered, submitting, finishing, onSelectOption }: Props) {
  const isDisabled = hasAnswered || submitting || finishing

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {question.options.map((opt, idx) => {
        const letter = LETTERS[idx] || `${idx + 1}`
        const isSelected = selectedOptionId === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => onSelectOption(opt.id)}
            disabled={isDisabled}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 shadow-sm ${
              isSelected
                ? "border-sky-500 bg-sky-50 dark:bg-sky-950 ring-2 ring-sky-300 dark:ring-sky-700"
                : isDisabled
                ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-70 cursor-not-allowed"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/50 active:scale-[0.98]"
            }`}
          >
            <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-mono font-bold text-base transition-colors shrink-0 ${isSelected ? "bg-sky-600 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
              {letter}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-base sm:text-lg flex-1 leading-snug">
              {opt.option_text || opt.text}
            </span>
            {isSelected && submitting && <Loader2 className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-spin shrink-0" />}
          </button>
        )
      })}
    </div>
  )
}
