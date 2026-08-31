"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { createClient } from "@/lib/supabase/client"
import { t } from "@/lib/translations"

export default function TeacherLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const [attempts, setAttempts] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (attempts >= 5) {
      setError("Слишком много неудачных попыток. Пожалуйста, подождите немного перед следующей попыткой.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      router.push("/teacher/dashboard")
      router.refresh()
    } catch (err: unknown) {
      setAttempts(prev => prev + 1)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md slide-up p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-50 dark:bg-amber-950 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Вход для преподавателей
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Войдите в систему для управления классами и экзаменами
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.signingIn : t.signIn}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/register"
            className="text-sm text-sky-600 dark:text-sky-400 hover:underline"
          >
            {t.noAccount}
          </Link>
        </div>
      </Card>
    </div>
  )
}
