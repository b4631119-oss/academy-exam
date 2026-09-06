/**
 * Focused unit tests for the auth rate-limiting decision in src/lib/rate-limit.ts
 * (used by src/proxy.ts).
 *
 * Regression test for: ordinary GET /login page loads and RSC/link prefetch
 * requests must NOT consume the login-attempt budget (5/min) or trigger the
 * 24h automatic IP block, while real authentication submissions (POST) must
 * still be rate limited.
 *
 * Pure module tests — no browser, no webServer, no globalSetup (no DB writes).
 * Run with: npx playwright test --config=playwright.unit.config.ts
 */
import { test, expect } from '@playwright/test';
import { rateLimit, resolveRateLimitPreset, RATE_LIMIT_PRESETS } from '../src/lib/rate-limit';

// Mirrors the middleware flow in src/proxy.ts
function proxyRateLimit(method: string, pathname: string, ip: string) {
  const preset = resolveRateLimitPreset(method, pathname);
  return rateLimit(`${ip}:${pathname}`, preset.limit, preset.windowMs);
}

test.describe('resolveRateLimitPreset', () => {
  test('GET /login page loads are NOT treated as login attempts', () => {
    expect(resolveRateLimitPreset('GET', '/login')).toEqual(RATE_LIMIT_PRESETS.API_GENERAL);
    expect(resolveRateLimitPreset('GET', '/register')).toEqual(RATE_LIMIT_PRESETS.API_GENERAL);
  });

  test('RSC/link prefetch of /login (GET) is NOT a login attempt', () => {
    // request.nextUrl.pathname strips query strings, so prefetches like
    // GET /login?_rsc=... resolve to the same pathname as the page load.
    expect(resolveRateLimitPreset('GET', '/login')).toEqual(RATE_LIMIT_PRESETS.API_GENERAL);
  });

  test('ordinary page navigation never hits the auth limiter', () => {
    for (const path of ['/', '/skills', '/skills/js', '/teacher/login', '/student/enter']) {
      expect(resolveRateLimitPreset('GET', path)).toEqual(RATE_LIMIT_PRESETS.API_GENERAL);
    }
  });

  test('POST auth submissions ARE rate limited by the auth presets', () => {
    expect(resolveRateLimitPreset('POST', '/login')).toEqual(RATE_LIMIT_PRESETS.LOGIN);
    expect(resolveRateLimitPreset('POST', '/teacher/admin/login')).toEqual(RATE_LIMIT_PRESETS.LOGIN);
    expect(resolveRateLimitPreset('POST', '/register')).toEqual(RATE_LIMIT_PRESETS.REGISTER);
  });
});

test.describe('auth attempt budget behavior', () => {
  test('many GET /login prefetches never exhaust the auth limit (no 24h IP block)', () => {
    const ip = '10.0.0.1';
    // 12 page loads / prefetches of /login in a minute — would have tripped
    // the old 5/min LOGIN budget and auto-blocked the IP on the 6th request.
    for (let i = 0; i < 12; i++) {
      const result = proxyRateLimit('GET', '/login', ip);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    }
  });

  test('GET prefetch is not denied by an exhausted POST budget on the same path', () => {
    const ip = '10.0.0.2';
    // Burn the POST /login auth budget
    for (let i = 0; i < 5; i++) {
      expect(proxyRateLimit('POST', '/login', ip).allowed).toBe(true);
    }
    // A safe GET prefetch of the same path must still pass
    expect(proxyRateLimit('GET', '/login', ip).allowed).toBe(true);
  });

  test('repeated real auth submissions (POST) still trigger rate limiting', () => {
    const ip = '10.0.0.3';
    for (let i = 0; i < 5; i++) {
      expect(proxyRateLimit('POST', '/teacher/admin/login', ip).allowed).toBe(true);
    }
    // 6th real attempt in the same minute is denied — proxy.ts then calls
    // blockIP() for the auto 24h block. Brute-force protection preserved.
    const denied = proxyRateLimit('POST', '/teacher/admin/login', ip);
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
  });

  test('auth rate limits are per IP+path and reset after the window', () => {
    const ipA = '10.0.0.4';
    const ipB = '10.0.0.5';
    for (let i = 0; i < 5; i++) {
      expect(proxyRateLimit('POST', '/teacher/admin/login', ipA).allowed).toBe(true);
    }
    expect(proxyRateLimit('POST', '/teacher/admin/login', ipA).allowed).toBe(false);
    // Different IP, same path: unaffected
    expect(proxyRateLimit('POST', '/teacher/admin/login', ipB).allowed).toBe(true);
  });
});