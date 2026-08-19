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

  logAction("CREATE_TEST", teacherId, { testId: data.id, roomId, title: trimmedTitle })

  return data
}

export async function getTest(testId: string) {
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
    test_options: (q.test_options || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
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
    // Range matches the constructor UI (0.5–10 minutes = 30–600 seconds).
    // Min stays at 1 so previously saved low values (e.g. 15s) keep working.
    if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 600) {
      throw new Error(`Время на вопрос №${qIndex} должно быть от 1 до 600 секунд (0.5–10 минут)`)
    }

    const pts = Number(q.points)
    if (isNaN(pts) || pts <= 0) {
      throw new Error(`Баллы за вопрос №${qIndex} должны быть больше 0`)
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
          text: q.text.trim(),
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
            text: q.text.trim(),
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
            text: opt.text.trim(),
            position: optPos,
            is_correct: opt.is_correct
          })
          .eq("id", opt.id)

        if (optErr) throw new Error(optErr.message)
      } else {
        const { error: optErr } = await supabase.from("test_options").insert([
          {
            question_id: questionId,
            text: opt.text.trim(),
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
    .select("id, text, test_options(id, text, is_correct)")
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

  const supabase = await createClient()
  const { data: student, error } = await supabase
    .from("students")
    .select("*, rooms(*)")
    .eq("id", payload.studentId)
    .single()

  if (error || !student) {
    throw new Error("Студент не найден")
  }

  return student
}

export async function joinTestSessionAction(sessionCode: string) {
  if (!sessionCode || !sessionCode.trim()) {
    throw new Error("Введите код для подключения к тесту")
  }

  const student = await getCurrentStudentVerified()
  const supabase = await createClient()
  const cleanCode = sessionCode.trim().toUpperCase()

  // Resolve the target room by code (the student's own room is the default)
  let targetRoomId = student.room_id
  const { data: roomByCode } = await supabase
    .from("rooms")
    .select("id")
    .eq("code", cleanCode)
    .maybeSingle()

  if (roomByCode) {
    targetRoomId = roomByCode.id
  }

  // Find the active session (lobby or running) in the target room
  const { data: activeSession, error: sErr } = await supabase
    .from("test_sessions")
    .select("*, tests!inner(id, title, status, room_id, test_questions(id))")
    .eq("room_id", targetRoomId)
    .in("status", ["lobby", "running"])
    .order("created_at", { ascending: false })
    .maybeSingle()

  if (sErr || !activeSession) {
    const { data: finishedSession } = await supabase
      .from("test_sessions")
      .select("id, status")
      .eq("room_id", targetRoomId)
      .eq("status", "finished")
      .maybeSingle()

    if (finishedSession) {
      throw new Error("TEST_ALREADY_FINISHED: Тест уже завершён")
    }
    throw new Error("Нет активного теста по данному коду")
  }

  // Existing participants keep working regardless of session status.
  // New students may join ONLY while the session is in the lobby.
  const { data: existingParticipant } = await supabase
    .from("test_participants")
    .select("id")
    .eq("session_id", activeSession.id)
    .eq("student_id", student.id)
    .maybeSingle()

  if (!existingParticipant) {
    if (activeSession.status === "running") {
      throw new Error("TEST_ALREADY_STARTED: Тест уже начался. Подключение новых учеников невозможно.")
    }
    if (activeSession.status === "finished") {
      throw new Error("TEST_ALREADY_FINISHED: Тест уже завершён")
    }
  }

  // 1. Try calling the database RPC join_test_session
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("join_test_session", {
      p_student_id: student.id,
      p_session_code: cleanCode
    })

    if (!rpcError && rpcData) {
      logAction("STUDENT_JOINED_TEST_RPC", student.id, { cleanCode })
      return rpcData
    }
  } catch (e) {
    console.warn("RPC join_test_session error/fallback:", e)
  }

  // 2. Fallback direct join logic via server client
  let participantId = existingParticipant?.id

  if (!participantId) {
    const { data: newParticipant, error: pErr } = await supabase
      .from("test_participants")
      .insert([
        {
          session_id: activeSession.id,
          student_id: student.id
        }
      ])
      .select("id")
      .single()

    if (pErr) throw new Error(pErr.message)
    participantId = newParticipant.id
  }

  logAction("STUDENT_JOINED_TEST", student.id, { sessionId: activeSession.id })

  return {
    participant_id: participantId,
    session_id: activeSession.id,
    test_id: activeSession.test_id,
    test_title: activeSession.tests?.title || "Тест",
    session_status: activeSession.status,
    question_count: activeSession.tests?.test_questions?.length || 0
  }
}

export async function getStudentTestSessionStatus(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }

  const student = await getCurrentStudentVerified()
  const supabase = await createClient()

  // Verify student is participant in this session
  const { data: participant, error: pErr } = await supabase
    .from("test_participants")
    .select(`
      id,
      session_id,
      student_id,
      test_sessions!inner(
        id,
        test_id,
        status,
        current_question_index,
        tests!inner(
          title,
          description,
          test_questions(id, position, time_limit_seconds)
        )
      )
    `)
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (pErr || !participant) {
    throw new Error("Сессия не найдена или вы не являетесь её участником")
  }

  const sessionObj = (participant.test_sessions as any) || {}
  const testObj = (sessionObj.tests as any) || {}

  return {
    status: sessionObj.status as "lobby" | "running" | "finished",
    session_id: sessionObj.id,
    test_id: sessionObj.test_id,
    current_question_index: sessionObj.current_question_index || 0,
    title: testObj.title || "Тест",
    description: testObj.description || "",
    question_count: testObj.test_questions ? testObj.test_questions.length : 0,
    time_limit_seconds: getCurrentQuestionTimeLimit(testObj.test_questions, sessionObj.current_question_index || 0),
    student_name: student.name || "Ученик"
  }
}

export async function getCurrentTestQuestionAction(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("INVALID_PARTICIPANT_OR_SESSION")
  }

  const student = await getCurrentStudentVerified()
  const supabase = await createClient()

  // 1. Get participant for this session & student
  const { data: participant, error: pErr } = await supabase
    .from("test_participants")
    .select("id, session_id, student_id")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (pErr || !participant) {
    throw new Error("INVALID_PARTICIPANT_OR_SESSION")
  }

  // 2. Call Supabase RPC get_current_test_question
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_current_test_question", {
      p_student_id: student.id,
      p_participant_id: participant.id
    })

    if (!rpcError && rpcData) {
      logAction("GET_CURRENT_QUESTION_RPC", student.id, { sessionId })
      return {
        ...rpcData,
        participant_id: participant.id
      }
    }
  } catch (e) {
    console.warn("RPC get_current_test_question error/fallback:", e)
  }

  // 3. Fallback query if RPC does not return data directly
  const { data: session, error: sErr } = await supabase
    .from("test_sessions")
    .select("id, test_id, status, current_question_index, question_started_at")
    .eq("id", sessionId)
    .single()

  if (sErr || !session || session.status !== "running") {
    throw new Error("CURRENT_QUESTION_NOT_FOUND_OR_NOT_STARTED")
  }

  // Get total question count for test
  const { data: allQuestions } = await supabase
    .from("test_questions")
    .select("id, text, position, time_limit_seconds, points")
    .eq("test_id", session.test_id)
    .order("position", { ascending: true })

  if (!allQuestions || allQuestions.length === 0) {
    throw new Error("CURRENT_QUESTION_NOT_FOUND_OR_NOT_STARTED")
  }

  const totalQuestions = allQuestions.length
  const qIndex = session.current_question_index || 0

  if (qIndex < 0 || qIndex >= totalQuestions) {
    throw new Error("CURRENT_QUESTION_NOT_FOUND_OR_NOT_STARTED")
  }

  const currentQ = allQuestions[qIndex]

  // Get options for current question WITHOUT is_correct
  const { data: options } = await supabase
    .from("test_options")
    .select("id, text, position")
    .eq("question_id", currentQ.id)
    .order("position", { ascending: true })

  // Check if student has already answered this question
  const { data: existingAnswer } = await supabase
    .from("test_answers")
    .select("id, option_id")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .eq("question_id", currentQ.id)
    .maybeSingle()

  logAction("GET_CURRENT_QUESTION", student.id, { questionId: currentQ.id })

  return {
    participant_id: participant.id,
    question_id: currentQ.id,
    question_text: currentQ.text,
    position: qIndex + 1,
    total_questions: totalQuestions,
    time_limit_seconds: currentQ.time_limit_seconds || 15,
    points: currentQ.points || 20,
    question_started_at: session.question_started_at,
    has_answered: !!existingAnswer,
    selected_option_id: existingAnswer?.option_id || null,
    options: (options || []).map((opt) => ({
      id: opt.id,
      option_text: opt.text,
      position: opt.position
    }))
  }
}

