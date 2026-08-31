/**
 * Teacher operations: rooms, exams, questions, results.
 * Non-server module — imported by the "use server" wrappers in actions.ts.
 */
import { createClient } from "../supabase/server"
import { createAdminClient } from "../supabase/admin"
import { logAction } from "../logger"
import type { ExamStudentResult, QuestionAnswer } from "../types"

async function getCurrentTeacherId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Не авторизован")
  return user.id
}

async function verifyRoomOwnership(roomId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("rooms").select("id").eq("id", roomId).eq("teacher_id", teacherId).maybeSingle()
  if (error || !data) throw new Error("Нет доступа к этой аудитории")
}

async function verifyExamOwnership(examId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("exams").select("id, rooms!inner(teacher_id)").eq("id", examId).eq("rooms.teacher_id", teacherId).maybeSingle()
  if (error || !data) throw new Error("Нет доступа к этому экзамену")
}

async function verifyQuestionOwnership(questionId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("questions").select("id, exams!inner(rooms!inner(teacher_id))").eq("id", questionId).eq("exams.rooms.teacher_id", teacherId).maybeSingle()
  if (error || !data) throw new Error("Нет доступа к этому вопросу")
}

// ── Room CRUD ──────────────────────────────────────

export async function createRoom(teacherId: string, name: string, code: string) {
  const currentTeacherId = await getCurrentTeacherId()
  if (!name || !name.trim() || !code || !code.trim()) throw new Error("Неверные входные данные: название и код обязательны")
  const supabase = await createClient()
  const { data, error } = await supabase.from("rooms").insert([{ teacher_id: currentTeacherId, name: name.trim(), code: code.trim().toUpperCase() }]).select().single()
  if (error) throw new Error("Не удалось создать аудиторию")
  logAction("CREATE_ROOM", currentTeacherId, { roomId: data.id, code })
  return data
}

export async function getRooms() {
  const currentTeacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data, error } = await supabase.from("rooms").select("*").eq("teacher_id", currentTeacherId).order("created_at", { ascending: false })
  if (error) throw new Error("Не удалось загрузить аудитории")
  return data
}

export async function deleteRoom(roomId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("rooms").delete().eq("id", roomId)
  if (error) throw new Error("Не удалось удалить аудиторию")
  logAction("DELETE_ROOM", teacherId, { roomId })
  return true
}

export async function updateRoom(roomId: string, name: string) {
  if (!name || !name.trim()) throw new Error("Название аудитории не может быть пустым")
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase.from("rooms").update({ name: name.trim() }).eq("id", roomId).select().single()
  if (error) throw new Error("Не удалось обновить аудиторию")
  logAction("UPDATE_ROOM", teacherId, { roomId, name })
  return data
}

// ── Exam CRUD ──────────────────────────────────────

export async function createExam(roomId: string, title: string) {
  const currentTeacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, currentTeacherId)
  if (!title || !title.trim()) throw new Error("Название экзамена не может быть пустым")
  const supabase = await createClient()
  const { data, error } = await supabase.from("exams").insert([{ room_id: roomId, title: title.trim() }]).select().single()
  if (error) throw new Error("Не удалось создать экзамен")
  logAction("CREATE_EXAM", currentTeacherId, { examId: data.id, roomId })
  return data
}

export async function getExams(roomId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase.from("exams").select("*").eq("room_id", roomId).order("created_at", { ascending: false })
  if (error) throw new Error("Не удалось загрузить экзамены")
  return data
}

export async function deleteExam(examId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("exams").delete().eq("id", examId)
  if (error) throw new Error("Не удалось удалить экзамен")
  logAction("DELETE_EXAM", teacherId, { examId })
  return true
}

export async function updateExam(examId: string, title: string) {
  if (!title || !title.trim()) throw new Error("Название экзамена не может быть пустым")
  const teacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase.from("exams").update({ title: title.trim() }).eq("id", examId).select().single()
  if (error) throw new Error("Не удалось обновить экзамен")
  logAction("UPDATE_EXAM", teacherId, { examId, title })
  return data
}

// ── Question CRUD ──────────────────────────────────

export async function createQuestion(examId: string, text: string) {
  const currentTeacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, currentTeacherId)
  if (!text || !text.trim()) throw new Error("Текст вопроса не может быть пустым")
  const supabase = await createClient()
  const { data, error } = await supabase.from("questions").insert([{ exam_id: examId, text: text.trim() }]).select().single()
  if (error) throw new Error("Не удалось создать вопрос")
  logAction("CREATE_QUESTION", currentTeacherId, { questionId: data.id, examId })
  return data
}

