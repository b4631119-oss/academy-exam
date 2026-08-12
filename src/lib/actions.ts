"use server"

import { createClient } from "./supabase/server"
import { cookies } from "next/headers"
import { signStudentToken, verifyStudentToken } from "./jwt"

// ========================
// TEACHER ACTIONS
// ========================

export async function createRoom(teacherId: string, name: string, code: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("rooms")
    .insert([{ teacher_id: teacherId, name, code }])
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function getRooms(teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createExam(roomId: string, title: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .insert([{ room_id: roomId, title }])
    .select()
    .single()

  if (error) throw new Error(error.message)
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
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .insert([{ exam_id: examId, text }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getExamResults(examId: string) {
  const supabase = await createClient()
  // First, get all questions for this exam
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id")
    .eq("exam_id", examId)

  if (qError) throw new Error(qError.message)
  
  const questionIds = questions.map(q => q.id)

  if (questionIds.length === 0) {
      return { students: [] }
  }

  // Get all answers for these questions, joining with student
  const { data: answers, error: aError } = await supabase
    .from("answers")
    .select("id, is_correct, student_id, students(name)")
    .in("question_id", questionIds)

  if (aError) throw new Error(aError.message)

  // Group by student
  const studentMap = new Map()
  answers.forEach((ans: any) => {
    if (!studentMap.has(ans.student_id)) {
      studentMap.set(ans.student_id, {
        id: ans.student_id,
        name: ans.students.name,
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
  
  // Get all questions
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("created_at", { ascending: true })

  if (qError) throw new Error(qError.message)
  
  const questionIds = questions.map(q => q.id)
  
  if (questionIds.length === 0) return []

  // Get answers
  const { data: answers, error: aError } = await supabase
    .from("answers")
    .select("*")
    .eq("student_id", studentId)
    .in("question_id", questionIds)
    
  if (aError) throw new Error(aError.message)

  // Merge
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
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("answers")
    .update({ is_correct: isCorrect })
    .eq("id", answerId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}


// ========================
// STUDENT ACTIONS
// ========================

export async function validateRoomCode(code: string) {
  console.log("-> validateRoomCode called with:", code)
  try {
    const supabase = await createClient()
    console.log("-> Supabase client created successfully")
    
    const formattedCode = code.trim().toUpperCase()
    console.log("-> Backend validating formatted room code:", formattedCode)

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", formattedCode)
      .maybeSingle()

    if (error) {
      console.error("-> Supabase query error:", error)
      return null
    }

    if (!data) {
      console.error("-> Room not found for code:", formattedCode)
      return null
    }
    
    console.log("-> Room found:", data)
    return data
  } catch (err) {
    console.error("-> Exception in validateRoomCode:", err)
    return null
  }
}

export async function createStudent(name: string, roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("students")
    .insert([{ name, room_id: roomId }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  // Set student cookie using JWT
  const token = await signStudentToken(data.id, roomId)
  const cookieStore = await cookies()
  cookieStore.set("studentToken", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
  
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

export async function saveAnswer(studentId: string, questionId: string, answerText: string) {
  console.log("-> saveAnswer called for student:", studentId, "question:", questionId)
  try {
    const supabase = await createClient()
    
    // First, check if an answer already exists
    const { data: existing, error: existError } = await supabase
      .from("answers")
      .select("id")
      .eq("student_id", studentId)
      .eq("question_id", questionId)
      .maybeSingle()

    if (existError) {
      console.error("-> Error checking existing answer:", existError)
      throw new Error(existError.message)
    }

    if (existing) {
      // Update existing answer
      console.log("-> Updating existing answer:", existing.id)
      const { data, error } = await supabase
        .from("answers")
        .update({ 
          answer_text: answerText,
          is_correct: null // reset correct status if edited
        })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) {
        console.error("-> Error updating answer:", error)
        throw new Error(error.message)
      }
      return data
    } else {
      // Insert new answer
      console.log("-> Inserting new answer")
      const { data, error } = await supabase
        .from("answers")
        .insert([{ 
          student_id: studentId, 
          question_id: questionId, 
          answer_text: answerText,
          is_correct: null
        }])
        .select()
        .single()

      if (error) {
        console.error("-> Error inserting answer:", error)
        throw new Error(error.message)
      }
      return data
    }
  } catch (err) {
    console.error("-> Exception in saveAnswer:", err)
    throw err // Throw it so the client knows it failed
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
// CRUD OPERATIONS
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
  if (error || !data) throw new Error("Нет доступа к комнате")
}

async function verifyExamOwnership(examId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .select("id, rooms!inner(teacher_id)")
    .eq("id", examId)
    .eq("rooms.teacher_id", teacherId)
    .maybeSingle()
  if (error || !data) throw new Error("Нет доступа к экзамену")
}

async function verifyQuestionOwnership(questionId: string, teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .select("id, exams!inner(rooms!inner(teacher_id))")
    .eq("id", questionId)
    .eq("exams.rooms.teacher_id", teacherId)
    .maybeSingle()
  if (error || !data) throw new Error("Нет доступа к вопросу")
}

export async function deleteRoom(roomId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("rooms").delete().eq("id", roomId)
  if (error) throw new Error(error.message)
  return true
}

export async function updateRoom(roomId: string, name: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyRoomOwnership(roomId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .update({ name })
    .eq("id", roomId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteExam(examId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("exams").delete().eq("id", examId)
  if (error) throw new Error(error.message)
  return true
}

export async function updateExam(examId: string, title: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyExamOwnership(examId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .update({ title })
    .eq("id", examId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteQuestion(questionId: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyQuestionOwnership(questionId, teacherId)
  const supabase = await createClient()
  const { error } = await supabase.from("questions").delete().eq("id", questionId)
  if (error) throw new Error(error.message)
  return true
}

export async function updateQuestion(questionId: string, text: string) {
  const teacherId = await getCurrentTeacherId()
  await verifyQuestionOwnership(questionId, teacherId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .update({ text })
    .eq("id", questionId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