export async function submitTestAnswerAction(
  participantId: string,
  questionId: string,
  optionId: string
) {
  if (!participantId || !questionId || !optionId) {
    throw new Error("Неверные параметры ответа")
  }

  const student = await getCurrentStudentVerified()
  const supabase = await createClient()

  // 1. Verify participant ownership
  const { data: participant, error: pErr } = await supabase
    .from("test_participants")
    .select("id, session_id, student_id, test_sessions!inner(id, test_id, status, current_question_index, question_started_at)")
    .eq("id", participantId)
    .eq("student_id", student.id)
    .single()

  if (pErr || !participant) {
    throw new Error("INVALID_PARTICIPANT_OR_SESSION")
  }

  // 2. Call Supabase RPC submit_test_answer
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("submit_test_answer", {
      p_student_id: student.id,
      p_participant_id: participantId,
      p_question_id: questionId,
      p_option_id: optionId
    })

    if (rpcError) {
      // Any DB-level RPC error is authoritative: propagate it, never fall through.
      const errMsg = rpcError.message || ""
      if (errMsg.includes("QUESTION_TIME_EXCEEDED") || errMsg.includes("time") || errMsg.includes("expired")) {
        throw new Error("QUESTION_TIME_EXCEEDED")
      }
      if (errMsg.includes("ALREADY_ANSWERED") || errMsg.includes("duplicate")) {
        return { success: true, already_answered: true }
      }
      throw new Error(errMsg)
    }

    logAction("SUBMIT_TEST_ANSWER_RPC", student.id, { questionId, optionId })
    return { success: true, ...(rpcData || {}) }
  } catch (e: any) {
    const msg = e?.message || ""
    // Known business errors reach the client as-is.
    if (msg === "QUESTION_TIME_EXCEEDED" || msg === "QUESTION_NOT_CURRENT" || msg === "QUESTION_NOT_STARTED") {
      throw e
    }
    // Only genuine transient failures (network / RPC unavailable) may use the fallback.
    if (!/failed to fetch|fetch failed|network|load failed|abort|econn|timeout|unavailable/i.test(msg)) {
      throw e
    }
    console.warn("RPC submit_test_answer unavailable (transient), using fallback:", e)
  }

  // 3. Fallback direct answer submission via server client & RLS
  const sessionObj = participant.test_sessions as any

  if (!sessionObj || sessionObj.status !== "running") {
    throw new Error("CURRENT_QUESTION_NOT_FOUND_OR_NOT_STARTED")
  }

  // Ensure the question being answered is the CURRENT one.
  // Answers for a previous question must be rejected after the teacher advances.
  const { data: sessionQuestions } = await supabase
    .from("test_questions")
    .select("id, position")
    .eq("test_id", sessionObj.test_id)
    .order("position", { ascending: true })

  const qIndex = sessionObj.current_question_index || 0
  const currentQuestion = (sessionQuestions || [])[qIndex]
  if (!currentQuestion || currentQuestion.id !== questionId) {
    throw new Error("QUESTION_NOT_CURRENT")
  }

  // question_started_at is the source of truth for the time budget.
  // Without it the fallback cannot validate timing and must reject the answer.
  if (!sessionObj.question_started_at) {
    throw new Error("QUESTION_NOT_STARTED")
  }

  // Strict timeout: no grace period.
  const { data: qObj } = await supabase
    .from("test_questions")
    .select("time_limit_seconds")
    .eq("id", questionId)
    .single()

  const timeLimit = qObj?.time_limit_seconds || 15
  const startedAt = new Date(sessionObj.question_started_at).getTime()
  const elapsedSeconds = (Date.now() - startedAt) / 1000

  if (elapsedSeconds > timeLimit) {
    throw new Error("QUESTION_TIME_EXCEEDED")
  }

  // The option must belong to the question being answered
  const { data: optObj } = await supabase
    .from("test_options")
    .select("is_correct")
    .eq("id", optionId)
    .eq("question_id", questionId)
    .maybeSingle()

  if (!optObj) {
    throw new Error("OPTION_NOT_FOR_QUESTION")
  }

  const isCorrect = !!optObj?.is_correct

  // Check existing answer
  const { data: existingAnswer } = await supabase
    .from("test_answers")
    .select("id")
    .eq("session_id", participant.session_id)
    .eq("student_id", student.id)
    .eq("question_id", questionId)
    .maybeSingle()

  if (existingAnswer) {
    return { success: true, already_answered: true }
  }

  // Insert answer
  const { error: insErr } = await supabase
    .from("test_answers")
    .insert([
      {
        session_id: participant.session_id,
        participant_id: participantId,
        student_id: student.id,
        question_id: questionId,
        option_id: optionId,
        is_correct: isCorrect
      }
    ])

  if (insErr) {
    if (insErr.code === "23505") {
      return { success: true, already_answered: true }
    }
    throw new Error(insErr.message)
  }

  logAction("SUBMIT_TEST_ANSWER", student.id, { questionId, optionId, isCorrect })

  return { success: true, is_correct: isCorrect }
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

