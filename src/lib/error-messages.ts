// Maps technical error codes thrown by server actions to user-friendly Russian text.
// Unknown messages pass through unchanged so existing error handling is not broken.
const ERROR_MESSAGES: Record<string, string> = {
  TEST_LOCKED: "Тест уже запущен или находится в лобби. Редактирование сейчас недоступно.",
  RESULT_NOT_AVAILABLE: "Результат будет доступен после завершения теста.",
  TEST_ALREADY_STARTED: "Тест уже начался. Новые ученики больше не могут подключиться.",
  TEST_ALREADY_FINISHED: "Этот тест уже завершён.",
  QUESTION_NOT_STARTED: "Текущий вопрос ещё не запущен.",
  QUESTION_NOT_CURRENT: "Этот вопрос уже не актуален. Ожидайте следующий вопрос.",
  SESSION_STATE_CHANGED: "Состояние теста изменилось. Обновите страницу.",
  OPTION_NOT_FOR_QUESTION: "Этот вариант ответа больше недоступен.",
  INVALID_PARTICIPANT_OR_SESSION: "Сессия не найдена или доступ закрыт."
}

export function friendlyError(message: string): string {
  if (!message) return message
  for (const [code, text] of Object.entries(ERROR_MESSAGES)) {
    if (message.includes(code)) return text
  }
  return message
}
