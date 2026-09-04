// DOM Advanced Lessons — DA1 through DA11
// Following Knowledge Map v3 and Stage 3 Lesson Blueprint

export const domAdvancedLessons = [
  // ============================================
  // DA1 — Basic Events (addEventListener)
  // ============================================
  {
    slug: "basic-events",
    track: "dom-advanced",
    order: 1,
    title: "Базовые события: addEventListener",
    summary: "Понять, что такое событие, как подписываться на него через addEventListener, и чем event.target отличается от event.currentTarget.",
    level: "Advanced",
    prerequisites: ["dom-manipulation"],
    learningObjective: "После этого урока вы сможете подписываться на события через addEventListener, различать event.target и event.currentTarget и корректно удалять обработчики.",
    shortExplanation: "Событие — это уведомление о том, что произошло действие (клик, ввод текста, наведение мыши). addEventListener позволяет подписаться на событие. event.target — элемент, на котором событие произошло. event.currentTarget — элемент, на котором висит listener. removeEventListener требует ту же самую ссылку на функцию.",
    detailedExplanation: "Три ключевых понятия:\n\n1. Event — объект, описывающий действие (click, input, submit и т.д.)\n2. Event handler — функция, которая реагирует на событие\n3. Event listener — связь между событием и handler (создаётся через addEventListener)\n\nСинтаксис:\nelement.addEventListener('click', handler);\n\nАргументы:\n- тип события ('click', 'input', 'submit')\n- функция-обработчик\n- необязательный объект опций\n\nevent объект содержит:\n- event.type — тип события ('click')\n- event.target — элемент, на котором СЛУЧИЛОСЬ событие\n- event.currentTarget — элемент, на котором СЛУШАЕМ событие\n- event.timeStamp — время возникновения\n- event.defaultPrevented — был ли вызван preventDefault\n\nРазница target vs currentTarget:\n\n<div id=\"outer\">\n  <button>Нажми</button>\n</div>\n\ndocument.getElementById('outer').addEventListener('click', (e) => {\n  console.log(e.target);       // <button>Нажми</button>\n  console.log(e.currentTarget); // <div id=\"outer\">\n});\n\ntarget — кнопка (где кликнули).\ncurrentTarget — div (где висит listener).\n\nУдаление listener:\n\nfunction handleClick() { console.log('Клик!'); }\n\nbutton.addEventListener('click', handleClick);\nbutton.removeEventListener('click', handleClick); // работает!\n\nВажно: removeEventListener требует ТУ ЖЕ ссылку на функцию.\n\n// НЕ работает:\nbutton.addEventListener('click', () => console.log('a'));\nbutton.removeEventListener('click', () => console.log('a'));\n// Это РАЗНЫЕ функции!\n\nОпции:\nbutton.addEventListener('click', handler, {\n  once: true,      // вызвать только один раз\n  capture: true,   // слушать на фазе capture\n  passive: true    // listener не вызовет preventDefault (оптимизация)\n});",
    mentalModel: "addEventListener — как повесить объявление на двери: «Когда произойдёт X, позвоните мне». Вы говорите: «Эй, кнопка, когда кто-то кликнет — вызови эту функцию». event.target — это тот, кто постучал (пользователь кликнул на кнопку). event.currentTarget — это та дверь, на которой висит объявление (элемент с listener).",
    examples: [
      {
        level: "minimal",
        code: "const button = document.querySelector('button');\n\nbutton.addEventListener('click', () => {\n  console.log('Кнопка нажата!');\n});",
        explanation: "Простейший listener: при клике на кнопку — вывод сообщения."
      },
      {
        level: "simple",
        code: "const button = document.querySelector('button');\nlet count = 0;\n\nfunction handleClick() {\n  count++;\n  button.textContent = `Кликов: ${count}`;\n}\n\nbutton.addEventListener('click', handleClick);\n// Кнопка: «Кликов: 1», «Кликов: 2», ...\n\n// Позже можно снять listener:\n// button.removeEventListener('click', handleClick);",
        explanation: "Счётчик кликов. Именованная функция позволяет потом удалить listener."
      },
      {
        level: "real",
        code: "const input = document.querySelector('#name-input');\nconst output = document.querySelector('#output');\n\nfunction handleInput(event) {\n  const value = event.target.value;\n  output.textContent = `Вы написали: ${value}`;\n}\n\ninput.addEventListener('input', handleInput);\n\n// Добавляем и удаляем listener по условию:\nlet tracking = true;\n\nfunction toggleTracking() {\n  if (tracking) {\n    input.removeEventListener('input', handleInput);\n    tracking = false;\n  } else {\n    input.addEventListener('input', handleInput);\n    tracking = true;\n  }\n}",
        explanation: "Динамическое управление listener: добавляем и удаляем при необходимости."
      }
    ],
    commonMistakes: [
      {
        wrong: "Создавать новую функцию при удалении listener",
        why: "removeEventListener ищет ТУ ЖЕ ссылку на функцию. Новая стрелочная функция — это другой объект.",
        right: "Используйте именованную функцию для обоих: addEventListener и removeEventListener."
      },
      {
        wrong: "Путать event.target и event.currentTarget",
        why: "target — элемент, на котором произошло событие. currentTarget — элемент, на котором висит listener.",
        right: "Представьте: target — тот, кто постучал. currentTarget — та дверь, у которой стоит охранник."
      },
      {
        wrong: "Забывать, что addEventListener не заменяет предыдущий listener",
        why: "addEventListener добавляет ЕЩЁ ОДИН listener. Два клика — два вызова.",
        right: "Для замены используйте removeEventListener + addEventListener."
      }
    ],
    importantToRemember: [
      "addEventListener привязывает listener к событию",
      "event.target — элемент, где событие произошло",
      "event.currentTarget — элемент, где висит listener",
      "removeEventListener требует ту же ссылку на функцию",
      "addEventListener не заменяет — а добавляет listener"
    ],
    sources: [
      { title: "MDN: addEventListener", url: "https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener" },
      { title: "MDN: введение в события", url: "https://developer.mozilla.org/ru/docs/Learn_web_development/Core/Scripting/Events" }
    ],
    connection: {
      back: "Вы знаете DOM Basics (D1-D8) — вы умеете находить и изменять элементы. Теперь вы заставляете их реагировать на действия пользователя.",
      forward: "Следующий урок (DA2) — как события перемещаются по вложенным элементам: всплытие и погружение."
    }
  },

  // ============================================
  // DA2 — Event Bubbling and Capturing
  // ============================================
  {
    slug: "event-bubbling",
    track: "dom-advanced",
    order: 2,
    title: "Всплытие и погружение событий",
    summary: "Понять, как события проходят три фазы: capture → target → bubbling, и как контролировать propagation.",
    level: "Advanced",
    prerequisites: ["basic-events"],
    learningObjective: "После этого урока вы сможете объяснить три фазы распространения события, правильно использовать stopPropagation и выбирать между обработчиками на фазе capture и bubble.",
    shortExplanation: "Событие проходит три фазы: погружение (capture) — от document к элементу, target — на самом элементе, всплытие (bubbling) — от элемента обратно к document. По умолчанию addEventListener слушает фазу всплытия. stopPropagation() останавливает дальнейшее распространение. event.target — тот, кто вызвал, event.currentTarget — тот, кто слушает.",
    detailedExplanation: "Три фазы propagation:\n\n1. CAPTURING PHASE — событие идёт СВЕРХУ ВНИЗ: document → html → body → div → button\n2. TARGET PHASE — событие на целевом элементе (button)\n3. BUBBLING PHASE — событие идёт СНИЗУ ВВЕРХ: button → div → body → html → document\n\nВизуально:\n\n    document\n      ↓ (capture)\n    html\n      ↓\n    body\n      ↓\n    div#outer\n      ↓\n    button ← TARGET\n      ↑ (bubbling)\n    div#outer\n      ↑\n    body\n      ↑\n    html\n      ↑\n    document\n\nПо умолчанию addEventListener слушает фазу BUBBLING:\n\ndiv.addEventListener('click', () => console.log('div'));\n// при клике на button: сначала 'div' (bubbling)\n\nЧтобы слушать CAPTURING:\n\ndiv.addEventListener('click', handler, { capture: true });\n\nstopPropagation():\n\nbutton.addEventListener('click', (e) => {\n  e.stopPropagation(); // событие дальше НЕ идёт\n  console.log('Только здесь');\n});\n// div и body НЕ увидят клик\n\nВажно: stopPropagation() останавливает propagation, но НЕ default action.\nЭто разные механизмы (см. DA4).",
    mentalModel: "Событие — как мяч, брошенный с крыши. Capture — мяч падает вниз (document → element). Target — мяч ударяется о землю (element). Bubbling — мяч отскакивает вверх (element → document). Каждый уровень (level) может поймать мяч (listener) или остановить его (stopPropagation).",
    examples: [
      {
        level: "minimal",
        code: "<div id=\"outer\">\n  <div id=\"inner\">\n    <button>Клик</button>\n  </div>\n</div>\n\n<script>\ndocument.getElementById('outer').addEventListener('click', () => {\n  console.log('outer');\n});\ndocument.getElementById('inner').addEventListener('click', () => {\n  console.log('inner');\n});\n\n// Клик на button:\n// outer, inner — bubbling: сначала outer, потом inner\n// Нет! Bubbling идёт СНИЗУ ВВЕРХ: inner → outer\n</script>",
        explanation: "Bubbling: клик на button всплывает сначала к inner, потом к outer."
      },
      {
        level: "simple",
        code: "<div id=\"outer\">\n  <button>Клик</button>\n</div>\n\n<script>\n// По умолчанию: bubbling (false)\ndocument.getElementById('outer').addEventListener('click', () => {\n  console.log('bubbling');\n}, false);\n\n// Capture: true\ndocument.getElementById('outer').addEventListener('click', () => {\n  console.log('capturing');\n}, true);\n\n// Клик на button:\n// capturing → bubbling\n</script>",
        explanation: "Порядок: capture (сверху вниз) → target → bubbling (снизу вверх)."
      },
      {
        level: "real",
        code: "<div id=\"modal\">\n  <div class=\"modal-content\">\n    <button class=\"close\">×</button>\n  </div>\n</div>\n\n<script>\n// Закрытие модалки при клике на фон\nconst modal = document.getElementById('modal');\nconst content = document.querySelector('.modal-content');\n\nmodal.addEventListener('click', (e) => {\n  // Закрываем только при клике на фон (не на контент)\n  if (e.target === modal) {\n    modal.style.display = 'none';\n  }\n});\n\n// Кнопка закрытия\nconst closeBtn = document.querySelector('.close');\ncloseBtn.addEventListener('click', (e) => {\n  e.stopPropagation(); // не даём событию дойти до modal\n  modal.style.display = 'none';\n});",
        explanation: "Реальный паттерн: модальное окно с остановкой propagation для кнопки."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что bubbling идёт сверху вниз",
        why: "Bubbling идёт СНИЗУ ВВЕРХ: от target к document. Capture — сверху вниз.",
        right: "Bubbling = снизу вверх. Capture = сверху вниз."
      },
      {
        wrong: "Путать stopPropagation и preventDefault",
        why: "stopPropagation останавливает распространение. preventDefault останавливает действие браузера.",
        right: "Разные механизмы. Подробнее — в уроке DA4."
      },
      {
        wrong: "Считать, что все события всплывают",
        why: "focus, blur, scroll НЕ всплывают.Большинство событий всплывают, но не все.",
        right: "Проверяйте спецификацию: большинство событий всплывают, но есть исключения."
      }
    ],
    importantToRemember: [
      "Capture: document → element (сверху вниз)",
      "Bubbling: element → document (снизу вверх)",
      "По умолчанию addEventListener = bubbling",
      "capture: true = слушать на фазе capture",
      "stopPropagation() останавливает распространение",
      "stopPropagation ≠ preventDefault"
    ],
    connection: {
      back: "Вы умеете подписываться на события (DA1). Теперь вы понимаете, как события перемещаются по вложенным элементам.",
      forward: "Следующий урок (DA3) использует всплытие для делегирования событий — один обработчик для множества элементов."
    }
  },

  // ============================================
  // DA3 — Event Delegation
  // ============================================
  {
    slug: "event-delegation",
    track: "dom-advanced",
    order: 3,
    title: "Делегирование событий",
    summary: "Освоить паттерн делегирования: один обработчик на родителе вместо множества на дочерних элементах, с использованием event.target и data-* атрибутов.",
    level: "Advanced",
    prerequisites: ["event-bubbling"],
    learningObjective: "После этого урока вы сможете реализовать делегирование событий, объяснять, когда оно полезно, и работать с динамически создаваемыми элементами.",
    shortExplanation: "Делегирование — паттерн: вместо того, чтобы вешать listener на каждый элемент, вешаем ОДИН listener на родителя. При событии проверяем event.target, чтобы понять, какой дочерний элемент был задействован. Это работает благодаря всплытию (bubbling) и автоматически обслуживает динамически добавленные элементы.",
    detailedExplanation: "Проблема без делегирования:\n\nconst items = document.querySelectorAll('.item');\nitems.forEach(item => {\n  item.addEventListener('click', handleClick); // 100 listeners!\n});\n\nПроблемы:\n- Много listener'ов = память\n- Динамически добавленные элементы не будут работать\n- Нужно снимать listener'и при удалении элементов\n\nРешение — делегирование:\n\nconst list = document.querySelector('.list');\n\nlist.addEventListener('click', (e) => {\n  const item = e.target.closest('.item');\n  if (item) {\n    console.log('Клик по:', item.textContent);\n  }\n});\n\nПочему это работает:\n1. Клик на .item → событие всплывает до .list\n2. На .list ОДИН listener\n3. e.target.closest('.item') находит ближайший элемент с классом\n4. Автоматически работает для новых элементов!\n\ndata-* атрибуты для идентификации:\n\n<ul class=\"tabs\">\n  <li data-tab=\"home\">Главная</li>\n  <li data-tab=\"about\">О нас</li>\n  <li data-tab=\"contacts\">Контакты</li>\n</ul>\n\ndocument.querySelector('.tabs').addEventListener('click', (e) => {\n  const tab = e.target.closest('[data-tab]');\n  if (tab) {\n    activateTab(tab.dataset.tab);\n  }\n});\n\nКогда делегирование НЕ нужно:\n- Мало статических элементов (5-10) — прямые listener'и проще\n- Событие не всплывает (focus, blur)\n- Нужна сложная логика, зависящая от конкретного элемента",
    mentalModel: "Делегирование — как ресепшен в офисе. Вместо того чтобы навесить звонок на каждую дверь (100 listener'ов), один звонок на ресепшн. Когда кто-то стучит — ресепшен проверяет, в какую дверь постучали (event.target), и направляет звонок нужному сотруднику.",
    examples: [
      {
        level: "minimal",
        code: "<ul id=\"list\">\n  <li>Яблоко</li>\n  <li>Банан</li>\n  <li>Вишня</li>\n</ul>\n\n<script>\nconst list = document.getElementById('list');\n\nlist.addEventListener('click', (e) => {\n  if (e.target.tagName === 'LI') {\n    console.log('Выбрано:', e.target.textContent);\n  }\n});\n</script>",
        explanation: "Делегирование: один listener на ul, проверяем tagName."
      },
      {
        level: "simple",
        code: "<div class=\"todo-list\">\n  <button data-action=\"add\">Добавить</button>\n  <ul>\n    <li data-id=\"1\">\n      Задача 1\n      <button data-action=\"delete\">×</button>\n    </li>\n  </ul>\n</div>\n\n<script>\nconst todoList = document.querySelector('.todo-list');\n\ntodoList.addEventListener('click', (e) => {\n  const action = e.target.dataset.action;\n  const id = e.target.closest('[data-id]')?.dataset.id;\n\n  if (action === 'delete' && id) {\n    console.log(`Удалить задачу ${id}`);\n  }\n});\n</script>",
        explanation: "Делегирование с data-* атрибутами: определяем действие и ID через dataset."
      },
      {
        level: "real",
        code: "// Табы с делегированием\ndocument.querySelector('.tabs').addEventListener('click', (e) => {\n  const tab = e.target.closest('[data-tab]');\n  if (!tab) return;\n\n  // Убираем active у всех\n  document.querySelectorAll('.tabs [data-tab]').forEach(t => {\n    t.classList.remove('active');\n  });\n\n  // Добавляем active выбранному\n  tab.classList.add('active');\n\n  // Показываем нужный контент\n  const targetId = tab.dataset.tab;\n  document.querySelectorAll('.tab-content').forEach(content => {\n    content.style.display = content.id === targetId ? 'block' : 'none';\n  });\n});",
        explanation: "Реальные табы: делегирование + closest + data-* для переключения контента."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать e.target без closest",
        why: "e.target — тот элемент, куда кликнули. Если внутри li есть span — target будет span, а не li.",
        right: "Используйте e.target.closest('.selector'), чтобы найти нужный родительский элемент."
      },
      {
        wrong: "Считать, что делегирование ВСЕГДА быстрее",
        why: "Для 5-10 статических элементов прямые listener'и проще. Делегирование — архитектурный паттерн для динамического контента.",
        right: "Делегирование полезно для: динамических списков, табов, модалок. Не для каждого случая."
      },
      {
        wrong: "Забывать проверять, что closest вернул элемент",
        why: "Клик по пустому месту в контейнере: closest вернёт null.",
        right: "Всегда проверяйте: if (!element) return;"
      }
    ],
    importantToRemember: [
      "Делегирование = один listener на родителе",
      "Работает благодаря всплытию (bubbling)",
      "e.target.closest('.selector') для поиска элемента",
      "Автоматически работает для новых элементов",
      "data-* атрибуты для передачи данных",
      "Не всегда нужен — оцените пользу"
    ],
    connection: {
      back: "Вы понимаете всплытие событий (DA2) — теперь вы используете его для эффективных обработчиков.",
      forward: "Следующий урок (DA4) — как отменять действия браузера по умолчанию: переход по ссылке и отправку формы."
    }
  },

  // ============================================
  // DA4 — Default Browser Actions
  // ============================================
  {
    slug: "default-actions",
    track: "dom-advanced",
    order: 4,
    title: "Действия браузера по умолчанию",
    summary: "Научиться отменять стандартные действия браузера (переход по ссылке, отправка формы) через preventDefault и различать его с stopPropagation.",
    level: "Advanced",
    prerequisites: ["event-bubbling"],
    learningObjective: "После этого урока вы сможете отменять действия браузера по умолчанию через preventDefault, отличать его от stopPropagation и знать, когда return false уместен, а когда нет.",
    shortExplanation: "Браузер выполняет действия по умолчанию: клик по ссылке → переход, submit формы → отправка и перезагрузка, контекстное меню → меню браузера. event.preventDefault() отменяет это действие. event.stopPropagation() останавливает распространение события. Это два разных механизма.",
    detailedExplanation: "Типичные default actions:\n\n1. <a href=\"...\"> — переход по ссылке\n2. <form> submit — отправка формы и перезагрузка страницы\n3. Контекстное меню (правая кнопка)\n4. Выделение текста\n5. <input type=\"submit\"> — отправка формы\n\npreventDefault():\n\ndocument.querySelector('a').addEventListener('click', (e) => {\n  e.preventDefault(); // переход по ссылке отменён\n  console.log('Ссылка не работает!');\n});\n\ndocument.querySelector('form').addEventListener('submit', (e) => {\n  e.preventDefault(); // форма не отправится, страница не перезагрузится\n  // ... своя логика\n});\n\nВажно: preventDefault работает ТОЛЬКО в обработчике, где вызван.\n\nСравнение:\n- preventDefault() — останавливает default action браузера\n- stopPropagation() — останавливает распространение события\n\nОни НЕЗАВИСИМЫ:\n- preventDefault() + stopPropagation() — и отмена, и остановка\n- preventDefault() без stopPropagation() — отмена, событие продолжает всплывать\n- stopPropagation() без preventDefault() — событие остановлено, но default action происходит\n\nreturn false (legacy):\nВ inline handlers (onclick=\"...\") return false предотвращает default action И останавливает propagation.\nНо в addEventListener return false ничего не делает.\nНе используйте return false в modern JavaScript.",
    mentalModel: "preventDefault — как отмена заказа. Вы заказали доставку (браузер хочет перейти по ссылке), но передумали (preventDefault). Доставка отменена. stopPropagation — как закрытие двери. Событие (посылка) доходит до вас, но дальше не проходит. Разные механизмы.",
    examples: [
      {
        level: "minimal",
        code: "<a href=\"https://example.com\">Ссылка</a>\n\n<script>\ndocument.querySelector('a').addEventListener('click', (e) => {\n  e.preventDefault();\n  console.log('Переход отменён!');\n});\n</script>",
        explanation: "preventDefault() отменяет переход по ссылке."
      },
      {
        level: "simple",
        code: "<form id=\"myForm\">\n  <input type=\"text\" name=\"name\">\n  <button type=\"submit\">Отправить</button>\n</form>\n\n<script>\ndocument.getElementById('myForm').addEventListener('submit', (e) => {\n  e.preventDefault();\n  const formData = new FormData(e.target);\n  console.log('Имя:', formData.get('name'));\n  // Форма НЕ отправится, страница НЕ перезагрузится\n});\n</script>",
        explanation: "preventDefault на submit: перехватываем отправку формы."
      },
      {
        level: "real",
        code: "// Запрет контекстного меню\ndocument.addEventListener('contextmenu', (e) => {\n  e.preventDefault();\n  console.log('Контекстное меню запрещено');\n});\n\n// Запрет выделения текста\ndocument.querySelector('.no-select').addEventListener('mousedown', (e) => {\n  e.preventDefault();\n});\n\n// Кастомное контекстное меню\ndocument.addEventListener('contextmenu', (e) => {\n  e.preventDefault();\n  const menu = document.getElementById('custom-menu');\n  menu.style.display = 'block';\n  menu.style.left = e.pageX + 'px';\n  menu.style.top = e.pageY + 'px';\n});",
        explanation: "Реальный пример: кастомное контекстное меню вместо стандартного."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать preventDefault и stopPropagation",
        why: "preventDefault — отменяет действие браузера. stopPropagation — останавливает всплытие/погружение.",
        right: "preventDefault = «не делай то, что обычно делаешь». stopPropagation = «не передавай дальше»."
      },
      {
        wrong: "Использовать return false в addEventListener",
        why: "return false работает ТОЛЬКО в inline handlers. В addEventListener он ничего не делает.",
        right: "Используйте event.preventDefault() в addEventListener."
      },
      {
        wrong: "Думать, что preventDefault останавливает все listener'ы",
        why: "preventDefault НЕ останавливает другие listener'ы на том же элементе. Он только отменяет default action.",
        right: "Для остановки propagation используйте stopPropagation."
      }
    ],
    importantToRemember: [
      "preventDefault() отменяет default action браузера",
      "stopPropagation() останавливает распространение",
      "Они независимы — можно комбинировать",
      "return legacy = legacy, не используйте в addEventListener",
      "preventDefault не останавливает другие listener'ы"
    ],
    connection: {
      back: "Вы понимаете всплытие событий (DA2) и делегирование (DA3). Теперь вы учитесь управлять тем, что происходит при событиях.",
      forward: "Следующий урок (DA5) — пользовательские события: создание собственных типов событий."
    }
  },

  // ============================================
  // DA5 — Custom Events
  // ============================================
  {
    slug: "custom-events",
    track: "dom-advanced",
    order: 5,
    title: "Пользовательские события",
    summary: "Научиться создавать и отправлять собственные события через CustomEvent, передавая данные через detail и слушая их через addEventListener.",
    level: "Advanced",
    prerequisites: ["basic-events"],
    learningObjective: "После этого урока вы сможете создавать CustomEvent, отправлять его на любом элементе, передавать данные через detail и подписываться на пользовательские события.",
    shortExplanation: "CustomEvent — собственный тип события, который вы создаёте. detail — произвольные данные, передаваемые с событием. dispatchEvent() отправляет событие на элемент. addEventListener() слушает его. Это позволяет компонентам общаться без прямых зависимостей.",
    detailedExplanation: "Создание:\nconst event = new CustomEvent('user-login', {\n  detail: { username: 'Анна', role: 'admin' }\n});\n\nОтправка:\ndocument.dispatchEvent(event);\n\nПрослушивание:\ndocument.addEventListener('user-login', (e) => {\n  console.log('Вошёл:', e.detail.username);\n  console.log('Роль:', e.detail.role);\n});\n\ndetail — произвольные данные (объект, массив, строка, число).\n\nПример: компонент модалки\n\nclass Modal {\n  constructor(element) {\n    this.element = element;\n    this.element.addEventListener('close', () => {\n      this.hide();\n    });\n  }\n\n  hide() {\n    this.element.style.display = 'none';\n    // Уведомляем другие компоненты\n    this.element.dispatchEvent(new CustomEvent('modal-closed', {\n      detail: { modalId: this.element.id }\n    }));\n  }\n}\n\n// Другой компонент реагирует\ndocument.addEventListener('modal-closed', (e) => {\n  console.log(`Модалка ${e.detail.modalId} закрыта`);\n});\n\nСобытия на конкретном элементе (не document):\n\nconst button = document.querySelector('#myButton');\nbutton.addEventListener('my-custom-event', handler);\nbutton.dispatchEvent(new CustomEvent('my-custom-event', { detail: 42 }));",
    mentalModel: "CustomEvent — как внутренняя переговорная комната. Вы создаёте свою «тему разговора» (тип события), передаёте «досье» (detail), и отправляете его (dispatchEvent). Любой, кто «слушает эту частоту» (addEventListener), получит сообщение. Компоненты общаются, не зная друг о друге напрямую.",
    examples: [
      {
        level: "minimal",
        code: "// Создаём и отправляем событие\nconst event = new CustomEvent('greet', {\n  detail: { name: 'Мир' }\n});\n\ndocument.dispatchEvent(event);\n\n// Слушаем\ndocument.addEventListener('greet', (e) => {\n  console.log(`Привет, ${e.detail.name}!`);\n});\n// Вывод: Привет, Мир!",
        explanation: "Простейший custom event: создаём, отправляем, слушаем."
      },
      {
        level: "simple",
        code: "// Компонент корзины\nclass Cart {\n  constructor() {\n    this.items = [];\n  }\n\n  addItem(item) {\n    this.items.push(item);\n    // Уведомляем UI\n    document.dispatchEvent(new CustomEvent('cart-updated', {\n      detail: { items: this.items, total: this.items.length }\n    }));\n  }\n}\n\n// UI реагирует\ndocument.addEventListener('cart-updated', (e) => {\n  document.querySelector('.cart-count').textContent = e.detail.total;\n});\n\nconst cart = new Cart();\ncart.addItem({ name: 'Товар 1' }); // UI обновляется автоматически",
        explanation: "Real-world: компонент корзины уведомляет UI через custom events."
      },
      {
        level: "real",
        code: "// Система уведомлений\nclass NotificationService {\n  static notify(message, type = 'info') {\n    document.dispatchEvent(new CustomEvent('notification', {\n      detail: { message, type, timestamp: Date.now() }\n    }));\n  }\n}\n\n// Слушатели\ndocument.addEventListener('notification', (e) => {\n  const { message, type } = e.detail;\n  console.log(`[${type.toUpperCase()}] ${message}`);\n});\n\nNotificationService.notify('Загрузка...', 'info');\nNotificationService.notify('Ошибка!', 'error');",
        explanation: "Сервис уведомлений: несколько компонентов могут отправлять и слушать."
      }
    ],
    commonMistakes: [
      {
        wrong: "Отправлять custom event без detail",
        why: "detail не обязателен, но без него событие бесполезно — нет данных для передачи.",
        right: "Передавайте через detail только то, что нужно слушателям."
      },
      {
        wrong: "Думать, что custom events — это замена для callback",
        why: "Custom events — для общения между отдалёнными компонентами. Прямые callback'и проще для простых случаев.",
        right: "Пользовательские события (custom events) — слабая связь (loosely coupled): отправитель не знает, кто слушает. Колбэки (callbacks) — прямая связь: вызывающий передаёт функцию напрямую."
      },
      {
        wrong: "Забывать, что dispatchEvent синхронный",
        why: "dispatchEvent вызывает все listener'ы синхронно (в том же потоке).",
        right: "Custom events обрабатываются синхронно, как и встроенные."
      }
    ],
    importantToRemember: [
      "new CustomEvent('type', { detail: data }) — создание",
      "element.dispatchEvent(event) — отправка",
      "element.addEventListener('type', handler) — прослушивание",
      "e.detail — данные события",
      "Custom events обрабатываются синхронно"
    ],
    connection: {
      back: "Вы умеете слушать события (DA1-DA4). Теперь вы можете создавать собственные типы событий.",
      forward: "Следующий урок (DA6) — события мыши и Drag and Drop API."
    }
  },

  // ============================================
  // DA6 — Mouse Events, Movement, Drag'n'Drop
  // ============================================
  {
    slug: "mouse-drag",
    track: "dom-advanced",
    order: 6,
    title: "События мыши и Drag'n'Drop",
    summary: "Работать с событиями мыши (click, mousedown, mousemove, mouseup), координатами (clientX/Y) и HTML Drag and Drop API.",
    level: "Advanced",
    prerequisites: ["basic-events"],
    learningObjective: "После этого урока вы сможете обрабатывать события мыши, отслеживать её позицию и реализовывать простое перетаскивание через HTML Drag and Drop API.",
    shortExplanation: "События мыши: click (клик), mousedown (нажатие), mouseup (отпускание), mousemove (движение). Координаты: clientX/Y (от viewport), pageX/Y (от страницы). Drag and Drop: dragstart → dragover → drop. dataTransfer передаёт данные между элементами.",
    detailedExplanation: "События мыши:\n\n1. click — полный клик (mousedown + mouseup)\n2. mousedown — кнопка нажата\n3. mouseup — кнопка отпущена\n4. mousemove — движение мыши (срабатывает часто!)\n5. dblclick — двойной клик\n\nКоординаты:\n\nelement.addEventListener('mousemove', (e) => {\n  console.log('clientX:', e.clientX, 'clientY:', e.clientY);\n  console.log('pageX:', e.pageX, 'pageY:', e.pageY);\n});\n\nclientX/Y — от начала viewport (окна браузера)\npageX/Y — от начала страницы (с учётом прокрутки)\n\nDrag and Drop API:\n\n1. dragstart — начало перетаскивания\n2. drag — элемент перетаскивается\n3. dragenter — элемент вошёл в drop-зону\n4. dragover — элемент над drop-зоной\n5. dragleave — элемент покинул drop-зону\n6. drop — элемент dropped в зону\n7. dragend — перетаскивание завершено\n\nПример:\n\n// Draggable элемент\nconst draggable = document.querySelector('.draggable');\ndraggable.addEventListener('dragstart', (e) => {\n  e.dataTransfer.setData('text/plain', draggable.id);\n  e.dataTransfer.effectAllowed = 'move';\n});\n\n// Drop-зона\nconst dropZone = document.querySelector('.drop-zone');\ndropZone.addEventListener('dragover', (e) => {\n  e.preventDefault(); // обязательно!\n  dropZone.classList.add('over');\n});\n\ndropZone.addEventListener('dragleave', () => {\n  dropZone.classList.remove('over');\n});\n\ndropZone.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const id = e.dataTransfer.getData('text/plain');\n  const element = document.getElementById(id);\n  dropZone.appendChild(element);\n});",
    mentalModel: "Drag and Drop — как перестановка мебели. Вы берёте предмет (dragstart), несёте его (drag), подносите к новому месту (dragover), и ставите (drop). dataTransfer — как этикетка на предмете: на ней написано, что это за предмет.",
    examples: [
      {
        level: "minimal",
        code: "const box = document.querySelector('.box');\n\nbox.addEventListener('mousedown', () => console.log('Нажал'));\nbox.addEventListener('mouseup', () => console.log('Отпустил'));\nbox.addEventListener('click', () => console.log('Клик'));\n// При клике: Нажал → Отпустил → Клик",
        explanation: "Порядок событий: mousedown → mouseup → click."
      },
      {
        level: "simple",
        code: "const area = document.querySelector('.area');\nconst dot = document.querySelector('.dot');\n\nlet isDragging = false;\n\narea.addEventListener('mousedown', (e) => {\n  isDragging = true;\n});\n\ndocument.addEventListener('mousemove', (e) => {\n  if (!isDragging) return;\n  dot.style.left = e.clientX + 'px';\n  dot.style.top = e.clientY + 'px';\n});\n\ndocument.addEventListener('mouseup', () => {\n  isDragging = false;\n});",
        explanation: "Перетаскивание через mouse events (не Drag and Drop API)."
      },
      {
        level: "real",
        code: "// HTML5 Drag and Drop\nconst items = document.querySelectorAll('.item');\nconst container = document.querySelector('.container');\n\nitems.forEach(item => {\n  item.draggable = true;\n\n  item.addEventListener('dragstart', (e) => {\n    e.dataTransfer.setData('text/plain', item.id);\n    item.classList.add('dragging');\n  });\n\n  item.addEventListener('dragend', () => {\n    item.classList.remove('dragging');\n  });\n});\n\ncontainer.addEventListener('dragover', (e) => {\n  e.preventDefault();\n  const afterElement = getDragAfterElement(container, e.clientY);\n  const dragging = document.querySelector('.dragging');\n  if (afterElement == null) {\n    container.appendChild(dragging);\n  } else {\n    container.insertBefore(dragging, afterElement);\n  }\n});",
        explanation: "Реальный Drag and Drop: сортировка списка с определением позиции."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать e.preventDefault() в dragover",
        why: "По умолчанию браузер НЕ позволяет drop. Нужно отменить default action в dragover.",
        right: "В dragover всегда вызывайте e.preventDefault()."
      },
      {
        wrong: "Использовать mousemove без throttle/debounce",
        why: "mousemove срабатывает десятки раз в секунду — это может замедлить страницу.",
        right: "Для анимаций используйте requestAnimationFrame. Для редких обновлений — throttle."
      },
      {
        wrong: "Путать clientX и pageX",
        why: "clientX — от viewport. pageX — от страницы. При прокрутке они различаются.",
        right: "Для позиционирования элемента используйте clientX/Y. Для позиции на странице — pageX/Y."
      }
    ],
    importantToRemember: [
      "mousedown → mouseup → click (порядок событий)",
      "clientX/Y — от viewport, pageX/Y — от страницы",
      "mousemove срабатывает часто — будьте аккуратны",
      "Drag and Drop: dragstart → dragover → drop",
      "В dragover обязательно e.preventDefault()",
      "dataTransfer передаёт данные между drag и drop"
    ],
    connection: {
      back: "Вы знаете события (DA1-DA5). Теперь вы работаете с конкретными взаимодействиями мыши и перетаскиванием.",
      forward: "Следующий урок (DA7) — взаимодействие с формами: свойства, методы и события."
    }
  },

  // ============================================
  // DA7 — Forms: Properties, Methods, Events
  // ============================================
  {
    slug: "forms-properties",
    track: "dom-advanced",
    order: 7,
    title: "Формы: свойства, методы, события",
    summary: "Работать с формами: читать и изменять value, слушать события input и change, использовать form.elements и FormData.",
    level: "Advanced",
    prerequisites: ["attributes-vs-properties", "semantic-markup", "basic-events"],
    learningObjective: "После этого урока вы сможете читать и записывать значения форм, различать события input и change, перебирать элементы формы и создавать FormData.",
    shortExplanation: "Форма — это набор элементов ввода (input, select, textarea). Свойство .value читает/меняет текущее значение. Событие input срабатывает при каждом вводе символа. Событие change срабатывает при потере фокуса или подтверждении select. form.elements — коллекция всех элементов формы. FormData — удобный способ собрать все данные формы.",
    detailedExplanation: "Доступ к элементам формы:\n\nconst form = document.querySelector('#myForm');\nconst nameInput = form.elements.name; // по атрибуту name\nconst allInputs = form.elements; // все элементы\n\nСвойство value:\n\nconst input = document.querySelector('#name');\nconsole.log(input.value); // чтение\ninput.value = 'Новое значение'; // запись\n\nСобытия формы:\n\n1. input — каждый символ (мгновенно)\ninput.addEventListener('input', (e) => {\n  console.log('Текущее:', e.target.value);\n});\n\n2. change — завершение ввода (потеря фокуса, Enter в select)\ninput.addEventListener('change', (e) => {\n  console.log('Итоговое:', e.target.value);\n});\n\nРазница input vs change:\n- input: «Пользователь печатает прямо сейчас»\n- change: «Пользователь закончил ввод»\n\nДля input[type=\"checkbox\"] и input[type=\"radio\"]:\n- .checked — true/false\n- change срабатывает при переключении\n\nДля select:\n- select.value — выбранное значение\n- select.selectedIndex — индекс выбранного option\n- change при выборе нового option\n\nFormData:\n\nconst form = document.querySelector('#myForm');\nconst formData = new FormData(form);\n\n// Чтение\nconsole.log(formData.get('name')); // значение по name=\"name\"\nconsole.log(formData.has('email')); // true/false\n\n// Перебор\nfor (const [key, value] of formData) {\n  console.log(key, value);\n}\n\n// Преобразование в объект\nconst data = Object.fromEntries(formData);",
    mentalModel: "Форма — как анкета. input.value — то, что написано в строке. change — когда вы закончили писать и отложили ручку. input — когда вы пишете каждый символ. FormData — как заполненная анкета: все ответы собраны в одном месте.",
    examples: [
      {
        level: "minimal",
        code: "<input type=\"text\" id=\"name\" value=\"\">\n<p id=\"output\"></p>\n\n<script>\nconst input = document.getElementById('name');\nconst output = document.getElementById('output');\n\ninput.addEventListener('input', (e) => {\n  output.textContent = e.target.value;\n});\n</script>",
        explanation: "input event: текст появляется в реальном времени (символ за символом)."
      },
      {
        level: "simple",
        code: "<form id=\"myForm\">\n  <input type=\"text\" name=\"name\" placeholder=\"Имя\">\n  <input type=\"email\" name=\"email\" placeholder=\"Email\">\n  <select name=\"role\">\n    <option value=\"user\">Пользователь</option>\n    <option value=\"admin\">Админ</option>\n  </select>\n</form>\n\n<script>\nconst form = document.getElementById('myForm');\n\nform.addEventListener('input', (e) => {\n  const data = Object.fromEntries(new FormData(form));\n  console.log(data);\n  // { name: '...', email: '...', role: 'user' }\n});\n</script>",
        explanation: "Сбор данных формы через FormData в реальном времени."
      },
      {
        level: "real",
        code: "// Валидация в реальном времени\nconst form = document.querySelector('#registration');\nconst emailInput = form.elements.email;\nconst emailError = document.querySelector('#email-error');\n\nfunction validateEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}\n\nemailInput.addEventListener('input', (e) => {\n  const value = e.target.value;\n  if (value && !validateEmail(value)) {\n    emailInput.classList.add('invalid');\n    emailError.textContent = 'Некорректный email';\n  } else {\n    emailInput.classList.remove('invalid');\n    emailError.textContent = '';\n  }\n});",
        explanation: "Реальная валидация: проверка email при каждом вводе символа."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать input и change события",
        why: "input — каждый символ. change — завершение ввода (потеря фокуса).",
        right: "input = в реальном времени. change = завершение."
      },
      {
        wrong: "Читать value у select через .value",
        why: "Для select .value работает. Но для checkbox нужен .checked.",
        right: "input/select/textarea → .value. checkbox/radio → .checked."
      },
      {
        wrong: "Забывать, что FormData хранит строки",
        why: "FormData.get() возвращает строку. Числа нужно преобразовывать.",
        right: "const age = Number(formData.get('age'));"
      }
    ],
    importantToRemember: [
      "form.elements — доступ к элементам по name",
      ".value — текущее значение input/select/textarea",
      ".checked — состояние checkbox/radio",
      "input event — каждый символ",
      "change event — завершение ввода",
      "FormData — удобный сбор данных формы"
    ],
    connection: {
      back: "Вы знаете события (DA1-DA6). Теперь вы применяете их к взаимодействию с формами.",
      forward: "Следующий урок (DA8) — отправка форм: объединение форм и fetch для реальной отправки данных."
    }
  },

  // ============================================
  // DA8 — Form Submission
  // ============================================
  {
    slug: "form-submission",
    track: "dom-advanced",
    order: 8,
    title: "Отправка форм",
    summary: "Научиться отправлять формы через fetch: перехватить submit, собрать данные (FormData или JSON), отправить запрос и обработать ответ.",
    level: "Advanced",
    prerequisites: ["forms-properties", "fetch-api"],
    learningObjective: "После этого урока вы сможете отменять отправку формы по умолчанию, собирать данные как FormData или JSON, отправлять их через fetch и обрабатывать ответы об успехе и ошибках.",
    shortExplanation: "Отправка формы: submit event → preventDefault() → собрать данные → fetch POST → обработать ответ. Два способа передачи данных: FormData (multipart/form-data) и JSON (application/json). FormData проще для начинающих. JSON — стандарт для API.",
    detailedExplanation: "Стандартная отправка формы (без JS):\n<form action=\"/api/users\" method=\"POST\">...\nПри submit: браузер отправляет запрос и перезагружает страницу.\n\nС JavaScript:\n\nconst form = document.querySelector('#myForm');\n\nform.addEventListener('submit', async (e) => {\n  e.preventDefault(); // отменяем перезагрузку\n\n  const formData = new FormData(form);\n\n  try {\n    const response = await fetch('/api/users', {\n      method: 'POST',\n      body: formData // multipart/form-data автоматически\n    });\n\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n\n    const result = await response.json();\n    console.log('Успех:', result);\n  } catch (error) {\n    console.log('Ошибка:', error.message);\n  }\n});\n\nJSON отправка:\n\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n\n  const data = Object.fromEntries(new FormData(form));\n\n  const response = await fetch('/api/users', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  const result = await response.json();\n});\n\nFormData vs JSON:\n- FormData: проще, автоматически форматирует, поддерживает файлы\n- JSON: стандарт для API, нужен Content-Type, не поддерживает файлы\n\nСостояние формы:\n- loading: показать индикатор, заблокировать кнопку\n- success: показать сообщение, очистить форму\n- error: показать ошибку, не очищать форму",
    mentalModel: "Отправка формы — как отправка заказа по почте. Вы заполняете форму (FormData), кладёте в конверт (request body), указываете адрес (URL), и отправляете (fetch). Почтальон (браузер) доставляет. Ответ приходит как уведомление о доставке (response).",
    examples: [
      {
        level: "minimal",
        code: "<form id=\"form\">\n  <input type=\"text\" name=\"name\">\n  <button type=\"submit\">Отправить</button>\n</form>\n\n<script>\ndocument.getElementById('form').addEventListener('submit', async (e) => {\n  e.preventDefault();\n  const data = new FormData(e.target);\n  console.log('Отправляем:', Object.fromEntries(data));\n});\n</script>",
        explanation: "Простейший перехват формы: preventDefault + FormData."
      },
      {
        level: "simple",
        code: "const form = document.querySelector('#contactForm');\nconst status = document.querySelector('#status');\n\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n\n  const formData = new FormData(form);\n  const data = Object.fromEntries(formData);\n\n  status.textContent = 'Отправка...';\n\n  try {\n    const response = await fetch('/api/contact', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(data)\n    });\n\n    if (!response.ok) throw new Error('Ошибка сервера');\n\n    status.textContent = 'Отправлено!';\n    form.reset(); // очищаем форму\n  } catch (error) {\n    status.textContent = `Ошибка: ${error.message}`;\n  }\n});",
        explanation: "Полный цикл: отправка + индикатор + обработка ответа + очистка."
      },
      {
        level: "real",
        code: "async function submitForm(form, options = {}) {\n  const {\n    url = form.action,\n    method = form.method || 'POST',\n    format = 'json'\n  } = options;\n\n  const submitBtn = form.querySelector('[type=\"submit\"]');\n  submitBtn.disabled = true;\n  submitBtn.textContent = 'Отправка...';\n\n  try {\n    const formData = new FormData(form);\n\n    let body, headers = {};\n    if (format === 'json') {\n      body = JSON.stringify(Object.fromEntries(formData));\n      headers['Content-Type'] = 'application/json';\n    } else {\n      body = formData;\n    }\n\n    const response = await fetch(url, { method, headers, body });\n\n    if (!response.ok) {\n      const error = await response.text();\n      throw new Error(error || `HTTP ${response.status}`);\n    }\n\n    return await response.json();\n  } finally {\n    submitBtn.disabled = false;\n    submitBtn.textContent = 'Отправить';\n  }\n}",
        explanation: "Универсальная функция отправки формы с поддержкой JSON и FormData."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать preventDefault на submit",
        why: "Без preventDefault форма отправится стандартно и страница перезагрузится.",
        right: "Всегда e.preventDefault() в начале submit handler."
      },
      {
        wrong: "Не блокировать кнопку во время отправки",
        why: "Пользователь может нажать несколько раз → дублирующие запросы.",
        right: "submitBtn.disabled = true во время запроса, false в finally."
      },
      {
        wrong: "Не обрабатывать ошибки",
        why: "Сетевые ошибки, ошибки сервера — обычные ситуации.",
        right: "Всегда try/catch + проверка response.ok."
      }
    ],
    importantToRemember: [
      "e.preventDefault() — отменяем стандартную отправку",
      "FormData — сбор данных формы",
      "JSON.stringify + Content-Type — для JSON API",
      "Блокируйте кнопку во время отправки",
      "Всегда обрабатывайте ошибки"
    ],
    connection: {
      back: "Вы знаете формы (DA7) и fetch (JA7). Теперь вы объединяете их для реальной отправки форм.",
      forward: "Следующий урок (DA9) — события клавиатуры для навигации по формам и горячих клавиш."
    }
  },

  // ============================================
  // DA9 — Keyboard Events
  // ============================================
  {
    slug: "keyboard-events",
    track: "dom-advanced",
    order: 9,
    title: "События клавиатуры",
    summary: "Работать с keydown/keyup, различать event.key и event.code, использовать модификаторы (ctrl, shift, alt, meta) и связать с accessibility.",
    level: "Advanced",
    prerequisites: ["event-bubbling"],
    learningObjective: "После этого урока вы сможете обрабатывать keydown/keyup, различать key и code, использовать клавиши-модификаторы и реализовывать горячие клавиши.",
    shortExplanation: "keydown — клавиша нажата. keyup — клавиша отпущена. event.key — символ ('a', 'Enter', 'ArrowDown'). event.code — физическая клавиша ('KeyA', 'Enter', 'ArrowDown'). modifierKey — ctrlKey, shiftKey, altKey, metaKey (boolean). keypress — deprecated, не используйте.",
    detailedExplanation: "Два основных события:\n\n1. keydown — при нажатии (срабатывает повторно при удержании)\n2. keyup — при отпускании (один раз)\n\nevent.key vs event.code:\n\nkey — что за символ:\n- 'a' — буква a\n- 'Enter' — Enter\n- 'ArrowDown' — стрелка вниз\n- 'Shift' — Shift\n\ncode — какая физическая клавиша:\n- 'KeyA' — клавиша A\n- 'Enter' — Enter\n- 'ShiftLeft' — левый Shift\n\nЗачем различать:\n- Пользователь нажал 'a' на русской раскладке → key = 'ф', code = 'KeyA'\n- Для горячих клавиш используйте code\n- Для ввода текста используйте key\n\nМодификаторы:\n\nelement.addEventListener('keydown', (e) => {\n  if (e.ctrlKey && e.key === 's') {\n    e.preventDefault();\n    console.log('Ctrl+S!');\n  }\n  if (e.shiftKey && e.key === 'Enter') {\n    console.log('Shift+Enter!');\n  }\n});\n\nПоля модификаторов:\n- e.ctrlKey — Ctrl (или Command на Mac, если metaKey)\n- e.shiftKey — Shift\n- e.altKey — Alt\n- e.metaKey — Command (Mac) / Windows key\n\nСвязь с accessibility:\n- Все интерактивные элементы должны быть доступны с клавиатуры\n- tabindex=\"0\" — элемент доступен с Tab\n- focus() — программная фокусировка\n- blur() — снятие фокуса",
    mentalModel: "Клавиатура — как телеграф. keydown — кнопка нажата (сигнал отправлен). keyup — кнопка отпущена (сигнал завершён). event.key — что написано на кнопке ('A', 'Enter'). event.code — где кнопка на клавиатуре (левая, правая, верхняя). Модификаторы — как зажать шифр (Shift) перед отправкой.",
    examples: [
      {
        level: "minimal",
        code: "document.addEventListener('keydown', (e) => {\n  console.log('Клавиша:', e.key);\n  console.log('Код:', e.code);\n});\n// Нажали A: key='a', code='KeyA'\n// Нажали Enter: key='Enter', code='Enter'",
        explanation: "Базовый вывод: key и code при нажатии клавиш."
      },
      {
        level: "simple",
        code: "const input = document.querySelector('#search');\n\ninput.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter') {\n    console.log('Поиск:', input.value);\n  }\n  if (e.key === 'Escape') {\n    input.value = '';\n    input.blur();\n  }\n});",
        explanation: "Обработка Enter для поиска и Escape для очистки."
      },
      {
        level: "real",
        code: "// Горячие клавиши\ndocument.addEventListener('keydown', (e) => {\n  // Ctrl+S — сохранить\n  if (e.ctrlKey && e.key === 's') {\n    e.preventDefault();\n    saveDocument();\n  }\n\n  // Ctrl+Z — отменить\n  if (e.ctrlKey && e.key === 'z') {\n    e.preventDefault();\n    undo();\n  }\n\n  // Ctrl+Shift+P — настройки\n  if (e.ctrlKey && e.shiftKey && e.key === 'P') {\n    e.preventDefault();\n    openSettings();\n  }\n});\n\n// Доступность: навигация стрелками\nconst list = document.querySelector('.menu');\nlist.addEventListener('keydown', (e) => {\n  const items = [...list.querySelectorAll('[role=\"menuitem\"]')];\n  const index = items.indexOf(document.activeElement);\n\n  if (e.key === 'ArrowDown') {\n    e.preventDefault();\n    items[Math.min(index + 1, items.length - 1)].focus();\n  }\n  if (e.key === 'ArrowUp') {\n    e.preventDefault();\n    items[Math.max(index - 1, 0)].focus();\n  }\n});",
        explanation: "Реальные горячие клавиши + навигация меню с клавиатуры."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать deprecated keypress",
        why: "keypress не срабатывает для стрелок, Escape, Shift и других клавиш без символа.",
        right: "Используйте keydown/keyup — они работают для всех клавиш."
      },
      {
        wrong: "Путать event.key и event.code",
        why: "key — символ ('a', 'Enter'). code — физическая клавиша ('KeyA', 'Enter').",
        right: "Для текста → key. Для горячих клавиш → code (или key + модификаторы)."
      },
      {
        wrong: "Забывать preventDefault для горячих клавиш",
        why: "Без preventDefault браузер выполнит стандартное действие (например, Ctrl+S — сохранение страницы).",
        right: "Всегда e.preventDefault() в горячих клавишах."
      }
    ],
    importantToRemember: [
      "keydown — при нажатии (повторяется)",
      "keyup — при отпускании (один раз)",
      "event.key — символ, event.code — физическая клавиша",
      "ctrlKey, shiftKey, altKey, metaKey — модификаторы",
      "keypress — deprecated, не используйте",
      "Все интерактивные элементы должны работать с клавиатуры"
    ],
    connection: {
      back: "Вы знаете события (DA1-DA6) и формы (DA7-DA8). Теперь вы добавляете взаимодействие с клавиатуры.",
      forward: "Следующий урок (DA10) — размеры элементов и прокрутка для расчёта раскладки."
    }
  },

  // ============================================
  // DA10 — Element Sizes and Scrolling
  // ============================================
  {
    slug: "element-sizes-scrolling",
    track: "dom-advanced",
    order: 10,
    title: "Размеры элементов и прокрутка",
    summary: "Различать clientWidth/Height, offsetWidth/Height, scrollWidth/Height, и использовать getBoundingClientRect для позиционирования относительно viewport.",
    level: "Advanced",
    prerequisites: ["margin-padding", "dom-navigation"],
    learningObjective: "После этого урока вы сможете точно измерять элементы, понимать, что включает каждое измерение, и использовать getBoundingClientRect для позиционирования относительно вьюпорта.",
    shortExplanation: "Размеры элементов: clientWidth/Height (контент + padding), offsetWidth/Height (контент + padding + border + scrollbar), scrollWidth/Height (включая скрытый контент). getBoundingClientRect() — позиция и размер относительно viewport (с учётом прокрутки).",
    detailedExplanation: "Три пары измерений:\n\n1. clientWidth / clientHeight:\n   Контент + padding (БЕЗ border, БЕЗ scrollbar)\n   const w = element.clientWidth;\n\n2. offsetWidth / offsetHeight:\n   Контент + padding + border + scrollbar\n   const w = element.offsetWidth;\n\n3. scrollWidth / scrollHeight:\n   Вся ширина/высота контента (включая скрытый за пределами)\n   const w = element.scrollWidth;\n\nВизуально:\n┌──────────────── offsetWidth ──────────────────┐\n│ ┌──────────── clientWidth ────────────┐       │\n│ │                                      │ sb │\n│ │  ┌──────── content ────────────┐    │    │\n│ │  │                              │    │    │\n│ │  └──────────────────────────────┘    │    │\n│ │          (padding)                   │    │\n│ └──────────────────────────────────────┘    │\n└──────────────────────────────────────────────┘\n                   (border)        (scrollbar)\n\ngetBoundingClientRect():\n\nconst rect = element.getBoundingClientRect();\nconsole.log(rect.top);    // от верха viewport\nconsole.log(rect.left);   // от левого края viewport\nconsole.log(rect.width);  // ширина элемента\nconsole.log(rect.height); // высота элемента\nconsole.log(rect.bottom); // rect.top + rect.height\nconsole.log(rect.right);  // rect.left + rect.width\n\nВажно: getBoundingClientRect() — ОТНОСИТЕЛЬНО VIEWPORT.\nЕсли страница прокручена — значения не включают прокрутку.\n\nПрокрутка:\n\nscrollTop — сколько прокручено сверху\nscrollLeft — сколько прокручено слева\nscrollTo(x, y) — программная прокрутка\nscrollBy(x, y) — относительная прокрутка\n\nelement.scrollIntoView({ behavior: 'smooth' }) — прокрутить к элементу",
    mentalModel: "Элемент — как коробка в коробке. clientWidth — внутреннее пространство (контент + подкладка). offsetWidth — коробка целиком (с крышкой и стенками). scrollWidth — если внутри что-то торчит за пределы коробки. getBoundingClientRect — координаты коробки на столе (viewport).",
    examples: [
      {
        level: "minimal",
        code: "const box = document.querySelector('.box');\n\nconsole.log('client:', box.clientWidth, box.clientHeight);\nconsole.log('offset:', box.offsetWidth, box.offsetHeight);\nconsole.log('scroll:', box.scrollWidth, box.scrollHeight);",
        explanation: "Базовые измерения: три пары размеров элемента."
      },
      {
        level: "simple",
        code: "const button = document.querySelector('button');\nconst tooltip = document.querySelector('.tooltip');\n\nfunction showTooltip() {\n  const rect = button.getBoundingClientRect();\n\n  tooltip.style.position = 'fixed';\n  tooltip.style.left = rect.left + 'px';\n  tooltip.style.top = (rect.bottom + 8) + 'px';\n  tooltip.style.display = 'block';\n}\n\nbutton.addEventListener('click', showTooltip);",
        explanation: "Позиционирование тултипа через getBoundingClientRect."
      },
      {
        level: "real",
        code: "// Плавная прокрутка к секции\ndocument.querySelectorAll('a[href^=\"#\"]').forEach(link => {\n  link.addEventListener('click', (e) => {\n    e.preventDefault();\n    const target = document.querySelector(link.getAttribute('href'));\n    if (target) {\n      target.scrollIntoView({ behavior: 'smooth', block: 'start' });\n    }\n  });\n});\n\n// Бесконечная прокрутка\nconst sentinel = document.querySelector('#sentinel');\nconst observer = new IntersectionObserver((entries) => {\n  if (entries[0].isIntersecting) {\n    loadMoreItems();\n  }\n});\nobserver.observe(sentinel);",
        explanation: "Реальные примеры: smooth scroll + IntersectionObserver для бесконечной прокрутки."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать clientWidth и offsetWidth",
        why: "clientWidth не включает border и scrollbar. offsetWidth включает всё.",
        right: "client = контент + padding. offset = контент + padding + border + scrollbar."
      },
      {
        wrong: "Думать, что getBoundingClientRect учитывает прокрутку",
        why: "getBoundingClientRect — от viewport. При прокрутке top/left меняются.",
        right: "Для позиции на странице: rect.top + window.scrollY."
      },
      {
        wrong: "Измерять элемент до его отображения",
        why: "До рендеринга размеры = 0. Измеряйте после mounted/visible.",
        right: "Измеряйте после того, как элемент видим на странице."
      }
    ],
    importantToRemember: [
      "clientWidth/Height: контент + padding",
      "offsetWidth/Height: + border + scrollbar",
      "scrollWidth/Height: включая скрытый контент",
      "getBoundingClientRect: от viewport",
      "scrollTop/scrollLeft: программная прокрутка",
      "Измеряйте только видимые элементы"
    ],
    connection: {
      back: "Вы знаете манипуляции с DOM (D1-D8) и события (DA1-DA9). Теперь вы учитесь точным измерениям.",
      forward: "Финальный урок (DA11) — MutationObserver, выделение текста и связь с Event Loop."
    }
  },

  // ============================================
  // DA11 — MutationObserver, Selection, Event Loop
  // ============================================
  {
    slug: "mutation-observer-event-loop",
    track: "dom-advanced",
    order: 11,
    title: "MutationObserver, выделение текста и Event Loop",
    summary: "Наблюдать за изменениями DOM через MutationObserver, работать с выделением текста через Selection API, и понять порядок выполнения: синхронный код → microtasks → tasks.",
    level: "Advanced",
    prerequisites: ["dom-tree"],
    learningObjective: "После этого урока вы сможете отслеживать изменения DOM через MutationObserver, читать выделенный текст через Selection API и объяснять порядок выполнения задач и микрозадач.",
    shortExplanation: "MutationObserver следит за изменениями DOM (добавление/удаление узлов, изменение атрибутов). Selection API читает выделенный пользователем текст. Event Loop определяет порядок выполнения: синхронный код → microtasks (Promise callbacks) → tasks (setTimeout callbacks).",
    detailedExplanation: "Этот урок — три самостоятельные темы, объединённые одной идеей «браузер уведомляет ваш код». Их можно читать по отдельности: наблюдение за DOM (MutationObserver), выделение текста (Selection API) и порядок выполнения асинхронного кода (Event Loop).\n\n### 1. MutationObserver — наблюдение за изменениями DOM\n\nОбычный код работает «по запросу»: вы вызвали функцию — она выполнилась. MutationObserver работает наоборот: вы говорите браузеру «следи за этим узлом», и он сам вызывает ваш колбэк каждый раз, когда DOM меняется.\n\n```js\nconst observer = new MutationObserver((mutations) => {\n  mutations.forEach(mutation => {\n    console.log('Тип:', mutation.type);\n    console.log('Добавлены:', mutation.addedNodes);\n    console.log('Удалены:', mutation.removedNodes);\n  });\n});\n\nobserver.observe(document.body, {\n  childList: true,     // добавление/удаление дочерних узлов\n  attributes: true,    // изменение атрибутов\n  subtree: true,       // следить за всем поддеревом\n  characterData: true  // изменение текста\n});\n\nobserver.disconnect(); // остановить наблюдение\n```\n\nВажно: колбэк MutationObserver — это microtask, а не task. Он выполняется после текущего синхронного кода, но до setTimeout.\n\n### 2. Selection API — выделение текста\n\nSelection API читает текст, который выделил пользователь (мышью или с клавиатуры), и позволяет управлять выделением программно. Range описывает часть документа, а Selection — текущее выделение (набор из одного или нескольких Range).\n\n```js\nconst selection = document.getSelection();\nconst selectedText = selection.toString();\nconsole.log('Выделено:', selectedText);\n\n// Выделить текст программно\nconst range = document.createRange();\nrange.selectNodeContents(document.querySelector('.text'));\nselection.removeAllRanges();\nselection.addRange(range);\n```\n\n### 3. Event Loop — порядок выполнения кода\n\nВы уже знаете, что колбэки Promise попадают в очередь микрозадач (уроки JA4 и JA5). Event Loop — это «диспетчер», который решает, что выполнять следующим. Зачем он нужен: JavaScript однопоточный, поэтому порядок «что выполняется сейчас, а что потом» обязан быть предсказуемым.\n\nПорядок выполнения:\n1. Синхронный код (call stack) — выполняется сразу, до конца.\n2. Microtasks (Promise.then, queueMicrotask, MutationObserver) — после синхронного кода, все подряд.\n3. Tasks (setTimeout, setInterval, I/O) — по одному, между отрисовками.\n\n```js\nconsole.log('1. Синхронный код');\n\nsetTimeout(() => {\n  console.log('4. Task (setTimeout)');\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log('3. Microtask (Promise)');\n});\n\nqueueMicrotask(() => {\n  console.log('3. Microtask (queueMicrotask)');\n});\n\nconsole.log('2. Синхронный код');\n\n// Вывод: 1, 2, 3, 3, 4\n```\n\nМикрозадачи (microtasks): Promise.then/catch/finally, queueMicrotask(), колбэк MutationObserver.\nЗадачи (tasks): setTimeout, setInterval, обработка I/O.",
    mentalModel: "Event Loop — как диспетчер в такси. Синхронный код — текущий пассажир (ездим пока не высадится). Microtasks — VIP-пассажиры (высаживаем всех перед следующим рейсом). Tasks — обычные пассажиры (высаживаем по одному в каждом рейсе). MutationObserver — VIP-звонок: срабатывает после текущей поездки, но до следующей.",
    examples: [
      {
        level: "minimal",
        code: "// MutationObserver\nconst target = document.querySelector('#list');\n\nconst observer = new MutationObserver((mutations) => {\n  for (const mutation of mutations) {\n    console.log('Изменение:', mutation.type);\n  }\n});\n\nobserver.observe(target, { childList: true });\n\n// Добавляем элемент — observer сработает\ntarget.innerHTML += '<li>Новый</li>';",
        explanation: "Простейший MutationObserver: следим за добавлением элементов."
      },
      {
        level: "simple",
        code: "// Порядок выполнения\nconsole.log('1');\n\nsetTimeout(() => console.log('2'), 0);\n\nPromise.resolve().then(() => console.log('3'));\n\nqueueMicrotask(() => console.log('4'));\n\nconsole.log('5');\n\n// Вывод: 1, 5, 3, 4, 2\n// Синхронный → Microtasks → Tasks",
        explanation: "Классический пример порядка: sync → microtask → task."
      },
      {
        level: "real",
        code: "// Динамический список с отслеживением\nconst list = document.querySelector('#todo-list');\nlet itemCount = 0;\n\nconst observer = new MutationObserver((mutations) => {\n  for (const mutation of mutations) {\n    if (mutation.type === 'childList') {\n      itemCount += mutation.addedNodes.length - mutation.removedNodes.length;\n      document.querySelector('#count').textContent = itemCount;\n    }\n  }\n});\n\nobserver.observe(list, { childList: true });\n\n// Добавляем элементы — счётчик обновляется автоматически\nfunction addItem(text) {\n  const li = document.createElement('li');\n  li.textContent = text;\n  list.appendChild(li);\n}",
        explanation: "Реальный паттерн: автоматический подсчёт элементов через MutationObserver."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать observer.disconnect()",
        why: "Без disconnect observer работает бесконечно — утечка памяти.",
        right: "Всегда отключайте observer, когда он больше не нужен."
      },
      {
        wrong: "Думать, что MutationObserver callback — task",
        why: "MutationObserver callback — microtask. Он выполняется ДО setTimeout.",
        right: "Microtasks: Promise, queueMicrotask, MutationObserver. Tasks: setTimeout, setInterval."
      },
      {
        wrong: "Путать Selection и Range",
        why: "Selection — текущее выделение пользователя. Range — диапазон в DOM.",
        right: "Selection содержит Range(ы). Range описывает часть дерева."
      }
    ],
    importantToRemember: [
      "MutationObserver следит за изменениями DOM",
      "observer.observe(target, options) — начать",
      "observer.disconnect() — остановить",
      "MutationObserver callback = microtask",
      "Event Loop: sync → microtasks → tasks",
      "Selection API читает выделенный текст"
    ],
    sources: [
      { title: "MDN: MutationObserver", url: "https://developer.mozilla.org/ru/docs/Web/API/MutationObserver" },
      { title: "MDN: модель параллелизма и Event Loop", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Event_loop" }
    ],
    connection: {
      back: "Вы знаете DOM (D1-D8), события (DA1-DA10) и асинхронный JavaScript (JA1-JA7). Теперь вы видите полную картину: изменения DOM, события и порядок выполнения.",
      forward: "Вы завершили DOM Advanced! Основной путь курса пройден. Дальше по желанию — JS Advanced: дополнительные возможности языка."
    }
  }
] as const;
