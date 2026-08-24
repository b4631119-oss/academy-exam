"use server"

import { createClient } from "./supabase/server"
import { createAdminClient } from "./supabase/admin"
import { cookies } from "next/headers"
import { verifyStudentToken } from "./jwt"
import { logAction } from "./logger"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Time limit (seconds) of the question at current_question_index (0-based over position-ordered questions)
function getCurrentQuestionTimeLimit(questions: any[] | undefined, currentIndex: number): number | null {
  if (!questions || questions.length === 0) return null
  const sorted = [...questions].sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
  const q = sorted[currentIndex] || sorted[0]
  return q?.time_limit_seconds ?? null
}

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
    .select("id, teacher_id")
    .eq("id", roomId)
    .maybeSingle()

  const roomTeacherId = data?.teacher_id ?? null
  const matches = roomTeacherId === teacherId

  console.error("[createTest room]", {
    roomTeacherId,
    currentTeacherId: teacherId,
    matches
  })

  if (error || !data || !matches) throw new Error("Нет доступа к этой аудитории")
}

async function verifyTestOwnership(testId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tests")
    .select("id, room_id, rooms!inner(teacher_id)")
    .eq("id", testId)
    .eq("rooms.teacher_id", teacherId)
    .maybeSingle()
  if (error || !data) throw new Error("Нет доступа к этому тесту")
  return data
}

export async function getTeacherTests(roomId: string) {
  if (!roomId || !UUID_REGEX.test(roomId)) {
    throw new Error("Невалидный ID комнаты")
  }

  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()

  // Verify room ownership
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, teacher_id")
    .eq("id", roomId)
    .maybeSingle()

  if (roomError || !room || room.teacher_id !== teacherId) {
    throw new Error("Нет доступа к этой аудитории")
  }

  const { data, error } = await supabase
    .from("tests")
    .select("*, test_questions(id)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map((test: any) => ({
    ...test,
    questions_count: test.test_questions ? test.test_questions.length : 0
  }))
}

export async function createTest(roomId: string, title: string, description?: string) {
  if (!roomId || !UUID_REGEX.test(roomId)) {
    throw new Error("Невалидный ID комнаты")
  }

  const trimmedTitle = title ? title.trim() : ""
  if (!trimmedTitle) {
    throw new Error("Название теста не может быть пустым")
  }
  if (trimmedTitle.length > 200) {
    throw new Error("Название теста слишком длинное (максимум 200 символов)")
  }

  const trimmedDescription = description ? description.trim() : ""
  if (trimmedDescription.length > 1000) {
    throw new Error("Описание слишком длинное (максимум 1000 символов)")
  }

  // 1 & 2. Verify teacher identity and room ownership before any database write
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)

  // 3. Perform insertion via admin client to bypass RETURNING/SELECT RLS subquery conflicts
  const supabaseAdmin = createAdminClient()
  const { data, error } = await supabaseAdmin
    .from("tests")
    .insert([
      {
        room_id: roomId,
        teacher_id: teacherId,
        title: trimmedTitle,
        description: trimmedDescription || null,
        status: "draft"
      }
    ])
    .select("id, room_id, teacher_id, title, description, status, created_at")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  console.error("[TEST DEBUG] createTest", {
    teacherId,
    roomId,
    testId: data.id,
    title: trimmedTitle,
    status: data.status
  })

  logAction("CREATE_TEST", teacherId, { testId: data.id, roomId, title: trimmedTitle })

  return data
}

