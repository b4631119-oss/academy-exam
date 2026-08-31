import { FileText, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { t } from "@/lib/translations"

interface AssignmentItem {
  id: string
  type: "exam" | "test"
  title: string
  description: string
  question_count: number
  created_at: string
}

interface AssignmentCardProps {
  item: AssignmentItem
  isStarting: boolean
  onOpenExam: (id: string) => void
  onOpenTest: (id: string) => void
}

export function AssignmentCard({
  item,
  isStarting,
  onOpenExam,
  onOpenTest,
}: AssignmentCardProps) {
  const isExam = item.type === "exam"

  return (
    <Card
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all ${
        isStarting
          ? "border-sky-400 dark:border-sky-600 bg-sky-50/50 dark:bg-sky-950/30"
          : ""
      }`}
    >
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <div className="p-3 bg-sky-50 dark:bg-sky-950 rounded-xl">
          <FileText className="w-6 h-6 text-sky-500 dark:text-sky-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isExam ? "Экзамен" : "Тест"}
          </p>
          {item.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {item.description}
            </p>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {item.question_count} вопросов
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isExam ? (
          <Button
            onClick={() => onOpenExam(item.id)}
            className="gap-2"
          >
            {t.takeExam}
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => onOpenTest(item.id)}
            disabled={isStarting}
            className="gap-2"
          >
            {isStarting ? (
              "Открытие..."
            ) : (
              <>
                Открыть тест
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}
