// DOM Basics Lessons — D1-D7, D18
// Following Knowledge Map v3 and Stage 3 Lesson Blueprint

export const domBasicsLessons = [
  // ============================================
  // D1 — Browser Environment
  // ============================================
  {
    slug: "browser-environment",
    track: "dom-basics",
    order: 1,
    title: "Браузерное окружение",
    summary: "Понять разницу между языком JavaScript (ECMAScript) и API браузера (DOM, fetch, localStorage), и какие объекты доступны в браузере.",
    level: "Beginner",
    prerequisites: ["intro-to-js"],
    learningObjective: "После этого урока вы сможете объяснить разницу между языком JavaScript и браузерными API, а также назвать основные объекты браузера: window, document, navigator.",
    shortExplanation: "JavaScript — это язык. Браузер — это среда, в которой язык работает. В браузере доступны объекты, которых нет в самом JavaScript: window, document, navigator, fetch. Это не часть языка — это API, предоставляемые браузером.",
    detailedExplanation: "Важно понимать разницу:\n\nJavaScript (ECMAScript) — это язык программирования. Он определяет:\n- Переменные (let, const)\n- Типы данных (number, string, boolean, object)\n- Функции, условия, циклы\n- Массивы, объекты, классы\n\nЭти вещи работают ОДИНАКОВО везде: в браузере, в Node.js, в React Native.\n\nBrowser APIs — это дополнения браузера:\n- window — глобальный объект, окно браузера\n- document — доступ к HTML-странице (DOM)\n- navigator — информация о браузере\n- fetch — загрузка данных по сети\n- localStorage — хранение данных\n- setTimeout — таймеры\n\nЭти вещи РАБОТАЮТ ТОЛЬКО в браузере. В Node.js их нет.\n\nГлобальный объект window:\n- В браузере всё «сверху» принадлежит window\n- document === window.document\n- console === window.console\n- let x = 5; → window.x = 5 (для var)\n\nСпецификации:\n- ECMAScript (TC39) — стандарт языка JavaScript\n- DOM (WHATWG/W3C) — стандарт для работы со страницей\n- HTML (WHATWG) — стандарт разметки",
    mentalModel: "JavaScript — как английский язык. Браузер — как Англия. В Англии доступны дополнительные слова (сленг, местные выражения), которых нет в учебнике английского. document, window, fetch — это «местные слова» браузера.",
    examples: [
      {
        level: "minimal",
        code: "// JavaScript (работает везде):\nconst name = 'Анна';\nconsole.log(typeof name); // 'string'\n\n// Browser API (только в браузере):\nconsole.log(window.location.href); // URL страницы\nconsole.log(navigator.userAgent); // Информация о браузере",
        explanation: "typeof и console — это JavaScript. window.location и navigator — это Browser API."
      },
      {
        level: "simple",
        code: "// window — глобальный объект\nconsole.log(window === globalThis); // true\n\n// document — доступ к странице\nconsole.log(document.title); // Заголовок страницы\nconsole.log(document.URL);   // URL страницы\n\n// navigator — информация о браузере\nconsole.log(navigator.language); // 'ru-RU'",
        explanation: "window, document, navigator — три основных объекта браузерного окружения."
      },
      {
        level: "real",
        code: "// Проверка: работает ли в браузере или в Node.js\nif (typeof window !== 'undefined') {\n  console.log('Мы в браузере!');\n  console.log('URL:', window.location.href);\n} else {\n  console.log('Мы в Node.js');\n}\n\n// Проверка поддержки API\nif ('fetch' in window) {\n  console.log('fetch доступен');\n} else {\n  console.log('fetch не поддерживается');\n}",
        explanation: "Полезные проверки для кода, который может работать в разных средах."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что DOM — часть JavaScript",
        why: "DOM — это API браузера, не часть ECMAScript. В Node.js нет document.querySelector().",
        right: "JavaScript — язык. DOM — API браузера для работы со страницей."
      },
      {
        wrong: "Считать window.document и document разными вещами",
        why: "document — это сокращение для window.document. Они указывают на один объект.",
        right: "document === window.document. Используйте document (короче)."
      },
      {
        wrong: "Использовать var без осознания window",
        why: "var объявляет переменную в window: var x = 5 → window.x = 5. let/const — нет.",
        right: "Используйте let/const. var создаёт свойство на window — этого лучше избегать."
      }
    ],
    importantToRemember: [
      "JavaScript — язык (ECMAScript). DOM — API браузера.",
      "window — глобальный объект браузера",
      "document — доступ к HTML-странице",
      "navigator — информация о браузере",
      "Browser API работают только в браузере, не в Node.js"
    ],
    sources: [
      { title: "MDN: введение в DOM", url: "https://developer.mozilla.org/ru/docs/Web/API/Document_Object_Model/Introduction" }
    ],
    connection: {
      back: "Вы знаете JavaScript Core (J0-J26) — теперь вы узнаёте, что добавляет поверх браузер.",
      forward: "Следующий урок (D2) объясняет, как HTML превращается в DOM-дерево, с которым может работать JavaScript."
    }
  },

  // ============================================
  // D2 — DOM Tree
  // ============================================
  {
    slug: "dom-tree",
    track: "dom-basics",
    order: 2,
    title: "DOM-дерево",
    summary: "Понять, как браузер превращает HTML-код в дерево узлов (DOM tree), и чем DOM отличается от исходного HTML.",
    level: "Beginner",
    prerequisites: ["browser-environment"],
    learningObjective: "После этого урока вы сможете объяснить, как HTML превращается в DOM-дерево, различать типы узлов и понимать отношения родитель/ребёнок/сосед.",
    shortExplanation: "Браузер читает HTML и создаёт дерево объектов — DOM-дерево. Каждый HTML-тег становится элементом (Element). Текст внутри тега — текстовый узел (Text). Комментарии — узел комментария (Comment). Все они связаны: родитель → ребёнок → сосед.",
    detailedExplanation: "Что такое DOM?\n\nDOM (Document Object Model) — это дерево объектов, которое браузер создаёт из HTML-кода. JavaScript работает именно с этим деревом, а не с исходным текстом HTML.\n\nКак HTML превращается в DOM:\n\n1. Браузер скачивает HTML-файл (текст)\n2. Парсер читает теги и создаёт объекты\n3. Каждый тег → Element (элемент)\n4. Текст внутри тега → Text (текстовый узел)\n5. Комментарии → Comment\n6. Все объекты связываются в дерево\n\nПример:\nHTML: <div><p>Привет</p></div>\n\nDOM:\n  document\n    └─ html\n        ├─ head\n        └─ body\n            └─ div\n                └─ p\n                    └─ Text: \"Привет\"\n\nТипы узлов:\n- Element (<div>, <p>, <span>)\n- Text (текст внутри тегов)\n- Document (корень дерева — document)\n- Comment (<!-- комментарий -->)\n\nСвязи:\n- parent → child (div → p)\n- sibling (два элемента с одним родителем)\n- ancestor → descendant (html → p)\n\nВажно: DOM ≠ HTML!\n- HTML — это исходный текст\n- DOM — это дерево объектов в памяти браузера\n- JavaScript изменяет DOM, а не HTML-файл\n- При обновлении страницы DOM пересоздаётся из HTML",
    mentalModel: "DOM-дерево — как генеалогическое древо семьи. document — прадед. html — дед. body — отец. div — дети. p — внуки. Текст — домочадцы внутри дома. Каждый знает своего родителя и детей.",
    examples: [
      {
        level: "minimal",
        code: "// HTML:\n// <div id=\"app\">\n//   <p>Привет</p>\n//   <p>Мир</p>\n// </div>\n\nconst app = document.getElementById('app');\nconsole.log(app.children); // HTMLCollection [p, p]\nconsole.log(app.children[0].textContent); // 'Привет'",
        explanation: "DOM-дерево доступно через JavaScript. children — прямые потомки."
      },
      {
        level: "simple",
        code: "// Посмотрите на DOM-дерево через DevTools:\n// Откройте F12 → вкладка Elements\n// Вы увидите дерево тегов\n\n// В JavaScript:\nconst body = document.body;\nconsole.log(body.childNodes); // NodeList (включает текстовые узлы!)\nconsole.log(body.children);   // HTMLCollection (только элементы!)",
        explanation: "childNodes включает текстовые узлы (пробелы, переносы). children — только элементы."
      },
      {
        level: "real",
        code: "// Разница между DOM и исходным HTML:\n// Исходный HTML:\n// <div id=\"app\">  <p>Привет</p>  </div>\n\n// Браузер может «починить» невалидный HTML:\n// <p>Привет<p>Мир → браузер закроет тег: <p>Привет</p><p>Мир</p>\n\nconst div = document.getElementById('app');\nconsole.log(div.innerHTML); // Строка HTML\nconsole.log(div.outerHTML); // '<div id=\"app\">...'",
        explanation: "innerHTML — это текущее состояние DOM, а не исходный HTML."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что DOM = HTML",
        why: "HTML — текстовый файл. DOM — дерево объектов в памяти. JavaScript работает с DOM.",
        right: "HTML → парсер → DOM. JavaScript изменяет DOM, а не HTML-файл."
      },
      {
        wrong: "Путать childNodes и children",
        why: "childNodes включает текстовые узлы (пробелы!). children — только элементы.",
        right: "Для элементов используйте children. childNodes — только если нужны текстовые узлы."
      },
      {
        wrong: "Думать, что DOM обновляется мгновенно",
        why: "Изменения DOM вызывают reflow/repaint — это может быть медленным.",
        right: "Пакетные обновления быстрее, чем по одному элементу."
      }
    ],
    importantToRemember: [
      "DOM — дерево объектов, созданное из HTML",
      "Element, Text, Comment, Document — типы узлов",
      "parent/child/sibling — связи между узлами",
      "childNodes включает текстовые узлы, children — только элементы",
      "JavaScript изменяет DOM, а не исходный HTML"
    ],
    connection: {
      back: "Вы знаете браузерное окружение (D1) — теперь вы понимаете, чем на самом деле является document.",
      forward: "Следующий урок (D3) учит перемещаться по дереву: искать элементы по селекторам и проходить по связям между узлами."
    }
  },

  // ============================================
  // D3 — DOM Navigation
  // ============================================
  {
    slug: "dom-navigation",
    track: "dom-basics",
    order: 3,
    title: "Навигация по DOM",
    summary: "Научиться находить элементы через querySelector, getElementById, а также перемещаться по дереву: parent, children, siblings.",
    level: "Beginner",
    prerequisites: ["dom-tree"],
    learningObjective: "После этого урока вы сможете находить элементы через querySelector/querySelectorAll/getElementById и перемещаться по DOM-дереву через свойства родителя, детей и соседей.",
    shortExplanation: "querySelector находит первый элемент по CSS-селектору. querySelectorAll — все подходящие. getElementById — по id. После нахождения элемента можно перемещаться: parentElement, children, nextElementSibling, previousElementSibling.",
    detailedExplanation: "Три основных способа найти элемент:\n\n1. document.querySelector(selector) — ПЕРВЫЙ элемент:\n   document.querySelector('p') — первый <p>\n   document.querySelector('.card') — первый элемент с классом card\n   document.querySelector('#app') — элемент с id app\n\n2. document.querySelectorAll(selector) — ВСЕ элементы:\n   document.querySelectorAll('p') — NodeList всех <p>\n   Возвращает NodeList (не массив!)\n\n3. document.getElementById(id) — по id:\n   document.getElementById('app') — быстрее querySelector\n\nНавигация по дереву:\n\nВверх:\n  element.parentElement — родитель (только Element)\n  element.parentNode — родитель (любой узел)\n\nВниз:\n  element.children — прямые потомки (только Element)\n  element.firstElementChild — первый потомок\n  element.lastElementChild — последний потомок\n\nПо горизонтали:\n  element.nextElementSibling — следующий сосед\n  element.previousElementSibling — предыдущий сосед\n\nВажно:\n- querySelector возвращает null, если не найден\n- querySelectorAll возвращает NodeList (не массив!)\n- getElementById возвращает null, если не найден\n- children — только Element, childNodes — все узлы",
    mentalModel: "Навигация по DOM — как навигация по карте. querySelector — это «найти адрес по названию». parentElement — «пойти к родителю». children — «посмотреть, кто живёт в доме».",
    examples: [
      {
        level: "minimal",
        code: "// Найти элемент:\nconst title = document.querySelector('h1');\nconsole.log(title.textContent); // Текст заголовка\n\n// Найти по id:\nconst app = document.getElementById('app');\nconsole.log(app);",
        explanation: "querySelector и getElementById — основные способы найти элемент."
      },
      {
        level: "simple",
        code: "// Найти все элементы:\nconst paragraphs = document.querySelectorAll('p');\nconsole.log(paragraphs.length); // Количество <p>\n\n// Перебрать:\nparagraphs.forEach(p => console.log(p.textContent));\n\n// Навигация:\nconst first = paragraphs[0];\nconsole.log(first.parentElement); // Родитель (div)\nconsole.log(first.nextElementSibling); // Следующий <p>",
        explanation: "querySelectorAll + forEach — удобный способ работать с коллекцией элементов."
      },
      {
        level: "real",
        code: "// Реальный пример: найти элемент и получить его контекст\nconst activeItem = document.querySelector('.menu-item.active');\n\nif (activeItem) {\n  const menu = activeItem.parentElement;\n  const items = menu.children;\n  const index = Array.from(items).indexOf(activeItem);\n\n  console.log(`Активный пункт ${index + 1} из ${items.length}`);\n  console.log(`Родитель: ${menu.className}`);\n}",
        explanation: "Комбинация навигации: нашли элемент → нашли родителя → посчитали siblings."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что querySelectorAll возвращает массив",
        why: "NodeList — не массив. Нет map, filter, reduce (хотя есть forEach).",
        right: "Для методов массивов: Array.from(nodeList) или [...nodeList]."
      },
      {
        wrong: "Забывать, что querySelector возвращает null",
        why: "querySelector возвращает null, если элемент не найден. Обращение к свойству null вызовет ошибку.",
        right: "Всегда проверяйте: if (title) { title.textContent = 'Новый'; }"
      },
      {
        wrong: "Путать parentElement и parentNode",
        why: "parentElement — только Element. parentNode — любой узел (включая Text, Comment).",
        right: "Используйте parentElement — он возвращает только Element."
      },
      {
        wrong: "Путать children и childNodes",
        why: "children — только Element. childNodes — все узлы (включая текстовые).",
        right: "Для элементов используйте children."
      }
    ],
    importantToRemember: [
      "querySelector(selector) — первый элемент по CSS-селектору",
      "querySelectorAll(selector) — все элементы (NodeList)",
      "getElementById(id) — по id (быстрее)",
      "parentElement — родитель",
      "children — прямые потомки (только Element)",
      "nextElementSibling / previousElementSibling — соседи"
    ],
    connection: {
      back: "Вы понимаете структуру DOM-дерева (D2) — теперь вы умеете по нему перемещаться.",
      forward: "Следующий урок (D4) — чтение и запись содержимого элемента: textContent, innerHTML и их различия."
    }
  },

  // ============================================
  // D4 — Node Properties
  // ============================================
  {
    slug: "node-properties",
    track: "dom-basics",
    order: 4,
    title: "Свойства узлов",
    summary: "Научиться читать и изменять содержимое элементов: textContent, innerHTML, outerHTML, и понимать разницу между ними.",
    level: "Beginner",
    prerequisites: ["dom-navigation"],
    learningObjective: "После этого урока вы сможете читать и изменять содержимое элементов через textContent и innerHTML и объяснять, почему с innerHTML нужно быть осторожным.",
    shortExplanation: "textContent возвращает/задаёт текст элемента (без HTML). innerHTML возвращает/задаёт HTML-содержимое (включая теги). textContent безопаснее и быстрее. innerHTML опасен при недоверенном вводе (XSS).",
    detailedExplanation: "Содержимое элемента:\n\n1. textContent — ТОЛЬКО текст:\n   element.textContent = 'Привет';\n   // Установит текст, все вложенные теги будут удалены!\n\n   element.textContent // Прочитает весь текст (включая вложенные)\n   // <p>Привет, <b>мир</b></p> → 'Привет, мир'\n\n2. innerHTML — HTML-содержимое:\n   element.innerHTML = '<b>Привет</b>'; // Вставит HTML\n\n   element.innerHTML // Прочитает HTML: '<b>Привет</b>'\n\n3. outerHTML — весь элемент целиком:\n   element.outerHTML // '<div id=\"app\"><b>Привет</b></div>'\n\n4. innerText — видимый текст (учитывает CSS):\n   element.innerText // Текст, видимый на странице\n   // Отличается от textContent: учитывает display:none\n\nРазница между textContent и innerHTML:\n\ntextContent:\n- Быстрее (не парсит HTML)\n- Безопаснее (не выполняет скрипты)\n- Возвращает/устанавливает простой текст\n\ninnerHTML:\n- Медленнее (парсит HTML)\n- ОПАСЕН с недоверенным вводом!\n- Возвращает/устанавливает HTML-разметку\n\nXSS (Cross-Site Scripting):\nЕсли пользователь ввёл <script>alert('хак')</script>\nи вы вставили это через innerHTML — скрипт выполнится!\n\nПоэтому: для простого текста ВСЕГДА используйте textContent.",
    mentalModel: "textContent — как блокнот: вы пишете текст, он отображается как текст. innerHTML — как редактор HTML: вы пишете разметку, браузер её рендерит. Но редактор может выполнить опасный код!",
    examples: [
      {
        level: "minimal",
        code: "const p = document.querySelector('p');\n\n// Прочитать текст:\nconsole.log(p.textContent); // 'Привет, мир'\n\n// Изменить текст:\np.textContent = 'Новый текст';\nconsole.log(p.textContent); // 'Новый текст'",
        explanation: "textContent — самый простой способ прочитать или изменить текст."
      },
      {
        level: "simple",
        code: "const div = document.getElementById('content');\n\n// innerHTML — вставка HTML:\ndiv.innerHTML = '<h2>Заголовок</h2><p>Параграф</p>';\n\n// textContent — вставка текста:\ndiv.textContent = 'Просто текст'; // HTML-теги будут отображены как текст\nconsole.log(div.innerHTML); // 'Просто текст'",
        explanation: "innerHTML интерпретирует HTML-теги. textContent — нет, он просто текст."
      },
      {
        level: "real",
        code: "// ⚠️ XSS атака через innerHTML:\nconst userInput = '<img src=x onerror=alert(\"Хак!\")>';\n\ndangerousDiv.innerHTML = userInput; // ОПАСНО! Alert выполнится!\nsafeDiv.textContent = userInput;    // Безопасно! Покажет текст как есть\n\n// Правило: для пользовательского ввода — ВСЕГДА textContent",
        explanation: "innerHTML выполняет JavaScript-код в тегах. textContent — безопасен."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать innerHTML для простого текста",
        why: "innerHTML медленнее и опаснее. Для текста — textContent.",
        right: "textContent для текста, innerHTML только если нужно вставить HTML."
      },
      {
        wrong: "Думать, что textContent и innerText — одно и то же",
        why: "innerText учитывает CSS (display:none). textContent — нет.",
        right: "textContent быстрее. innerText — только если нужно учесть видимость."
      },
      {
        wrong: "Вставлять пользовательский ввод через innerHTML",
        why: "XSS: вредоносный HTML/JS выполнится на странице.",
        right: "Для пользовательского ввода — textContent или специальные библиотеки."
      },
      {
        wrong: "Забывать, что textContent удаляет все вложенные теги",
        why: "element.textContent = 'Текст' удалит все <b>, <i> и другие теги внутри.",
        right: "textContent заменяет ВСЁ содержимое текстом. Для сохранения тегов — innerHTML."
      }
    ],
    importantToRemember: [
      "textContent — текст (безопасно, быстро)",
      "innerHTML — HTML (опасно с пользовательским вводом!)",
      "outerHTML — весь элемент целиком",
      "Для простого текста — ВСЕГДА textContent",
      "innerHTML выполняет скрипты в тегах — XSS!"
    ],
    connection: {
      back: "Вы умеете находить элементы (D3) — теперь вы умеете читать и менять их содержимое.",
      forward: "Следующий урок (D5) объясняет ключевую разницу между HTML-атрибутами и DOM-свойствами."
    }
  },

  // ============================================
  // D5 — Attributes vs Properties
  // ============================================
  {
    slug: "attributes-vs-properties",
    track: "dom-basics",
    order: 5,
    title: "Атрибуты и свойства",
    summary: "Понять разницу между HTML-атрибутами (в исходном HTML) и DOM-свойствами (в объекте элемента), особенно для value, checked, disabled.",
    level: "Beginner",
    prerequisites: ["node-properties"],
    learningObjective: "После этого урока вы сможете объяснить разницу между HTML-атрибутами и DOM-свойствами и знать, когда что использовать.",
    shortExplanation: "HTML-атрибуты — в исходном коде: <input value=\"5\">. DOM-свойства — в объекте элемента: input.value. Они связаны, но НЕ идентичны. Атрибуты — начальные значения. Свойства — текущее состояние.",
    detailedExplanation: "Разница между атрибутами и свойствами:\n\nHTML Attribute (атрибут):\n- Написан в исходном HTML: <input type=\"text\" value=\"5\">\n- Доступен через: element.getAttribute('value')\n- Значение ВСЕГДА строка\n- Начальное значение\n\nDOM Property (свойство):\n- Свойство объекта элемента: element.value\n- Текущее значение (может изменяться)\n- Тип зависит от свойства (строка, число, boolean)\n\nПример:\n<input type=\"text\" value=\"5\">\n\ninput.getAttribute('value') // '5' (строка!)\ninput.value                 // 5 (может быть числом)\n\ninput.value = 10;\ninput.getAttribute('value') // всё ещё '5' (атрибут не изменился!)\ninput.value                 // 10 (свойство изменилось)\n\nКлючевые атрибуты/свойства:\n\n1. value:\n   - Атрибут: начальное значение\n   - Свойство: текущее значение\n\n2. checked:\n   - Атрибут: 'checked' или отсутствует\n   - Свойство: true/false\n\n3. disabled:\n   - Атрибут: 'disabled' или отсутствует\n   - Свойство: true/false\n\n4. class:\n   - Атрибут: class=\"btn primary\"\n   - Свойство: element.className = 'btn primary'\n   - Лучше: element.classList.add('btn')\n\n5. id:\n   - Атрибут: id=\"app\"\n   - Свойство: element.id = 'app'\n\nКогда что использовать:\n- getAttribute/setAttribute — для начальных значений\n- element.property — для текущего состояния\n- Для большинства свойств — используйте свойства (element.value)",
    mentalModel: "Атрибут — как описание в анкете (начальные данные). Свойство — как текущее состояние в базе данных (может меняться). Вы заполнили анкету «возраст: 25», но в базе уже «возраст: 26».",
    examples: [
      {
        level: "minimal",
        code: "// HTML: <input type=\"text\" value=\"5\" id=\"myInput\">\n\nconst input = document.getElementById('myInput');\n\n// Атрибут (начальное значение):\nconsole.log(input.getAttribute('value')); // '5'\n\n// Свойство (текущее значение):\nconsole.log(input.value); // '5'\n\n// Изменяем свойство:\ninput.value = '10';\nconsole.log(input.value);            // '10'\nconsole.log(input.getAttribute('value')); // всё ещё '5'!",
        explanation: "Атрибут не меняется при изменении свойства. Они независимы."
      },
      {
        level: "simple",
        code: "// HTML: <input type=\"checkbox\" checked>\n\nconst checkbox = document.querySelector('input[type=checkbox]');\n\n// Атрибут:\nconsole.log(checkbox.getAttribute('checked')); // '' (пустая строка)\n\n// Свойство:\nconsole.log(checkbox.checked); // true\n\n// Снимаем галочку:\ncheckbox.checked = false;\nconsole.log(checkbox.checked);            // false\nconsole.log(checkbox.getAttribute('checked')); // всё ещё ''!",
        explanation: "checked — boolean свойство. Атрибут — строка. Они работают по-разному."
      },
      {
        level: "real",
        code: "// Практический пример: валидация формы\nconst emailInput = document.querySelector('#email');\n\n// Проверяем текущее значение (свойство):\nif (emailInput.value.includes('@')) {\n  emailInput.classList.add('valid');\n} else {\n  emailInput.classList.add('invalid');\n}\n\n// Устанавливаем начальное значение (атрибут):\nemailInput.setAttribute('placeholder', 'user@example.com');\n\n// Проверяем обязательность (свойство):\nconsole.log(emailInput.required); // true",
        explanation: "Для работы с текущим состоянием — свойства. Для начальных значений — атрибуты."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать getAttribute и свойства",
        why: "getAttribute возвращает строку. Свойство может быть числом, boolean и т.д.",
        right: "getAttribute('value') → '5' (строка). element.value → 5 (может быть числом)."
      },
      {
        wrong: "Думать, что setAttribute меняет свойства",
        why: "setAttribute меняет атрибут. Свойства могут не обновиться.",
        right: "Для текущего состояния — изменяйте свойства напрямую: element.value = 'новое'."
      },
      {
        wrong: "Использовать class вместо classList",
        why: "element.className = 'btn primary' заменяет ВСЕ классы. classList.add — добавляет один.",
        right: "Используйте classList.add/remove/toggle для управления отдельными классами."
      }
    ],
    importantToRemember: [
      "Attribute — начальное значение в HTML. Property — текущее состояние.",
      "getAttribute всегда возвращает строку",
      "Свойства могут быть строками, числами, boolean",
      "Изменение свойства НЕ меняет атрибут",
      "Для текущего состояния — свойства"
    ],
    connection: {
      back: "Вы умеете читать содержимое (D4) — теперь вы понимаете более глубокое различие атрибутов и свойств.",
      forward: "Следующий урок (D6) — манипуляции с DOM: создание, добавление и удаление элементов."
    }
  },

  // ============================================
  // D6 — DOM Manipulation
  // ============================================
  {
    slug: "dom-manipulation",
    track: "dom-basics",
    order: 6,
    title: "Манипуляция DOM",
    summary: "Научиться создавать, добавлять, вставлять и удалять элементы: createElement, append, prepend, before, after, remove.",
    level: "Beginner",
    prerequisites: ["attributes-vs-properties"],
    learningObjective: "После этого урока вы сможете создавать новые элементы, добавлять их на страницу, вставлять до/после существующих элементов и удалять элементы.",
    shortExplanation: "document.createElement() создаёт новый элемент. append/prepend добавляют внутрь. before/after вставляют рядом. remove удаляет. Это основа динамических страниц.",
    detailedExplanation: "Создание элемента:\nconst div = document.createElement('div');\ndiv.textContent = 'Привет!';\n// Элемент создан, но ещё НЕ на странице!\n\nДобавление на страницу:\n\n1. parent.append(child) — в конец родителя:\n   document.body.append(div); // div добавится в конец body\n\n2. parent.prepend(child) — в начало родителя:\n   document.body.prepend(div); // div добавится в начало body\n\n3. element.before(newEl) — перед элементом:\n   existingEl.before(div); // div появится перед existingEl\n\n4. element.after(newEl) — после элемента:\n   existingEl.after(div); // div появится после existingEl\n\nУдаление:\n\nelement.remove(); // Удаляет элемент со страницы\n// Или:\nelement.parentElement.removeChild(element);\n\nЗамена:\n\nparent.replaceChild(newEl, oldEl);\n// Или:\noldEl.replaceWith(newEl);\n\nПеремещение:\n\nelement.append(otherElement); // Переместит otherElement в конец\n// Другие append/prepend/before/after тоже перемещают!\n// Если элемент уже в DOM — он переместится, не скопируется.",
    mentalModel: "DOM-манипуляция — как работа с Lego. createElement — берёте новую детальку. append/prepend — ставите внутрь коробки. before/after — ставите рядом. remove — убираете с конвейера.",
    examples: [
      {
        level: "minimal",
        code: "// Создать и добавить элемент:\nconst h2 = document.createElement('h2');\nh2.textContent = 'Заголовок';\ndocument.body.append(h2);",
        explanation: "createElement создаёт элемент. append добавляет на страницу."
      },
      {
        level: "simple",
        code: "// Создать список:\nconst ul = document.createElement('ul');\n\n['Яблоко', 'Банан', 'Вишня'].forEach(text => {\n  const li = document.createElement('li');\n  li.textContent = text;\n  ul.append(li);\n});\n\ndocument.body.append(ul);",
        explanation: "Цикл + createElement + append — стандартный паттерн создания списков."
      },
      {
        level: "real",
        code: "// Динамическая карточка товара:\nfunction createProductCard(product) {\n  const card = document.createElement('div');\n  card.className = 'product-card';\n  card.innerHTML = `\n    <h3>${product.name}</h3>\n    <p>Цена: ${product.price} руб.</p>\n    <button>Купить</button>\n  `;\n  return card;\n}\n\nconst container = document.querySelector('#products');\nconst products = [\n  { name: 'Телефон', price: 500 },\n  { name: 'Ноутбук', price: 1200 }\n];\n\nproducts.forEach(p => {\n  container.append(createProductCard(p));\n});",
        explanation: "Функция-фабрика + createElement + innerHTML + append — создание сложных компонентов."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что append копирует элемент",
        why: "append ПЕРЕМЕЩАЕТ элемент. Если он уже в DOM — будет перемещён.",
        right: "Для копии: element.cloneNode(true)"
      },
      {
        wrong: "Использовать appendChild вместо append",
        why: "appendChild — старый метод. append — современный, принимает строки и несколько элементов.",
        right: "Используйте append (современный API)."
      },
      {
        wrong: "Забывать, что createElement не добавляет на страницу",
        why: "createElement создаёт в памяти. Без append/prepend элемент не виден.",
        right: "createElement → append/prepend → элемент на странице."
      },
      {
        wrong: "Использовать innerHTML для добавления новых элементов",
        why: "innerHTML пересоздаёт ВСЕ дочерние элементы (теряются обработчики событий).",
        right: "Для добавления — createElement + append. innerHTML — только для начальной загрузки."
      }
    ],
    importantToRemember: [
      "createElement создаёт элемент (не на странице!)",
      "append — в конец, prepend — в начало",
      "before/after — рядом с элементом",
      "remove — удаляет элемент",
      "append перемещает, не копирует"
    ],
    connection: {
      back: "Вы знаете атрибуты и свойства (D5) — теперь вы можете создавать элементы и управлять ими.",
      forward: "Следующий урок (D7) — стили: как менять CSS-классы и инлайновые стили."
    }
  },

  // ============================================
  // D7 — Styles and Classes
  // ============================================
  {
    slug: "styles-and-classes",
    track: "dom-basics",
    order: 7,
    title: "Стили и классы",
    summary: "Научиться управлять внешним видом элементов через classList (добавление/удаление классов) и style (инлайновые стили), понимая, когда что использовать.",
    level: "Beginner",
    prerequisites: ["dom-manipulation"],
    learningObjective: "После этого урока вы сможете добавлять/удалять/переключать CSS-классы через classList, задавать инлайновые стили через свойство style и объяснять, когда какой подход предпочтителен.",
    shortExplanation: "classList управляет CSS-классами: add, remove, toggle. style задаёт инлайновые стили. Предпочтительнее управлять классами — стили остаются в CSS, а не в JavaScript.",
    detailedExplanation: "Два способа менять внешний вид:\n\n1. classList — управление CSS-классами:\n   element.classList.add('active')      — добавить класс\n   element.classList.remove('active')   — удалить класс\n   element.classList.toggle('active')   — переключить\n   element.classList.contains('active') — проверить\n\n   // Добавить несколько:\n   element.classList.add('btn', 'primary')\n\n2. style — инлайновые стили:\n   element.style.color = 'red';\n   element.style.fontSize = '20px';\n   element.style.backgroundColor = '#fff';\n\n   // Все стили сразу:\n   element.style.cssText = 'color: red; font-size: 20px;';\n\nПочему classList лучше:\n- Стили остаются в CSS (разделение ответственности)\n- Легче менять тему (поменять CSS, не JavaScript)\n- CSS-классы переиспользуемы\n- Инлайновые стили имеют высокую специфичность\n\ngetComputedStyle — чтение текущих стилей:\n   const styles = getComputedStyle(element);\n   console.log(styles.color);       // 'rgb(255, 0, 0)'\n   console.log(styles.fontSize);    // '16px'\n   // Возвращает вычисленные стили (с учётом наследования и CSS)\n\nСпецифичность:\n- Инлайновые стили побеждают CSS-классы\n- !important побеждает инлайновые\n- Избегайте !important — он усложняет поддержку",
    mentalModel: "classList — как набор наклеек на ноутбуке. Добавляете/снимаете наклейки, внешний вид меняется. style — как рисовать маркером прямо на ноутбуке. Эффект тот же, но менять сложнее.",
    examples: [
      {
        level: "minimal",
        code: "// Добавить/удалить класс:\nconst button = document.querySelector('button');\nbutton.classList.add('active');\nbutton.classList.remove('disabled');\nbutton.classList.toggle('dark');",
        explanation: "classList — управление классами. toggle переключает: есть — убирает, нет — добавляет."
      },
      {
        level: "simple",
        code: "// Инлайновые стили:\nconst box = document.querySelector('.box');\nbox.style.width = '200px';\nbox.style.height = '100px';\nbox.style.backgroundColor = '#f0f0f0';\nbox.style.border = '1px solid #ccc';\n\n// Прочитать вычисленный стиль:\nconst computed = getComputedStyle(box);\nconsole.log(computed.width); // '200px'",
        explanation: "style задаёт инлайновые стили. getComputedStyle читает текущее значение."
      },
      {
        level: "real",
        code: "// Переключатель темы:\nconst themeToggle = document.querySelector('#themeToggle');\n\nthemeToggle.addEventListener('click', () => {\n  document.body.classList.toggle('dark-theme');\n\n  const isDark = document.body.classList.contains('dark-theme');\n  localStorage.setItem('theme', isDark ? 'dark' : 'light');\n});\n\n// Загрузить тему при старте:\nconst savedTheme = localStorage.getItem('theme');\nif (savedTheme === 'dark') {\n  document.body.classList.add('dark-theme');\n}",
        explanation: "classList.toggle + localStorage — стандартный паттерн переключателя темы."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать style для всего",
        why: "Инлайновые стили тяжело поддерживать — их сложно менять, они не кэшируются.",
        right: "Для стилей — CSS-классы. Для динамических значений — style."
      },
      {
        wrong: "Путать className и classList",
        why: "className = 'btn primary' заменяет ВСЕ классы. classList.add — добавляет один.",
        right: "classList.add/remove/toggle — для управления отдельными классами."
      },
      {
        wrong: "Забывать camelCase для style",
        why: "element.style.background-color — SyntaxError! Нужно: element.style.backgroundColor.",
        right: "CSS-свойства в style используют camelCase: fontSize, backgroundColor."
      },
      {
        wrong: "Использовать !important в JavaScript",
        why: "element.style.setProperty('color', 'red', 'important') — плохая практика.",
        right: "Избегайте !important. Используйте более специфичные селекторы."
      }
    ],
    importantToRemember: [
      "classList.add/remove/toggle — управление классами",
      "style — инлайновые стили (для динамических значений)",
      "Предпочитайте классы инлайн-стилям",
      "getComputedStyle читает текущие вычисленные стили",
      "camelCase: backgroundColor, не background-color"
    ],
    connection: {
      back: "Вы умеете создавать элементы и управлять ими (D6) — теперь вы знаете, как менять их внешний вид.",
      forward: "Следующий урок (D8) — загрузка документа: когда и как безопасно запускать JavaScript."
    }
  },

  // ============================================
  // D8 — Document Loading
  // ============================================
  {
    slug: "document-loading",
    track: "dom-basics",
    order: 8,
    title: "Загрузка документа",
    summary: "Понять, когда HTML-код готов для JavaScript: разбор HTML, defer, type=\"module\", DOMContentLoaded, и почему порядок загрузки имеет значение.",
    level: "Beginner",
    prerequisites: ["browser-environment"],
    learningObjective: "После этого урока вы сможете объяснить порядок разбора HTML, правильно использовать defer и type=\"module\" и знать, когда срабатывает DOMContentLoaded.",
    shortExplanation: "Браузер загружает HTML сверху вниз. <script> блокирует парсинг. defer загружает скрипт параллельно и выполняет после HTML. type=\"module\" загружает как модуль (defer по умолчанию). DOMContentLoaded — событие, когда DOM готов.",
    detailedExplanation: "Как браузер загружает страницу:\n\n1. Скачивает HTML (текст)\n2. Парсит сверху вниз\n3. Встречает <script> — ОСТАНАВЛИВАЕТ парсинг\n4. Скачивает и выполняет скрипт\n5. Продолжает парсинг\n6. Когда весь HTML распарсен → DOMContentLoaded\n7. Когда все ресурсы загружены → load\n\nПроблема:\n<script src=\"app.js\"></script>\n// Парсинг HTML остановился! Если app.js большой — пользователь ждёт.\n\nРешения:\n\n1. defer (атрибут):\n   <script src=\"app.js\" defer></script>\n   - Скачивает скрипт параллельно с HTML\n   - Выполняет ПОСЛЕ полного парсинга HTML\n   - Порядок сохраняется (первый скрипт → первый)\n\n2. async:\n   <script src=\"app.js\" async></script>\n   - Скачивает параллельно\n   - Выполняет КОГДА готов (порядок НЕ гарантирован)\n\n3. type=\"module\":\n   <script type=\"module\" src=\"app.js\"></script>\n   -.defer по умолчанию\n   - Изолированная область видимости\n   - Поддерживает import/export\n\n4. Скрипт в конце body:\n   <body>\n     <!-- контент -->\n     <script src=\"app.js\"></script>\n   </body>\n\nСобытия загрузки:\n\n1. DOMContentLoaded:\n   - Fired когда DOM распарсен (без ожидания CSS, картинок)\n   - Скрипт с defer выполняется до этого события\n\n2. load:\n   - Fired когда ВСЁ загружено (CSS, картинки, шрифты)\n\nПрактические правила:\n- Используйте type=\"module\" — modern approach\n- Или defer — для не-модульных скриптов\n- НЕ используйте async без понимания порядка\n- Не скрипт в head без defer/async — блокирует рендер",
    mentalModel: "Загрузка страницы — как чтение книги. Читаете сверху вниз. Встретили скрипт (приписку) — остановились, прочитали приписку, продолжили. defer — приписка читается после всей книги. async — приписка читается когда будет hazır, порядок не гарантирован.",
    examples: [
      {
        level: "minimal",
        code: "// В HTML:\n// <script type=\"module\" src=\"app.js\"></script>\n\n// app.js — выполняется когда DOM готов:\nconst title = document.querySelector('h1');\nconsole.log(title.textContent); // Работает!",
        explanation: "type=\"module\" гарантирует, что DOM готов к работе."
      },
      {
        level: "simple",
        code: "// Сравнение подходов:\n\n// ❌ Плохо: блокирует парсинг\n// <script src=\"app.js\"></script>\n\n// ✅ Хорошо: defer\n// <script src=\"app.js\" defer></script>\n\n// ✅ Хорошо: module\n// <script type=\"module\" src=\"app.js\"></script>\n\n// ✅ Хорошо: в конце body\n// <body>\n//   <!-- контент -->\n//   <script src=\"app.js\"></script>\n// </body>",
        explanation: "Четыре способа избежать блокировки парсинга."
      },
      {
        level: "real",
        code: "// DOMContentLoaded — когда DOM готов:\ndocument.addEventListener('DOMContentLoaded', () => {\n  // DOM распарсен, можно безопасно искать элементы\n  const app = document.querySelector('#app');\n  console.log('DOM готов!', app);\n});\n\n// load — когда ВСЁ загружено:\nwindow.addEventListener('load', () => {\n  // CSS, картинки, шрифты — всё загружено\n  console.log('Полная загрузка!');\n});",
        explanation: "DOMContentLoaded — для работы с DOM. load — для ожидания всех ресурсов."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что DOMContentLoaded = load",
        why: "DOMContentLoaded — DOM готов. load — ВСЁ загружено (CSS, картинки).",
        right: "DOMContentLoaded — раньше. load — позже."
      },
      {
        wrong: "Использовать defer и async одновременно",
        why: "async игнорируется, если есть defer. Не используйте оба.",
        right: "Выберите один: defer ИЛИ async. Лучше — type=\"module\"."
      },
      {
        wrong: "Думать, что скрипт без атрибутов безопасен",
        why: "<script src=\"app.js\"></script> блокирует парсинг HTML.",
        right: "Всегда используйте defer, async или type=\"module\"."
      },
      {
        wrong: "Говорить «нужно всегда оборачивать в DOMContentLoaded»",
        why: "type=\"module\" и defer уже гарантируют, что DOM готов. DOMContentLoaded не нужен.",
        right: "Для module/defer — DOMContentLoaded не нужен. Для обычных скриптов — может понадобиться."
      }
    ],
    importantToRemember: [
      "<script> блокирует парсинг HTML",
      "defer — выполняет после парсинга (порядок сохраняется)",
      "type=\"module\" — defer по умолчанию + модули",
      "DOMContentLoaded — DOM готов (не ждёт CSS/картинки)",
      "load — ВСЁ загружено"
    ],
    connection: {
      back: "Вы умеете стилизовать элементы (D7) — теперь вы понимаете, когда безопасно запускать JavaScript.",
      forward: "Вы завершили DOM Basics (D1-D8)! Дальше — JS Intermediate: области видимости, замыкания, классы и прототипы."
    }
  }
] as const;
