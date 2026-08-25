"use server"

import { createClient } from "./supabase/server"
import { createAdminClient } from "./supabase/admin"
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
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)

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

  const supabase = createAdminClient()
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
  let targetStudentId = studentId

  // Check if caller is Teacher
  let isTeacher = false
  try {
    const currentTeacherId = await getCurrentTeacherId()
    await verifyExamOwnership(examId, currentTeacherId)
    isTeacher = true
  } catch {
    isTeacher = false
  }

  if (!isTeacher) {
    // Caller is Student -> must match verified student identity
    const verifiedStudentId = await getVerifiedStudentId()
    if (studentId && studentId !== verifiedStudentId) {
      throw new Error("AUTHORIZATION_ERROR: Вы не можете просматривать ответы других студентов")
    }
    targetStudentId = verifiedStudentId
  }

  const supabase = createAdminClient()
  
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
    .eq("student_id", targetStudentId)
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

  const supabase = createAdminClient()

  // Ensure the answer belongs to a question owned by this teacher
  const { data: answerRow, error: fetchErr } = await supabase
    .from("answers")
    .select("id, question_id")
    .eq("id", answerId)
    .maybeSingle()

  if (fetchErr) throw new Error(fetchErr.message)
  if (!answerRow) throw new Error("NOT_FOUND: Ответ не найден")

  try {
    await verifyQuestionOwnership(answerRow.question_id, currentTeacherId)
  } catch (e) {
    throw new Error("AUTHORIZATION_ERROR: Нет доступа к этому ответу")
  }

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

export async function getVerifiedStudentId(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (!token) {
    throw new Error("AUTHORIZATION_ERROR: Токен студента не найден")
  }
  const payload = await verifyStudentToken(token)
  if (!payload || !payload.studentId) {
    throw new Error("AUTHORIZATION_ERROR: Недействительный токен студента")
  }
  return payload.studentId
}

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

// Clears the student session cookie (JWT lives 7 days, so explicit logout /
// room switch is the only way out). Does NOT delete any student data —
// answers, results and participants stay in the DB.
export async function studentLogout() {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value

  if (token) {
    const payload = await verifyStudentToken(token)
    if (payload?.studentId) {
      logAction("STUDENT_LOGOUT", payload.studentId)
    }
  }

  cookieStore.set("studentToken", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0
  })
}

export async function getStudent() {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (!token) return null

  const payload = await verifyStudentToken(token)
  if (!payload) return null
  
  const studentId = payload.studentId

  // Use admin client: students authenticate via custom JWT (not Supabase Auth),
  // so the regular server client has no auth session and RLS may block queries.
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("students")
    .select("*, rooms(*)")
    .eq("id", studentId)
    .single()

  if (error) return null
  return data
}

export async function getStudentRoomAssignments(roomId: string) {
  const studentId = await getVerifiedStudentId()

  // Use admin client for read queries: students authenticate via custom JWT
  // (not Supabase Auth), so the regular server client has no auth session
  // and RLS policies would block access to tests/exams.
  const supabase = createAdminClient()

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, room_id")
    .eq("id", studentId)
    .maybeSingle()

  if (studentError || !student) {
    console.error("[TEST DEBUG] getStudentRoomAssignments student lookup failed", { studentId, studentError: studentError?.message })
    throw new Error("Студент не найден")
  }

  if (student.room_id !== roomId) {
    console.error("[TEST DEBUG] getStudentRoomAssignments room mismatch", { studentId, studentRoomId: student.room_id, requestedRoomId: roomId })
    throw new Error("Доступ к этой аудитории запрещён")
  }

  const [examsRes, testsRes] = await Promise.all([
    supabase
      .from("exams")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false }),
    supabase
      .from("tests")
      .select("*, test_questions(id)")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
  ])

  if (examsRes.error) throw new Error(examsRes.error.message)
  if (testsRes.error) throw new Error(testsRes.error.message)

  console.error("[TEST DEBUG] getStudentRoomAssignments", {
    studentId,
    roomId,
    testsFound: testsRes.data?.length ?? 0,
    examsFound: examsRes.data?.length ?? 0
  })

  return {
    exams: (examsRes.data || []).map((exam: any) => ({
      ...exam,
      type: "exam",
      question_count: exam.question_count ?? 0,
      description: exam.description || ""
    })),
    tests: (testsRes.data || []).map((test: any) => ({
      ...test,
      type: "test",
      title: test.title || "Тест",
      description: test.description || "",
      question_count: Array.isArray(test.test_questions) ? test.test_questions.length : 0
    }))
  }
}

