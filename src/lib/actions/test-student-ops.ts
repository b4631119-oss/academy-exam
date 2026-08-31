/**
 * Student test operations: join, answer, finish, result.
 * Non-server module — imported by the "use server" wrappers.
 */
import { createAdminClient } from "../supabase/admin"
import { logAction } from "../logger"
import { getCurrentStudentVerified, UUID_REGEX } from "./test-shared"
import type {
  StudentTestQuestionsResponse,
  TestQuestionItem,
  TestQuestionOption,
  SubmitAnswerResult,
  FinishTestResult,
  StudentTestResult,
  StartJoinTestResult,
  StudentTestSessionStatus,
} from "../types"

export async function startOrJoinStudentTest(testId: string): Promise<StartJoinTestResult> {
  if (!testId || !UUID_REGEX.test(testId)) throw new Error("Невалидный ID теста")
  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const { data: test, error: tErr } = await supabase.from("tests").select("id, room_id, title, status").eq("id", testId).maybeSingle()
  if (tErr || !test) throw new Error("Тест не найден")
  let { data: session } = await supabase.from("test_sessions").select("id, test_id, room_id, status").eq("test_id", testId).eq("room_id", test.room_id).order("created_at", { ascending: false }).limit(1).maybeSingle()
  if (!session) {
    const { data: newSession, error: sErr } = await supabase.from("test_sessions").insert([{ test_id: testId, room_id: test.room_id, status: "running", current_question_index: 0 }]).select("id, test_id, room_id, status").single()
    if (sErr || !newSession) throw new Error(sErr?.message || "Ошибка создания сессии теста")
    session = newSession
  }
  let { data: participant } = await supabase.from("test_participants").select("id, finished_at").eq("session_id", session.id).eq("student_id", student.id).maybeSingle()
  if (!participant) {
    const nameParts = (student.name || '').trim().split(/\s+/)
    const { data: newParticipant, error: pErr } = await supabase.from("test_participants").insert([{ session_id: session.id, student_id: student.id, first_name: nameParts[0] || student.name || 'Student', last_name: nameParts.slice(1).join(' ') || '' }]).select("id, finished_at").single()
    if (pErr || !newParticipant) throw new Error(pErr?.message || "Ошибка записи участника")
    participant = newParticipant
  }
  logAction("START_OR_JOIN_STUDENT_TEST", student.id, { testId, sessionId: session.id, participantId: participant.id })
  return { session_id: session.id, participant_id: participant.id, test_id: testId, test_title: test.title || "Тест", is_finished: !!participant.finished_at }
}

export async function getStudentTestQuestions(sessionId: string): Promise<StudentTestQuestionsResponse> {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии")
  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const { data: participantData, error: pErr } = await supabase.from("test_participants").select("id, finished_at, session_id").eq("session_id", sessionId).eq("student_id", student.id).maybeSingle()
  if (pErr || !participantData) throw new Error("Вы не являетесь участником этой сессии")
  const { data: sessionObj } = await supabase.from("test_sessions").select("id, test_id").eq("id", participantData.session_id).maybeSingle()
  if (!sessionObj) throw new Error("Сессия теста не найдена")
  const { data: testObj } = await supabase.from("tests").select("id, title, description").eq("id", sessionObj.test_id).maybeSingle()
  if (!testObj) throw new Error("Тест не найден")
  const [questionsRes, answersRes] = await Promise.all([
    supabase.from("test_questions").select("id, question_text, position, time_limit_seconds, points, test_options(id, option_text, position)").eq("test_id", sessionObj.test_id).order("position", { ascending: true }),
    supabase.from("test_answers").select("question_id, option_id").eq("session_id", sessionId).eq("participant_id", participantData.id)
  ])
  if (questionsRes.error) throw new Error(questionsRes.error.message)
  const questions = questionsRes.data || []
  const answerMap = new Map<string, string>()
  for (const ans of (answersRes.data || [])) answerMap.set(ans.question_id, ans.option_id)
  return {
    session_id: sessionId, participant_id: participantData.id, test_id: sessionObj.test_id,
    test_title: testObj.title || "Тест", test_description: testObj.description || "",
    is_finished: !!participantData.finished_at,
    questions: questions.map((q) => {
      const opts = (q.test_options || []) as Array<{ id: string; option_text: string; position: number }>
      return {
        id: q.id, question_text: q.question_text || "", text: q.question_text || "",
        position: q.position || 1, time_limit_seconds: q.time_limit_seconds || 15, points: q.points || 20,
        has_answered: answerMap.has(q.id), selected_option_id: answerMap.get(q.id) || null,
        options: opts.map((opt): TestQuestionOption => ({ id: opt.id, option_text: opt.option_text || "", text: opt.option_text || "", position: opt.position || 1 })).sort((a, b) => (a.position || 0) - (b.position || 0))
      } as TestQuestionItem
    })
  }
}

