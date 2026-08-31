/**
 * Student operations: auth, join, answers, exam completion.
 * Non-server module — imported by the "use server" wrappers in actions.ts.
 */
import { createAdminClient } from "../supabase/admin"
import { cookies } from "next/headers"
import { signStudentToken, verifyStudentToken } from "../jwt"
import { logAction } from "../logger"
import { rateLimit } from "../rate-limit"
import { analyzeBehavior } from "../behavioral-analysis"
import type { StudentAssignment, Question, Answer } from "../types"

export async function getVerifiedStudentId(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (!token) throw new Error("AUTHORIZATION_ERROR: Токен студента не найден")
  const payload = await verifyStudentToken(token)
  if (!payload || !payload.studentId) throw new Error("AUTHORIZATION_ERROR: Недействительный токен студента")
  return payload.studentId
}

export async function validateRoomCode(code: string) {
  if (!code || typeof code !== 'string') return null
  const formattedCode = code.trim().toUpperCase()
  if (!formattedCode) return null
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("rooms").select("*").eq("code", formattedCode).maybeSingle()
    if (error || !data) return null
    return data
  } catch { return null }
}

export async function createStudent(name: string, roomId: string) {
  if (!name || !name.trim() || !roomId) throw new Error("Неверное имя или код комнаты")
  const rl = rateLimit(`student_join_${roomId}`, 20, 60000)
  if (!rl.allowed) throw new Error("Слишком много попыток входа. Пожалуйста, подождите минуту.")
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("students").insert([{ name: name.trim(), room_id: roomId }]).select().single()
  if (error) throw new Error("Не удалось создать запись студента")
  const token = await signStudentToken(data.id, roomId)
  const cookieStore = await cookies()
  cookieStore.set("studentToken", token, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7 })
  logAction("STUDENT_JOINED", data.id, { name, roomId })
  return data
}

export async function studentLogout() {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (token) { const payload = await verifyStudentToken(token); if (payload?.studentId) logAction("STUDENT_LOGOUT", payload.studentId) }
  cookieStore.set("studentToken", "", { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 0 })
}

export async function getStudent() {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (!token) return null
  const payload = await verifyStudentToken(token)
  if (!payload) return null
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("students").select("*, rooms(*)").eq("id", payload.studentId).single()
  if (error) return null
  return data
}

export async function getStudentRoomAssignments(roomId: string): Promise<{ exams: StudentAssignment[]; tests: StudentAssignment[] }> {
  const studentId = await getVerifiedStudentId()
  const supabase = createAdminClient()
  const { data: student, error: studentError } = await supabase.from("students").select("id, room_id").eq("id", studentId).maybeSingle()
  if (studentError || !student) throw new Error("Студент не найден")
  if (student.room_id !== roomId) throw new Error("Доступ к этой аудитории запрещён")
  const [examsRes, testsRes] = await Promise.all([
    supabase.from("exams").select("*").eq("room_id", roomId).order("created_at", { ascending: false }),
    supabase.from("tests").select("*, test_questions(id)").eq("room_id", roomId).order("created_at", { ascending: false })
  ])
  if (examsRes.error) throw new Error("Не удалось загрузить экзамены")
  if (testsRes.error) throw new Error("Не удалось загрузить тесты")
  return {
    exams: (examsRes.data || []).map((exam): StudentAssignment => ({ id: exam.id, type: "exam", title: exam.title || "Экзамен", description: exam.description || "", question_count: exam.question_count ?? 0, created_at: exam.created_at })),
    tests: (testsRes.data || []).map((test): StudentAssignment => ({ id: test.id, type: "test", title: test.title || "Тест", description: test.description || "", question_count: Array.isArray(test.test_questions) ? test.test_questions.length : 0, created_at: test.created_at }))
  }
}

export async function completeExam(studentId: string) {
  const verifiedStudentId = await getVerifiedStudentId()
  if (studentId && studentId !== verifiedStudentId) throw new Error("AUTHORIZATION_ERROR: Нельзя завершить экзамен от имени другого студента")
  logAction("EXAM_COMPLETED", verifiedStudentId)
  return { id: verifiedStudentId, exam_completed: true }
}

