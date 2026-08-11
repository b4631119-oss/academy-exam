"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      // Auto-create teacher record if it doesn't exist
      if (data.user) {
        const { error: teacherError } = await supabase
          .from('teachers')
          .insert({ id: data.user.id, email: data.user.email })
          
        if (teacherError) {
          console.log("Teacher insertion skipped during login (likely already exists):", teacherError)
        } else {
          console.log("Teacher record successfully created on login:", data.user.id)
        }
      }

      router.push("/teacher/dashboard")
      router.refresh() // important to refresh so middleware catches the new session state
    } catch (err: any) {
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
            Teacher Login
          </h1>
          <p className="text-slate-500 mt-2">
            Welcome back! Enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Password</Label>
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
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/register"
            className="text-sm text-sky-600 hover:underline"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </Card>
    </div>
  )
}
