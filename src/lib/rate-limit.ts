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

export type RateLimitPreset = { limit: number; windowMs: number };

/** Actual authentication routes. Sub-paths of these are covered as well. */
const AUTH_LOGIN_ROUTES = ['/login', '/teacher/login', '/teacher/admin/login'];
const AUTH_REGISTER_ROUTES = ['/register'];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Resolves the rate-limit preset for a request.
 *
 * Auth limits (LOGIN/REGISTER) apply ONLY to actual submission requests (POST),
 * e.g. server-action form submits. Ordinary GET page loads and RSC/link
 * prefetch requests must never consume the login-attempt budget or trigger
 * the automatic IP block — otherwise normal navigation can self-block a
 * visitor for 24 hours. Safe GETs use the general API limit instead.
 */
export function resolveRateLimitPreset(
  method: string | null | undefined,
  pathname: string
): RateLimitPreset {
  if (method === 'POST') {
    if (matchesRoute(pathname, AUTH_LOGIN_ROUTES)) return RATE_LIMIT_PRESETS.LOGIN;
    if (matchesRoute(pathname, AUTH_REGISTER_ROUTES)) return RATE_LIMIT_PRESETS.REGISTER;
  }
  return RATE_LIMIT_PRESETS.API_GENERAL;
}

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
