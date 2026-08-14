/**
 * Simple in-memory rate limiter for server-side protection.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitRecord>();

/**
 * Enforces rate limiting on a specific action/key.
 * @param key Unique identifier (IP, user ID, or client key)
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default: 1 minute)
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function rateLimit(key: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const record = tracker.get(key);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs
    };
    tracker.set(key, newRecord);
    return { allowed: true, remaining: limit - 1, resetTime: newRecord.resetTime };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}
