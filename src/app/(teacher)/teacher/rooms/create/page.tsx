"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { createClient } from "@/lib/supabase/client"
import { createRoom } from "@/lib/actions"
import { generateRoomCode } from "@/lib/utils"

import { t } from "@/lib/translations"

export default function CreateRoom() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const code = generateRoomCode()
      const room = await createRoom(user.id, name, code)

      router.push(`/teacher/rooms/${room.id}`)
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 slide-up">
      <Link
        href="/teacher/dashboard"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t.backToDashboard}
      </Link>

      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-sky-100 rounded-lg text-sky-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.createNewRoom}</h1>
            <p className="text-slate-500 text-sm">{t.roomGeneratedCodeMsg}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t.roomName}</Label>
            <Input
              id="name"
              placeholder={t.roomNamePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link href="/teacher/dashboard" className="w-full sm:w-auto">
              <Button type="button" variant="ghost" className="w-full">{t.cancel}</Button>
            </Link>
            <Button type="submit" disabled={loading || !name.trim()} className="w-full sm:w-auto">
              {loading ? t.creating : t.createRoom}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
