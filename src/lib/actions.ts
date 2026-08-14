"use server"

import { createClient } from "./supabase/server"
import { cookies } from "next/headers"
import { signStudentToken, verifyStudentToken } from "./jwt"
import { logAction } from "./logger"
import { rateLimit } from "./rate-limit"

// ========================
// TEACHER ACTIONS
// ========================

export async function createRoom(teacherId: string, name: string, code: string) {
  const currentTeacherId = await getCurrentTeacherId()
  if (!name || !name.trim() || !code || !code.trim()) {
    throw new Error("Неверные входные данные: название и код обязательны")
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .insert([{ teacher_id: currentTeacherId, name: name.trim(), code: code.trim().toUpperCase() }])
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  logAction("CREATE_ROOM", currentTeacherId, { roomId: data.id, code })
  return data
}

export async function getRooms(teacherId: string) {
  const currentTeacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("teacher_id", currentTeacherId)
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createExam(roomId: string, title: string) {
  const currentTeacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, currentTeacherId)
  if (!title || !title.trim()) {
    throw new Error("Название экзамена не может быть пустым")
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .insert([{ room_id: roomId, title: title.trim() }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  logAction("CREATE_EXAM", currentTeacherId, { examId: data.id, roomId })
  return data
}

export async function getExams(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createQuestion(examId: string, text: string) {
  const currentTeacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, currentTeacherId)
  if (!text || !text.trim()) {
    throw new Error("Текст вопроса не может быть пустым")
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .insert([{ exam_id: examId, text: text.trim() }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  logAction("CREATE_QUESTION", currentTeacherId, { questionId: data.id, examId })
  return data
}

export async function getExamResults(examId: string) {
  const currentTeacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, currentTeacherId)

  const supabase = await createClient()
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id")
    .eq("exam_id", examId)

  if (qError) throw new Error(qError.message)
  
  const questionIds = questions.map(q => q.id)

  if (questionIds.length === 0) {
      return { students: [] }
  }

  const { data: answers, error: aError } = await supabase
    .from("answers")
    .select("id, is_correct, student_id, students(name)")
    .in("question_id", questionIds)

  if (aError) throw new Error(aError.message)

  const studentMap = new Map()
  answers.forEach((ans: any) => {
    if (!studentMap.has(ans.student_id)) {
      studentMap.set(ans.student_id, {
        id: ans.student_id,
        name: ans.students ? ans.students.name : "Ученик",
        total: questionIds.length,
        answered: 0,
        correct: 0,
        pending: 0,
        incorrect: 0
      })
    }
    const st = studentMap.get(ans.student_id)
    st.answered++
    if (ans.is_correct === true) st.correct++
    else if (ans.is_correct === false) st.incorrect++
    else st.pending++
  })

  return { students: Array.from(studentMap.values()) }
}

export async function getStudentAnswersForExam(studentId: string, examId: string) {
  const supabase = await createClient()
  
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("created_at", { ascending: true })

  if (qError) throw new Error(qError.message)
  
  const questionIds = questions.map(q => q.id)
  
  if (questionIds.length === 0) return []

  const { data: answers, error: aError } = await supabase
    .from("answers")
    .select("*")
    .eq("student_id", studentId)
    .in("question_id", questionIds)
    
  if (aError) throw new Error(aError.message)

  const result = questions.map(q => {
    const ans = answers.find(a => a.question_id === q.id)
    return {
      question: q,
      answer: ans || null
    }
  })

  return result
}

export async function approveAnswer(answerId: string, isCorrect: boolean) {
  const currentTeacherId = await getCurrentTeacherId()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("answers")
    .update({ is_correct: isCorrect })
    .eq("id", answerId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  logAction("APPROVE_ANSWER", currentTeacherId, { answerId, isCorrect })
  return data
}


// ========================
// STUDENT ACTIONS
// ========================

export async function validateRoomCode(code: string) {
  if (!code || typeof code !== 'string') return null
  const formattedCode = code.trim().toUpperCase()
  if (!formattedCode) return null

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", formattedCode)
      .maybeSingle()

    if (error || !data) return null
    return data
  } catch (err) {
    return null
  }
}

export async function createStudent(name: string, roomId: string) {
  if (!name || !name.trim() || !roomId) {
    throw new Error("Неверное имя или код комнаты")
  }

  // Rate limiting student logins/joins
  const rl = rateLimit(`student_join_${roomId}`, 20, 60000)
  if (!rl.allowed) {
    throw new Error("Слишком много попыток входа. Пожалуйста, подождите минуту.")
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("students")
    .insert([{ name: name.trim(), room_id: roomId }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  const token = await signStudentToken(data.id, roomId)
  const cookieStore = await cookies()
  cookieStore.set("studentToken", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7 // 7 days max age
  })
  
  logAction("STUDENT_JOINED", data.id, { name, roomId })
  return data
}

export async function getStudent() {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (!token) return null

  const payload = await verifyStudentToken(token)
  if (!payload) return null
  
  const studentId = payload.studentId

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("students")
    .select("*, rooms(*)")
    .eq("id", studentId)
    .single()

  if (error) return null
  return data
}

export async function completeExam(studentId: string) {
  if (!studentId) throw new Error("ID студента обязателен")
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("students")
    .update({ exam_completed: true })
    .eq("id", studentId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  logAction("EXAM_COMPLETED", studentId)
  return data
}

export async function getQuestions(examId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

import { analyzeBehavior } from "./behavioral-analysis"

export async function saveAnswer(studentId: string, questionId: string, answerText: string) {
  if (!studentId || !questionId) throw new Error("ID студента и вопроса обязательны")

  // Server-side Behavioral Analysis
  const behavior = analyzeBehavior(studentId, (answerText || "").length)
  if (behavior.isSuspicious) {
    logAction("SECURITY_VIOLATION_BEHAVIOR", studentId, { reason: behavior.reason, questionId })
    throw new Error(`Блокировка: ${behavior.reason}`)
  }

  // Rate limit saves
  const rl = rateLimit(`save_ans_${studentId}`, 60, 60000)
  if (!rl.allowed) {
    throw new Error("Слишком частая отправка ответов")
  }

  const supabase = await createClient()
  
  const { data: existing, error: existError } = await supabase
    .from("answers")
    .select("id")
    .eq("student_id", studentId)
    .eq("question_id", questionId)
    .maybeSingle()

  if (existError) throw new Error(existError.message)

  if (existing) {
    const { data, error } = await supabase
      .from("answers")
      .update({ 
        answer_text: answerText || "",
        is_correct: null
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } else {
    const { data, error } = await supabase
      .from("answers")
      .insert([{ 
        student_id: studentId, 
        question_id: questionId, 
        answer_text: answerText || "",
        is_correct: null
      }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}

export async function saveAllAnswers(studentId: string, answers: Record<string, string>) {
  for (const [questionId, answerText] of Object.entries(answers)) {
    if (answerText && answerText.trim() !== "") {
      await saveAnswer(studentId, questionId, answerText);
    }
  }
}

export async function checkStudentExists(name: string, roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("students")
    .select("id")
    .eq("name", name)
    .eq("room_id", roomId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return !!data
}

// ========================
// CRUD OPERATIONS (TEACHER)
// ========================

async function getCurrentTeacherId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Не авторизован")
  return user.id
}

async function verifyRoomOwnership(roomId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .select("id")
    .eq("id", roomId)
    .eq("teacher_id", teacherId)
    .maybeSingle()
  if (error || !data) throw new Error("Нет доступа к этой аудитории")
}

async function verifyExamOwnership(examId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .select("id, rooms!inner(teacher_id)")
    .eq("id", examId)
    .eq("rooms.teacher_id", teacherId)
    .maybeSingle()
  if (error || !data) throw new Error("Нет доступа к этому экзамену")
}

async function verifyQuestionOwnership(questionId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .select("id, exams!inner(rooms!inner(teacher_id))")
    .eq("id", questionId)
    .eq("exams.rooms.teacher_id", teacherId)
    .maybeSingle()
  if (error || !data) throw new Error("Нет доступа к этому вопросу")
}

export async function deleteRoom(roomId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("rooms").delete().eq("id", roomId)
  if (error) throw new Error(error.message)
  logAction("DELETE_ROOM", teacherId, { roomId })
  return true
}

export async function updateRoom(roomId: string, name: string) {
  if (!name || !name.trim()) throw new Error("Название аудитории не может быть пустым")
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .update({ name: name.trim() })
    .eq("id", roomId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  logAction("UPDATE_ROOM", teacherId, { roomId, name })
  return data
}

export async function deleteExam(examId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("exams").delete().eq("id", examId)
  if (error) throw new Error(error.message)
  logAction("DELETE_EXAM", teacherId, { examId })
  return true
}

export async function updateExam(examId: string, title: string) {
  if (!title || !title.trim()) throw new Error("Название экзамена не может быть пустым")
  const teacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .update({ title: title.trim() })
    .eq("id", examId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  logAction("UPDATE_EXAM", teacherId, { examId, title })
  return data
}

export async function deleteQuestion(questionId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyQuestionOwnership(questionId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("questions").delete().eq("id", questionId)
  if (error) throw new Error(error.message)
  logAction("DELETE_QUESTION", teacherId, { questionId })
  return true
}

export async function updateQuestion(questionId: string, text: string) {
  if (!text || !text.trim()) throw new Error("Текст вопроса не может быть пустым")
  const teacherId = await getCurrentTeacherId()
  await verifyQuestionOwnership(questionId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .update({ text: text.trim() })
    .eq("id", questionId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  logAction("UPDATE_QUESTION", teacherId, { questionId })
  return data
}