export async function getQuestions(examId: string): Promise<Question[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("questions").select("*").eq("exam_id", examId).order("created_at", { ascending: true })
  if (error) throw new Error("Не удалось загрузить вопросы")
  return data || []
}

export async function getExam(examId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("exams").select("*").eq("id", examId).single()
  if (error) throw new Error("Не удалось загрузить экзамен")
  return data
}

export async function saveAnswer(studentId: string, questionId: string, answerText: string) {
  if (!questionId) throw new Error("ID вопроса обязателен")
  const verifiedStudentId = await getVerifiedStudentId()
  if (studentId && studentId !== verifiedStudentId) throw new Error("AUTHORIZATION_ERROR: Отправка ответа от имени другого студента запрещена")
  const behavior = analyzeBehavior(verifiedStudentId, (answerText || "").length)
  if (behavior.isSuspicious) logAction("SECURITY_VIOLATION_BEHAVIOR", verifiedStudentId, { reason: behavior.reason, questionId })
  const rl = rateLimit(`save_ans_${verifiedStudentId}`, 120, 60000)
  if (!rl.allowed) logAction("RATE_LIMIT_EXAM_SAVE", verifiedStudentId, { questionId })
  const supabase = createAdminClient()
  const { data: existing, error: existError } = await supabase.from("answers").select("id").eq("student_id", verifiedStudentId).eq("question_id", questionId).maybeSingle()
  if (existError) throw new Error("Не удалось проверить наличие ответа")
  if (existing) {
    const { data, error } = await supabase.from("answers").update({ answer_text: answerText || "", is_correct: null }).eq("id", existing.id).select().single()
    if (error) throw new Error("Не удалось сохранить ответ"); return data
  } else {
    const { data, error } = await supabase.from("answers").insert([{ student_id: verifiedStudentId, question_id: questionId, answer_text: answerText || "", is_correct: null }]).select().single()
    if (error) {
      if (error.code === "23505") {
        const { data: existing } = await supabase.from("answers").select("id").eq("student_id", verifiedStudentId).eq("question_id", questionId).maybeSingle()
        if (existing) { const { data: updated, error: updErr } = await supabase.from("answers").update({ answer_text: answerText || "", is_correct: null }).eq("id", existing.id).select().single(); if (updErr) throw new Error("Не удалось сохранить ответ"); return updated }
      }
      throw new Error("Не удалось сохранить ответ")
    }
    return data
  }
}

export async function saveAllAnswers(studentId: string, answers: Record<string, string>) {
  const verifiedStudentId = await getVerifiedStudentId()
  if (studentId && studentId !== verifiedStudentId) throw new Error("AUTHORIZATION_ERROR: Нельзя сохранять ответы чужого студента")
  const supabase = createAdminClient()
  const entries = Object.entries(answers).filter(([, text]) => text && text.trim() !== "")
  if (entries.length === 0) return []
  const results: Answer[] = []
  for (const [questionId, answerText] of entries) {
    const { data: existing } = await supabase.from("answers").select("id").eq("student_id", verifiedStudentId).eq("question_id", questionId).maybeSingle()
    if (existing) {
      const { data, error } = await supabase.from("answers").update({ answer_text: answerText, is_correct: null }).eq("id", existing.id).select().single()
      if (error) throw new Error("Не удалось сохранить ответы"); results.push(data)
    } else {
      const { data, error } = await supabase.from("answers").insert([{ student_id: verifiedStudentId, question_id: questionId, answer_text: answerText, is_correct: null }]).select().single()
      if (error) {
        if (error.code === "23505") {
          const { data: retryExisting } = await supabase.from("answers").select("id").eq("student_id", verifiedStudentId).eq("question_id", questionId).maybeSingle()
          if (retryExisting) { const { data: updated, error: updErr } = await supabase.from("answers").update({ answer_text: answerText, is_correct: null }).eq("id", retryExisting.id).select().single(); if (updErr) throw new Error("Не удалось сохранить ответы"); results.push(updated); continue }
        }
        throw new Error("Не удалось сохранить ответы")
      }
      results.push(data)
    }
  }
  return results
}

export async function checkStudentExists(name: string, roomId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("students").select("id").eq("name", name).eq("room_id", roomId).maybeSingle()
  if (error) throw new Error("Не удалось проверить наличие студента")
  return !!data
}
