/**
 * Test session management and question save operations.
 * Non-server module — imported by the "use server" wrappers.
 */
import { createClient } from "../supabase/server"
import { logAction } from "../logger"
import { getCurrentTeacherId, verifyTestOwnership, UUID_REGEX } from "./test-shared"
import type { ParticipantRow, TestSessionResult, TestResultRow } from "../types"

export async function createTestSession(testId: string) {
  if (!testId || !UUID_REGEX.test(testId)) throw new Error("Невалидный ID теста")
  const teacherId = await getCurrentTeacherId()
  await verifyTestOwnership(testId, teacherId)
  const supabase = await createClient()
  const { data: questions, error: qErr } = await supabase
    .from("test_questions").select("id, question_text, test_options(id, option_text, is_correct)").eq("test_id", testId)
  if (qErr) throw new Error(qErr.message)
  if (!questions || questions.length === 0) throw new Error("Невозможно запустить тест: в тесте нет ни одного вопроса")
  for (let i = 0; i < questions.length; i++) {
    const opts = (questions[i].test_options || []) as Array<{ is_correct: boolean }>
    if (opts.length < 2 || opts.length > 4) throw new Error(`Вопрос №${i + 1} должен содержать от 2 до 4 вариантов ответа`)
    if (opts.filter((o) => o.is_correct).length !== 1) throw new Error(`Вопрос №${i + 1} должен иметь ровно 1 правильный вариант`)
  }
  const { data: existingSession } = await supabase.from("test_sessions").select("*").eq("test_id", testId).in("status", ["lobby", "running"]).order("created_at", { ascending: false }).maybeSingle()
  if (existingSession) return existingSession
  const { data: testRow } = await supabase.from("tests").select("room_id").eq("id", testId).single()
  const { data: newSession, error: sErr } = await supabase
    .from("test_sessions").insert([{ test_id: testId, room_id: testRow?.room_id, status: "lobby", current_question_index: 0 }]).select().single()
  if (sErr) throw new Error(sErr.message)
  await supabase.from("tests").update({ status: "lobby" }).eq("id", testId)
  logAction("CREATE_TEST_SESSION", teacherId, { sessionId: newSession.id, testId })
  return newSession
}

export async function getLobbyDetails(testId: string) {
  if (!testId || !UUID_REGEX.test(testId)) throw new Error("Невалидный ID теста")
  const teacherId = await getCurrentTeacherId()
  await verifyTestOwnership(testId, teacherId)
  const supabase = await createClient()
  const { data: test, error: tErr } = await supabase
    .from("tests").select("*, rooms(*), test_questions(id, position, time_limit_seconds)").eq("id", testId).single()
  if (tErr) throw new Error(tErr.message)
  const { data: session } = await supabase.from("test_sessions").select("*").eq("test_id", testId).in("status", ["lobby", "running", "finished"]).order("created_at", { ascending: false }).maybeSingle()
  let participants: ParticipantRow[] = []
  if (session) {
    const { data: pData } = await supabase.from("test_participants").select("*, students(name)").eq("session_id", session.id).order("created_at", { ascending: true })
    participants = (pData || []).map((p) => ({ id: p.id, student_id: p.student_id, name: p.students?.name || "Ученик", created_at: p.created_at }))
  }
  const sortedTest = test ? { ...test, test_questions: ((test.test_questions || []) as Array<{ position?: number }>).sort((a, b) => ((a.position as number) || 0) - ((b.position as number) || 0)) } : test
  return { test: sortedTest, session: session, participants }
}

export async function startTestSession(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: session, error: sErr } = await supabase
    .from("test_sessions").select("id, test_id, status, current_question_index, tests!inner(room_id, rooms!inner(teacher_id))")
    .eq("id", sessionId).eq("tests.rooms.teacher_id", teacherId).single()
  if (sErr || !session) throw new Error("Сессия не найдена или нет доступа")
  if (session.status === "running") return session
  if (session.status === "finished") throw new Error("Эта сессия уже завершена")
  const { count, error: pErr } = await supabase.from("test_participants").select("id", { count: "exact", head: true }).eq("session_id", sessionId)
  if (pErr) throw new Error(pErr.message)
  if (!count || count === 0) throw new Error("Нельзя начать тест: нет подключенных участников")
  const now = new Date().toISOString()
  const { data: updatedSession, error: updateErr } = await supabase
    .from("test_sessions").update({ status: "running", started_at: now, current_question_index: 0, question_started_at: now }).eq("id", sessionId).select().single()
  if (updateErr) throw new Error(updateErr.message)
  await supabase.from("tests").update({ status: "running" }).eq("id", session.test_id)
  logAction("START_TEST_SESSION", teacherId, { sessionId, testId: session.test_id })
  return updatedSession
}