export async function getMyTestResultAction(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }

  const student = await getCurrentStudentVerified()
  const supabase = await createClient()

  // Verify participant
  const { data: participant, error: pErr } = await supabase
    .from("test_participants")
    .select("id, session_id, student_id")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)
    .maybeSingle()

  if (pErr || !participant) {
    throw new Error("Вы не являетесь участником этой сессии")
  }

  // Result is available ONLY after the session has finished.
  // Guard lives in the Server Action so partial results are never returned
  // regardless of what the RPC does.
  const { data: sessionRow, error: ssErr } = await supabase
    .from("test_sessions")
    .select("status")
    .eq("id", sessionId)
    .maybeSingle()

  if (ssErr || !sessionRow || sessionRow.status !== "finished") {
    throw new Error("RESULT_NOT_AVAILABLE")
  }

  // 1. Try calling database RPC get_my_test_result
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_my_test_result", {
      p_student_id: student.id,
      p_participant_id: participant.id
    })

    if (!rpcError && rpcData) {
      logAction("GET_MY_TEST_RESULT_RPC", student.id, { sessionId })
      return rpcData
    }
  } catch (e) {
    console.warn("RPC get_my_test_result error/fallback:", e)
  }

  // 2. Fallback calculation via server client
  const { data: session, error: sErr } = await supabase
    .from("test_sessions")
    .select("id, test_id, status, tests!inner(id, title, description)")
    .eq("id", sessionId)
    .single()

  if (sErr || !session) {
    throw new Error("Сессия теста не найдена")
  }

  // Get all test questions for max points calculation
  const { data: questions } = await supabase
    .from("test_questions")
    .select("id, points")
    .eq("test_id", session.test_id)

  const qList = questions || []
  const maxPoints = qList.reduce((acc, q) => acc + (q.points || 20), 0)

  // Get student's answers for this session
  const { data: studentAnswers } = await supabase
    .from("test_answers")
    .select("id, question_id, is_correct")
    .eq("session_id", sessionId)
    .eq("student_id", student.id)

  const answers = studentAnswers || []
  const totalAnswered = answers.length
  const correctAnswers = answers.filter((a) => a.is_correct)
  const totalCorrect = correctAnswers.length

  // Calculate points earned
  let totalPoints = 0
  for (const ans of correctAnswers) {
    const qObj = qList.find((q) => q.id === ans.question_id)
    totalPoints += qObj?.points || 20
  }

  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

  logAction("GET_MY_TEST_RESULT", student.id, { sessionId, totalPoints, percentage })

  return {
    test_title: (session.tests as any)?.title || "Тест",
    test_description: (session.tests as any)?.description || "",
    total_points: totalPoints,
    max_points: maxPoints,
    total_correct: totalCorrect,
    total_answered: totalAnswered,
    total_questions: qList.length,
    percentage,
    student_name: student.name || "Ученик"
  }
}

