import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Регистрация | PROlab Academy Exam",
  description: "Создайте аккаунт преподавателя для создания и проведения онлайн-экзаменов в PROlab Academy.",
  alternates: {
    canonical: "/register",
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
