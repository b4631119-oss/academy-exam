/**
 * Granular Rate Limiting System for Anti-DDoS
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export const RATE_LIMIT_PRESETS = {
  LOGIN: { limit: 5, windowMs: 60 * 1000 },           // 5 attempts per minute
  REGISTER: { limit: 3, windowMs: 5 * 60 * 1000 },     // 3 attempts per 5 minutes
  API_GENERAL: { limit: 100, windowMs: 60 * 1000 },   // 100 requests per minute
  EXAM_SUBMIT: { limit: 10, windowMs: 60 * 1000 }     // 10 submissions per minute
};

/**
 * Enforces rate limiting by key and rule.
 */
export function rateLimit(key: string, limit: number = 100, windowMs: number = 60000) {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitStore.set(key, newRecord);
    return { allowed: true, remaining: limit - 1, resetTime: newRecord.resetTime };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}