export async function getTestSessionResults(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    throw new Error("Невалидный ID сессии")
  }
  const teacherId = await getCurrentTeacherId()

  const supabase = await createClient()

  // Verify the teacher owns this session (session -> test -> room -> teacher)
  const { data: session, error: sErr } = await supabase
    .from("test_sessions")
    .select("id, test_id, status, tests!inner(id, title, room_id, rooms!inner(teacher_id))")
    .eq("id", sessionId)
    .eq("tests.rooms.teacher_id", teacherId)
    .maybeSingle()

  if (sErr || !session) {
    throw new Error("Сессия не найдена или нет доступа")
  }

  // All questions of the test (for max points and total count)
  const { data: questions } = await supabase
    .from("test_questions")
    .select("id, points")
    .eq("test_id", session.test_id)

  const qList = questions || []
  const maxPoints = qList.reduce((acc, q) => acc + (q.points || 20), 0)
  const totalQuestions = qList.length

  // Total participants (some may not have answered yet)
  const { count: participantCount } = await supabase
    .from("test_participants")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)

  // All answers of every participant in this session
  const { data: answers } = await supabase
    .from("test_answers")
    .select("student_id, question_id, is_correct, students(name)")
    .eq("session_id", sessionId)

  const perStudent = new Map<string, any>()
  for (const ans of answers || []) {
    let s = perStudent.get(ans.student_id)
    if (!s) {
      s = {
        student_id: ans.student_id,
        name: (ans.students as any)?.name || "Ученик",
        total_correct: 0,
        total_answered: 0,
        total_points: 0
      }
      perStudent.set(ans.student_id, s)
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
    total_participants: participantCount || 0,
    results
  }
}