export async function submitStudentAnswer(sessionId: string, questionId: string, optionId: string): Promise<SubmitAnswerResult> {
  if (!sessionId || !UUID_REGEX.test(sessionId) || !questionId || !optionId) throw new Error("Невалидные параметры ответа")
  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const { data: participant, error: pErr } = await supabase.from("test_participants").select("id, finished_at, session_id").eq("session_id", sessionId).eq("student_id", student.id).maybeSingle()
  if (pErr || !participant) throw new Error("INVALID_PARTICIPANT_OR_SESSION")
  if (participant.finished_at) throw new Error("TEST_FINISHED_CANNOT_ANSWER")
  const { data: sessionRow } = await supabase.from("test_sessions").select("id, test_id").eq("id", sessionId).maybeSingle()
  const testId = sessionRow?.test_id
  if (!testId) throw new Error("Сессия теста не найдена")
  const { data: optionData } = await supabase.from("test_options").select("id, question_id, is_correct").eq("id", optionId).eq("question_id", questionId).maybeSingle()
  if (!optionData) throw new Error("Вариант ответа не найден")
  const { data: questionData } = await supabase.from("test_questions").select("id, test_id, points").eq("id", questionId).eq("test_id", testId).maybeSingle()
  if (!questionData) throw new Error("Вопрос не принадлежит тесту")
  const isCorrect = !!optionData.is_correct
  const pointsEarned = isCorrect ? (questionData.points || 20) : 0
  const { data: existingAnswer } = await supabase.from("test_answers").select("id").eq("session_id", sessionId).eq("participant_id", participant.id).eq("question_id", questionId).maybeSingle()
  if (existingAnswer) return { success: true, already_answered: true }
  const { error: insErr } = await supabase.from("test_answers").insert([{ session_id: sessionId, participant_id: participant.id, question_id: questionId, option_id: optionId, is_correct: isCorrect, points_earned: pointsEarned, answered_at: new Date().toISOString() }])
  if (insErr) {
    if (insErr.code === "23505") return { success: true, already_answered: true }
    throw new Error("Не удалось сохранить ответ")
  }
  logAction("SUBMIT_STUDENT_ANSWER", student.id, { sessionId, questionId, optionId })
  return { success: true, question_id: questionId, option_id: optionId }
}

export async function finishStudentTest(sessionId: string): Promise<FinishTestResult> {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии")
  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const { data: participantData } = await supabase.from("test_participants").select("id, finished_at").eq("session_id", sessionId).eq("student_id", student.id).maybeSingle()
  if (!participantData) throw new Error("Участник сессии не найден")
  const finishedAt = participantData.finished_at || new Date().toISOString()
  if (!participantData.finished_at) await supabase.from("test_participants").update({ finished_at: finishedAt }).eq("id", participantData.id)
  const { data: sessionRow } = await supabase.from("test_sessions").select("id, test_id").eq("id", sessionId).maybeSingle()
  const testId = sessionRow?.test_id
  if (!testId) throw new Error("Сессия теста не найдена")
  const [qRes, aRes] = await Promise.all([
    supabase.from("test_questions").select("id, points").eq("test_id", testId),
    supabase.from("test_answers").select("id, question_id, is_correct, points_earned").eq("session_id", sessionId).eq("participant_id", participantData.id)
  ])
  const qList = qRes.data || []; const ansList = aRes.data || []
  const maxPoints = qList.reduce((a, q) => a + (q.points || 20), 0)
  const totalPoints = ansList.reduce((a, ans) => a + (ans.points_earned || 0), 0)
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
  const { data: testRow } = await supabase.from("tests").select("title, description").eq("id", testId).maybeSingle()
  logAction("FINISH_STUDENT_TEST", student.id, { sessionId, totalPoints, percentage })
  return {
    session_id: sessionId, participant_id: participantData.id, test_title: testRow?.title || "Тест", test_description: testRow?.description || "",
    total_points: totalPoints, max_points: maxPoints, total_correct: ansList.filter((a) => a.is_correct).length,
    total_answered: ansList.length, total_questions: qList.length, percentage, finished_at: finishedAt
  }
}

