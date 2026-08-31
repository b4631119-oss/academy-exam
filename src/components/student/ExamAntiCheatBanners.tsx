"use client"

import { AlertTriangle, X } from "lucide-react"

interface Props {
  violationMessage: string | null
  warningMessage: string | null
  onDismissWarning: () => void
}

export default function ExamAntiCheatBanners({ violationMessage, warningMessage, onDismissWarning }: Props) {
  return (
    <>
      {violationMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm font-medium slide-up">
          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Нарушение правил</p>
            <p className="mt-1 opacity-90">{violationMessage}</p>
            <p className="mt-1 text-xs opacity-75">Экзамен будет завершён через несколько секунд...</p>
          </div>
        </div>
      )}

      {warningMessage && !violationMessage && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-sm font-medium slide-up">
          <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <span className="flex-1">{warningMessage}</span>
          <button onClick={onDismissWarning} className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 shrink-0" aria-label="Закрыть">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )
}
