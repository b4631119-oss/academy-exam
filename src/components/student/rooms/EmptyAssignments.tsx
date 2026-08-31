import { FileText } from "lucide-react"
import { Card } from "@/components/ui/Card"

export function EmptyAssignments() {
  return (
    <Card className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Нет доступных заданий
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mt-2">
        В этой аудитории пока нет экзаменов или тестов.
      </p>
    </Card>
  )
}
