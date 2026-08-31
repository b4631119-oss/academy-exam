/**
 * Shared TypeScript types for Supabase data shapes.
 * Used across server actions and UI components to eliminate `any`.
 */

// ── Core Supabase table types ────────────────────────────────

export interface Room {
  status?: string
  id: string
  teacher_id: string
  name: string
  code: string
  created_at: string
}

export interface Exam {
  status?: string
  questions_count?: number
  teacher_id?: string
  id: string
  room_id: string
  title: string
  description?: string | null
  question_count?: number
  created_at: string
  rooms?: Room
}

export interface Question {
  id: string
  exam_id: string
  text: string
  created_at: string
  exams?: Exam
}

export interface Answer {
  id: string
  student_id: string
  question_id: string
  answer_text: string
  is_correct: boolean | null
  created_at: string
  students?: { name: string }
}

export interface Student {
  created_at?: string
  email?: string
  id: string
  name: string
  room_id: string
  rooms?: Room
}

// ── Test system types ────────────────────────────────────────

export interface Test {
  id: string
  room_id: string
  teacher_id: string
  title: string
  description?: string | null
  status: string
  created_at: string
  rooms?: Room
  test_questions?: TestQuestion[]
}

export interface TestQuestion {
  id: string
  test_id: string
  question_text: string
  position: number
  time_limit_seconds: number
  points: number
  test_options?: TestOption[]
}

export interface TestOption {
  id: string
  question_id: string
  option_text: string
  position: number
  is_correct: boolean
}

export interface TestSession {
  id: string
  test_id: string
  room_id: string
  status: string
  current_question_index: number
  started_at?: string | null
  question_started_at?: string | null
  finished_at?: string | null
  tests?: Test
}

export interface TestParticipant {
  id: string
  session_id: string
  student_id: string
  first_name: string
  last_name: string
  finished_at?: string | null
  created_at: string
  students?: { name: string }
}

export interface TestAnswer {
  id: string
  session_id: string
  participant_id: string
  question_id: string
  option_id: string
  is_correct: boolean
  points_earned: number
  answered_at: string
}

// ── Derived / mapped types ───────────────────────────────────

export interface ParticipantRow {
  id: string
  student_id: string
  name: string
  created_at: string
}

export interface TestResultRow {
  participant_id: string
  name: string
  total_correct: number
  total_answered: number
  total_points: number
  max_points: number
  total_questions: number
  percentage: number
}

export interface ExamStudentResult {
  id: string
  name: string
  total: number
  answered: number
  correct: number
  pending: number
  incorrect: number
}

export interface QuestionAnswer {
  question: Question
  answer: Answer | null
}

export interface StudentAssignment {
  id: string
  type: 'exam' | 'test'
  title: string
  description: string
  question_count: number
  created_at: string
}

// ── Question editor types ────────────────────────────────────

export interface EditorOptionItem {
  id?: string
  text: string
  position: number
  is_correct: boolean
}

export interface EditorQuestionItem {
  id?: string
  text: string
  position: number
  time_limit_seconds: number
  points: number
  test_options: EditorOptionItem[]
}

// ── Test question (UI display) ───────────────────────────────

export interface TestQuestionItem {
  id: string
  question_text: string
  text?: string
  position: number
  time_limit_seconds: number
  points: number
  has_answered?: boolean
  selected_option_id?: string | null
  options: TestQuestionOption[]
}

export interface TestQuestionOption {
  id: string
  option_text: string
  text?: string
  position: number
}

// ── JWT payload ──────────────────────────────────────────────

export interface StudentJwtPayload {
  studentId: string
  roomId: string
}

// ── Logger metadata ──────────────────────────────────────────

export type LogMetadata = Record<string, string | number | boolean | null | undefined>

// ── Test session result (teacher view) ───────────────────────

export interface TestSessionResult {
  session_id: string
  status: string
  title: string
  max_points: number
  total_questions: number
  total_participants: number
  results: TestResultRow[]
}

// ── Student test question data ───────────────────────────────

export interface StudentTestQuestionsResponse {
  session_id: string
  participant_id: string
  test_id: string
  test_title: string
  test_description: string
  is_finished: boolean
  questions: TestQuestionItem[]
}

// ── Student test result ──────────────────────────────────────

export interface StudentTestResult {
  test_title: string
  test_description: string
  total_points: number
  max_points: number
  total_correct: number
  total_answered: number
  total_questions: number
  percentage: number
  student_name: string
  room_id: string | null
}

// ── Finish student test result ───────────────────────────────

export interface FinishTestResult {
  session_id: string
  participant_id: string
  test_title: string
  test_description: string
  total_points: number
  max_points: number
  total_correct: number
  total_answered: number
  total_questions: number
  percentage: number
  finished_at: string
}

// ── Start/join test result ───────────────────────────────────

export interface StartJoinTestResult {
  session_id: string
  participant_id: string
  test_id: string
  test_title: string
  is_finished: boolean
}

// ── Lobby details ────────────────────────────────────────────

export interface LobbyDetails {
  test: Test | null
  session: TestSession | null
  participants: ParticipantRow[]
}

// ── Submit answer result ─────────────────────────────────────

export interface SubmitAnswerResult {
  success: boolean
  already_answered?: boolean
  question_id?: string
  option_id?: string
}

// ── Teacher tests list item ──────────────────────────────────

export interface TeacherTestListItem {
  id: string
  room_id: string
  title: string
  description?: string | null
  status: string
  created_at: string
  questions_count: number
}

// ── Legacy wrapper types ─────────────────────────────────────

export interface StudentTestSessionStatus {
  status: 'lobby' | 'running' | 'finished'
  session_id: string
  test_id: string
  current_question_index: number
  title: string
  description: string
  question_count: number
  time_limit_seconds: number
  student_name: string
}

// ── Error helpers ──────────────────────────────────────────

/** Extract a human-readable message from a caught unknown value. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return (err as Error).message
  if (typeof err === 'string') return err
  return 'Произошла неизвестная ошибка'
}
