/**
 * Teacher test CRUD operations.
 * Non-server module — imported by the "use server" wrappers.
 */
import { createClient } from "../supabase/server"
import { createAdminClient } from "../supabase/admin"
import { logAction } from "../logger"
import { getCurrentTeacherId, UUID_REGEX } from "./test-shared"
import type { TeacherTestListItem, Test, TestQuestion, TestOption } from "../types"

export async function getTeacherTests(roomId: string): Promise<TeacherTestListItem[]> {
  if (!roomId || !UUID_REGEX.test(roomId)) throw new Error("Невалидный ID комнаты")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: room, error: roomError } = await supabase
    .from("rooms").select("id, teacher_id").eq("id", roomId).maybeSingle()
  if (roomError || !room || room.teacher_id !== teacherId) throw new Error("Нет доступа к этой аудитории")
  const { data, error } = await supabase
    .from("tests").select("*, test_questions(id)").eq("room_id", roomId).order("created_at", { ascending: false })
  if (error) throw new Error("Не удалось загрузить тесты")
  return (data || []).map((test) => ({ ...test, questions_count: test.test_questions ? test.test_questions.length : 0 }))
}

export async function createTest(roomId: string, title: string, description?: string) {
  if (!roomId || !UUID_REGEX.test(roomId)) throw new Error("Невалидный ID комнаты")
  const trimmedTitle = title ? title.trim() : ""
  if (!trimmedTitle) throw new Error("Название теста не может быть пустым")
  if (trimmedTitle.length > 200) throw new Error("Название теста слишком длинное (максимум 200 символов)")
  const trimmedDescription = description ? description.trim() : ""
  if (trimmedDescription.length > 1000) throw new Error("Описание слишком длинное (максимум 1000 символов)")
  const teacherId = await getCurrentTeacherId()
  const supabaseCheck = await createClient()
  const { data: roomData, error: roomErr } = await supabaseCheck.from("rooms").select("id, teacher_id").eq("id", roomId).maybeSingle()
  if (roomErr || !roomData || roomData.teacher_id !== teacherId) throw new Error("Нет доступа к этой аудитории")
  const supabaseAdmin = createAdminClient()
  const { data, error } = await supabaseAdmin
    .from("tests").insert([{ room_id: roomId, teacher_id: teacherId, title: trimmedTitle, description: trimmedDescription || null, status: "draft" }])
    .select("id, room_id, teacher_id, title, description, status, created_at").single()
  if (error) throw new Error("Не удалось создать тест")
  logAction("CREATE_TEST", teacherId, { testId: data.id, roomId, title: trimmedTitle })
  return data
}

export async function getTest(testId: string): Promise<Test> {
  if (!testId || !UUID_REGEX.test(testId)) throw new Error("Невалидный ID теста")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: test, error } = await supabase.from("tests").select("*").eq("id", testId).maybeSingle()
  if (error || !test) throw new Error("Тест не найден")
  if (test.teacher_id !== teacherId) throw new Error("Нет доступа к этому тесту")
  return test
}

export async function getTestQuestions(testId: string): Promise<(TestQuestion & { text: string; test_options: (TestOption & { text: string })[] })[]> {
  if (!testId || !UUID_REGEX.test(testId)) throw new Error("Невалидный ID теста")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: test, error: testErr } = await supabase.from("tests").select("id, teacher_id").eq("id", testId).maybeSingle()
  if (testErr || !test) throw new Error("Тест не найден")
  if (test.teacher_id !== teacherId) throw new Error("Нет доступа к этому тесту")
  const { data, error } = await supabase.from("test_questions").select("*, test_options(*)").eq("test_id", testId).order("position", { ascending: true })
  if (error) throw new Error("Не удалось загрузить вопросы теста")
  return (data || []).map((q) => ({
    ...q, text: q.question_text || "",
    test_options: ((q.test_options || []) as TestOption[]).map((opt) => ({ ...opt, text: opt.option_text || "" })).sort((a, b) => (a.position || 0) - (b.position || 0))
  }))
}

export async function deleteTestQuestion(questionId: string) {
  if (!questionId || !UUID_REGEX.test(questionId)) throw new Error("Невалидный ID вопроса")
  const teacherId = await getCurrentTeacherId()
  const supabase = await createClient()
  const { data: qData, error: qError } = await supabase
    .from("test_questions").select("id, test_id, tests!inner(rooms!inner(teacher_id))")
    .eq("id", questionId).eq("tests.rooms.teacher_id", teacherId).maybeSingle()
  if (qError || !qData) throw new Error("Вопрос не найден или нет доступа")
  const { error } = await supabase.from("test_questions").delete().eq("id", questionId)
  if (error) throw new Error("Не удалось удалить вопрос теста")
  logAction("DELETE_TEST_QUESTION", teacherId, { questionId })
  return true
}
