import { t } from "@/lib/translations"

interface RoomHeaderProps {
  studentName: string
  roomName: string
}

export function RoomHeader({ studentName, roomName }: RoomHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {t.helloStudent.replace("{name}", studentName)}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1">
        {t.welcomeToRoom.split("{room}")[0]}
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {roomName}
        </span>
        {t.welcomeToRoom.split("{room}")[1]}
      </p>
    </div>
  )
}
