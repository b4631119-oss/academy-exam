/**
 * Shared helpers for test-related server actions.
 * Non-server module — imported by the "use server" wrappers.
 */
import { createClient } from "../supabase/server"
import { createAdminClient } from "../supabase/admin"
import { cookies } from "next/headers"
import { verifyStudentToken } from "../jwt"

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getCurrentTeacherId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Не авторизован")
  return user.id
}

export async function verifyTestOwnership(testId: string, teacherId: string) {
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

export async function getCurrentStudentVerified() {
  const cookieStore = await cookies()
  const token = cookieStore.get("studentToken")?.value
  if (!token) throw new Error("Студент не авторизован (токен отсутствует)")
  const payload = await verifyStudentToken(token)
  if (!payload || !payload.studentId) throw new Error("Студент не авторизован (токен невалиден)")
  const supabase = createAdminClient()
  const { data: student, error } = await supabase.from("students").select("id, name, room_id").eq("id", payload.studentId).maybeSingle()
  if (error || !student) throw new Error("Студент не найден")
  return student
}
