/**
 * Test-related server actions — thin wrappers.
 * Business logic lives in ./actions/test-*.ts (non-server modules).
 * Each wrapper re-exports the domain function as a server action.
 */
"use server"

import { getTeacherTests as _getTeacherTests } from "./actions/test-teacher-ops"
import { createTest as _createTest } from "./actions/test-teacher-ops"
import { getTest as _getTest } from "./actions/test-teacher-ops"
import { getTestQuestions as _getTestQuestions } from "./actions/test-teacher-ops"
import { deleteTestQuestion as _deleteTestQuestion } from "./actions/test-teacher-ops"
import { createTestSession as _createTestSession } from "./actions/test-session-ops"
import { getLobbyDetails as _getLobbyDetails } from "./actions/test-session-ops"
import { startTestSession as _startTestSession } from "./actions/test-session-ops"
import { advanceTestQuestion as _advanceTestQuestion } from "./actions/test-session-ops"
import { getTestSessionResults as _getTestSessionResults } from "./actions/test-session-ops"
import { saveTestQuestions as _saveTestQuestions } from "./actions/test-session-ops"
import { startOrJoinStudentTest as _startOrJoinStudentTest } from "./actions/test-student-ops"
import { getStudentTestQuestions as _getStudentTestQuestions } from "./actions/test-student-ops"
import { submitStudentAnswer as _submitStudentAnswer } from "./actions/test-student-ops"
import { finishStudentTest as _finishStudentTest } from "./actions/test-student-ops"
import { getStudentTestResult as _getStudentTestResult } from "./actions/test-student-ops"
import { joinTestSessionAction as _joinTestSessionAction } from "./actions/test-student-ops"
import { getStudentTestSessionStatus as _getStudentTestSessionStatus } from "./actions/test-student-ops"
import { getCurrentTestQuestionAction as _getCurrentTestQuestionAction } from "./actions/test-student-ops"
import { submitTestAnswerAction as _submitTestAnswerAction } from "./actions/test-student-ops"
import { getMyTestResultAction as _getMyTestResultAction } from "./actions/test-student-ops"

export async function getTeacherTests(roomId: string) { return _getTeacherTests(roomId) }
export async function createTest(roomId: string, title: string, description?: string) { return _createTest(roomId, title, description) }
export async function getTest(testId: string) { return _getTest(testId) }
export async function getTestQuestions(testId: string) { return _getTestQuestions(testId) }
export async function deleteTestQuestion(questionId: string) { return _deleteTestQuestion(questionId) }
export async function createTestSession(testId: string) { return _createTestSession(testId) }
export async function getLobbyDetails(testId: string) { return _getLobbyDetails(testId) }
export async function startTestSession(sessionId: string) { return _startTestSession(sessionId) }
export async function advanceTestQuestion(sessionId: string) { return _advanceTestQuestion(sessionId) }
export async function getTestSessionResults(sessionId: string) { return _getTestSessionResults(sessionId) }
export async function saveTestQuestions(
  testId: string, title: string, description: string,
  questions: Array<{ id?: string; text: string; position: number; time_limit_seconds: number; points: number; test_options: Array<{ id?: string; text: string; position: number; is_correct: boolean }> }>
) { return _saveTestQuestions(testId, title, description, questions) }
export async function startOrJoinStudentTest(testId: string) { return _startOrJoinStudentTest(testId) }
export async function getStudentTestQuestions(sessionId: string) { return _getStudentTestQuestions(sessionId) }
export async function submitStudentAnswer(sessionId: string, questionId: string, optionId: string) { return _submitStudentAnswer(sessionId, questionId, optionId) }
export async function finishStudentTest(sessionId: string) { return _finishStudentTest(sessionId) }
export async function getStudentTestResult(sessionId: string) { return _getStudentTestResult(sessionId) }
export async function joinTestSessionAction(sessionCode: string) { return _joinTestSessionAction(sessionCode) }
export async function getStudentTestSessionStatus(sessionId: string) { return _getStudentTestSessionStatus(sessionId) }
export async function getCurrentTestQuestionAction(sessionId: string) { return _getCurrentTestQuestionAction(sessionId) }
export async function submitTestAnswerAction(participantId: string, questionId: string, optionId: string) { return _submitTestAnswerAction(participantId, questionId, optionId) }
export async function getMyTestResultAction(sessionId: string) { return _getMyTestResultAction(sessionId) }
