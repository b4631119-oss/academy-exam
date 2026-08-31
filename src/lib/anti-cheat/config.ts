/**
 * Configuration constants for the anti-cheat system.
 * All thresholds and timing values are defined here.
 */

export const CONFIG = {
  // Grace period after mount — NO events fire during this time
  startupGraceMs: 5000,

  // Visibility / focus tolerance
  shortDisruptionMs: 2000,
  longDisruptionWarningMs: 15000,
  longDisruptionViolationMs: 60000,

  // Cooldowns — same signal type cannot trigger again within this window
  cooldownMs: 8000,

  // DevTools detection
  devtoolsCheckDebounceMs: 5000,

  // Breakpoint detection (rAF frame gap)
  breakpointThresholdMs: 10000,

  // Integrity checks interval
  integrityCheckIntervalMs: 10000,

  // Debugger trap interval
  debuggerCheckIntervalMs: 8000,

  // Warning escalation — CONSECUTIVE same-type warnings triggers violation
  maxSameTypeWarningsBeforeViolation: 3,

  // Mobile viewport change tolerance
  mobileViewportChangeToleranceMs: 3000,

  // Maximum total warnings before violation (hard cap)
  maxTotalWarningsBeforeViolation: 10,
}