export async function getTest(testId: string) {
  console.error("[ENV RUNTIME CHECK]", {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    nodeEnv: process.env.NODE_ENV
  })

  if (!testId || !UUID_REGEX.test(testId)) {
    throw new Error("Невалидный ID теста")
  }
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()

  const { data: test, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", testId)
    .maybeSingle()

  if (error || !test) {
    throw new Error("Тест не найден")
  }

  if (test.teacher_id !== teacherId) {
    throw new Error("Нет доступа к этому тесту")
  }

  return test
}

export async function getTestQuestions(testId: string) {
  if (!testId || !UUID_REGEX.test(testId)) {
    throw new Error("Невалидный ID теста")
  }
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()

  // 1. Verify test ownership
  const { data: test, error: testErr } = await supabase
    .from("tests")
    .select("id, teacher_id")
    .eq("id", testId)
    .maybeSingle()

  if (testErr || !test) {
    throw new Error("Тест не найден")
  }

  if (test.teacher_id !== teacherId) {
    throw new Error("Нет доступа к этому тесту")
  }

  // 2. Fetch questions with options
  const { data, error } = await supabase
    .from("test_questions")
    .select("*, test_options(*)")
    .eq("test_id", testId)
    .order("position", { ascending: true })

  if (error) throw new Error(error.message)

  return (data || []).map((q: any) => ({
    ...q,
    text: q.question_text || q.text || "",
    test_options: (q.test_options || [])
      .map((opt: any) => ({
        ...opt,
        text: opt.option_text || opt.text || ""
      }))
      .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
  }))
}

export async function deleteTestQuestion(questionId: string) {
  if (!questionId || !UUID_REGEX.test(questionId)) {
    throw new Error("Невалидный ID вопроса")
  }
  const teacherId = await getCurrentTeacherId()

  const supabase = await createClient()
  // Verify question ownership
  const { data: qData, error: qError } = await supabase
    .from("test_questions")
    .select("id, test_id, tests!inner(rooms!inner(teacher_id))")
    .eq("id", questionId)
    .eq("tests.rooms.teacher_id", teacherId)
    .maybeSingle()

  if (qError || !qData) {
    throw new Error("Вопрос не найден или нет доступа")
  }

  const { error } = await supabase.from("test_questions").delete().eq("id", questionId)
  if (error) throw new Error(error.message)

  logAction("DELETE_TEST_QUESTION", teacherId, { questionId })
  return true
}

export async function saveTestQuestions(
  testId: string,
  title: string,
  description: string,
  questions: Array<{
    id?: string
    text: string
    position: number
    time_limit_seconds: number
    points: number
    test_options: Array<{
      id?: string
      text: string
      position: number
      is_correct: boolean
    }>
  }>
) {
  if (!testId || !UUID_REGEX.test(testId)) {
    throw new Error("Невалидный ID теста")
  }
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()

  // 1. Verify test ownership directly
  const { data: test, error: testErr } = await supabase
    .from("tests")
    .select("id, teacher_id")
    .eq("id", testId)
    .maybeSingle()

  if (testErr || !test) {
    throw new Error("Тест не найден")
  }

  if (test.teacher_id !== teacherId) {
    throw new Error("Нет доступа к этому тесту")
  }

  // 2. TEST_LOCKED: block editing while an active session exists (lobby/running).
  // Editing is allowed again only after the session is finished (or no session yet).
  const { data: activeSession } = await supabase
    .from("test_sessions")
    .select("id, status")
    .eq("test_id", testId)
    .in("status", ["lobby", "running"])
    .order("created_at", { ascending: false })
    .maybeSingle()

  if (activeSession) {
    throw new Error(
      "TEST_LOCKED: Тест нельзя редактировать, пока активна сессия (лобби или тест запущен). Дождитесь завершения теста."
    )
  }

  const trimmedTitle = (title || "").trim()
  if (!trimmedTitle) {
    throw new Error("Название теста не может быть пустым")
  }
  if (trimmedTitle.length > 200) {
    throw new Error("Название теста слишком длинное (максимум 200 символов)")
  }

  const trimmedDesc = (description || "").trim()
  if (trimmedDesc.length > 1000) {
    throw new Error("Описание слишком длинное (максимум 1000 символов)")
  }

  // Validate questions array
  if (!Array.isArray(questions)) {
    throw new Error("Невалидные данные вопросов")
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const qIndex = i + 1
    const qText = (q.text || "").trim()

    if (!qText) {
      throw new Error(`Вопрос №${qIndex} не содержит текст`)
    }
    if (qText.length > 500) {
      throw new Error(`Текст вопроса №${qIndex} слишком длинный (максимум 500 символов)`)
    }

    const timeLimit = Number(q.time_limit_seconds)
    if (isNaN(timeLimit) || timeLimit < 5 || timeLimit > 300) {
      throw new Error(`Время на вопрос №${qIndex} должно быть от 5 до 300 секунд`)
    }

    const pts = Number(q.points)
    if (isNaN(pts) || pts < 5 || pts > 100) {
      throw new Error(`Баллы за вопрос №${qIndex} должны быть от 5 до 100`)
    }

    const opts = q.test_options || []
    if (opts.length < 2 || opts.length > 4) {
      throw new Error(`Вопрос №${qIndex} должен содержать от 2 до 4 вариантов ответа`)
    }

    let correctCount = 0
    for (let j = 0; j < opts.length; j++) {
      const opt = opts[j]
      const optLabel = String.fromCharCode(65 + j) // A, B, C, D
      const optText = (opt.text || "").trim()
      if (!optText) {
        throw new Error(`Вопрос №${qIndex}: Вариант ${optLabel} не должен быть пустым`)
      }
      if (optText.length > 300) {
        throw new Error(`Вопрос №${qIndex}: Вариант ${optLabel} слишком длинный (максимум 300 символов)`)
      }
      if (opt.is_correct) {
        correctCount++
      }
    }

    if (correctCount !== 1) {
      throw new Error(`Вопрос №${qIndex} должен иметь ровно ОДИН правильный вариант ответа`)
    }
  }

  // 3. Update Test title and description
  const { error: testUpdateErr } = await supabase
    .from("tests")
    .update({ title: trimmedTitle, description: trimmedDesc || null })
    .eq("id", testId)

  if (testUpdateErr) throw new Error(testUpdateErr.message)

  // 4. Fetch existing questions to delete removed ones
  const { data: existingQuestions } = await supabase
    .from("test_questions")
    .select("id")
    .eq("test_id", testId)

  const incomingIds = questions.filter((q) => q.id && UUID_REGEX.test(q.id)).map((q) => q.id!)
  const existingIds = (existingQuestions || []).map((q) => q.id)
  const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id))

  if (idsToDelete.length > 0) {
    await supabase.from("test_questions").delete().in("id", idsToDelete)
  }

  // 5. Save each question and its options
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const pos = i + 1

    let questionId = q.id

    if (questionId && UUID_REGEX.test(questionId) && existingIds.includes(questionId)) {
      // Update question
      const { error: qErr } = await supabase
        .from("test_questions")
        .update({
          question_text: q.text.trim(),
          position: pos,
          time_limit_seconds: q.time_limit_seconds,
          points: q.points
        })
        .eq("id", questionId)

      if (qErr) throw new Error(qErr.message)
    } else {
      // Insert new question
      const { data: newQ, error: qErr } = await supabase
        .from("test_questions")
        .insert([
          {
            test_id: testId,
            question_text: q.text.trim(),
            position: pos,
            time_limit_seconds: q.time_limit_seconds,
            points: q.points
          }
        ])
        .select()
        .single()

      if (qErr) throw new Error(qErr.message)
      questionId = newQ.id
    }

    // Process options for this question
    const { data: existingOpts } = await supabase
      .from("test_options")
      .select("id")
      .eq("question_id", questionId)

    const incomingOptIds = (q.test_options || []).filter((o) => o.id && UUID_REGEX.test(o.id)).map((o) => o.id!)
    const existingOptIds = (existingOpts || []).map((o) => o.id)
    const optIdsToDelete = existingOptIds.filter((id) => !incomingOptIds.includes(id))

    if (optIdsToDelete.length > 0) {
      await supabase.from("test_options").delete().in("id", optIdsToDelete)
    }

    for (let j = 0; j < q.test_options.length; j++) {
      const opt = q.test_options[j]
      const optPos = j + 1

      if (opt.id && UUID_REGEX.test(opt.id) && existingOptIds.includes(opt.id)) {
        const { error: optErr } = await supabase
          .from("test_options")
          .update({
            option_text: opt.text.trim(),
            position: optPos,
            is_correct: opt.is_correct
          })
          .eq("id", opt.id)

        if (optErr) throw new Error(optErr.message)
      } else {
        const { error: optErr } = await supabase.from("test_options").insert([
          {
            question_id: questionId,
            option_text: opt.text.trim(),
            position: optPos,
            is_correct: opt.is_correct
          }
        ])

        if (optErr) throw new Error(optErr.message)
      }
    }
  }

  logAction("SAVE_TEST_QUESTIONS", teacherId, { testId, questionCount: questions.length })
  return true
}

