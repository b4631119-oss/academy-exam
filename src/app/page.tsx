import Link from "next/link"
import Image from "next/image"
import { GraduationCap, Users } from "lucide-react"
import { Card } from "@/components/ui/Card"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="z-10 text-center max-w-4xl mx-auto space-y-8 fade-in w-full">
        <div className="space-y-6 flex flex-col items-center">
          {/* Герой-изображение (с обрезанным лого Gemini) */}
          <div className="w-full max-w-2xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 mb-6 group">
            <Image 
              src="/hero-image.png" 
              alt="Academy Exam Banner" 
              width={1400} 
              height={700} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-109"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-500/40 to-transparent"></div>
          </div>

          
          <p className="text-lg text-slate-600 md:text-xl max-w-lg mx-auto">
            Современная платформа для удобного создания, проведения и оценки экзаменов.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-xl mx-auto slide-up">
          <Link href="/student/enter" className="group">
            <Card className="h-full flex flex-col items-center justify-center p-8 space-y-4 transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/50 cursor-pointer">
              <div className="p-4 bg-slate-50 rounded-full group-hover:bg-sky-50 transition-colors">
                <Users className="w-8 h-8 text-slate-600 group-hover:text-sky-500 transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">Я студент</h3>
                <p className="text-sm text-slate-500 mt-2">Войти в аудиторию по коду доступа</p>
              </div>
            </Card>
          </Link>

          <Link href="/login" className="group">
            <Card className="h-full flex flex-col items-center justify-center p-8 space-y-4 transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/50 cursor-pointer">
              <div className="p-4 bg-slate-50 rounded-full group-hover:bg-sky-50 transition-colors">
                <GraduationCap className="w-8 h-8 text-slate-600 group-hover:text-sky-500 transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">Я преподаватель</h3>
                <p className="text-sm text-slate-500 mt-2">Управление классами и экзаменами</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
