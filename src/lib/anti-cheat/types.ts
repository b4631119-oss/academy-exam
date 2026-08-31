/**
 * Type definitions for the anti-cheat system.
 */

export type Severity = "INFO" | "WARNING" | "VIOLATION"

export interface ViolationEvent {
  severity: Severity
  reason: string
  timestamp: number
}

export interface AntiCheatCallbacks {
  onViolation: (reason: string) => void
  onWarning?: (reason: string) => void
  onInfo?: (reason: string) => void
}
