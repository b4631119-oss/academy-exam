// CSS Lessons — C1 through C23
// Following Knowledge Map v3 and Stage 3 Lesson Blueprint
// Technical corrections from Batch 2 preserved

export const cssLessons = [
  // ============================================
  // C1 — Introduction to CSS
  // ============================================
  {
    slug: "intro-to-css",
    track: "css",
    order: 1,
    title: "Введение в CSS",
    summary: "Что такое CSS, зачем он нужен и как подключить стили к HTML-странице.",
    level: "Foundation",
    prerequisites: ["intro-to-html"],
    learningObjective: "После этого урока вы сможете объяснить, что такое CSS, подключить стили к HTML тремя способами и написать базовые CSS-правила.",
    shortExplanation: "CSS (Cascading Style Sheets) — язык стилей, который описывает ВНЕШНИЙ ВИД HTML-элементов. HTML создаёт структуру, CSS — покраска и оформление. CSS подключается тремя способами: через <style> в head, через <link> на внешний файл, или через inline-атрибут style.",
    detailedExplanation: "HTML — каркас. CSS — отделка. Без CSS страница — чёрный текст на белом фоне. CSS превращает «скелет» в красивую страницу.\n\nТри способа подключения CSS:\n\n1. Внешний файл (рекомендуется):\n<link rel=\"stylesheet\" href=\"style.css\">\nЧисто, переиспользуемо, кэшируется браузером.\n\n2. Внутри <style> в <head>:\n<style>\n  p { color: red; }\n</style>\nУдобно для быстрого прототипирования.\n\n3. Inline-стили (не рекомендуется):\n<p style=\"color: red;\">Текст</p>\nНарушает разделение HTML/CSS.\n\nСтруктура CSS-правила:\nselector {\n  property: value;\n}\n\nСелектор — КАКИЕ элементы стилизовать.\nСвойство — ЧТО менять (цвет, размер, отступ).\nЗначение — КАК менять (red, 16px, 10px).",
    mentalModel: "CSS — как покраска здания. HTML — стены ( белые, голые ). CSS — краска, обои, мебель. Селектор — «покрась ЭТИ стены». Свойство — «в КАКОЙ цвет». Значение — «красный».",
    examples: [
      {
        level: "minimal",
        code: "<!-- В HTML -->\n<link rel=\"stylesheet\" href=\"style.css\">\n\n/* В style.css */\np {\n  color: blue;\n  font-size: 18px;\n}",
        explanation: "Самый простой CSS: подключили файл и окрасили все параграфы в синий."
      },
      {
        level: "simple",
        code: "/* Все заголовки — красные */\nh1, h2, h3 {\n  color: #e74c3c;\n}\n\n/* Параграфы — серый текст */\np {\n  color: #555;\n  line-height: 1.6;\n}\n\n/* Ссылки без подчёркивания */\na {\n  text-decoration: none;\n  color: #3498db;\n}",
        explanation: "Группировка селекторов и базовые свойства."
      },
      {
        level: "real",
        code: "/* style.css — подключается через <link> */\n\nbody {\n  font-family: 'Segoe UI', Arial, sans-serif;\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 20px;\n  background-color: #fafafa;\n  color: #333;\n}\n\nh1 {\n  color: #2c3e50;\n  border-bottom: 2px solid #3498db;\n  padding-bottom: 10px;\n}\n\na:hover {\n  color: #2980b9;\n}",
        explanation: "Реальный CSS для простого блога: типографика, центрирование, ссылки."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать inline-стили повсюду",
        why: "Inline-стили difficult to maintain, impossible to кэшировать, нарушают разделение HTML/CSS.",
        right: "Используйте внешние CSS-файлы. Inline — только для динамических стилей из JavaScript."
      },
      {
        wrong: "Путать property и value",
        why: "property: value — порядок важен! color: red (правильно). red: color (неправильно).",
        right: "Всегда: property: value; Точка с запятой обязательна."
      },
      {
        wrong: "Забывать точку с запятой",
        why: "Без ; браузер не понимает, где заканчивается свойство. Следующее правило может сломаться.",
        right: "Каждое свойство заканчивается точкой с запятой: color: red; font-size: 16px;"
      }
    ],
    importantToRemember: [
      "CSS описывает ВНЕШНИЙ ВИД HTML-элементов",
      "Внешний файл — лучший способ подключения",
      "Селектор { свойство: значение; } — базовый синтаксис",
      "Точка с запятой после каждого свойства",
      "CSS не меняет HTML — он стилизует его"
    ],
    sources: [
      { title: "MDN: CSS", url: "https://developer.mozilla.org/ru/docs/Web/CSS" },
      { title: "MDN: первые шаги в CSS", url: "https://developer.mozilla.org/ru/docs/Learn_web_development/Core/Styling_basics" }
    ],
    connection: {
      back: "Этот урок требует базовых знаний HTML (H1). CSS — следующий шаг после разметки.",
      forward: "В следующем уроке (C2) вы изучите селекторы и наследование — как CSS-правила находят нужные элементы."
    }
  },

  // ============================================
  // C2 — Selectors and Inheritance
  // ============================================
  {
    slug: "selectors-inheritance",
    track: "css",
    order: 2,
    title: "Селекторы и наследование",
    summary: "Типовые, классовые, ID-селекторы, вложенность и наследование CSS-свойств.",
    level: "Foundation",
    prerequisites: ["intro-to-css"],
    learningObjective: "После этого урока вы сможете использовать селекторы по элементу, классу, id, дочерние и вложенные селекторы, а также понимать, какие CSS-свойства наследуются.",
    shortExplanation: "Селекторы определяют, какие HTML-элементы получат стили. Типовый селектор (p) — все параграфы. Классовый (.class) — элементы с class=\"class\". ID (#id) — один конкретный элемент. Наследование: текстовые свойства (color, font-size) передаются от родителя к детям, блочные (padding, border) — нет.",
    detailedExplanation: "Основные селекторы:\n\n1. Типовый (element):\np { color: red; } — все <p>\n\n2. Классовый:\n.text { color: gray; } — все элементы с class=\"text\"\n\n3. ID:\n#header { background: blue; } — элемент с id=\"header\"\n\n4. Универсальный:\n* { margin: 0; } — ВСЕ элементы\n\n5. Вложенный (descendant):\narticle p { } — все <p> внутри <article>\n\n6. Дочерний (child):\narticle > p { } — только прямые <p>-дети <article>\n\n7. Соседний (adjacent):\nh2 + p { } — первый <p> сразу после <h2>\n\nНаследование:\n- НАСЛЕДУЮТСЯ: color, font-size, font-family, line-height, text-align\n- НЕ НАСЛЕДУЮТСЯ: padding, margin, border, background, width, height\n\nСпецификация (пока просто): чем конкретнее селектор — тем он «сильнее».",
    mentalModel: "Селекторы — как фильтры для покраски. «Все стены» — типовый. «Стены с классом 'акцент'» — классовый. «Стена #42» — ID. Наследование: если покрасить родительскую стену в синий — дочерние элементы тоже станут синими (для цвета текста).",
    examples: [
      {
        level: "minimal",
        code: "/* Типовый */\np { color: #333; }\n\n/* Классовый */\n.highlight { background: yellow; }\n\n/* ID */\n#main-title { font-size: 2em; }",
        explanation: "Базовые селекторы: тип, класс, ID."
      },
      {
        level: "simple",
        code: "/* Вложенный: все p внутри article */\narticle p {\n  line-height: 1.8;\n}\n\n/* Дочерний: только прямые p-дети */\narticle > p {\n  margin-bottom: 1em;\n}\n\n/* Соседний: первый p после h2 */\nh2 + p {\n  font-weight: bold;\n}\n\n/* Группировка */\nh1, h2, h3 {\n  color: #2c3e50;\n}",
        explanation: "Вложенность, дочерний, соседний селекторы и группировка."
      },
      {
        level: "real",
        code: "/* Навигация */\nnav a {\n  text-decoration: none;\n  color: #555;\n}\n\nnav a:hover {\n  color: #3498db;\n}\n\n/* Статья */\narticle > h2 {\n  font-size: 1.5em;\n  margin-bottom: 0.5em;\n}\n\narticle > p {\n  margin-bottom: 1em;\n  line-height: 1.7;\n}\n\n/* Выделенный параграф в статье */\narticle > p.important {\n  background: #fffde7;\n  border-left: 3px solid #f1c40f;\n  padding: 12px;\n}",
        explanation: "Реальный CSS: навигация и стилизация статьи с вложенными селекторами."
      }
    ],
    commonMistakes: [
      {
        wrong: "Злоупотреблять ID-селекторами",
        why: "ID — уникальный и имеет высокую спецификацию. Использование #id для стилей делает код difficult to maintain.",
        right: "Для стилей используйте классы (.class). ID — для якорей и JavaScript."
      },
      {
        wrong: "Думать, что padding и margin наследуются",
        why: "Блочные свойства (padding, margin, border) НЕ наследуются. Только текстовые (color, font).",
        right: "Для uniform spacing используйте наследуемые свойства или стилизуйте каждый уровень."
      },
      {
        wrong: "Путать descendant и child селекторы",
        why: "article p — все p внутри (любой глубины). article > p — только прямые дети. Разница важна!",
        right: "article p — глубокий поиск. article > p — только прямые потомки."
      }
    ],
    importantToRemember: [
      "element — тип, .class — класс, #id — ID",
      "descendant (пробел) vs child (>) — глубина поиска",
      "Наследуются: color, font-size, text-align",
      "Не наследуются: padding, margin, border, background",
      "Для стилей — классы, для уникальных — ID"
    ],
    connection: {
      back: "Вы знаете основы CSS (C1) — селекторы определяют, какие элементы получат стили.",
      forward: "В следующем уроке (C3) вы изучите каскад и специфичность — как разрешаются конфликты CSS-правил."
    }
  },

  // ============================================
  // C3 — Cascade and Specificity
  // ============================================
  {
    slug: "cascade-specificity",
    track: "css",
    order: 3,
    title: "Каскад и спецификация",
    summary: "Как CSS разрешает конфликты: каскад, спецификация, наследование и !important.",
    level: "Beginner",
    prerequisites: ["selectors-inheritance"],
    learningObjective: "После этого урока вы сможете объяснить, как работает каскад, вычислять специфичность и разрешать конфликты CSS-правил.",
    shortExplanation: "Каскад (Cascade) — алгоритм CSS для разрешения конфликтов. Когда два правила пытаются стилизовать одно свойство одного элемента, CSS использует три фактора: спецификация (насколько конкретен селектор), источник ( stylesheet, browser, !important), и порядок (последнее правило побеждает при равной спецификации).",
    detailedExplanation: "Каскад — это НЕ просто «последний стиль побеждает». Это трёхшаговый алгоритм:\n\nШаг 1: Источник и важность (origin + importance)\nПравила делятся по источнику:\n- Автор (author) — ваши стили\n- Пользователь (user) — личные настройки пользователя в браузере\n- Браузер (user agent) — встроенные стили по умолчанию\n\nДля ОБЫЧНЫХ правил приоритет источников: автор > пользователь > браузер.\n!important — это отдельный механизм важности, а не источник: правило с !important побеждает обычные правила своего источника. Для важных правил порядок источников обратный: пользователь > автор > браузер (защита доступности — пользователь может переопределить сайт).\n\nШаг 2: Спецификация (насколько конкретен селектор)\nСпецификация — тройка чисел (a, b, c):\n- a: количество #id селекторов\n- b: количество .class, [attr], :pseudo-class\n- c: количество element, ::pseudo-element\n\nПримеры:\np {} → (0, 0, 1)\n.text {} → (0, 1, 0)\n#header {} → (1, 0, 0)\nnav .text {} → (0, 1, 1)\n#header .text {} → (1, 1, 0)\n\n(1, 0, 0) > (0, 100, 100) — один ID > любое количество классов!\n\nШаг 3: Порядок в коде\nПри равной спецификации побеждает ПОСЛЕДНЕЕ правило.\n\n!important:\nМеняет порядок (см. Шаг 1). Используйте КРАЙНЕ редко — его очень сложно переопределить.\n\nНаследование vs Каскад:\nНаследование — передача значений от родителя к детям.\nКаскад — разрешение конфликтов между правилами.\nЭто РАЗНЫЕ механизмы!",
    mentalModel: "Каскад — как судебное разбирательство. !important — кассация (переворачивает всё). Спецификация — юрисдикция (чем выше суд — тем весомее решение). Порядок — дата заседания (последнее решение действует).",
    examples: [
      {
        level: "minimal",
        code: "p { color: red; }       /* (0,0,1) */\n.text { color: blue; }  /* (0,1,0) */\n/* .text побеждает: (0,1,0) > (0,0,1) */\n\n/* Результат: синий текст */",
        explanation: "Класс (.text) специфичнее типа (p). Синий побеждает."
      },
      {
        level: "simple",
        code: "/* Спецификация в действии */\np { color: gray; }           /* (0,0,1) */\n.content p { color: green; }  /* (0,1,1) */\n#main p { color: red; }       /* (1,0,1) */\n/* Результат: красный (#main > .content > p) */\n\n/* Порядок при равной спецификации */\na { color: blue; }\na { color: red; }\n/* Результат: красный (последнее правило) */\n\n/* !important */\np { color: blue !important; }\n#main p { color: red; }\n/* Результат: синий (!important побеждает) */",
        explanation: "Спецификация, порядок и !important в действии."
      },
      {
        level: "real",
        code: "/* Реальный пример: проблема спецификации */\n/* Селектор формы */\nform input { \n  padding: 8px;\n  border: 1px solid #ccc;\n}\n\n/* Нужно переопределить, но specificity выше! */\n.form-group .input-field { /* (0,2,1) > (0,0,2) — перебьёт! */\n  padding: 12px;\n  border: 2px solid #3498db;\n}\n\n/* Плохой подход: !important */\nform input { padding: 8px !important; } /* антипаттерн! */\n\n/* Хороший подход: более специфичный селектор */\n.form-group input[name=\"email\"] { /* (0,2,2) */\n  padding: 12px;\n  border: 2px solid #3498db;\n}",
        explanation: "Реальная проблема: спецификация мешает переопределить стили. Решение — более специфичный селектор."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что cascade = specificity",
        why: "Cascade — алгоритм разрешения конфликтов (3 шага). Specificity — часть cascade (шаг 2). Это не одно и то же.",
        right: "Каскад включает спецификацию, порядок и важность. Спецификация — лишь один из факторов."
      },
      {
        wrong: "Считать specificity как «inline > id > class»",
        why: "Это упрощение, которое вводит в заблуждение. Нужно СЧИТАТЬ спецификацию (a, b, c).",
        right: "Считайте: (id, class/attr/pseudo-class, element/pseudo-element). Сравнивайте попарно."
      },
      {
        wrong: "Злоупотреблять !important",
        why: "!important ломает каскад. Переопределить !important можно только другим !important — это ад.",
        right: "Избегайте !important. Используйте более специфичные селекторы или архитектурные решения."
      }
    ],
    importantToRemember: [
      "Каскад = источник + спецификация + порядок",
      "Специфичность: (id, class, element) — считайте, не угадывайте",
      "!important — крайняя мера, антипаттерн",
      "При равной спецификации побеждает последнее правило",
      "Каскад ≠ наследование — это разные механизмы"
    ],
    sources: [
      { title: "MDN: каскад (Cascade)", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade" },
      { title: "MDN: специфичность", url: "https://developer.mozilla.org/ru/docs/Web/CSS/Specificity" }
    ],
    connection: {
      back: "Вы знаете селекторы (C2) — каскад и специфичность объясняют, что происходит, когда правила конфликтуют.",
      forward: "В следующем уроке (C4) вы изучите цвета: hex, rgb, hsl и прозрачность (opacity)."
    }
  },

  // ============================================
  // C4 — Colors
  // ============================================
  {
    slug: "colors",
    track: "css",
    order: 4,
    title: "Цвета",
    summary: "Форматы цветов: именованные, hex, rgb, rgba, hsl, hsla и opacity.",
    level: "Beginner",
    prerequisites: ["cascade-specificity"],
    learningObjective: "После этого урока вы сможете использовать разные форматы цветов (именованные, hex, rgb, hsl) и применять прозрачность в CSS.",
    shortExplanation: "CSS поддерживает несколько форматов цветов: именованные (red, blue), hex (#ff0000), rgb (rgb(255,0,0)), rgba (с прозрачностью), hsl (hue-saturation-lightness). Выбор формата зависит от задачи: hex — для дизайнеров, rgb — для программистов, hsl — для интуитивной настройки.",
    detailedExplanation: "Форматы цветов:\n\n1. Именованные:\ncolor: red; color: navy; color: tomato;\n~140 стандартных имён. Удобно, но ограничено.\n\n2. Hex (шестнадцатеричный):\ncolor: #ff0000; — красный\ncolor: #f00; — сокращённый (аналог #ff0000)\ncolor: #333; — тёмно-серый\nФормат: #RRGGBB или #RGB\n\n3. RGB:\ncolor: rgb(255, 0, 0); — красный\ncolor: rgb(0, 128, 255); — голубой\nЗначения: 0-255 для каждого канала\n\n4. RGBA (с прозрачностью):\ncolor: rgba(0, 0, 0, 0.5); — чёрный 50% прозрачный\nАльфа: 0 (прозрачный) — 1 (непрозрачный)\n\n5. HSL (Hue-Saturation-Lightness):\ncolor: hsl(0, 100%, 50%); — красный\nHue: 0-360 (цветовой круг)\nSaturation: 0-100% (насыщенность)\nLightness: 0-100% (яркость)\n\n6. HSLA:\ncolor: hsla(0, 100%, 50%, 0.5); — красный 50%\n\nOpacity (прозрачность элемента):\nopacity: 0.5; — весь элемент 50% прозрачный\n\nРекомендация:\n- Именованные — для быстрого прототипирования\n- Hex — для работы с дизайнерами\n- HSL — для интуитивной настройки (легко менять яркость)",
    mentalModel: "Цвета — как краски в палитре. Именованные — баночки с подписями (красный, синий). Hex — код краски (для компьютера). RGB — три ползунка (красный, зелёный, синий). HSL — три ползунка (оттенок, насыщенность, яркость).",
    examples: [
      {
        level: "minimal",
        code: "/* Именованные */\nbody { color: #333; background: white; }\n\n/* Hex */\nh1 { color: #2c3e50; }\na { color: #3498db; }\n\n/* RGB */\np { color: rgb(52, 73, 94); }",
        explanation: "Базовые форматы: hex для основных цветов, rgb для точных значений."
      },
      {
        level: "simple",
        code: "/* HSL — удобно менять яркость */\n:root {\n  --primary: hsl(210, 80%, 50%);\n  --primary-light: hsl(210, 80%, 70%);\n  --primary-dark: hsl(210, 80%, 30%);\n}\n\n/* Прозрачность */\n.overlay {\n  background: rgba(0, 0, 0, 0.6);\n  color: white;\n}\n\n/* Opacity — весь элемент */\n.faded {\n  opacity: 0.4;\n}",
        explanation: "HSL для цветовых схем, rgba для оверлеев, opacity для прозрачности."
      },
      {
        level: "real",
        code: "/* Цветовая палитра проекта */\n:root {\n  /* Основные */\n  --color-primary: hsl(210, 80%, 50%);\n  --color-secondary: hsl(160, 60%, 45%);\n  --color-accent: hsl(35, 100%, 55%);\n\n  /* Нейтральные */\n  --color-text: hsl(220, 15%, 20%);\n  --color-text-muted: hsl(220, 10%, 45%);\n  --color-bg: hsl(0, 0%, 98%);\n  --color-border: hsl(220, 15%, 88%);\n\n  /* Семантические */\n  --color-success: hsl(145, 60%, 40%);\n  --color-error: hsl(0, 70%, 50%);\n  --color-warning: hsl(40, 90%, 50%);\n}\n\nbody {\n  color: var(--color-text);\n  background: var(--color-bg);\n}\n\na {\n  color: var(--color-primary);\n}\n\n.error-message {\n  color: var(--color-error);\n  background: hsla(0, 70%, 50%, 0.1);\n}",
        explanation: "Реальная цветовая палитра с CSS-переменными и семантическими цветами."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать opacity вместо rgba",
        why: "opacity делает прозрачным ВСЁ (текст, фон, дочерние элементы). rgba — только фон.",
        right: "Для прозрачного фона: rgba(). Для прозрачности всего элемента: opacity."
      },
      {
        wrong: "Не использовать CSS-переменные для цветов",
        why: "Хардкод цветов в разных местах — difficult to maintain. Изменение цвета = правки в 20 файлах.",
        right: "Определите цвета в :root как CSS-переменные и используйте var(--color-primary)."
      },
      {
        wrong: "Путать hsl и rgb",
        why: "rgb(255, 0, 0) = красный. hsl(0, 100%, 50%) = красный. Формулы конвертации не тривиальны.",
        right: "HSL интуитивнее: hue (цвет), saturation (насыщенность), lightness (яркость)."
      }
    ],
    importantToRemember: [
      "Hex: #RRGGBB или #RGB (сокращённый)",
      "RGB: rgb(r, g, b) — значения 0-255",
      "HSL: hsl(h, s%, l%) — оттенок, насыщенность, яркость",
      "rgba/hsla — цвет с прозрачностью (альфа-канал)",
      "CSS-переменные для переиспользования цветов"
    ],
    connection: {
      back: "Вы знаете каскад и специфичность (C3) — теперь вы можете применять цвета к стилизованным элементам.",
      forward: "В следующем уроке (C5) вы изучите текст и шрифты: font-family, font-size, текстовые свойства."
    }
  },

  // ============================================
  // C5 — Text and Fonts
  // ============================================
  {
    slug: "text-fonts",
    track: "css",
    order: 5,
    title: "Текст и шрифты",
    summary: "Свойства текста: font-family, font-size, font-weight, line-height, text-align, text-decoration.",
    level: "Beginner",
    prerequisites: ["colors"],
    learningObjective: "После этого урока вы сможете стилизовать текст с помощью свойств шрифта, подбирать шрифтовые стеки и управлять выравниванием и интервалами текста.",
    shortExplanation: "CSS-свойства для текста управляют шрифтом, размером, межстрочным интервалом, выравниванием и оформлением. font-family — какой шрифт, font-size — размер, font-weight — толщина, line-height — межстрочный интервал, text-align — выравнивание, text-decoration — подчёркивание/зачёркивание.",
    detailedExplanation: "Основные свойства текста:\n\nfont-family — шрифт:\nfont-family: 'Segoe UI', Arial, sans-serif;\nЦепочка запасных шрифтов: если первый не найден — пробует следующий.\n\nfont-size — размер:\nfont-size: 16px; — абсолютный\nfont-size: 1.2em; — относительный (от родителя)\nfont-size: 1.2rem; — относительный (от корня)\n\nfont-weight — толщина:\nfont-weight: normal; (400)\nfont-weight: bold; (700)\nfont-weight: 300-900; — числовые значения\n\nline-height — межстрочный интервал:\nline-height: 1.5; — 150% от размера шрифта\nline-height: 1.5em; — аналогично\nРекомендация: 1.5-1.8 для основного текста\n\nСвойства текста:\ntext-align: left | center | right | justify;\ntext-decoration: none | underline | line-through;\ntext-transform: uppercase | lowercase | capitalize;\nletter-spacing: 0.05em; — межбуквенный интервал\nword-spacing: 0.1em; — межсловный интервал\n\nВажно: em vs rem vs px:\n- px: абсолютный размер (16px = 16px всегда)\n- em: относительный от РОДИТЕЛЬСКОГО элемента\n- rem: относительный от КОРНЕВОГО элемента (html)\nem и rem НЕ одинаковы!",
    mentalModel: "Текстовые свойства — как настройки текстового редактора. font-family — типографский шрифт. font-size — размер кегля. font-weight — жирность. line-height — межстрочный. text-align — выравнивание по левому/правому краю.",
    examples: [
      {
        level: "minimal",
        code: "body {\n  font-family: Arial, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n  color: #333;\n}\n\nh1 {\n  font-size: 2em;\n  font-weight: bold;\n  text-align: center;\n}",
        explanation: "Базовые текстовые свойства для.body и заголовка."
      },
      {
        level: "simple",
        code: "/* Системные шрифты — быстрая загрузка */\nbody {\n  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;\n}\n\n/* Google Fonts */\n@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');\n\nbody { font-family: 'Inter', sans-serif; }\n\n/* Типографская система */\nh1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }\nh2 { font-size: 1.75rem; font-weight: 600; line-height: 1.3; }\np  { font-size: 1rem; font-weight: 400; line-height: 1.7; }",
        explanation: "Системные шрифты, Google Fonts и типографская иерархия."
      },
      {
        level: "real",
        code: "/* Типографика проекта */\n:root {\n  --font-body: 'Inter', system-ui, sans-serif;\n  --font-heading: 'Inter', system-ui, sans-serif;\n  --font-mono: 'Fira Code', monospace;\n}\n\nbody {\n  font-family: var(--font-body);\n  font-size: 16px;\n  line-height: 1.7;\n  color: hsl(220, 15%, 20%);\n  -webkit-font-smoothing: antialiased;\n}\n\nh1, h2, h3 {\n  font-family: var(--font-heading);\n  font-weight: 700;\n  line-height: 1.2;\n  letter-spacing: -0.02em;\n}\n\nh1 { font-size: clamp(2rem, 5vw, 3rem); }\nh2 { font-size: clamp(1.5rem, 3vw, 2rem); }\n\n/* Код */\npre, code {\n  font-family: var(--font-mono);\n  font-size: 0.9em;\n}\n\n/* Ссылки */\na {\n  text-decoration: none;\n  border-bottom: 1px solid transparent;\n  transition: border-color 0.2s;\n}\na:hover {\n  border-bottom-color: currentColor;\n}",
        explanation: "Полная типографическая система с переменными, clamp() и hover-эффектами."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать px для font-size",
        why: "px — абсолютный. Пользователь не может изменить размер (accessibility). rem/em — относительные.",
        right: "Используйте rem (от корня) для font-size. Это улучшает доступность и масштабируемость."
      },
      {
        wrong: "Путать em и rem",
        why: "em — от родителя (вкладывается!). rem — от html (корня). Вложенные em растут экспоненциально.",
        right: "rem — безопасный (от корня). em — осторожно (от родителя)."
      },
      {
        wrong: "Забывать про system-ui",
        why: "Системные шрифты загружаются мгновенно. Google Fonts — дополнительный запрос.",
        right: "Начните с system-ui, добавьте Google Fonts как улучшение."
      }
    ],
    importantToRemember: [
      "font-family: шрифт + запасные варианты",
      "font-size: rem предпочтительнее px",
      "line-height: 1.5-1.8 для основного текста",
      "em ≠ rem: em от родителя, rem от html",
      "system-ui — быстрый, кэшируемый шрифт"
    ],
    connection: {
      back: "Вы знаете цвета (C4) — стилизация текста добавляет дизайну читабельность.",
      forward: "В следующем уроке (C6) вы изучите единицы измерения: px, em, rem, %, vh, vw и когда какую использовать."
    }
  },

  // ============================================
  // C6 — Units
  // ============================================
  {
    slug: "units",
    track: "css",
    order: 6,
    title: "Единицы измерения",
    summary: "Абсолютные и относительные единицы: px, em, rem, %, vh, vw, ch, fr и когда их использовать.",
    level: "Beginner",
    prerequisites: ["text-fonts"],
    learningObjective: "После этого урока вы сможете выбирать правильную CSS-единицу для разных ситуаций вёрстки и понимать, когда использовать px, rem, %, vw и fr.",
    shortExplanation: "CSS единицы делятся на абсолютные (px, pt) и относительные (em, rem, %, vw, vh, fr). Абсолютные — фиксированные размеры. Относительные — зависят от контекста. Выбор единицы зависит от задачи: rem — для типографики, vw — для ширины, fr — для grid, % — для ширины контейнера.",
    detailedExplanation: "Абсолютные единицы:\n- px — пиксели. 1px = 1/96 дюйма. Наиболее предсказуемые.\n- pt — пункты. 1pt = 1/72 дюйма. Для печати.\n\nОтносительные единицы:\n- em — от размера шрифта РОДИТЕЛЬСКОГО элемента.\n  1.5em = 150% от размера родителя.\n  Проблема: вложенные em растут экспоненциально!\n\n- rem — от размера шрифта КОРНЕВОГО элемента (html).\n  1rem = 16px (по умолчанию). Предсказуемые.\n\n- % — от ширины РОДИТЕЛЬСКОГО элемента.\n  width: 50% = половина ширины родителя.\n\n- vw — 1% ширины окна (viewport width).\n  width: 100vw = ширина окна браузера.\n\n- vh — 1% высоты окна (viewport height).\n  height: 100vh = высота окна браузера.\n\n- fr — доля свободного места в CSS Grid.\n  grid-template-columns: 1fr 2fr = 1/3 и 2/3.\n\n- ch — ширина символа «0». Для ограничения длины строк.\n\nРекомендации:\n- font-size: rem (масштабируемость)\n- width: % или fr (адаптивность)\n- padding/margin: rem (предсказуемость)\n- media queries: em (а не px!)\n- max-width контейнера: ch (читаемость)",
    mentalModel: "Единицы — как линейки разных размеров. px — жёсткая линейка (всегда 16 пикселей). rem — линейка, привязанная к корню (масштабируется). % — линейка, привязанная к контейнеру. vw — линейка, привязанная к экрану.",
    examples: [
      {
        level: "minimal",
        code: "body {\n  font-size: 16px;      /* Абсолютный */\n  margin: 0;\n}\n\nh1 {\n  font-size: 2rem;       /* 32px от корня */\n  margin-bottom: 1rem;   /* 16px от корня */\n}\n\n.container {\n  width: 80%;            /* 80% от родителя */\n  max-width: 1200px;     /* Максимум 1200px */\n}",
        explanation: "Базовые единицы: px, rem и % для ширины."
      },
      {
        level: "simple",
        code: "/* Адаптивный заголовок */\nh1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}\n\n/* Полноэкранный блок */\n.hero {\n  height: 100vh;\n  display: grid;\n  place-items: center;\n}\n\n/* Grid с fr */\n.layout {\n  display: grid;\n  grid-template-columns: 250px 1fr 300px;\n  gap: 1rem;\n}\n\n/* Текст с ограничением длины */\n.article-text {\n  max-width: 65ch; /* ~65 символов на строку */\n}",
        explanation: "clamp(), vw, vh, fr и ch для разных задач."
      },
      {
        level: "real",
        code: "/* Масштабируемая типографика */\nhtml {\n  font-size: 100%; /* 16px — базовый размер */\n}\n\n:root {\n  --step-0: clamp(1rem, 0.93rem + 0.33vw, 1.13rem);\n  --step-1: clamp(1.2rem, 1.07rem + 0.65vw, 1.5rem);\n  --step-2: clamp(1.44rem, 1.23rem + 1.07vw, 2rem);\n}\n\nbody { font-size: var(--step-0); }\nh1   { font-size: var(--step-2); }\n\n/* Адаптивная сетка */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));\n  gap: var(--space, 1.5rem);\n}\n\n/* Full-bleed секция */\n.full-bleed {\n  width: 100vw;\n  margin-left: calc(50% - 50vw);\n}",
        explanation: "Современная типографика с clamp() и адаптивная сетка."
      }
    ],
    commonMistakes: [
      {
        wrong: "Считать em и rem одинаковыми",
        why: "em — от родителя (вкладывается экспоненциально!). rem — от html (предсказуемо). Вложенные em могут стать огромными.",
        right: "Для font-size: rem (безопасно). Для padding/margin: em (нормально, не вкладывается экспоненциально)."
      },
      {
        wrong: "Использовать px для медиа-запросов",
        why: "Пользователи могут изменить базовый размер шрифта. Медиа-запросы в px не масштабируются.",
        right: "Media queries: @media (min-width: 768px) — px допустим, но em лучше для доступности."
      },
      {
        wrong: "Не использовать clamp()",
        why: "clamp(min, preferred, max) — современная замена media queries для типографики.",
        right: "font-size: clamp(1rem, 2.5vw, 2rem) — плавное масштабирование без медиа-запросов."
      }
    ],
    importantToRemember: [
      "rem — безопасный выбор для font-size и spacing",
      "% — от родителя, vw/vh — от окна",
      "fr — доля в CSS Grid",
      "em и rem НЕ одинаковы (em от родителя!)",
      "clamp() — плавное масштабирование"
    ],
    connection: {
      back: "Вы знаете текст и шрифты (C5) — единицы дают вам точный контроль над размерами.",
      forward: "В следующем уроке (C7) вы изучите блочную модель: content, padding, border, margin."
    }
  },

  // ============================================
  // C7 — Box Model
  // ============================================
  {
    slug: "box-model",
    track: "css",
    order: 7,
    title: "Блочная модель",
    summary: "Как устроен box model: content, padding, border, margin и разница между content-box и border-box.",
    level: "Beginner",
    prerequisites: ["units"],
    learningObjective: "После этого урока вы сможете объяснить блочную модель, использовать box-sizing: border-box и вычислять размеры элементов.",
    shortExplanation: "Каждый HTML-элемент — это прямоугольная коробка (box). Блочная модель состоит из четырёх слоёв: content (содержимое) → padding (внутренний отступ) → border (рамка) → margin (внешний отступ). box-sizing: border-box делает width/height предсказуемыми — padding и border включены в размер.",
    detailedExplanation: "Структура коробки (изнутри наружу):\n\n1. Content — фактическое содержимое (текст, картинка)\n   Задаётся через width/height\n\n2. Padding — внутренний отступ (между content и border)\n   padding: 20px; (все стороны)\n   padding: 10px 20px; (вертикаль/горизонталь)\n   padding: 10px 20px 30px 40px; (верх/право/низ/лево)\n\n3. Border — рамка вокруг padding\n   border: 2px solid #333;\n\n4. Margin — внешний отступ (между коробками)\n   margin: 20px;\n   margin: 0 auto; (центрирование!)\n\nДва типа box-sizing:\n\n1. content-box (по умолчанию):\n   width: 200px;\n   padding: 20px;\n   border: 5px solid;\n   → Итоговая ширина: 200 + 20*2 + 5*2 = 250px!\n\n2. border-box (рекомендуется):\n   width: 200px;\n   padding: 20px;\n   border: 5px solid;\n   → Итоговая ширина: 200px (padding и border ВКЛЮЧЕНЫ)\n\nРекомендация: * { box-sizing: border-box; } — для всего проекта!\n\nMargin collapse (схлопывание): смежные margin'ы складываются, а не суммируются. margin-bottom: 20px + margin-top: 30px = 30px (не 50px!). Работает только для вертикальных margin'ов.",
    mentalModel: "Коробка с подарком: content — сам подарок. padding — пузырчатая плёнка внутри. border — стенки коробки. margin — расстояние между коробками на полке. border-box — размер коробки = размер снаружи (а не только подарок).",
    examples: [
      {
        level: "minimal",
        code: ".box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid #333;\n  margin: 10px;\n}\n\n/* С content-box (по умолчанию): */\n/* Итого: 200 + 40 + 4 = 244px */\n\n/* С border-box: */\n.box { box-sizing: border-box; }\n/* Итого: 200px (padding и border внутри) */",
        explanation: "Разница между content-box и border-box."
      },
      {
        level: "simple",
        code: "/* Глобальный border-box */\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\n/* Карточка */\n.card {\n  padding: 24px;\n  border: 1px solid #e0e0e0;\n  border-radius: 8px;\n  margin-bottom: 16px;\n}\n\n/* Центрирование */\n.container {\n  width: 80%;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}",
        explanation: "Глобальный border-box и типичные паттерны."
      },
      {
        level: "real",
        code: "/* Сброс и базовая модель */\n*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n}\n\n.container {\n  width: min(90%, 1200px);\n  margin-inline: auto;\n  padding-inline: clamp(1rem, 3vw, 3rem);\n}\n\n/* Карточки с равными отступами */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n}\n\n.card {\n  padding: 1.5rem;\n  border: 1px solid var(--color-border, #e5e7eb);\n  border-radius: 0.75rem;\n  /* width не нужен — grid управляет */\n}\n\n/* Margin collapse demo */\n.card + .card {\n  margin-top: -1px; /* перекрывает border-radius */\n}",
        explanation: "Современная модель: сброс, container queries, grid, border-box."
      }
    ],
    commonMistakes: [
      {
        wrong: "Не использовать box-sizing: border-box",
        why: "С content-box padding и border УВЕЛИЧЧИВАЮТ размер элемента. Это неинтуитивно и приводит к «ломающейся» верстке.",
        right: "* { box-sizing: border-box; } — первый CSS в каждом проекте."
      },
      {
        wrong: "Не знать про margin collapse",
        why: "Вертикальные margin'ы складываются (max из двух), а не суммируются. Это удивляет новичков.",
        right: "margin-bottom: 20px + margin-top: 30px = 30px (не 50px). Схлопывание работает для блочных вертикальных margin'ов."
      },
      {
        wrong: "Путать padding и margin",
        why: "padding — ВНУТРИ коробки (содержимое + отступ). margin — СНАРУЖИ (пространство между коробками).",
        right: "padding: внутри (содержимое раздвигается). margin: снаружи (коробки раздвигаются)."
      }
    ],
    importantToRemember: [
      "content → padding → border → margin (изнутри наружу)",
      "box-sizing: border-box — делает width/height предсказуемыми",
      "margin collapse — вертикальные margin'ы схлопываются",
      "padding — внутренний отступ, margin — внешний",
      "Глобальный border-box — must have для каждого проекта"
    ],
    connection: {
      back: "Вы знаете единицы измерения (C6) — блочная модель объясняет, как эти единицы применяются к отступам элемента.",
      forward: "В следующем уроке (C8) вы подробнее изучите margin и padding."
    }
  },

  // ============================================
  // C8 — Margin and Padding
  // ============================================
  {
    slug: "margin-padding",
    track: "css",
    order: 8,
    title: "Margin и Padding",
    summary: "Подробно о margin и padding: синтаксис, схлопывание, auto, отрицательные значения.",
    level: "Beginner",
    prerequisites: ["box-model"],
    learningObjective: "После этого урока вы сможете использовать сокращённую запись margin и padding, разбираться в схлопывании margin и центрировать элементы через margin: auto.",
    shortExplanation: "Margin и padding — два ключевых свойства для пространства. Padding — внутренний отступ (содержимое + фон), margin — внешний (пространство между элементами). margin: 0 auto — центрирование. Отрицательные margin\'ы сдвигают элементы. Margin collapse — схлопывание вертикальных отступов.",
    detailedExplanation: "Синтаксис (одинаков для margin и padding):\n\n1 значение: margin: 10px; (все 4 стороны)\n2 значения: margin: 10px 20px; (вертикаль/горизонталь)\n3 значения: margin: 10px 20px 30px; (верх/горизонталь/низ)\n4 значения: margin: 10px 20px 30px 40px; (верх/право/низ/лево)\n\nmargin: auto — центрирование блока:\n.block { width: 300px; margin: 0 auto; }\nРаботает для блочных элементов с заданной шириной.\n\nmargin collapse (схлопывание):\n- Работает только для ВЕРТИКАЛЬНЫХ margin'ов\n- Работает для смежных блочных элементов\n- Не работает для padding, border, inline элементов\n\nОтрицательные margin:\n- margin-top: -20px; — элемент сдвигается ВВЕРХ\n- margin-left: -10px; — элемент сдвигается ВЛЕВО\n- Опасно: может нарушить вёрстку\n\nПрименение:\n- padding: для пространства ВНУТРИ (карточки, кнопки)\n- margin: для пространства МЕЖДУ (расстояние между секциями)\n- gap: современная альтернатива margin для flex/grid",
    mentalModel: "Padding — как подушка внутри коробки (содержимое не давит на стенки). Margin — как невидимый барьер между коробками (не даёт им столкнуться). Margin collapse — два магнита: когда они рядом, расстояние = max из двух, а не сумма.",
    examples: [
      {
        level: "minimal",
        code: ".box {\n  padding: 20px;          /* Все стороны */\n  margin: 10px 20px;       /* Вертикаль 10, горизонталь 20 */\n  margin: 0 auto;          /* Центрирование */\n}",
        explanation: "Базовый синтаксис: все стороны, сокращение, auto."
      },
      {
        level: "simple",
        code: "/* Карточка */\n.card {\n  padding: 24px;\n  margin-bottom: 16px;\n}\n\n/* Первый элемент без верхнего отступа */\n.card:first-child {\n  margin-top: 0;\n}\n\n/* Центрирование контейнера */\n.container {\n  width: min(90%, 800px);\n  margin-inline: auto;\n  padding: 0 1rem;\n}\n\n/* Gap вместо margin для сетки */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem; /* Современная замена margin для сетки */\n}",
        explanation: "Практические паттерны: карточка, центрирование, gap."
      },
      {
        level: "real",
        code: "/* Секции с collapsing */\n.section {\n  padding: clamp(3rem, 8vw, 6rem) 0;\n}\n\n/* Отрицательный margin для перекрытия */\n.hero {\n  position: relative;\n}\n\n.hero-content {\n  margin-top: -4rem; /* Поднимает контент поверх hero */\n  position: relative;\n  z-index: 1;\n}\n\n/* Автоматические отступы в flex */\n.nav-item + .nav-item {\n  margin-left: auto; /* Последний элемент прижат вправо */\n}\n\n/* Кнопка с padding */\n.btn {\n  padding: 0.75em 1.5em;\n  margin: 0.25em;\n  border: none;\n  border-radius: 6px;\n  /* padding задаёт размер кнопки, margin — расстояние между ними */\n}",
        explanation: "Реальные паттерны: секции, отрицательные margin, flex-центрирование. Это пример будущих тем: position, flexbox и clamp() детально разбираются в C12, C13 и C22."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать margin вместо gap для сеток",
        why: "Margin создаёт проблемные отступы у крайних элементов. Gap — безопасная альтернатива для flex/grid.",
        right: "В flex/grid используйте gap. Margin — для пространства между не- flex/grid элементами."
      },
      {
        wrong: "Не понимать margin collapse",
        why: "margin-bottom: 20px + margin-top: 30px = 30px (не 50px!). Это удивляет.",
        right: "Margin collapse: вертикальные смежные margin'ы схлопываются (берётся max)."
      },
      {
        wrong: "Злоупотреблять отрицательными margin",
        why: "Отрицательные margin непредсказуемы и ломают нормальный поток. Используйте position и transform.",
        right: "Для сдвига элементов: position: relative + transform: translateY(-20px)."
      }
    ],
    importantToRemember: [
      "Padding: внутри (содержимое + фон элемента)",
      "Margin: снаружи (пространство между элементами)",
      "margin: 0 auto — центрирование блока с шириной",
      "Margin collapse — схлопывание вертикальных margin'ов",
      "Gap — современная альтернатива margin для flex/grid"
    ],
    connection: {
      back: "Вы знаете блочную модель (C7) — margin и padding это два её свойства для создания отступов.",
      forward: "В следующем уроке (C9) вы изучите display и поток документа: block, inline, inline-block и обычный поток."
    }
  },

  // ============================================
  // C9 — Display and Flow
  // ============================================
  {
    slug: "display-flow",
    track: "css",
    order: 9,
    title: "Display и поток документа",
    summary: "Свойство display: block, inline, inline-block, none, flex, grid и нормальный поток документа.",
    level: "Beginner",
    prerequisites: ["margin-padding"],
    learningObjective: "После этого урока вы сможете объяснить разницу между блочными и строчными элементами, использовать свойство display и понимать обычный поток документа.",
    shortExplanation: "display — свойство, которое определяет, как элемент отображается. block — занимает всю ширину, переносит строку. inline — работает внутри текста, не переносит строку. inline-block — гибрид. none — скрывает элемент. normal flow — стандартное расположение элементов (блочные сверху вниз, строчные слева направо).",
    detailedExplanation: "Типы display:\n\nblock:\n- Занимает всю ширину родителя\n- Начинает новую строку\n- На padding/margin/width/height реагирует\n- Примеры: div, p, h1-h6, section, article\n\ninline:\n- Занимает только ширину содержимого\n- НЕ переносит строку\n- Width/height НЕ работают!\n- Примеры: span, a, strong, em\n\ninline-block:\n- Внешне — inline (внутри текста)\n- Внутри — block (width/height работают!)\n- Полезно для иконок в тексте, кнопок\n\ndisplay: none:\n- Полностью убирает элемент из layout\n- Не занимает место\n- Отличие от visibility: hidden (скрывает, но место сохраняет)\n\nflex и grid:\n- Создают flex/grid контекст для дочерних элементов\n- Подробно изучим в следующих уроках\n\nNormal flow:\n- Стандартное расположение: блочные — сверху вниз, строчные — слева направо\n- Выход из normal flow: position (absolute, fixed), float, display: flex/grid",
    mentalModel: "Display — как тип «попутчика» в поезде. block — занимает целое купе (строку). inline — садится рядом с другими (внутри строки). inline-block — садится рядом, но занимает место (width/height работают).",
    examples: [
      {
        level: "minimal",
        code: "div { display: block; }      /* По умолчанию */\nspan { display: inline; }     /* По умолчанию */\n\n/* Скрываем элемент */\n.hidden { display: none; }\n\n/* Делаем inline элемент блочным */\na {\n  display: inline-block;\n  width: 150px;\n  padding: 8px;\n  text-align: center;\n}",
        explanation: "Базовые display-значения и превращение inline в inline-block."
      },
      {
        level: "simple",
        code: "/* Горизонтальное меню */\nnav ul {\n  display: flex;\n  list-style: none;\n  gap: 1rem;\n}\n\n/* Кнопки-ссылки */\n.nav-link {\n  display: inline-block;\n  padding: 0.5rem 1rem;\n  text-decoration: none;\n  border: 1px solid #333;\n  border-radius: 4px;\n}\n\n/* Скрытие на мобильных */\n@media (max-width: 768px) {\n  .sidebar { display: none; }\n  .main { width: 100%; }\n}",
        explanation: "Flex для меню, inline-block для кнопок, none для адаптива."
      },
      {
        level: "real",
        code: "/*visibility vs display */\n.collapsed {\n  display: none; /* Не занимает место */\n}\n\n.invisible {\n  visibility: hidden; /* Занимает место, но невидим */\n}\n\n/* Паттерн: показ/скрытие */\n.menu-toggle:checked ~ .nav {\n  display: flex;\n}\n\n/* Flex-контейнер */\n.flex-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n\n/* Grid-контейнер */\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n\n/* Inline-flex для иконок в тексте */\n.badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.25rem 0.5rem;\n  background: #e3f2fd;\n  border-radius: 999px;\n  font-size: 0.875rem;\n}",
        explanation: "visibility vs display, flex/grid контейнеры, inline-flex. Это пример будущих тем: flexbox (C13), grid (C15) и псевдоклассы вроде :checked (C17)."
      }
    ],
    commonMistakes: [
      {
        wrong: "Ставить width/height на inline-элементы",
        why: "Inline-элементы ИГНОРИРУЮТ width/height. Это не работает!",
        right: "Для width/height на строчных элементах используйте display: inline-block."
      },
      {
        wrong: "Путать display: none и visibility: hidden",
        why: "display: none — элемент исчезает и не занимает место. visibility: hidden — невидим, но место сохраняет.",
        right: "Нужно место → visibility: hidden. Нужно убрать → display: none."
      },
      {
        wrong: "Использовать float для раскладки",
        why: "Float — устаревший способ. Modern layout: flexbox (1D), grid (2D).",
        right: "Для раскладки — flexbox или grid. Float — только для обтекания текста вокруг картинки."
      }
    ],
    importantToRemember: [
      "Block: вся ширина, новая строка",
      "Inline: ширина содержимого, width/height НЕ работают",
      "Inline-block: inline + block (width/height работают)",
      "display: none — скрывает без места",
      "Flex/grid — современная альтернатива float для раскладки"
    ],
    connection: {
      back: "Вы знаете margin и padding (C8) — display определяет, как элементы занимают пространство.",
      forward: "В следующем уроке (C10) вы изучите размеры элементов: width, height, min/max и стратегии задания размеров."
    }
  },

  // ============================================
  // C10 — Element Sizes
  // ============================================
  {
    slug: "element-sizes",
    track: "css",
    order: 10,
    title: "Размеры элементов",
    summary: "Управление размерами: width, height, min-width, max-width, min-height, max-height.",
    level: "Beginner",
    prerequisites: ["display-flow"],
    learningObjective: "После этого урока вы сможете задавать размеры элементов через width/height и понимать ограничения min/max.",
    shortExplanation: "width и height задают размеры элемента. min-width/max-width ограничивают размеры снизу и сверху. max-width: 100% — предотвращает выход за контейнер. min-height — гарантирует минимальную высоту. Эти свойства критичны для адаптивной вёрстки.",
    detailedExplanation: "Свойства размеров:\n\nwidth/height:\n- auto (по умолчанию) — элемент занимает доступное пространство\n- px, %, rem, vw — конкретные значения\n- fit-content — размер по содержимому\n\nmin-width/max-width:\n- max-width: 100% — элемент не выходит за контейнер\n- min-width: 300px — элемент не будет уже 300px\n\nmin-height/max-height:\n- min-height: 100vh — блок минимум на весь экран\n- max-height: 500px — ограничение высоты\n\nwidth: auto vs width: 100%:\n- auto: элемент занимает доступное пространство (с учётом padding/margin)\n- 100%: элемент = 100% ширины РОДИТЕЛЯ (padding/margin не учитываются)\n\nРекомендации:\n- Контейнеры: max-width: 1200px + margin: 0 auto\n- Картинки: max-width: 100% + height: auto\n- Карточки: min-height для одинаковой высоты\n- Текст: max-width: 65ch (читаемость)",
    mentalModel: "Размеры — как ограничители на полке. width — точная ширина полки. max-width — «полка не шире метра». min-width — «полка не уже 30 см». max-height — «стопка книг не выше полуметра».",
    examples: [
      {
        level: "minimal",
        code: ".container {\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\n.text {\n  max-width: 65ch;\n}",
        explanation: "Базовые ограничения: контейнер, картинки, текст."
      },
      {
        level: "simple",
        code: "/* Карточка с фиксированной шириной */\n.card {\n  width: 300px;\n  min-height: 200px;\n}\n\n/* Адаптивная карточка */\n.card-responsive {\n  width: 100%;\n  max-width: 400px;\n  min-height: 180px;\n}\n\n/* Full-screen секция */\n.hero {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/* Ограничение формы */\ninput[type=\"text\"] {\n  width: 100%;\n  max-width: 400px;\n  padding: 0.5rem;\n}",
        explanation: "Практические размеры: карточки, hero-секция, формы."
      },
      {
        level: "real",
        code: "/* Адаптивная сетка */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));\n  gap: 1.5rem;\n}\n\n/* Статья с ограничением ширины */\n.article {\n  width: min(90%, 800px);\n  margin-inline: auto;\n  padding-block: clamp(2rem, 5vw, 4rem);\n}\n\n/* Скроллируемый блок */\n.code-block {\n  width: 100%;\n  max-width: 100%;\n  overflow-x: auto;\n  padding: 1rem;\n}\n\n/* Картинка с object-fit */\n.avatar {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 50%;\n}",
        explanation: "Современные размеры: min(), clamp(), overflow, object-fit."
      }
    ],
    commonMistakes: [
      {
        wrong: "Не использовать max-width для контейнеров",
        why: "Без max-width текст растягивается на весь экран — нечитаемо на wide monitors.",
        right: "Контейнеры: max-width: 1200px (или min(90%, 800px)) + margin: 0 auto."
      },
      {
        wrong: "Забывать height: auto для картинок",
        why: "Без height: auto картинка может растянуться или сжаться непропорционально.",
        right: "img { max-width: 100%; height: auto; } — базовые правила для картинок."
      },
      {
        wrong: "Использовать width: 100% вместо max-width: 100%",
        why: "width: 100% = 100% ширины родителя (всегда). max-width: 100% = не больше 100% (может быть меньше).",
        right: "Для адаптивности: max-width: 100% (не выходит за контейнер)."
      }
    ],
    importantToRemember: [
      "max-width: 100% для картинок — базовое правило",
      "max-width: 1200px для контейнеров — читаемость",
      "min-height для одинаковой высоты карточек",
      "width: auto ≠ width: 100%",
      "min(), clamp() — современные ограничения"
    ],
    connection: {
      back: "Вы знаете display (C9) — размеры определяют, сколько пространства занимают элементы.",
      forward: "В следующем уроке (C11) вы изучите overflow и видимость: что делать, когда контент выходит за границы контейнера."
    }
  },

  // ============================================
  // C11 — Overflow and Visibility
  // ============================================
  {
    slug: "overflow-visibility",
    track: "css",
    order: 11,
    title: "Overflow и видимость",
    summary: "overflow: hidden, scroll, auto, text-overflow: ellipsis, visibility, clip-path, opacity.",
    level: "Beginner",
    prerequisites: ["element-sizes"],
    learningObjective: "После этого урока вы сможете управлять поведением overflow, делать обрезку текста и управлять видимостью элементов.",
    shortExplanation: "overflow управляет тем, что происходит, когда контент выходит за границы элемента. overflow: hidden — обрезает, scroll — добавляет скролл, auto — скролл только при необходимости. text-overflow: ellipsis — многоточие при обрезке текста. visibility и clip-path — управление видимостью.",
    detailedExplanation: "Свойства overflow:\n\noverflow: visible (по умолчанию):\n- Контент выходит за границы элемента\n\noverflow: hidden:\n- Контент обрезается за границами\n- Создаёт BFC (Block Formatting Context)\n\noverflow: scroll:\n- Всегда показывает скроллбары (даже если не нужны)\n\noverflow: auto:\n- Скроллбары только при необходимости\n\noverflow-x / overflow-y:\n- Управляют горизонтальным/вертикальным скроллом отдельно\n\nТекстовое обрезание:\nwhite-space: nowrap; /* Текст в одну строку */\noverflow: hidden;    /* Обрезка */\ntext-overflow: ellipsis; /* Многоточие */\n\nДругие свойства видимости:\nvisibility: hidden — невидим, но место сохраняет\nopacity: 0 — прозрачный, но место сохраняет\nclip-path: circle(50%) — обрезка по форме",
    mentalModel: "Overflow — как окно. visible — штора открыта, цветы торчат. hidden — штора закрыта, обрезает. scroll — рулонная штора с колёсиком. auto — штора появляется только когда нужно.",
    examples: [
      {
        level: "minimal",
        code: "/* Обрезка длинного текста */\n.title {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/* Скроллируемый блок */\n.code {\n  overflow: auto;\n  max-height: 300px;\n}",
        explanation: "Текстовое обрезание и скроллируемый блок."
      },
      {
        level: "simple",
        code: "/* Карточка с обрезкой */\n.card-text {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n/* Скроллируемая таблица */\n.table-wrapper {\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* Скрытый, но доступный для скринридеров */\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}",
        explanation: "Мультистрочное обрезание, горизонтальный скролл, sr-only."
      },
      {
        level: "real",
        code: "/* Ограничение контента */\n.collapsible {\n  max-height: 200px;\n  overflow: hidden;\n  transition: max-height 0.3s ease;\n}\n\n.collapsible.expanded {\n  max-height: none;\n}\n\n/* Обрезка картинки по кругу */\n.avatar {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  overflow: hidden;\n}\n\n.avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n/* Hover-эффект с overflow */\n.card {\n  overflow: hidden;\n  border-radius: 8px;\n}\n\n.card-image {\n  transition: transform 0.3s;\n}\n\n.card:hover .card-image {\n  transform: scale(1.1);\n  /* overflow: hidden на .card обрезает увеличенную картинку */\n}",
        explanation: "Реальные паттерны: collapse, аватары, hover-эффекты с overflow."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать overflow: hidden для скрытия элемента",
        why: "overflow: hidden обрезает контент, но элемент остаётся видимым и занимает место.",
        right: "Для скрытия: display: none (без места) или visibility: hidden (с местом)."
      },
      {
        wrong: "Забывать overflow: hidden для border-radius",
        why: "Без overflow: hidden дочерний контент может «вылезать» за скруглённые углы.",
        right: "Для скруглённых углов: родитель — border-radius + overflow: hidden."
      },
      {
        wrong: "Не использовать text-overflow: ellipsis",
        why: "Длинный текст без обрезки ломает макет. ellipsis — элегантное решение.",
        right: "Для обрезки: white-space: nowrap + overflow: hidden + text-overflow: ellipsis."
      }
    ],
    importantToRemember: [
      "overflow: auto — скролл при необходимости",
      "text-overflow: ellipsis — многоточие (нужны white-space: nowrap + overflow: hidden)",
      "overflow: hidden создаёт BFC и обрезает по border-radius",
      "visibility: hidden — невидим, но место сохраняет",
      "sr-only — скрыто от глаз, доступно скринридерам"
    ],
    connection: {
      back: "Вы знаете размеры элементов (C10) — overflow управляет тем, что происходит, когда контент превышает эти размеры.",
      forward: "В следующем уроке (C12) вы изучите позиционирование: relative, absolute, fixed, sticky."
    }
  },

  // ============================================
  // C12 — Position
  // ============================================
  {
    slug: "position",
    track: "css",
    order: 12,
    title: "Позиционирование",
    summary: "position: static, relative, absolute, fixed, sticky и свойства top, right, bottom, left, z-index.",
    level: "Beginner",
    prerequisites: ["overflow-visibility"],
    learningObjective: "После этого урока вы сможете использовать все значения position, понимать контекст наложения и правильно применять z-index.",
    shortExplanation: "position определяет, как элемент позиционируется в потоке документа. static — стандартное расположение. relative — смещение от своего места. absolute — позиция относительно ближайшего positioned предка. fixed — прикреплён к окну. sticky — гибрид: normal, пока не достигнут порог (threshold), затем fixed. z-index управляет порядком наложения.",
    detailedExplanation: "Значения position:\n\nstatic (по умолчанию):\n- Элемент в normal flow\n- top/right/bottom/left ИГНОРИРУЮТСЯ\n\nrelative:\n- Элемент остаётся в normal flow\n- top/right/bottom/left сдвигают ОТНОСИТЕЛЬНО своего места\n- Создаёт контекст для абсолютных детей\n\nabsolute:\n- Выходит из normal flow (не занимает место)\n- Позиционируется относительно ближайшего positioned предка (relative/absolute/fixed/sticky)\n- Если positioned предка нет — относительно <html>\n\nfixed:\n- Выходит из normal flow\n- Позиционируется относительно ОКНА браузера\n- Не скроллится\n- Создаёт новый stacking context\n\nsticky:\n- Гибрид: relative + fixed\n- Пока не достигнут порог (threshold) — ведёт себя как relative\n- Когда порог (threshold) достигнут — фиксируется (как fixed)\n- Работает внутри scroll-контейнера\n\nz-index:\n- Порядок наложения (stacking order)\n- Число — чем больше, тем «поверх»\n- Работает внутри контекста наложения (stacking context)\n- position (relative/absolute/fixed/sticky) — один из способов создать такой контекст, но НЕ единственный\n- Контекст наложения также создают: opacity < 1, transform, filter, will-change и другие свойства\n\nВажно: z-index НЕ требует position. Это распространённый миф. Элемент с position — самый частый способ попасть в контекст наложения, но не единственный.",
    mentalModel: "Позиционирование — как расстановка мебели. static — мебель стоит где поставили. relative — чуть сдвинули. absolute — подняли и поставили в точку (относительно стены). fixed — приклеили к стене (всегда на виду). sticky — на полу, но прилипает к ноге при ходьбе.",
    examples: [
      {
        level: "minimal",
        code: ".parent {\n  position: relative;\n}\n\n.child {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n\n.sticky-header {\n  position: sticky;\n  top: 0;\n  background: white;\n}",
        explanation: "Базовые паттерны: absolute в контейнере, sticky-заголовок."
      },
      {
        level: "simple",
        code: "/* Sticky-навигация */\nnav {\n  position: sticky;\n  top: 0;\n  z-index: 100;\n  background: white;\n  padding: 1rem;\n}\n\n/* Бейдж на аватаре */\n.avatar-wrapper {\n  position: relative;\n  display: inline-block;\n}\n\n.avatar-badge {\n  position: absolute;\n  bottom: -2px;\n  right: -2px;\n  width: 16px;\n  height: 16px;\n  background: #27ae60;\n  border-radius: 50%;\n  border: 2px solid white;\n}\n\n/* fixed кнопка */\n.scroll-top {\n  position: fixed;\n  bottom: 2rem;\n  right: 2rem;\n  z-index: 50;\n}",
        explanation: "Sticky-навигация, бейджи и fixed-кнопки."
      },
      {
        level: "real",
        code: "/* Оверлей */\n.modal-overlay {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  z-index: 1000;\n  display: grid;\n  place-items: center;\n}\n\n.modal {\n  position: relative;\n  background: white;\n  padding: 2rem;\n  border-radius: 12px;\n  z-index: 1001;\n}\n\n/* Tooltip */\n.tooltip {\n  position: absolute;\n  bottom: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n  padding: 0.5rem;\n  background: #333;\n  color: white;\n  border-radius: 4px;\n  white-space: nowrap;\n  z-index: 10;\n}\n\n/* Sticky-колонка в таблице */\n.table-wrapper {\n  overflow-x: auto;\n}\n\nth.sticky {\n  position: sticky;\n  left: 0;\n  background: white;\n  z-index: 5;\n}",
        explanation: "Оверлеи, тултипы и sticky-колонки — реальные кейсы. Это пример будущей темы: display: grid и place-items разбираются в уроке про Grid (C15)."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что z-index требует position",
        why: "z-index работает на элементах с: position, opacity < 1, transform, filter, will-change. Не только position!",
        right: "z-index работает на любом элементе, создающем stacking context. Position — один из способов."
      },
      {
        wrong: "Не задавать parent position для absolute child",
        why: "Без positioned parent absolute-элемент позиционируется относительно <html> — непредсказуемо.",
        right: "Для absolute-дочерних элементов: родитель должен иметь position: relative (или absolute/fixed)."
      },
      {
        wrong: "Использовать fixed вместо sticky",
        why: "Fixed всегда на экране (может перекрывать контент). Sticky — только в рамках scroll-контейнера.",
        right: "Для «прилипающих» заголовков: sticky. Для «всегда на экране»: fixed."
      }
    ],
    importantToRemember: [
      "relative — смещение от своего места, создаёт контекст",
      "absolute — позиция от positioned предка",
      "fixed — прикреплён к окну браузера",
      "sticky — гибрид relative + fixed",
      "z-index — порядок наложения (не требует только position!)"
    ],
    connection: {
      back: "Вы знаете overflow (C11) — позиционирование позволяет элементам выходить из обычного потока документа.",
      forward: "В следующем уроке (C13) вы изучите основы Flexbox: display: flex и понятие главной оси."
    }
  },

  // ============================================
  // C13 — Flexbox Basics
  // ============================================
  {
    slug: "flexbox-basics",
    track: "css",
    order: 13,
    title: "Flexbox — основы",
    summary: "display: flex, flex-direction, flex-wrap, gap и основы одномерной раскладки.",
    level: "Intermediate",
    prerequisites: ["position"],
    learningObjective: "После этого урока вы сможете создавать flex-контейнеры, использовать flex-direction, flex-wrap и gap для раскладки элементов в одном измерении.",
    shortExplanation: "Flexbox — одномерная (1D) раскладка: элементы выстраиваются в строку или колонку. display: flex создаёт flex-контейнер. flex-direction задаёт ось (row/column). flex-wrap разрешает перенос. gap задаёт расстояние между элементами. Flexbox — замена float для раскладки.",
    detailedExplanation: "Flexbox — раскладка в ОДНОМ измерении (строка ИЛИ колонка, не обе сразу).\n\ndisplay: flex — создаёт flex-контейнер:\n- Все прямые дети становятся flex- items\n- Элементы выстраиваются вдоль главной оси (main axis)\n\nflex-direction:\n- row (по умолчанию) — слева направо\n- row-reverse — справа налево\n- column — сверху вниз\n- column-reverse — снизу вверх\n\nflex-wrap:\n- nowrap (по умолчанию) — всё в одну строку\n- wrap — перенос на новую строку\n- wrap-reverse — перенос вверх\n\ngap:\n- Задаёт расстояние между элементами\n- gap: 1rem; — одинаковый отступ\n- gap: 1rem 2rem; — вертикаль/горизонталь\n- Заменяет margin для расстояния между flex-items\n\nFlex-контейнер vs Flex-item:\n- Контейнер: display: flex, flex-direction, flex-wrap\n- Items: flex-grow, flex-shrink, flex-basis, flex, align-self",
    mentalModel: "Flexbox — как конвейер на заводе. flex-direction — направление конвейера (горизонтально/вертикально). flex-wrap — можно ли класть вещи на второй ряд. gap — расстояние между коробками на конвейере.",
    examples: [
      {
        level: "minimal",
        code: ".container {\n  display: flex;\n  gap: 1rem;\n}\n\n.item {\n  flex: 1; /* Равномерно делят пространство */\n}",
        explanation: "Минимальный flex: контейнер + gap + flex: 1."
      },
      {
        level: "simple",
        code: "/* Горизонтальное меню */\nnav {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  align-items: center;\n}\n\n/* Карточки */\n.card-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.5rem;\n}\n\n.card {\n  flex: 1 1 300px; /* grow shrink basis */\n}\n\n/* Колонки */\n.layout {\n  display: flex;\n  gap: 2rem;\n}\n\n.sidebar { flex: 0 0 250px; }\n.main    { flex: 1; }\n\n/* Центрирование */\n.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}",
        explanation: "Практические flex-паттерны: меню, карточки, layout, центрирование."
      },
      {
        level: "real",
        code: "/* Полноценный layout */\n.page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n\n.header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 1rem 2rem;\n}\n\n.content {\n  display: flex;\n  flex: 1;\n  gap: 2rem;\n  padding: 2rem;\n}\n\n.sidebar {\n  flex: 0 0 250px;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n.main {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n\n.footer {\n  display: flex;\n  justify-content: center;\n  padding: 1rem;\n  border-top: 1px solid #e5e7eb;\n}",
        explanation: "Полный flex-layout: header, sidebar, main, footer."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать flexbox для двумерной раскладки",
        why: "Flexbox — ОДНОМЕРНЫЙ (1D): строка ИЛИ колонка. Для двух осей — CSS Grid.",
        right: "1D (строка/колонка) → Flexbox. 2D (строки + колонки) → Grid."
      },
      {
        wrong: "Не использовать gap",
        why: "Margin для расстояния между flex-items создаёт проблемы с отступами у крайних элементов.",
        right: "gap — безопасная альтернатива margin для flex/grid."
      },
      {
        wrong: "Забывать flex-wrap",
        why: "Без wrap элементы сжимаются до min-content, что ломает макет.",
        right: "Для адаптивных сеток: flex-wrap: wrap + flex-basis."
      }
    ],
    importantToRemember: [
      "Flexbox — ОДНОМЕРНАЯ раскладка (1D)",
      "flex-direction: row | column — направление оси",
      "gap — расстояние между элементами (лучше margin)",
      "flex-wrap: wrap — перенос на новые строки",
      "display: flex на контейнере, align-items/justify-content — центрирование"
    ],
    sources: [
      { title: "MDN: основы Flexbox", url: "https://developer.mozilla.org/ru/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox" },
      { title: "Дока: гайд по flexbox", url: "https://doka.guide/css/flexbox-guide/" }
    ],
    connection: {
      back: "Вы знаете позиционирование (C12) — flexbox даёт современную раскладку без float.",
      forward: "В следующем уроке (C14) вы изучите выравнивание во flex: justify-content, align-items, align-self."
    }
  },

  // ============================================
  // C14 — Flexbox Alignment
  // ============================================
  {
    slug: "flexbox-alignment",
    track: "css",
    order: 14,
    title: "Flexbox — выравнивание",
    summary: "justify-content, align-items, align-self, align-content, flex-grow, flex-shrink, flex-basis.",
    level: "Intermediate",
    prerequisites: ["flexbox-basics"],
    learningObjective: "После этого урока вы сможете выравнивать flex-элементы по главной и поперечной осям и управлять их размером с помощью flex-свойств.",
    shortExplanation: "Flexbox имеет две оси: main axis (главная, по flex-direction) и cross axis (поперечная). justify-content — выравнивание по main axis. align-items — по cross axis. flex-grow/shrink/basis — управление размером элементов. align-self — индивидуальное выравнивание одного элемента.",
    detailedExplanation: "Две оси Flexbox:\n\nMain axis — по flex-direction:\n- row: горизонтально (слева направо)\n- column: вертикально (сверху вниз)\n\nCross axis — поперечная:\n- row: вертикально\n- column: горизонтально\n\njustify-content (main axis):\n- flex-start — к началу\n- flex-end — к концу\n- center — по центру\n- space-between — равные пространства (без отступов по краям)\n- space-around — равные пространства (с половинными отступами по краям)\n- space-evenly — равные пространства (одинаковые отступы везде)\n\nalign-items (cross axis):\n- stretch — растянуть (по умолчанию)\n- flex-start — к началу\n- flex-end — к концу\n- center — по центру\n- baseline — по базовой линии текста\n\nalign-self:\n- Как align-items, но для ОДНОГО элемента\n\nalign-content:\n- Выравнивание строк (when flex-wrap: wrap)\n\nFlex-свойства (items):\n- flex-grow: сколько «расти» при наличии свободного места\n- flex-shrink: сколько «сжиматься» при нехватке места\n- flex-basis: начальный размер (до grow/shrink)\n- flex: grow shrink basis (сокращение)\n- flex: 1 = flex: 1 1 0%\n- flex: auto = flex: 1 1 auto",
    mentalModel: "Две оси — как координатная сетка. justify-content — «расставлять кнопки по горизонтали». align-items — «расставлять кнопки по вертикали». flex-grow — «кто сколько занимает свободного места».",
    examples: [
      {
        level: "minimal",
        code: "/* Центрирование */\n.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\n/* Равномерное распределение */\n.nav {\n  display: flex;\n  justify-content: space-between;\n}",
        explanation: "Базовое центрирование и space-between для навигации."
      },
      {
        level: "simple",
        code: "/* Карточки с flex-grow */\n.grid {\n  display: flex;\n  gap: 1rem;\n}\n\n.card-small { flex: 1; }\n.card-large { flex: 2; } /* Занимает в 2 раза больше */\n\n/* Нижний футер */\n.page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n\n.content { flex: 1; } /* Занимает всё свободное место */\n\n.footer {\n  /* Автоматически прижат к низу */\n}\n\n/* Индивидуальное выравнивание */\n.item-center { align-self: center; }\n.item-end { align-self: flex-end; }",
        explanation: "flex-grow для пропорций, flex: 1 для footer, align-self."
      },
      {
        level: "real",
        code: "/* Полноценный flex-layout */\n.page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n\n.header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 1rem 2rem;\n}\n\n.nav {\n  display: flex;\n  gap: 1.5rem;\n}\n\n.content {\n  flex: 1;\n  display: flex;\n  gap: 2rem;\n  padding: 2rem;\n}\n\n.sidebar {\n  flex: 0 0 250px;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n.sidebar-item {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.5rem 0.75rem;\n  border-radius: 6px;\n}\n\n.sidebar-item.active {\n  background: #e3f2fd;\n  align-self: stretch;\n}\n\n.main {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}",
        explanation: "Полный flex-layout с выравниванием на всех уровнях."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать justify-content и align-items",
        why: "justify-content — main axis (по flex-direction). align-items — cross axis (поперёк).",
        right: "justify-content — ВДОЛЬ оси. align-items — ПОПЕРЁК оси."
      },
      {
        wrong: "Не использовать flex: 1 для «растяжки»",
        why: "flex: 1 = flex: 1 1 0%. Элемент растягивается на доступное пространство.",
        right: "flex: 1 — «займи всё свободное место». Отлично для основного контента."
      },
      {
        wrong: "Забывать min-height для column-центрирования",
        why: "В column-контейнере align-items: center работает по горизонтали. Для вертикального центрирования нужна min-height.",
        right: "Для центрирования по обеим осям: min-height: 100vh + justify-content: center + align-items: center."
      }
    ],
    importantToRemember: [
      "justify-content — main axis, align-items — cross axis",
      "flex: 1 = flex: 1 1 0% (растягивается на доступное место)",
      "align-self — индивидуальное выравнивание элемента",
      "Для вертикального центрирования: min-height + align-items: center",
      "space-between — равные пространства без отступов по краям"
    ],
    connection: {
      back: "Вы знаете основы flexbox (C13) — выравнивание управляет положением элементов внутри flex-контейнера.",
      forward: "В следующем уроке (C15) вы изучите основы CSS Grid: display: grid и grid-template-columns."
    }
  },

  // ============================================
  // C15 — Grid Basics
  // ============================================
  {
    slug: "grid-basics",
    track: "css",
    order: 15,
    title: "Grid — основы",
    summary: "CSS Grid: display: grid, grid-template-columns, grid-template-rows, gap и двумерная раскладка.",
    level: "Intermediate",
    prerequisites: ["flexbox-alignment"],
    learningObjective: "После этого урока вы сможете создавать CSS Grid-раскладки с колонками, строками, gap и размещать элементы в двумерной сетке.",
    shortExplanation: "CSS Grid — двумерная (2D) раскладка: элементы выстраиваются одновременно в строки И колонки. display: grid создаёт grid-контейнер. grid-template-columns задаёт колонки. grid-template-rows — строки. Grid = 2D, Flexbox = 1D.",
    detailedExplanation: "CSS Grid — ДВУМЕРНАЯ раскладка (строки + колонки одновременно).\n\nСоздание grid-контейнера:\ndisplay: grid;\n\nОпределение колонок:\ngrid-template-columns: 200px 1fr 2fr;\n/* Три колонки: 200px, 1/3, 2/3 */\n\ngrid-template-columns: repeat(3, 1fr);\n/* Три равные колонки */\n\ngrid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n/* Адаптивные колонки: минимум 250px */\n\nОпределение строк:\ngrid-template-rows: auto 1fr auto;\n/* Три строки: по содержимому, растянутая, по содержимому */\n\nGaps:\ngap: 1rem; /* Расстояние между ячейками */\nrow-gap: 1rem; /* Только строки */\ncolumn-gap: 2rem; /* Только колонки */\n\nРазмещение элементов:\ngrid-column: 1 / 3; /* Занимает колонки 1-2 */\ngrid-row: 1 / 2; /* Занимает строку 1 */\ngrid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */\n\nfr — доля свободного места:\ngrid-template-columns: 1fr 2fr 1fr;\n/* 25% 50% 25% свободного пространства */",
    mentalModel: "Grid — как шахматная доска. grid-template-columns — количество и ширина столбцов. grid-template-rows — количество и высота строк. fr — доля свободного места. Каждая клетка — ячейка grid.",
    examples: [
      {
        level: "minimal",
        code: ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n\n.item-featured {\n  grid-column: 1 / -1; /* На всю ширину */\n}",
        explanation: "Базовая трёхколоночная сетка сfeatured-элементом."
      },
      {
        level: "simple",
        code: "/* Адаптивная сетка */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n}\n\n/* Sidebar + Main layout */\n.layout {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  gap: 2rem;\n}\n\n/* Header + Content + Footer */\n.page {\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}\n\n/* Размещение элементов */\n.header {\n  grid-column: 1 / -1; /* На всю ширину */\n}\n\n.sidebar {\n  grid-row: 2 / 4; /* Занимает 2 строки */\n}",
        explanation: "Адаптивная сетка, layout, размещение элементов."
      },
      {
        level: "real",
        code: "/* Полный page layout */\n.page {\n  display: grid;\n  grid-template-areas:\n    \"header header header\"\n    \"nav    main   sidebar\"\n    \"footer footer footer\";\n  grid-template-columns: 200px 1fr 250px;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}\n\n.header  { grid-area: header; }\n.nav     { grid-area: nav; }\n.main    { grid-area: main; }\n.sidebar { grid-area: sidebar; }\n.footer  { grid-area: footer; }\n\n/* Адаптив: на мобильном — одна колонка */\n@media (max-width: 768px) {\n  .page {\n    grid-template-areas:\n      \"header\"\n      \"nav\"\n      \"main\"\n      \"sidebar\"\n      \"footer\";\n    grid-template-columns: 1fr;\n  }\n}\n\n/* Адаптивная сетка контента */\n.content-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));\n  gap: clamp(1rem, 2vw, 2rem);\n  padding: clamp(1rem, 3vw, 3rem);\n}",
        explanation: "Полный grid-layout с grid-template-areas и адаптивом."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать grid для одномерной раскладки",
        why: "Grid — для 2D (строки + колонки). Для 1D (только строка или колонка) — flexbox проще.",
        right: "1D → Flexbox. 2D → Grid. Не используйте grid там, где подходит flex."
      },
      {
        wrong: "Не использовать auto-fit/auto-fill",
        why: "Без auto-fit/fill сетка не адаптируется. Нужны media queries для каждого брейкпоинта.",
        right: "repeat(auto-fit, minmax(300px, 1fr)) — адаптивная сетка без медиа-запросов."
      },
      {
        wrong: "Хардкодить количество колонок",
        why: "grid-template-columns: repeat(3, 1fr) — фиксировано. На мобилке 3 колонки будут мелкими.",
        right: "auto-fit + minmax — автоматическое количество колонок."
      }
    ],
    importantToRemember: [
      "Grid = ДВУМЕРНАЯ раскладка (строки + колонки)",
      "grid-template-columns/rows — определение сетки",
      "fr — доля свободного места",
      "grid-template-areas — визуальное размещение",
      "auto-fit + minmax — адаптивная сетка без медиа-запросов"
    ],
    sources: [
      { title: "MDN: основы CSS Grid", url: "https://developer.mozilla.org/ru/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout" },
      { title: "Дока: гайд по grid", url: "https://doka.guide/css/grid-guide/" }
    ],
    connection: {
      back: "Вы знаете выравнивание во flexbox (C14) — grid добавляет возможности двумерной раскладки.",
      forward: "В следующем уроке (C16) вы изучите строки, колонки grid и продвинутое размещение элементов."
    }
  },

  // ============================================
  // C16 — Grid Rows and Columns
  // ============================================
  {
    slug: "grid-rows-cols",
    track: "css",
    order: 16,
    title: "Grid — строки и колонки",
    summary: "Продвинутый Grid: grid-column, grid-row, span, grid-area, template-areas, auto-placement.",
    level: "Intermediate",
    prerequisites: ["grid-basics"],
    learningObjective: "После этого урока вы сможете растягивать элементы на несколько строк и колонок, использовать grid-area и создавать сложные grid-раскладки.",
    shortExplanation: "Grid позволяет элементам занимать несколько колонок/строк (span), размещаться по имени области (grid-area) и использовать шаблоны (grid-template-areas). auto-placement автоматически размещает элементы. minmax() и repeat() создают адаптивные сетки.",
    detailedExplanation: "Размещение в Grid:\n\ngrid-column: 1 / 3; — занимает колонки 1-2\ngrid-column: span 2; — занимает 2 колонки\ngrid-column: 1 / -1; — на всю ширину (от первой до последней)\n\ngrid-row: 1 / 3; — занимает строки 1-2\ngrid-row: span 2; — занимает 2 строки\n\ngrid-area: row-start / col-start / row-end / col-end;\ngrid-area: 1 / 1 / 3 / 4;\n\ngrid-template-areas:\nВизуальное размещение по именам:\ngrid-template-areas:\n  \"header header\"\n  \"nav    main\"\n  \"footer footer\";\n\ngrid-area: header; — элемент с area: header\n\nauto-placement:\nЭлементы без явного размещения размещаются автоматически:\n- row по умолчанию (заполняет строки)\n- column (заполняет колонки)\n\nminmax() + repeat():\ngrid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\nМинимум 250px, максимум — делится поровну.",
    mentalModel: "Grid — как таблица Excel. grid-column: 1 / 3 — «объединить ячейки B2:D2». grid-template-areas — «нарисовать макет таблицы словами».",
    examples: [
      {
        level: "minimal",
        code: ".grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1rem;\n}\n\n.featured {\n  grid-column: span 2; /* Занимает 2 колонки */\n}\n\n.tall {\n  grid-row: span 2; /* Занимает 2 строки */\n}",
        explanation: "Span элементов на несколько колонок/строк."
      },
      {
        level: "simple",
        code: "/* Grid Template Areas */\n.layout {\n  display: grid;\n  grid-template-areas:\n    \"header  header\"\n    \"sidebar main\"\n    \"footer  footer\";\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}\n\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.footer  { grid-area: footer; }\n\n/* Span на всю ширину */\n.full-width {\n  grid-column: 1 / -1;\n}\n\n/* Named lines */\n.grid {\n  grid-template-columns: [sidebar-start] 250px [sidebar-end main-start] 1fr [main-end];\n}",
        explanation: "Template areas, span на всю ширину, именованные линии."
      },
      {
        level: "real",
        code: "/* Dashboard layout */\n.dashboard {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-auto-rows: minmax(100px, auto);\n  gap: 1.5rem;\n  padding: 1.5rem;\n}\n\n.dashboard-header {\n  grid-column: 1 / -1;\n}\n\n.stat-card {\n  display: grid;\n  place-items: center;\n  background: white;\n  border-radius: 8px;\n  padding: 1.5rem;\n}\n\n.chart-large {\n  grid-column: span 2;\n  grid-row: span 2;\n}\n\n.chart-wide {\n  grid-column: span 2;\n}\n\n/* Адаптив */\n@media (max-width: 768px) {\n  .dashboard {\n    grid-template-columns: 1fr;\n  }\n  .chart-large,\n  .chart-wide {\n    grid-column: span 1;\n  }\n}",
        explanation: "Dashboard с span, auto-rows и адаптивом."
      }
    ],
    commonMistakes: [
      {
        wrong: "Не использовать grid-template-areas",
        why: "Обычное размещение (grid-column/row) сложно визуализировать. Template areas — наглядно.",
        right: "Для сложных layout используйте grid-template-areas — это как рисунок макета."
      },
      {
        wrong: "Забывать про minmax() для адаптива",
        why: "Без minmax() ячейки могут стать слишком мелкими или слишком большими.",
        right: "minmax(250px, 1fr) — minimum и maximum для каждой колонки."
      },
      {
        wrong: "Использовать span без планирования",
        why: "span 2 в 3-колоночной сетке = 2/3 ширины. Нужно понимать, как это повлияет на другие элементы.",
        right: "Планируйте span с учётом общего количества колонок."
      }
    ],
    importantToRemember: [
      "grid-column: span N — занимает N колонок",
      "grid-template-areas — визуальное размещение по именам",
      "grid-column: 1 / -1 — на всю ширину",
      "auto-rows: minmax(100px, auto) — автоматические строки",
      "minmax() + repeat() — адаптивные сетки"
    ],
    connection: {
      back: "Вы знаете основы grid (C15) — продвинутое размещение позволяет создавать сложные раскладки.",
      forward: "В следующем уроке (C17) вы изучите псевдо-классы и псевдо-элементы."
    }
  },

  // ============================================
  // C17 — Pseudo-classes and Pseudo-elements
  // ============================================
  {
    slug: "pseudo-classes-elements",
    track: "css",
    order: 17,
    title: "Псевдо-классы и псевдо-элементы",
    summary: ":hover, :focus, :nth-child, ::before, ::after, ::first-line и другие.",
    level: "Intermediate",
    prerequisites: ["grid-rows-cols"],
    learningObjective: "После этого урока вы сможете использовать псевдо-классы для стилизации состояний и псевдо-элементы для вставки контента.",
    shortExplanation: "Псевдо-классы (:hover, :focus, :nth-child) стилизуют элементы в определённом СОСТОЯНИИ. Псевдо-элементы (::before, ::after, ::first-line) создают ВИРТУАЛЬНЫЕ элементы, которых нет в DOM. Важно: псевдо-элемент ≠ DOM-элемент!",
    detailedExplanation: "Псевдо-классы (двоечие :):\nОпределяют СОСТОЯНИЕ элемента:\n\n:hover — наведение мыши\n:focus — фокус (tab, клик)\n:active — нажатие\n:first-child — первый ребёнок\n:last-child — последний ребёнок\n:nth-child(n) — N-й ребёнок\n:nth-child(odd) — нечётные\n:nth-child(even) — чётные\n:nth-child(3n) — каждый третий\n:not(.class) — исключение\n:link — непосещённая ссылка\n:visited — посещённая ссылка\n\nПсевдо-элементы (двоеточие ::):\nСоздают ВИРТУАЛЬНЫЕ элементы:\n\n::before — ЭЛЕМЕНТ ПЕРЕД содержимым\n::after — ЭЛЕМЕНТ ПОСЛЕ содержимого\n::first-line — первая строка текста\n::first-letter — первая буква\n::selection — выделенный текст\n::placeholder — placeholder в input\n\nВажно:\n- Псевдо-элемент ≠ DOM-элемент! Он не виден в DevTools.\n- Требует content: \"\" (обязательно для before/after)\n- ::before и ::after — инлайн по умолчанию",
    mentalModel: "Псевдо-классы — как «когда я чувствую себя так-то» (когда навели мышь, когда в фокусе). Псевдо-элементы — как «призраки»: '::before' — призрак перед элементом, '::after' — призрак после. Они есть, но не в DOM.",
    examples: [
      {
        level: "minimal",
        code: "a:hover {\n  color: #e74c3c;\n}\n\ninput:focus {\n  outline: 2px solid #3498db;\n}\n\nli:nth-child(even) {\n  background: #f5f5f5;\n}",
        explanation: "Базовые псевдо-классы: hover, focus, nth-child."
      },
      {
        level: "simple",
        code: "/* Декоративные элементы */\n.card::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: #3498db;\n}\n\n/* Счётчик */\n.steps li {\n  counter-increment: step;\n  list-style: none;\n}\n\n.steps li::before {\n  content: counter(step);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  background: #3498db;\n  color: white;\n  border-radius: 50%;\n  font-size: 0.75rem;\n  margin-right: 0.5rem;\n}\n\n/* Кавычки */\nblockquote::before {\n  content: open-quote;\n  font-size: 2em;\n  color: #ccc;\n}",
        explanation: "Декоративные элементы, счётчики и кавычки."
      },
      {
        level: "real",
        code: "/* Tooltip */\n.tooltip {\n  position: relative;\n}\n\n.tooltip::after {\n  content: attr(data-tooltip);\n  position: absolute;\n  bottom: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n  padding: 0.5rem 0.75rem;\n  background: #333;\n  color: white;\n  border-radius: 4px;\n  font-size: 0.875rem;\n  white-space: nowrap;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.2s;\n}\n\n.tooltip:hover::after {\n  opacity: 1;\n}\n\n/* Выделение текста */\n::selection {\n  background: #3498db;\n  color: white;\n}\n\n/* Кастомный checkbox */\n.checkbox-custom::before {\n  content: \"\";\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  border: 2px solid #ccc;\n  border-radius: 4px;\n  margin-right: 0.5rem;\n  vertical-align: middle;\n}\n\n.checkbox-custom:checked::before {\n  background: #3498db;\n  border-color: #3498db;\n  background-image: url(\"check.svg\");\n  background-size: 12px;\n  background-position: center;\n  background-repeat: no-repeat;\n}",
        explanation: "Tooltip, выделение, кастомный checkbox — продвинутые псевдо."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что ::before/::after — DOM-элементы",
        why: "Они виртуальные: нет в DOM, нельзя выбрать через querySelector, не видны скринридерам.",
        right: "Псевдо-элементы — виртуальные. Для доступного контента используйте реальные элементы."
      },
      {
        wrong: "Забывать content: \"\" для before/after",
        why: "Без content псевдо-элемент не создаётся. Это обязательный атрибут.",
        right: "content: \"\" — обязательно для ::before и ::after."
      },
      {
        wrong: "Путать псевдо-классы и псевдо-элементы",
        why: "Псевдо-класс (:hover) — состояние существующего элемента. Псевдо-элемент (::before) — создание нового виртуального элемента.",
        right: "Одно двоеточие (:) — псевдо-класс. Двоеточие (::) — псевдо-элемент."
      }
    ],
    importantToRemember: [
      "Псевдо-классы (:hover, :focus) — состояние элемента",
      "Псевдо-элементы (::before, ::after) — виртуальные элементы",
      "content: \"\" — обязателен для before/after",
      "Псевдо-элемент ≠ DOM-элемент",
      "nth-child(N) — nth-child(3n+1) — формулы для выбора"
    ],
    connection: {
      back: "Вы знаете grid-раскладки (C16) — псевдо-классы и псевдо-элементы добавляют динамические стили и оформление.",
      forward: "В следующем уроке (C18) вы изучите CSS-переменные: кастомные свойства для переиспользуемых значений."
    }
  },

  // ============================================
  // C18 — CSS Variables
  // ============================================
  {
    slug: "css-variables",
    track: "css",
    order: 18,
    title: "CSS-переменные",
    summary: "Кастомные свойства: :root, var(), переопределение, динамические значения.",
    level: "Intermediate",
    prerequisites: ["pseudo-classes-elements"],
    learningObjective: "После этого урока вы сможете определять, использовать и переопределять CSS-переменные (кастомные свойства) для поддерживаемых стилей.",
    shortExplanation: "CSS-переменные (custom properties) — переиспользуемые значения, определённые через --name и используемые через var(--name). Определяются в :root для глобального доступа. Можно переопределять в контекстах. Делают CSS гибким и легкоизменяемым.",
    detailedExplanation: "Определение CSS-переменных:\n:root {\n  --primary: #3498db;\n  --spacing: 1rem;\n  --font-body: 'Inter', sans-serif;\n}\n\nИспользование:\n.button {\n  background: var(--primary);\n  padding: var(--spacing);\n  font-family: var(--font-body);\n}\n\nЗначение по умолчанию:\ncolor: var(--text, #333);\n/* Если --text не определён, использует #333 */\n\nПереопределение:\n.dark {\n  --primary: #2980b9;\n  --bg: #1a1a2e;\n}\n/* Все элементы внутри .dark используют новые значения */\n\nКаскадирование:\nCSS-переменные наследуются и каскадируются как обычные свойства!\n\nДинамические значения:\nС помощью JavaScript:\nelement.style.setProperty('--primary', '#e74c3c');\n\nПреимущества:\n1. Один источник правды (DRY)\n2. Легкая смена темы\n3. Переопределение в контексте\n4. Динамические значения через JS",
    mentalModel: "CSS-переменные — как настройки в игре. --primary: синий — базовый цвет. В .dark: --primary: тёмно-синий — другой скин. Всё остальное (кнопки, ссылки) автоматически меняется!",
    examples: [
      {
        level: "minimal",
        code: ":root {\n  --color: #333;\n  --bg: white;\n}\n\nbody {\n  color: var(--color);\n  background: var(--bg);\n}\n\n.dark {\n  --color: #fff;\n  --bg: #1a1a2e;\n}",
        explanation: "Базовые переменные и тема dark."
      },
      {
        level: "simple",
        code: "/* Дизайн-система */\n:root {\n  /* Цвета */\n  --primary: hsl(210, 80%, 50%);\n  --primary-hover: hsl(210, 80%, 40%);\n  --text: hsl(220, 15%, 20%);\n  --text-muted: hsl(220, 10%, 45%);\n  --bg: hsl(0, 0%, 98%);\n  --border: hsl(220, 15%, 88%);\n\n  /* Отступы */\n  --space-xs: 0.25rem;\n  --space-sm: 0.5rem;\n  --space-md: 1rem;\  --space-lg: 1.5rem;\n  --space-xl: 2rem;\n\n  /* Тени */\n  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);\n  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);\n}\n\n.card {\n  padding: var(--space-lg);\n  background: var(--bg);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  box-shadow: var(--shadow-sm);\n}\n\n.btn-primary {\n  background: var(--primary);\n  padding: var(--space-sm) var(--space-md);\n}\n\n.btn-primary:hover {\n  background: var(--primary-hover);\n}",
        explanation: "Дизайн-система с переменными для цветов, отступов и теней."
      },
      {
        level: "real",
        code: "/* Полная тема */\n:root {\n  --color-primary: hsl(210, 80%, 50%);\n  --color-bg: hsl(0, 0%, 100%);\n  --color-text: hsl(220, 15%, 15%);\n  --color-surface: hsl(0, 0%, 98%);\n  --shadow: 0 1px 3px rgba(0,0,0,0.1);\n  --radius: 8px;\n  --transition: 0.2s ease;\n}\n\n.dark {\n  --color-primary: hsl(210, 80%, 60%);\n  --color-bg: hsl(220, 20%, 10%);\n  --color-text: hsl(0, 0%, 90%);\n  --color-surface: hsl(220, 20%, 15%);\n  --shadow: 0 1px 3px rgba(0,0,0,0.3);\n}\n\n/* Контекстное переопределение */\n.card-accent {\n  --color-primary: hsl(35, 100%, 55%);\n}\n\n.card-accent .btn {\n  background: var(--color-primary);\n}\n\n/* JS-динамика */\n.progress-bar {\n  width: calc(var(--progress, 0) * 1%);\n  background: var(--color-primary);\n  transition: width var(--transition);\n}\n\n/* Вычисления */\n.spacing-component {\n  padding: calc(var(--space-md) * 1.5);\n  margin-bottom: var(--space-lg);\n}",
        explanation: "Полная тема: dark mode, контекстное переопределение, JS-динамика."
      }
    ],
    commonMistakes: [
      {
        wrong: "Не использовать CSS-переменные",
        why: "Хардкод значений = правки в 20 файлах при смене темы. Переменные = один источник правды.",
        right: "Определите базовые значения в :root и используйте var() везде."
      },
      {
        wrong: "Путать CSS-переменные и Sass-переменные",
        why: "Sass-переменные ($var) — компилируются в CSS. CSS-переменные (--var) — работают в браузере, динамические.",
        right: "CSS-переменные (--name) — runtime. Sass-переменные ($name) — build time."
      },
      {
        wrong: "Забывать значение по умолчанию",
        why: "Если переменная не определена, свойство не применяется.",
        right: "color: var(--text, #333); — fallback, если переменная не найдена."
      }
    ],
    importantToRemember: [
      ":root { --name: value; } — определение переменных",
      "var(--name) — использование переменных",
      "var(--name, fallback) — значение по умолчанию",
      "Переменные наследуются и каскадируются",
      "Переопределение в контексте (.dark { --primary: ... })"
    ],
    connection: {
      back: "Вы знаете псевдо-классы и псевдо-элементы (C17) — переменные делают динамические стили поддерживаемыми.",
      forward: "В следующем уроке (C19) вы изучите стилизацию форм: кнопки, поля ввода и кастомные контролы."
    }
  },

  // ============================================
  // C19 — Form Styling
  // ============================================
  {
    slug: "form-styling",
    track: "css",
    order: 19,
    title: "Стилизация форм",
    summary: "CSS для форм: input, button, select, textarea, :focus, :invalid, :valid, кастомные чекбоксы.",
    level: "Intermediate",
    prerequisites: ["css-variables"],
    learningObjective: "После этого урока вы сможете стилизовать элементы форм, создавать кастомные контролы и использовать псевдо-классы валидации.",
    shortExplanation: "CSS позволяет стилизовать все элементы форм: input, button, select, textarea. Псевдо-классы :focus, :invalid, :valid, :disabled управляют состояниями. Кастомные чекбоксы/radio создаются через ::before/::after и opacity: 0.",
    detailedExplanation: "Базовая стилизация форм:\n\n/* Сброс стилей браузера */\ninput, button, select, textarea {\n  font: inherit;\n  color: inherit;\n}\n\n/* Text input */\ninput[type=\"text\"],\ninput[type=\"email\"],\ntextarea {\n  width: 100%;\n  padding: 0.75rem;\n  border: 1px solid var(--border);\n  border-radius: 6px;\n  background: white;\n  transition: border-color 0.2s;\n}\n\ninput:focus {\n  outline: none;\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);\n}\n\n/* Валидация */\ninput:invalid:not(:placeholder-shown) {\n  border-color: var(--error);\n}\n\ninput:valid:not(:placeholder-shown) {\n  border-color: var(--success);\n}\n\n/* :placeholder-shown — чтобы не показывать ошибку при пустом поле */\n\nКастомные чекбоксы:\n1. Скрыть нативный input (opacity: 0)\n2. Создать визуальный элемент через ::before\n3. Использовать :checked для состояния",
    mentalModel: "Стилизация форм — как дизайн анкеты. Каждое поле — как окошко в бланке: рамка (border), подсветка при заполнении (focus), зелёная галочка (valid), красный крестик (invalid).",
    examples: [
      {
        level: "minimal",
        code: "input[type=\"text\"] {\n  width: 100%;\n  padding: 0.75rem;\n  border: 1px solid #ccc;\n  border-radius: 6px;\n  font-size: 1rem;\n}\n\ninput:focus {\n  outline: 2px solid #3498db;\n  outline-offset: 2px;\n}\n\nbutton {\n  padding: 0.75rem 1.5rem;\n  background: #3498db;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}",
        explanation: "Базовая стилизация input и button."
      },
      {
        level: "simple",
        code: "/* Валидация */\n.input-group {\n  margin-bottom: 1rem;\n}\n\n.input-group label {\n  display: block;\n  margin-bottom: 0.25rem;\n  font-weight: 500;\n}\n\n.input-group input {\n  width: 100%;\n  padding: 0.75rem;\n  border: 2px solid var(--border);\n  border-radius: 6px;\n  transition: border-color 0.2s, box-shadow 0.2s;\n}\n\n.input-group input:focus {\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(52,152,219,0.15);\n  outline: none;\n}\n\n.input-group input:invalid:not(:placeholder-shown) {\n  border-color: var(--error);\n}\n\n.input-group .error-text {\n  color: var(--error);\n  font-size: 0.875rem;\n  margin-top: 0.25rem;\n  display: none;\n}\n\n.input-group input:invalid:not(:placeholder-shown) ~ .error-text {\n  display: block;\n}",
        explanation: "Форма с валидацией и сообщениями об ошибках."
      },
      {
        level: "real",
        code: "/* Кастомный checkbox */\n.checkbox-wrapper {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  cursor: pointer;\n}\n\n.checkbox-wrapper input[type=\"checkbox\"] {\n  position: absolute;\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n\n.checkbox-wrapper .checkmark {\n  width: 20px;\n  height: 20px;\n  border: 2px solid var(--border);\n  border-radius: 4px;\n  display: grid;\n  place-items: center;\n  transition: all 0.2s;\n}\n\n.checkbox-wrapper .checkmark::after {\n  content: \"\";\n  width: 10px;\n  height: 5px;\n  border-left: 2px solid white;\n  border-bottom: 2px solid white;\n  transform: rotate(-45deg) scale(0);\n  transition: transform 0.2s;\n}\n\n.checkbox-wrapper input:checked + .checkmark {\n  background: var(--primary);\n  border-color: var(--primary);\n}\n\n.checkbox-wrapper input:checked + .checkmark::after {\n  transform: rotate(-45deg) scale(1);\n}\n\n.checkbox-wrapper input:focus-visible + .checkmark {\n  box-shadow: 0 0 0 3px rgba(52,152,219,0.3);\n}",
        explanation: "Кастомный checkbox с CSS-анимацией."
      }
    ],
    commonMistakes: [
      {
        wrong: "Убирать outline без альтернативы",
        why: "outline: none без :focus стиля делает поле недоступным для клавиатурной навигации.",
        right: "Замените outline на box-shadow или border-color при :focus. Никогда не убирайте фокус!"
      },
      {
        wrong: "Не стилизовать :focus",
        why: "Пользователи с клавиатурой не видят, какое поле активно. Это нарушение доступности.",
        right: "Всегда стилизуйте :focus: border, box-shadow или outline."
      },
      {
        wrong: "Использовать :invalid на пустых полях",
        why: "Пустое поле required сразу показывает ошибку (красный). Пользователь не успел ввести данные.",
        right: "Используйте :invalid:not(:placeholder-shown) — показывать ошибку только после ввода."
      }
    ],
    importantToRemember: [
      "font: inherit — сброс шрифта для единообразия",
      ":focus обязателен для доступности",
      "box-shadow вместо outline для :focus",
      ":invalid:not(:placeholder-shown) — ошибка после ввода",
      "Кастомные чекбоксы: opacity: 0 + ::before/::after"
    ],
    connection: {
      back: "Вы знаете CSS-переменные (C18) — стилизация форм применяет дизайн-систему к интерактивным элементам.",
      forward: "В следующем уроке (C20) вы изучите адаптивный дизайн и медиа-запросы."
    }
  },

  // ============================================
  // C20 — Responsive Design and Media Queries
  // ============================================
  {
    slug: "responsive-media-queries",
    track: "css",
    order: 20,
    title: "Адаптивный дизайн и медиа-запросы",
    summary: "Media queries, mobile-first подход, контейнерные запросы, адаптивные изображения.",
    level: "Intermediate",
    prerequisites: ["form-styling"],
    learningObjective: "После этого урока вы сможете писать медиа-запросы, применять стратегию mobile-first и создавать адаптивные раскладки.",
    shortExplanation: "Адаптивный дизайн — сайт подстраивается под размер экрана. Media queries (@media) позволяют применять стили при определённых условиях (ширина экрана). Mobile-first — стратегия: сначала стили для мобильных, затем добавляем для больших экранов. Это стратегия, а не единственный способ!",
    detailedExplanation: "Media queries:\n@media (min-width: 768px) {\n  /* Стили для планшетов и больше */\n}\n\n@media (max-width: 768px) {\n  /* Стили для мобильных */\n}\n\nBreakpoints (типичные):\n- 480px — маленькие телефоны\n- 768px — планшеты\n- 1024px — десктопы\n- 1280px — большие экраны\n\nMobile-first (рекомендуется):\n/* Базовые стили — для мобильных */\n.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n}\n\n/* Планшеты */\n@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n/* Десктопы */\n@media (min-width: 1024px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n\nКонтейнерные запросы (современная альтернатива):\n@container (min-width: 400px) {\n  .card { /* стили */ }\n}\n/* Работает от размера контейнера, не экрана */\n\nАдаптивные изображения:\nimg { max-width: 100%; height: auto; }\n/* Картинка никогда не выходит за контейнер */\n\nclamp() вместо медиа-запросов:\nfont-size: clamp(1rem, 2.5vw, 2rem);\n/* Плавное масштабирование без breakpoint'ов */",
    mentalModel: "Адаптивный дизайн — как трансформер. На телефоне — компактная версия. На планшете — расширенная. На десктопе — полная. Media queries — «когда экран шире 768px — раскладывай по-другому».",
    examples: [
      {
        level: "minimal",
        code: "/* Mobile-first */\n.container {\n  padding: 1rem;\n}\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 720px;\n    margin: 0 auto;\n    padding: 2rem;\n  }\n}\n\n@media (min-width: 1024px) {\n  .container {\n    max-width: 960px;\n  }\n}",
        explanation: "Базовый mobile-first: от простого к сложному."
      },
      {
        level: "simple",
        code: "/* Адаптивная сетка */\n.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n  padding: 1rem;\n}\n\n@media (min-width: 640px) {\n  .grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n@media (min-width: 1024px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1.5rem;\n  }\n}\n\n/* Скрытие элементов */\n.desktop-only { display: none; }\n.mobile-only { display: block; }\n\n@media (min-width: 768px) {\n  .desktop-only { display: block; }\n  .mobile-only { display: none; }\n}\n\n/* clamp() вместо медиа-запросов */\nh1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  padding: clamp(1rem, 3vw, 3rem);\n}",
        explanation: "Адаптивная сетка, скрытие элементов и clamp()."
      },
      {
        level: "real",
        code: "/* Полная адаптивная страница */\n.page {\n  display: grid;\n  grid-template-columns: 1fr;\n  min-height: 100vh;\n}\n\n@media (min-width: 768px) {\n  .page {\n    grid-template-columns: 250px 1fr;\n  }\n}\n\n@media (min-width: 1024px) {\n  .page {\n    grid-template-columns: 280px 1fr 250px;\n  }\n}\n\n/* Sidebar: скрыт на мобильном */\n.sidebar {\n  display: none;\n}\n\n@media (min-width: 768px) {\n  .sidebar {\n    display: block;\n  }\n}\n\n/* Контейнерные запросы */\n.card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n    gap: 1rem;\n  }\n}\n\n/* Prefers-color-scheme */\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg: #1a1a2e;\n    --text: #e0e0e0;\n  }\n}\n\n/* Prefers-reduced-motion */\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation: none !important;\n    transition: none !important;\n  }\n}",
        explanation: "Полный адаптив: grid-layout, container queries, prefers-color-scheme."
      }
    ],
    commonMistakes: [
      {
        wrong: "Делать desktop-first (max-width)",
        why: "Desktop-first = «наворачиваем» стили для мобильных. Mobile-first = «добавляем» для десктопа. Desktop-first сложнее поддерживать.",
        right: "Mobile-first (min-width): база для мобильных, расширяем для больших экранов."
      },
      {
        wrong: "Полагаться только на медиа-запросы",
        why: "clamp(), min(), fr, auto-fit — современные инструменты адаптива без медиа-запросов.",
        right: "Комбинируйте: clamp() для типографики, auto-fit для сеток, медиа-запросы для кардинальных изменений."
      },
      {
        wrong: "Забывать prefers-reduced-motion",
        why: "Пользователи с vestibular disorders просят убрать анимации. Это accessibility.",
        right: "@media (prefers-reduced-motion: reduce) { * { animation: none; } }"
      }
    ],
    importantToRemember: [
      "Mobile-first: @media (min-width: ...) — от малого к большому",
      "clamp() — плавное масштабирование без медиа-запросов",
      "prefers-color-scheme — тёмная тема",
      "prefers-reduced-motion — accessibility",
      "Контейнерные запросы — стили от размера контейнера"
    ],
    connection: {
      back: "Вы знаете стилизацию форм (C19) — адаптивный дизайн заставляет всё работать на любом экране.",
      forward: "В следующем уроке (C21) вы изучите CSS-переходы: анимацию изменения свойств."
    }
  },

  // ============================================
  // C21 — Transitions
  // ============================================
  {
    slug: "transitions",
    track: "css",
    order: 21,
    title: "Переходы",
    summary: "CSS transitions: property, duration, timing-function, delay и плавные анимации.",
    level: "Intermediate",
    prerequisites: ["responsive-media-queries"],
    learningObjective: "После этого урока вы сможете создавать плавные переходы между состояниями CSS с помощью свойств transition.",
    shortExplanation: "CSS transitions — плавное изменение свойств при смене состояния. transition: property duration timing-function delay. Например: transition: background 0.3s ease — фон плавно меняется за 0.3 секунды. Переходы работают при hover, focus, class change и других триггерах.",
    detailedExplanation: "Синтаксис:\ntransition: property duration timing-function delay;\n\nproperty: какое свойство анимировать\n- all — все свойства (осторожно!)\n- background — только фон\n- transform — трансформации\n- opacity — прозрачность\n\nduration: как долго\n- 0.3s — 0.3 секунды\n- 300ms — 300 миллисекунд\n\ntiming-function: скорость\n- ease (по умолчанию) — медленно в начале и конце\n- linear — равномерно\n- ease-in — разгон\n- ease-out — торможение\n- ease-in-out — разгон + торможение\n- cubic-bezier(x1,y1,x2,y2) — кастомная кривая\n\ndelay: задержка перед началом\n- 0s — без задержки\n- 0.5s — полсекунды задержки\n\nСвойства, которые анимируются:\n- background, color, border-color\n- opacity, box-shadow\n- transform (rotate, scale, translate)\n- width, height (осторожно!)\n- margin, padding (осторожно!)\n\nНЕ анимируются:\n- font-family (не анимируется плавно)\n- display (переключение без анимации)\n- position",
    mentalModel: "Transition — как плавный переход в фильме. Не «было так → стало так», а «плавно превратилось из одного в другое». Duration — длительность перехода. Timing — стиль (резко, плавно, с задержкой).",
    examples: [
      {
        level: "minimal",
        code: "button {\n  background: #3498db;\n  transition: background 0.3s ease;\n}\n\nbutton:hover {\n  background: #2980b9;\n}",
        explanation: "Простейший transition: плавная смена фона при hover."
      },
      {
        level: "simple",
        code: "/* Кнопка с transition */\n.btn {\n  padding: 0.75rem 1.5rem;\n  border: 2px solid #3498db;\n  background: transparent;\n  color: #3498db;\n  border-radius: 6px;\n  transition: all 0.3s ease;\n}\n\n.btn:hover {\n  background: #3498db;\n  color: white;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(52,152,219,0.4);\n}\n\n/* Карточка */\n.card {\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 25px rgba(0,0,0,0.15);\n}\n\n/* Задержка */\n.nav-item {\n  transition: color 0.2s ease 0.1s; /* 0.1s задержка */\n}",
        explanation: "Кнопка с hover-эффектом, карточка с тенью, задержка."
      },
      {
        level: "real",
        code: "/* Меню-гамбургер */\n.hamburger {\n  width: 30px;\n  height: 20px;\n  position: relative;\n}\n\n.hamburger span {\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 2px;\n  background: #333;\n  transition: all 0.3s ease;\n}\n\n.hamburger span:nth-child(1) { top: 0; }\n.hamburger span:nth-child(2) { top: 9px; }\n.hamburger span:nth-child(3) { top: 18px; }\n\n.hamburger.active span:nth-child(1) {\n  top: 9px;\n  transform: rotate(45deg);\n}\n\n.hamburger.active span:nth-child(2) {\n  opacity: 0;\n}\n\n.hamburger.active span:nth-child(3) {\n  top: 9px;\n  transform: rotate(-45deg);\n}\n\n/* Подсветка меню */\n.nav-link {\n  position: relative;\n}\n\n.nav-link::after {\n  content: \"\";\n  position: absolute;\n  bottom: -2px;\n  left: 0;\n  width: 0;\n  height: 2px;\n  background: var(--primary);\n  transition: width 0.3s ease;\n}\n\n.nav-link:hover::after {\n  width: 100%;\n}",
        explanation: "Гамбургер-меню и подсветка ссылки — анимация через transition."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать transition: all",
        why: "all анимирует ВСЕ свойства — включая ненужные (font-family, z-index). Медленно и неэффективно.",
        right: "Указывайте конкретные свойства: transition: background 0.3s, transform 0.3s."
      },
      {
        wrong: "Анимировать width/height",
        why: "Анимация width/height вызывает reflow (пересчёт layout) — это медленно.",
        right: "Для анимации размеров используйте transform: scale(). Для скрытия — max-height."
      },
      {
        wrong: "Забывать will-change",
        why: "Для сложных анимаций can использовать will-change: transform для оптимизации.",
        right: "will-change: transform; — подсказка браузеру подготовиться к анимации."
      }
    ],
    importantToRemember: [
      "transition: property duration timing delay",
      "ease — по умолчанию (разгон + торможение)",
      "Анимируйте transform, opacity (быстро), не width/height (медленно)",
      "transition: all — антипаттерн, указывайте конкретные свойства",
      "Задержка: transition-delay для каскадных эффектов"
    ],
    connection: {
      back: "Вы знаете адаптивный дизайн (C20) — переходы добавляют отполированность вашему адаптивному интерфейсу.",
      forward: "В следующем уроке (C22) вы изучите CSS-функции: calc(), min(), max(), clamp()."
    }
  },

  // ============================================
  // C22 — CSS Functions
  // ============================================
  {
    slug: "css-functions",
    track: "css",
    order: 22,
    title: "CSS-функции",
    summary: "calc(), min(), max(), clamp(), var(), url(), attr() и другие полезные CSS-функции.",
    level: "Intermediate",
    prerequisites: ["transitions"],
    learningObjective: "После этого урока вы сможете использовать CSS-функции calc(), min(), max(), clamp() для динамических значений.",
    shortExplanation: "CSS поддерживает функции для вычислений и динамических значений: calc() — арифметика (width: 100% - 200px), min()/max() — минимум/максимум, clamp() — ограничение между min/preferred/max, var() — переменные, url() — файлы, attr() — атрибуты HTML.",
    detailedExplanation: "Основные CSS-функции:\n\ncalc() — арифметика:\nwidth: calc(100% - 40px);\nheight: calc(100vh - 60px);\nfont-size: calc(14px + 0.5vw);\n\nМожно смешивать единицы!\n\nmin() — минимум из значений:\nwidth: min(90%, 800px);\n/* Не больше 90% и не больше 800px */\n\nmax() — максимум из значений:\nfont-size: max(16px, 1vw);\n/* Не меньше 16px и не меньше 1vw */\n\nclamp(min, preferred, max) — ограничение:\nfont-size: clamp(1rem, 2.5vw, 2rem);\n/* Не меньше 1rem, не больше 2rem, предпочтительно 2.5vw */\n\nvar() — CSS-переменные:\ncolor: var(--primary, #3498db);\n\nurl() — файлы:\nbackground: url('bg.jpg');\n\nattr() — HTML-атрибут:\n.content::after {\n  content: attr(data-count);\n}\n\nmin-content / max-content / fit-content:\nwidth: min-content; /* Минимальная ширина содержимого */\nwidth: max-content; /* Максимальная ширина содержимого */\nwidth: fit-content; /* По размеру содержимого */",
    mentalModel: "CSS-функции — как калькулятор в CSS. calc() — считает. min/max — выбирает минимум/максимум. clamp() — «золотая середина»: не меньше минимума, не больше максимума, а между — как получится.",
    examples: [
      {
        level: "minimal",
        code: ".container {\n  width: min(90%, 800px);\n  margin: 0 auto;\n  padding: max(1rem, 3vw);\n}\n\nh1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}",
        explanation: "Базовые min(), max(), clamp() для адаптива."
      },
      {
        level: "simple",
        code: "/* calc() для layout */\n.sidebar {\n  width: 250px;\n}\n\n.main {\n  width: calc(100% - 250px - 2rem);\n}\n\n/* min/max для контейнера */\n.container {\n  width: min(90%, 1200px);\n  margin-inline: auto;\n  padding-inline: clamp(1rem, 3vw, 3rem);\n}\n\n/* clamp для типографики */\n:root {\n  --step-0: clamp(0.875rem, 0.81rem + 0.33vw, 1rem);\n  --step-1: clamp(1rem, 0.93rem + 0.33vw, 1.13rem);\n  --step-2: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);\n}\n\n/* min-content для текста */\n.badge {\n  width: min-content;\n  padding: 0.25rem 0.75rem;\n  white-space: nowrap;\n}",
        explanation: "calc(), min(), clamp() и min-content для реальных задач."
      },
      {
        level: "real",
        code: "/* Полная адаптивная типографика */\nhtml {\n  font-size: clamp(14px, 1vw + 12px, 18px);\n}\n\n/* Динамический padding */\n.section {\n  padding-block: clamp(3rem, 8vw, 6rem);\n  padding-inline: min(5vw, 3rem);\n}\n\n/* Адаптивная сетка */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(\n    auto-fit,\n    minmax(min(100%, 300px), 1fr)\n  );\n  gap: clamp(1rem, 2vw, 2rem);\n}\n\n/* Картинка с ограничениями */\n.hero-image {\n  width: min(100%, 600px);\n  aspect-ratio: 16/9;\n  object-fit: cover;\n  border-radius: 8px;\n}\n\n/* Вычисление позиции */\n.tooltip {\n  position: absolute;\n  bottom: calc(100% + 8px);\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n/* Динамическая ширина */\n.text-input {\n  width: calc(100% - 2rem);\n  padding: 1rem;\n  /* padding + width = 100% (border-box) */\n}",
        explanation: "Полный набор CSS-функций для адаптивного дизайна."
      }
    ],
    commonMistakes: [
      {
        wrong: "Не использовать clamp() для типографики",
        why: "clamp() заменяет множество медиа-запросов для font-size.",
        right: "font-size: clamp(1rem, 2.5vw, 2rem) — плавное масштабирование."
      },
      {
        wrong: "Путать min() и max()",
        why: "min(90%, 800px) = не больше 800px. max(16px, 1vw) = не меньше 16px.",
        right: "min — «потолок» (не больше). max — «пол» (не меньше)."
      },
      {
        wrong: "Не знать calc() для смешивания единиц",
why: "width: calc(100% - 200px) — нельзя написать без calc(). Проценты и пиксели не складываются напрямую.",
        right: "calc() — единственный способ смешивать единицы: 100% - 200px, 16px + 1vw."
      }
    ],
    importantToRemember: [
      "calc() — арифметика со смешиванием единиц",
      "min() — «потолок» (не больше max значения)",
      "max() — «пол» (не меньше min значения)",
      "clamp(min, preferred, max) — ограничение посередине",
      "var() — CSS-переменные с fallback"
    ],
    connection: {
      back: "Вы знаете переходы (C21) — CSS-функции обеспечивают динамические и адаптивные значения.",
      forward: "В следующем уроке (C23) вы изучите фоны и градиенты — финальный урок CSS."
    }
  },

  // ============================================
  // C23 — Backgrounds and Gradients
  // ============================================
  {
    slug: "backgrounds-gradients",
    track: "css",
    order: 23,
    title: "Фоны и градиенты",
    summary: "background-color, background-image, background-size, background-position, linear-gradient, radial-gradient.",
    level: "Intermediate",
    prerequisites: ["css-functions"],
    learningObjective: "После этого урока вы сможете применять цвета фона, изображения, градиенты и управлять их размером и положением.",
    shortExplanation: "CSS-свойства фона: background-color — цвет, background-image — картинка, background-size — размер, background-position — позиция, background-repeat — повторение, background-attachment — прикрепление. Градиенты: linear-gradient — линейный, radial-gradient — радиальный. Это ОБОИ для элемента.",
    detailedExplanation: "Свойства фона:\n\nbackground-color: #3498db;\nbackground-image: url('bg.jpg');\n\nbackground-size:\n- cover — заполнить весь элемент (может обрезать)\n- contain — вписать целиком (может быть пустое пространство)\n- 100% auto — растянуть по ширине\n\nbackground-position: center top;\nbackground-repeat: no-repeat;\nbackground-attachment: fixed; /* Фон неподвижен при скролле */\n\nСокращение:\nbackground: #3498db url('bg.jpg') center/cover no-repeat;\n\nГрадиенты (это background-image!):\n\nlinear-gradient(angle, color1, color2):\nbackground: linear-gradient(135deg, #667eea, #764ba2);\n\nradial-gradient(circle, color1, color2):\nbackground: radial-gradient(circle, #667eea, #764ba2);\n\nМножественные фоны:\nbackground:\n  linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),\n  url('image.jpg') center/cover;\n\n/* Тёмный оверлей поверх картинки */\n\nГрадиенты как border:\nborder-image: linear-gradient(135deg, #667eea, #764ba2) 1;\n\nRepeating gradients:\nbackground: repeating-linear-gradient(\n  90deg,\n  #333 0px,\n  #333 1px,\n  transparent 1px,\n  transparent 20px\n);",
    mentalModel: "Фон — как обои для комнаты. background-color — цвет стен. background-image — фотообои. background-size — cover = растянуть на всю стену, contain = вписать целиком. Градиент — плавный переход цветов (от синего к фиолетовому).",
    examples: [
      {
        level: "minimal",
        code: ".hero {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: white;\n  padding: 4rem;\n  text-align: center;\n}\n\n.card {\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}",
        explanation: "Градиентный фон для hero и белый фон для карточек."
      },
      {
        level: "simple",
        code: "/* Фон-картинка с оверлеем */\n.hero {\n  background:\n    linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),\n    url('/images/hero.jpg') center/cover no-repeat;\n  min-height: 60vh;\n  display: grid;\n  place-items: center;\n  color: white;\n}\n\n/* Повторяющийся паттерн */\n.pattern {\n  background:\n    radial-gradient(circle, #ddd 1px, transparent 1px);\n  background-size: 20px 20px;\n}\n\n/* Кнопка с градиентом */\n.btn-gradient {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: white;\n  border: none;\n  padding: 0.75rem 1.5rem;\n  border-radius: 6px;\n  background-size: 200% 200%;\n  transition: background-position 0.3s;\n}\n\n.btn-gradient:hover {\n  background-position: right center;\n}",
        explanation: "Фон-картинка с оверлеем, паттерн, градиентная кнопка."
      },
      {
        level: "real",
        code: "/* Полноценный фон */\n.hero {\n  position: relative;\n  min-height: 80vh;\n  display: grid;\n  place-items: center;\n  overflow: hidden;\n}\n\n.hero::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(ellipse at 20% 50%, rgba(102,126,234,0.3), transparent 50%),\n    radial-gradient(ellipse at 80% 50%, rgba(118,75,162,0.3), transparent 50%),\n    linear-gradient(135deg, #0f0c29, #302b63, #24243e);\n}\n\n.hero-content {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  color: white;\n  padding: 2rem;\n}\n\n/* Сетка с фоном */\n.grid-bg {\n  background:\n    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);\n  background-size: 40px 40px;\n}\n\n/* Карточка с фоном */\n.card-gradient {\n  background:\n    linear-gradient(135deg, hsl(var(--card-hue) 80% 95%), hsl(var(--card-hue) 80% 90%));\n  border: 1px solid hsl(var(--card-hue) 80% 80%);\n  border-radius: 12px;\n  padding: 1.5rem;\n}\n\n/* Фиксированный фон */\n.parallax-section {\n  background: url('/images/bg.jpg') center/cover fixed;\n  min-height: 50vh;\n  display: grid;\n  place-items: center;\n}",
        explanation: "Продвинутые фоны: множественные градиенты, сетка, параллакс."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать background-size: cover без overflow: hidden",
        why: "Cover может выходить за границы элемента. Если есть border-radius — картинка «вылезает».",
        right: "Для скруглённых углов: border-radius + overflow: hidden."
      },
      {
        wrong: "Не использовать object-fit вместо background-image",
        why: "Для контентных изображений (<img>) используйте object-fit: cover. background-image — для декоративных.",
        right: "<img> + object-fit: cover — для контента. background-image — для декора и оверлеев."
      },
      {
        wrong: "Путать background-size: cover и contain",
        why: "cover — заполнит весь элемент (может обрезать). contain — впишет целиком (может быть пустое пространство).",
        right: "cover — «на всю стену». contain — «вписать целиком»."
      }
    ],
    importantToRemember: [
      "background: цвет, картинка, позиция, размер, повтор",
      "cover — заполнить, contain — вписать целиком",
      "linear-gradient() и radial-gradient() — градиенты",
      "Множественные фоны: оверлей поверх картинки",
      "Градиенты — это background-image!"
    ],
    connection: {
      back: "Вы знаете CSS-функции (C22) — фоны и градиенты завершают ваш набор инструментов CSS.",
      forward: "Это финальный урок CSS! Теперь вы умеете создавать и оформлять статические страницы: структура (HTML) + внешний вид (CSS). Следующий этап — JavaScript (JS Core): он добавит страницам поведение и интерактивность."
    }
  },
]
