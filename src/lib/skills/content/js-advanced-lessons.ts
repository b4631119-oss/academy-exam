// JavaScript Advanced Lessons — JV1 through JV26
// OPTIONAL track — not part of the required beginner/intermediate path

export const jsAdvancedLessons = [
  // ============================================
  // JV1 — Strict Mode
  // ============================================
  {
    slug: "strict-mode",
    track: "js-advanced",
    order: 1,
    title: 'Строгий режим "use strict"',
    summary: "Понять, что делает strict mode, какие ошибки он предотвращает, и почему в modern modules он уже включён по умолчанию.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["code-style"],
    learningObjective: "После этого урока вы сможете объяснить, что делает строгий режим (strict mode), перечислить ошибки, которые он предотвращает, и понять, когда явный 'use strict' всё ещё нужен.",
    shortExplanation: '"use strict" включает строгий режим JavaScript. Он запрещает опасные конструкции: необъявленные переменные, дублирование параметров, удаление свойств. В ES modules strict mode включён автоматически — отдельная директива нужна только в legacy script.',
    detailedExplanation: '"use strict" — директива, которая включает более строгий разбор и выполнение кода.\n\nЧто запрещает:\n1. Использование переменной до объявления\n2. Дублирование имён параметров\n3. Удаление переменной, функции или аргумента (delete obj.var)\n4. Запрещённые синтаксисы (octal literals: 0123)\n5. Запись в read-only свойства\n\nГде включается:\n- В модулях (type="module") — ВСЕГДА автоматически\n- В функциях: "use strict" в начале тела функции\n- В скриптах: "use strict" в начале файла\n\nГде НЕ нужен:\n- ES modules (уже strict)\n- modern bundler code (обычно уже strict)\n\nПочему modules strict:\nES modules (import/export) работают в strict mode по спецификации. Это сделано для предсказуемости и безопасности.\n\nПример legacy контекста:\n// Старый script (не module)\n"use strict";\nvar x = 1;\ndelete x; // SyntaxError в strict mode\n\n// Модуль — strict по умолчанию\nexport const y = 2;\ndelete y; // SyntaxError без явной директивы',
    mentalModel: "Strict mode — как шериф в маленьком городке. Обычный JavaScript — город без правил (можно писать опасный код). Strict mode — шериф, который говорит: «Нет, так нельзя. Объяви переменную правильно. Не удаляй то, что нельзя.» Модули — город, где шериф работает всегда.",
    examples: [
      {
        level: "minimal",
        code: '// Без strict mode\nmyVar = 10; // создаёт глобальную переменную\nconsole.log(myVar); // 10\n\n// С strict mode\n"use strict";\n// myVar = 10; // ReferenceError: myVar is not defined',
        explanation: "Strict mode запрещает необъявленные переменные."
      },
      {
        level: "simple",
        code: '// Дублирование параметров\nfunction sum(a, a, b) {\n  return a + a + b;\n}\n// Без strict: работает (первый a перезаписывается)\n// С strict: SyntaxError\n\nfunction sumStrict(a, a, b) {\n  "use strict";\n  return a + a + b;\n}\n// SyntaxError: Duplicate parameter name',
        explanation: "Strict mode ловит ошибки, которые были бы молча проигнорированы."
      },
      {
        level: "real",
        code: '// Modern ES module — strict по умолчанию\n// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// main.js\nimport { add } from "./math.js";\n\n// Без объявления переменной:\n// result = add(1, 2); // ReferenceError\n// Нужно:\nconst result = add(1, 2);',
        explanation: "В модулях strict mode работает автоматически — директива не нужна."
      }
    ],
    commonMistakes: [
      {
        wrong: 'Добавлять "use strict" в каждый файл модуля',
        why: "ES modules уже работают в strict mode. Дублирование — лишний код.",
        right: "В модулях (import/export) директива не нужна. Только в legacy script."
      },
      {
        wrong: "Думать, что strict mode замедляет код",
        why: "Strict mode не влияет на производительность. Он только запрещает опасные конструкции.",
        right: "Strict mode = безопасность, не производительность."
      },
      {
        wrong: "Путать strict mode с TypeScript strict mode",
        why: "JavaScript strict mode и TypeScript strict (транспилирование) — разные вещи.",
        right: 'JS "use strict" — runtime проверки. TS strict — compile-time проверки.'
      }
    ],
    importantToRemember: [
      'use strict запрещает опасные конструкции',
      "ES modules работают в strict mode автоматически",
      "Strict mode нужен только в legacy script",
      "Запрещает необъявленные переменные, дублирование параметров",
      "Не влияет на производительность"
    ],
    realWorldUsage: "В modern JavaScript (modules, bundlers) strict mode включён автоматически. Явная директива нужна редко — только при работе со старыми скриптами без модулей.",
    connection: {
      back: "Вы знаете JavaScript Core (J0–J26). Строгий режим — это глобальное изменение поведения, которое влияет на то, как выполняется код.",
      forward: "Следующий урок (JV2) — именованные функциональные выражения — конкретный синтаксис функций."
    }
  },

  // ============================================
  // JV2 — Named Function Expressions (NFE)
  // ============================================
  {
    slug: "named-function-expressions",
    track: "js-advanced",
    order: 2,
    title: "Именованные функциональные выражения (NFE)",
    summary: "Понять разницу между function expression и named function expression, и зачем имя внутри функции полезно для рекурсии и stack traces.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Rare",
    prerequisites: ["functions", "arrow-functions"],
    learningObjective: "После этого урока вы сможете отличать именованные функциональные выражения от анонимных и объяснять, когда NFE полезны.",
    shortExplanation: "Named function expression — это функция, которая имеет имя внутри себя. Это имя доступно только внутри функции. Полезно для рекурсии, отладки (stack traces) и самоссылки. Но в большинстве случаев достаточно обычных функций или arrow functions.",
    detailedExplanation: "Function expression vs Named function expression:\n\n// Function expression (anonymous)\nconst add = function(a, b) {\n  return a + b;\n};\n\n// Named function expression\nconst add = function addInternal(a, b) {\n  return a + b;\n};\n\nИмя addInternal доступно ТОЛЬКО внутри функции:\nconst add = function addInternal(a, b) {\n  console.log(addInternal.name); // 'addInternal'\n  return a + b;\n};\n\nconsole.log(addInternal); // ReferenceError — имя не доступно снаружи\n\nЗачем использовать NFE:\n\n1. Рекурсия (без присваивания в переменную):\nconst factorial = function fact(n) {\n  return n <= 1 ? 1 : n * fact(n - 1);\n};\n\n2. Stack traces — имя функции видно в ошибке:\n// Anonymous: TypeError: ... at <anonymous>\n// Named: TypeError: ... at addInternal\n\n3. Самоссылка:\nconst obj = {\n  method: function self() {\n    console.log(self === obj.method); // true\n  }\n};\n\nСовременные альтернативы:\n- Обычная function declaration: function add() {}\n- Arrow function: const add = () => {}\n- Обычное имя переменной: const add = function() {}\n\nNFE редко нужен в modern коде. Но полезно знать при чтении legacy кода.",
    mentalModel: "NFE — как функция с паспортом. Обычная анонимная функция — как человек без документов (неизвестно кто). NFE — функция с именем, которое она носит только для себя. Полезно, если нужно знать своё имя (рекурсия) или если полиция спросит (stack trace).",
    examples: [
      {
        level: "minimal",
        code: "// Anonymous function expression\nconst greet = function(name) {\n  console.log(`Hello, ${name}`);\n};\n\n// Named function expression\nconst greet = function greetFn(name) {\n  console.log(greetFn.name); // 'greetFn'\n};",
        explanation: "Имя функции доступно только внутри неё самой."
      },
      {
        level: "simple",
        code: "// Рекурсия через NFE\nconst factorial = function fact(n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n};\n\nconsole.log(factorial(5)); // 120\n// fact доступна только внутри функции",
        explanation: "NFE позволяет рекурсию без переменной-обёртки."
      },
      {
        level: "real",
        code: "// В object literals — self-reference\nconst calculator = {\n  history: [],\n  add: function add(a, b) {\n    const result = a + b;\n    this.history.push({ op: 'add', args: [a, b], result });\n    return result;\n  }\n};\n\n// В stack trace видно имя 'add', а не '<anonymous>'",
        explanation: "NFE в объекте: имя функции помогает при отладке."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать имя функции с именем переменной",
        why: "const add = function addInternal() {} — имя переменной 'add', имя функции 'addInternal'.",
        right: "Имя переменной и имя функции — разные вещи."
      },
      {
        wrong: "Думать, что NFE нужен в каждом проекте",
        why: "В modern коде достаточно function declarations и arrow functions.",
        right: "NFE — legacy паттерн. Знай для чтения чужого кода."
      }
    ],
    importantToRemember: [
      "Имя NFE доступно только внутри функции",
      "Полезно для рекурсии, stack traces, self-reference",
      "Имя переменной ≠ имя функции",
      "В modern коде редко нужен"
    ],
    realWorldUsage: "Редко используется в modern коде. Основной use case — чтение legacy кода, где NFE использовались для рекурсии или отладки.",
    connection: {
      back: "Вы знаете функции (J9, J10) и стрелочные функции (J10). NFE — это вариант синтаксиса функций.",
      forward: "Следующий урок (JV3) — как объекты преобразуются в примитивы в операциях."
    }
  },

  // ============================================
  // JV3 — Object-to-Primitive Conversion
  // ============================================
  {
    slug: "object-to-primitive",
    track: "js-advanced",
    order: 3,
    title: "Преобразование объекта в примитив",
    summary: "Понять, как объекты преобразуются в примитивы через Symbol.toPrimitive, valueOf и toString при операциях +, == и шаблонных строках.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["data-types", "operators", "objects"],
    learningObjective: "После этого урока вы сможете объяснить алгоритм ToPrimitive и предсказать, что произойдёт, когда объекты участвуют в операциях с примитивами.",
    shortExplanation: "Когда объект используется в операции, требующей примитива (obj + 1, obj == 'text'), JavaScript пытается его преобразовать. Порядок: Symbol.toPrimitive(hint) → valueOf() → toString(). hint указывает тип: 'number', 'string' или 'default'.",
    detailedExplanation: "Преобразование вызывается при:\\n- obj + number (арифметика)\\n- obj + string (конкатенация)\\n- obj == primitive (сравнение)\\n- Шаблонная строка: \`\\${obj}\`\\n\\nАлгоритм ToPrimitive(obj, hint):\\n\\n1. Если есть Symbol.toPrimitive — вызывается он:\\nconst obj = {\\n  [Symbol.toPrimitive](hint) {\\n    if (hint === 'number') return 42;\\n    if (hint === 'string') return 'hello';\\n    return 'default'; // hint === 'default'\\n  }\\n};\\n\\n2. Если нет — вызывается valueOf(), потом toString():\\nconst obj = {\\n  valueOf() { return 100; },\\n  toString() { return 'hello'; }\\n};\\n\\nobj + 1  // 101 (valueOf: 100 + 1)\\n\`\\${obj}\` // 'hello' (toString)\\n\\nhint:'default' используется для + и ==.\\n\\nПрактический пример:\\nclass Money {\\n  constructor(amount, currency) {\\n    this.amount = amount;\\n    this.currency = currency;\\n  }\\n\\n  [Symbol.toPrimitive](hint) {\\n    if (hint === 'number') return this.amount;\\n    return \`\\${this.amount} \\${this.currency}\`;\\n  }\\n}\\n\\nconst price = new Money(100, 'USD');\\nconsole.log(price + 50);    // 150\\nconsole.log(\`\\${price}\`);    // '100 USD'\\nconsole.log(price == 100);  // true",
    mentalModel: "ToPrimitive — как переводчик. Когда JavaScript встречает объект там, где нужен примитив (число, строка), он спрашивает: «Можешь дать мне число? Нет? А строку? Нет? Тогда попробую valueOf, потом toString.» Symbol.toPrimitive — личный переводчик объекта.",
    examples: [
      {
        level: "minimal",
        code: "const obj = {\n  valueOf() { return 10; }\n};\n\nconsole.log(obj + 5);   // 15 (valueOf)\nconsole.log(`${obj}`);  // '[object Object]' (toString)\nconsole.log(obj == 10); // true",
        explanation: "valueOf вызывается при арифметике, toString — при шаблонных строках."
      },
      {
        level: "simple",
        code: "const obj = {\n  [Symbol.toPrimitive](hint) {\n    console.log('hint:', hint);\n    if (hint === 'number') return 42;\n    if (hint === 'string') return 'hello';\n    return 'default';\n  }\n};\n\nconsole.log(obj + 1);     // hint: default, 43\nconsole.log(`${obj}`);    // hint: string, 'hello'\nconsole.log(obj * 2);     // hint: number, 84",
        explanation: "Symbol.toPrimitive получает hint в зависимости от контекста."
      },
      {
        level: "real",
        code: "class Temperature {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return this.celsius;\n    if (hint === 'string') return `${this.celsius}°C`;\n    return this.celsius;\n  }\n}\n\nconst temp = new Temperature(23);\nconsole.log(temp + 7);     // 30 (number)\nconsole.log(`${temp}`);   // '23°C' (string)\nconsole.log(temp > 20);   // true (number)",
        explanation: "Реальный пример: класс Temperature с преобразованием."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что + всегда вызывает valueOf",
        why: "Если один из операндов — строка, + конкатенирует и вызывает toString.",
        right: "obj + '' → toString. obj + 1 → valueOf (если hint='default')."
      },
      {
        wrong: "Забывать, что == вызывает ToPrimitive",
        why: "obj == 10 вызывает преобразование объекта.",
        right: "Используйте ===, если не хотите преобразований."
      }
    ],
    importantToRemember: [
      "Symbol.toPrimitive — приоритет над valueOf/toString",
      "hint: 'number', 'string', 'default'",
      "valueOf — для чисел, toString — для строк",
      "+ и == используют hint 'default'",
      "Шаблонные строки используют hint 'string'"
    ],
    realWorldUsage: "Иногда используется для создания объектов, которые ведут себя как примитивы (Money, Temperature, Color). Но чаще достаточно обычных методов (.toString(), .valueOf()).",
    connection: {
      back: "Вы знаете типы (J3) и операторы (J4). Этот урок объясняет, что происходит, когда объекты взаимодействуют с примитивами.",
      forward: "Следующий урок (JV4) — Symbol — примитивный тип для уникальных идентификаторов."
    }
  },

  // ============================================
  // JV4 — Symbol
  // ============================================
  {
    slug: "symbol",
    track: "js-advanced",
    order: 4,
    title: "Symbol",
    summary: "Понять, что Symbol — это уникальный примитив, как использовать well-known Symbols, и где они встречаются в реальном коде.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["data-types", "objects"],
    learningObjective: "После этого урока вы сможете создавать Symbol, использовать Symbol.for() и объяснять известные символы (well-known symbols), такие как Symbol.iterator и Symbol.toPrimitive.",
    shortExplanation: "Symbol — примитивный тип, создающий уникальные идентификаторы. Каждый Symbol уникален: Symbol() !== Symbol(). Symbol.for('key') создаёт глобальные символы. Well-known Symbols (Symbol.iterator, Symbol.toPrimitive) определяют поведение объектов.",
    detailedExplanation: "Создание:\nconst sym1 = Symbol();\nconst sym2 = Symbol('description');\nconsole.log(sym1 === sym2); // false — каждый уникален\n\nSymbol.for() — глобальные символы:\nconst s1 = Symbol.for('myKey');\nconst s2 = Symbol.for('myKey');\nconsole.log(s1 === s2); // true — один и тот же символ\n\nSymbol.keyFor() — обратный поиск:\nSymbol.keyFor(s1); // 'myKey'\n\nИспользование как ключ объекта:\nconst ID = Symbol('id');\nconst user = {\n  name: 'Анна',\n  [ID]: 123\n};\nconsole.log(user[ID]); // 123\n\nWell-known Symbols:\n- Symbol.iterator — определяет поведение for...of\n- Symbol.toPrimitive — определяет преобразование в примитив\n- Symbol.hasInstance — определяет instanceof\n- Symbol.toStringTag — определяет результат Object.prototype.toString()\n\nSymbol как приватный ключ:\nconst _private = Symbol('private');\nclass MyClass {\n  constructor() {\n    this[_private] = 'секрет';\n  }\n}\n// Нет стандартного способа получить доступ к _private снаружи",
    mentalModel: "Symbol — как номерной жетон в гардеробе. Каждый жетон уникален (Symbol()). Вы можете повесить пальто на крючок с жетоном ([symbol]). Symbol.for — как гардероб с регистрацией: один номер — одна полка.",
    examples: [
      {
        level: "minimal",
        code: "const sym = Symbol('mySymbol');\nconsole.log(typeof sym); // 'symbol'\nconsole.log(sym.toString()); // 'Symbol(mySymbol)'\n\n// Каждый Symbol уникален\nconsole.log(Symbol() === Symbol()); // false",
        explanation: "Symbol — уникальный примитив с описанием."
      },
      {
        level: "simple",
        code: "const ID = Symbol('id');\nconst NAME = Symbol('name');\n\nconst user = {\n  [ID]: 1,\n  [NAME]: 'Анна',\n  toString() {\n    return this[NAME];\n  }\n};\n\nconsole.log(user[ID]); // 1\nconsole.log(user[NAME]); // 'Анна'\nconsole.log(`${user}`); // 'Анна'",
        explanation: "Symbol как ключ объекта — уникальные идентификаторы."
      },
      {
        level: "real",
        code: "// Symbol.for для кросс-модульной связи\nconst EVENTS = Symbol.for('app:events');\n\n// Модуль 1\nconst emitter = {\n  [EVENTS]: []\n};\n\n// Модуль 2 (другой файл)\nconst globalSymbol = Symbol.for('app:events');\nemitter[globalSymbol].push('userLogin');\n\n// Оба модуля используют один и тот же Symbol",
        explanation: "Symbol.for для связи между модулями без прямых импортов."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что Symbol нужен в каждом проекте",
        why: "Symbol — нишевый тип. Большинство проектов обходятся без него.",
        right: "Symbol полезен для: приватных ключей, метаданных, well-known symbols."
      },
      {
        wrong: "Путать Symbol() и Symbol.for()",
        why: "Symbol() создаёт уникальный символ. Symbol.for() — глобальный с общим ключом.",
        right: "Symbol() — всегда уникален. Symbol.for('key') — один на все модули."
      }
    ],
    importantToRemember: [
      "Symbol — уникальный примитив",
      "Symbol.for() — глобальные символы",
      "Well-known Symbols определяют поведение объектов",
      "Symbol как ключ — приватные свойства",
      "Symbol редко нужен в обычном коде"
    ],
    realWorldUsage: "Sometimes. Основные use cases: приватные ключи классов, метаданные (decorators), well-known Symbols (Symbol.iterator). В большинстве проектов без Symbol можно обойтись.",
    connection: {
      back: "Вы знаете типы (J3) и объекты (J11). Symbol — седьмой примитивный тип.",
      forward: "Следующий урок (JV5) — WeakMap и WeakSet — коллекции со слабыми ссылками."
    }
  },

  // ============================================
  // JV5 — WeakMap и WeakSet
  // ============================================
  {
    slug: "weakmap-weakset",
    track: "js-advanced",
    order: 5,
    title: "WeakMap и WeakSet",
    summary: "Понять разницу между Map/Set и WeakMap/WeakSet: слабые ссылки, сборка мусора, и почему перечисление содержимого невозможно.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["map-and-set", "objects"],
    learningObjective: "После этого урока вы сможете объяснить слабые ссылки, сравнить Map/Set с WeakMap/WeakSet и определить случаи использования слабых коллекций.",
    shortExplanation: "WeakMap и WeakSet — коллекции, хранящие слабые ссылки на объекты. Если объект удалён из обычных ссылок — сборщик мусора удалит его и из WeakMap/WeakSet. Нельзя перечислить содержимое, узнать размер. Используются для приватных данных и кэширования.",
    detailedExplanation: "Map/Set vs WeakMap/WeakSet:\n\nMap:\n- Ключи: любые значения (включая примитивы)\n- Перечисление: keys(), values(), entries(), size\n- Ссылки: сильные (объекты не удаляются, пока есть Map)\n\nWeakMap:\n- Ключи: ТОЛЬКО объекты\n- Перечисление: НЕТ\n- Ссылки: слабые (объект может быть удалён GC)\n- Методы: get, set, has, delete\n\nWeakSet:\n- Значения: ТОЛЬКО объекты\n- Перечисление: НЕТ\n- Методы: add, has, delete\n\nЗачем нужны слабые ссылки:\n\n// Кэширование результатов для объектов\nconst cache = new WeakMap();\n\nfunction process(obj) {\n  if (cache.has(obj)) {\n    return cache.get(obj);\n  }\n  const result = expensiveCalculation(obj);\n  cache.set(obj, result);\n  return result;\n}\n\n// Когда объект удалён — кэш тоже очищается автоматически\n\n// Приватные данные класса\nconst privateData = new WeakMap();\n\nclass User {\n  constructor(name) {\n    privateData.set(this, { name });\n  }\n  getName() {\n    return privateData.get(this).name;\n  }\n}\n\n// Когда экземпляр User удалён — данные тоже удаляются",
    mentalModel: "WeakMap — как шкаф с ячейками для пальто. Вы кладёте пальто (объект) в ячейку (ключ). Когда пальто убирают из гардероба (GC) — ячейка автоматически очищается. Но вы не можете посмотреть, сколько пальто в шкафу (нет перечисления).",
    examples: [
      {
        level: "minimal",
        code: "const weakMap = new WeakMap();\nlet obj = { name: 'test' };\n\nweakMap.set(obj, 'данные');\nconsole.log(weakMap.has(obj)); // true\n\nobj = null; // объект может быть собран GC\n// weakMap автоматически очистится",
        explanation: "WeakMap: ключи — объекты, ссылки — слабые."
      },
      {
        level: "simple",
        code: "// Приватные данные\nclass User {\n  constructor(name, age) {\n    this.name = name;\n    privateData.set(this, { age });\n  }\n  getAge() {\n    return privateData.get(this).age;\n  }\n}\nconst privateData = new WeakMap();\n\nconst user = new User('Анна', 25);\nconsole.log(user.getAge()); // 25\n// user.age — undefined (приватно)",
        explanation: "WeakMap для приватных данных класса."
      },
      {
        level: "real",
        code: "// Кэширование DOM-элементов\nclass ComponentCache {\n  constructor() {\n    this.cache = new WeakMap();\n  }\n\n  getRenderResult(element) {\n    if (this.cache.has(element)) {\n      return this.cache.get(element);\n    }\n    const result = this.render(element);\n    this.cache.set(element, result);\n    return result;\n  }\n\n  render(element) {\n    return `Rendered: ${element.tagName}`;\n  }\n}\n\n// Когда DOM-элемент удалён из страницы — кэш очищается",
        explanation: "Реальный пример: кэш результатов рендеринга DOM-элементов."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что WeakMap — это Map с меньшим API",
        why: "WeakMap хранит слабые ссылки — объект может быть удалён GC. Map хранит сильные ссылки.",
        right: "WeakMap = слабые ссылки + автоматическая очистка. Map = сильные ссылки + ручная очистка."
      },
      {
        wrong: "Пытаться перечислить WeakMap",
        why: "WeakMap не имеет методов keys(), values(), entries(), size.",
        right: "WeakMap нельзя перечислить — это ограничение по спецификации."
      }
    ],
    importantToRemember: [
      "WeakMap/WeakSet хранят только объекты",
      "Ссылки слабые — GC может удалить объект",
      "Нельзя перечислить содержимое",
      "Используйте для кэширования и приватных данных",
      "WeakRef (JV20) — ещё более низкоуровневый механизм"
    ],
    realWorldUsage: "Sometimes. Основные use cases: приватные данные классов, кэширование результатов для объектов, хранение метаданных. В React internals используется WeakMap.",
    connection: {
      back: "Вы знаете Map и Set (JI18). WeakMap/WeakSet — их варианты со слабыми ссылками.",
      forward: "Следующий урок (JV6) — внутреннее устройство цепочки прототипов."
    }
  },

  // ============================================
  // JV6 — Prototypes Deep Dive
  // ============================================
  {
    slug: "prototypes-deep-dive",
    track: "js-advanced",
    order: 6,
    title: "Прототипы: глубокое погружение",
    summary: "Разобрать prototype chain, Object.create, делегирование и конструкторы на уровне, превышающем базовый обзор из Intermediate.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["prototypal-inheritance", "f-prototype", "built-in-prototypes"],
    learningObjective: "После этого урока вы сможете прослеживать цепочки прототипов, использовать Object.create для делегирования и подробно объяснять связь конструктора с прототипом.",
    shortExplanation: "Прототипное наследование — каждый объект имеет ссылку [[Prototype]]. Object.create(proto) создаёт объект с явным прототипом. Prototype chain — цепочка поиска свойств: свойство → [[Prototype]] → [[Prototype]] → ... → null. Делегирование — когда методы определены на прототипе, а не на каждом экземпляре.",
    detailedExplanation: "Object.create(proto):\nconst parent = { greet() { return `Hello, ${this.name}`; } };\nconst child = Object.create(parent);\nchild.name = 'Анна';\nconsole.log(child.greet()); // 'Hello, Анна'\n\nchild.greet не определён → поиск в parent → найден.\n\nPrototype chain:\nchild → parent → Object.prototype → null\n\nПроверка цепочки:\nconsole.log(Object.getPrototypeOf(child) === parent); // true\nconsole.log(Object.getPrototypeOf(parent) === Object.prototype); // true\nconsole.log(Object.getPrototypeOf(Object.prototype) === null); // true\n\nДелегирование (vs наследование):\n// Наследование: child НАСЛЕДУЕТ от parent\n// Делегирование: child ДЕЛЕГИРУЕТ родителю\n\nconst vehicle = {\n  start() { console.log('Engine started'); },\n  stop() { console.log('Engine stopped'); }\n};\n\nconst car = Object.create(vehicle);\ncar.drive = function() { console.log('Driving'); };\n// car.start() → не найдено → delegation → vehicle.start()\n\nКонструктор и prototype:\nfunction User(name) {\n  this.name = name;\n}\nUser.prototype.greet = function() {\n  return `Hi, ${this.name}`;\n};\n\nconst user = new User('Анна');\n// user → User.prototype → Object.prototype → null",
    mentalModel: "Prototype chain — как цепочка рекомендаций. Вы спрашиваете: «Кто знает greet?» → «Я не знаю, но мой prototype знает» → «Я тоже не знаю, но мой prototype знает» → ... → «Никто не знает» (null). Object.create — как создать нового сотрудника с указанием его наставника.",
    examples: [
      {
        level: "minimal",
        code: "const parent = { type: 'parent' };\nconst child = Object.create(parent);\n\nconsole.log(child.type); // 'parent' (из прототипа)\nconsole.log('type' in child); // true\nconsole.log(child.hasOwnProperty('type')); // false\n// type принадлежит parent, не child",
        explanation: "Поиск свойств через prototype chain."
      },
      {
        level: "simple",
        code: "function Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function() {\n  return `${this.name} makes a sound`;\n};\n\nfunction Dog(name) {\n  Animal.call(this, name);\n}\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\n\nDog.prototype.bark = function() {\n  return `${this.name} barks`;\n};\n\nconst rex = new Dog('Rex');\nconsole.log(rex.speak()); // 'Rex makes a sound'\nconsole.log(rex.bark()); // 'Rex barks'",
        explanation: "Ручное наследование через прототипы."
      },
      {
        level: "real",
        code: "// Делегирование для событий\nconst eventBus = {\n  listeners: {},\n  on(event, fn) {\n    (this.listeners[event] = this.listeners[event] || []).push(fn);\n  },\n  emit(event, data) {\n    (this.listeners[event] || []).forEach(fn => fn(data));\n  }\n};\n\nconst userEvents = Object.create(eventBus);\nuserEvents.on('login', (user) => console.log(`${user} logged in`));\nuserEvents.emit('login', 'Анна'); // 'Анна logged in'\n\n// Делегирование: userEvents не определяет on/emit, но получает их от eventBus",
        explanation: "Делегирование через Object.create для event bus."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать prototype и [[Prototype]]",
        why: "prototype — свойство функции (constructor.prototype). [[Prototype]] — внутренняя ссылка объекта.",
        right: "prototype — у функции-конструктора. [[Prototype]] — у каждого объекта."
      },
      {
        wrong: "Думать, что наследование и делегирование — одно и то же",
        why: "Наследование: child получает свойства parent. Делегирование: child ссылается на parent для поиска.",
        right: "Наследование = копирование. Делегирование = ссылка."
      },
      {
        wrong: "Забывать Object.create для delegation",
        why: "Без Object.createprototype chain может быть нарушена ( например: Child.prototype = new Parent()).",
        right: "Используйте Object.create для явного создания цепочки."
      }
    ],
    importantToRemember: [
      "Object.create(proto) — создание с прототипом",
      "Prototype chain: object → parent → Object.prototype → null",
      "Делегирование ≠ наследование",
      "hasOwnProperty проверяет own properties",
      "Конструктор + prototype = традиционное наследование"
    ],
    realWorldUsage: "Sometimes. Прототипы — фундамент JS, но в modern коде классы (JI8) используются чаще. Прототипы полезны для: делегирования, метапрограммирования, понимания legacy кода.",
    connection: {
      back: "Вы знаете прототипы (JI13–JI16). Этот урок глубже разбирает внутреннее устройство цепочки и делегирование.",
      forward: "Следующий урок (JV7) — Proxy и Reflect — перехват операций над объектами."
    }
  },

  // ============================================
  // JV7 — Proxy и Reflect
  // ============================================
  {
    slug: "proxy-reflect",
    track: "js-advanced",
    order: 7,
    title: "Proxy и Reflect",
    summary: "Понять, как Proxy перехватывает операции над объектами (get, set, has, apply) и как Reflect предоставляет стандартные операции.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["objects", "property-descriptors"],
    learningObjective: "После этого урока вы сможете создавать Proxy, реализовывать ловушки (traps) для get/set/has и использовать Reflect для стандартных операций над объектами.",
    shortExplanation: "Proxy оборачивает объект и перехватывает операции: get (чтение), set (запись), has (проверка in), apply (вызов функции). Reflect предоставляет стандартные операции JavaScript, зеркальные traps. Proxy + Reflect = метапрограммирование: валидация, логирование, реактивность.",
    detailedExplanation: "Создание Proxy:\nconst handler = {\n  get(target, prop) {\n    console.log(`Чтение: ${prop}`);\n    return Reflect.get(target, prop);\n  },\n  set(target, prop, value) {\n    console.log(`Запись: ${prop} = ${value}`);\n    return Reflect.set(target, prop, value);\n  }\n};\n\nconst obj = { name: 'Анна' };\nconst proxy = new Proxy(obj, handler);\n\nproxy.name; // Чтение: name → 'Анна'\nproxy.age = 25; // Запись: age = 25\n\nТипичные traps:\n- get(target, prop, receiver) — чтение свойства\n- set(target, prop, value, receiver) — запись свойства\n- has(target, prop) — оператор in\n- apply(target, thisArg, args) — вызов функции\n- construct(target, args) — оператор new\n\nReflect — зеркальный API:\n// Без Reflect (рекурсивная ловушка)\nget(target, prop) {\n  return target[prop];\n}\n\n// С Reflect (рекурсия корректна)\nget(target, prop, receiver) {\n  return Reflect.get(target, prop, receiver);\n}\n\nПрактический пример — валидация:\nconst validator = {\n  set(target, prop, value) {\n    if (prop === 'age' && typeof value !== 'number') {\n      throw new TypeError('Age must be a number');\n    }\n    return Reflect.set(target, prop, value);\n  }\n};\n\nconst user = new Proxy({}, validator);\nuser.age = 25; // OK\n// user.age = 'двадцать пять'; // TypeError",
    mentalModel: "Proxy — как охранник у двери объекта. Когда кто-то пытается прочитать свойство (get) — охранник проверяет и решает, пропустить или нет. Reflect — как инструкция для охранника: «Сделай то, что обычно делает объект, но через меня.»",
    examples: [
      {
        level: "minimal",
        code: "const handler = {\n  get(target, prop) {\n    return prop in target ? target[prop] : 'не найдено';\n  }\n};\n\nconst obj = new Proxy({ a: 1 }, handler);\nconsole.log(obj.a);  // 1\nconsole.log(obj.b);  // 'не найдено'",
        explanation: "Простейший Proxy: обработка отсутствующих свойств."
      },
      {
        level: "simple",
        code: "// Реактивный объект\nfunction reactive(obj, onChange) {\n  return new Proxy(obj, {\n    set(target, prop, value) {\n      const oldValue = target[prop];\n      const result = Reflect.set(target, prop, value);\n      if (oldValue !== value) {\n        onChange(prop, value, oldValue);\n      }\n      return result;\n    }\n  });\n}\n\nconst state = reactive({ count: 0 }, (prop, newVal) => {\n  console.log(`${prop} изменился на ${newVal}`);\n});\n\nstate.count = 1; // 'count изменился на 1'\nstate.count = 5; // 'count изменился на 5'",
        explanation: "Реактивность через Proxy — основа Vue 3 и аналогичных библиотек."
      },
      {
        level: "real",
        code: "// Отладка: логирование всех операций\nfunction debugProxy(obj, name) {\n  return new Proxy(obj, {\n    get(target, prop) {\n      console.log(`[${name}] GET ${String(prop)}`);\n      return Reflect.get(target, prop);\n    },\n    set(target, prop, value) {\n      console.log(`[${name}] SET ${String(prop)} = ${value}`);\n      return Reflect.set(target, prop, value);\n    },\n    has(target, prop) {\n      console.log(`[${name}] HAS ${String(prop)}`);\n      return Reflect.has(target, prop);\n    }\n  });\n}\n\nconst user = debugProxy({ name: 'Анна' }, 'User');\nuser.name; // [User] GET name\nuser.age = 25; // [User] SET age = 25",
        explanation: "Proxy для отладки: логирование всех операций над объектом."
      }
    ],
    commonMistakes: [
      {
        wrong: "Создавать Proxy без Reflect",
        why: "Без Reflect вызов методов оригинального объекта (target[prop]) может нарушить рекурсию.",
        right: "Используйте Reflect.get/set для корректной рекурсии."
      },
      {
        wrong: "Думать, что Proxy не влияет на производительность",
        why: "Proxy добавляет перехват на каждую операцию — это медленнее прямого доступа.",
        right: "Proxy = метапрограммирование. Используйте только когда нужно."
      }
    ],
    importantToRemember: [
      "Proxy перехватывает операции над объектом",
      "Reflect предоставляет стандартные операции",
      "Типичные traps: get, set, has, apply, construct",
      "Proxy замедляет доступ к свойствам",
      "Proxy — основа реактивности (Vue 3, MobX)"
    ],
    realWorldUsage: "Sometimes. Proxy используется в: реактивных системах (Vue 3, MobX), валидации данных, отладке, метапрограммировании. Но в обычном коде Proxy встречается редко.",
    sources: [
      { title: "MDN: Proxy", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Proxy" }
    ],
    connection: {
      back: "Вы знаете объекты (J11) и дескрипторы свойств (JV15). Proxy перехватывает операции над объектами.",
      forward: "Следующий урок (JV8) — генераторы — функции, которые могут приостанавливаться и возобновляться."
    }
  },

  // ============================================
  // JV8 — Generators и Iterators
  // ============================================
  {
    slug: "generators-iterators",
    track: "js-advanced",
    order: 8,
    title: "Генераторы и итераторы",
    summary: "Понять, как function* создаёт генератор, как yield приостанавливает выполнение, и как генераторы связаны с итераторами и for...of.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["iterable-objects", "functions"],
    learningObjective: "После этого урока вы сможете создавать генераторы через function*, использовать yield и объяснять связь с протоколом итераторов.",
    shortExplanation: "Generator — функция, которая может приостановить выполнение (yield) и возобновить (next()). Генератор возвращает итератор: next() возвращает {value, done}. yield — точка приостановки. for...of работает с итераторами автоматически.",
    detailedExplanation: "Создание генератора:\nfunction* count() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n\nconst gen = count();\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: false }\nconsole.log(gen.next()); // { value: undefined, done: true }\n\nyield — точка приостановки:\nfunction* range(start, end) {\n  for (let i = start; i <= end; i++) {\n    yield i;\n  }\n}\n\nfor (const num of range(1, 5)) {\n  console.log(num); // 1, 2, 3, 4, 5\n}\n\nyield* — делегирование:\nfunction* concat(iter1, iter2) {\n  yield* iter1;\n  yield* iter2;\n}\n\n// Кастомный итератор:\nclass Fibonacci {\n  constructor(limit) {\n    this.limit = limit;\n  }\n  [Symbol.iterator]() {\n    let a = 0, b = 1, count = 0;\n    const limit = this.limit;\n    return {\n      next() {\n        if (count >= limit) return { done: true };\n        const value = a;\n        [a, b] = [b, a + b];\n        count++;\n        return { value, done: false };\n      }\n    };\n  }\n}\n\nfor (const n of new Fibonacci(5)) {\n  console.log(n); // 0, 1, 1, 2, 3\n}",
    mentalModel: "Generator — как книга с закладками. yield — закладка: «Прочитай до сюда, потом вернись». next() — «Продолжи читать от последней закладки». Когда книга закончена — done: true.",
    examples: [
      {
        level: "minimal",
        code: "function* oneTwo() {\n  yield 1;\n  yield 2;\n}\n\nconst gen = oneTwo();\nconsole.log(gen.next()); // { value: 1, done: false }\nconsole.log(gen.next()); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: undefined, done: true }",
        explanation: "Простейший генератор: два yield."
      },
      {
        level: "simple",
        code: "function* fibonacci() {\n  let a = 0, b = 1;\n  while (true) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\n\nconst fib = fibonacci();\nfor (let i = 0; i < 8; i++) {\n  console.log(fib.next().value); // 0, 1, 1, 2, 3, 5, 8, 13\n}",
        explanation: "Бесконечный генератор: Fibonacci без ограничения."
      },
      {
        level: "real",
        code: "// Генератор для чтения файла построчно\nfunction* readLines(text) {\n  const lines = text.split('\\n');\n  for (let i = 0; i < lines.length; i++) {\n    yield { lineNumber: i + 1, content: lines[i] };\n  }\n}\n\nconst csv = 'Name,Age\\nАнна,25\\nБорис,30';\nfor (const line of readLines(csv)) {\n  console.log(`${line.lineNumber}: ${line.content}`);\n}\n// 1: Name,Age\n// 2: А́нна,25\n// 3: Борис,30",
        explanation: "Генератор для обработки данных построчно."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что yield останавливает весь код",
        why: "yield останавливает ТОЛЬКО генератор. Остальной код продолжает выполняться.",
        right: "yield = пауза внутри генератора, не во всём приложении."
      },
      {
        wrong: "Забывать, что генератор — итератор",
        why: "Генератор возвращает объект с методом next() и Symbol.iterator.",
        right: "Генератор = итератор по умолчанию. Можно использовать в for...of."
      }
    ],
    importantToRemember: [
      "function* создаёт генератор",
      "yield — точка приостановки и возврат значения",
      "next() возобновляет выполнение",
      "Генератор = итератор (Symbol.iterator)",
      "yield* делегирует другой итератор"
    ],
    realWorldUsage: "Sometimes. Генераторы используются в: ленивых вычислениях, бесконечных последовательностях, async iterators (JV9), state machines. Redux-Saga использует генераторы для side effects.",
    sources: [
      { title: "MDN: итераторы и генераторы", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Iterators_and_Generators" }
    ],
    connection: {
      back: "Вы знаете перебираемые значения (JI19) и функции (J9). Генераторы объединяют оба понятия.",
      forward: "Следующий урок (JV9) — асинхронные генераторы — сочетание генераторов с Promise."
    }
  },

  // ============================================
  // JV9 — Async Generators
  // ============================================
  {
    slug: "async-generators",
    track: "js-advanced",
    order: 9,
    title: "Асинхронные генераторы",
    summary: "Понять, как async function* создаёт асинхронный генератор, и как for await...of перебирает асинхронные итераторы.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["async-await", "generators-iterators"],
    learningObjective: "После этого урока вы сможете создавать асинхронные генераторы, использовать yield с Promise и перебирать их через for await...of.",
    shortExplanation: "Async generator — async function* — функция, которая может приостанавливаться (yield) и выполнять асинхронные операции. for await...of перебирает асинхронные итераторы. Используется для: построчного чтения файлов, обработки стримов, постраничной загрузки данных.",
    detailedExplanation: "Async generator:\nasync function* fetchPages(url) {\n  let page = 1;\n  while (true) {\n    const response = await fetch(`${url}?page=${page}`);\n    const data = await response.json();\n    if (data.length === 0) break;\n    yield data;\n    page++;\n  }\n}\n\n// Перебор:\nfor await (const pageData of fetchPages('/api/users')) {\n  console.log(pageData);\n}\n\nГде используется:\n1. Построчное чтение файлов (Node.js)\n2. Постраничная загрузка\n3. WebSocket-like стримы\n4. Обработка данных по мере поступления\n\nСинтаксис:\nasync function* name() {\n  yield await promise;\n}\n\n// Или стрелочная (ограниченно)\nconst gen = async function*() {\n  yield 1;\n};",
    mentalModel: "Async generator — как автомат с напитками с кнопкой «подождать». Вы нажимаете кнопку (next()) — автомат готовит напиток (await) — выдаёт его (yield). while(true) — автомат работает бесконечно, пока не закончатся напитки.",
    examples: [
      {
        level: "minimal",
        code: "async function* numbers() {\n  yield 1;\n  yield new Promise(resolve => setTimeout(() => resolve(2), 100));\n  yield 3;\n}\n\nfor await (const n of numbers()) {\n  console.log(n); // 1, 2 (через 100мс), 3\n}",
        explanation: "Простейший async generator: yield с Promise."
      },
      {
        level: "simple",
        code: "async function* fetchAll(urls) {\n  for (const url of urls) {\n    const response = await fetch(url);\n    const data = await response.json();\n    yield { url, data };\n  }\n}\n\nconst urls = ['/api/users', '/api/posts'];\nfor await (const { url, data } of fetchAll(urls)) {\n  console.log(`${url}: ${data.length} items`);\n}",
        explanation: "Последовательная загрузка данных с yield."
      },
      {
        level: "real",
        code: "// Постраничная загрузка\nasync function* paginate(url, pageSize = 10) {\n  let offset = 0;\n  while (true) {\n    const response = await fetch(\n      `${url}?offset=${offset}&limit=${pageSize}`\n    );\n    const items = await response.json();\n    if (items.length === 0) return;\n    yield* items;\n    offset += pageSize;\n  }\n}\n\n// Загружаем все страницы\nfor await (const user of paginate('/api/users')) {\n  console.log(user.name);\n}",
        explanation: "Постраничная загрузка: yield* для разворачивания массива."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать await перед fetch в async generator",
        why: "yield не ждёт Promise автоматически — нужен await.",
        right: "yield await promise; — правильный синтаксис."
      },
      {
        wrong: "Путать for...of и for await...of",
        why: "for...of — для синхронных итераторов. for await...of — для асинхронных.",
        right: "async generator → for await...of. Обычный generator → for...of."
      }
    ],
    importantToRemember: [
      "async function* создаёт асинхронный генератор",
      "yield возвращает Promise",
      "for await...of перебирает асинхронные итераторы",
      "Используйте для: стримов, пагинации, построчного чтения",
      "return в async generator завершает итерацию"
    ],
    realWorldUsage: "Sometimes. Основные use cases: постраничная загрузка, обработка стримов, чтение файлов (Node.js). В browser context используется реже.",
    connection: {
      back: "Вы знаете async/await (JA5) и генераторы (JV8). Асинхронные генераторы объединяют оба понятия.",
      forward: "Следующий урок (JV10) — промисификация — преобразование колбэков в Promise."
    }
  },

  // ============================================
  // JV10 — Promisification
  // ============================================
  {
    slug: "promisification",
    track: "js-advanced",
    order: 10,
    title: "Промисификация",
    summary: "Научиться оборачивать callback-based API в Promises, понять, когда promisification нужна, и почему в modern code она встречается реже.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["promises", "async-await"],
    learningObjective: "После этого урока вы сможете промисифицировать функции на колбэках и понимать, когда промисификация нужна, а когда нет.",
    shortExplanation: "Промисификация — превращение callback-based функции в функцию, возвращающую Promise. Нужна при работе со старыми API (Node.js callbacks). В modern code (fetch, async/await) promisification встречается реже.",
    detailedExplanation: "Проблема: callback-based API\n\nfunction loadData(url, onSuccess, onError) {\n  // ...\n}\n\nloadData(url,\n  (data) => console.log(data),\n  (error) => console.log(error)\n);\n\nРешение: promisification\n\nfunction loadDataAsync(url) {\n  return new Promise((resolve, reject) => {\n    loadData(url, resolve, reject);\n  });\n}\n\n// Теперь:\nconst data = await loadDataAsync(url);\n\nУтилита promisify:\nfunction promisify(fn) {\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      fn(...args, (error, result) => {\n        if (error) reject(error);\n        else resolve(result);\n      });\n    });\n  };\n}\n\n// Использование:\nconst loadDataP = promisify(loadData);\nconst data = await loadDataP(url);\n\nNode.js:\nconst { promisify } = require('util');\nconst readFile = promisify(require('fs').readFile);\nconst content = await readFile('file.txt', 'utf8');\n\nКогда НЕ нужна:\n- fetch() уже возвращает Promise\n- async/await уже работают с Promises\n- Современные API уже Promise-based",
    mentalModel: "Промисификация — как переводчик с «callback-языка» на «Promise-язык». Старые API говорят на callback-языке («позвони мне, когда будет готово»). Промисификация переводит это на Promise-язык («жди результата»).",
    examples: [
      {
        level: "minimal",
        code: "// Callback-based\nfunction loadScript(src, callback) {\n  const script = document.createElement('script');\n  script.src = src;\n  script.onload = () => callback(null, script);\n  script.onerror = () => callback(new Error(`Failed: ${src}`));\n  document.head.append(script);\n}\n\n// Promisified\nfunction loadScriptAsync(src) {\n  return new Promise((resolve, reject) => {\n    loadScript(src, (error, script) => {\n      if (error) reject(error);\n      else resolve(script);\n    });\n  });\n}\n\nawait loadScriptAsync('/app.js');",
        explanation: "Промисификация callback-based loadScript."
      },
      {
        level: "simple",
        code: "// Утилита promisify\nfunction promisify(fn) {\n  return (...args) => new Promise((resolve, reject) => {\n    fn(...args, (err, result) => {\n      err ? reject(err) : resolve(result);\n    });\n  });\n}\n\n// Пример использования\nfunction slowOperation(data, callback) {\n  setTimeout(() => callback(null, `Result: ${data}`), 1000);\n}\n\nconst fast = promisify(slowOperation);\nconst result = await fast('test'); // 'Result: test'",
        explanation: "Универсальная утилита для промисификации."
      },
      {
        level: "real",
        code: "// Node.js: промисификация fs\nconst fs = require('fs');\nconst { promisify } = require('util');\n\nconst readFile = promisify(fs.readFile);\nconst writeFile = promisify(fs.writeFile);\n\nasync function processFile(path) {\n  const content = await readFile(path, 'utf8');\n  const processed = content.toUpperCase();\n  await writeFile(path, processed);\n  console.log('Done!');\n}",
        explanation: "Node.js: промисификация встроенных модулей."
      }
    ],
    commonMistakes: [
      {
        wrong: "Промисифицировать modern API",
        why: "fetch, async/await, современные Node.js API уже возвращают Promises.",
        right: "Промисификация нужна только для callback-based legacy API."
      },
      {
        wrong: "Забывать обработать ошибки в promisify",
        why: "Если callback не вызывается — Promise «зависает» навсегда.",
        right: "Убедитесь, что callback всегда вызывается (resolve или reject)."
      }
    ],
    importantToRemember: [
      "Промисификация = callback → Promise",
      "Нужна для legacy callback-based API",
      "В modern code встречается реже",
      "Node.js: util.promisify",
      "Всегда обрабатывайте ошибки"
    ],
    realWorldUsage: "Sometimes. Основные use cases: работа со старыми Node.js модулями (fs, crypto), legacy browser API. В modern JavaScript промисификация нужна редко —большинство API уже Promise-based.",
    connection: {
      back: "Вы знаете Promise (JA4) и async/await (JA5). Промисификация соединяет старые API на колбэках с этим миром.",
      forward: "Следующий урок (JV11) — микрозадачи — порядок выполнения колбэков Promise."
    }
  },

  // ============================================
  // JV11 — Microtasks
  // ============================================
  {
    slug: "microtasks",
    track: "js-advanced",
    order: 11,
    title: "Микрозадачи (Microtasks)",
    summary: "Разобрать микрозадачи (Promise.then, queueMicrotask) и их приоритет над макрозадачами (setTimeout) в Event Loop.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["promises", "sync-vs-async"],
    learningObjective: "После этого урока вы сможете объяснить очередь микрозадач, предсказывать порядок выполнения смешанного кода (синхронного/микрозадач/задач) и понимать, когда микрозадачи важны.",
    shortExplanation: "Microtask — задача с максимальным приоритетом. Все microtasks выполняются ПОСЛЕ текущего синхронного кода, НО ДО следующей макрозадачи. Promise.then, queueMicrotask, MutationObserver — microtasks. setTimeout, setInterval — macrotasks.",
    detailedExplanation: "Очереди задач:\n\n1. Call stack (синхронный код)\n2. Microtask queue (Promise.then, queueMicrotask)\n3. Macrotask queue (setTimeout, setInterval)\n\nПорядок выполнения:\n// Задача 1: синхронный код\nconsole.log('1');\n\n// Задача 2: microtask\nPromise.resolve().then(() => console.log('2'));\n\n// Задача 3: microtask\nqueueMicrotask(() => console.log('3'));\n\n// Задача 4: macrotask\nsetTimeout(() => console.log('4'), 0);\n\nconsole.log('5');\n\n// Вывод: 1, 5, 2, 3, 4\n\nВажно: microtask queue очищается ПОЛНОСТЬЮ\n\nconsole.log('start');\n\nPromise.resolve().then(() => {\n  console.log('micro1');\n  Promise.resolve().then(() => console.log('micro2'));\n});\n\nsetTimeout(() => console.log('macro'), 0);\nconsole.log('end');\n\n// Вывод: start, end, micro1, micro2, macro\n// micro2 — тоже microtask, выполняется до macro!\n\nMutationObserver callback — тоже microtask (JA11).\n\nГде это важно:\n- Порядок обновления UI\n- Порядок вызова callback'ов\n- Когда один Promise создаёт другой Promise",
    mentalModel: "Microtask queue — как VIP-очередь. Синхронный код — текущий клиент (обслуживается сразу). Microtasks — VIP-клиенты (обслуживаются ВСЕ перед обычными). Macrotasks — обычные клиенты (обслуживаются по одному после VIP).",
    examples: [
      {
        level: "minimal",
        code: "console.log('1');\n\nPromise.resolve().then(() => console.log('2'));\n\nsetTimeout(() => console.log('3'), 0);\n\nconsole.log('4');\n\n// Вывод: 1, 4, 2, 3\n// Синхронный → Microtask → Macrotask",
        explanation: "Базовый порядок: sync → microtask → macrotask."
      },
      {
        level: "simple",
        code: "Promise.resolve()\n  .then(() => {\n    console.log('micro1');\n    return Promise.resolve();\n  })\n  .then(() => console.log('micro2'));\n\nPromise.resolve()\n  .then(() => console.log('micro3'));\n\nsetTimeout(() => console.log('macro'), 0);\n\n// Вывод: micro1, micro3, micro2, macro\n// micro3 выполняется ДО micro2,\n// потому что micro1 уже завершился",
        explanation: "Порядок microtasks зависит от порядка разрешения Promises."
      },
      {
        level: "real",
        code: "// Опасный паттерн: рекурсивные microtasks\nfunction flood() {\n  Promise.resolve().then(flood);\n}\nflood(); // Microtask queue никогда не опустеет!\n// setTimeout НЕ выполняется\n// UI зависает\n\n// Безопасный вариант\nfunction safe() {\n  setTimeout(() => {\n    // Нагрузка распределяется по macrotasks\n    // UI остаётся отзывчивым\n    safe();\n  }, 0);\n}",
        explanation: "Рекурсивные microtasks блокируют macrotasks и UI."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что microtasks и macrotasks выполняются параллельно",
        why: "Они выполняются последовательно: сначала ВСЕ microtasks, потом одна macrotask.",
        right: "Microtask queue опустеет полностью → одна macrotask → снова microtasks."
      },
      {
        wrong: "Путать queueMicrotask и setTimeout(fn, 0)",
        why: "queueMicrotask — microtask (приоритет). setTimeout — macrotask (после microtasks).",
        right: "queueMicrotask = VIP. setTimeout = обычный."
      }
    ],
    importantToRemember: [
      "Microtasks: Promise.then, queueMicrotask, MutationObserver",
      "Macrotasks: setTimeout, setInterval, I/O",
      "Microtask queue опустеет полностью перед следующей macrotask",
      "Рекурсивные microtasks блокируют macrotasks",
      "Порядок: sync → microtasks → macrotask"
    ],
    realWorldUsage: "Sometimes. Microtask queue важна для понимания порядка выполнения Promise callback'ов. В обычном коде редко нужно думать о microtasks, но полезно знать для отладки.",
    connection: {
      back: "Вы знаете async/await (JA5) и Event Loop (DA11). Микрозадачи — внутренний механизм, стоящий за колбэками Promise.",
      forward: "Следующий урок (JV12) — конструктор и new — как создаются объекты."
    }
  },

  // ============================================
  // JV12 — Constructor и new
  // ============================================
  {
    slug: "constructor-new",
    track: "js-advanced",
    order: 12,
    title: "Конструктор и new",
    summary: "Разобрать, что делает оператор new: создаёт объект, привязывает this, устанавливает prototype, и возвращает результат.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["functions", "objects", "classes"],
    learningObjective: "После этого урока вы сможете объяснить 4 шага работы new и предсказать, что произойдёт, если конструктор вернёт объект.",
    shortExplanation: "new Constructor(args) выполняет 4 шага: 1) создаёт пустой объект, 2) устанавливает prototype = Constructor.prototype, 3) вызывает Constructor с this = новый объект, 4) возвращает объект (или результат constructor, если это объект).",
    detailedExplanation: "4 шага new:\n\nfunction User(name) {\n  this.name = name;\n}\nUser.prototype.greet = function() {\n  return `Hi, ${this.name}`;\n};\n\nconst user = new User('Анна');\n\n// Что сделал new:\n// 1. const obj = {};\n// 2. obj.__proto__ = User.prototype;\n// 3. User.call(obj, 'Анна'); → obj.name = 'Анна'\n// 4. return obj;\n\nПроверка:\nconsole.log(user.name); // 'Анна'\nconsole.log(user.greet()); // 'Hi, Анна'\nconsole.log(user instanceof User); // true\n\nConstructor может вернуть объект:\nfunction Fake() {\n  this.real = true;\n  return { fake: true }; // перезаписывает this!\n}\n\nconst f = new Fake();\nconsole.log(f.fake); // true\nconsole.log(f.real); // undefined\n\nЕсли constructor возвращает примитив — он игнорируется.\n\nПроверка new (без new):\nfunction User(name) {\n  if (!(this instanceof User)) {\n    return new User(name);\n  }\n  this.name = name;\n}\n\n// Можно вызвать без new:\nconst user = User('Анна'); // тоже работает\n\nModern альтернатива: class\n// class всегда требует new\n// constructor возвращает объект — SyntaxError",
    mentalModel: "new — как фабрика. Вы подаёте чертёж (Constructor) и материал (args). Фабрика: 1) берёт чистый лист (пустой объект), 2) ставит штамп завода (prototype), 3) заполняет по чертежу (this = obj), 4) отдаёт готовое изделие (объект).",
    examples: [
      {
        level: "minimal",
        code: "function Car(brand) {\n  this.brand = brand;\n}\nCar.prototype.drive = function() {\n  return `${this.brand} is driving`;\n};\n\nconst tesla = new Car('Tesla');\nconsole.log(tesla.drive()); // 'Tesla is driving'\nconsole.log(tesla instanceof Car); // true",
        explanation: "Простейший конструктор с new."
      },
      {
        level: "simple",
        code: "// Constructor, возвращающий объект\nfunction Range(from, to) {\n  this.from = from;\n  this.to = to;\n}\n\nRange.prototype = {\n  includes(x) {\n    return x >= this.from && x <= this.to;\n  },\n  toString() {\n    return `[${this.from}..${this.to}]`;\n  }\n};\n\nconst range = new Range(1, 10);\nconsole.log(range.includes(5)); // true\nconsole.log(`${range}`); // '[1..10]'",
        explanation: "Конструктор + prototype для создания объектов."
      },
      {
        level: "real",
        code: "// Паттерн: factory с проверкой new\nfunction create(Constructor, ...args) {\n  return new Constructor(...args);\n}\n\n// Или self-checking constructor\nfunction MyClass(value) {\n  if (!(new.target)) {\n    throw new Error('Use new MyClass()');\n  }\n  this.value = value;\n}\n\n// new MyClass(42) — OK\n// MyClass(42) — Error: Use new MyClass()",
        explanation: "Паттерны: factory и self-checking constructor."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать, что new может вернуть другой объект",
        why: "Если constructor возвращает объект — new вернёт его, а не this.",
        right: "new возвращает: this (по умолчанию) или объект из constructor."
      },
      {
        wrong: "Думать, что new нужен только для class",
        why: "new работает с любыми функциями-конструкторами.",
        right: "new Constructor() — вызов функции как конструктора."
      }
    ],
    importantToRemember: [
      "new выполняет 4 шага: create, set prototype, call constructor, return",
      "Constructor может вернуть объект (перезаписывает this)",
      "Constructor.prototype becomes [[Prototype]]",
      "instanceof проверяет prototype chain",
      "class всегда требует new"
    ],
    realWorldUsage: "Sometimes. new используется в: создании экземпляров классов (JI8), фабриках, конструкторах (legacy). В modern code class_declaration предпочтительнее ручного new + function.",
    connection: {
      back: "Вы знаете классы (JI8) и прототипы (JV6). Этот урок объясняет механизм, стоящий за new.",
      forward: "Следующий урок (JV13) — расширение встроенных классов, например Array."
    }
  },

  // ============================================
  // JV13 — Built-in Class Extension
  // ============================================
  {
    slug: "built-in-class-extension",
    track: "js-advanced",
    order: 13,
    title: "Расширение встроенных классов",
    summary: "Понять, как наследоваться от встроенных классов (Array, Map, Error), какие ограничения есть, и когда это оправдано.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Rare",
    prerequisites: ["classes", "class-inheritance"],
    learningObjective: "После этого урока вы сможете расширять встроенные классы, объяснять их ограничения и понимать, когда это уместно.",
    shortExplanation: "JavaScript позволяет наследоваться от встроенных классов: class MyArray extends Array. Это полезно для кастомных коллекций. Ограничения:Species pattern, не все built-ins расширяемы одинаково. В обычном коде расширение built-ins встречается редко.",
    detailedExplanation: "Расширение Array:\nclass MyArray extends Array {\n  get first() {\n    return this[0];\n  }\n  get last() {\n    return this[this.length - 1];\n  }\n}\n\nconst arr = new MyArray(1, 2, 3);\nconsole.log(arr.first); // 1\nconsole.log(arr.last); // 3\nconsole.log(arr instanceof MyArray); // true\n\n// Методы возвращают MyArray:\nconst filtered = arr.filter(x => x > 1);\nconsole.log(filtered instanceof MyArray); // true\nconsole.log(filtered.first); // 2\n\nSpecies pattern:\nclass MyError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = 'MyError';\n  }\n}\n\n// По умолчанию: MyError[Symbol.species] = MyError\n// Это значит: методы Error будут возвращать MyError\n\nРасширение Map:\nclass DurationMap extends Map {\n  setWithTimeout(key, value, ms) {\n    this.set(key, value);\n    setTimeout(() => this.delete(key), ms);\n  }\n}\n\nОграничения:\n- Symbol.species может изменять поведение методов\n- Не все built-ins имеют одинаковую поддержку\n- Некоторые встроенные методы могут не работать корректно",
    mentalModel: "Расширение built-ins — как создать кастомный инструмент на основе стандартного. Например: MyArray — это Array с дополнительными кнопками (first, last). Стандартные функции (filter, map) работают и возвращают MyArray, потому что JavaScript использует Species pattern.",
    examples: [
      {
        level: "minimal",
        code: "class CountedArray extends Array {\n  get count() {\n    return this.length;\n  }\n}\n\nconst arr = new CountedArray(1, 2, 3);\nconsole.log(arr.count); // 3",
        explanation: "Простейшее расширение Array с собственным методом."
      },
      {
        level: "simple",
        code: "class TaggedError extends Error {\n  constructor(tag, message) {\n    super(message);\n    this.tag = tag;\n    this.name = 'TaggedError';\n  }\n}\n\nconst err = new TaggedError('AUTH', 'Unauthorized');\nconsole.log(err.tag); // 'AUTH'\nconsole.log(err instanceof Error); // true",
        explanation: "Расширение Error для кастомных ошибок."
      },
      {
        level: "real",
        code: "class PriorityQueue extends Array {\n  enqueue(item, priority) {\n    this.push({ item, priority });\n    this.sort((a, b) => a.priority - b.priority);\n  }\n\n  dequeue() {\n    return this.shift()?.item;\n  }\n}\n\nconst pq = new PriorityQueue();\npq.enqueue('low', 3);\npq.enqueue('high', 1);\npq.enqueue('medium', 2);\n\nconsole.log(pq.dequeue()); // 'high'\nconsole.log(pq.dequeue()); // 'medium'",
        explanation: "Расширение Array для Priority Queue."
      }
    ],
    commonMistakes: [
      {
        wrong: "Расширять Array без понимания Species",
        why: "Методы Array (filter, map) возвращают экземпляр родителя — это может нарушить ожидания.",
        right: "Понимайте Symbol.species и его влияние на возвращаемые типы."
      },
      {
        wrong: "Думать, что расширение built-ins — обычный паттерн",
        why: "В большинстве проектов достаточно обычных классов и композиции.",
        right: "Расширение built-ins — нишевый паттерн. Используйте только когда действительно нужно."
      }
    ],
    importantToRemember: [
      "class MyArray extends Array — допустимый синтаксис",
      "Symbol.species определяет тип возвращаемых методов",
      "Методы возвращают экземпляр дочернего класса",
      "Расширение built-ins — нишевый паттерн",
      "Используйте композицию вместо наследования, когда возможно"
    ],
    realWorldUsage: "Rare. Расширение built-ins встречается в: библиотеках (Lodash), фреймворках (React), specialized collections. В обычном коде — редко.",
    connection: {
      back: "Вы знаете классы (JI8) и наследование (JI9). Этот урок расширяет встроенные классы.",
      forward: "Следующий урок (JV14) — миксины — переиспользуемое поведение через композицию."
    }
  },

  // ============================================
  // JV14 — Mixins
  // ============================================
  {
    slug: "mixins",
    track: "js-advanced",
    order: 14,
    title: "Миксины (Mixins)",
    summary: "Понять, как миксины добавляют повторяемое поведение через композицию, и чем они отличаются от наследования.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["classes", "objects"],
    learningObjective: "После этого урока вы сможете реализовывать миксины через Object.assign и классы-миксины и объяснять композицию против наследования.",
    shortExplanation: "Миксин — объект или класс, предоставляющий методы для повторного использования. Миксины решают проблему множественного наследования: один класс может включать множество миксинов. Composition (миксины) предпочтительнее множественного наследования.",
    detailedExplanation: "Object.assign mixin:\nconst Serializable = {\n  serialize() {\n    return JSON.stringify(this);\n  },\n  deserialize(json) {\n    return Object.assign(this, JSON.parse(json));\n  }\n};\n\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\nObject.assign(User.prototype, Serializable);\n\nconst user = new User('Анна');\nconsole.log(user.serialize()); // '{\"name\":\"Анна\"}'\n\nClass mixin pattern:\nfunction Timestamped(Base) {\n  return class extends Base {\n    createdAt = new Date();\n    getAge() {\n      return Date.now() - this.createdAt;\n    }\n  };\n}\n\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\nconst TimestampedUser = Timestamped(User);\nconst user = new TimestampedUser('Анна');\nconsole.log(user.getAge()); // возраст в мс\n\nComposition vs Inheritance:\n// Наследование: один родитель\n// Миксины: множество источников поведения\n\n// Миксины = «что МОЖЕТ делать»\n// Наследование = «что ЕСТЬ»",
    mentalModel: "Миксин — как навык в резюме. Вы — класс (человек). Наследование — ваш родитель (вы от него «наследуете» черты). Миксины — навыки (JavaScript, CSS, Git), которые вы «включаете» в свой набор. Один человек может иметь много навыков.",
    examples: [
      {
        level: "minimal",
        code: "const Greetable = {\n  greet(name) {\n    return `Hello, ${name}!`;\n  }\n};\n\nconst person = { name: 'Анна' };\nObject.assign(person, Greetable);\n\nconsole.log(person.greet('Мир')); // 'Hello, Мир!'",
        explanation: "Простейший миксин через Object.assign."
      },
      {
        level: "simple",
        code: "// Class mixin\nfunction Loggable(Base) {\n  return class extends Base {\n    log(message) {\n      console.log(`[${this.constructor.name}] ${message}`);\n    }\n  };\n}\n\nclass Service {\n  run() { this.log('Running'); }\n}\n\nconst LoggableService = Loggable(Service);\nconst svc = new LoggableService();\nsvc.run(); // [Service] Running",
        explanation: "Class mixin для добавления логирования."
      },
      {
        level: "real",
        code: "// Реальный паттерн: Multiple mixins\nclass EventEmitter {\n  #listeners = {};\n  on(event, fn) {\n    (this.#listeners[event] ??= []).push(fn);\n  }\n  emit(event, ...args) {\n    (this.#listeners[event] ?? []).forEach(fn => fn(...args));\n  }\n}\n\nclass Timer {\n  start(ms) {\n    this._interval = setInterval(() => this.emit('tick'), ms);\n  }\n  stop() {\n    clearInterval(this._interval);\n  }\n}\n\n// Миксин через Object.assign\nObject.assign(Timer.prototype, EventEmitter.prototype);\n\nconst timer = new Timer();\ntimer.on('tick', () => console.log('tick'));\ntimer.start(1000);",
        explanation: "Миксины для комбинирования Behavior."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать миксины вместо композиции",
        why: "Миксины могут создавать конфликты имён и неявные зависимости.",
        right: "Предпочитайте композицию (объекты как свойства) миксинам."
      },
      {
        wrong: "Думать, что миксины = множественное наследование",
        why: "Миксины не создают иерархии — они добавляют методы.",
        right: "Миксины — композиция. Наследование — иерархия."
      }
    ],
    importantToRemember: [
      "Миксин — источник повторяемого поведения",
      "Object.assign для объектных миксинов",
      "Class mixins через наследование от Base",
      "Composition предпочтительнее миксинов",
      "Избегайте конфликтов имён"
    ],
    realWorldUsage: "Sometimes. Миксины используются в: фреймворках (Vue mixins, Backbone), TypeScript (mixin functions), библиотеках. В modern React/Next.js используются хуки вместо миксинов.",
    connection: {
      back: "Вы знаете классы (JI8) и объекты (J11). Миксины добавляют поведение без наследования.",
      forward: "Следующий урок (JV15) — дескрипторы свойств — как определяются свойства."
    }
  },

  // ============================================
  // JV15 — Property Descriptors
  // ============================================
  {
    slug: "property-descriptors",
    track: "js-advanced",
    order: 15,
    title: "Дескрипторы свойств",
    summary: "Понять, как свойства объекта определяются через writable, enumerable, configurable, value, get/set, и как это контролировать.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["objects"],
    learningObjective: "После этого урока вы сможете использовать Object.defineProperty, читать дескрипторы и управлять поведением свойств на низком уровне.",
    shortExplanation: "Каждое свойство объекта имеет дескриптор: value (значение), writable (можно ли менять), enumerable (видно ли в циклах), configurable (можно ли удалить/изменить). Object.defineProperty() задаёт свойство с нужными дескрипторами.",
    detailedExplanation: "Object.getOwnPropertyDescriptor:\nconst obj = { name: 'Анна' };\nconsole.log(Object.getOwnPropertyDescriptor(obj, 'name'));\n// { value: 'Анна', writable: true, enumerable: true, configurable: true }\n\nObject.defineProperty:\nconst user = {};\nObject.defineProperty(user, 'name', {\n  value: 'Анна',\n  writable: false,      // нельзя изменить\n  enumerable: true,     // видно в for...in\n  configurable: false   // нельзя удалить\n});\n\nuser.name = 'Борис'; // TypeError (в strict mode)\n// неявное присваивание игнорируется\n\nGetter/Setter:\nlet temperature = 20;\nconst weather = {\n  get celsius() { return temperature; },\n  set celsius(value) {\n    temperature = value;\n    console.log(`Updated: ${value}°C`);\n  }\n};\n\nweather.celsius = 25; // 'Updated: 25°C'\nconsole.log(weather.celsius); // 25\n\nОпределяем все свойства сразу:\nObject.defineProperties(user, {\n  name: { value: 'Анна', writable: true },\n  age: { value: 25, writable: false }\n});",
    mentalModel: "Дескриптор — как характеристика товара на этикетке. value — цена. writable — можно ли менять цену. enumerable — виден ли товар в витрине. configurable — можно ли снять товар с продажи.",
    examples: [
      {
        level: "minimal",
        code: "const obj = {};\n\nObject.defineProperty(obj, 'secret', {\n  value: 42,\n  writable: false,\n  enumerable: false,\n  configurable: false\n});\n\nconsole.log(obj.secret); // 42\nobj.secret = 100; // не работает (не в strict mode)\nconsole.log(Object.keys(obj)); // [] — secret не enumerable",
        explanation: "Скрытое неизменяемое свойство."
      },
      {
        level: "simple",
        code: "// Getter/Setter\nclass Temperature {\n  #celsius = 0;\n\n  get fahrenheit() {\n    return this.#celsius * 9/5 + 32;\n  }\n\n  set fahrenheit(f) {\n    this.#celsius = (f - 32) * 5/9;\n  }\n\n  get celsius() {\n    return this.#celsius;\n  }\n\n  set celsius(c) {\n    this.#celsius = c;\n  }\n}\n\nconst temp = new Temperature();\ntemp.celsius = 100;\nconsole.log(temp.fahrenheit); // 212",
        explanation: "Getter/Setter для конвертации температуры."
      },
      {
        level: "real",
        code: "// Реактивное свойство\nfunction reactiveProperty(obj, key, initialValue) {\n  let value = initialValue;\n\n  Object.defineProperty(obj, key, {\n    get() {\n      console.log(`GET ${key}`);\n      return value;\n    },\n    set(newValue) {\n      console.log(`SET ${key} = ${newValue}`);\n      value = newValue;\n    },\n    enumerable: true,\n    configurable: true\n  });\n}\n\nconst state = {};\nreactiveProperty(state, 'count', 0);\n\nstate.count;     // GET count\nstate.count = 5; // SET count = 5",
        explanation: "Реактивные свойства через defineProperty."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать writable и configurable",
        why: "writable — можно ли менять значение. configurable — можно ли удалить/изменить дескриптор.",
        right: "writable = значение защищено. configurable = сама роль защищена."
      },
      {
        wrong: "Думать, что configurable: false нельзя изменить",
        why: "configurable: false запрещает удаление и изменение дескриптора, но writable: true позволяет менять значение.",
        right: "configurable: false ≠ readonly. Значение можно менять если writable: true."
      }
    ],
    importantToRemember: [
      "writable — можно ли менять значение",
      "enumerable — видно ли в циклах и Object.keys",
      "configurable — можно ли удалить/изменить дескриптор",
      "get/set — вместо value для вычисляемых свойств",
      "Object.defineProperty для точного контроля"
    ],
    realWorldUsage: "Sometimes. Основные use cases: приватные свойства, реактивность (Vue 2),заморозку объектов (Object.freeze), контроль свойств в библиотеках.",
    connection: {
      back: "Вы знаете объекты (J11). Дескрипторы дают низкоуровневый контроль над свойствами.",
      forward: "Следующий урок (JV16) — каррирование — преобразование функций для частичного применения."
    }
  },

  // ============================================
  // JV16 — Currying
  // ============================================
  {
    slug: "currying",
    track: "js-advanced",
    order: 16,
    title: "Каррирование (Currying)",
    summary: "Понять, как превратить f(a, b, c) в f(a)(b)(c), зачем это нужно, и когда каррирование уместно.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Rare",
    prerequisites: ["functions", "arrow-functions"],
    learningObjective: "После этого урока вы сможете реализовать каррирование вручную и с помощью вспомогательных функций и объяснять, когда полезно частичное применение.",
    shortExplanation: "Каррирование — превращение функции с несколькими аргументами в цепочку функций с одним аргументом. f(a, b, c) → f(a)(b)(c). Полезно для создания специализированных функций из общих. Но в обычном коде встречается редко.",
    detailedExplanation: "Простое каррирование:\nfunction add(a) {\n  return function(b) {\n    return a + b;\n  };\n}\n\nconst add5 = add(5);\nconsole.log(add5(3)); // 8\nconsole.log(add5(10)); // 15\n\nКаррирование сiple application:\nfunction log(level, timestamp, message) {\n  console.log(`[${level}] ${timestamp}: ${message}`);\n}\n\n// Каррированная версия\nfunction curriedLog(level) {\n  return function(timestamp) {\n    return function(message) {\n      console.log(`[${level}] ${timestamp}: ${message}`);\n    };\n  };\n}\n\nconst errorLog = curriedLog('ERROR')('2024-01-01');\nerrorLog('Something failed'); // [ERROR] 2024-01-01: Something failed\n\nУниверсальная утилита:\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}\n\nconst curriedAdd = curry((a, b, c) => a + b + c);\ncurriedAdd(1)(2)(3); // 6\ncurriedAdd(1, 2)(3); // 6\ncurriedAdd(1)(2, 3); // 6",
    mentalModel: "Каррирование — как пошаговая инструкция. Вместо «Сделай A, B и C сразу» — «Сделай A. Получил? Теперь B. Получил? Теперь C.» Каждый шаг фиксирует один аргумент.",
    examples: [
      {
        level: "minimal",
        code: "function multiply(a) {\n  return (b) => a * b;\n}\n\nconst double = multiply(2);\nconst triple = multiply(3);\n\nconsole.log(double(5)); // 10\nconsole.log(triple(5)); // 15",
        explanation: "Простейшее каррирование: создание специализированных функций."
      },
      {
        level: "simple",
        code: "// Curry утилита\nfunction curry(fn) {\n  return function curried(...args) {\n    return args.length >= fn.length\n      ? fn(...args)\n      : (...more) => curried(...args, ...more);\n  };\n}\n\nconst sum = curry((a, b, c) => a + b + c);\n\nconsole.log(sum(1)(2)(3)); // 6\nconsole.log(sum(1, 2)(3)); // 6\nconsole.log(sum(1)(2, 3)); // 6",
        explanation: "Универсальная curry утилита."
      },
      {
        level: "real",
        code: "// Каррирование для фильтрации\nconst users = [\n  { name: 'Анна', age: 25 },\n  { name: 'Борис', age: 30 },\n  { name: 'Вера', age: 20 },\n];\n\nconst filterBy = curry((key, value, arr) =>\n  arr.filter(item => item[key] === value)\n);\n\nconst filterByAge = filterBy('age');\nconst adults = filterByAge(25);\nconsole.log(adults); // [{ name: 'Анна', age: 25 }]",
        explanation: "Каррирование для создания специализированных фильтров."
      }
    ],
    commonMistakes: [
      {
        wrong: "Каррировать каждую функцию",
        why: "Каррирование полезно только для специфических паттернов. Большинство функций не нуждаются в каррировании.",
        right: "Каррируйте только когда это упрощает код: фабрики функций, pipeline, callback'и."
      },
      {
        wrong: "Путать каррирование и partial application",
        why: "Каррирование: f(a,b,c) → f(a)(b)(c). Partial application: f(a,b,c)(1) → фиксирует один аргумент.",
        right: "Каррирование — это частичный случай partial application."
      }
    ],
    importantToRemember: [
      "f(a,b,c) → f(a)(b)(c) — каррирование",
      "Создаёт специализированные функции из общих",
      "Полезно для: фабрик, pipeline, callback'ов",
      "В обычном коде встречается редко",
      "Functional programming паттерн"
    ],
    realWorldUsage: "Rare. Каррирование используется в: functional programming, Redux reducers, lodash/ramda. В обычном коде — редко. Полезно понимать при чтении FP-oriented кода.",
    connection: {
      back: "Вы знаете функции (J9) и стрелочные функции (J10). Каррирование преобразует сигнатуры функций.",
      forward: "Следующий урок (JV17) — побитовые операторы — низкоуровневые операции над числами."
    }
  },

  // ============================================
  // JV17 — Bitwise Operators
  // ============================================
  {
    slug: "bitwise-operators",
    track: "js-advanced",
    order: 17,
    title: "Побитовые операторы",
    summary: "Понять, как работают &, |, ^, ~, <<, >>, >>>, и где они реально используются в JavaScript.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Rare",
    prerequisites: ["operators", "data-types"],
    learningObjective: "После этого урока вы сможете выполнять побитовые операции, объяснять 32-битное представление целых чисел и находить реальные случаи их применения.",
    shortExplanation: "Побитовые операторы работают с 32-битными целыми числами: & (AND), | (OR), ^ (XOR), ~ (NOT), << (сдвиг влево), >> (сдвиг вправо), >>> (беззнаковый сдвиг). В web-коде используются редко, но полезны для: flags, permissions, color manipulation,побитовые операции.",
    detailedExplanation: "JS Number → 32-bit Integer:\nconsole.log(0b1010); // 10 (binary)\nconsole.log(0xFF);   // 255 (hex)\n\nОператоры:\n& (AND):  1 & 1 = 1, иначе 0\n| (OR):   0 | 0 = 0, иначе 1\n^ (XOR):  разные = 1, одинаковые = 0\n~ (NOT):  инвертирует все биты\n<< n:     сдвиг влево на n бит (умножение на 2^n)\n>> n:     сдвиг вправо на n бит (деление на 2^n)\n>>> n:    беззнаковый сдвиг\n\nПримеры:\nconst a = 0b1100; // 12\nconst b = 0b1010; // 10\n\nconsole.log(a & b);  // 0b1000 = 8\nconsole.log(a | b);  // 0b1110 = 14\nconsole.log(a ^ b);  // 0b0110 = 6\nconsole.log(~a);     // -13 (инверсия)\nconsole.log(a << 1); // 24\nconsole.log(a >> 1); // 6\n\nПобитовый NOT:\nconsole.log(~0);    // -1\nconsole.log(~-1);   // 0\nconsole.log(~~3.14); // 3 (truncation)\n\nРеальные use cases:\n1. Color manipulation\nconst r = 255, g = 128, b = 0;\nconst hex = (r << 16) | (g << 8) | b;\nconsole.log(hex); // 16744448 (0xFF8000)\n\n2. Flags/Permissions\nconst READ = 1;    // 001\nconst WRITE = 2;   // 010\nconst EXECUTE = 4; // 100\n\nlet permissions = READ | WRITE; // 011 = 3\npermissions |= EXECUTE;         // 111 = 7\npermissions &= ~WRITE;          // 101 = 5\n\n3. Quick division by power of 2\nconst half = x >> 1;\nconst quarter = x >> 2;",
    mentalModel: "Побитовые операторы — как переключатели на приборной панели. Каждый бит — это кнопка вкл/выкл. & — «обе кнопки нажаты?» | — «хотя бы одна нажата?» ^ — «нажаты по-разному?» ~ — «перевернуть все кнопки».",
    examples: [
      {
        level: "minimal",
        code: "const a = 5;  // 101\nconst b = 3;  // 011\n\nconsole.log(a & b);  // 1 (001)\nconsole.log(a | b);  // 7 (111)\nconsole.log(a ^ b);  // 6 (110)\nconsole.log(a << 1); // 10 (1010)\nconsole.log(a >> 1); // 2 (10)",
        explanation: "Базовые побитовые операции."
      },
      {
        level: "simple",
        code: "// Цвет → RGB\nfunction rgbToHex(r, g, b) {\n  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b)\n    .toString(16)\n    .slice(1);\n}\n\nconsole.log(rgbToHex(255, 128, 0)); // '#ff8000'\n\n// Быстрое умножение/деление на 2\nconsole.log(7 << 1); // 14 (×2)\nconsole.log(7 << 2); // 28 (×4)\nconsole.log(20 >> 1); // 10 (÷2)",
        explanation: "Побитовые операции для цвета и быстрой арифметики."
      },
      {
        level: "real",
        code: "// Система прав доступа\nconst Permission = {\n  READ:    1 << 0, // 001\n  WRITE:   1 << 1, // 010\n  EXECUTE: 1 << 2, // 100\n  ADMIN:   1 << 3  // 1000\n};\n\nlet userPerm = Permission.READ | Permission.WRITE;\n\nfunction hasPermission(user, perm) {\n  return (user & perm) === perm;\n}\n\nconsole.log(hasPermission(userPerm, Permission.READ));  // true\nconsole.log(hasPermission(userPerm, Permission.ADMIN)); // false",
        explanation: "Побитовые флаги для управления правами."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать побитовые операторы для boolean логики",
        why: "& и | работают с числами, не с boolean. && и || — для boolean.",
        right: "& | — побитовые. && || — логические."
      },
      {
        wrong: "Забывать, что JS побитовые операторы работают с 32-bit",
        why: "Числа больше 2^31-1 будут обрезаны.",
        right: "JS побитовые операторы: 32-bit signed integer."
      }
    ],
    importantToRemember: [
      "& — AND, | — OR, ^ — XOR, ~ — NOT",
      "<< >> — сдвиг (умножение/деление на 2^n)",
      "32-bit integer representation",
      "Редко нужен в web-коде",
      "Полезен для: цвета, флаги, права"
    ],
    realWorldUsage: "Rare. Побитовые операторы используются в: обработке изображений (canvas), системах прав доступа,.protocol handling. В обычном web-коде — практически никогда.",
    connection: {
      back: "Вы знаете операторы (J4). Побитовые операторы — низкоуровневое расширение.",
      forward: "Следующий урок (JV18) — BigInt — числа за пределами Number.MAX_SAFE_INTEGER."
    }
  },

  // ============================================
  // JV18 — BigInt
  // ============================================
  {
    slug: "bigint",
    track: "js-advanced",
    order: 18,
    title: "BigInt",
    summary: "Понять, когда Number недостаточен, как работает BigInt, и почему нельзя смешивать BigInt и Number.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["data-types", "number-methods"],
    learningObjective: "После этого урока вы сможете создавать значения BigInt, объяснять их отличие от Number и понимать, когда BigInt нужен.",
    shortExplanation: "BigInt — тип для целых чисел произвольной длины. Создаётся через суффикс n (123n) или BigInt(123). В отличие от Number: нет потери точности для больших целых. Ограничение: нельзя смешивать BigInt и Number в арифметике.",
    detailedExplanation: "Создание:\nconst big = 123n;\nconst fromNumber = BigInt(123);\nconst fromString = BigInt('9007199254740993');\n\nNumber vs BigInt:\nconsole.log(Number.MAX_SAFE_INTEGER); // 9007199254740991\nconsole.log(9007199254740992 === 9007199254740993); // true (потеря точности!)\nconsole.log(9007199254740992n === 9007199254740993n); // false (точно!)\n\nОграничение — нельзя смешивать:\nconst result = 1n + 1; // TypeError: Cannot mix BigInt and other types\nconst result2 = 1n + BigInt(1); // 2n (OK)\nconst result3 = Number(1n) + 1; // 2 (OK, но может потерять точность)\n\nСравнение (работает):\nconsole.log(1n == 1);  // true\nconsole.log(1n === 1); // false (разные типы)\nconsole.log(1n < 2);   // true\n\nОкругление:\nconsole.log(Number(123n)); // 123\nconsole.log(123n.toString()); // '123'\n\nИспользование:\n- Криптовалюты (целые сатоши)\n- ID баз данных (64-bit integers)\n- Точные вычисления с большими числами",
    mentalModel: "BigInt — как калькулятор с бесконечным дисплеем. Обычный Number — калькулятор с 16-значным дисплеем (теряет точность после 15-16 цифр). BigInt — калькулятор, который помнит каждую цифру, но не понимает дробей.",
    examples: [
      {
        level: "minimal",
        code: "const a = 123456789012345678901234567890n;\nconst b = BigInt('999999999999999999999');\n\nconsole.log(a + b); // 123456789012345678901345678889n\nconsole.log(typeof a); // 'bigint'",
        explanation: "BigInt: создание и арифметика."
      },
      {
        level: "simple",
        code: "// Number: потеря точности\nconsole.log(9007199254740992 + 1); // 9007199254740992 (ошибка!)\n\n// BigInt: точно\nconsole.log(9007199254740992n + 1n); // 9007199254740993n\n\n// Сравнение\nconsole.log(1n == 1);  // true (приведение типа)\nconsole.log(1n === 1); // false (разные типы)",
        explanation: "Number vs BigInt: точность больших целых."
      },
      {
        level: "real",
        code: "// Криптовалюта: сатоши (1 BTC = 10^8 satoshi)\nconst satoshiBalance = 2100000000000000n; // 21 млн BTC в сатоши\n\nfunction toBTC(satoshi) {\n  return Number(satoshi) / 100000000;\n}\n\nconsole.log(toBTC(satoshiBalance)); // 21000000\n\n// ID базы данных\nconst userId = BigInt('1234567890123456789');\nconsole.log(userId.toString()); // '1234567890123456789'",
        explanation: "Реальные use cases: криптовалюта, ID баз данных."
      }
    ],
    commonMistakes: [
      {
        wrong: "Смешивать BigInt и Number в арифметике",
        why: "1n + 1 — TypeError. Нужно явно преобразовывать.",
        right: "BigInt(1) + 1n или Number(1n) + 1."
      },
      {
        wrong: "Использовать BigInt для дробных чисел",
        why: "BigInt работает только с целыми. Для дробных — Number.",
        right: "BigInt = целые. Number = целые + дробные (с ограничением точности)."
      },
      {
        wrong: "Забывать, что BigInt медленнее Number",
        why: "BigInt — произвольная точность, что медленнее фиксированных 64-bit float.",
        right: "Используйте BigInt только когда Number недостаточен."
      }
    ],
    importantToRemember: [
      "BigInt: суффикс n или BigInt()",
      "Точнее Number для больших целых",
      "Нельзя смешивать BigInt и Number",
      "=== всегда false (разные типы)",
      "Используйте только когда нужно"
    ],
    realWorldUsage: "Sometimes. Основные use cases: криптовалюты, 64-bit ID, точные вычисления. В обычном web-коде BigInt нужен редко.",
    connection: {
      back: "Вы знаете типы (J3) и числа (J21). BigInt расширяет систему чисел.",
      forward: "Следующий урок (JV19) — Intl — API интернационализации."
    }
  },

  // ============================================
  // JV19 — Intl
  // ============================================
  {
    slug: "intl",
    track: "js-advanced",
    order: 19,
    title: "Intl — интернационализация",
    summary: "Понять, как использовать Intl.NumberFormat, Intl.DateTimeFormat и Intl.RelativeTimeFormat для локализации.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["data-types", "string-methods", "date"],
    learningObjective: "После этого урока вы сможете форматировать числа, даты и относительное время для разных локалей с помощью API Intl.",
    shortExplanation: "Intl — встроенный модуль JavaScript для интернационализации. Intl.NumberFormat форматирует числа (валюты, проценты). Intl.DateTimeFormat — даты. Intl.RelativeTimeFormat — относительное время (2 часа назад). Все работают с разными локалями.",
    detailedExplanation: "Intl.NumberFormat:\nconst formatter = new Intl.NumberFormat('ru-RU', {\n  style: 'currency',\n  currency: 'RUB'\n});\nconsole.log(formatter.format(1234567.89)); // '1 234 567,89 ₽'\n\nconst percent = new Intl.NumberFormat('en-US', {\n  style: 'percent'\n});\nconsole.log(percent.format(0.85)); // '85%'\n\nIntl.DateTimeFormat:\nconst date = new Date();\n\nconst ru = new Intl.DateTimeFormat('ru-RU', {\n  dateStyle: 'full',\n  timeStyle: 'short'\n});\nconsole.log(ru.format(date)); // 'воскресенье, 4 сентября 2026 г., 14:30'\n\nconst us = new Intl.DateTimeFormat('en-US', {\n  year: 'numeric',\n  month: 'long',\n  day: 'numeric'\n});\nconsole.log(us.format(date)); // 'September 4, 2026'\n\nIntl.RelativeTimeFormat:\nconst rtf = new Intl.RelativeTimeFormat('ru-RU', {\n  numeric: 'auto'\n});\nconsole.log(rtf.format(-1, 'day')); // 'вчера'\nconsole.log(rtf.format(-2, 'day')); // '2 дня назад'\nconsole.log(rtf.format(1, 'hour')); // 'через час'\n\nЛокали:\n- 'ru-RU' — русский (Россия)\n- 'en-US' — английский (США)\n- 'de-DE' — немецкий (Германия)\n- 'ja-JP' — японский (Япония)",
    mentalModel: "Intl — как переводчик для чисел и дат. Вы говорите: «Покажи 1234567 как валюту по-русски». Intl отвечает: «1 234 567,89 ₽». По-немецки: «1.234.567,89 €». По-японски: 「¥1,234,567」.",
    examples: [
      {
        level: "minimal",
        code: "const num = 1234567.89;\n\nconsole.log(new Intl.NumberFormat('ru-RU').format(num)); // '1 234 567,89'\nconsole.log(new Intl.NumberFormat('en-US').format(num)); // '1,234,567.89'\nconsole.log(new Intl.NumberFormat('de-DE').format(num)); // '1.234.567,89'",
        explanation: "Форматирование чисел для разных локалей."
      },
      {
        level: "simple",
        code: "// Валюта\nconst price = 49.99;\nconst rub = new Intl.NumberFormat('ru-RU', {\n  style: 'currency', currency: 'RUB'\n}).format(price);\nconst usd = new Intl.NumberFormat('en-US', {\n  style: 'currency', currency: 'USD'\n}).format(price);\n\nconsole.log(rub); // '49,99 ₽'\nconsole.log(usd); // '$49.99'\n\n// Дата\nconst date = new Date('2026-09-04');\nconsole.log(new Intl.DateTimeFormat('ru-RU', {\n  dateStyle: 'long'\n}).format(date)); // '4 сентября 2026 г.'",
        explanation: "Валюта и дата в разных форматах."
      },
      {
        level: "real",
        code: "// Относительное время\nfunction timeAgo(date) {\n  const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' });\n  const diff = date - new Date();\n  const seconds = Math.floor(diff / 1000);\n  const minutes = Math.floor(seconds / 60);\n  const hours = Math.floor(minutes / 60);\n  const days = Math.floor(hours / 24);\n\n  if (Math.abs(days) > 0) return rtf.format(days, 'day');\n  if (Math.abs(hours) > 0) return rtf.format(hours, 'hour');\n  if (Math.abs(minutes) > 0) return rtf.format(minutes, 'minute');\n  return rtf.format(seconds, 'second');\n}\n\nconsole.log(timeAgo(new Date(Date.now() - 3600000))); // 'час назад'\nconsole.log(timeAgo(new Date(Date.now() + 86400000))); // 'завтра'",
        explanation: "Реальный пример: relative time для соцсетей."
      }
    ],
    commonMistakes: [
      {
        wrong: "Писать собственные форматы вместо Intl",
        why: "Intl учитывает все особенности локалей (разделители, порядок, склонения).",
        right: "Используйте Intl — он уже знает все правила форматирования."
      },
      {
        wrong: "Путать locale и language",
        why: "Locale — это язык + регион (ru-RU vs ru-UA). Language — только язык (ru).",
        right: "Locale = language + region (en-US vs en-GB)."
      }
    ],
    importantToRemember: [
      "Intl.NumberFormat — числа и валюты",
      "Intl.DateTimeFormat — даты и время",
      "Intl.RelativeTimeFormat — относительное время",
      "Локали: 'ru-RU', 'en-US', 'de-DE'",
      "Все форматы учитывают особенности локалей"
    ],
    realWorldUsage: "Sometimes. Основные use cases: валюты, даты, relative time в UI. В любом проекте с internationalization — обязательно. В простых проектах — при необходимости.",
    connection: {
      back: "Вы знаете типы (J3) и дату (J19). Intl даёт форматирование с учётом локали.",
      forward: "Следующий урок (JV20) — WeakRef и FinalizationRegistry."
    }
  },

  // ============================================
  // JV20 — WeakRef
  // ============================================
  {
    slug: "weakref",
    track: "js-advanced",
    order: 20,
    title: "WeakRef и FinalizationRegistry",
    summary: "Понять, как WeakRef создаёт слабые ссылки на объекты и как FinalizationRegistry уведомляет об удалении. Почему GC timing недетерминирован.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Rare",
    prerequisites: ["weakmap-weakset", "objects"],
    learningObjective: "После этого урока вы сможете создавать WeakRef, использовать .deref() и объяснять FinalizationRegistry. Узнаете, когда их НЕ стоит использовать.",
    shortExplanation: "WeakRef — объект-ссылка на другой объект. .deref() возвращает объект или undefined (если GC уже удалил). FinalizationRegistry — callback при удалении объекта. GC timing недетерминирован — нельзя полагаться на порядок удаления.",
    detailedExplanation: "WeakRef:\nlet target = { heavy: 'data' };\nconst ref = new WeakRef(target);\n\nconsole.log(ref.deref()); // { heavy: 'data' }\n\ntarget = null; // объект может быть собран GC\n\n// Позже (GC неопределённо когда)\nconsole.log(ref.deref()); // undefined (или объект, если GC не сработал)\n\nFinalizationRegistry:\nconst registry = new FinalizationRegistry((heldValue) => {\n  console.log(`Объект ${heldValue} удалён`);\n});\n\nlet obj = { data: 'важные данные' };\nregistry.register(obj, 'myObject');\n\nobj = null; // GC может удалить → callback вызовется\n\nОграничения:\n- .deref() может вернуть undefined в любой момент\n- GC timing НЕ детерминирован\n- Нельзя полагаться на порядок удаления\n- WeakRef + FinalizationRegistry = niche API\n\nГде НЕ использовать:\n- Как основной механизм управления памятью\n- В критических системах\n- Где нужна предсказуемость",
    mentalModel: "WeakRef — как адрес пропавшего человека. Вы знаете адрес (ref), но не уверены, жив ли ещё человек (объект). .deref() — проверка: «Ещё здесь?» (undefined — нет). FinalizationRegistry — уведомление от соседей: «Он уехал».",
    examples: [
      {
        level: "minimal",
        code: "let obj = { value: 42 };\nconst ref = new WeakRef(obj);\n\nconsole.log(ref.deref()); // { value: 42 }\n\nobj = null;\n// GC может удалить объект\n// ref.deref() вернёт undefined",
        explanation: "Простейший WeakRef: ссылка на объект."
      },
      {
        level: "simple",
        code: "// FinalizationRegistry\nconst registry = new FinalizationRegistry((id) => {\n  console.log(`Cache entry ${id} cleaned up`);\n});\n\nfunction createCachedObject(id) {\n  const obj = { data: `Cache: ${id}` };\n  registry.register(obj, id);\n  return obj;\n}\n\nlet cache = createCachedObject('user-123');\ncache = null; // GC → 'Cache entry user-123 cleaned up'",
        explanation: "FinalizationRegistry для очистки кэша."
      },
      {
        level: "real",
        code: "// WeakRef cache (с проверкой)\nclass WeakCache {\n  #cache = new Map();\n  #registry = new FinalizationRegistry((key) => {\n    this.#cache.delete(key);\n  });\n\n  get(key) {\n    const ref = this.#cache.get(key);\n    if (ref) {\n      const obj = ref.deref();\n      if (obj !== undefined) return obj;\n      this.#cache.delete(key);\n    }\n    return undefined;\n  }\n\n  set(key, obj) {\n    this.#cache.set(key, new WeakRef(obj));\n    this.#registry.register(obj, key);\n  }\n}",
        explanation: "Реальный паттерн: WeakRef cache с automatic cleanup."
      }
    ],
    commonMistakes: [
      {
        wrong: "Полагаться на .deref() для критических данных",
        why: "GC может удалить объект в любой момент — .deref() вернёт undefined.",
        right: "WeakRef = best-effort. Не используйте для данных, которые обязаны существовать."
      },
      {
        wrong: "Думать, что FinalizationRegistry вызывается immediately",
        why: "FinalizationRegistry callback вызывается НЕ определённо когда (после GC).",
        right: "FinalizationRegistry = уведомление, не гарантия."
      }
    ],
    importantToRemember: [
      "WeakRef: слабая ссылка на объект",
      ".deref() возвращает объект или undefined",
      "FinalizationRegistry: callback при удалении",
      "GC timing недетерминирован",
      "Не используйте для критических данных"
    ],
    realWorldUsage: "Rare. WeakRef используется в: specialized caches, internal mechanics фреймворков. В обычном коде — практически никогда.",
    connection: {
      back: "Вы знаете WeakMap/WeakSet (JV5). WeakRef — более низкоуровневый механизм слабых ссылок.",
      forward: "Следующий урок (JV21) — eval — выполнение строк как кода."
    }
  },

  // ============================================
  // JV21 — eval
  // ============================================
  {
    slug: "eval",
    track: "js-advanced",
    order: 21,
    title: "eval",
    summary: "Понять, что eval выполняет строку как JavaScript, почему это опасно, и какие альтернативы существуют.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Avoid in ordinary code",
    prerequisites: ["functions", "data-types"],
    learningObjective: "После этого урока вы сможете объяснить, что делает eval, перечислить риски безопасности и производительности и знать более безопасные альтернативы.",
    shortExplanation: "eval(string) выполняет строку как JavaScript-код. Опасно: security risks (инъекции), performance (оптимизатор не может оптимизировать), debugging (ошибки не видны заранее). Альтернативы: JSON.parse, Function constructor, шаблонные строки.",
    detailedExplanation: "Что делает eval:\neval('console.log(\"Hello\")'); // выполняет строку\n\nДоступ к переменным окружения:\nconst x = 10;\neval('x + 5'); // 15\n\nОпасности:\n1. Security: eval выполняет ЛЮБОЙ код\nfunction unsafe(input) {\n  eval(input); // input = 'document.cookie' → кража данных!\n}\n\n2. Performance: JavaScript engine не может оптимизировать eval\n// Обычный код: engine оптимизирует\n// eval: engine не знает что будет\n\n3. Debugging: ошибки не видны заранее\n// Обычный код: линтер видит ошибки\n// eval: ошибка только в runtime\n\n4. Scope pollution:\nfunction test() {\n  eval('var x = 10;');\n  console.log(x); // 10 — x появился в scope!\n}\n\nАльтернативы:\n- JSON.parse(json) — вместо eval('(' + json + ')')\n- new Function(args, body) — изолированный eval\n- Шаблонные строки — для динамических значений\n- switch/if — для динамической логики",
    mentalModel: "eval — как открыть дверь настежь для незнакомца. Вы не знаете, что он принесёт (код). Может быть полезный подарок (динамический код), но обычно это взлом (security risk). Безопаснее — смотреть через окошко (JSON.parse) или звонить в дверь (new Function).",
    examples: [
      {
        level: "minimal",
        code: "// eval — выполняет строку как код\neval('2 + 2'); // 4\n\n// Но опасно:\nconst userInput = 'alert(\"hacked!\")';\neval(userInput); // выполнит alert!",
        explanation: "eval выполняет произвольный код из строки."
      },
      {
        level: "simple",
        code: "// Альтернатива eval для JSON\nconst json = '{\"name\": \"Анна\", \"age\": 25}';\n\n// ОПАСНО:\n// const obj = eval('(' + json + ')');\n\n// БЕЗОПАСНО:\nconst obj = JSON.parse(json);\nconsole.log(obj.name); // 'Анна'",
        explanation: "JSON.parse — безопасная альтернатива eval для JSON."
      },
      {
        level: "real",
        code: "// new Function — более безопасная альтернатива\nfunction createMultiplier(factor) {\n  return new Function('x', `return x * ${factor}`);\n}\n\nconst double = createMultiplier(2);\nconsole.log(double(5)); // 10\n\n// Важно: factor подставляется через строку,\n// поэтому нужно санитизировать вход!\n// new Function всё ещё опасен при user input.",
        explanation: "new Function как более безопасная (но не полностью) альтернатива."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать eval для парсинга JSON",
        why: "eval выполняет ЛЮБОЙ код, не только JSON. Это уязвимость.",
        right: "Используйте JSON.parse() — он парсит ТОЛЬКО JSON."
      },
      {
        wrong: "Думать, что eval безопасен с локальной строкой",
        why: "Даже локальная строка может содержать опасный код при динамическом формировании.",
        right: "eval опасен ВСЕГДА. Используйте безопасные альтернативы."
      }
    ],
    importantToRemember: [
      "eval выполняет строку как JavaScript",
      "Опасно: security, performance, debugging",
      "Используйте JSON.parse вместо eval для JSON",
      "new Function — более безопасная альтернатива",
      "Избегайте eval в обычном коде"
    ],
    realWorldUsage: "Avoid in ordinary code. eval используется в: динамических шаблонах (редко), legacy коде, инструментах разработки. В современном коде eval практически никогда не нужен.",
    connection: {
      back: "Вы знаете функции (J9) и типы (J3). eval — глобальная функция для динамического выполнения кода.",
      forward: "Следующий урок (JV22) — new Function — похожий, но немного иной механизм."
    }
  },

  // ============================================
  // JV22 — new Function
  // ============================================
  {
    slug: "new-function",
    track: "js-advanced",
    order: 22,
    title: "new Function",
    summary: "Понять, как new Function создаёт функции из строк, чем отличается от eval, и почему обычно избегается.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Rare",
    prerequisites: ["functions", "eval"],
    learningObjective: "После этого урока вы сможете использовать new Function, объяснять его поведение с областью видимости и сравнивать с eval.",
    shortExplanation: "new Function(arg1, arg2, ..., body) создаёт функцию из строки. Отличие от eval: создаёт новую функцию с изолированным scope (не видит локальные переменные). Но всё ещё опасен при user input. Используется в: шаблонизаторах, клиентах API.",
    detailedExplanation: "Синтаксис:\nconst sum = new Function('a', 'b', 'return a + b');\nconsole.log(sum(1, 2)); // 3\n\nПоследний аргумент — тело функции:\nconst greet = new Function('name', 'return `Hello, ${name}!`');\nconsole.log(greet('Анна')); // 'Hello, Анна!'\n\nОтличие от eval:\n// eval — выполняет в текущем scope\nconst x = 10;\neval('x + 5'); // 15 — видит x\n\n// new Function — создаёт новый scope\nconst fn = new Function('return x + 5');\n// fn(); // ReferenceError: x is not defined\n\nПочему существует:\n- Динамическое создание функций из строк\n- Шаблонизаторы (Handlebars, EJS)\n- Клиенты API (gRPC-web)\n\nПочему обычно избегается:\n- Опасно (как eval)\n- Не оптимизируется движком\n- Линтер не видит ошибки\n- Трудно отлаживать",
    mentalModel: "new Function — как конструктор функции из чертежа. Вы даёте ему список параметров и тело (как строку). Он строит функцию. Но unlike eval — функция строится в изолированном цеху (новый scope).",
    examples: [
      {
        level: "minimal",
        code: "const multiply = new Function('a', 'b', 'return a * b');\nconsole.log(multiply(3, 4)); // 12\n\n// Эквивалент:\n// function multiply(a, b) { return a * b; }",
        explanation: "Простейшая функция из строки."
      },
      {
        level: "simple",
        code: "// new Function vs eval\nconst localVar = 42;\n\n// eval видит localVar\neval('console.log(localVar)'); // 42\n\n// new Function НЕ видит localVar\ntry {\n  const fn = new Function('console.log(localVar)');\n  fn(); // ReferenceError\n} catch (e) {\n  console.log('Функция не видит внешние переменные');\n}",
        explanation: "new Function изолирует scope — не видит внешние переменные."
      },
      {
        level: "real",
        code: "// Динамический шаблон\nfunction createTemplate(template) {\n  return new Function('data', `\n    return \`${template}\`;\n  `);\n}\n\nconst userTemplate = createTemplate('Привет, ${data.name}!');\nconsole.log(userTemplate({ name: 'Анна' })); // 'Привет, А́нна!'\n\n// Важно: template безопасен только если не содержит user input!\n// Если template = user input — это eval с теми же рисками.",
        explanation: "Динамический шаблон: new Function для генерации функций."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что new Function безопаснее eval",
        why: "new Function изолирует scope, но всё ещё выполняет произвольный код.",
        right: "new Function = eval + изолированный scope. Всё ещё опасен."
      },
      {
        wrong: "Использовать new Function для простых функций",
        why: "Обычные function declaration/expression проще, безопаснее и быстрее.",
        right: "new Function только для динамического создания из строк."
      }
    ],
    importantToRemember: [
      "new Function(args, body) — создаёт функцию из строки",
      "Изолирует scope (не видит локальные переменные)",
      "Всё ещё опасен (как eval)",
      "Используется в шаблонизаторах",
      "Предпочитайте обычные функции"
    ],
    realWorldUsage: "Rare. new Function используется в: шаблонизаторах (Handlebars), клиентах API (gRPC-web), динамических конфигурациях. В обычном коде — практически никогда.",
    connection: {
      back: "Вы знаете eval (JV21). new Function — родственный механизм с изолированной областью видимости.",
      forward: "Следующий урок (JV23) — обёртки примитивов — как примитивы получают методы."
    }
  },

  // ============================================
  // JV23 — Primitive Wrappers
  // ============================================
  {
    slug: "primitive-wrappers",
    track: "js-advanced",
    order: 23,
    title: "Обёртки примитивов",
    summary: "Понять, как JavaScript временно создаёт объекты-обёртки (String, Number, Boolean) для вызова методов примитивов.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "LOW",
    recommendedUsage: "Rare",
    prerequisites: ["data-types", "string-methods", "number-methods"],
    learningObjective: "После этого урока вы сможете объяснить упаковку (boxing), отличать примитив от объекта-обёртки и понимать, почему new String() не рекомендуется.",
    shortExplanation: "Когда вы вызываете метод примитива ('hello'.length), JavaScript временно создаёт объект-обёрку (new String('hello')). После вызова метода обёртка удаляется. Примитив ≠ объект: typeof 'hello' = 'string', typeof new String('hello') = 'object'. new String() не рекомендуется.",
    detailedExplanation: "Boxing behavior:\nconst str = 'hello';\nconsole.log(str.toUpperCase()); // 'HELLO'\n\nЧто происходит:\n1. str — примитив 'string'\n2. JavaScript создаёт: new String(str)\n3. Вызывает: .toUpperCase() на объекте\n4. Объект удаляется\n5. Возвращается примитив 'HELLO'\n\nПримитив vs Wrapper:\nconst prim = 'hello';\nconst obj = new String('hello');\n\nconsole.log(typeof prim); // 'string'\nconsole.log(typeof obj);  // 'object'\nconsole.log(prim === obj); // false\n\nnew String() — проблемы:\nconst s1 = new String('hello');\nconst s2 = new String('hello');\nconsole.log(s1 == s2);  // true (приведение к примитиву)\nconsole.log(s1 === s2); // false (разные объекты!)\n\nТо же для Number и Boolean:\nconst n = new Number(5);\nconst b = new Boolean(true);\nconsole.log(typeof n); // 'object'\nconsole.log(typeof b); // 'object'\n\nПочему new String() не нужен:\n- Примитивы уже имеют методы (boxing)\n- new String() создаёт object, не string\n- Сравнения работают некорректно\n- Линтеры запрещают new String/Number/Boolean",
    mentalModel: "Обёртка — как временный костюм. Примитив 'hello' — обычный человек. Когда он хочет вызвать метод (.toUpperCase()) — он надевает костюм объекта (new String()). Метод работает. Костюм снимается. Человек снова примитив.",
    examples: [
      {
        level: "minimal",
        code: "const str = 'hello';\nconsole.log(str.length);      // 5 (boxing)\nconsole.log(str.toUpperCase()); // 'HELLO'\n\n// Автоматически:\n// 1. Создаётся new String('hello')\n// 2. Вызывается метод\n// 3. Объект удаляется",
        explanation: "Boxing: примитив временно становится объектом для вызова метода."
      },
      {
        level: "simple",
        code: "const prim = 'hello';\nconst obj = new String('hello');\n\nconsole.log(typeof prim); // 'string'\nconsole.log(typeof obj);  // 'object'\n\nconsole.log(prim === obj); // false\nconsole.log(prim == obj);  // true (приведение)\n\n// Поэтому new String() — плохая идея\n// Примитив уже имеет все методы",
        explanation: "Примитив ≠ объект-обёртка."
      },
      {
        level: "real",
        code: "// Автоматический boxing в действии\nfunction getLength(value) {\n  // Если value — примитив,boxing создаёт объект\n  // Если value — null/undefined — ошибка\n  return value.length;\n}\n\nconsole.log(getLength('hello')); // 5\nconsole.log(getLength([1, 2, 3])); // 3\n// console.log(getLength(null)); // TypeError\n// console.log(getLength(undefined)); // TypeError",
        explanation: "Boxing работает для всех примитивов: string, number, boolean."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать new String() / new Number()",
        why: "Создаёт объект, а не примитив. Сравнения и typeof работают некорректно.",
        right: "Используйте примитивы: 'hello', 5, true. Методы работают через boxing."
      },
      {
        wrong: "Путать typeof для wrapper объектов",
        why: "typeof new String('hello') = 'object', а не 'string'.",
        right: "typeof wrapper = 'object'. typeof primitive = 'string'/'number'/'boolean'."
      }
    ],
    importantToRemember: [
      "Boxing: примитив временно становится объектом",
      "typeof wrapper = 'object', typeof primitive = 'string'/'number'/'boolean'",
      "new String/Number/Boolean не рекомендуется",
      "Примитивы уже имеют методы через boxing",
      "null и undefined НЕ имеют методов"
    ],
    realWorldUsage: "Rare. Знание о boxing полезно для понимания, почему примитивы имеют методы. new String() не используется в modern коде.",
    connection: {
      back: "Вы знаете типы (J3). Обёртки примитивов объясняют, как примитивы получают методы.",
      forward: "Следующий урок (JV24) — сборка мусора — как JavaScript управляет памятью."
    }
  },

  // ============================================
  // JV24 — Garbage Collection
  // ============================================
  {
    slug: "garbage-collection",
    track: "js-advanced",
    order: 24,
    title: "Сборка мусора (Garbage Collection)",
    summary: "Понять, как JavaScript определяет unreachable объекты и удаляет их, и почему GC timing недетерминирован.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["objects", "data-types"],
    learningObjective: "После этого урока вы сможете объяснить достижимость (reachability), находить типичные утечки памяти и понимать, почему время сборки мусора недетерминировано.",
    shortExplanation: "Garbage Collection (GC) автоматически удаляет unreachable объекты. Объект unreachable, когда нет ни одной ссылки на него. Типичные memory leaks: забытые event listeners, глобальные переменные, замыкания, DOM-ссылки. GC timing недетерминирован — нельзя предсказать, когда GC сработает.",
    detailedExplanation: "Доступность (reachability):\n\n// Доступен:\nlet user = { name: 'Анна' };\n// { name: 'Анна' } — reachable через user\n\n// Недоступен:\nuser = null;\n// { name: 'Анна' } — unreachable, GC удалит\n\nКорневые объекты (root):\n- global object (window)\n- текущий call stack (локальные переменные)\n- DOM-дерево\n\nТипичные memory leaks:\n\n1. Забытый event listener:\nfunction setup() {\n  const button = document.querySelector('button');\n  button.addEventListener('click', () => {\n    // closured переменные не удаляются\n  });\n}\n// Если button удалён из DOM — listener всё ещё существует!\n\n2. Глобальные переменные:\nfunction leak() {\n  hugeData = new Array(1000000).fill('x'); // нет let/const!\n}\n// hugeData — в window, никогда не удалится\n\n3. Замыкания:\nfunction createLeak() {\n  const big = new Array(1000000);\n  return function() {\n    // big недоступен, но замыкание может удерживать ссылку\n    return 'done';\n  };\n}\n\n4. DOM-ссылки:\nconst elements = {};\nfunction addItem(element) {\n  elements[element.id] = element;\n  // element не удалится из DOM, даже если remove()\n}\n\nGC timing:\n// НЕ детерминирован!\n// НЕ определённый интервал\n// НЕ определённый порядок\n// Зависит от: engine, памяти, нагрузки",
    mentalModel: "GC — как уборщик в отеле. Он приходит, когда решает (не по расписанию). Проверяет: «Есть ли кто-нибудь, кому нужна эта комната (объект)?» Если нет — забирает мебель (удаляет объект). Вы не контролируете, когда он придёт.",
    examples: [
      {
        level: "minimal",
        code: "// Reachable → не удаляется\nlet obj = { data: 1 };\nconsole.log(obj); // { data: 1 }\n\n// Unreachable → GC удалит\nobj = null;\n// Объект { data: 1 } теперь unreachable",
        explanation: "Доступность: если нет ссылки — объект удалится."
      },
      {
        level: "simple",
        code: "// Memory leak: забытый listener\nfunction setupButton() {\n  const button = document.querySelector('#btn');\n  const handler = () => console.log('clicked');\n  button.addEventListener('click', handler);\n  // Если button удалён из DOM —\n  // handler и button всё ещё в памяти!\n}\n\n// Безопасно:\nfunction safeSetup() {\n  const button = document.querySelector('#btn');\n  const handler = () => console.log('clicked');\n  button.addEventListener('click', handler);\n  return () => button.removeEventListener('click', handler);\n}",
        explanation: "Memory leak: event listener на удалённом элементе."
      },
      {
        level: "real",
        code: "// Memory leak: замыкание с лишними данными\nfunction createProcessor() {\n  const hugeBuffer = new Array(1000000).fill(0);\n\n  // Опасно: замыкание удерживает hugeBuffer\n  return function process(smallData) {\n    return smallData * 2;\n    // hugeBuffer не используется, но ссылка существует!\n  };\n}\n\n// Безопасно: не захватывать hugeBuffer\nfunction createSafeProcessor() {\n  const hugeBuffer = new Array(1000000).fill(0);\n  const result = hugeBuffer.reduce((sum, x) => sum + x, 0);\n\n  // hugeBuffer больше не нужен\n  return function process(smallData) {\n    return smallData * 2;\n  };\n}",
        explanation: "Memory leak: замыкание захватывает неиспользуемые данные."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что GC работает с фиксированным интервалом",
        why: "GC timing недетерминирован — зависит от engine и нагрузки.",
        right: "GC = когда решит движок. Нельзя предсказать или контролировать."
      },
      {
        wrong: "Полагаться на window + null для очистки",
        why: "set window = null не очищает автоматически — GC удалит, когда решит.",
        right: "Устанавливайте null для создания unreachable, но не ожидайте мгновенного удаления."
      }
    ],
    importantToRemember: [
      "GC удаляет unreachable объекты",
      "Root: window, call stack, DOM",
      "Memory leaks: listeners, globals, closures, DOM refs",
      "GC timing недетерминирован",
      "Минимизируйте захват переменных в замыканиях"
    ],
    realWorldUsage: "Sometimes. Понимание GC помогает избегать memory leaks. Основные паттерны: removeEventListener, не захватывать лишние данные в замыканиях, использовать WeakMap/WeakSet для кэшей.",
    connection: {
      back: "Вы знаете объекты (J11) и типы (J3). Сборка мусора управляет памятью этих объектов.",
      forward: "Следующий урок (JV25) — полифиллы и транспиляция — как заставить новый код работать в старых средах."
    }
  },

  // ============================================
  // JV25 — Polyfills и Transpilation
  // ============================================
  {
    slug: "polyfills-transpilation",
    track: "js-advanced",
    order: 25,
    title: "Polyfills и транспиляция",
    summary: "Различить polyfill (добавление недостающего API) и transpilation (преобразование нового синтаксиса в старый), и понять их роль в modern development.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "MEDIUM",
    recommendedUsage: "Sometimes",
    prerequisites: ["code-style", "modules"],
    learningObjective: "После этого урока вы сможете отличать полифиллы от транспиляции, объяснять их назначение и понимать, когда нужен каждый из них.",
    shortExplanation: "Polyfill — код, добавляющий недостающий API (Promise, fetch) в старые браузеры. Transpilation — преобразование нового синтаксиса (classes, arrow functions) в старый. Babel — транспилятор. core-js — коллекция polyfills. В modern development оба используются автоматически.",
    detailedExplanation: "Polyfill — добавление API:\n// Старый браузер не имеет Promise\n// Polyfill добавляет:\nif (!window.Promise) {\n  window.Promise = function(executor) {\n    // ... реализация Promise\n  };\n}\n\n// Теперь Promise доступен во всех браузерах\n\nTranspilation — преобразование синтаксиса:\n// Современный код:\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\n// После транспиляции (Babel):\nfunction User(name) {\n  this.name = name;\n}\n\nBabel:\n- Транспилятор: новый JS → старый JS\n- Плагины: для каждого нового фича\n- Presets: наборы плагинов (es2015, es2017, env)\n\ncore-js:\n- Коллекция polyfills\n- Включает: Promise, Map, Set, Symbol, Array.from и др.\n\nСовременный подход:\n- Vite, webpack, Next.js используют Babel/SWC автоматически\n- browserslist определяет целевые браузеры\n- Полифиллы подключаются автоматически\n\nКогда НЕ нужно:\n- Если целевые браузеры поддерживают нужные фичи\n- Если используете modern bundler с правильной конфигурацией",
    mentalModel: "Polyfill — как запчасть для старой машины. Новая деталь (Promise) не подходит к старому двигателю (браузеру). Polyfill — переходник, который делает новую деталь совместимой. Transpilation — как переводчик: новый синтаксис переводится на старый язык.",
    examples: [
      {
        level: "minimal",
        code: "// Polyfill: добавляем Array.from если нет\nif (!Array.from) {\n  Array.from = function(arrayLike) {\n    return [].slice.call(arrayLike);\n  };\n}\n\n// Теперь Array.from работает в старых браузерах\nconst arr = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']",
        explanation: "Простейший polyfill для Array.from."
      },
      {
        level: "simple",
        code: "// Transpilation: class → function\n// Вход (современный JS):\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound`;\n  }\n}\n\n// Выход (старый JS, после Babel):\nfunction Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function() {\n  return this.name + ' makes a sound';\n};",
        explanation: "Транспиляция (transpilation): синтаксис class превращается в обычные функции и прототипы."
      },
      {
        level: "real",
        code: "// Современный подход: Vite + browserslist\n// package.json\n{\n  \"browserslist\": [\n    \"> 1%\",\n    \"last 2 versions\",\n    \"not dead\"\n  ]\n}\n\n// Vite автоматически:\n// 1. Транспилирует новый синтаксис (Babel/SWC)\n// 2. Добавляет polyfills при необходимости (core-js)\n// 3. Оптимизирует для целевых браузеров",
        explanation: "Автоматическая транспиляция и polyfills в modern bundlers."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать polyfill и transpilation",
        why: "Polyfill = добавление API. Transpilation = преобразование синтаксиса.",
        right: "Polyfill закрывает пробелы в API. Transpilation переводит синтаксис."
      },
      {
        wrong: "Подключать polyfills вручную",
        why: "Modern bundlers (Vite, webpack) делают это автоматически.",
        right: "Доверьтесь bundler'у. Настройте browserslist."
      }
    ],
    importantToRemember: [
      "Polyfill: добавление недостающего API",
      "Transpilation: преобразование нового синтаксиса в старый",
      "Babel/SWC — транспиляторы",
      "core-js — коллекция polyfills",
      "Modern bundlers делают это автоматически"
    ],
    realWorldUsage: "Sometimes. Polyfills и transpilation используются автоматически в modern development (Vite, Next.js, webpack). Вручную подключать polyfills нужно редко — только при работе без bundler.",
    connection: {
      back: "Вы знаете модули (J25) и стиль кода (J26). Этот урок объясняет, как современный код работает в старых средах.",
      forward: "Финальный урок (JV26) — автоматическое тестирование — написание тестов для вашего кода."
    }
  },

  // ============================================
  // JV26 — Automated Testing (Mocha)
  // ============================================
  {
    slug: "automated-testing",
    track: "js-advanced",
    order: 26,
    title: "Автоматическое тестирование (Mocha)",
    summary: "Понять основы тестирования: тест, assertion, test runner. Написать минимальный тест на Mocha.",
    level: "Advanced",
    status: "Optional",
    realWorldValue: "HIGH",
    recommendedUsage: "Common",
    prerequisites: ["functions", "modules"],
    learningObjective: "После этого урока вы сможете писать базовые тесты с describe/it/expect, понимать структуру тестов и знать, зачем нужно тестирование.",
    shortExplanation: "Тестирование — проверка, что код работает правильно. describe — группа тестов. it — один тест. expect — проверка результата (assertion). Test runner запускает тесты и показывает результат. Здесь показан Mocha — это один из инструментов тестирования, но не единственный современный вариант: популярны также Jest и Vitest. Тестирование — отдельная инженерная дисциплина (engineering skill).",
    detailedExplanation: "Структура теста:\ndescribe('Math operations', () => {\n  it('should add two numbers', () => {\n    const result = 1 + 2;\n    expect(result).to.equal(3);\n  });\n\n  it('should handle negative numbers', () => {\n    const result = -1 + -2;\n    expect(result).to.equal(-3);\n  });\n});\n\nAssertions (expect):\nexpect(value).to.equal(expected);     // strict equal\nexpect(value).to.be.true;              // boolean check\nexpect(value).to.be.null;              // null check\nexpect(array).to.have.length(3);       // length check\nexpect(fn).to.throw(Error);            // error check\n\nMocha + Chai (пример одного из инструментов; Jest и Vitest устроены похоже):\n// npm install mocha chai\n// package.json: \"test\": \"mocha\"\n\nconst { expect } = require('chai');\n\ndescribe('User', () => {\n  it('should create user with name', () => {\n    const user = { name: 'Анна' };\n    expect(user.name).to.equal('Анна');\n  });\n\n  it('should have default role', () => {\n    const user = { name: 'Анна', role: 'user' };\n    expect(user.role).to.equal('user');\n  });\n});\n\nВиды тестов:\n1. Unit tests — проверка отдельных функций\n2. Integration tests — проверка взаимодействия модулей\n3. E2E tests — проверка пользовательского сценария\n\nТестирование — отдельная инженерная дисциплина. Этот урок даёт обзор, не глубину.",
    mentalModel: "Тест — как контрольный чек-лист. Вы проверяете: «Работает ли функция правильно?» describe — категория чек-листа. it — один пункт. expect — проверка. Если все пункты пройдены — тест зелёный (pass). Если нет — красный (fail).",
    examples: [
      {
        level: "minimal",
        code: "// Простейший тест\nfunction add(a, b) {\n  return a + b;\n}\n\n// Вместо console.log проверяем вручную:\nconsole.assert(add(1, 2) === 3, '1+2 should be 3');\nconsole.assert(add(0, 0) === 0, '0+0 should be 0');\nconsole.log('All basic assertions passed');",
        explanation: "Простейшая проверка через console.assert."
      },
      {
        level: "simple",
        code: "// Mocha + Chai\nconst { expect } = require('chai');\n\ndescribe('Array', () => {\n  describe('.push()', () => {\n    it('should add element to end', () => {\n      const arr = [1, 2, 3];\n      arr.push(4);\n      expect(arr).to.deep.equal([1, 2, 3, 4]);\n    });\n\n    it('should increase length', () => {\n      const arr = [1, 2];\n      arr.push(3);\n      expect(arr).to.have.length(3);\n    });\n  });\n});",
        explanation: "Mocha тест для встроенного метода массива."
      },
      {
        level: "real",
        code: "// Реальный тест для функции\nfunction formatPrice(amount, currency = 'RUB') {\n  return new Intl.NumberFormat('ru-RU', {\n    style: 'currency',\n    currency\n  }).format(amount);\n}\n\ndescribe('formatPrice', () => {\n  it('should format RUB', () => {\n    expect(formatPrice(1234.56)).to.equal('1 234,56 ₽');\n  });\n\n  it('should format USD', () => {\n    expect(formatPrice(99.99, 'USD')).to.equal('$99.99');\n  });\n\n  it('should handle zero', () => {\n    expect(formatPrice(0)).to.equal('0,00 ₽');\n  });\n});",
        explanation: "Реальный тест: форматирование цен с разными валютами."
      }
    ],
    commonMistakes: [
      {
        wrong: "Писать тесты без проверки assertions",
        why: "Тест без assertion ничего не проверяет — он всегда «проходит».",
        right: "В каждом it() должен быть expect() или assert."
      },
      {
        wrong: "Думать, что тестирование = 100% покрытие кода",
        why: "Покрытие кода ≠ качество тестов. Тесты должны проверять поведение, а не каждую строку.",
        right: "Тестируйте поведение: «Что делает функция?» а не «Какую строку выполняет?»"
      },
      {
        wrong: "Смешивать тесты и production код",
        why: "Тесты не должны попадать в production bundle.",
        right: "Тесты в отдельных файлах (.test.js, .spec.js)."
      }
    ],
    importantToRemember: [
      "describe — группа тестов",
      "it — один тест",
      "expect/assert — проверка результата",
      "Тесты = проверка поведения, а не строк кода",
      "Testing — отдельная инженерная дисциплина"
    ],
    realWorldUsage: "Common. Тестирование — стандартная практика в современной разработке. Все фреймворки (React, Next.js, Vue) имеют встроенную поддержку тестов (Jest, Vitest, Testing Library).",
    sources: [
      { title: "Документация Mocha", url: "https://mochajs.org/" },
      { title: "Vitest (современный test runner)", url: "https://vitest.dev/guide/" }
    ],
    connection: {
      back: "Вы знаете функции (J9) и модули (J25). Тестирование объединяет их для обеспечения качества.",
      forward: "Вы прошли весь учебный план PROlab Academy! 🎉"
    }
  }
] as const;
