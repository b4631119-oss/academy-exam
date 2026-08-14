/**
 * Advanced Hardened Anti-Cheat System with Web Worker Pulse & Prototype Protection
 */

export function initAntiCheat(onViolation?: (reason: string) => void) {
  if (typeof window === 'undefined') return () => {};

  // =========================================================
  // STEP 1: CAPTURE & IMMUTABLE FREEZE OF NATIVE REFERENCES
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

  const rawConsoleLog = console.log.bind(console);
  const rawConsoleWarn = console.warn.bind(console);
  const rawConsoleError = console.error.bind(console);

  const rawAddEventListener = EventTarget.prototype.addEventListener;
  const rawRemoveEventListener = EventTarget.prototype.removeEventListener;

  const visStateDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  const hiddenDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
  const hasFocusDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'hasFocus');

  const rawVisibilityState = () => visStateDesc?.get ? visStateDesc.get.call(document) : document.visibilityState;
  const rawHidden = () => hiddenDesc?.get ? hiddenDesc.get.call(document) : document.hidden;
  const rawHasFocus = () => hasFocusDesc?.value ? hasFocusDesc.value.call(document) : document.hasFocus();

  // Freeze security definitions container
  const securityCore = Object.freeze({
    rawSetInterval,
    rawSetTimeout,
    rawPerfNow,
    rawDateNow,
    rawAddEventListener
  });

  let isTriggered = false;

  const triggerViolation = (reason: string) => {
    if (isTriggered) return;
    isTriggered = true;

    rawConsoleWarn(`[AntiCheat Hardened Triggered]: ${reason}`);

    if (onViolation) {
      onViolation(`Обнаружена попытка обхода защиты: ${reason}`);
    } else {
      alert(`⚠️ Обнаружена попытка взлома! Экзамен завершён.\nПричина: ${reason}`);
      window.location.reload();
    }
  };

  // =========================================================
  // STEP 2: INTEGRITY VERIFICATION (detect monkey patching)
  // =========================================================
  const verifyIntegrity = () => {
    if (window.setInterval !== rawSetInterval) {
      triggerViolation('Переопределение setInterval');
    }
    if (window.setTimeout !== rawSetTimeout) {
      triggerViolation('Переопределение setTimeout');
    }
    if (EventTarget.prototype.addEventListener !== rawAddEventListener) {
      triggerViolation('Переопределение addEventListener');
    }
    if (Function.prototype.constructor !== rawFuncConstructor) {
      triggerViolation('Переопределение Function.prototype.constructor');
    }

    // Check if methods native code string mutated
    try {
      if (!window.setInterval.toString().includes('[native code]')) {
        triggerViolation('Подмена кода setInterval на кастомную функцию');
      }
    } catch (e) {
      triggerViolation('Ошибка проверки целостности методов');
    }
  };

  // Lock properties via defineProperty
  try {
    Object.defineProperty(window, '_antiCheatGuard', {
      value: true,
      writable: false,
      configurable: false
    });
  } catch (e) {
    // Ignore if sealed
  }

  // =========================================================
  // STEP 3: WEB WORKER SEPARATE THREAD PULSE CHECK
  // =========================================================
  let worker: Worker | null = null;
  let workerUrl: string | null = null;

  try {
    const workerCode = `
      let lastPulse = Date.now();
      self.setInterval(() => {
        const now = Date.now();
        if (now - lastPulse > 1500) {
          self.postMessage({ type: 'FREEZE_DETECTED', delta: now - lastPulse });
        }
        lastPulse = now;
        self.postMessage({ type: 'PULSE', timestamp: now });
      }, 300);
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerUrl = URL.createObjectURL(blob);
    worker = new Worker(workerUrl);

    let lastWorkerPulse = rawDateNow();

    worker.onmessage = (e) => {
      const data = e.data;
      if (data.type === 'FREEZE_DETECTED') {
        triggerViolation('Обнаружена заморозка отдельного потока (Web Worker)');
      } else if (data.type === 'PULSE') {
        lastWorkerPulse = rawDateNow();
      }
    };
  } catch (e) {
    // Worker fallback
  }

  // =========================================================
  // STEP 4: TIMING CHECKS (performance.now & RAF)
  // =========================================================
  let lastFrameTime = rawPerfNow();
  let rafId: number;

  const frameCheckLoop = (now: number) => {
    const delta = now - lastFrameTime;

    if (delta > 1200) {
      triggerViolation('Задержка отрисовки кадров (DevTools/Переключение вкладки)');
    }
    lastFrameTime = now;

    if (rawHidden() || rawVisibilityState() !== 'visible') {
      triggerViolation('Состояние видимости неактивно');
    }

    if (!rawHasFocus()) {
      triggerViolation('Потеря фокуса окна');
    }

    if (!isTriggered) {
      rafId = rawRequestAnimationFrame.call(window, frameCheckLoop);
    }
  };

  rafId = rawRequestAnimationFrame.call(window, frameCheckLoop);

  // =========================================================
  // STEP 5: EVENT LISTENERS & DOM OBSERVER
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
      triggerViolation('Запрещенные сочетания клавиш');
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
    rawAddEventListener.call(target, 'visibilitychange', () => {
      if (rawHidden()) triggerViolation('Сворачивание вкладки');
    }, { capture: true, passive: false });
    rawAddEventListener.call(target, 'blur', () => triggerViolation('Потеря фокуса окна'), { capture: true, passive: false });
  });

  // Interval integrity check
  const intervalId = rawSetInterval.call(window, () => {
    verifyIntegrity();

    // Debugger trap test
    const start = rawPerfNow();
    (function () {})['constructor']('debugger')();
    const elapsed = rawPerfNow() - start;
    if (elapsed > 100) {
      triggerViolation('Пошаговый отладчик DevTools активирован');
    }
  }, 400);

  // Observer
  const observer = new MutationObserver(() => {
    verifyIntegrity();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

  // Cleanup
  return () => {
    if (rafId) rawCancelAnimationFrame.call(window, rafId);
    if (intervalId) rawClearInterval.call(window, intervalId);
    if (worker) worker.terminate();
    if (workerUrl) URL.revokeObjectURL(workerUrl);
    observer.disconnect();
  };
}