export async function createTestSession(testId: string) {
  if (!testId || !UUID_REGEX.test(testId)) {
    throw new Error("Невалидный ID теста")
  }
  const teacherId = await getCurrentTeacherId()
  const testObj = await verifyTestOwnership(testId, teacherId)

  const supabase = await createClient()

  // 1. Verify test validity: must have at least 1 question
  const { data: questions, error: qErr } = await supabase
    .from("test_questions")
    .select("id, question_text, test_options(id, option_text, is_correct)")
    .eq("test_id", testId)

  if (qErr) throw new Error(qErr.message)
  if (!questions || questions.length === 0) {
    throw new Error("Невозможно запустить тест: в тесте нет ни одного вопроса")
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const opts = q.test_options || []
    if (opts.length < 2 || opts.length > 4) {
      throw new Error(`Вопрос №${i + 1} должен содержать от 2 до 4 вариантов ответа`)
    }
    const correctCount = opts.filter((o: any) => o.is_correct).length
    if (correctCount !== 1) {
      throw new Error(`Вопрос №${i + 1} должен иметь ровно 1 правильный вариант ответа`)
    }
  }

  // 2. Check if active session already exists (lobby or running)
  const { data: existingSession } = await supabase
    .from("test_sessions")
    .select("*")
    .eq("test_id", testId)
    .in("status", ["lobby", "running"])
    .order("created_at", { ascending: false })
    .maybeSingle()

  if (existingSession) {
    return existingSession
  }

  // 3. Create new test_session record
  const { data: newSession, error: sErr } = await supabase
    .from("test_sessions")
    .insert([
      {
        test_id: testId,
        room_id: testObj.room_id,
        status: "lobby",
        current_question_index: 0,
        question_started_at: null,
        started_at: null,
        finished_at: null
      }
    ])
    .select()
    .single()

  if (sErr) throw new Error(sErr.message)

  // 4. Update test status to 'lobby'
  await supabase
    .from("tests")
    .update({ status: "lobby" })
    .eq("id", testId)

  logAction("CREATE_TEST_SESSION", teacherId, { sessionId: newSession.id, testId })
  return newSession
}

