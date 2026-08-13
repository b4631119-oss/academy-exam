"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Users } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { getRooms } from "@/lib/actions"
import { t } from "@/lib/translations"

export default function TeacherDashboard() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        router.push("/login")
        return
      }

      try {
        const data = await getRooms(user.id)
        setRooms(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router, supabase])

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t.loadingDashboard}</div>
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.yourRooms}</h1>
          <p className="text-slate-500 mt-1">{t.manageClasses}</p>
        </div>
        <Link href="/teacher/rooms/create">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" />
            {t.createRoom}
          </Button>
        </Link>
      </div>

      {rooms.length === 0 ? (
        <Card className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{t.noRoomsYet}</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            {t.createFirstRoom}
          </p>
          <Link href="/teacher/rooms/create" className="inline-block mt-6">
            <Button variant="outline">{t.createRoom}</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link key={room.id} href={`/teacher/rooms/${room.id}`}>
              <Card className="h-full hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {room.name}
                  </h3>
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t.roomCodeLabel}</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-700 text-sm font-mono font-bold rounded">
                      {room.code}
                    </span>
                  </div>
                </div>
                <div className="mt-6 text-sm font-medium text-sky-600 group-hover:text-sky-700 flex items-center">
                  {t.viewDetails} &rarr;
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
