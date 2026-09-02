"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, LogIn, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { validateRoomCode, createStudent, checkStudentExists } from "@/lib/actions"
import { t } from "@/lib/translations"
import { toast } from "sonner"

export default function StudentEnter() {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingName, setPendingName] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formattedCode = code.trim().toUpperCase()
      const room = await validateRoomCode(formattedCode)

      if (!room) {
        throw new Error(t.invalidRoom)
      }

      let finalName = name.trim()
      let isDuplicate = await checkStudentExists(finalName, room.id)
      let counter = 2
      while (isDuplicate) {
        finalName = `${name.trim()} (${counter})`
        isDuplicate = await checkStudentExists(finalName, room.id)
        counter++
      }

      if (finalName !== name.trim()) {
        setPendingName(finalName)
        setLoading(false)
        return
      }

      await createStudent(finalName, room.id)
      toast.success(t.joinSuccess || "Вы успешно вошли в аудиторию")
      router.push(`/student/rooms/${room.id}`)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      if (!pendingName) setLoading(false)
    }
  }

  async function handleConfirmName() {
    if (!pendingName) return
    const finalName = pendingName
    setPendingName(null)
    setLoading(true)
    try {
      const formattedCode = code.trim().toUpperCase()
      const room = await validateRoomCode(formattedCode)
      if (room) {
        await createStudent(finalName, room.id)
        toast.success(t.joinSuccess || "Вы успешно вошли в аудиторию")
        router.push(`/student/rooms/${room.id}`)
      }
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function handleCancelName() {
    setPendingName(null)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center fade-in">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>

      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 dark:bg-sky-900 rounded-2xl mb-4 text-sky-600 dark:text-sky-400">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.joinRoom}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {t.joinRoomDesc}
          </p>
        </div>

        {pendingName && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              {t.nameTaken.replace('{name}', name.trim()).replace('{finalName}', pendingName)}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="secondary" onClick={handleCancelName} className="w-full sm:w-auto">
                {t.cancel || "Отмена"}
              </Button>
              <Button onClick={handleConfirmName} disabled={loading} className="w-full sm:w-auto">
                {t.confirm || "Подтвердить"}
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t.fullName}</Label>
            <Input
              id="name"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">{t.roomCode}</Label>
            <Input
              id="code"
              placeholder={t.roomCodePlaceholder}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="uppercase tracking-widest font-mono"
              maxLength={6}
              required
            />
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{error}</p>}

          <Button type="submit" className="w-full gap-2 text-lg h-14 mt-4" disabled={loading || !name || code.length < 3 || !!pendingName}>
            {loading ? t.joining : (
              <>
                <span>{t.joinBtn}</span>
                <LogIn className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
