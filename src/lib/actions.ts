"use server"

import { createClient } from "./supabase/server"
import { cookies } from "next/headers"

// ========================
// TEACHER ACTIONS
// ========================

export async function createRoom(teacherId: string, name: string, code: string) {
  const supabase = await createClient()
  
  // Ensure the teacher exists in the teachers table to prevent foreign key constraint error
  const { data: { user } } = await supabase.auth.getUser()
  const { error: teacherError } = await supabase
    .from("teachers")
    .upsert({ id: teacherId, email: user?.email }, { onConflict: 'id' })

  if (teacherError) {
    throw new Error(`Ошибка при создании профиля учителя: ${teacherError.message}`)
  }

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
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code.toUpperCase())
    .single()

  if (error || !data) {
    return null
  }
  return data
}

export async function createStudent(name: string, roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("students")
    .insert([{ name, room_id: roomId }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  // Set student cookie
  const cookieStore = await cookies()
  cookieStore.set("studentId", data.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
  
  return data
}

export async function getStudent() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("studentId")?.value
  if (!studentId) return null

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
  const supabase = await createClient()
  
  // First, check if an answer already exists
  const { data: existing } = await supabase
    .from("answers")
    .select("id")
    .eq("student_id", studentId)
    .eq("question_id", questionId)
    .maybeSingle()

  if (existing) {
    // Update existing answer
    const { data, error } = await supabase
      .from("answers")
      .update({ 
        answer_text: answerText,
        is_correct: null // reset correct status if edited
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } else {
    // Insert new answer
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

    if (error) throw new Error(error.message)
    return data
  }
}