export async function getLobbyDetails(testId: string) {
  if (!testId || !UUID_REGEX.test(testId)) {
    throw new Error("Невалидный ID теста")
  }
  const teacherId = await getCurrentTeacherId()
  await verifyTestOwnership(testId, teacherId)

  const supabase = await createClient()

  // Get test details (questions included so the teacher lobby can show
  // question count and the time limit of the current question)
  const { data: test, error: tErr } = await supabase
    .from("tests")
    .select("*, rooms(*), test_questions(id, position, time_limit_seconds)")
    .eq("id", testId)
    .single()

  if (tErr) throw new Error(tErr.message)

  // Get latest session (including finished, so the teacher lobby keeps showing
  // the finished state instead of falling back to a "waiting" UI with a dead Start button)
  const { data: session } = await supabase
    .from("test_sessions")
    .select("*")
    .eq("test_id", testId)
    .in("status", ["lobby", "running", "finished"])
    .order("created_at", { ascending: false })
    .maybeSingle()

  let participants: any[] = []
  if (session) {
    const { data: pData } = await supabase
      .from("test_participants")
      .select("*, students(name)")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true })

    participants = (pData || []).map((p: any) => ({
      id: p.id,
      student_id: p.student_id,
      name: p.students?.name || "Ученик",
      created_at: p.created_at
    }))
  }

  return {
    test: test
      ? {
          ...test,
          test_questions: (test.test_questions || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
        }
      : test,
    session: session || null,
    participants
  }
}

export async function startTestSession(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }
  const teacherId = await getCurrentTeacherId()

  const supabase = await createClient()

  // Verify ownership of session
  const { data: session, error: sErr } = await supabase
    .from("test_sessions")
    .select("id, test_id, status, current_question_index, question_started_at, started_at, tests!inner(room_id, rooms!inner(teacher_id))")
    .eq("id", sessionId)
    .eq("tests.rooms.teacher_id", teacherId)
    .single()

  if (sErr || !session) {
    throw new Error("Сессия не найдена или нет доступа")
  }

  // Idempotent start: never reset the clock of an already running session
  if (session.status === "running") {
    return session
  }

  if (session.status === "finished") {
    throw new Error("Эта сессия уже завершена и не может быть запущена повторно")
  }

  // Check if there is at least 1 participant
  const { count, error: pErr } = await supabase
    .from("test_participants")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)

  if (pErr) throw new Error(pErr.message)
  if (!count || count === 0) {
    throw new Error("Нельзя начать тест: нет подключенных участников")
  }

  const now = new Date().toISOString()

  // Update test_sessions to running
  const { data: updatedSession, error: updateErr } = await supabase
    .from("test_sessions")
    .update({
      status: "running",
      started_at: now,
      current_question_index: 0,
      question_started_at: now
    })
    .eq("id", sessionId)
    .select()
    .single()

  if (updateErr) throw new Error(updateErr.message)

  // Update tests status to running
  await supabase
    .from("tests")
    .update({ status: "running" })
    .eq("id", session.test_id)

  logAction("START_TEST_SESSION", teacherId, { sessionId, testId: session.test_id })

  return updatedSession
}

async function getCurrentStudentVerified() {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (!token) throw new Error("Студент не авторизован (токен отсутствует)")

  const payload = await verifyStudentToken(token)
  if (!payload || !payload.studentId) {
    throw new Error("Студент не авторизован (токен невалиден)")
  }

  // Use admin client: students authenticate via custom JWT (not Supabase Auth),
  // so the regular server client has no auth session and RLS may block queries.
  const supabase = createAdminClient()
  const { data: student, error } = await supabase
    .from("students")
    .select("id, name, room_id")
    .eq("id", payload.studentId)
    .maybeSingle()

  if (error || !student) {
    throw new Error("Студент не найден")
  }

  return student
}

export async function startOrJoinStudentTest(testId: string) {
  if (!testId || !UUID_REGEX.test(testId)) {
    throw new Error("Невалидный ID теста")
  }

  const student = await getCurrentStudentVerified()
  // Use admin client: students authenticate via custom JWT (not Supabase Auth)
  const supabase = createAdminClient()

  // 1. Get test
  const { data: test, error: tErr } = await supabase
    .from("tests")
    .select("id, room_id, title, status")
    .eq("id", testId)
    .maybeSingle()

  if (tErr || !test) {
    console.error("[TEST DEBUG] startOrJoinStudentTest test lookup failed", { testId, studentId: student.id, error: tErr?.message })
    throw new Error("Тест не найден")
  }

  console.error("[TEST DEBUG] startOrJoinStudentTest", { testId, studentId: student.id, roomId: test.room_id, testStatus: test.status })

  // 2. Find or create active test_session for room & test
  let { data: session } = await supabase
    .from("test_sessions")
    .select("id, test_id, room_id, status")
    .eq("test_id", testId)
    .eq("room_id", test.room_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!session) {
    const { data: newSession, error: sErr } = await supabase
      .from("test_sessions")
      .insert([
        {
          test_id: testId,
          room_id: test.room_id,
          status: "running",
          current_question_index: 0
        }
      ])
      .select("id, test_id, room_id, status")
      .single()

    if (sErr || !newSession) {
      throw new Error(sErr?.message || "Ошибка создания сессии теста")
    }
    session = newSession
  }

  // 3. Find or create test_participant for current student
  let { data: participant } = await supabase
    .from("test_participants")
    .select("id, finished_at")
    .eq("session_id", session.id)
    .eq("student_id", student.id)
    .maybeSingle()

  if (!participant) {
    // Split student name into first/last for DB schema (test_participants requires first_name + last_name NOT NULL)
    const nameParts = (student.name || '').trim().split(/\s+/)
    const firstName = nameParts[0] || student.name || 'Student'
    const lastName = nameParts.slice(1).join(' ') || ''

    const { data: newParticipant, error: pErr } = await supabase
      .from("test_participants")
      .insert([
        {
          session_id: session.id,
          student_id: student.id,
          first_name: firstName,
          last_name: lastName
        }
      ])
      .select("id, finished_at")
      .single()

    if (pErr || !newParticipant) {
      throw new Error(pErr?.message || "Ошибка записи участника теста")
    }
    participant = newParticipant
  }

  logAction("START_OR_JOIN_STUDENT_TEST", student.id, { testId, sessionId: session.id, participantId: participant.id })

  return {
    session_id: session.id,
    participant_id: participant.id,
    test_id: testId,
    test_title: test.title || "Тест",
    is_finished: !!participant.finished_at
  }
}

