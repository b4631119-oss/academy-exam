import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Вход в аудиторию | PROlab Academy Exam",
  description: "Вход для студентов по коду доступа. Присоединяйтесь к аудитории для прохождения экзамена.",
  alternates: {
    canonical: "/student/enter",
  },
}

export default function StudentEnterLayout({ children }: { children: React.ReactNode }) {
  return children
}