export async function deleteQuestion(questionId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyQuestionOwnership(questionId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("questions").delete().eq("id", questionId)
  if (error) throw new Error("Не удалось удалить вопрос")
  logAction("DELETE_QUESTION", teacherId, { questionId })
  return true
}

export async function updateQuestion(questionId: string, text: string) {
  if (!text || !text.trim()) throw new Error("Текст вопроса не может быть пустым")
  const teacherId = await getCurrentTeacherId()
  await verifyQuestionOwnership(questionId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase.from("questions").update({ text: text.trim() }).eq("id", questionId).select().single()
  if (error) throw new Error("Не удалось обновить вопрос")
  logAction("UPDATE_QUESTION", teacherId, { questionId })
  return data
}

// ── Exam Results ───────────────────────────────────

export async function getExamResults(examId: string): Promise<{ students: ExamStudentResult[] }> {
  const currentTeacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, currentTeacherId)
  const supabase = createAdminClient()
  const { data: questions, error: qError } = await supabase.from("questions").select("id").eq("exam_id", examId)
  if (qError) throw new Error("Не удалось загрузить вопросы")
  const questionIds = questions.map(q => q.id)
  if (questionIds.length === 0) return { students: [] }
  const { data: answers, error: aError } = await supabase.from("answers").select("id, is_correct, student_id, students(name)").in("question_id", questionIds)
  if (aError) throw new Error("Не удалось загрузить ответы")
  const studentMap = new Map<string, ExamStudentResult>()
  for (const ans of answers) {
    if (!studentMap.has(ans.student_id)) studentMap.set(ans.student_id, { id: ans.student_id, name: ans.students?.[0]?.name || "Ученик", total: questionIds.length, answered: 0, correct: 0, pending: 0, incorrect: 0 })
    const st = studentMap.get(ans.student_id)!; st.answered++
    if (ans.is_correct === true) st.correct++; else if (ans.is_correct === false) st.incorrect++; else st.pending++
  }
  return { students: Array.from(studentMap.values()) }
}

export async function getStudentAnswersForExam(studentId: string, examId: string): Promise<QuestionAnswer[]> {
  let targetStudentId = studentId
  let isTeacher = false
  try { const tid = await getCurrentTeacherId(); await verifyExamOwnership(examId, tid); isTeacher = true } catch { isTeacher = false }
  if (!isTeacher) {
    const { getVerifiedStudentId } = await import("./student-ops")
    const verifiedStudentId = await getVerifiedStudentId()
    if (studentId && studentId !== verifiedStudentId) throw new Error("AUTHORIZATION_ERROR: Вы не можете просматривать ответы других студентов")
    targetStudentId = verifiedStudentId
  }
  const supabase = createAdminClient()
  const { data: questions, error: qError } = await supabase.from("questions").select("*").eq("exam_id", examId).order("created_at", { ascending: true })
  if (qError) throw new Error("Не удалось загрузить вопросы")
  const questionIds = questions.map(q => q.id)
  if (questionIds.length === 0) return []
  const { data: answers, error: aError } = await supabase.from("answers").select("*").eq("student_id", targetStudentId).in("question_id", questionIds)
  if (aError) throw new Error("Не удалось загрузить ответы")
  return questions.map(q => ({ question: q, answer: (answers.find(a => a.question_id === q.id)) || null }))
}

export async function approveAnswer(answerId: string, isCorrect: boolean) {
  const currentTeacherId = await getCurrentTeacherId()
  const supabase = createAdminClient()
  const { data: answerRow, error: fetchErr } = await supabase.from("answers").select("id, question_id").eq("id", answerId).maybeSingle()
  if (fetchErr) throw new Error("Не удалось найти ответ")
  if (!answerRow) throw new Error("NOT_FOUND: Ответ не найден")
  await verifyQuestionOwnership(answerRow.question_id, currentTeacherId)
  const { data, error } = await supabase.from("answers").update({ is_correct: isCorrect }).eq("id", answerId).select().single()
  if (error) throw new Error("Не удалось обновить статус ответа")
  logAction("APPROVE_ANSWER", currentTeacherId, { answerId, isCorrect })
  return data
}