export async function getStudentTestQuestions(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }

  const student = await getCurrentStudentVerified()
  // Use admin client: students authenticate via custom JWT (not Supabase Auth)
  const supabase = createAdminClient()

  // 1. Verify participant exists (no complex joins — avoids FK-related PostgREST errors)
  const { data: participantData, error: pErr } = await supabase
    .from("test_participants")
    .select("id, finished_at, session_id")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (pErr || !participantData) {
    throw new Error("Вы не являетесь участником этой сессии")
  }

  // 2. Fetch session separately
  const { data: sessionObj, error: sErr } = await supabase
    .from("test_sessions")
    .select("id, test_id")
    .eq("id", participantData.session_id)
    .maybeSingle()

  if (sErr || !sessionObj) {
    throw new Error("Сессия теста не найдена")
  }

  // 3. Fetch test details separately
  const { data: testObj, error: tErr } = await supabase
    .from("tests")
    .select("id, title, description")
    .eq("id", sessionObj.test_id)
    .maybeSingle()

  if (tErr || !testObj) {
    throw new Error("Тест не найден")
  }

  // 4. Parallel queries: questions (with options, WITHOUT is_correct) + existing student answers
  const [questionsRes, answersRes] = await Promise.all([
    supabase
      .from("test_questions")
      .select("id, question_text, position, time_limit_seconds, points, test_options(id, option_text, position)")
      .eq("test_id", sessionObj.test_id)
      .order("position", { ascending: true }),
    supabase
      .from("test_answers")
      .select("question_id, option_id")
      .eq("session_id", sessionId)
      .eq("participant_id", participantData.id)
  ])

  if (questionsRes.error) {
    throw new Error(questionsRes.error.message)
  }

  const questions = questionsRes.data || []
  const existingAnswers = answersRes.data || []

  const answerMap = new Map<string, string>()
  for (const ans of existingAnswers) {
    answerMap.set(ans.question_id, ans.option_id)
  }

  const formattedQuestions = questions.map((q: any) => ({
    id: q.id,
    question_text: q.question_text || q.text || "",
    text: q.question_text || q.text || "",
    position: q.position || 1,
    time_limit_seconds: q.time_limit_seconds || 15,
    points: q.points || 20,
    has_answered: answerMap.has(q.id),
    selected_option_id: answerMap.get(q.id) || null,
    options: (q.test_options || [])
      .map((opt: any) => ({
        id: opt.id,
        option_text: opt.option_text || opt.text || "",
        text: opt.option_text || opt.text || "",
        position: opt.position || 1
      }))
      .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
  }))

  logAction("GET_STUDENT_TEST_QUESTIONS", student.id, { sessionId, questionCount: formattedQuestions.length })

  return {
    session_id: sessionId,
    participant_id: participantData.id,
    test_id: sessionObj.test_id,
    test_title: (testObj as any).title || "Тест",
    test_description: (testObj as any).description || "",
    is_finished: !!participantData.finished_at,
    questions: formattedQuestions
  }
}

