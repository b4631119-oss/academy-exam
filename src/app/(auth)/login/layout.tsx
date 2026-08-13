import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Вход для преподавателей | PROlab Academy Exam",
  description: "Авторизация для преподавателей. Войдите в систему для управления классами и экзаменами.",
  alternates: {
    canonical: "/login",
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
