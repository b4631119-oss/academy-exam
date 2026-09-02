import Link from "next/link"
import { Users, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/Card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Вход в PROlab Academy
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Выберите, как вы хотите войти
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/student/enter" className="group">
            <Card className="h-full flex flex-col items-center gap-4 p-7 text-center transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-lg hover:shadow-sky-50 dark:hover:shadow-sky-950/50">
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950 transition-colors group-hover:bg-sky-100 dark:group-hover:bg-sky-900">
                <Users className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Я ученик
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Войти в комнату и пройти тесты и экзамены
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                Продолжить
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Card>
          </Link>

          <Link href="/teacher/login" className="group">
            <Card className="h-full flex flex-col items-center gap-4 p-7 text-center transition-all hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-lg hover:shadow-amber-50 dark:hover:shadow-amber-950/50">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950 transition-colors group-hover:bg-amber-100 dark:group-hover:bg-amber-900">
                <GraduationCap className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Я преподаватель
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Управлять комнатами, тестами и экзаменами
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                Продолжить
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
