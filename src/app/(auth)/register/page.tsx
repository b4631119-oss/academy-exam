"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { createClient } from "@/lib/supabase/client"
import { t } from "@/lib/translations"

export default function RegisterPage() {
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
      setError("Слишком много попыток регистрации. Пожалуйста, подождите перед следующей попыткой.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password
      })
      if (error) throw error
      
      router.push("/teacher/dashboard")
      router.refresh()
    } catch (err: any) {
      setAttempts(prev => prev + 1)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md slide-up p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {t.teacherRegister}
          </h1>
          <p className="text-slate-500 mt-2">
            {t.registerWelcome}
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

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.signingUp : t.signUp}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-sky-600 hover:underline"
          >
            {t.hasAccount}
          </Link>
        </div>
      </Card>
    </div>
  )
}
