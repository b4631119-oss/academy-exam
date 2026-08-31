/**
 * Anti-Cheat Engine v3 — Tolerant & Mobile-Aware
 *
 * Signal → verify → debounce → threshold → violation
 * (not: event → violation immediately)
 */
import { CONFIG } from "./config"
import type { Severity, AntiCheatCallbacks } from "./types"
import { createClipboardHandler, createHotkeyHandler, registerClipboardHotkeyListeners, unregisterClipboardHotkeyListeners, createVisibilityHandler, createBlurHandler } from "./handlers"

export function initAntiCheat(callbacks: AntiCheatCallbacks | ((reason: string) => void)): () => void {
  if (typeof window === "undefined") return () => {}

  const cbs: AntiCheatCallbacks =
    typeof callbacks === "function" ? { onViolation: callbacks } : callbacks

  // ── State ──────────────────────────────────────────────
  const startTime = Date.now()
  let isDestroyed = false
  let violationCount = 0
  let warningCount = 0
  const lastSignalTime = new Map<string, number>()
  const persistentSignals = new Map<string, number>()
  const consecutiveWarningsByType = new Map<string, number>()

  // ── Helpers ────────────────────────────────────────────
  const elapsed = () => Date.now() - startTime
  const inGracePeriod = () => elapsed() < CONFIG.startupGraceMs

  function isOnCooldown(signalType: string): boolean {
    const last = lastSignalTime.get(signalType) || 0
    return Date.now() - last < CONFIG.cooldownMs
  }

  function recordSignal(signalType: string) {
    lastSignalTime.set(signalType, Date.now())
  }

  function emit(severity: Severity, reason: string) {
    if (isDestroyed) return
    if (inGracePeriod()) {
      console.info(`[AntiCheat INFO (grace)]: ${reason}`)
      return
    }
    if (severity === "VIOLATION") {
      violationCount++
      console.warn(`[AntiCheat VIOLATION #${violationCount}]: ${reason}`)
      cbs.onViolation(`Обнаружена попытка отладки/взлома: ${reason}`)
      return
    }
    if (severity === "WARNING") {
      warningCount++
      console.warn(`[AntiCheat WARNING #${warningCount}]: ${reason}`)
      const signalType = reason.split(":")[0] || "unknown"
      const prev = consecutiveWarningsByType.get(signalType) || 0
      consecutiveWarningsByType.set(signalType, prev + 1)
      const sameTypeCount = consecutiveWarningsByType.get(signalType) || 0
      if (sameTypeCount >= CONFIG.maxSameTypeWarningsBeforeViolation) {
        emit("VIOLATION", `Повторяющиеся нарушения типа "${signalType}" (${sameTypeCount} раз)`)
        return
      }
      if (warningCount >= CONFIG.maxTotalWarningsBeforeViolation) {
        emit("VIOLATION", `Превышен общий лимит предупреждений (${warningCount})`)
        return
      }
      cbs.onWarning?.(`Предупреждение: ${reason}`)
      return
    }
    console.info(`[AntiCheat INFO]: ${reason}`)
    cbs.onInfo?.(reason)
  }

  function tryEmit(severity: Severity, signalType: string, reason: string) {
    if (isOnCooldown(signalType)) return
    recordSignal(signalType)
    emit(severity, reason)
  }

  // ── Native references ──────────────────────────────────
  const rawSetInterval = window.setInterval
  const rawSetTimeout = window.setTimeout
  const rawClearInterval = window.clearInterval
  const rawRequestAnimationFrame = window.requestAnimationFrame
  const rawCancelAnimationFrame = window.cancelAnimationFrame
  const rawAddEventListener = EventTarget.prototype.addEventListener
  const rawRemoveEventListener = EventTarget.prototype.removeEventListener
  const rawFuncConstructor = Function.prototype.constructor

  // ── Honeypot ───────────────────────────────────────────
  try {
    Object.defineProperty(window, "__bypassAntiCheat", {
      get: () => { emit("VIOLATION", "Ловушка: чтение __bypassAntiCheat"); return true },
      set: () => { emit("VIOLATION", "Ловушка: запись __bypassAntiCheat") },
      configurable: false,
    })
  } catch {}

  // ── Integrity verification ─────────────────────────────
  function verifyIntegrity() {
    if (isDestroyed) return
    try {
      if (window.setInterval !== rawSetInterval) tryEmit("VIOLATION", "integrity-setInterval", "Переопределение setInterval")
      if (window.setTimeout !== rawSetTimeout) tryEmit("VIOLATION", "integrity-setTimeout", "Переопределение setTimeout")
      if (EventTarget.prototype.addEventListener !== rawAddEventListener) tryEmit("VIOLATION", "integrity-addEventListener", "Переопределение addEventListener")
      if (Function.prototype.constructor !== rawFuncConstructor) tryEmit("VIOLATION", "integrity-constructor", "Переопределение Function.prototype.constructor")
      if (!window.setInterval.toString().includes("[native code]")) tryEmit("VIOLATION", "integrity-setInterval-toString", "Подмена метода setInterval")
    } catch {
      tryEmit("VIOLATION", "integrity-check-failed", "Сбой проверки целостности методов")
    }
  }

  const integrityIntervalId = rawSetInterval.call(window, verifyIntegrity, CONFIG.integrityCheckIntervalMs)

  // ── Breakpoint / DevTools detector (rAF loop) ──────────
  let lastFrameTime = performance.now()
  let rafId: number

  const checkLoop = (now: number) => {
    if (isDestroyed) return
    const delta = now - lastFrameTime
    if (delta > CONFIG.breakpointThresholdMs) {
      tryEmit("WARNING", "breakpoint", `Пауза выполнения (${Math.round(delta)}мс) — возможный breakpoint`)
    }
    lastFrameTime = now
    const widthDiff = window.outerWidth - window.innerWidth
    const heightDiff = window.outerHeight - window.innerHeight
    const devtoolsOpen = widthDiff > 200 || heightDiff > 200
    if (devtoolsOpen) {
      const key = "devtools"
      const started = persistentSignals.get(key)
      if (!started) {
        persistentSignals.set(key, Date.now())
      } else if (Date.now() - started > CONFIG.devtoolsCheckDebounceMs) {
        tryEmit("VIOLATION", key, "Открыта панель отладки DevTools")
        persistentSignals.delete(key)
      }
    } else {
      persistentSignals.delete("devtools")
    }
    if (!isDestroyed) rafId = rawRequestAnimationFrame.call(window, checkLoop)
  }

  rafId = rawRequestAnimationFrame.call(window, checkLoop)

  // ── Debugger trap ──────────────────────────────────────
  const debuggerIntervalId = rawSetInterval.call(window, () => {
    if (isDestroyed) return
    const start = performance.now()
    try { Function("debugger")() } catch {}
    const elapsed = performance.now() - start
    if (elapsed > 200) {
      tryEmit("WARNING", "debugger-trap", `Задержка отладчика DevTools (${Math.round(elapsed)}мс)`)
    }
  }, CONFIG.debuggerCheckIntervalMs)

  // ── Visibility / Blur (delegated to handlers.ts) ───────
  const handlerState = { isDestroyed: () => isDestroyed, tryEmit, consecutiveWarningsByType }
  const { handleVisibilityChange, cleanup: visCleanup } = createVisibilityHandler(handlerState)
  const { handleBlur, handleFocus, cleanup: blurCleanup } = createBlurHandler(handlerState)
  document.addEventListener("visibilitychange", handleVisibilityChange)
  window.addEventListener("blur", handleBlur)
  window.addEventListener("focus", handleFocus)

  // ── Clipboard / Hotkeys / Context Menu ─────────────────
  const preventClipboard = createClipboardHandler(tryEmit)
  const preventHotkeys = createHotkeyHandler(tryEmit)
  const preventContextMenu = (e: Event) => e.preventDefault()
  registerClipboardHotkeyListeners(rawAddEventListener, document, preventClipboard, preventHotkeys, preventContextMenu)

  // ── Resize ─────────────────────────────────────────────
  let resizeTimer: ReturnType<typeof setTimeout> | null = null
  function handleResize() {
    if (isDestroyed) return
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      console.info("[AntiCheat INFO]: Viewport resize detected (normal on mobile)")
    }, CONFIG.mobileViewportChangeToleranceMs)
  }
  window.addEventListener("resize", handleResize)

  // ── DOM mutation observer ──────────────────────────────
  const observer = new MutationObserver(() => verifyIntegrity())
  observer.observe(document.documentElement, { childList: true, subtree: true })

  // ── Cleanup ────────────────────────────────────────────
  return () => {
    isDestroyed = true
    if (rafId) rawCancelAnimationFrame.call(window, rafId)
    if (integrityIntervalId) rawClearInterval.call(window, integrityIntervalId)
    if (debuggerIntervalId) rawClearInterval.call(window, debuggerIntervalId)
    visCleanup()
    blurCleanup()
    if (resizeTimer) clearTimeout(resizeTimer)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
    window.removeEventListener("blur", handleBlur)
    window.removeEventListener("focus", handleFocus)
    window.removeEventListener("resize", handleResize)
    unregisterClipboardHotkeyListeners(rawRemoveEventListener, document, preventClipboard, preventHotkeys)
    observer.disconnect()
  }
}
