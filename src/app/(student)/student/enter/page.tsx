"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, LogIn } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { validateRoomCode, createStudent, checkStudentExists } from "@/lib/actions"
import { t } from "@/lib/translations"

export default function StudentEnter() {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 1. Validate room
      const formattedCode = code.trim().toUpperCase()
      console.log("Validating room code:", formattedCode)
      
      const room = await validateRoomCode(formattedCode)
      console.log("Room validation result:", room)
      
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
        const confirm = window.confirm(t.nameTaken.replace('{name}', name.trim()).replace('{finalName}', finalName))
        if (!confirm) {
          setLoading(false)
          return
        }
      }

      // 2. Create student & save cookie
      await createStudent(finalName, room.id)
      
      // 3. Redirect to room's exam list
      router.push(`/student/rooms/${room.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center fade-in">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-2xl mb-4 text-sky-600">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t.joinRoom}</h1>
          <p className="text-slate-500 mt-2">
            {t.joinRoomDesc}
          </p>
        </div>

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

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button type="submit" className="w-full gap-2 text-lg h-14 mt-4" disabled={loading || !name || code.length < 3}>
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
