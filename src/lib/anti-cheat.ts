/**
 * Bulletproof Enterprise Anti-Cheat System
 * Multi-layered protection against DevTools, Tab Swaps, DOM Tampering, Prototype Overrides, and Automation.
 */

export function initAntiCheat(onViolation?: (reason: string) => void) {
  if (typeof window === 'undefined') return () => {};

  let isTriggered = false;

  const triggerViolation = (reason: string) => {
    if (isTriggered) return;
    isTriggered = true;

    console.warn(`[AntiCheat Violation Detected]: ${reason}`);

    if (onViolation) {
      onViolation(`Обнаружена попытка обхода защиты: ${reason}`);
    } else {
      alert(`⚠️ Обнаружена попытка взлома! Экзамен завершён.\nПричина: ${reason}`);
      window.location.reload();
    }
  };

  // ==========================================
  // LEVEL 5: SAVE ORIGINAL NATIVE REFERENCES
  // ==========================================
  const rawAddEventListener = EventTarget.prototype.addEventListener;
  const rawRemoveEventListener = EventTarget.prototype.removeEventListener;
  const rawHasFocus = Document.prototype.hasFocus;
  const rawQuerySelector = Document.prototype.querySelector;
  
  const visStateDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  const hiddenDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');

  const rawVisibilityState = function () {
    return visStateDesc?.get ? visStateDesc.get.call(document) : document.visibilityState;
  };

  const rawHidden = function () {
    return hiddenDesc?.get ? hiddenDesc.get.call(document) : document.hidden;
  };

  const rawHasFocusCall = function () {
    return rawHasFocus ? rawHasFocus.call(document) : document.hasFocus();
  };

  // 1. Iframe Detection
  try {
    if (window.top !== window.self) {
      triggerViolation('Экзамен запущен внутри iframe');
    }
  } catch (e) {
    triggerViolation('Изоляция контекста в iframe');
  }

  // ==========================================
  // LEVEL 1: EVENT CAPTURE PHASE LISTENERS
  // ==========================================
  let lastEventTimestamp = Date.now();

  const handleSecurityEvent = (e: Event, reason: string) => {
    lastEventTimestamp = Date.now();
    e.preventDefault();
    if (typeof (e as any).stopImmediatePropagation === 'function') {
      (e as any).stopImmediatePropagation();
    }
    triggerViolation(reason);
  };

  // Prevent Clipboard Operations
  const preventCopyPaste = (e: Event) => {
    e.preventDefault();
    if (typeof (e as any).stopImmediatePropagation === 'function') {
      (e as any).stopImmediatePropagation();
    }
    triggerViolation('Копирование/вставка/вырезание запрещены');
  };

  // Prevent DevTools & Shortcut Hotkeys
  const preventHotkeys = (e: KeyboardEvent) => {
    lastEventTimestamp = Date.now();
    const key = e.key ? e.key.toLowerCase() : '';

    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+R, F5
    if (
      key === 'f12' ||
      key === 'f5' ||
      (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
      (e.ctrlKey && (key === 'u' || key === 's' || key === 'p' || key === 'r')) ||
      (e.metaKey && (key === 'u' || key === 's' || key === 'p' || key === 'r'))
    ) {
      e.preventDefault();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      triggerViolation('Использование запрещенных горячих клавиш или DevTools');
    }

    if (key === 'printscreen') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('');
      }
      triggerViolation('Скриншот экрана запрещен');
    }
  };

  const handleVisibilityChange = () => {
    if (rawHidden() || rawVisibilityState() !== 'visible') {
      triggerViolation('Переключение вкладки или сворачивание окна');
    }
  };

  const handleBlur = () => {
    triggerViolation('Потеря фокуса окна браузера');
  };

  const handlePageHide = () => {
    triggerViolation('Сворачивание/закрытие страницы');
  };

  const handleFreeze = () => {
    triggerViolation('Заморозка вкладки браузера');
  };

  // Attach to multiple targets in CAPTURE phase
  const targets = [window, document, document.documentElement];
  
  const safeAttach = (target: EventTarget, event: string, handler: EventListener) => {
    try {
      rawAddEventListener.call(target, event, handler, { capture: true, passive: false });
    } catch (err) {
      target.addEventListener(event, handler, true);
    }
  };

  targets.forEach(target => {
    if (!target) return;
    safeAttach(target, 'copy', preventCopyPaste);
    safeAttach(target, 'paste', preventCopyPaste);
    safeAttach(target, 'cut', preventCopyPaste);
    safeAttach(target, 'contextmenu', (e) => e.preventDefault());
    safeAttach(target, 'keydown', preventHotkeys as EventListener);
    safeAttach(target, 'visibilitychange', handleVisibilityChange);
    safeAttach(target, 'blur', handleBlur);
    safeAttach(target, 'pagehide', handlePageHide);
    safeAttach(target, 'freeze', handleFreeze);
  });

  // ==========================================
  // LEVEL 2 & 3: PERIODIC CHECK & RAF (FPS TRACKING)
  // ==========================================
  let lastTick = Date.now();
  let rafId: number;

  const checkLoop = () => {
    const now = Date.now();
    const delta = now - lastTick;

    // Check time jump (debugger pause, tab freeze, OS sleep)
    if (delta > 1500) {
      triggerViolation('Приостановка выполнения скрипта (DevTools/Заморозка вкладки)');
    }
    lastTick = now;

    // Direct check of native visibility and focus
    if (rawHidden() || rawVisibilityState() !== 'visible') {
      triggerViolation('Вкладка неактивна (проверка состояния)');
    }

    if (!rawHasFocusCall()) {
      triggerViolation('Окно не в фокусе (проверка фокуса)');
    }

    // DevTools Window Size Check
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > 180 || heightDiff > 180) {
      triggerViolation('Открыты инструменты разработчика (DevTools панель)');
    }

    if (!isTriggered) {
      rafId = requestAnimationFrame(checkLoop);
    }
  };

  rafId = requestAnimationFrame(checkLoop);

  // Interval verification & prototype tampering check
  const intervalId = setInterval(() => {
    // Detect overridden addEventListener / prototype pollution
    if (EventTarget.prototype.addEventListener !== rawAddEventListener) {
      triggerViolation('Обнаружена подмена метода addEventListener');
    }

    // Detect property descriptor overrides on document instance
    if (Object.prototype.hasOwnProperty.call(document, 'visibilityState') || 
        Object.prototype.hasOwnProperty.call(document, 'hidden')) {
      triggerViolation('Обнаружена подмена свойства visibilityState/hidden');
    }

    // DevTools debugger detection trap
    const startTime = Date.now();
    (function () {
      return false;
    })['constructor']('debugger')();
    const endTime = Date.now();
    if (endTime - startTime > 100) {
      triggerViolation('Обнаружен пошаговый отладчик DevTools');
    }

    // Check if events have been silenced for too long when window lost focus
    if (Date.now() - lastEventTimestamp > 5000 && !document.hasFocus()) {
      triggerViolation('Глушение событий безопасности');
    }
  }, 400);

  // ==========================================
  // LEVEL 4: MUTATION OBSERVER (DOM INTEGRITY)
  // ==========================================
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const removedNode of Array.from(mutation.removedNodes)) {
          if (removedNode instanceof HTMLElement && removedNode.dataset?.antiCheat) {
            triggerViolation('Попытка удаления элементов защиты из DOM');
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true
  });

  // Override clipboard & execCommand APIs
  try {
    if (typeof document.execCommand === 'function') {
      document.execCommand = function (command: string) {
        if (['copy', 'cut', 'paste'].includes(command.toLowerCase())) {
          triggerViolation('Попытка вызова execCommand');
          return false;
        }
        return false;
      };
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText = async () => {
        triggerViolation('Попытка записи в буфер обмена');
        return Promise.reject();
      };
      navigator.clipboard.readText = async () => {
        triggerViolation('Попытка чтения из буфера обмена');
        return Promise.resolve('');
      };
    }
  } catch (e) {
    // Ignore read-only properties
  }

  // Before unload prompt
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = 'Экзамен выполняется. Вы действительно хотите покинуть страницу?';
    return e.returnValue;
  };
  safeAttach(window, 'beforeunload', handleBeforeUnload);

  // Cleanup handler
  return () => {
    cancelAnimationFrame(rafId);
    clearInterval(intervalId);
    observer.disconnect();

    targets.forEach(target => {
      if (!target) return;
      try {
        rawRemoveEventListener.call(target, 'copy', preventCopyPaste, true);
        rawRemoveEventListener.call(target, 'paste', preventCopyPaste, true);
        rawRemoveEventListener.call(target, 'cut', preventCopyPaste, true);
        rawRemoveEventListener.call(target, 'keydown', preventHotkeys as EventListener, true);
        rawRemoveEventListener.call(target, 'visibilitychange', handleVisibilityChange, true);
        rawRemoveEventListener.call(target, 'blur', handleBlur, true);
        rawRemoveEventListener.call(target, 'pagehide', handlePageHide, true);
        rawRemoveEventListener.call(target, 'freeze', handleFreeze, true);
        rawRemoveEventListener.call(target, 'beforeunload', handleBeforeUnload, true);
      } catch (e) {
        // Fallback cleanup
      }
    });
  };
}