export async function submitStudentAnswer(sessionId: string, questionId: string, optionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId) || !questionId || !optionId) {
    throw new Error("Невалидные параметры ответа")
  }

  const student = await getCurrentStudentVerified()
  // Use admin client: students authenticate via custom JWT (not Supabase Auth),
  // so the regular server client has no auth session and RLS may block queries.
  const supabase = createAdminClient()

  // 1. Verify participant (no joins to avoid FK-related PostgREST errors)
  const { data: participant, error: pErr } = await supabase
    .from("test_participants")
    .select("id, finished_at, session_id")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (pErr || !participant) {
    console.error("[TEST ANSWER ERROR] participant lookup failed", { sessionId, studentId: student.id, error: pErr?.message })
    throw new Error("INVALID_PARTICIPANT_OR_SESSION")
  }

  if (participant.finished_at) {
    throw new Error("TEST_FINISHED_CANNOT_ANSWER: Попытка уже завершена")
  }

  // 2. Fetch session to get test_id
  const { data: sessionRow } = await supabase
    .from("test_sessions")
    .select("id, test_id")
    .eq("id", sessionId)
    .maybeSingle()

  const testId = sessionRow?.test_id
  if (!testId) {
    throw new Error("Сессия теста не найдена")
  }

  // 3. Verify option exists and get is_correct
  const { data: optionData, error: optErr } = await supabase
    .from("test_options")
    .select("id, question_id, is_correct")
    .eq("id", optionId)
    .eq("question_id", questionId)
    .maybeSingle()

  if (optErr || !optionData) {
    console.error("[TEST ANSWER ERROR] option verification failed", { sessionId, participantId: participant.id, questionId, optionId, error: optErr?.message })
    throw new Error("Вариант ответа не найден")
  }

  // 4. Verify question belongs to test and get points
  const { data: questionData } = await supabase
    .from("test_questions")
    .select("id, test_id, points")
    .eq("id", questionId)
    .eq("test_id", testId)
    .maybeSingle()

  if (!questionData) {
    throw new Error("Вопрос не принадлежит данному тесту")
  }

  const questionPoints = questionData.points || 20
  const isCorrect = !!optionData.is_correct
  const pointsEarned = isCorrect ? questionPoints : 0

  // 3. Fast Duplicate Answer Check
  const { data: existingAnswer } = await supabase
    .from("test_answers")
    .select("id")
    .eq("session_id", sessionId)
    .eq("participant_id", participant.id)
    .eq("question_id", questionId)
    .maybeSingle()

  if (existingAnswer) {
    return { success: true, already_answered: true }
  }

  // 4. Insert Answer
  const { error: insErr } = await supabase
    .from("test_answers")
    .insert([
      {
        session_id: sessionId,
        participant_id: participant.id,
        question_id: questionId,
        option_id: optionId,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        answered_at: new Date().toISOString()
      }
    ])

  if (insErr) {
    console.error("[TEST ANSWER ERROR] insert failed", { sessionId, participantId: participant.id, questionId, optionId, code: insErr.code, message: insErr.message })
    if (insErr.code === "23505") {
      return { success: true, already_answered: true }
    }
    throw new Error(insErr.message)
  }

  logAction("SUBMIT_STUDENT_ANSWER", student.id, { sessionId, questionId, optionId })

  return { success: true, question_id: questionId, option_id: optionId }
}

export async function finishStudentTest(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }

  const student = await getCurrentStudentVerified()
  // Use admin client: students authenticate via custom JWT (not Supabase Auth)
  const supabase = createAdminClient()

  const { data: participantData, error: pErr } = await supabase
    .from("test_participants")
    .select("id, finished_at")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (pErr || !participantData) {
    console.error("[TEST DEBUG] finishStudentTest participant lookup failed", { sessionId, studentId: student.id, error: pErr?.message })
    throw new Error("Участник сессии не найден")
  }

  const finishedAt = participantData.finished_at || new Date().toISOString()

  if (!participantData.finished_at) {
    const { error: finishErr } = await supabase
      .from("test_participants")
      .update({ finished_at: finishedAt })
      .eq("id", participantData.id)

    if (finishErr) {
      throw new Error(finishErr.message)
    }
  }

  // Fetch session to get test_id
  const { data: sessionRow } = await supabase
    .from("test_sessions")
    .select("id, test_id")
    .eq("id", sessionId)
    .maybeSingle()

  const testId = sessionRow?.test_id
  if (!testId) throw new Error("Сессия теста не найдена")

  const [questionsRes, answersRes] = await Promise.all([
    supabase
      .from("test_questions")
      .select("id, points")
      .eq("test_id", testId),
    supabase
      .from("test_answers")
      .select("id, question_id, is_correct, points_earned")
      .eq("session_id", sessionId)
      .eq("participant_id", participantData.id)
  ])

  const qList = questionsRes.data || []
  const ansList = answersRes.data || []

  const maxPoints = qList.reduce((acc, q) => acc + (q.points || 20), 0)
  const totalAnswered = ansList.length
  const totalCorrect = ansList.filter((a) => a.is_correct).length
  const totalPoints = ansList.reduce((acc, a) => acc + (a.points_earned || 0), 0)
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

  // Fetch test title/description separately
  const { data: testRow } = await supabase
    .from("tests")
    .select("title, description")
    .eq("id", testId)
    .maybeSingle()

  logAction("FINISH_STUDENT_TEST", student.id, { sessionId, totalPoints, percentage })

  return {
    session_id: sessionId,
    participant_id: participantData.id,
    test_title: (testRow as any)?.title || "Тест",
    test_description: (testRow as any)?.description || "",
    total_points: totalPoints,
    max_points: maxPoints,
    total_correct: totalCorrect,
    total_answered: totalAnswered,
    total_questions: qList.length,
    percentage,
    finished_at: finishedAt
  }
}

