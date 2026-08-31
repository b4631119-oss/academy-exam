/**
 * Behavioral Analysis System for Anti-Cheat & AI Detection
 */

interface BehavioralMetrics {
  lastAnswerTimestamp: number;
  answerTimestamps: number[];
  fastAnswerCount: number;
  suspiciousPatterns: number;
}

const studentBehaviorMap = new Map<string, BehavioralMetrics>();

/**
 * Analyzes answer submission timing and patterns server-side.
 */
export function analyzeBehavior(studentId: string, answerLength: number): { isSuspicious: boolean; reason?: string } {
  const now = Date.now();
  let metrics = studentBehaviorMap.get(studentId);

  if (!metrics) {
    metrics = {
      lastAnswerTimestamp: now,
      answerTimestamps: [],
      fastAnswerCount: 0,
      suspiciousPatterns: 0
    };
    studentBehaviorMap.set(studentId, metrics);
    return { isSuspicious: false };
  }

  const durationMs = now - metrics.lastAnswerTimestamp;
  metrics.lastAnswerTimestamp = now;
  metrics.answerTimestamps.push(durationMs);

  // 1. Superhuman typing/answer speed check (< 1.5 seconds for long answer)
  if (durationMs < 1500 && answerLength > 20) {
    metrics.fastAnswerCount += 1;
    metrics.suspiciousPatterns += 1;
    if (metrics.fastAnswerCount >= 2) {
      return {
        isSuspicious: true,
        reason: 'Аномально высокая скорость ввода ответа (подозрение на генерацию ИИ/копирование)'
      };
    }
  }

  // 2. Uniform interval pattern detection (bot / automated submission)
  if (metrics.answerTimestamps.length >= 4) {
    const recent = metrics.answerTimestamps.slice(-4);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((sum, val) => sum + Math.abs(val - avg), 0) / recent.length;

    if (variance < 200) {
      metrics.suspiciousPatterns += 1;
      return {
        isSuspicious: true,
        reason: 'Роботизированный паттерн интервалов ответов'
      };
    }
  }

  if (metrics.suspiciousPatterns >= 3) {
    return {
      isSuspicious: true,
      reason: 'Множественные поведенческие аномалии при сдаче экзамена'
    };
  }

  return { isSuspicious: false };
}
