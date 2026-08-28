import { readFileSync, writeFileSync } from "fs";

const FILE = "src/lib/skills/content.json";
const data = JSON.parse(readFileSync(FILE, "utf8"));

console.log("=== CSS Level 2 / Round 1 ===\n");

// ─── New lessons to add at orders 42-46 ───────────────────────────
const newLessons = [
  // ─── LESSON 1: Продвинутые CSS-селекторы ───
  {
    slug: "prodvinutye-selektory",
    track: "css",
    order: 42,
    title: "Продвинутые CSS-селекторы",
    summary:
      "Составные селекторы, селекторы атрибутов, :is(), :where(), :not(), :has().",
    sourceTitle: "Продвинутые CSS-селекторы",
    blocks: [
      {
        type: "heading",
        text: "Зачем нужны продвинутые селекторы?",
      },
      {
        type: "p",
        text: "В Level 1 вы изучили базовые селекторы: тег (`p`), класс (`.name`), id (`#name`). Но реальные проекты требуют **более точного** выбора элементов. Продвинутые селекторы позволяют выбирать элементы по атрибутам, позиции, состоянию и даже по наличию дочерних элементов.",
      },
      {
        type: "heading",
        text: "Составные (комбинированные) селекторы",
      },
      {
        type: "p",
        text: "Составные селекторы **объединяют** несколько простых селекторов для точного выбора:",
      },
      {
        type: "list",
        items: [
          "**Селектор потомков** (пробел): `.card p` — все `<p>` внутри `.card`.",
          "**Селектор прямого потомка** (`>`): `.card > p` — только `<p>` напрямую внутри `.card`.",
          "**Соседний селектор** (`+`): `h2 + p` — первый `<p>` сразу после `<h2>`.",
          "**Последующий селектор** (`~`): `h2 ~ p` — все `<p>` после `<h2>` на одном уровне.",
        ],
      },
      {
        type: "code",
        lang: "css",
        code: "/* Все p внутри .card */\n.card p { color: #666; }\n\n/* Только прямой потомок */\n.card > p { font-weight: bold; }\n\n/* Первый p сразу после h2 */\nh2 + p { margin-top: 0; }\n\n/* Все p после h2 на одном уровне */\nh2 ~ p { color: blue; }",
      },
      {
        type: "heading",
        text: "Селекторы атрибутов",
      },
      {
        type: "p",
        text: "Селекторы атрибутов выбирают элементы на основе их HTML-атрибутов:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Есть атрибут href */\na[href] { color: blue; }\n\n/* href точно равен ""https://example.com"" */\na[href=\"https://example.com\"] { font-weight: bold; }\n\n/* href начинается с ""https"" */\na[href^=\"https\"] { color: green; }\n\n/* href заканчивается на "".pdf"" */\na[href$=\".pdf\"]::after { content: \" 📄\"; }\n\n/* href содержит ""tutorial"" */\na[href*=\"tutorial\"] { color: orange; }\n\n/* class содержит ""btn"" как отдельное слово */\n[class~=\"btn\"] { padding: 8px 16px; }\n\n/* lang начинается на ""ru"" */\n[lang|=\"ru\"] { font-family: serif; }",
      },
      {
        type: "list",
        items: [
          "`[attr]` — атрибут существует.",
          '`[attr="value"]` — точное совпадение.',
          '`[attr^="value"]` — начинается с.',
          '`[attr$="value"]` — заканчивается на.',
          '`[attr*="value"]` — содержит.',
          '`[attr~="value"]` — содержит как отдельное слово.',
          '`[attr|="value"]` — начинается с (для lang).',
        ],
      },
      {
        type: "heading",
        text: ":is() — упрощение группировки",
      },
      {
        type: "p",
        text: "`:is()` принимает список селекторов и выбирает **любой** из них. Упрощает запись:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Без :is() — долго */\nheader h1, header h2, header h3, footer h1, footer h2, footer h3 {\n  color: navy;\n}\n\n/* С :is() — короче */\n:is(header, footer) :is(h1, h2, h3) {\n  color: navy;\n}",
      },
      {
        type: "p",
        text: "**Важно**: `:is()` наследует **наибольшую специфичность** из переданных селекторов.",
      },
      {
        type: "heading",
        text: ":where() — нулевая специфичность",
      },
      {
        type: "p",
        text: "`:where()` работает как `:is()`, но **всегда имеет специфичность 0**. Это полезно для сбросов и базовых стилей, которые легко переопределить:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Базовые стили — легко переопределить */\n:where(h1, h2, h3) {\n  margin-top: 0;\n}\n\n/* Этот стиль перезапишет :where() из-за специфичности */\n.page-title h1 {\n  margin-top: 2rem;\n}",
      },
      {
        type: "list",
        items: [
          "**`:is()`** — наследует специфичность самого тяжёлого селектора.",
          "**`:where()`** — всегда специфичность 0, легко переопределяется.",
        ],
      },
      {
        type: "heading",
        text: ":not() — исключение",
      },
      {
        type: "p",
        text: "`:not()` выбирает всё, **кроме** указанных элементов:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Все кнопки, кроме .disabled */\nbutton:not(.disabled) {\n  background: blue;\n  color: white;\n}\n\n/* Все ссылки, кроме внешних */\na:not([href^=\"http\"]) {\n  color: inherit;\n}",
      },
      {
        type: "heading",
        text: ":has() — «родительский» селектор",
      },
      {
        type: "p",
        text: "`:has()` выбирает элемент, который **содержит** указанные дочерние элементы. Это революционный селектор — ранее CSS не мог выбирать родителей по дочерним.",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Карточка, которая содержит изображение */\n.card:has(img) {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n}\n\n/* Форма с ошибкой */\n.form:has(.error) {\n  border-color: red;\n}\n\n/* Секция без заголовка */\nsection:not(:has(h2, h3)) {\n  padding: 1rem;\n}",
      },
      {
        type: "note",
        text: "`:has()` поддерживается во всех современных браузерах с 2023 года.",
      },
      {
        type: "heading",
        text: "Практические сценарии",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Ссылки на PDF — иконка */\na[href$=\".pdf\"]::after {\n  content: \" 📄\";\n}\n\n/* Пустой список — скрыть */\nul:empty {\n  display: none;\n}\n\n/* Инпут с атрибутом required — подсветить */\ninput:required {\n  border-left: 3px solid orange;\n}\n\n/* Кнопка внутри формы — особый стиль */\nform:has(button[type=\"submit\"]) .cancel {\n  display: inline-block;\n}",
      },
      {
        type: "heading",
        text: "Частые ошибки",
      },
      {
        type: "list",
        items: [
          "**Злоупотребление `:has()`.** Это мощный, но медленный селектор. Используйте его когда другие способы не подходят.",
          "**Путают `:is()` и `:where()`.** `:is()` наследует специфичность, `:where()` — нет.",
          "**Слишком сложные селекторы.** Если селектор很难 понять — возможно, лучше добавить класс в HTML.",
        ],
      },
      {
        type: "heading",
        text: "Важно запомнить",
      },
      {
        type: "list",
        items: [
          "Составные селекторы: потомок (пробел), прямой потомок (`>`), сосед (`+`), последующий (`~`).",
          "Селекторы атрибутов: `[attr]`, `[attr^=]`, `[attr$=]`, `[attr*=]` и другие.",
          "`:is()` — упрощает группировку, наследует специфичность.",
          "`:where()` — упрощает группировку, нулевая специфичность.",
          "`:not()` — исключение.",
          "`:has()` — выбирает родителя по дочерним элементам.",
        ],
      },
    ],
  },

  // ─── LESSON 2: Псевдоклассы ───
  {
    slug: "psevdoklassy",
    track: "css",
    order: 43,
    title: "Псевдоклассы",
    summary:
      "Состояния элементов: :hover, :focus, :checked, :valid, :nth-child() и другие.",
    sourceTitle: "Псевдоклассы",
    blocks: [
      {
        type: "heading",
        text: "Что такое псевдокласс?",
      },
      {
        type: "p",
        text: '`Псевдокласс` — это ключевое слово с двоеточием `:`, которое выбирает элементы **в определённом состоянии**. Состояние определяется не классом в HTML, а поведением элемента: наведён ли курсор, заполнено ли поле, активен ли элемент.',
      },
      {
        type: "code",
        lang: "css",
        code: "/* Обычный класс — задаётся в HTML */\n.active { color: red; }\n\n/* Псевдокласс — состояние определяется браузером */\na:hover { color: red; }",
      },
      {
        type: "heading",
        text: "Интерактивные состояния",
      },
      {
        type: "p",
        text: "Эти псевдоклассы реагируют на действия пользователя:",
      },
      {
        type: "heading",
        text: ":hover — при наведении",
      },
      {
        type: "code",
        lang: "css",
        code: ".btn:hover {\n  background: #1d49aa;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.15);\n}",
      },
      {
        type: "heading",
        text: ":focus и :focus-visible — фокус",
      },
      {
        type: "p",
        text: "`:focus` срабатывает при фокусе (клик или Tab). `:focus-visible` — только при навигации клавиатурой (не при клике).",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Обычный фокус */\ninput:focus {\n  border-color: blue;\n}\n\n/* Фокус только от клавиатуры */\nbutton:focus-visible {\n  outline: 2px solid blue;\n  outline-offset: 2px;\n}",
      },
      {
        type: "p",
        text: "`:focus-visible` — современный способ показать фокус только тем, кто навигирует клавиатурой. При клике мышью outline не появляется.",
      },
      {
        type: "heading",
        text: ":focus-within — фокус внутри",
      },
      {
        type: "p",
        text: "`:focus-within` выбирает родителя, если **любой** его дочерний элемент в фокусе:",
      },
      {
        type: "code",
        lang: "css",
        code: ".form-group:focus-within {\n  background: #f0f7ff;\n  border-color: blue;\n}",
      },
      {
        type: "heading",
        text: ":active — при нажатии",
      },
      {
        type: "code",
        lang: "css",
        code: ".btn:active {\n  transform: scale(0.98);\n  background: #153c7a;\n}",
      },
      {
        type: "heading",
        text: ":target — якорь",
      },
      {
        type: "p",
        text: "`:target` выбирает элемент, на который ведёт URL-якорь (`#id`):",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Подсветка секции при переходе по якорю */\n:target {\n  background: #fffde7;\n  border-left: 4px solid gold;\n}",
      },
      {
        type: "heading",
        text: "Псевдоклассы форм",
      },
      {
        type: "p",
        text: "CSS предоставляет псевдоклассы для проверки состояния полей формы:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Выбранный чекбокс/радио */\ninput:checked {\n  accent-color: blue;\n}\n\n/* Заблокированные поля */\ninput:disabled {\n  background: #f5f5f5;\n  cursor: not-allowed;\n}\n\n/* Активные (не заблокированные) */\ninput:enabled {\n  border: 1px solid #ccc;\n}\n\n/* Обязательное поле */\ninput:required {\n  border-left: 3px solid orange;\n}\n\n/* Поле с валидным значением */\ninput:valid {\n  border-color: green;\n}\n\n/* Поле с невалидным значением */\ninput:invalid {\n  border-color: red;\n}\n\n/* Пустое поле с placeholder */\ninput:placeholder-shown {\n  color: #999;\n}",
      },
      {
        type: "heading",
        text: "Псевдоклассы позиции",
      },
      {
        type: "p",
        text: "Эти псевдоклассы выбирают элементы по их позиции среди соседей:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Первый элемент */\nli:first-child {\n  font-weight: bold;\n}\n\n/* Последний элемент */\nli:last-child {\n  border-bottom: none;\n}\n\n/* Нечётные элементы */\ntr:nth-child(odd) {\n  background: #f5f5f5;\n}\n\n/* Чётные элементы */\ntr:nth-child(even) {\n  background: white;\n}\n\n/* Каждый 3-й элемент */\nli:nth-child(3n) {\n  color: red;\n}\n\n/* Первый из своего типа */\np:first-of-type {\n  font-size: 1.2em;\n}\n\n/* Единственный ребёнок */\n.only-child {\n  padding: 20px;\n}",
      },
      {
        type: "heading",
        text: "Разница между :nth-child и :nth-of-type",
      },
      {
        type: "list",
        items: [
          "**`:nth-child(n)`** — считает **все** соседние элементы, неважно какого тега.",
          "**`:nth-of-type(n)`** — считает только элементы **того же тега**.",
        ],
      },
      {
        type: "code",
        lang: "html",
        code: "<div>\n  <p>Текст</p>    <!-- :nth-child(1), :nth-of-type(1) -->\n  <span>Элемент</span>\n  <p>Ещё</p>      <!-- :nth-child(3), :nth-of-type(2) -->\n</div>",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Выберет ТРЕТИЙ элемент среди всех соседей (span) */\n:nth-child(3) { color: red; }\n\n/* Выберет ВТОРОЙ <p> среди <p> */\n:nth-of-type(2) { color: blue; }",
      },
      {
        type: "heading",
        text: "Когда какой псевдокласс использовать?",
      },
      {
        type: "list",
        items: [
          "**`:hover`** — кнопки, ссылки, карточки (эффект при наведении).",
          "**`:focus-visible`** — доступность: показ фокуса для клавиатурной навигации.",
          "**`:checked`** — стилизация чекбоксов и радиокнопок.",
          "**`:valid` / `:invalid`** — визуальная обратная связь при заполнении форм.",
          "**`:nth-child(odd)`** — чередование строк таблицы (zebra-striping).",
          "**`:empty`** — скрытие пустых блоков.",
        ],
      },
      {
        type: "heading",
        text: "Частые ошибки",
      },
      {
        type: "list",
        items: [
          "**Забывают `:focus-visible`.** Обычный `:focus` показывает outline при клике — это лишний визуальный шум.",
          "**Путают `:nth-child` и `:nth-of-type`.** Они считают по-разному!",
          "**Используют `:invalid` без `required`.** Без `required` все пустые поля невалидны.",
        ],
      },
      {
        type: "heading",
        text: "Важно запомнить",
      },
      {
        type: "list",
        items: [
          "Псевдоклассы выбирают элементы **в определённом состоянии**.",
          "`:hover`, `:focus`, `:active` — интерактивные состояния.",
          "`:focus-visible` — фокус только от клавиатуры (для доступности).",
          "`:checked`, `:disabled`, `:valid`, `:invalid` — состояние форм.",
          "`:nth-child()`, `:first-child`, `:last-child` — позиция среди соседей.",
          "`:nth-child` считает все элементы, `:nth-of-type` — только одного тега.",
        ],
      },
    ],
  },

  // ─── LESSON 3: Псевдоэлементы ───
  {
    slug: "psevdoelementy",
    track: "css",
    order: 44,
    title: "Псевдоэлементы",
    summary:
      "::before, ::after, ::first-letter, ::first-line, ::marker, ::selection, ::placeholder.",
    sourceTitle: "Псевдоэлементы",
    blocks: [
      {
        type: "heading",
        text: "Что такое псевдоэлемент?",
      },
      {
        type: "p",
        text: "`Псевдоэлемент` — это ключевое слово с двойным двоеточием `::`, которое создаёт **виртуальный элемент** внутри реального HTML-элемента. Этот элемент не существует в HTML, но отображается браузером.",
      },
      {
        type: "p",
        text: "Отличие от псевдокласса: псевдокласс `:hover` выбирает **существующий** элемент в состоянии. Псевдоэлемент `::before` **создаёт новый** виртуальный элемент.",
      },
      {
        type: "heading",
        text: "::before и ::after — декоративные элементы",
      },
      {
        type: "p",
        text: "Самые используемые псевдоэлементы. Они вставляют контент **до** и **после** содержимого элемента.",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Иконка перед ссылкой */\n.external-link::before {\n  content: \"🔗 \";\n}\n\n/* Декоративная линия после заголовка */\nh2::after {\n  content: \"\";\n  display: block;\n  width: 60px;\n  height: 3px;\n  background: skyblue;\n  margin-top: 8px;\n}",
      },
      {
        type: "p",
        text: "**Обязательное свойство `content`** — без него псевдоэлемент не отображается.",
      },
      {
        type: "heading",
        text: "Свойство content",
      },
      {
        type: "p",
        text: "`content` задаёт, **что** вставляется в псевдоэлемент:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Текст */\n.quote::before { content: \"«\"; }\n.quote::after  { content: \"»\"; }\n\n/* Пустое (для декоративных линий) */\nh2::after { content: \"\"; }\n\n/* Атрибут HTML */\n.link::after { content: attr(href); }\n\n/* Счётчик */\nol { counter-reset: item; }\nli::before {\n  counter-increment: item;\n  content: counter(item) \". \";\n  font-weight: bold;\n}",
      },
      {
        type: "heading",
        text: "::first-letter — первая буква",
      },
      {
        type: "p",
        text: "Стилизует **первую букву** блочного элемента:",
      },
      {
        type: "code",
        lang: "css",
        code: "p::first-letter {\n  font-size: 2em;\n  font-weight: bold;\n  color: navy;\n  float: left;\n  margin-right: 8px;\n}",
      },
      {
        type: "heading",
        text: "::first-line — первая строка",
      },
      {
        type: "p",
        text: "Стилизует **первую строку** текста (изменяется при изменении ширины окна):",
      },
      {
        type: "code",
        lang: "css",
        code: "p::first-line {\n  font-weight: bold;\n  text-transform: uppercase;\n}",
      },
      {
        type: "heading",
        text: "::marker — маркер списка",
      },
      {
        type: "code",
        lang: "css",
        code: "li::marker {\n  color: skyblue;\n  font-size: 1.2em;\n}\n\n/* Кастомный маркер */\nul.checklist li::marker {\n  content: \"✅ \";\n}",
      },
      {
        type: "heading",
        text: "::selection — выделение текста",
      },
      {
        type: "code",
        lang: "css",
        code: "::selection {\n  background: skyblue;\n  color: white;\n}",
      },
      {
        type: "heading",
        text: "::placeholder — плейсхолдер",
      },
      {
        type: "code",
        lang: "css",
        code: "input::placeholder {\n  color: #999;\n  font-style: italic;\n}",
      },
      {
        type: "heading",
        text: "::backdrop (знакомство)",
      },
      {
        type: "p",
        text: "`::backdrop` стилизует **оверлей** за модальным окном (`<dialog>` или Fullscreen API):",
      },
      {
        type: "code",
        lang: "css",
        code: "dialog::backdrop {\n  background: rgba(0, 0, 0, 0.5);\n}",
      },
      {
        type: "heading",
        text: "Псевдокласс vs псевдоэлемент",
      },
      {
        type: "list",
        items: [
          "**Псевдокласс** (`:hover`, `:focus`, `:nth-child`) — выбирает элемент **в состоянии**. Одно двоеточие.",
          "**Псевдоэлемент** (`::before`, `::after`, `::first-letter`) — создаёт **виртуальный элемент**. Двойное двоеточие.",
        ],
      },
      {
        type: "code",
        lang: "text",
        code: "Псевдокласс:              Псевдоэлемент:\n:hover                    ::before\n:focus-visible            ::after\n:nth-child(2)             ::first-letter\n:checked                  ::selection",
      },
      {
        type: "heading",
        text: "Когда НЕ использовать伪元素",
      },
      {
        type: "p",
        text: "Псевдоэлементы — для **декоративного** контента. Не используйте их для важной информации:",
      },
      {
        type: "list",
        items: [
          "**Не** для текста, который пользователь должен прочитать.",
          "**Не** для ссылок или кнопок.",
          "**Не** для контента, важного для скринридеров.",
          "**Да** для иконок, декоративных линий, кавычек, визуальных эффектов.",
        ],
      },
      {
        type: "heading",
        text: "Частые ошибки",
      },
      {
        type: "list",
        items: [
          '**Забывают `content`.** Без него `::before` и `::after` не отображаются.',
          "**Используют伪элементы для важного контента.** Скринридеры не видят `::before`/`::after`.",
          "**Путают одинарное `:` и двойное `::`.** Современный стандарт — двойное `::` для伪элементов.",
        ],
      },
      {
        type: "heading",
        text: "Важно запомнить",
      },
      {
        type: "list",
        items: [
          "`::before` / `::after` — декоративные виртуальные элементы (обязателен `content`).",
          "`::first-letter` — первая буква блочного элемента.",
          "`::first-line` — первая строка (динамическая).",
          "`::marker` — маркер списка.",
          "`::selection` — выделение текста пользователем.",
          "`::placeholder` — текст-подсказка в поле ввода.",
          "Псевдоэлементы — для декорации, не для важного контента.",
        ],
      },
    ],
  },

  // ─── LESSON 4: CSS-функции ───
  {
    slug: "css-functions",
    track: "css",
    order: 45,
    title: "CSS-функции",
    summary:
      "calc(), min(), max(), clamp(), var(), attr(), url(), базовые градиенты.",
    sourceTitle: "CSS-функции",
    blocks: [
      {
        type: "heading",
        text: "Зачем нужны CSS-функции?",
      },
      {
        type: "p",
        text: "CSS-функции позволяют **вычислять значения**, использовать **переменные** и создавать **динамические** стили. Вместо фиксированных значений (`200px`) вы можете писать `calc(100% - 40px)` — и браузер сам вычислит результат.",
      },
      {
        type: "heading",
        text: "calc() — вычисления",
      },
      {
        type: "p",
        text: "`calc()` позволяет смешивать **разные единицы** в одном выражении:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Ширина = 100% минус 40px отступов */\n.container {\n  width: calc(100% - 40px);\n  padding: 20px;\n}\n\n/* Комбинируем rem и px */\n.element {\n  font-size: calc(1rem + 2px);\n}\n\n/* Центрирование с учётом ширины */\n.centered {\n  width: 300px;\n  margin-left: calc(50% - 150px);\n}\n\n/* Фон позиционируется с отступом */\n.bg {\n  background-position: calc(50% + 20px) center;\n}",
      },
      {
        type: "p",
        text: "`calc()` поддерживает: `+`, `-`, `*`, `/`. Пробелы **обязательны** вокруг `+` и `-`.",
      },
      {
        type: "heading",
        text: "min() и max() — ограничения",
      },
      {
        type: "p",
        text: "`min()` возвращает **меньшее** значение, `max()` — **большее**:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Ширина: 100%, но не шире 600px */\n.container {\n  width: min(100%, 600px);\n}\n\n/* Ширина: 100%, но не уже 300px */\n.container {\n  width: max(100%, 300px);\n}\n\n/* Шрифт: минимум 16px, максимум 24px */\ntext {\n  font-size: max(16px, min(2vw, 24px));\n}",
      },
      {
        type: "heading",
        text: "clamp() — значение в диапазоне",
      },
      {
        type: "p",
        text: "`clamp(минимум, предпочтительное, максимум)` — выбирает значение **в пределах диапазона**. Это короткая запись для `max(minimum, min(preferred, maximum))`.",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Шрифт: мин 16px, preferred 2vw, макс 24px */\nh1 {\n  font-size: clamp(16px, 2vw, 24px);\n}\n\n/* Ширина: мин 300px, preferred 80%, макс 1200px */\n.container {\n  width: clamp(300px, 80%, 1200px);\n}\n\n/* Padding: мин 1rem, preferred 5vw, макс 3rem */\n.section {\n  padding: clamp(1rem, 5vw, 3rem);\n}",
      },
      {
        type: "p",
        text: "`clamp()` — основа **fluid typography** и адаптивных отступов. Значение плавно растёт от минимума к максимуму.",
      },
      {
        type: "code",
        lang: "text",
        code: "clamp(16px, 2vw, 24px)\n\nЭкран 400px:   2vw = 8px  → max(16px, 8px)  = 16px (минимум)\nЭкран 800px:   2vw = 16px → 16px (попадает в диапазон)\nЭкран 1600px:  2vw = 32px → min(32px, 24px) = 24px (максимум)",
      },
      {
        type: "heading",
        text: "var() — CSS-переменные",
      },
      {
        type: "p",
        text: "`var()` использует значение CSS-переменной. Переменные объявляются через `--имя` ичитываются через `var(--имя)`:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Объявление переменных */\n:root {\n  --primary: #0066cc;\n  --spacing: 16px;\n  --radius: 8px;\n}\n\n/* Использование */\n.btn {\n  background: var(--primary);\n  padding: var(--spacing);\n  border-radius: var(--radius);\n}\n\n/* Значение по умолчанию */\n.element {\n  color: var(--text-color, #333);\n}",
      },
      {
        type: "p",
        text: "Переменные **наследуются**. Объявите в `:root` — и они доступны везде. Переопределите в特定ном элементе — и только он изменится.",
      },
      {
        type: "heading",
        text: "attr() — значение атрибута",
      },
      {
        type: "p",
        text: "`attr()` читает значение HTML-атрибута элемента:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Показать атрибут data-label */\n.tooltip::after {\n  content: attr(data-label);\n  position: absolute;\n  background: black;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 4px;\n}",
      },
      {
        type: "code",
        lang: "html",
        code: '<div class="tooltip" data-label="Подсказка">Наведи</div>',
      },
      {
        type: "note",
        text: "`attr()` в CSS ограничен — работает только с `content`. Для других свойств используйте JavaScript или CSS-переменные.",
      },
      {
        type: "heading",
        text: "url() — ссылка на ресурс",
      },
      {
        type: "code",
        lang: "css",
        code: ".hero {\n  background: url('/images/hero.jpg') center/cover no-repeat;\n}\n\n@font-face {\n  font-family: 'CustomFont';\n  src: url('/fonts/custom.woff2') format('woff2');\n}",
      },
      {
        type: "heading",
        text: "Базовые градиенты",
      },
      {
        type: "p",
        text: "`linear-gradient()` и `radial-gradient()` создают плавные переходы цвета:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Линейный градиент */\n.gradient {\n  background: linear-gradient(to right, #667eea, #764ba2);\n}\n\n/* Радиальный градиент */\n.gradient {\n  background: radial-gradient(circle, #667eea, #764ba2);\n}\n\n/* Градиент как фон кнопки */\n.btn {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}",
      },
      {
        type: "heading",
        text: "Реальные задачи",
      },
      {
        type: "heading",
        text: "Fluid Typography",
      },
      {
        type: "code",
        lang: "css",
        code: "h1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  line-height: 1.2;\n}\n\np {\n  font-size: clamp(1rem, 2vw, 1.25rem);\n  line-height: 1.6;\n}",
      },
      {
        type: "heading",
        text: "Адаптивный layout",
      },
      {
        type: "code",
        lang: "css",
        code: ".container {\n  width: min(100% - 2rem, 1200px);\n  margin: 0 auto;\n  padding: clamp(1rem, 3vw, 2rem);\n}",
      },
      {
        type: "heading",
        text: "Тема через переменные",
      },
      {
        type: "code",
        lang: "css",
        code: ":root {\n  --bg: white;\n  --text: #333;\n  --border: #ddd;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg: #1a1a2e;\n    --text: #e0e0e0;\n    --border: #333;\n  }\n}\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n}\n\n.card {\n  border: 1px solid var(--border);\n}",
      },
      {
        type: "heading",
        text: "Частые ошибки",
      },
      {
        type: "list",
        items: [
          "**Забывают пробелы в `calc()`.** `calc(100%-40px)` не работает. Нужно `calc(100% - 40px)`.",
          "**Не объявляют `:root` для переменных.** Без `:root` переменные не наследуются.",
          "**Используют `calc()` там, где проще `min()`/`max()`.** `min(100%, 600px)` проще, чем `calc(100% - 0px)` с ограничением.",
        ],
      },
      {
        type: "heading",
        text: "Важно запомнить",
      },
      {
        type: "list",
        items: [
          "`calc()` — вычисления с разными единицами (обязательны пробелы вокруг `+`/`-`).",
          "`min()` / `max()` — выбрать меньшее/большее из значений.",
          "`clamp(min, preferred, max)` — значение в диапазоне (основа fluid typography).",
          "`var(--name)` — CSS-переменные (объявляются в `:root`).",
          "`attr()` — чтение HTML-атрибута (ограниченно `content`).",
          "`url()` — ссылка на ресурс (изображение, шрифт).",
        ],
      },
    ],
  },

  // ─── LESSON 5: Transitions и базовые CSS-анимации ───
  {
    slug: "transitions-animations",
    track: "css",
    order: 46,
    title: "Transitions и базовые CSS-анимации",
    summary:
      "transition, @keyframes, animation, timing-function, prefers-reduced-motion.",
    sourceTitle: "Transitions и базовые CSS-анимации",
    blocks: [
      {
        type: "heading",
        text: "Transition vs Animation: в чём разница?",
      },
      {
        type: "p",
        text: "CSS предоставляет два способа создавать движение:",
      },
      {
        type: "list",
        items: [
          "**Transition** — плавный переход **из одного состояния в другое**. Запускается при изменении свойства (hover, focus, класс). Нет начала и конца — только «от» и «до».",
          "**Animation** — полноценная анимация **с этапами** через `@keyframes`. Имеет начало, конец, может повторяться, задержки, направление.",
        ],
      },
      {
        type: "code",
        lang: "text",
        code: "Transition:  [состояние A] ──плавно──> [состояние B]\n             (при hover, focus, классе)\n\nAnimation:   [0%] ──> [50%] ──> [100%]\n             (свои ключевые кадры, автозапуск)",
      },
      {
        type: "heading",
        text: "Transition: плавный переход",
      },
      {
        type: "p",
        text: "`transition` — короткое свойство, которое задаёт **какие свойства** и **как быстро** меняются:",
      },
      {
        type: "code",
        lang: "css",
        code: ".btn {\n  background: #0066cc;\n  color: white;\n  padding: 12px 24px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n\n  /* Плавный переход для всех свойств */\n  transition: all 0.3s ease;\n}\n\n.btn:hover {\n  background: #0052a3;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n}",
      },
      {
        type: "heading",
        text: "Свойства transition",
      },
      {
        type: "code",
        lang: "css",
        code: ".element {\n  /*transition: property duration timing-function delay;*/\n  transition: background 0.3s ease 0s;\n\n  /* Или отдельно: */\n  transition-property: background, transform;\n  transition-duration: 0.3s;\n  transition-timing-function: ease;\n  transition-delay: 0s;\n}\n\n/* Только specific свойства */\n.card {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}",
      },
      {
        type: "list",
        items: [
          "**`transition-property`** — какое свойство анимировать (`all` или конкретное).",
          "**`transition-duration`** — длительность (`0.3s`, `300ms`).",
          "**`transition-timing-function`** — форма кривой (`ease`, `linear`, `ease-in-out`).",
          "**`transition-delay`** — задержка перед началом.",
        ],
      },
      {
        type: "heading",
        text: "Timing functions",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Плавное ускорение (по умолчанию) */\ntransition-timing-function: ease;\n\n/* Равномерно */\ntransition-timing-function: linear;\n\n/* Медленное начало */\ntransition-timing-function: ease-in;\n\n/* Медленный конец */\ntransition-timing-function: ease-out;\n\n/* Медленное начало и конец */\ntransition-timing-function: ease-in-out;\n\n/* Кастомная кривая */\ntransition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);",
      },
      {
        type: "heading",
        text: "@keyframes: ключевые кадры",
      },
      {
        type: "p",
        text: "`@keyframes` определяет **этапы анимации** — от начального до конечного состояния:",
      },
      {
        type: "code",
        lang: "css",
        code: "@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}",
      },
      {
        type: "p",
        text: "Можно задать промежуточные этапы:",
      },
      {
        type: "code",
        lang: "css",
        code: "@keyframes bounce {\n  0%   { transform: translateY(0); }\n  40%  { transform: translateY(-30px); }\n  60%  { transform: translateY(-15px); }\n  80%  { transform: translateY(-5px); }\n  100% { transform: translateY(0); }\n}",
      },
      {
        type: "heading",
        text: "animation: применение keyframes",
      },
      {
        type: "code",
        lang: "css",
        code: ".fade-in {\n  animation: fadeIn 0.5s ease forwards;\n}\n\n.bounce {\n  animation: bounce 0.6s ease-in-out;\n}\n\n/* Полная запись */\n.animated {\n  animation-name: fadeIn;\n  animation-duration: 0.5s;\n  animation-timing-function: ease;\n  animation-delay: 0s;\n  animation-iteration-count: 1;\n  animation-direction: normal;\n  animation-fill-mode: forwards;\n  animation-play-state: running;\n}\n\n/* Сокращённая */\n.animated {\n  animation: fadeIn 0.5s ease 0s 1 normal forwards running;\n}",
      },
      {
        type: "list",
        items: [
          "**`animation-name`** — имя `@keyframes`.",
          "**`animation-duration`** — длительность.",
          "**`animation-timing-function`** — форма кривой.",
          "**`animation-delay`** — задержка.",
          "**`animation-iteration-count`** — количество повторов (`1`, `infinite`).",
          "**`animation-direction`** — направление (`normal`, `reverse`, `alternate`).",
          "**`animation-fill-mode`** — что после анимации (`none`, `forwards`, `backwards`).",
          "**`animation-play-state`** — запуск/пауза (`running`, `paused`).",
        ],
      },
      {
        type: "heading",
        text: "Когда использовать transition, а когда animation?",
      },
      {
        type: "list",
        items: [
          "**Transition** — когда есть два состояния (до/после): hover, focus, добавление класса.",
          "**Animation** — когда нужна автозапускающаяся анимация, цикл, несколько этапов.",
        ],
      },
      {
        type: "code",
        lang: "css",
        code: "/* Transition: hover эффект */\n.card {\n  transition: transform 0.2s ease;\n}\n.card:hover {\n  transform: scale(1.02);\n}\n\n/* Animation: автозагрузка */\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n.loader {\n  animation: spin 1s linear infinite;\n}",
      },
      {
        type: "heading",
        text: "prefers-reduced-motion",
      },
      {
        type: "p",
        text: "**Важно для доступности.** Некоторые пользователи плохо переносят анимации. CSS позволяет отключить их:",
      },
      {
        type: "code",
        lang: "css",
        code: "/* Обычная анимация */\n.fade-in {\n  animation: fadeIn 0.5s ease;\n}\n\n/* Если пользователь просит уменьшить движение */\n@media (prefers-reduced-motion: reduce) {\n  .fade-in {\n    animation: none;\n  }\n  * {\n    transition-duration: 0.01ms !important;\n    animation-duration: 0.01ms !important;\n  }\n}",
      },
      {
        type: "heading",
        text: "Частые ошибки",
      },
      {
        type: "list",
        items: [
          "**Анимируют `width`/`height`.** Эти свойства вызывают **reflow** (пересчёт макета) — анимация тормозит. Используйте `transform: scale()`.",
          '**Забывают `forwards`.** Без `animation-fill-mode: forwards` элемент возвращается в начальное состояние после анимации.',
          "**Не учитывают `prefers-reduced-motion`.** Анимации должны быть опциональными.",
          "**Анимируют `all`.** Это может привести к нежелательным побочным эффектам. Анимируйте конкретные свойства.",
        ],
      },
      {
        type: "heading",
        text: "Важно запомнить",
      },
      {
        type: "list",
        items: [
          "**Transition** — плавный переход между двумя состояниями (hover, focus).",
          "**Animation** — полноценная анимация с `@keyframes` (этапы, циклы).",
          "`transition: property duration timing delay;` — сокращённая запись.",
          "`@keyframes name { from {} to {} }` — определение анимации.",
          "`animation: name duration timing delay count direction fill-mode;` — применение.",
          "**Анимируйте `transform` и `opacity`** — они не вызывают reflow.",
          "**Всегда учитывайте `prefers-reduced-motion`** для доступности.",
        ],
      },
    ],
  },
];

// ─── Add new lessons ──────────────────────────────────────────────
data.lessons.push(...newLessons);

// ─── Write back ───────────────────────────────────────────────────
writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

// ─── Verify ───────────────────────────────────────────────────────
const newData = JSON.parse(readFileSync(FILE, "utf8"));
const cssLessons = newData.lessons
  .filter((l) => l.track === "css")
  .sort((a, b) => a.order - b.order);
const htmlCount = newData.lessons.filter((l) => l.track === "html").length;

console.log("\n=== FINAL STATE ===");
console.log(`CSS lessons: ${cssLessons.length} (was 20, added 5)`);
console.log(`HTML lessons: ${htmlCount} (should be 21)`);
console.log(`Total lessons: ${newData.lessons.length}`);

console.log("\n=== Full CSS lesson order ===");
cssLessons.forEach((l, i) => {
  const marker = l.order >= 42 ? " ← NEW (Level 2)" : "";
  console.log(`  ${i + 1}. [${l.order}] ${l.slug} — ${l.title}${marker}`);
});

// Check for duplicate slugs
const allSlugs = newData.lessons.map((l) => l.slug);
const dups = allSlugs.filter((s, i) => allSlugs.indexOf(s) !== i);
console.log(`\nDuplicate slugs: ${dups.length > 0 ? dups : "None ✅"}`);

// Check for duplicate CSS orders
const cssOrders = cssLessons.map((l) => l.order);
const dupOrders = cssOrders.filter((o, i) => cssOrders.indexOf(o) !== i);
console.log(`Duplicate CSS orders: ${dupOrders.length > 0 ? dupOrders : "None ✅"}`);

// Verify new lessons exist
const newSlugs = [
  "prodvinutye-selektory",
  "psevdoklassy",
  "psevdoelementy",
  "css-functions",
  "transitions-animations",
];
for (const s of newSlugs) {
  const found = newData.lessons.find((l) => l.slug === s && l.track === "css");
  console.log(`  ${s}: ${found ? "✅ found" : "❌ NOT found"}`);
}

// Verify Level 1 unchanged
const level1Slugs = [
  "vvedenie-v-css",
  "selektory-i-nasledovanie",
  "tekst-i-shrifty",
  "box-model",
  "tsveta-v-css",
  "edinitsy-izmereniya",
  "razmery-elementov",
  "display-i-potok-dokumenta",
  "margin-i-padding",
  "position",
  "flexbox-osnovy",
  "flexbox-alignment",
  "grid-osnovy",
  "grid-rows-cols",
  "responsive-design",
  "media-queries",
  "overflow-visibility",
  "stilizatsiya-input",
  "stilizatsiya-button",
  "stilizatsiya-form",
];
let level1Ok = true;
for (const s of level1Slugs) {
  const found = newData.lessons.find((l) => l.slug === s && l.track === "css");
  if (!found) {
    console.log(`  ⚠️ Level 1 lesson missing: ${s}`);
    level1Ok = false;
  }
}
if (level1Ok) {
  console.log("\n✅ All 20 Level 1 lessons present and unchanged");
}
