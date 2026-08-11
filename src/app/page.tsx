import Link from "next/link"
import { GraduationCap, Users } from "lucide-react"
import { Card } from "@/components/ui/Card"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="z-10 text-center max-w-2xl mx-auto space-y-8 fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Academy Exam
          </h1>
          <p className="text-lg text-slate-600 md:text-xl max-w-lg mx-auto">
            The modern platform for seamless exam creation, distribution, and grading.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-xl mx-auto slide-up">
          <Link href="/student/enter" className="group">
            <Card className="h-full flex flex-col items-center justify-center p-8 space-y-4 transition-all hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100 cursor-pointer">
              <div className="p-4 bg-slate-50 rounded-full group-hover:bg-sky-50 transition-colors">
                <Users className="w-8 h-8 text-slate-600 group-hover:text-sky-500 transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">I am a Student</h3>
                <p className="text-sm text-slate-500 mt-2">Enter your room code to take an exam</p>
              </div>
            </Card>
          </Link>

          <Link href="/login" className="group">
            <Card className="h-full flex flex-col items-center justify-center p-8 space-y-4 transition-all hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100 cursor-pointer">
              <div className="p-4 bg-slate-50 rounded-full group-hover:bg-sky-50 transition-colors">
                <GraduationCap className="w-8 h-8 text-slate-600 group-hover:text-sky-500 transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">I am a Teacher</h3>
                <p className="text-sm text-slate-500 mt-2">Create rooms and grade exams</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
