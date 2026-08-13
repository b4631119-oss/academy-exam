export function initAntiCheat(onViolation?: (reason: string) => void) {
  if (typeof window === 'undefined') return;

  const handleViolation = (reason: string) => {
    if (onViolation) {
      onViolation(reason);
    } else {
      alert(`⚠️ Внимание! ${reason}. Это действие зафиксировано.`);
    }
  };

  // 1. Блокировка копирования, вставки и вырезания
  const preventCopyPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    handleViolation('Копирование и вставка запрещены');
  };
  document.addEventListener('copy', preventCopyPaste);
  document.addEventListener('paste', preventCopyPaste);
  document.addEventListener('cut', preventCopyPaste);

  // 2. Блокировка контекстного меню
  const preventContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  document.addEventListener('contextmenu', preventContextMenu);

  // 3. Блокировка горячих клавиш (DevTools, Печать, Сохранение, Обновление)
  const preventHotkeys = (e: KeyboardEvent) => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (DevTools)
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
      (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
      e.preventDefault();
      handleViolation('Попытка открыть инструменты разработчика');
    }
    // Ctrl+P (Печать), Ctrl+S (Сохранение)
    if (e.ctrlKey && (e.key === 'P' || e.key === 'p' || e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      handleViolation('Печать и сохранение страницы запрещены');
    }
    // F5, Ctrl+R (Обновление)
    if (e.key === 'F5' || (e.ctrlKey && (e.key === 'R' || e.key === 'r'))) {
      e.preventDefault();
      handleViolation('Обновление страницы во время экзамена запрещено');
    }
    // Попытка перехватить скриншот (PrintScreen)
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText(''); // Очистка буфера обмена
      handleViolation('Попытка сделать скриншот');
    }
  };
  document.addEventListener('keydown', preventHotkeys);

  // 4. Отслеживание потери фокуса (уход в другую вкладку/окно)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      handleViolation('Переключение вкладок или сворачивание окна браузера');
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const handleBlur = () => {
    handleViolation('Потеря фокуса окна браузера');
  };
  window.addEventListener('blur', handleBlur);

  // 5. Предупреждение при попытке закрыть вкладку
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = 'Вы уверены, что хотите покинуть страницу? Прогресс может быть утерян.';
    return e.returnValue;
  };
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Возвращаем функцию для отключения защиты (при завершении экзамена/размонтировании)
  return () => {
    document.removeEventListener('copy', preventCopyPaste);
    document.removeEventListener('paste', preventCopyPaste);
    document.removeEventListener('cut', preventCopyPaste);
    document.removeEventListener('contextmenu', preventContextMenu);
    document.removeEventListener('keydown', preventHotkeys);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