export async function advanceTestQuestion(sessionId: string) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: session, error: sErr } = await supabase
    .from("test_sessions").select("id, test_id, status, current_question_index, tests!inner(room_id, rooms!inner(teacher_id))")
    .eq("id", sessionId).eq("tests.rooms.teacher_id", teacherId).single()
  if (sErr || !session) throw new Error("Сессия не найдена или нет доступа")
  if (session.status !== "running") throw new Error("Сессия не в состоянии проведения теста")
  const { data: questions, error: qErr } = await supabase.from("test_questions").select("id").eq("test_id", session.test_id).order("position", { ascending: true })
  if (qErr || !questions || questions.length === 0) throw new Error("В тесте не найдены вопросы")
  const expectedIndex = session.current_question_index || 0
  const nextIndex = expectedIndex + 1
  const now = new Date().toISOString()
  const { data: updatedSession, error: uErr } = await supabase
    .from("test_sessions")
    .update(nextIndex < questions.length ? { current_question_index: nextIndex, question_started_at: now } : { status: "finished", finished_at: now, question_started_at: null })
    .eq("id", sessionId).eq("status", "running").eq("current_question_index", expectedIndex).select().maybeSingle()
  if (uErr) throw new Error(uErr.message)
  if (!updatedSession) throw new Error("SESSION_STATE_CHANGED")
  if (nextIndex >= questions.length) {
    await supabase.from("tests").update({ status: "finished" }).eq("id", session.test_id)
    logAction("FINISH_TEST_SESSION", teacherId, { sessionId, testId: session.test_id })
  } else { logAction("ADVANCE_TEST_QUESTION", teacherId, { sessionId, nextIndex }) }
  return updatedSession
}

export async function getTestSessionResults(sessionId: string): Promise<TestSessionResult> {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: session, error: sErr } = await supabase
    .from("test_sessions").select("id, test_id, status, tests!inner(id, title, room_id, rooms!inner(teacher_id))")
    .eq("id", sessionId).eq("tests.rooms.teacher_id", teacherId).maybeSingle()
  if (sErr || !session) throw new Error("Сессия не найдена или нет доступа")
  const [qRes, pCountRes, aRes, partRes] = await Promise.all([
    supabase.from("test_questions").select("id, points").eq("test_id", session.test_id),
    supabase.from("test_participants").select("id", { count: "exact", head: true }).eq("session_id", sessionId),
    supabase.from("test_answers").select("participant_id, question_id, is_correct, points_earned").eq("session_id", sessionId),
    supabase.from("test_participants").select("id, student_id, first_name, last_name").eq("session_id", sessionId)
  ])
  const qList = qRes.data || []
  const maxPoints = qList.reduce((a, q) => a + (q.points || 20), 0)
  const answers = aRes.data || []
  const nameMap = new Map<string, string>()
  for (const p of (partRes.data || [])) nameMap.set(p.id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Ученик")
  const perStudent = new Map<string, TestResultRow>()
  for (const ans of answers) {
    let s = perStudent.get(ans.participant_id)
    if (!s) { s = { participant_id: ans.participant_id, name: nameMap.get(ans.participant_id) || "Ученик", total_correct: 0, total_answered: 0, total_points: 0, max_points: 0, total_questions: 0, percentage: 0 }; perStudent.set(ans.participant_id, s) }
    s.total_answered++
    if (ans.is_correct) { s.total_correct++; s.total_points += (qList.find((q) => q.id === ans.question_id)?.points || 20) }
  }
  const results = Array.from(perStudent.values()).map((s) => ({ ...s, max_points: maxPoints, total_questions: qList.length, percentage: maxPoints > 0 ? Math.round((s.total_points / maxPoints) * 100) : 0 })).sort((a, b) => b.total_points - a.total_points)
  return {
    session_id: sessionId, status: session.status, title: (session.tests as { title?: string })?.title as string || "Тест",
    max_points: maxPoints, total_questions: qList.length, total_participants: pCountRes.count || 0,
    results
  }
}

