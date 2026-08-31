"use client"

import { Users } from "lucide-react"
import { Card } from "@/components/ui/Card"

interface Participant {
  id: string
  name: string
}

interface Props {
  participants: Participant[]
  roomCode: string
}

export default function ParticipantsList({ participants, roomCode }: Props) {
  return (
    <Card className="p-6 md:p-8 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-500" />
          <h2 className="text-lg font-bold text-slate-900">Подключенные участники</h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
          Участников: {participants.length}
        </span>
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">Пока нет подключенных участников.</p>
          <p className="text-xs text-slate-400 mt-1">
            Ученики должны войти в комнату по коду <span className="font-mono font-bold text-slate-600">{roomCode}</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 animate-ping" />
              <span className="font-medium text-slate-800 text-sm truncate">{p.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
