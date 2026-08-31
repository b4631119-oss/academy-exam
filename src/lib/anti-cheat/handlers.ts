/**
 * Clipboard, hotkey, and context menu handlers for anti-cheat.
 * Pure functions — no engine state coupling.
 */
import { CONFIG } from "./config"
import type { Severity } from "./types"

type TryEmit = (severity: Severity, signalType: string, reason: string) => void

export function createClipboardHandler(tryEmit: TryEmit) {
  return (e: Event) => {
    e.preventDefault()
    if ("stopImmediatePropagation" in e && typeof e.stopImmediatePropagation === "function") {
      e.stopImmediatePropagation()
    }
    tryEmit("VIOLATION", "clipboard", "Операция с буфером обмена запрещена")
  }
}

export function createHotkeyHandler(tryEmit: TryEmit) {
  return (e: KeyboardEvent) => {
    const key = e.key ? e.key.toLowerCase() : ""
    if (
      key === "f12" ||
      (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
      (e.ctrlKey && (key === "u" || key === "s" || key === "p"))
    ) {
      e.preventDefault()
      tryEmit("VIOLATION", "hotkey", `Запрещённое сочетание клавиш: ${e.key}`)
    }
  }
}

export function registerClipboardHotkeyListeners(
  rawAdd: typeof EventTarget.prototype.addEventListener,
  document: Document,
  clipboardHandler: (e: Event) => void,
  hotkeyHandler: (e: KeyboardEvent) => void,
  contextMenuHandler: (e: Event) => void,
) {
  rawAdd.call(document, "copy", clipboardHandler, { capture: true, passive: false })
  rawAdd.call(document, "paste", clipboardHandler, { capture: true, passive: false })
  rawAdd.call(document, "cut", clipboardHandler, { capture: true, passive: false })
  rawAdd.call(document, "contextmenu", contextMenuHandler, { capture: true, passive: false })
  rawAdd.call(document, "keydown", hotkeyHandler as EventListener, { capture: true, passive: false })
}

export function unregisterClipboardHotkeyListeners(
  rawRemove: typeof EventTarget.prototype.removeEventListener,
  document: Document,
  clipboardHandler: (e: Event) => void,
  hotkeyHandler: (e: KeyboardEvent) => void,
) {
  rawRemove.call(document, "copy", clipboardHandler)
  rawRemove.call(document, "paste", clipboardHandler)
  rawRemove.call(document, "cut", clipboardHandler)
  rawRemove.call(document, "keydown", hotkeyHandler as EventListener)
}

// ── Visibility / Blur handlers ────────────────────────────────

type EmitFn = (severity: Severity, signalType: string, reason: string) => void

type VisibilityBlurState = {
  isDestroyed: () => boolean
  tryEmit: EmitFn
  consecutiveWarningsByType: Map<string, number>
}

export function createVisibilityHandler(state: VisibilityBlurState) {
  let visibilityStart: number | null = null
  let visibilityTimer: ReturnType<typeof setTimeout> | null = null

  function handleVisibilityChange() {
    if (state.isDestroyed()) return
    const hidden = document.hidden
    if (hidden) {
      visibilityStart = Date.now()
      visibilityTimer = setTimeout(() => {
        if (!state.isDestroyed() && document.hidden) {
          state.tryEmit("WARNING", "visibility", "Вкладка скрыта более 15 секунд — продолжайте работу в окне экзамена")
        }
      }, CONFIG.longDisruptionWarningMs)
      setTimeout(() => {
        if (!state.isDestroyed() && document.hidden && visibilityStart) {
          const duration = Date.now() - visibilityStart
          if (duration >= CONFIG.longDisruptionViolationMs) {
            state.tryEmit("VIOLATION", "visibility", `Вкладка была скрыта более ${Math.round(duration / 1000)} секунд`)
          }
        }
      }, CONFIG.longDisruptionViolationMs)
    } else {
      if (visibilityTimer) clearTimeout(visibilityTimer)
      visibilityTimer = null
      state.consecutiveWarningsByType.delete("visibility")
      if (visibilityStart) {
        const duration = Date.now() - visibilityStart
        visibilityStart = null
        if (duration < CONFIG.shortDisruptionMs) return
        console.info(`[AntiCheat INFO]: Вкладка была скрыта ${Math.round(duration / 1000)}с`)
      }
    }
  }

  return { handleVisibilityChange, cleanup: () => { if (visibilityTimer) clearTimeout(visibilityTimer) } }
}

export function createBlurHandler(state: VisibilityBlurState) {
  let blurStart: number | null = null
  let blurTimer: ReturnType<typeof setTimeout> | null = null

  function handleBlur() {
    if (state.isDestroyed()) return
    blurStart = Date.now()
    blurTimer = setTimeout(() => {
      if (!state.isDestroyed() && !document.hasFocus()) {
        state.tryEmit("WARNING", "focus", "Фокус окна потерян более 15 секунд")
      }
    }, CONFIG.longDisruptionWarningMs)
  }

  function handleFocus() {
    if (state.isDestroyed()) return
    if (blurTimer) clearTimeout(blurTimer)
    blurTimer = null
    state.consecutiveWarningsByType.delete("focus")
    if (blurStart) {
      const duration = Date.now() - blurStart
      blurStart = null
      if (duration < CONFIG.shortDisruptionMs) return
    }
  }

  return { handleBlur, handleFocus, cleanup: () => { if (blurTimer) clearTimeout(blurTimer) } }
}