export async function saveTestQuestions(
  testId: string, title: string, description: string,
  questions: Array<{ id?: string; text: string; position: number; time_limit_seconds: number; points: number; test_options: Array<{ id?: string; text: string; position: number; is_correct: boolean }> }>
) {
  if (!testId || !UUID_REGEX.test(testId)) throw new Error("Невалидный ID теста")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: test, error: testErr } = await supabase.from("tests").select("id, teacher_id").eq("id", testId).maybeSingle()
  if (testErr || !test) throw new Error("Тест не найден")
  if (test.teacher_id !== teacherId) throw new Error("Нет доступа к этому тесту")
  const { data: activeSession } = await supabase.from("test_sessions").select("id, status").eq("test_id", testId).in("status", ["lobby", "running"]).order("created_at", { ascending: false }).maybeSingle()
  if (activeSession) throw new Error("TEST_LOCKED: Тест нельзя редактировать, пока активна сессия.")
  const trimmedTitle = (title || "").trim()
  if (!trimmedTitle) throw new Error("Название теста не может быть пустым")
  if (trimmedTitle.length > 200) throw new Error("Название теста слишком длинное")
  const trimmedDesc = (description || "").trim()
  if (trimmedDesc.length > 1000) throw new Error("Описание слишком длинное")
  if (!Array.isArray(questions)) throw new Error("Невалидные данные вопросов")
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]; const qi = i + 1
    if (!(q.text || "").trim()) throw new Error(`Вопрос №${qi} не содержит текст`)
    if ((q.text || "").trim().length > 500) throw new Error(`Текст вопроса №${qi} слишком длинный`)
    const tl = Number(q.time_limit_seconds); if (isNaN(tl) || tl < 5 || tl > 300) throw new Error(`Время на вопрос №${qi}: от 5 до 300 сек`)
    const pts = Number(q.points); if (isNaN(pts) || pts < 5 || pts > 100) throw new Error(`Баллы за вопрос №${qi}: от 5 до 100`)
    const opts = q.test_options || []; if (opts.length < 2 || opts.length > 4) throw new Error(`Вопрос №${qi}: от 2 до 4 вариантов`)
    let correctCount = 0
    for (let j = 0; j < opts.length; j++) {
      const optText = (opts[j].text || "").trim()
      if (!optText) throw new Error(`Вопрос №${qi}: Вариант ${String.fromCharCode(65 + j)} пустой`)
      if (optText.length > 300) throw new Error(`Вопрос №${qi}: Вариант ${String.fromCharCode(65 + j)} слишком длинный (максимум 300 символов)`)
      if (opts[j].is_correct) correctCount++
    }
    if (correctCount !== 1) throw new Error(`Вопрос №${qi}: нужен ровно 1 правильный вариант`)
  }
  await supabase.from("tests").update({ title: trimmedTitle, description: trimmedDesc || null }).eq("id", testId)
  const { data: existingQuestions } = await supabase.from("test_questions").select("id").eq("test_id", testId)
  const incomingIds = questions.filter((q) => q.id && UUID_REGEX.test(q.id)).map((q) => q.id!)
  const existingIds = (existingQuestions || []).map((q) => q.id)
  const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id))
  if (idsToDelete.length > 0) await supabase.from("test_questions").delete().in("id", idsToDelete)
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]; const pos = i + 1; let questionId = q.id
    if (questionId && UUID_REGEX.test(questionId) && existingIds.includes(questionId)) {
      const { error: qErr } = await supabase.from("test_questions").update({ question_text: q.text.trim(), position: pos, time_limit_seconds: q.time_limit_seconds, points: q.points }).eq("id", questionId)
      if (qErr) throw new Error(qErr.message)
    } else {
      const { data: newQ, error: qErr } = await supabase.from("test_questions").insert([{ test_id: testId, question_text: q.text.trim(), position: pos, time_limit_seconds: q.time_limit_seconds, points: q.points }]).select().single()
      if (qErr) throw new Error(qErr.message); questionId = newQ.id
    }
    const { data: existingOpts } = await supabase.from("test_options").select("id").eq("question_id", questionId)
    const incomingOptIds = (q.test_options || []).filter((o) => o.id && UUID_REGEX.test(o.id)).map((o) => o.id!)
    const existingOptIds = (existingOpts || []).map((o) => o.id)
    const optIdsToDelete = existingOptIds.filter((id) => !incomingOptIds.includes(id))
    if (optIdsToDelete.length > 0) await supabase.from("test_options").delete().in("id", optIdsToDelete)
    for (let j = 0; j < q.test_options.length; j++) {
      const opt = q.test_options[j]; const optPos = j + 1
      if (opt.id && UUID_REGEX.test(opt.id) && existingOptIds.includes(opt.id)) {
        const { error: optErr } = await supabase.from("test_options").update({ option_text: opt.text.trim(), position: optPos, is_correct: opt.is_correct }).eq("id", opt.id)
        if (optErr) throw new Error(optErr.message)
      } else {
        const { error: optErr } = await supabase.from("test_options").insert([{ question_id: questionId, option_text: opt.text.trim(), position: optPos, is_correct: opt.is_correct }])
        if (optErr) throw new Error(optErr.message)
      }
    }
  }
  logAction("SAVE_TEST_QUESTIONS", teacherId, { testId, questionCount: questions.length })
  return true
}