export async function getStudentTestResult(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }

  const student = await getCurrentStudentVerified()
  // Use admin client: students authenticate via custom JWT (not Supabase Auth)
  const supabase = createAdminClient()

  // 1. Verify participant (no complex joins to avoid FK-related PostgREST errors)
  const { data: participantData, error: pErr } = await supabase
    .from("test_participants")
    .select("id, finished_at")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (pErr || !participantData) {
    throw new Error("Вы не являетесь участником этой сессии")
  }

  // 2. Fetch session (include room_id for navigation back)
  const { data: sessionRow } = await supabase
    .from("test_sessions")
    .select("id, test_id, room_id")
    .eq("id", sessionId)
    .maybeSingle()

  const testId = sessionRow?.test_id
  const roomId = sessionRow?.room_id
  if (!testId) throw new Error("Сессия теста не найдена")

  // 3. Fetch test details
  const { data: testRow } = await supabase
    .from("tests")
    .select("title, description")
    .eq("id", testId)
    .maybeSingle()

  // 4. Parallel queries: questions (for max points) + student answers
  const [questionsRes, answersRes] = await Promise.all([
    supabase
      .from("test_questions")
      .select("id, points")
      .eq("test_id", testId),
    supabase
      .from("test_answers")
      .select("id, question_id, is_correct, points_earned")
      .eq("session_id", sessionId)
      .eq("participant_id", participantData.id)
  ])

  const qList = questionsRes.data || []
  const ansList = answersRes.data || []

  const maxPoints = qList.reduce((acc, q) => acc + (q.points || 20), 0)
  const totalAnswered = ansList.length
  const totalCorrect = ansList.filter((a) => a.is_correct).length
  const totalPoints = ansList.reduce((acc, a) => acc + (a.points_earned || 0), 0)
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

  logAction("GET_STUDENT_TEST_RESULT", student.id, { sessionId, totalPoints, percentage })

  return {
    test_title: (testRow as any)?.title || "Тест",
    test_description: (testRow as any)?.description || "",
    total_points: totalPoints,
    max_points: maxPoints,
    total_correct: totalCorrect,
    total_answered: totalAnswered,
    total_questions: qList.length,
    percentage,
    student_name: student.name || "Ученик",
    room_id: roomId || null
  }
}

// BACKWARD-COMPATIBLE WRAPPERS (LEGACY SUPPORT FOR UI)
export async function joinTestSessionAction(sessionCode: string) {
  if (!sessionCode || !sessionCode.trim()) {
    throw new Error("Введите код для подключения к тесту")
  }

  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const cleanCode = sessionCode.trim().toUpperCase()

  let targetRoomId = student.room_id
  const { data: roomByCode } = await supabase
    .from("rooms")
    .select("id")
    .eq("code", cleanCode)
    .maybeSingle()

  if (roomByCode) {
    targetRoomId = roomByCode.id
  }

  const { data: activeTest } = await supabase
    .from("tests")
    .select("id")
    .eq("room_id", targetRoomId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!activeTest) {
    throw new Error("Нет активного теста по данному коду")
  }

  return await startOrJoinStudentTest(activeTest.id)
}

export async function getStudentTestSessionStatus(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }

  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()

  const { data: participant } = await supabase
    .from("test_participants")
    .select("id, finished_at")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (!participant) {
    throw new Error("Сессия не найдена или вы не являетесь её участником")
  }

  const { data: session } = await supabase
    .from("test_sessions")
    .select("id, test_id, status, tests(title, description, test_questions(id))")
    .eq("id", sessionId)
    .maybeSingle()

  const testObj = (session?.tests as any) || {}

  return {
    status: (participant.finished_at ? "finished" : session?.status || "running") as "lobby" | "running" | "finished",
    session_id: sessionId,
    test_id: session?.test_id || "",
    current_question_index: 0,
    title: testObj.title || "Тест",
    description: testObj.description || "",
    question_count: testObj.test_questions ? testObj.test_questions.length : 0,
    time_limit_seconds: 15,
    student_name: student.name || "Ученик"
  }
}

export async function getCurrentTestQuestionAction(sessionId: string) {
  const data = await getStudentTestQuestions(sessionId)
  const qList = data.questions || []
  const firstQ = qList[0] || {
    id: "",
    question_text: "",
    position: 1,
    time_limit_seconds: 15,
    points: 20,
    options: []
  }

  return {
    participant_id: data.participant_id,
    question_id: firstQ.id,
    question_text: firstQ.question_text || (firstQ as any).text || "",
    position: firstQ.position,
    total_questions: qList.length,
    time_limit_seconds: firstQ.time_limit_seconds || 15,
    points: firstQ.points || 20,
    has_answered: firstQ.has_answered || false,
    selected_option_id: firstQ.selected_option_id || null,
    options: firstQ.options || []
  }
}

export async function submitTestAnswerAction(
  participantId: string,
  questionId: string,
  optionId: string
) {
  const supabase = createAdminClient()
  const { data: participant } = await supabase
    .from("test_participants")
    .select("session_id")
    .eq("id", participantId)
    .maybeSingle()

  const sessionId = participant?.session_id || participantId
  return await submitStudentAnswer(sessionId, questionId, optionId)
}