export async function getStudentTestResult(sessionId: string): Promise<StudentTestResult> {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии")
  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const { data: participantData } = await supabase.from("test_participants").select("id, finished_at").eq("session_id", sessionId).eq("student_id", student.id).maybeSingle()
  if (!participantData) throw new Error("Вы не являетесь участником этой сессии")
  const { data: sessionRow } = await supabase.from("test_sessions").select("id, test_id, room_id").eq("id", sessionId).maybeSingle()
  const testId = sessionRow?.test_id; const roomId = sessionRow?.room_id
  if (!testId) throw new Error("Сессия теста не найдена")
  const { data: testRow } = await supabase.from("tests").select("title, description").eq("id", testId).maybeSingle()
  const [qRes, aRes] = await Promise.all([
    supabase.from("test_questions").select("id, points").eq("test_id", testId),
    supabase.from("test_answers").select("id, question_id, is_correct, points_earned").eq("session_id", sessionId).eq("participant_id", participantData.id)
  ])
  const qList = qRes.data || []; const ansList = aRes.data || []
  const maxPoints = qList.reduce((a, q) => a + (q.points || 20), 0)
  const totalPoints = ansList.reduce((a, ans) => a + (ans.points_earned || 0), 0)
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
  logAction("GET_STUDENT_TEST_RESULT", student.id, { sessionId, totalPoints, percentage })
  return {
    test_title: testRow?.title || "Тест", test_description: testRow?.description || "",
    total_points: totalPoints, max_points: maxPoints, total_correct: ansList.filter((a) => a.is_correct).length,
    total_answered: ansList.length, total_questions: qList.length, percentage,
    student_name: student.name || "Ученик", room_id: roomId || null
  }
}

// Legacy wrappers
export async function joinTestSessionAction(sessionCode: string): Promise<StartJoinTestResult> {
  if (!sessionCode || !sessionCode.trim()) throw new Error("Введите код для подключения к тесту")
  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const cleanCode = sessionCode.trim().toUpperCase()
  let targetRoomId = student.room_id
  const { data: roomByCode } = await supabase.from("rooms").select("id").eq("code", cleanCode).maybeSingle()
  if (roomByCode) targetRoomId = roomByCode.id
  const { data: activeTest } = await supabase.from("tests").select("id").eq("room_id", targetRoomId).order("created_at", { ascending: false }).limit(1).maybeSingle()
  if (!activeTest) throw new Error("Нет активного теста по данному коду")
  return await startOrJoinStudentTest(activeTest.id)
}

export async function getStudentTestSessionStatus(sessionId: string): Promise<StudentTestSessionStatus> {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии")
  const student = await getCurrentStudentVerified()
  const supabase = createAdminClient()
  const { data: participant } = await supabase.from("test_participants").select("id, finished_at").eq("session_id", sessionId).eq("student_id", student.id).maybeSingle()
  if (!participant) throw new Error("Сессия не найдена")
  const { data: session } = await supabase.from("test_sessions").select("id, test_id, status, tests(title, description, test_questions(id))").eq("id", sessionId).maybeSingle()
  const testObj = (session?.tests || {}) as { title?: string; description?: string; test_questions?: Array<{ id: string }> }
  return {
    status: (participant.finished_at ? "finished" : session?.status || "running") as "lobby" | "running" | "finished",
    session_id: sessionId, test_id: session?.test_id || "", current_question_index: 0,
    title: testObj.title || "Тест", description: testObj.description || "",
    question_count: testObj.test_questions ? testObj.test_questions.length : 0, time_limit_seconds: 15, student_name: student.name || "Ученик"
  }
}

export async function getCurrentTestQuestionAction(sessionId: string) {
  const data = await getStudentTestQuestions(sessionId)
  const qList = data.questions || []
  const firstQ = qList[0] || { id: "", question_text: "", position: 1, time_limit_seconds: 15, points: 20, options: [] }
  return {
    participant_id: data.participant_id, question_id: firstQ.id, question_text: firstQ.question_text || "",
    position: firstQ.position, total_questions: qList.length, time_limit_seconds: firstQ.time_limit_seconds || 15,
    points: firstQ.points || 20, has_answered: firstQ.has_answered || false,
    selected_option_id: firstQ.selected_option_id || null, options: firstQ.options || []
  }
}

export async function submitTestAnswerAction(participantId: string, questionId: string, optionId: string): Promise<SubmitAnswerResult> {
  const { createAdminClient: getAdmin } = await import("../supabase/admin")
  const supabase = getAdmin()
  const { data: participant } = await supabase.from("test_participants").select("session_id").eq("id", participantId).maybeSingle()
  return await submitStudentAnswer(participant?.session_id || participantId, questionId, optionId)
}

export async function getMyTestResultAction(sessionId: string): Promise<StudentTestResult> {
  return await getStudentTestResult(sessionId)
}