export async function completeExam(studentId: string) {
  const verifiedStudentId = await getVerifiedStudentId()
  if (studentId && studentId !== verifiedStudentId) {
    throw new Error("AUTHORIZATION_ERROR: Нельзя завершить экзамен от имени другого студента")
  }

  // Exam completion is determined by saved answers in the answers table.
  // The students.exam_completed column was never applied to the DB and is never read
  // by getExamResults / getStudentAnswersForExam / result page — so we skip writing it.
  logAction("EXAM_COMPLETED", verifiedStudentId)
  return { id: verifiedStudentId, exam_completed: true }
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
  if (!questionId) throw new Error("ID вопроса обязателен")

  const verifiedStudentId = await getVerifiedStudentId()
  if (studentId && studentId !== verifiedStudentId) {
    throw new Error("AUTHORIZATION_ERROR: Отправка ответа от имени другого студента запрещена")
  }

  // Behavioral analysis — LOG ONLY, never block answer saving.
  // A legitimate student typing fast should never be prevented from saving.
  const behavior = analyzeBehavior(verifiedStudentId, (answerText || "").length)
  if (behavior.isSuspicious) {
    logAction("SECURITY_VIOLATION_BEHAVIOR", verifiedStudentId, { reason: behavior.reason, questionId })
    // Do NOT throw — answer is still saved; teacher can review flagged sessions
  }

  // Rate limit saves — generous limit for exam submissions
  const rl = rateLimit(`save_ans_${verifiedStudentId}`, 120, 60000)
  if (!rl.allowed) {
    logAction("RATE_LIMIT_EXAM_SAVE", verifiedStudentId, { questionId })
    // Do NOT throw — answer is still saved; rate limit is advisory only
  }

  const supabase = createAdminClient()
  
  const { data: existing, error: existError } = await supabase
    .from("answers")
    .select("id")
    .eq("student_id", verifiedStudentId)
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
        student_id: verifiedStudentId, 
        question_id: questionId, 
        answer_text: answerText || "",
        is_correct: null
      }])
      .select()
      .single()

    if (error) {
      // Race condition: concurrent insert may have created the row between
      // our SELECT and INSERT. UNIQUE constraint (23505) → fall back to UPDATE.
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("answers")
          .select("id")
          .eq("student_id", verifiedStudentId)
          .eq("question_id", questionId)
          .maybeSingle()
        if (existing) {
          const { data: updated, error: updErr } = await supabase
            .from("answers")
            .update({ answer_text: answerText || "", is_correct: null })
            .eq("id", existing.id)
            .select()
            .single()
          if (updErr) throw new Error(updErr.message)
          return updated
        }
      }
      throw new Error(error.message)
    }
    return data
  }
}

export async function saveAllAnswers(studentId: string, answers: Record<string, string>) {
  const verifiedStudentId = await getVerifiedStudentId()
  if (studentId && studentId !== verifiedStudentId) {
    throw new Error("AUTHORIZATION_ERROR: Нельзя сохранять ответы чужого студента")
  }

  // Batch save: use admin client to upsert all answers at once.
  // We bypass saveAnswer() loop because it triggers behavioral-analysis
  // rapid-fire detection and rate-limiting on sequential calls.
  const supabase = createAdminClient()
  const entries = Object.entries(answers).filter(([, text]) => text && text.trim() !== "")

  if (entries.length === 0) return []

  // For each answer, upsert (insert or update)
  const results: any[] = []
  for (const [questionId, answerText] of entries) {
    // Check existing
    const { data: existing } = await supabase
      .from("answers")
      .select("id")
      .eq("student_id", verifiedStudentId)
      .eq("question_id", questionId)
      .maybeSingle()

    if (existing) {
      const { data, error } = await supabase
        .from("answers")
        .update({ answer_text: answerText, is_correct: null })
        .eq("id", existing.id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      results.push(data)
    } else {
      const { data, error } = await supabase
        .from("answers")
        .insert([{
          student_id: verifiedStudentId,
          question_id: questionId,
          answer_text: answerText,
          is_correct: null
        }])
        .select()
        .single()
      if (error) {
        // Race condition: concurrent insert → UNIQUE constraint (23505) → fall back to UPDATE
        if (error.code === "23505") {
          const { data: retryExisting } = await supabase
            .from("answers")
            .select("id")
            .eq("student_id", verifiedStudentId)
            .eq("question_id", questionId)
            .maybeSingle()
          if (retryExisting) {
            const { data: updated, error: updErr } = await supabase
              .from("answers")
              .update({ answer_text: answerText, is_correct: null })
              .eq("id", retryExisting.id)
              .select()
              .single()
            if (updErr) throw new Error(updErr.message)
            results.push(updated)
            continue
          }
        }
        throw new Error(error.message)
      }
      results.push(data)
    }
  }

  return results
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
