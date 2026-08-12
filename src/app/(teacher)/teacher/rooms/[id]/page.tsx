"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, Plus, Copy, Check, Pencil, Trash } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { getExams, deleteRoom, updateRoom, deleteExam, updateExam } from "@/lib/actions"

export default function RoomDetails() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [room, setRoom] = useState<any>(null)
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const roomId = params.id as string

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        router.push("/login")
        return
      }

      try {
        // Get room details
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", roomId)
          .single()
        
        if (roomError) throw roomError
        setRoom(roomData)

        // Get exams
        const examsData = await getExams(roomId)
        setExams(examsData || [])

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [roomId, router, supabase])

  const handleEditRoom = async () => {
    const newName = window.prompt("New room name:", room?.name)
    if (newName && newName !== room.name) {
      try {
        const updated = await updateRoom(roomId, newName)
        setRoom(updated)
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room and all its exams?")) {
      try {
        await deleteRoom(roomId)
        router.push("/teacher/dashboard")
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const handleEditExam = async (examId: string, currentTitle: string) => {
    const newTitle = window.prompt("New exam title:", currentTitle)
    if (newTitle && newTitle !== currentTitle) {
      try {
        const updated = await updateExam(examId, newTitle)
        setExams(exams.map(e => e.id === examId ? updated : e))
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await deleteExam(examId)
        setExams(exams.filter(e => e.id !== examId))
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const copyCode = () => {
    if (!room) return
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading room...</div>
  }

  if (!room) {
    return <div className="text-center py-20 text-red-500">Room not found.</div>
  }

  return (
    <div className="space-y-6 fade-in">
      <Link 
        href="/teacher/dashboard" 
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{room.name}</h1>
            <button onClick={handleEditRoom} className="p-2 text-slate-400 hover:text-sky-600 transition-colors" title="Edit room">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={handleDeleteRoom} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete room">
              <Trash className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center space-x-3">
            <span className="text-sm text-slate-500">Room Access Code:</span>
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="font-mono font-bold text-sky-600 tracking-wider text-lg">{room.code}</span>
              <button 
                onClick={copyCode}
                className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Копировать код"}
              </button>
            </div>
          </div>
        </div>

        <Link href={`/teacher/exams/create?roomId=${roomId}`}>
          <Button className="w-full md:w-auto gap-2">
            <Plus className="w-4 h-4" />
            Create Exam
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Exams</h2>
        
        {exams.length === 0 ? (
          <Card className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No exams yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">
              Create an exam to test your students' knowledge.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <Card key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:border-sky-200 transition-colors">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="p-3 bg-sky-50 rounded-xl">
                    <FileText className="w-6 h-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{exam.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Created {new Date(exam.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <button onClick={() => handleEditExam(exam.id, exam.title)} className="p-2 text-slate-400 hover:text-sky-600 transition-colors" title="Edit exam">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteExam(exam.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete exam">
                    <Trash className="w-4 h-4" />
                  </button>
                  <Link href={`/teacher/exams/${exam.id}/results`} className="w-full sm:w-auto ml-2">
                    <Button variant="outline" className="w-full">
                      View Results
                    </Button>
                  </Link>
                  <Link href={`/teacher/exams/${exam.id}`} className="w-full sm:w-auto ml-2">
                    <Button className="w-full">
                      Manage Questions
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
