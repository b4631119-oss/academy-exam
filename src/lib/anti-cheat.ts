/**
 * Enterprise Anti-Debug & Hardened Anti-Cheat System
 * Comprehensive defense against DevTools, Breakpoints, Console Inspection, and Dynamic Code Mutation.
 */

export function initAntiCheat(onViolation?: (reason: string) => void) {
  if (typeof window === 'undefined') return () => {};

  // =========================================================
  // 1. CONSOLE HARDENING & TRAPS
  // =========================================================
  const rawConsoleWarn = console.warn.bind(console);
  const noop = () => {};

  try {
    // Disable inspect console methods
    const consoleMethods = ['log', 'dir', 'table', 'debug', 'trace', 'info'];
    consoleMethods.forEach(method => {
      if ((console as any)[method]) {
        Object.defineProperty(console, method, {
          value: noop,
          writable: false,
          configurable: false
        });
      }
    });

    // Console getter trap for DevTools element inspection
    const elementTrap = new Image();
    Object.defineProperty(elementTrap, 'id', {
      get: () => {
        triggerViolation('Обнаружено открытие консоли через инспекцию элементов');
        return '';
      }
    });

    Object.freeze(console);
  } catch (e) {
    // Console frozen
  }

  // =========================================================
  // 2. CAPTURE & IMMUTABLE FREEZE OF NATIVE REFERENCES
  // =========================================================
  const rawSetInterval = window.setInterval;
  const rawSetTimeout = window.setTimeout;
  const rawClearInterval = window.clearInterval;
  const rawClearTimeout = window.clearTimeout;
  const rawRequestAnimationFrame = window.requestAnimationFrame;
  const rawCancelAnimationFrame = window.cancelAnimationFrame;

  const rawPerfNow = performance.now.bind(performance);
  const rawDateNow = Date.now.bind(Date);
  const rawFuncConstructor = Function.prototype.constructor;
  const rawFuncApply = Function.prototype.apply;
  const rawFuncCall = Function.prototype.call;

  const rawAddEventListener = EventTarget.prototype.addEventListener;
  const rawRemoveEventListener = EventTarget.prototype.removeEventListener;

  const visStateDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  const hiddenDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
  const hasFocusDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'hasFocus');

  const rawVisibilityState = () => visStateDesc?.get ? rawFuncCall.call(visStateDesc.get, document) : document.visibilityState;
  const rawHidden = () => hiddenDesc?.get ? rawFuncCall.call(hiddenDesc.get, document) : document.hidden;
  const rawHasFocus = () => hasFocusDesc?.value ? rawFuncCall.call(hasFocusDesc.value, document) : document.hasFocus();

  const securityCore = Object.freeze({
    rawSetInterval,
    rawSetTimeout,
    rawPerfNow,
    rawDateNow,
    rawAddEventListener,
    rawFuncConstructor
  });

  let isTriggered = false;

  const triggerViolation = (reason: string) => {
    if (isTriggered) return;
    isTriggered = true;

    rawConsoleWarn(`[AntiCheat Hardened Violation]: ${reason}`);

    if (onViolation) {
      onViolation(`Обнаружена попытка отладки/взлома: ${reason}`);
    } else {
      alert(`⚠️ Обнаружена попытка отладки! Экзамен завершён.\nПричина: ${reason}`);
      window.location.reload();
    }
  };

  // =========================================================
  // 3. INTEGRITY & MONKEY PATCH VERIFICATION
  // =========================================================
  const verifyIntegrity = () => {
    if (window.setInterval !== rawSetInterval) triggerViolation('Переопределение setInterval');
    if (window.setTimeout !== rawSetTimeout) triggerViolation('Переопределение setTimeout');
    if (EventTarget.prototype.addEventListener !== rawAddEventListener) triggerViolation('Переопределение addEventListener');
    if (Function.prototype.constructor !== rawFuncConstructor) triggerViolation('Переопределение Function.prototype.constructor');

    try {
      if (!window.setInterval.toString().includes('[native code]')) {
        triggerViolation('Подмена метода setInterval');
      }
    } catch (e) {
      triggerViolation('Сбой проверки целостности методов');
    }
  };

  // Honeypot traps
  try {
    Object.defineProperty(window, '__bypassAntiCheat', {
      get: () => { triggerViolation('Ловушка: Чтение __bypassAntiCheat'); return true; },
      set: () => { triggerViolation('Ловушка: Запись __bypassAntiCheat'); },
      configurable: false
    });
  } catch (e) {}

  // =========================================================
  // 4. BREAKPOINT & DEVTOOLS DETECTOR
  // =========================================================
  let lastFrameTime = rawPerfNow();
  let rafId: number;

  const checkLoop = (now: number) => {
    const delta = now - lastFrameTime;

    // Detection 1: Breakpoint delay check (> 100ms indicates pause/breakpoint)
    if (delta > 1500) {
      triggerViolation('Зафиксирована пауза выполнения (Breakpoint/Отладка)');
    }
    lastFrameTime = now;

    // Detection 2: Window Outer vs Inner Size (DevTools panel detection)
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if (widthThreshold || heightThreshold) {
      triggerViolation('Открыта панель отладки DevTools');
    }

    if (rawHidden() || rawVisibilityState() !== 'visible') {
      triggerViolation('Переключение вкладки или окна');
    }

    if (!rawHasFocus()) {
      triggerViolation('Потеря фокуса окна');
    }

    if (!isTriggered) {
      rafId = rawRequestAnimationFrame.call(window, checkLoop);
    }
  };

  rafId = rawRequestAnimationFrame.call(window, checkLoop);

  // Debugger loop trap & execution time measurement
  const intervalId = rawSetInterval.call(window, () => {
    verifyIntegrity();

    const start = rawPerfNow();
    try {
      rawFuncCall.call(rawFuncConstructor, 'debugger')();
    } catch (e) {}
    const elapsed = rawPerfNow() - start;

    if (elapsed > 100) {
      triggerViolation('Задержка отладчика DevTools (>100мс)');
    }
  }, 350);

  // =========================================================
  // 5. EVENT LISTENERS & DOM OBSERVER
  // =========================================================
  const preventClipboard = (e: Event) => {
    e.preventDefault();
    if (typeof (e as any).stopImmediatePropagation === 'function') {
      (e as any).stopImmediatePropagation();
    }
    triggerViolation('Операция с буфером обмена запрещена');
  };

  const preventHotkeys = (e: KeyboardEvent) => {
    const key = e.key ? e.key.toLowerCase() : '';
    if (
      key === 'f12' ||
      key === 'f5' ||
      (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
      (e.ctrlKey && (key === 'u' || key === 's' || key === 'p' || key === 'r'))
    ) {
      e.preventDefault();
      triggerViolation('Запрещенное сочетание клавиш (DevTools/Обновление)');
    }
  };

  const targets = [window, document, document.documentElement];
  targets.forEach(target => {
    if (!target) return;
    rawAddEventListener.call(target, 'copy', preventClipboard, { capture: true, passive: false });
    rawAddEventListener.call(target, 'paste', preventClipboard, { capture: true, passive: false });
    rawAddEventListener.call(target, 'cut', preventClipboard, { capture: true, passive: false });
    rawAddEventListener.call(target, 'contextmenu', (e) => e.preventDefault(), { capture: true, passive: false });
    rawAddEventListener.call(target, 'keydown', preventHotkeys as EventListener, { capture: true, passive: false });
  });

  const observer = new MutationObserver(() => {
    verifyIntegrity();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

  // Cleanup
  return () => {
    if (rafId) rawCancelAnimationFrame.call(window, rafId);
    if (intervalId) rawClearInterval.call(window, intervalId);
    observer.disconnect();
  };
}