export async function getMyTestResultAction(sessionId: string) {
  return await getStudentTestResult(sessionId)
}

export async function advanceTestQuestion(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }

  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()

  // Verify ownership of session
  const { data: session, error: sErr } = await supabase
    .from("test_sessions")
    .select("id, test_id, status, current_question_index, tests!inner(room_id, rooms!inner(teacher_id))")
    .eq("id", sessionId)
    .eq("tests.rooms.teacher_id", teacherId)
    .single()

  if (sErr || !session) {
    throw new Error("Сессия не найдена или нет доступа")
  }

  if (session.status !== "running") {
    throw new Error("Сессия не находится в состоянии проведения теста")
  }

  // Get total question count
  const { data: questions, error: qErr } = await supabase
    .from("test_questions")
    .select("id")
    .eq("test_id", session.test_id)
    .order("position", { ascending: true })

  if (qErr || !questions || questions.length === 0) {
    throw new Error("В тесте не найдены вопросы")
  }

  const expectedIndex = session.current_question_index || 0
  const nextIndex = expectedIndex + 1
  const now = new Date().toISOString()

  // Atomic advance: only one concurrent call may win (WHERE clauses act as an
  // optimistic lock on the expected index). The loser gets SESSION_STATE_CHANGED.
  const { data: updatedSession, error: uErr } = await supabase
    .from("test_sessions")
    .update(
      nextIndex < questions.length
        ? {
            current_question_index: nextIndex,
            question_started_at: now
          }
        : {
            status: "finished",
            finished_at: now,
            question_started_at: null
          }
    )
    .eq("id", sessionId)
    .eq("status", "running")
    .eq("current_question_index", expectedIndex)
    .select()
    .maybeSingle()

  if (uErr) throw new Error(uErr.message)
  if (!updatedSession) {
    throw new Error("SESSION_STATE_CHANGED: состояние сессии изменилось, повторите попытку")
  }

  if (nextIndex >= questions.length) {
    // Test finished — sync the tests table status
    await supabase
      .from("tests")
      .update({ status: "finished" })
      .eq("id", session.test_id)

    logAction("FINISH_TEST_SESSION", teacherId, { sessionId, testId: session.test_id })
  } else {
    logAction("ADVANCE_TEST_QUESTION", teacherId, { sessionId, nextIndex })
  }

  return updatedSession
}



export async function getTestSessionResults(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()

  // 1. Verify the teacher owns this session (session -> test -> room -> teacher)
  const { data: session, error: sErr } = await supabase
    .from("test_sessions")
    .select("id, test_id, status, tests!inner(id, title, room_id, rooms!inner(teacher_id))")
    .eq("id", sessionId)
    .eq("tests.rooms.teacher_id", teacherId)
    .maybeSingle()

  if (sErr || !session) {
    throw new Error("Сессия не найдена или нет доступа")
  }

  // 2. Parallel queries: questions, participant count, answers, and participants (for student names)
  const [questionsRes, participantsCountRes, answersRes, participantsRes] = await Promise.all([
    supabase
      .from("test_questions")
      .select("id, points")
      .eq("test_id", session.test_id),
    supabase
      .from("test_participants")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId),
    supabase
      .from("test_answers")
      .select("participant_id, question_id, is_correct, points_earned")
      .eq("session_id", sessionId),
    supabase
      .from("test_participants")
      .select("id, student_id, first_name, last_name")
      .eq("session_id", sessionId)
  ])

  const qList = questionsRes.data || []
  const maxPoints = qList.reduce((acc, q) => acc + (q.points || 20), 0)
  const totalQuestions = qList.length
  const participantCount = participantsCountRes.count || 0
  const answers = answersRes.data || []

  // Build participant → student name map
  const participantNameMap = new Map<string, string>()
  for (const p of (participantsRes.data || [])) {
    participantNameMap.set(p.id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Ученик")
  }

  const perStudent = new Map<string, any>()
  for (const ans of answers) {
    let s = perStudent.get(ans.participant_id)
    if (!s) {
      s = {
        participant_id: ans.participant_id,
        name: participantNameMap.get(ans.participant_id) || "Ученик",
        total_correct: 0,
        total_answered: 0,
        total_points: 0
      }
      perStudent.set(ans.participant_id, s)
    }
    s.total_answered++
    if (ans.is_correct) {
      s.total_correct++
      const qObj = qList.find((q) => q.id === ans.question_id)
      s.total_points += qObj?.points || 20
    }
  }

  const results = Array.from(perStudent.values())
    .map((s) => ({
      ...s,
      max_points: maxPoints,
      total_questions: totalQuestions,
      percentage: maxPoints > 0 ? Math.round((s.total_points / maxPoints) * 100) : 0
    }))
    .sort((a, b) => b.total_points - a.total_points)

  return {
    session_id: sessionId,
    status: session.status,
    title: (session.tests as any)?.title || "Тест",
    max_points: maxPoints,
    total_questions: totalQuestions,
    total_participants: participantCount,
    results
  }
}




