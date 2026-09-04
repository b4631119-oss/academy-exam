// JavaScript Intermediate Lessons — JI1 through JI19
// Following Knowledge Map v3 and Stage 3 Lesson Blueprint

export const jsIntermediateLessons = [
  // ============================================
  // JI1 — Scope and Closures
  // ============================================
  {
    slug: "scope-and-closures",
    track: "js-intermediate",
    order: 1,
    title: "Область видимости и замыкания",
    summary: "Понять, где переменные доступны (global, function, block scope), и как вложенные функции «запоминают» внешние переменные (closures).",
    level: "Intermediate",
    prerequisites: ["functions", "arrow-functions", "objects"],
    learningObjective: "После этого урока вы сможете объяснить глобальную, функциональную и блочную области видимости, определять лексическую область и создавать замыкания.",
    shortExplanation: "Область видимости (scope) определяет, где переменная доступна. Global scope — доступна везде. Function scope — только внутри функции. Block scope (let/const) — только внутри { }. Lexical scope — вложенная функция видит переменные внешней функции. Closure — когда функция «запоминает» внешние переменные даже после завершения внешней функции.",
    detailedExplanation: "Что такое область видимости?\n\nОбласть видимости (scope) — это контекст, в котором переменная объявлена и доступна. JavaScript ищет переменные «сверху вниз» по цепочке областей видимости.\n\nТри типа scope:\n\n1. Global scope:\nconst name = 'Анна'; // доступна везде\n\n2. Function scope:\nfunction greet() {\n  const message = 'Привет'; // только внутри greet\n}\n// message недоступна здесь\n\n3. Block scope:\nif (true) {\n  let x = 10; // только внутри if\n  const y = 20; // только внутри if\n}\n// x и y недоступны здесь\n\nvar vs let/const:\n- var создаёт function scope (вне блоков!)\n- let/const создают block scope\n\nLexical scope:\nВложенная функция видит переменные ВСЕХ внешних функций:\n\nfunction outer() {\n  const a = 1;\n  function inner() {\n    const b = 2;\n    console.log(a + b); // 3 — видит 'a' из outer\n  }\n  inner();\n}\n\nЗамыкание (Closure):\nФункция + ссылка на внешние переменные.\n\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\ncounter(); // 1\ncounter(); // 2\ncounter(); // 3\n\nСчётчик count «замкнут» внутри функции. Даже после завершения createCounter, возвращённая функция помнит count.\n\nЦепочка областей видимости (Scope Chain):\nКогда JavaScript ищет переменную, он поднимается по вложенности:\ninner → outer → global. Если не нашёл — ReferenceError.",
    mentalModel: "Область видимости — как комната в доме. Вы видите то, что в вашей комнате (local scope) и то, что в коридоре (outer scope). Но не видите то, что в другой комнате (другая function scope). Closure — как комната с окном: даже когда вы уходите из коридора, вы всё ещё видите через окно то, что там было.",
    examples: [
      {
        level: "minimal",
        code: "const global = 'я глобальная';\n\nfunction test() {\n  const local = 'я локальная';\n  console.log(global); // видит глобальную\n  console.log(local);  // видит локальную\n}\n\ntest();\nconsole.log(global); // OK\n// console.log(local); // ReferenceError!",
        explanation: "Global scope доступна везде. Function scope — только внутри функции."
      },
      {
        level: "simple",
        code: "function createMultiplier(factor) {\n  return function(number) {\n    return number * factor; // factor «замкнута»\n  };\n}\n\nconst double = createMultiplier(2);\nconst triple = createMultiplier(3);\n\nconsole.log(double(5)); // 10\nconsole.log(triple(5)); // 15",
        explanation: "Каждая функция createMultiplier создаёт своё замыкание со своим factor."
      },
      {
        level: "real",
        code: "function createBankAccount(initialBalance) {\n  let balance = initialBalance;\n\n  return {\n    deposit(amount) {\n      balance += amount;\n      return balance;\n    },\n    withdraw(amount) {\n      if (amount > balance) return 'Недостаточно средств';\n      balance -= amount;\n      return balance;\n    },\n    getBalance() {\n      return balance;\n    }\n  };\n}\n\nconst account = createBankAccount(1000);\nconsole.log(account.deposit(500));    // 1500\nconsole.log(account.withdraw(200));   // 1300\nconsole.log(account.getBalance());    // 1300\n// account.balance — undefined (приватная переменная!)",
        explanation: "Balance защищён замыканием — его нельзя изменить напрямую."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать var и let/const в циклах",
        why: "var создаёт одну переменную на всю функцию. Все итерации цикла видят одну и ту же переменную.",
        right: "Используйте let в циклах — каждая итерация получает свою переменную."
      },
      {
        wrong: "Думать, что closure — это копия переменной",
        why: "Closure хранит ССЫЛКУ на переменную, а не копию. Изменения видны.",
        right: "Closure — функция + ссылка на внешние переменные."
      },
      {
        wrong: "Забывать, что цикл с var создаёт одну переменную",
        why: "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)); } выведет 3, 3, 3.",
        right: "Используйте let: for (let i = 0...) — каждая итерация получает свою i."
      }
    ],
    importantToRemember: [
      "Global scope — доступна везде",
      "Function scope — только внутри функции",
      "Block scope (let/const) — только внутри { }",
      "Lexical scope — вложенная функция видит внешние переменные",
      "Closure — функция + ссылка на внешние переменные",
      "var не имеет block scope!"
    ],
    sources: [
      { title: "MDN: замыкания (Closures)", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Closures" }
    ],
    connection: {
      back: "Вы знаете функции и переменные (J0-J26) — теперь вы понимаете, где они «живут».",
      forward: "Следующий урок (JI2) — глобальный объект window и его свойства."
    }
  },

  // ============================================
  // JI2 — Global Object
  // ============================================
  {
    slug: "global-object",
    track: "js-intermediate",
    order: 2,
    title: "Глобальный объект",
    summary: "Понять, что такое глобальный объект (window/globalThis), как он связан с переменными, и почему его следует избегать.",
    level: "Intermediate",
    prerequisites: ["intro-to-js"],
    learningObjective: "После этого урока вы сможете объяснить, что такое глобальный объект, какую роль он играет при объявлении переменных и почему загрязнять глобальную область видимости опасно.",
    shortExplanation: "Глобальный объект — это объект, в котором хранятся все глобальные переменные и функции. В браузере это window. В Node.js — global. ES2020 ввёл globalThis — универсальное имя. Переменные, объявленные через var, становятся свойствами глобального объекта.",
    detailedExplanation: "Что такое глобальный объект?\n\nГлобальный объект — это объект высшего уровня, в котором живут все глобальные функции и переменные.\n\nВ браузере: window\nВ Node.js: global\nES2020+: globalThis (универсально)\n\nСвязь с var:\nvar x = 10;\nconsole.log(window.x); // 10!\n\nlet y = 20;\nconsole.log(window.y); // undefined (let НЕ создаёт свойство на window)\n\nГлобальные функции:\nfunction greet() {}\nconsole.log(window.greet); // функция!\n\nПочему это плохо:\n- Конфликты имён\n- Случайное перезаписывание\n- Тяжело отлаживать\n\nСовременные подходы:\n- Модули (import/export) изолируют scope\n- IIFE (Immediately Invoked Function Expression)\n- const/let не засоряют global scope",
    mentalModel: "Глобальный объект — как общая доска объявлений. Всё, что написано на ней, доступно всем. Но если слишком много объявлений — impossible найти нужное и легко стереть чужое.",
    examples: [
      {
        level: "minimal",
        code: "console.log(typeof window); // 'object' (в браузере)\nconsole.log(typeof globalThis); // 'object' (везде)\n\nvar globalVar = 'я глобальная';\nconsole.log(window.globalVar); // 'я глобальная'",
        explanation: "var создаёт свойство на глобальном объекте."
      },
      {
        level: "simple",
        code: "// let/const НЕ становятся свойствами window:\nlet localVar = 'я локальная';\nconst localConst = 'я константа';\n\nconsole.log(window.localVar);  // undefined\nconsole.log(window.localConst); // undefined\n\n// Только var:\nvar globalVar = 'глобальная';\nconsole.log(window.globalVar);  // 'глобальная'",
        explanation: "let/const изолированы от глобального объекта."
      },
      {
        level: "real",
        code: "// Плохо: глобальные переменные\nvar API_URL = 'https://api.example.com';\nvar currentUser = null;\n\n// Хорошо: модули\n// app.js\nconst API_URL = 'https://api.example.com';\nlet currentUser = null;\nexport { API_URL, currentUser };",
        explanation: "Модули изолируют переменные. Глобальные — доступны всем."
      }
    ],
    commonMistakes: [
      {
        wrong: "Создавать глобальные переменные через var",
        why: "Глобальные var засоряют пространство имён и могут быть случайно перезаписаны.",
        right: "Используйте модули и let/const."
      },
      {
        wrong: "Думать, что window доступен везде",
        why: "В Node.js window не существует. Используйте globalThis.",
        right: "Для кросс-платформенного кода используйте globalThis."
      },
      {
        wrong: "Использовать window для хранения данных",
        why: "Любой скрипт может изменить window. Это ненадёжно.",
        right: "Храните данные в модулях или передавайте через аргументы."
      }
    ],
    importantToRemember: [
      "Глобальный объект = window (браузер) / global (Node) / globalThis (универсал)",
      "var создаёт свойство на window, let/const — нет",
      "Глобальные переменные — источник конфликтов",
      "Модули (import/export) — современный способ изоляции",
      "Избегайте глобального scope для данных"
    ],
    connection: {
      back: "Вы понимаете области видимости и замыкания (JI1) — теперь вы видите самую внешнюю область.",
      forward: "Следующий урок (JI3) — копирование объектов: поверхностное и глубокое."
    }
  },

  // ============================================
  // JI3 — Object Copying
  // ============================================
  {
    slug: "object-copying",
    track: "js-intermediate",
    order: 3,
    title: "Копирование объектов",
    summary: "Понять разницу между примитивами (копируются по значению) и объектами (передаются по ссылке), и научиться создавать shallow и deep копии.",
    level: "Intermediate",
    prerequisites: ["objects"],
    learningObjective: "После этого урока вы сможете объяснять передачу по ссылке и по значению, создавать поверхностные копии через spread и глубокие — через structuredClone.",
    shortExplanation: "Примитивы копируются по значению: const b = a — создаёт копию. Объекты передаются по ссылке: const b = a — обе переменные указывают на тот же объект. Spread {...obj} создаёт поверхностную копию. structuredClone(obj) — глубокую.",
    detailedExplanation: "Примитивы vs Объекты:\n\nПримитивы (number, string, boolean, null, undefined):\nconst a = 5;\nconst b = a; // b = 5 (копия)\nb = 10;\nconsole.log(a); // 5 (а не изменилась)\n\nОбъекты (objects, arrays, functions):\nconst obj1 = { x: 1 };\nconst obj2 = obj1; // obj2 = ссылка на тот же объект\nobj2.x = 2;\nconsole.log(obj1.x); // 2 (изменился и obj1!)\n\nПочему так?\nОбъект живёт в памяти. Переменная obj1 — это «указатель» на этот объект. const obj2 = obj1 копирует указатель, а не сам объект.\n\nShallow copy (поверхностная):\nconst original = { a: 1, b: { c: 2 } };\nconst copy = { ...original };\n\ncopy.a = 100;\nconsole.log(original.a); // 1 (не изменился)\n\ncopy.b.c = 200;\nconsole.log(original.b.c); // 200 (изменился!)\n\nSpread копирует только верхний уровень. Вложенные объекты — ссылки.\n\nDeep copy (глубокая):\nconst deepCopy = structuredClone(original);\n// structuredClone рекурсивно копирует все уровни\n\nДругие способы:\n- JSON.parse(JSON.stringify(obj)) — ограничения: теряет undefined, функции, Date\n- structuredClone() — современный, поддерживает Date, Map, Set\n- Лучше structuredClone для большинства случаев",
    mentalModel: "Shallow copy — как сфотографировать дом. Вы видите фотографию (копию), но мебель внутри — та же самая (ссылки на те же объекты). Deep copy — как построить точную Replica дома со всей мебелью.",
    examples: [
      {
        level: "minimal",
        code: "const a = 5;\nconst b = a;\nb = 10;\nconsole.log(a); // 5 (примитив — копия)\n\nconst obj1 = { x: 1 };\nconst obj2 = obj1;\nobj2.x = 2;\nconsole.log(obj1.x); // 2 (объект — ссылка)",
        explanation: "Примитивы копируются по значению. Объекты — по ссылке."
      },
      {
        level: "simple",
        code: "const original = { name: 'Анна', scores: [90, 85] };\nconst shallow = { ...original };\nconst deep = structuredClone(original);\n\nshallow.name = 'Пётр';\nconsole.log(original.name); // 'Анна' (не изменился)\n\nshallow.scores.push(95);\nconsole.log(original.scores); // [90, 85, 95] (изменился!)\n\ndeep.scores.push(80);\nconsole.log(original.scores); // [90, 85, 95] (не изменился!)",
        explanation: "Spread — поверхностная копия (shallow copy). structuredClone — глубокая копия (deep copy)."
      },
      {
        level: "real",
        code: "function mergeDefaults(user, defaults) {\n  // structuredClone чтобы не мутировать defaults\n  const result = structuredClone(defaults);\n  return { ...result, ...user };\n}\n\nconst defaults = { theme: 'dark', lang: 'ru', notifications: true };\nconst userPrefs = { theme: 'light' };\n\nconst settings = mergeDefaults(userPrefs, defaults);\nconsole.log(settings);\n// { theme: 'light', lang: 'ru', notifications: true }\nconsole.log(defaults.theme); // 'dark' (не мутирован!)",
        explanation: "Merge с глубоким клонированием предотвращает мутиацию оригиналов."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что spread создаёт глубокую копию",
        why: "Spread {...obj} копирует только верхний уровень. Вложенные объекты — ссылки.",
        right: "Для глубокой копии: structuredClone(obj)."
      },
      {
        wrong: "Использовать JSON.parse(JSON.stringify()) для копирования",
        why: "Теряет undefined, функции, Date, Map, Set, циклические ссылки.",
        right: "Используйте structuredClone() — он поддерживает больше типов."
      },
      {
        wrong: "Путать копирование и клонирование массивов",
        why: "[...arr] — поверхностная копия (shallow copy). structuredClone(arr) — глубокая копия (deep copy).",
        right: "Для простых массивов [...arr] достаточно. Для вложенных — structuredClone."
      }
    ],
    importantToRemember: [
      "Примитивы — копируются по значению",
      "Объекты — передаются по ссылке",
      "Spread {...obj} — shallow copy",
      "structuredClone(obj) — deep copy",
      "JSON.parse(JSON.stringify()) — есть ограничения"
    ],
    connection: {
      back: "Вы знаете объекты (J11) — теперь вы понимаете, как их копировать.",
      forward: "Следующий урок (JI4) — методы объекта и ключевое слово this."
    }
  },

  // ============================================
  // JI4 — Object Methods and this
  // ============================================
  {
    slug: "object-methods-this",
    track: "js-intermediate",
    order: 4,
    title: "Методы объекта и this",
    summary: "Понять, как определить значение this в конкретном вызове: default, implicit, explicit и new binding.",
    level: "Intermediate",
    prerequisites: ["functions", "objects"],
    learningObjective: "После этого урока вы сможете определять значение this в любом вызове функции и объяснять четыре правила связывания.",
    shortExplanation: "this — это специальная переменная, которая ссылается на объект. Какой именно — зависит от того, КАК вызвана функция. Есть 4 правила: default (global/undefined), implicit (obj.method()), explicit (call/apply/bind), new (new Constructor()).",
    detailedExplanation: "Что такое this?\n\nthis — это ссылка на объект, но значение this определяется в момент ВЫЗОВА функции, а не в момент объявления.\n\n4 правила определения this:\n\n1. Default binding:\nfunction show() { console.log(this); }\nshow(); // window (или undefined в strict mode)\n\n2. Implicit binding:\nconst obj = {\n  name: 'Анна',\n  greet() { console.log(this.name); }\n};\nobj.greet(); // 'Анна' — this = obj\n\n3. Explicit binding:\nfunction greet() { console.log(this.name); }\nconst user = { name: 'Пётр' };\ngreet.call(user);  // 'Пётр' — this = user\ngreet.apply(user); // 'Пётр'\nconst bound = greet.bind(user);\nbound(); // 'Пётр'\n\n4. new binding:\nfunction Person(name) { this.name = name; }\nconst p = new Person('Анна');\nconsole.log(p.name); // 'Анна' — this = новый объект\n\nArrow functions:\nconst obj = {\n  name: 'Анна',\n  greet: () => { console.log(this.name); }\n};\nobj.greet(); // undefined (arrow не создаёт свой this!)\n\nArrow functions берут this из внешнего lexical scope.",
    mentalModel: "this — как зеркало. В зависимости от того, где вы стоите (как вызвали функцию), зеркало отражает разный объект. obj.method() — зеркало смотрит на obj. call(obj) — вы поворачиваете зеркало на obj.",
    examples: [
      {
        level: "minimal",
        code: "const user = {\n  name: 'Анна',\n  greet() {\n    console.log(`Привет, ${this.name}`);\n  }\n};\n\nuser.greet(); // 'Привет, Анна'\n// this = user (implicit binding)",
        explanation: "Когда функция вызвана через объект — this ссылается на этот объект."
      },
      {
        level: "simple",
        code: "function sayHello() {\n  console.log(`Привет, ${this.name}`);\n}\n\nconst user1 = { name: 'Анна', greet: sayHello };\nconst user2 = { name: 'Пётр', greet: sayHello };\n\nuser1.greet(); // 'Привет, Анна'\nuser2.greet(); // 'Привет, Пётр'\n// Одна функция — разный this в зависимости от объекта",
        explanation: "this определяется в момент вызова, а не объявления."
      },
      {
        level: "real",
        code: "const counter = {\n  count: 0,\n  start() {\n    // Arrow function сохраняет this из start\n    setInterval(() => {\n      this.count++;\n      console.log(this.count);\n    }, 1000);\n  }\n};\n\n// counter.start(); // 1, 2, 3...\n// Обычная функция потеряла бы this!",
        explanation: "Стрелочная функция берёт this из outer scope (start)."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что this = объект, где объявлена функция",
        why: "this определяется в момент ВЫЗОВА, а не объявления.",
        right: "this зависит от того, КАК функция вызвана, не от того, ГДЕ она написана."
      },
      {
        wrong: "Использовать стрелочные функции для методов объекта",
        why: "Arrow functions не создают свой this. this берётся из внешнего scope.",
        right: "Для методов объекта используйте обычные функции или shorthand methods."
      },
      {
        wrong: "Потерять this при передаче метода как callback",
        why: "const fn = obj.greet; fn() — this = undefined (default binding).",
        right: "Используйте bind: obj.greet.bind(obj) или arrow function."
      }
    ],
    importantToRemember: [
      "this определяется в момент ВЫЗОВА, не объявления",
      "4 правила: default, implicit, explicit, new",
      "Arrow functions НЕ создают свой this",
      "obj.method() — this = obj (implicit)",
      "call/apply/bind — явное задание this"
    ],
    connection: {
      back: "Вы знаете объекты (J11) и функции (J9) — теперь вы понимаете, как они взаимодействуют.",
      forward: "Следующий урок (JI5) — call, apply, bind подробнее."
    }
  },

  // ============================================
  // JI5 — call/apply/bind
  // ============================================
  {
    slug: "call-apply-bind",
    track: "js-intermediate",
    order: 5,
    title: "call, apply, bind",
    summary: "Научиться явно задавать this для функций с помощью call, apply и bind, понимая разницу между ними.",
    level: "Intermediate",
    prerequisites: ["object-methods-this"],
    learningObjective: "После этого урока вы сможете использовать call, apply и bind для явной установки this и объяснять, когда какой инструмент уместен.",
    shortExplanation: "call и apply вызывают функцию сразу с заданным this. Разница: call принимает аргументы по одному, apply — массивом. bind создаёт новую функцию с заранее заданным this (не вызывает сразу).",
    detailedExplanation: "Зачем нужен явный this?\n\nИногда нужно вызвать функцию «от имени» другого объекта:\n\nfunction greet() {\n  console.log(`Привет, ${this.name}`);\n}\n\nconst user = { name: 'Анна' };\n// greet.call(user) — вызвать greet, сделав this = user\n\ncall(thisArg, ...args):\ngreet.call(user); // 'Привет, Анна'\n\ngreet.call(user, 'дополнительные', 'аргументы');\n\napply(thisArg, argsArray):\ngreet.apply(user, ['дополнительные', 'аргументы']);\n\nРазница call vs apply:\n- call: аргументы через запятую: fn.call(obj, a, b, c)\n- apply: аргументы массивом: fn.apply(obj, [a, b, c])\n\nbind(thisArg, ...partialArgs):\nconst boundGreet = greet.bind(user);\nboundGreet(); // 'Привет, Анна' — вызов в любой момент\n\nbind НЕ вызывает функцию — он создаёт НОВУЮ функцию с фиксированным this.\n\nКогда что использовать:\n- call — вызов сразу с аргументами\n- apply — вызов сразу с массивом аргументов\n- bind — создание новой функции для будущего вызова",
    mentalModel: "call — как сказать «прочитай это письмо, обращаясь к этому человеку» (сразу). apply — то же, но аргументы в конверте (массиве). bind — как создать шаблон письма с заранее вписанным именем (новая функция).",
    examples: [
      {
        level: "minimal",
        code: "function greet(greeting) {\n  console.log(`${greeting}, ${this.name}!`);\n}\n\nconst user = { name: 'Анна' };\n\ngreet.call(user, 'Привет');   // 'Привет, Анна!'\ngreet.apply(user, ['Здравствуй']); // 'Здравствуй, Анна!'",
        explanation: "call и apply вызывают функцию сразу с заданным this."
      },
      {
        level: "simple",
        code: "function multiply(a, b) {\n  return a * b;\n}\n\n// call — аргументы по одному\nconsole.log(multiply.call(null, 2, 3)); // 6\n\n// apply — аргументы массивом\nconsole.log(multiply.apply(null, [2, 3])); // 6\n\n// bind — создаёт новую функцию\nconst double = multiply.bind(null, 2);\nconsole.log(double(5)); // 10 (2 * 5)",
        explanation: "bind с частичными аргументами — удобный способ создать специализированную функцию."
      },
      {
        level: "real",
        code: "const button = document.querySelector('#myButton');\n\n// Проблема: this теряется в callback\n// button.addEventListener('click', user.handleClick);\n// this = button, не user!\n\n// Решение 1: bind\n// button.addEventListener('click', user.handleClick.bind(user));\n\n// Решение 2: arrow function (предпочтительнее)\n// button.addEventListener('click', () => user.handleClick());",
        explanation: "bind решает проблему потери this при передаче метода как callback."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать call и apply",
        why: "call принимает аргументы по одному, apply — массивом.",
        right: "call(obj, a, b, c) vs apply(obj, [a, b, c])."
      },
      {
        wrong: "Думать, что bind вызывает функцию",
        why: "bind создаёт НОВУЮ функцию. Для вызова нужен дополнительный ().",
        right: "bound() — вызов. bind() — только создание."
      },
      {
        wrong: "Использовать bind когда нужен arrow function",
        why: "Arrow function проще: () => obj.method(). Не нужен bind.",
        right: "Для callback'ов предпочтительнее arrow functions."
      }
    ],
    importantToRemember: [
      "call(thisArg, ...args) — вызов сразу",
      "apply(thisArg, [args]) — вызов сразу с массивом",
      "bind(thisArg) — создаёт новую функцию",
      "bind с частичными аргументами — partial application",
      "Для callback'ов предпочтительнее arrow functions"
    ],
    connection: {
      back: "Вы понимаете связывание this (JI4) — теперь у вас есть инструменты для управления им.",
      forward: "Следующий урок (JI6) — рекурсия и стек вызовов."
    }
  },

  // ============================================
  // JI6 — Recursion and Call Stack
  // ============================================
  {
    slug: "recursion-call-stack",
    track: "js-intermediate",
    order: 6,
    title: "Рекурсия и стек вызовов",
    summary: "Понять, как функции вызывают сами себя (рекурсия), что такое стек вызовов, и когда рекурсия уместна.",
    level: "Intermediate",
    prerequisites: ["functions"],
    learningObjective: "После этого урока вы сможете писать рекурсивные функции с базовым случаем, объяснять стек вызовов и выбирать между рекурсией и циклами.",
    shortExplanation: "Рекурсия — когда функция вызывает саму себя. Каждый вызов добавляется в стек вызовов. Без base case — бесконечная рекурсия (Stack Overflow). Рекурсия полезна для деревьев, поиска и задач, которые разбиваются на подзадачи.",
    detailedExplanation: "Что такое рекурсия?\n\nРекурсия — это функция, которая вызывает сама себя.\n\nfunction countdown(n) {\n  if (n === 0) {          // base case — ОСТАНОВКА!\n    console.log('Поехали!');\n    return;\n  }\n  console.log(n);\n  countdown(n - 1);       // рекурсивный вызов\n}\n\ncountdown(3); // 3, 2, 1, Поехали!\n\nBase case — ОБЯЗАТЕЛЕН. Без него — бесконечная рекурсия.\n\nСтек вызовов (Call Stack):\nКаждый вызов функции добавляется в стек (стопка). Когда функция завершается — она удаляется из стека.\n\ncountdown(3) → стек: [countdown(3)]\ncountdown(2) → стек: [countdown(3), countdown(2)]\ncountdown(1) → стек: [countdown(3), countdown(2), countdown(1)]\ncountdown(0) → стек: [countdown(3), countdown(2), countdown(1), countdown(0)]\nПоехали! → countdown(0) завершается\n→ countdown(1) завершается\n→ countdown(2) завершается\n→ countdown(3) завершается\n\nStack Overflow — когда стек переполняется (слишком много вложенных вызовов).\n\nКогда использовать рекурсию:\n- Обход деревьев\n- Поиск в глубину\n- Задачи типа «разбей на подзадачи»\n\nКогда использовать цикл:\n- Простые итерации\n- Когда важна производительность",
    mentalModel: "Рекурсия — как матрёшка. Открываешь куклу — внутри ещё одна кукла. Открываешь её — ещё одна. Base case — когда внутри больше ничего нет.",
    examples: [
      {
        level: "minimal",
        code: "function factorial(n) {\n  if (n <= 1) return 1; // base case\n  return n * factorial(n - 1); // рекурсия\n}\n\nconsole.log(factorial(5)); // 120\n// 5 * 4 * 3 * 2 * 1 = 120",
        explanation: "factorial(5) = 5 * factorial(4) = 5 * 4 * factorial(3) = ..."
      },
      {
        level: "simple",
        code: "function sumArray(arr, index = 0) {\n  if (index === arr.length) return 0; // base case\n  return arr[index] + sumArray(arr, index + 1);\n}\n\nconsole.log(sumArray([1, 2, 3, 4])); // 10",
        explanation: "Рекурсивное суммирование: берём первый элемент + сумма остальных."
      },
      {
        level: "real",
        code: "function findDeep(obj, key) {\n  if (key in obj) return obj[key];\n\n  for (const value of Object.values(obj)) {\n    if (typeof value === 'object' && value !== null) {\n      const result = findDeep(value, key);\n      if (result !== undefined) return result;\n    }\n  }\n  return undefined;\n}\n\nconst config = {\n  app: { name: 'MyApp', settings: { theme: 'dark' } }\n};\n\nconsole.log(findDeep(config, 'theme')); // 'dark'",
        explanation: "Рекурсивный поиск по вложенному объекту."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забыть base case",
        why: "Без base case — бесконечная рекурсия → Stack Overflow.",
        right: "Всегда начинайте с base case."
      },
      {
        wrong: "Использовать рекурсию для простых итераций",
        why: "Рекурсия менее эффективна: каждый вызов добавляет в стек.",
        right: "Для простых циклов используйте for/while."
      },
      {
        wrong: "Не уменьшать аргументы при рекурсии",
        why: "Если аргумент не приближается к base case — бесконечная рекурсия.",
        right: "Каждый рекурсивный вызов должен приближать к base case."
      }
    ],
    importantToRemember: [
      "Base case — ОБЯЗАТЕЛЕН для остановки",
      "Каждый вызов добавляется в стек вызовов",
      "Stack Overflow — стек переполнился",
      "Рекурсия → деревья, поиск, подзадачи",
      "Простые итерации → циклы"
    ],
    connection: {
      back: "Вы знаете функции (J9) и this (JI4-JI5) — теперь вы понимаете, как функции вызывают друг друга.",
      forward: "Следующий урок (JI7) — геттеры и сеттеры для контролируемого доступа к свойствам."
    }
  },

  // ============================================
  // JI7 — Getters and Setters
  // ============================================
  {
    slug: "getters-setters",
    track: "js-intermediate",
    order: 7,
    title: "Геттеры и сеттеры",
    summary: "Научиться создавать вычисляемые свойства (get) и контролируемое присваивание (set) в объектах.",
    level: "Intermediate",
    prerequisites: ["objects"],
    learningObjective: "После этого урока вы сможете создавать геттеры и сеттеры, объяснять, когда они полезны, и отличать их от обычных методов.",
    shortExplanation: "Геттер (get) — свойство, которое вычисляется при чтении. Сеттер (set) — свойство, которое выполняет логику при записи. Они позволяют контролировать доступ к данным.",
    detailedExplanation: "Геттер (get):\nconst circle = {\n  radius: 5,\n  get area() {\n    return Math.PI * this.radius ** 2;\n  }\n};\n\nconsole.log(circle.area); // 78.54 (без скобок!)\n// area — это свойство, не метод\n\nСеттер (set):\nconst user = {\n  _name: '',\n  set name(value) {\n    if (value.length < 2) {\n      console.log('Имя слишком короткое');\n      return;\n    }\n    this._name = value;\n  },\n  get name() {\n    return this._name;\n  }\n};\n\nuser.name = 'Анна';  // сеттер: проверка + присваивание\nconsole.log(user.name); // геттер: 'Анна'\nuser.name = 'А';    // сеттер: 'Имя слишком короткое'\n\nЗачем нужен:\n- Валидация при записи\n- Вычисляемые свойства\n- Инкапсуляция (скрытие логики)\n- Совместимость с API",
    mentalModel: "Геттер — как автоматический калькулятор: спросили площадь — он сам считает. Сеттер — как охранник: хотите изменить данные — он проверяет, можно ли.",
    examples: [
      {
        level: "minimal",
        code: "const temperature = {\n  celsius: 25,\n  get fahrenheit() {\n    return this.celsius * 9 / 5 + 32;\n  }\n};\n\nconsole.log(temperature.fahrenheit); // 77",
        explanation: "Геттер вычисляет fahrenheit из celsius."
      },
      {
        level: "simple",
        code: "const account = {\n  _balance: 0,\n  set balance(amount) {\n    if (amount < 0) {\n      console.log('Баланс не может быть отрицательным');\n      return;\n    }\n    this._balance = amount;\n  },\n  get balance() {\n    return this._balance;\n  }\n};\n\naccount.balance = 1000;\nconsole.log(account.balance); // 1000\naccount.balance = -500; // 'Баланс не может быть отрицательным'",
        explanation: "Сеттер валидирует значение перед сохранением."
      },
      {
        level: "real",
        code: "class Temperature {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n\n  get fahrenheit() {\n    return this.celsius * 9 / 5 + 32;\n  }\n\n  set fahrenheit(f) {\n    this.celsius = (f - 32) * 5 / 9;\n  }\n}\n\nconst temp = new Temperature(25);\nconsole.log(temp.fahrenheit); // 77\ntemp.fahrenheit = 32;\nconsole.log(temp.celsius); // 0",
        explanation: "Геттеры и сеттеры работают и в классах."
      }
    ],
    commonMistakes: [
      {
        wrong: "Вызывать геттер как метод: obj.area()",
        why: "Геттер — это свойство, не метод. Без скобок: obj.area, не obj.area().",
        right: "obj.area — чтение через геттер."
      },
      {
        wrong: "Забывать, что сеттер не возвращает значение",
        why: "Сеттер — это присваивание: obj.name = 'value'. Он не может вернуть результат.",
        right: "Для чтения используйте геттер."
      },
      {
        wrong: "Рекурсия в геттере",
        why: "get area() { return this.area; } — бесконечная рекурсия!",
        right: "Используйте приватное поле: return this._area."
      }
    ],
    importantToRemember: [
      "get — свойство, вычисляется при чтении (без скобок!)",
      "set — выполняется при присваивании (obj.prop = value)",
      "Сеттер не возвращает значение",
      "Геттер не принимает аргументов",
      "Полезны для валидации и вычислений"
    ],
    connection: {
      back: "Вы знаете методы объектов (JI4) — теперь у вас есть особый доступ к свойствам.",
      forward: "Следующий урок (JI8) — классы: синтаксический сахар над прототипами."
    }
  },

  // ============================================
  // JI8 — Classes
  // ============================================
  {
    slug: "classes",
    track: "js-intermediate",
    order: 8,
    title: "Классы",
    summary: "Научиться создавать классы с конструктором, методами и свойствами, понимая что class — это синтаксический сахар над прототипами.",
    level: "Intermediate",
    prerequisites: ["objects", "functions"],
    learningObjective: "После этого урока вы сможете создавать классы с конструкторами и методами, создавать экземпляры через new и объяснять, что класс — это синтаксический сахар над прототипами.",
    shortExplanation: "Класс — это шаблон для создания объектов. constructor задаёт начальные свойства. Методы — функции внутри класса. new создаёт экземпляр. class — это современный способ записи прототипов (не отдельный механизм).",
    detailedExplanation: "Что такое класс?\n\nКласс — это шаблон (blueprint) для создания объектов.\n\nclass User {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  greet() {\n    return `Привет, ${this.name}!`;\n  }\n}\n\nconst user = new User('Анна', 25);\nconsole.log(user.greet()); // 'Привет, Анна!'\n\nconstructor:\n- Вызывается автоматически при new\n- Задаёт начальные свойства\n- Один конструктор на класс\n\nМетоды:\n- Определяются без function\n- Доступны через this\n\nСоздание экземпляра:\nnew User('Анна', 25) — создаёт объект и вызывает constructor\n\nВажно: class — это СИНТАКСИЧЕСКИЙ САХАР:\nclass User {} эквивалентно function User() + prototype.method\n\nES6 class не создаёт новый механизм наследования — он просто упрощает запись прототипов.",
    mentalModel: "Класс — как форма для лепнины. Один раз сделали форму (class), а потом лепим сколько угодно экземпляров (new). Каждый экземпляр одинаков по структуре, но с разными данными.",
    examples: [
      {
        level: "minimal",
        code: "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n\n  speak() {\n    return `${this.name} издаёт звук`;\n  }\n}\n\nconst dog = new Animal('Рекс');\nconsole.log(dog.speak()); // 'Рекс издаёт звук'",
        explanation: "Класс + constructor + метод + new = экземпляр."
      },
      {
        level: "simple",
        code: "class BankAccount {\n  #balance = 0; // приватное поле\n\n  constructor(owner, initialBalance = 0) {\n    this.owner = owner;\n    this.#balance = initialBalance;\n  }\n\n  deposit(amount) {\n    this.#balance += amount;\n    return this.#balance;\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n}\n\nconst account = new BankAccount('Анна', 1000);\nconsole.log(account.balance); // 1000\naccount.deposit(500);\nconsole.log(account.balance); // 1500",
        explanation: "Класс с приватным полем и методами."
      },
      {
        level: "real",
        code: "class TodoList {\n  #items = [];\n\n  add(text) {\n    this.#items.push({ text, done: false });\n  }\n\n  complete(index) {\n    if (this.#items[index]) {\n      this.#items[index].done = true;\n    }\n  }\n\n  get pending() {\n    return this.#items.filter(item => !item.done);\n  }\n}\n\nconst todos = new TodoList();\ntodos.add('Купить молоко');\ntodos.add('Написать код');\ntodos.complete(0);\nconsole.log(todos.pending.length); // 1",
        explanation: "Реальный пример: список задач с инкапсуляцией."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать new при создании экземпляра",
        why: "User('Анна') без new вызовет ошибку (в strict mode) или не создаст экземпляр.",
        right: "Всегда: const user = new User('Анна')."
      },
      {
        wrong: "Думать, что class — это новый механизм наследования",
        why: "class — синтаксический сахар над прототипами. Механизм тот же.",
        right: "class упрощает запись, но не создаёт новую систему."
      },
      {
        wrong: "Использовать стрелочные функции для методов",
        why: "Стрелочные функции в классе — это свойства экземпляра (не на prototype).",
        right: "Для методов класса используйте обычные методы."
      }
    ],
    importantToRemember: [
      "class — шаблон для создания объектов",
      "constructor вызывается при new",
      "Методы определяются без function",
      "class — синтаксический сахар над прототипами",
      "new создаёт экземпляр"
    ],
    sources: [
      { title: "MDN: классы", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes" }
    ],
    connection: {
      back: "Вы знаете объекты (J11) и геттеры/сеттеры (JI7) — теперь у вас есть структурный способ их создания.",
      forward: "Следующий урок (JI9) — наследование классов через extends и super."
    }
  },

  // ============================================
  // JI9 — Class Inheritance
  // ============================================
  {
    slug: "class-inheritance",
    track: "js-intermediate",
    order: 9,
    title: "Наследование классов",
    summary: "Научиться создавать дочерние классы через extends, вызывать родительский constructor через super, и переопределять методы.",
    level: "Intermediate",
    prerequisites: ["classes"],
    learningObjective: "После этого урока вы сможете создавать подклассы через extends, вызывать super(), переопределять методы и объяснять, почему super() нужно вызывать до обращения к this.",
    shortExplanation: "extends создаёт дочерний класс, наследующий методы родителя. super() вызывает родительский constructor. До вызова super() нельзя использовать this — потому что дочерний объект ещё не создан.",
    detailedExplanation: "Наследование:\n\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} издаёт звук`;\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    return `${this.name} гавкает`;\n  }\n}\n\nconst rex = new Dog('Рекс');\nconsole.log(rex.speak()); // 'Рекс гавкает'\n\nsuper() — вызов родительского constructor:\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name); // ОБЯЗАТЕЛЬНО до this!\n    this.breed = breed;\n  }\n}\n\nПочему super() перед this?\nДочерний класс не может использовать this до вызова super(), потому что родительский constructor ещё не инициализировал объект.\n\nПереопределение методов:\nДочерний класс может переопределить метод родителя.\nЕсли нужен доступ к родительскому методу: super.method().",
    mentalModel: "Наследование — как ребёнок наследует черты родителя, но может их изменить. Ребёнок не может существовать без родителя (super() создаёт базовую часть объекта).",
    examples: [
      {
        level: "minimal",
        code: "class Shape {\n  constructor(color) {\n    this.color = color;\n  }\n}\n\nclass Circle extends Shape {\n  constructor(color, radius) {\n    super(color);\n    this.radius = radius;\n  }\n}\n\nconst red = new Circle('красный', 5);\nconsole.log(red.color);  // 'красный'\nconsole.log(red.radius); // 5",
        explanation: "extends + super() — наследование с добавлением собственных свойств."
      },
      {
        level: "simple",
        code: "class User {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `Привет, ${this.name}`;\n  }\n}\n\nclass Admin extends User {\n  greet() {\n    return `${super.greet()} (Admin)`;\n  }\n}\n\nconst admin = new Admin('Анна');\nconsole.log(admin.greet()); // 'Привет, Анна (Admin)'",
        explanation: "super.greet() — вызов родительского метода."
      },
      {
        level: "real",
        code: "class EventEmitter {\n  #listeners = {};\n\n  on(event, callback) {\n    if (!this.#listeners[event]) {\n      this.#listeners[event] = [];\n    }\n    this.#listeners[event].push(callback);\n  }\n\n  emit(event, ...args) {\n    const callbacks = this.#listeners[event] || [];\n    callbacks.forEach(cb => cb(...args));\n  }\n}\n\nclass Logger extends EventEmitter {\n  log(message) {\n    console.log(`[LOG] ${message}`);\n    this.emit('log', message);\n  }\n}\n\nconst logger = new Logger();\nlogger.on('log', msg => console.log(`Сохранено: ${msg}`));\nlogger.log('Запуск'); // [LOG] Запуск + Сохранено: Запуск",
        explanation: "Наследование: Logger получает on/emit от EventEmitter."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать this до super()",
        why: "Дочерний класс не может использовать this до вызова super().",
        right: "Сначала super(), потом this."
      },
      {
        wrong: "Забывать super() в constructor",
        why: "Без super() — ReferenceError при использовании this.",
        right: "Если у дочернего класса есть constructor — вызовите super()."
      },
      {
        wrong: "Думать, что extends — это копирование",
        why: "extends создаёт НАСЛЕДОВАНИЕ (цепочку прототипов), а не копирование методов.",
        right: "extends — цепочка прототипов: Dog → Animal → Object."
      }
    ],
    importantToRemember: [
      "extends создаёт дочерний класс",
      "super() — вызов родительского constructor",
      "super() ОБЯЗАТЕЛЕН до this в дочернем constructor",
      "super.method() — вызов родительского метода",
      "Переопределение методов — нормальная практика"
    ],
    connection: {
      back: "Вы знаете классы (JI8) — теперь вы знаете, как классы соотносятся друг с другом.",
      forward: "Следующий урок (JI10) — приватные и защищённые поля."
    }
  },

  // ============================================
  // JI10 — Private and Protected
  // ============================================
  {
    slug: "private-protected",
    track: "js-intermediate",
    order: 10,
    title: "Приватные и защищённые свойства",
    summary: "Понять разницу между #private (языковая поддержка) и _protected (договорённость), и когда каждое нужно.",
    level: "Intermediate",
    prerequisites: ["classes"],
    learningObjective: "После этого урока вы сможете создавать по-настоящему приватные поля через #, объяснять отличие от соглашения _ и выбирать правильный подход.",
    shortExplanation: "#field — языковое приватное поле. Недоступно снаружи. _field — только договорённость. Доступна, но «намёк» что не стоит трогать. В JavaScript используйте # для реальной инкапсуляции.",
    detailedExplanation: "#private поля:\nclass User {\n  #password;\n\n  constructor(name, password) {\n    this.name = name;\n    this.#password = password;\n  }\n\n  checkPassword(input) {\n    return input === this.#password;\n  }\n}\n\nconst user = new User('Анна', '12345');\nconsole.log(user.#password); // SyntaxError!\nconsole.log(user.checkPassword('12345')); // true\n\n#private методы:\nclass Timer {\n  #intervalId = null;\n\n  start() {\n    this.#intervalId = setInterval(() => {\n      console.log('тик');\n    }, 1000);\n  }\n\n  stop() {\n    clearInterval(this.#intervalId);\n  }\n}\n\n_underscore convention:\nclass User {\n  constructor(name) {\n    this._name = name; // «приватная» по договорённости\n  }\n}\n\nuser._name; // доступна! Просто «намёк».\n\nКогда что использовать:\n# — для реальной инкапсуляции (пароли, внутреннее состояние)\n_ — для совместимости с legacy кодом",
    mentalModel: "# — как замок на двери. _ — как табличка «не трогать» (но дверь не заперта).",
    examples: [
      {
        level: "minimal",
        code: "class Secret {\n  #secret = 'proto1337';\n\n  reveal() {\n    return this.#secret;\n  }\n}\n\nconst s = new Secret();\nconsole.log(s.reveal()); // 'proto1337'\n// console.log(s.#secret); // SyntaxError!",
        explanation: "#secret доступен только внутри класса."
      },
      {
        level: "simple",
        code: "class BankAccount {\n  #balance;\n\n  constructor(owner, balance) {\n    this.owner = owner;\n    this.#balance = balance;\n  }\n\n  deposit(amount) {\n    if (amount <= 0) throw new Error('Сумма должна быть > 0');\n    this.#balance += amount;\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n}\n\nconst acc = new BankAccount('Анна', 1000);\nacc.deposit(500);\nconsole.log(acc.balance); // 1500\n// acc.#balance = 999999; // SyntaxError!",
        explanation: "#balance защищён — изменение только через методы."
      },
      {
        level: "real",
        code: "class ValidationError {\n  #errors = [];\n\n  add(field, message) {\n    this.#errors.push({ field, message });\n  }\n\n  get hasErrors() {\n    return this.#errors.length > 0;\n  }\n\n  toString() {\n    return this.#errors\n      .map(e => `${e.field}: ${e.message}`)\n      .join('\\n');\n  }\n}\n\nconst errors = new ValidationError();\nerrors.add('email', 'Невалидный email');\nerrors.add('age', 'Возраст должен быть > 18');\nconsole.log(errors.hasErrors); // true\nconsole.log(errors.toString());",
        explanation: "Приватный массив ошибок — контроль через методы."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что _ защищает свойство",
        why: "_name доступна снаружи: user._name. Это только договорённость.",
        right: "Для реальной защиты используйте #name."
      },
      {
        wrong: "Использовать # для всего подряд",
        why: "# делает код менее гибким. Не всё нуждается в защите.",
        right: "Используйте # только когда защита необходима."
      },
      {
        wrong: "Забывать, что #private не наследуется",
        why: "#field доступен только в том классе, где объявлен. Дочерний класс не видит его.",
        right: "Для доступа дочернего класса — используйте protected методы."
      }
    ],
    importantToRemember: [
      "#field — языковая приватность (реальная защита)",
      "_field — договорённость (доступна снаружи)",
      "#private не наследуется",
      "Для защищённых данных — #private",
      "Для совместимости с legacy — _underscore"
    ],
    connection: {
      back: "Вы знаете классы и наследование (JI8-JI9) — теперь вы можете скрывать внутренние детали.",
      forward: "Следующий урок (JI11) — статические методы и свойства."
    }
  },

  // ============================================
  // JI11 — Static
  // ============================================
  {
    slug: "static",
    track: "js-intermediate",
    order: 11,
    title: "Статические методы и свойства",
    summary: "Понять разницу между методами экземпляра и статическими методами класса, и когда каждые нужны.",
    level: "Intermediate",
    prerequisites: ["classes"],
    learningObjective: "После этого урока вы сможете создавать статические методы и свойства, объяснять, когда использовать static, а когда — обычные члены, и понимать статику в наследовании.",
    shortExplanation: "static method — метод класса, вызываемый через ClassName.method(), а не через экземпляр. static property — свойство класса, а не экземпляра. Статические методы полезны для фабрик, утилит и методов, не привязанных к экземпляру.",
    detailedExplanation: "Static методы:\nclass MathHelper {\n  static add(a, b) {\n    return a + b;\n  }\n}\n\nMathHelper.add(2, 3); // 5\n// const m = new MathHelper();\n// m.add(2, 3); // Ошибка! add — статический\n\nStatic vs Instance:\n- Instance: привязан к конкретному объекту\n- Static: привязан к классу\n\nКогда использовать static:\n- Фабричные методы: User.create()\n- Утилиты: Array.from()\n- Вспомогательные функции\n\nStatic properties:\nclass Config {\n  static MAX_RETRIES = 3;\n  static API_URL = 'https://api.example.com';\n}\n\nStatic в наследовании:\nclass Animal {\n  static create(name) {\n    return new this(name);\n  }\n}\n\nclass Dog extends Animal {}\nconst rex = Dog.create('Рекс'); // работает!",
    mentalModel: "Static — как инструменты в мастерской. Экземпляр — как готовый стул. Статический метод — как дрель (она не принадлежит ни одному стулу, но принадлежит мастерской/классу).",
    examples: [
      {
        level: "minimal",
        code: "class Counter {\n  static count = 0;\n\n  constructor() {\n    Counter.count++;\n  }\n}\n\nnew Counter();\nnew Counter();\nconsole.log(Counter.count); // 2",
        explanation: "Статическое свойство принадлежит классу, не экземплярам."
      },
      {
        level: "simple",
        code: "class User {\n  constructor(name, email) {\n    this.name = name;\n    this.email = email;\n  }\n\n  static create(data) {\n    return new User(data.name, data.email);\n  }\n}\n\nconst user = User.create({ name: 'Анна', email: 'anna@test.com' });\nconsole.log(user.name); // 'Анна'",
        explanation: "Фабричный метод: User.create() вместо new User()."
      },
      {
        level: "real",
        code: "class Validators {\n  static isEmail(value) {\n    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);\n  }\n\n  static isPositive(value) {\n    return typeof value === 'number' && value > 0;\n  }\n\n  static minLength(value, min) {\n    return typeof value === 'string' && value.length >= min;\n  }\n}\n\nconsole.log(Validators.isEmail('test@test.com')); // true\nconsole.log(Validators.isPositive(-5)); // false",
        explanation: "Статический утилитный класс — коллекция проверок."
      }
    ],
    commonMistakes: [
      {
        wrong: "Вызывать static метод через this в не-static контексте",
        why: "this в instance method ссылается на экземпляр, не на класс.",
        right: "Используйте ClassName.method() или this.constructor.method()."
      },
      {
        wrong: "Использовать static для методов экземпляра",
        why: "Static методы не имеют доступа к this экземпляра.",
        right: "Если методу нужен экземпляр — это instance method."
      },
      {
        wrong: "Думать, что static = приватный",
        why: "Static — это « принадлежит классу », не « скрыт ». Доступен через ClassName.method().",
        right: "Static ≠ private. Для приватности используйте #."
      }
    ],
    importantToRemember: [
      "static method — вызывается через ClassName.method()",
      "static property — принадлежит классу, не экземпляру",
      "Фабричные методы — традиционный use case",
      "Static методы не имеют доступа к this экземпляра",
      "Static наследуется дочерними классами"
    ],
    connection: {
      back: "Вы знаете классы и приватные поля (JI8-JI10) — теперь у вас есть возможности уровня класса.",
      forward: "Следующий урок (JI12) — instanceof для проверки типа."
    }
  },

  // ============================================
  // JI12 — instanceof
  // ============================================
  {
    slug: "instanceof",
    track: "js-intermediate",
    order: 12,
    title: "instanceof",
    summary: "Научиться проверять, принадлежит ли объект классу, и понять как instanceof работает через prototype chain.",
    level: "Intermediate",
    prerequisites: ["classes"],
    learningObjective: "После этого урока вы сможете использовать instanceof для проверки типов объектов и объяснять, как он работает через цепочку прототипов.",
    shortExplanation: "instanceof проверяет, находится ли prototype объекта в цепочке прототипов класса. obj instanceof Class — true, если prototype класса есть в цепочке объекта.",
    detailedExplanation: "Коротко о прототипах, чтобы было понятно дальше: у каждого объекта есть скрытая ссылка [[Prototype]] на другой объект — его прототип. Если свойство не нашлось на самом объекте, JavaScript ищет его в прототипе, затем в прототипе прототипа и так далее — это и есть цепочка прототипов. У классов, созданных через class, эта цепочка автоматически выстраивается через extends. Детально механизм разберём в следующем уроке (JI13), здесь важно лишь то, что instanceof проверяет именно эту цепочку.\n\nСинтаксис:\nobj instanceof Class\n\nВозвращает true, если prototype класса (Class.prototype) находится в цепочке прототипов объекта.\n\nПример:\nclass Animal {}\nclass Dog extends Animal {}\n\nconst rex = new Dog();\nconsole.log(rex instanceof Dog);    // true\nconsole.log(rex instanceof Animal); // true (наследование!)\nconsole.log(rex instanceof Object); // true (всё — объект)\n\nКак это работает:\ninstanceof проверяет цепочку прототипов:\nrex → Dog.prototype → Animal.prototype → Object.prototype\n\nЕсли Class.prototype найден в этой цепочке — true.\n\nОграничения:\n- Не работает с примитивами: 'hello' instanceof String → false\n- Не работает в разных iframe/window\n- === !== instanceof: [] instanceof Array — true, typeof [] — 'object'",
    mentalModel: "instanceof — как проверка родословной. Вы спрашиваете: «Этот объект — потомок этого класса?» Он идёт по цепочке прототипов и проверяет.",
    examples: [
      {
        level: "minimal",
        code: "class Cat {}\nclass Kitten extends Cat {}\n\nconst cat = new Cat();\nconst kitten = new Kitten();\n\nconsole.log(cat instanceof Cat);      // true\nconsole.log(kitten instanceof Cat);   // true\nconsole.log(kitten instanceof Kitten); // true",
        explanation: "instanceof проверяет всю цепочку наследования."
      },
      {
        level: "simple",
        code: "function processValue(value) {\n  if (value instanceof Array) {\n    console.log(`Массив: ${value.length} элементов`);\n  } else if (value instanceof Date) {\n    console.log(`Дата: ${value.toLocaleDateString()}`);\n  } else if (typeof value === 'string') {\n    console.log(`Строка: ${value}`);\n  }\n}\n\nprocessValue([1, 2, 3]); // 'Массив: 3 элементов'\nprocessValue(new Date()); // 'Дата: ...'",
        explanation: "instanceof для проверки типа в функции."
      },
      {
        level: "real",
        code: "class ValidationError extends Error {\n  constructor(field, message) {\n    super(message);\n    this.field = field;\n    this.name = 'ValidationError';\n  }\n}\n\ntry {\n  throw new ValidationError('email', 'Невалидный email');\n} catch (error) {\n  if (error instanceof ValidationError) {\n    console.log(`Ошибка в поле ${error.field}: ${error.message}`);\n  } else {\n    console.log('Неизвестная ошибка');\n  }\n}",
        explanation: "instanceof для определения типа ошибки."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать instanceof для примитивов",
        why: "'hello' instanceof String — false! instanceof работает только с объектами.",
        right: "Для примитивов используйте typeof."
      },
      {
        wrong: "Путать typeof и instanceof",
        why: "typeof [] === 'object', [] instanceof Array === true. Разные инструменты.",
        right: "typeof — для примитивов. instanceof — для проверки класса объектов."
      },
      {
        wrong: "Думать, что instanceof = проверка.constructor",
        why: "instanceof проверяет prototype chain, не constructor напрямую.",
        right: "instanceof — цепочка прототипов. constructor — ссылка на функцию."
      }
    ],
    importantToRemember: [
      "instanceof проверяет prototype chain",
      "Работает только с объектами (не примитивами)",
      "Наследование учитывается: Kitten instanceof Animal = true",
      "typeof — для примитивов, instanceof — для классов объектов",
      "Не работает между iframe/window"
    ],
    connection: {
      back: "Вы знаете классы и прототипы (JI8-JI11) — теперь вы умеете проверять типы объектов.",
      forward: "Следующий урок (JI13) — прототипное наследование подробнее."
    }
  },

  // ============================================
  // JI13 — Prototypal Inheritance
  // ============================================
  {
    slug: "prototypal-inheritance",
    track: "js-intermediate",
    order: 13,
    title: "Прототипное наследование",
    summary: "Понять, как JavaScript ищет свойства через цепочку прототипов (prototype chain), и чем это отличается от классического наследования.",
    level: "Intermediate",
    prerequisites: ["classes", "objects"],
    learningObjective: "После этого урока вы сможете объяснить цепочку прототипов, поиск свойств и разницу между прототипным и классическим наследованием.",
    shortExplanation: "Каждый объект имеет [[Prototype]] — ссылку на другой объект. Когда вы обращаетесь к свойству, JavaScript ищет его в объекте, потом в его прототипе, потом в прототипе прототипа... пока не найдёт или не дойдёт до null.",
    detailedExplanation: "Что такое прототип?\n\nУ каждого объекта есть скрытое свойство [[Prototype]] — ссылка на другой объект (прототип).\n\nКогда JavaScript ищет свойство:\n1. Ищет в самом объекте\n2. Если не нашёл — идёт в [[Prototype]]\n3. Там тоже ищет\n4. И так далее по цепочке\n5. Если дошёл до null — возвращает undefined\n\nЦепочка прототипов (Prototype Chain):\nobj → obj.__proto__ → obj.__proto__.__proto__ → ... → Object.prototype → null\n\nПример:\nconst arr = [1, 2, 3];\narr.map(...); // map не в самом arr — он в Array.prototype!\narr.toString(); // toString в Object.prototype!\n\nОпределение прототипа:\n- Object.create(proto) — создаёт объект с указанным прототипом\n- __proto__ (legacy) — чтение/запись прототипа\n- Object.getPrototypeOf(obj) — современный способ чтения\n\nВажно: prototype — это свойство ФУНКЦИИ (класса), [[Prototype]] — это свойство ОБЪЕКТА.",
    mentalModel: "Prototype chain — как семья. Если вы ищете «деньги» и у вас нет — вы идёте к родителям. Если у родителей нет — к дедушке. И так далее, пока не найдёте или не дойдёте до null.",
    examples: [
      {
        level: "minimal",
        code: "const animal = { eats: true };\nconst rabbit = Object.create(animal);\n\nconsole.log(rabbit.eats); // true (из прототипа!)\nconsole.log(rabbit.jumps); // undefined\nconsole.log(Object.getPrototypeOf(rabbit) === animal); // true",
        explanation: "Object.create создаёт объект с указанным прототипом."
      },
      {
        level: "simple",
        code: "const arr = [1, 2, 3];\n\n// map определён в Array.prototype\nconsole.log(arr.map(x => x * 2)); // [2, 4, 6]\n\n// toString определён в Object.prototype\nconsole.log(arr.toString()); // '1,2,3'\n\n// Цепочка: arr → Array.prototype → Object.prototype → null",
        explanation: "Методы массивов — из Array.prototype. Методы объектов — из Object.prototype."
      },
      {
        level: "real",
        code: "const userMethods = {\n  greet() {\n    return `Привет, ${this.name}`;\n  },\n  toString() {\n    return `User(${this.name})`;\n  }\n};\n\nconst user1 = Object.create(userMethods);\nuser1.name = 'Анна';\n\nconst user2 = Object.create(userMethods);\nuser2.name = 'Пётр';\n\nconsole.log(user1.greet()); // 'Привет, Анна'\nconsole.log(user2.greet()); // 'Привет, Пётр'\n// Один прототип — много объектов",
        explanation: "Прототип как шаблон для методов."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать prototype и [[Prototype]]",
        why: "prototype — свойство функции. [[Prototype]] — свойство объекта. Разные вещи!",
        right: "Function.prototype — для функций. Object.getPrototypeOf(obj) — для объектов."
      },
      {
        wrong: "Использовать __proto__ как основной способ",
        why: "__proto__ — legacy. Используйте Object.getPrototypeOf() и Object.create().",
        right: "Object.getPrototypeOf(obj) — современный способ."
      },
      {
        wrong: "Думать, что prototype chain — это копирование",
        why: "Это ССЫЛКА, не копия. Изменение прототипа влияет на все объекты.",
        right: "Prototype — ссылка, не копия."
      }
    ],
    importantToRemember: [
      "Каждый объект имеет [[Prototype]]",
      "Свойства ищутся по цепочке прототипов",
      "prototype — свойство функции, [[Prototype]] — свойство объекта",
      "Object.create(proto) — современное создание с прототипом",
      "Цепочка: obj → proto → ... → Object.prototype → null"
    ],
    sources: [
      { title: "MDN: наследование и цепочка прототипов", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Inheritance_and_the_prototype_chain" }
    ],
    connection: {
      back: "Вы знаете instanceof (JI12) — теперь вы понимаете, как он устроен внутри.",
      forward: "Следующий урок (JI14) — F.prototype и функции-конструкторы."
    }
  },

  // ============================================
  // JI14 — F.prototype
  // ============================================
  {
    slug: "f-prototype",
    track: "js-intermediate",
    order: 14,
    title: "F.prototype и конструкторы",
    summary: "Понять, как function.prototype связывает конструктор и экземпляры, и как это работает «под капотом» классов.",
    level: "Intermediate",
    prerequisites: ["prototypal-inheritance"],
    learningObjective: "После этого урока вы сможете объяснить, как работает F.prototype, создавать объекты через new и понимать, что класс — это синтаксический сахар над этим механизмом.",
    shortExplanation: "Каждая функция имеет свойство prototype. Когда вы создаёте объект через new, его [[Prototype]] ссылается на constructor.prototype. Это связывает экземпляр с классом/конструктором.",
    detailedExplanation: "Что делает new?\n\nnew User('Анна') делает 4 вещи:\n1. Создаёт новый пустой объект {}\n2. Устанавливает его [[Prototype]] = User.prototype\n3. Вызывает User.call(this, 'Анна') — constructor\n4. Возвращает объект (если constructor не возвращает другой)\n\nСвязь:\nUser.prototype === user.__proto__\n\nЭто значит:\n- Методы, определённые в User.prototype, доступны экземпляру\n- Изменение User.prototype влияет на все экземпляры\n\nF.prototype vs Object.getPrototypeOf:\n- F.prototype — свойство функции (для нового экземпляра)\n- Object.getPrototypeOf(obj) — текущий прототип объекта\n\nВажно:\n- F.prototype = {} — замена прототипа (осторожно!)\n- Object.create(proto) — создание с прототипом",
    mentalModel: "F.prototype — как чертёж. new User() берёт чертёж User.prototype и создаёт дом. Все дома (экземпляры) используют один чертёж. Важно: это не копирование чертежа в каждый объект — объекты используют общий прототип для поиска свойств и методов.",
    examples: [
      {
        level: "minimal",
        code: "function User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function() {\n  return `Привет, ${this.name}`;\n};\n\nconst user = new User('Анна');\nconsole.log(user.greet()); // 'Привет, Анна'\nconsole.log(user.__proto__ === User.prototype); // true",
        explanation: "User.prototype становится прототипом экземпляра."
      },
      {
        level: "simple",
        code: "function Animal(name) {\n  this.name = name;\n}\n\nAnimal.prototype.speak = function() {\n  return `${this.name} издаёт звук`;\n};\n\nfunction Dog(name, breed) {\n  Animal.call(this, name); // вызов родителя\n  this.breed = breed;\n}\n\n// Наследование прототипа\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\n\nDog.prototype.speak = function() {\n  return `${this.name} гавкает`;\n};\n\nconst rex = new Dog('Рекс', 'овчарка');\nconsole.log(rex.speak()); // 'Рекс гавкает'",
        explanation: "Прототипное наследование через Object.create."
      },
      {
        level: "real",
        code: "// class = синтаксический сахар:\n// class User { greet() {} } \n// эквивалентно:\n// function User(name) { this.name = name; }\n// User.prototype.greet = function() {};\n\n// Доказательство:\nclass User {\n  constructor(name) { this.name = name; }\n  greet() { return `Привет, ${this.name}`; }\n}\n\nconst user = new User('Анна');\nconsole.log(typeof User); // 'function'\nconsole.log(User.prototype.greet); // function\nconsole.log(user.__proto__ === User.prototype); // true",
        explanation: "class — это function + prototype под капотом."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать Dog.prototype.constructor = Dog",
        why: "После Object.create() constructor ссылается на Animal, а не Dog.",
        right: "Восстанавливайте constructor: Dog.prototype.constructor = Dog."
      },
      {
        wrong: "Путать F.prototype и Object.getPrototypeOf",
        why: "F.prototype — для нового экземпляра. getPrototypeOf — текущий прототип.",
        right: "F.prototype используется new. Object.getPrototypeOf — для чтения."
      },
      {
        wrong: "Менять F.prototype после создания экземпляров",
        why: "Экземпляры уже ссылаются на старый prototype. Новые методы не будут доступны.",
        right: "Определяйте prototype ДО создания экземпляров."
      }
    ],
    importantToRemember: [
      "new создаёт объект с [[Prototype]] = F.prototype",
      "F.prototype — «чертёж» для экземпляров",
      "Object.getPrototypeOf() — чтение текущего прототипа",
      "class = function + prototype (синтаксический сахар)",
      "Восстанавливайте constructor после Object.create()"
    ],
    connection: {
      back: "Вы знаете цепочку прототипов (JI13) — теперь вы видите, как конструкторы с ней связаны.",
      forward: "Следующий урок (JI15) — встроенные прототипы: Array.prototype, Object.prototype."
    }
  },

  // ============================================
  // JI15 — Built-in Prototypes
  // ============================================
  {
    slug: "built-in-prototypes",
    track: "js-intermediate",
    order: 15,
    title: "Встроенные прототипы",
    summary: "Понять, что все встроенные объекты (Array, Object, String, Number) имеют свои прототипы с полезными методами.",
    level: "Intermediate",
    prerequisites: ["prototypal-inheritance"],
    learningObjective: "После этого урока вы сможете объяснить, как работают встроенные прототипы, назвать ключевые методы каждого и понимать, почему их расширение не рекомендуется.",
    shortExplanation: "Array.prototype содержит map, filter, reduce. Object.prototype содержит toString, hasOwnProperty. String.prototype содержит trim, includes. Все эти методы доступны благодаря прототипной цепочке.",
    detailedExplanation: "Встроенные прототипы:\n\nArray.prototype:\n- map, filter, find, reduce, forEach, some, every, flat, flatMap, sort, reverse, includes, indexOf, findIndex, join, slice, splice, at\n\nObject.prototype:\n- toString, hasOwnProperty, isPrototypeOf, valueOf\n\nString.prototype:\n- trim, includes, startsWith, endsWith, slice, replace, split, repeat, padStart, padEnd\n\nNumber.prototype:\n- toFixed, toPrecision, toString, isFinite, isInteger\n\nBoolean.prototype:\n- toString, valueOf\n\nЦепочка:\n[] → Array.prototype → Object.prototype → null\n'hello' → String.prototype → Object.prototype → null\n42 → Number.prototype → Object.prototype → null\n\nРасширение встроенных прототипов:\n// ПЛОХАЯ практика!\nArray.prototype.last = function() {\n  return this[this.length - 1];\n};\n\nПочему плохо:\n- Конфликты с будущими стандартами\n- Ломает другие библиотеки\n- Неочевидно для других разработчиков",
    mentalModel: "Встроенные прототипы — как набор инструментов в ящике. Array.prototype — ящик инструментов для массивов. Object.prototype — базовый набор для всех объектов.",
    examples: [
      {
        level: "minimal",
        code: "const arr = [1, 2, 3];\nconsole.log(arr.__proto__ === Array.prototype); // true\nconsole.log(Array.prototype.map); // function\nconsole.log([].map); // function (из Array.prototype)",
        explanation: "Все массивы наследуют методы из Array.prototype."
      },
      {
        level: "simple",
        code: "const str = '  Hello World  ';\nconsole.log(str.trim()); // 'Hello World' (из String.prototype)\nconsole.log(str.includes('World')); // true\n\nconst num = 3.14159;\nconsole.log(num.toFixed(2)); // '3.14' (из Number.prototype)",
        explanation: "Строки и числа имеют свои прототипы с методами."
      },
      {
        level: "real",
        code: "// Проверка собственных vs унаследованных свойств:\nconst arr = [1, 2, 3];\n\nconsole.log(arr.hasOwnProperty('length')); // true (собственное)\nconsole.log(arr.hasOwnProperty('map'));    // false (унаследованное)\n\n// Modern alternative:\nconsole.log('map' in arr); // true (включая прототипы)\nconsole.log(Object.hasOwn(arr, 'length')); // true",
        explanation: "hasOwnProperty различает собственные и унаследованные свойства."
      }
    ],
    commonMistakes: [
      {
        wrong: "Расширять встроенные прототипы",
        why: "Конфликты с будущими стандартами, ломает другие библиотеки.",
        right: "Не расширяйте Array.prototype, Object.prototype и т.д."
      },
      {
        wrong: "Путать собственные и унаследованные свойства",
        why: "'map' in [] — true, но map определён в Array.prototype, не в самом массиве.",
        right: "hasOwnProperty различает собственные свойства."
      },
      {
        wrong: "Думать, что prototype — это свойство экземпляра",
        why: "prototype — свойство ФУНКЦИИ. Экземпляр имеет [[Prototype]].",
        right: "F.prototype — для функции. obj.__proto__ — для экземпляра."
      }
    ],
    importantToRemember: [
      "Array.prototype — методы массивов",
      "Object.prototype — базовые методы объектов",
      "String.prototype — методы строк",
      "Не расширяйте встроенные прототипы",
      "hasOwnProperty различает собственные и унаследованные"
    ],
    connection: {
      back: "Вы знаете F.prototype (JI14) — теперь вы видите встроенные прототипы.",
      forward: "Следующий урок (JI16) — прототипные методы и __proto__ подробнее."
    }
  },

  // ============================================
  // JI16 — Prototype Methods and proto
  // ============================================
  {
    slug: "prototype-methods-proto",
    track: "js-intermediate",
    order: 16,
    title: "Прототипные методы и __proto__",
    summary: "Научиться работать с прототипами через Object.getPrototypeOf, Object.setPrototypeOf, и понять почему __proto__ — legacy.",
    level: "Intermediate",
    prerequisites: ["prototypal-inheritance", "f-prototype"],
    learningObjective: "После этого урока вы сможете использовать Object.getPrototypeOf и Object.create и объяснять, почему __proto__ использовать не рекомендуется.",
    shortExplanation: "Object.getPrototypeOf(obj) — чтение прототипа (современный способ). Object.create(proto) — создание объекта с прототипом. __proto__ — legacy, избегайте в новом коде.",
    detailedExplanation: "Современные методы работы с прототипами:\n\n1. Object.getPrototypeOf(obj) — чтение:\nconst obj = {};\nconsole.log(Object.getPrototypeOf(obj) === Object.prototype); // true\n\n2. Object.setPrototypeOf(obj, proto) — изменение:\nconst animal = { eats: true };\nconst rabbit = {};\nObject.setPrototypeOf(rabbit, animal);\nconsole.log(rabbit.eats); // true\n\n3. Object.create(proto) — создание:\nconst proto = { greet() { return 'Привет'; } };\nconst obj = Object.create(proto);\nconsole.log(obj.greet()); // 'Привет'\n\n__proto__ — legacy:\nobj.__proto__ — это геттер/сеттер для Object.getPrototypeOf/setPrototypeOf\n\nПочему __proto__ не рекомендуется:\n- Устаревший синтаксис\n- Может быть не реализован в некоторых средах\n- Медленнее\n- Путает с prototype (свойство функции)\n\nПравило:\n- Читайте: Object.getPrototypeOf(obj)\n- Изменяйте: Object.setPrototypeOf(obj, proto)\n- Создавайте: Object.create(proto)\n- __proto__ — только для отладки",
    mentalModel: "__proto__ — как старая карта. Она работает, но есть новая навигация (Object.getPrototypeOf). Используйте новую.",
    examples: [
      {
        level: "minimal",
        code: "const obj = {};\nconsole.log(Object.getPrototypeOf(obj) === Object.prototype); // true\n\nconst arr = [];\nconsole.log(Object.getPrototypeOf(arr) === Array.prototype); // true",
        explanation: "Object.getPrototypeOf показывает, откуда наследуются методы."
      },
      {
        level: "simple",
        code: "const animal = { eats: true };\n\n// Создание с прототипом\nconst rabbit = Object.create(animal);\nconsole.log(rabbit.eats); // true\nconsole.log(Object.getPrototypeOf(rabbit) === animal); // true",
        explanation: "Object.create — современный способ создания объекта с прототипом."
      },
      {
        level: "real",
        code: "// Паттерн: mixin через Object.create\nconst Serializable = {\n  serialize() {\n    return JSON.stringify(this);\n  }\n};\n\nconst Loggable = {\n  log() {\n    console.log(this.toString());\n  }\n};\n\nconst user = Object.create(Serializable);\nObject.assign(user, Loggable);\nuser.name = 'Анна';\n\nconsole.log(user.serialize()); // '{\"name\":\"Анна\"}'",
        explanation: "Object.create + Object.assign — mixin паттерн."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать __proto__ в продакшен-коде",
        why: "__proto__ — legacy. Может не работать в некоторых средах.",
        right: "Используйте Object.getPrototypeOf и Object.create."
      },
      {
        wrong: "Путать __proto__ и prototype",
        why: "__proto__ — свойство экземпляра (ссылка на прототип). prototype — свойство функции (чертёж).",
        right: "__proto__ === F.prototype для экземпляра, созданного через new F()."
      },
      {
        wrong: "Использовать Object.setPrototypeOf для частых изменений",
        why: "setPrototypeOf ломает оптимизации движка. Используйте Object.create для первоначальной настройки.",
        right: "setPrototypeOf — редко. Object.create — для первоначального прототипа."
      }
    ],
    importantToRemember: [
      "Object.getPrototypeOf(obj) — чтение прототипа",
      "Object.create(proto) — создание с прототипом",
      "Object.setPrototypeOf — изменение (осторожно!)",
      "__proto__ — legacy, избегайте",
      "__proto__ === F.prototype для экземпляра new F()"
    ],
    connection: {
      back: "Вы знаете встроенные прототипы (JI15) — теперь у вас есть инструменты для работы с ними.",
      forward: "Следующий урок (JI17) — полный набор методов массивов."
    }
  },

  // ============================================
  // JI17 — Full Array Methods
  // ============================================
  {
    slug: "full-array-methods",
    track: "js-intermediate",
    order: 17,
    title: "Полный набор методов массивов",
    summary: "Научиться использовать дополнительные методы массивов: find, findIndex, some, every, flat, flatMap, sort, Array.from, а также when to use each.",
    level: "Intermediate",
    prerequisites: ["basic-array-methods", "prototype-methods-proto"],
    learningObjective: "После этого урока вы сможете использовать find, findIndex, some, every, flat, flatMap, sort и Array.from, понимая вход и выход каждого метода.",
    shortExplanation: "Помимо map/filter/reduce, массивы имеют: find (первый подходящий), findIndex (его индекс), some/every (проверки), flat/flatMap (выравнивание), sort (сортировка), Array.from (создание). Все они не мутируют (кроме sort).",
    detailedExplanation: "Поиск и проверки:\nfind(fn) — первый подходящий элемент или undefined\nfindIndex(fn) — индекс первого подходящего или -1\nsome(fn) — хотя бы один true → true\nevery(fn) — все true → true\nincludes(value) — содержит ли элемент\n\nПреобразование:\nflat(depth) — выравнивание вложенности\nflatMap(fn) — map + flat(1)\nArray.from(arrayLike) — создание массива из iterable/array-like\n\nСортировка (мутирует!):\nsort(fn) — сортирует на месте\n\nВажно:\n- find → один элемент\n- filter → массив\n- sort мутирует исходный массив!\n- default sort — по строкам: [10, 9, 8] → [10, 8, 9]",
    mentalModel: "Массив — как команда работников. find — найти первого подходящего. filter — оставить подходящих. sort — рассортировать. flat — выровнять иерархию.",
    examples: [
      {
        level: "minimal",
        code: "const nums = [1, 2, 3, 4, 5];\n\nconsole.log(nums.find(x => x > 3));     // 4\nconsole.log(nums.findIndex(x => x > 3)); // 3\nconsole.log(nums.some(x => x > 4));      // true\nconsole.log(nums.every(x => x > 0));     // true",
        explanation: "find/findIndex — поиск. some/every — проверки."
      },
      {
        level: "simple",
        code: "const nested = [1, [2, 3], [4, [5, 6]]];\nconsole.log(nested.flat());     // [1, 2, 3, 4, [5, 6]]\nconsole.log(nested.flat(2));    // [1, 2, 3, 4, 5, 6]\n\nconst words = ['hello world', 'foo bar'];\nconsole.log(words.flatMap(w => w.split(' ')));\n// ['hello', 'world', 'foo', 'bar']",
        explanation: "flat выравнивает. flatMap = map + flat."
      },
      {
        level: "real",
        code: "// ⚠️ sort мутирует!\nconst arr = [3, 1, 4, 1, 5];\narr.sort((a, b) => a - b);\nconsole.log(arr); // [1, 1, 3, 4, 5] — оригинальный изменён!\n\n// БЕЗ мутации:\nconst sorted = [...arr].sort((a, b) => a - b);\n\n// Array.from для создания из DOM NodeList:\nconst divs = document.querySelectorAll('div');\nconst divArray = Array.from(divs);\ndivArray.forEach(div => console.log(div.className));",
        explanation: "sort мутирует! Для иммутабельности — [...arr].sort()."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать, что sort мутирует",
        why: "arr.sort() изменяет arr! Это не создаёт новый массив.",
        right: "Для иммутабельности: [...arr].sort()."
      },
      {
        wrong: "Использовать sort без компаратора для чисел",
        why: "sort() по умолчанию сортирует как строки: [10, 9, 8] → [10, 8, 9].",
        right: "Для чисел: sort((a, b) => a - b)."
      },
      {
        wrong: "Путать flat и flatMap",
        why: "flat выравнивает вложенность. flatMap = map + flat(1).",
        right: "flat — выравнивание. flatMap — преобразование + выравнивание."
      }
    ],
    importantToRemember: [
      "find → один элемент, findIndex → его индекс",
      "some → хотя бы один, every → все",
      "flat выравнивает, flatMap = map + flat",
      "sort мутирует! Для иммутабельности — [...arr].sort()",
      "Array.from создаёт массив из iterable/array-like"
    ],
    connection: {
      back: "Вы знаете базовые методы массивов (J14-J15) — теперь у вас есть полный инструментарий.",
      forward: "Следующий урок (JI18) — Map и Set для коллекций «ключ-значение» и уникальных значений."
    }
  },

  // ============================================
  // JI18 — Map and Set
  // ============================================
  {
    slug: "map-and-set",
    track: "js-intermediate",
    order: 18,
    title: "Map и Set",
    summary: "Научиться использовать Map для коллекций ключ/значение (с любыми типами ключей) и Set для хранения уникальных значений.",
    level: "Intermediate",
    prerequisites: ["prototypal-inheritance", "objects"],
    learningObjective: "После этого урока вы сможете использовать Map и Set, объяснять, когда выбирать их вместо Object/Array, и пользоваться их методами.",
    shortExplanation: "Map — коллекция ключ/значение, где ключи могут быть любыми типами (не только строки). Set — коллекция уникальных значений. Map/Set поддерживают порядок вставки и имеют методы size, has, delete.",
    detailedExplanation: "Map:\nconst map = new Map();\nmap.set('name', 'Анна');\nmap.set(42, 'число');\nmap.set(true, 'булево');\n\nconsole.log(map.get('name')); // 'Анна'\nconsole.log(map.size);        // 3\nconsole.log(map.has(42));     // true\nmap.delete(true);\n\nMap vs Object:\n- Object: ключи ТОЛЬКО строки/Symbol\n- Map: ключи ЛЮБОЙ тип\n- Map: сохраняет порядок вставки\n- Map: имеет size\n- Map: безопаснее для частых добавлений/удалений\n\nSet:\nconst set = new Set([1, 2, 3, 2, 1]);\nconsole.log(set); // Set {1, 2, 3}\nconsole.log(set.size); // 3\n\nset.add(4);\nset.delete(1);\nconsole.log(set.has(2)); // true\n\nSet для удаления дубликатов:\nconst arr = [1, 2, 2, 3, 3, 3];\nconst unique = [...new Set(arr)]; // [1, 2, 3]\n\nSet vs Array:\n- Array: допускает дубликаты, индексы\n- Set: только уникальные, нет индексов\n- Set.has() быстрее Array.includes()",
    mentalModel: "Map — как словарь, где можно искать не только по слову, но и по картинке или числу. Set — как мешок без дубликатов: кладёте вещь — если уже есть, ничего не происходит.",
    examples: [
      {
        level: "minimal",
        code: "const map = new Map();\nmap.set('name', 'Анна');\nmap.set(1, 'один');\n\nconsole.log(map.get('name')); // 'Анна'\nconsole.log(map.size);        // 2\nconsole.log(map.has(1));      // true",
        explanation: "Map хранит пары ключ/значение с любыми типами ключей."
      },
      {
        level: "simple",
        code: "const set = new Set([1, 2, 2, 3, 3, 3]);\nconsole.log(set); // Set {1, 2, 3}\nconsole.log(set.size); // 3\n\nset.add(4);\nset.delete(1);\nconsole.log(set.has(2)); // true\n\n// Удаление дубликатов из массива:\nconst arr = ['а', 'б', 'а', 'в', 'б'];\nconst unique = [...new Set(arr)]; // ['а', 'б', 'в']",
        explanation: "Set автоматически хранит только уникальные значения."
      },
      {
        level: "real",
        code: "// Map для подсчёта частоты:\nfunction countWords(text) {\n  const words = text.toLowerCase().split(/\\s+/);\n  const freq = new Map();\n\n  for (const word of words) {\n    freq.set(word, (freq.get(word) || 0) + 1);\n  }\n\n  return freq;\n}\n\nconst result = countWords('hello world hello');\nconsole.log(result.get('hello')); // 2\nconsole.log(result.get('world')); // 1",
        explanation: "Map для подсчёта: ключ — слово, значение — количество."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что Map и Object — одно и то же",
        why: "Map: ключи любых типов, порядок вставки, size, безопасные операции. Object: ключи только строки/Symbol.",
        right: "Map для коллекций данных. Object для структур/DTO."
      },
      {
        wrong: "Использовать Set как Array",
        why: "Set не имеет индексов: set[0] не работает. Только set.has(), set.add(), set.delete().",
        right: "Set для уникальных значений. Array — для упорядоченных."
      },
      {
        wrong: "Забывать, что Map.includes не существует",
        why: "У Map нет includes. Используйте map.has(key).",
        right: "Map: has(). Set: has(). Array: includes()."
      }
    ],
    importantToRemember: [
      "Map: ключи любых типов, порядок вставки, size",
      "Set: уникальные значения, без индексов",
      "Map.has() / Set.has() вместо includes",
      "Set для удаления дубликатов: [...new Set(arr)]",
      "Map/Object: разные use cases"
    ],
    connection: {
      back: "Вы знаете массивы (J13-J17) — теперь у вас есть альтернативные типы коллекций.",
      forward: "Следующий урок (JI19) — итерируемые объекты и протокол итерации."
    }
  },

  // ============================================
  // JI19 — Iterable Objects
  // ============================================
  {
    slug: "iterable-objects",
    track: "js-intermediate",
    order: 19,
    title: "Итерируемые объекты",
    summary: "Понять протокол итерации: что такое iterable, iterator, next(), и как создавать свои итерируемые объекты через Symbol.iterator.",
    level: "Intermediate",
    prerequisites: ["built-in-prototypes"],
    learningObjective: "После этого урока вы сможете объяснить протокол итерации, создавать собственные итерируемые объекты через Symbol.iterator и понимать, как for...of работает внутри.",
    shortExplanation: "for...of работает не только с массивами — с любым итерируемым объектом. Iterable — объект с методом Symbol.iterator, который возвращает iterator. Iterator имеет метод next(), возвращающий { value, done }.",
    detailedExplanation: "Что такое iterable?\n\nIterable — объект, который можно перебрать через for...of.\nВстроенные iterables: Array, String, Map, Set, NodeList.\n\nЧто делает for...of?\nfor (const item of iterable) { ... }\n\nЭто эквивалентно:\nconst iterator = iterable[Symbol.iterator]();\nlet result = iterator.next();\nwhile (!result.done) {\n  const item = result.value;\n  // ... тело цикла\n  result = iterator.next();\n}\n\nSymbol.iterator:\nОбъект — iterable, если у него есть метод [Symbol.iterator], который возвращает iterator.\n\nIterator:\nОбъект с методом next(), который возвращает { value, done }.\n\nclass Range {\n  constructor(start, end) {\n    this.start = start;\n    this.end = end;\n  }\n\n  [Symbol.iterator]() {\n    let current = this.start;\n    const end = this.end;\n\n    return {\n      next() {\n        if (current <= end) {\n          return { value: current++, done: false };\n        }\n        return { value: undefined, done: true };\n      }\n    };\n  }\n}\n\nfor (const num of new Range(1, 5)) {\n  console.log(num); // 1, 2, 3, 4, 5\n}",
    mentalModel: "Iterable — как книга. Iterator — как закладка. Вы открываете книгу (Symbol.iterator) и получаете закладку (iterator). Каждый раз, когда вы читаете страницу (next()), закладка двигается вперёд. Когда книга закончится (done: true) — вы останавливаетесь.",
    examples: [
      {
        level: "minimal",
        code: "const arr = [1, 2, 3];\nconst str = 'abc';\nconst set = new Set([1, 2, 3]);\nconst map = new Map([['a', 1], ['b', 2]]);\n\n// Все — iterable:\nfor (const item of arr)  console.log(item);\nfor (const char of str) console.log(char);\nfor (const item of set) console.log(item);\nfor (const [key, val] of map) console.log(key, val);",
        explanation: "for...of работает с любым iterable."
      },
      {
        level: "simple",
        code: "// Ручной вызов iterator:\nconst arr = [10, 20, 30];\nconst iterator = arr[Symbol.iterator]();\n\nconsole.log(iterator.next()); // { value: 10, done: false }\nconsole.log(iterator.next()); // { value: 20, done: false }\nconsole.log(iterator.next()); // { value: 30, done: false }\nconsole.log(iterator.next()); // { value: undefined, done: true }",
        explanation: "Каждый вызов next() возвращает следующее значение."
      },
      {
        level: "real",
        code: "class Fibonacci {\n  constructor(limit) {\n    this.limit = limit;\n  }\n\n  [Symbol.iterator]() {\n    let a = 0, b = 1, count = 0;\n    const limit = this.limit;\n\n    return {\n      next() {\n        if (count >= limit) return { value: undefined, done: true };\n        const value = a;\n        [a, b] = [b, a + b];\n        count++;\n        return { value, done: false };\n      }\n    };\n  }\n}\n\nfor (const num of new Fibonacci(8)) {\n  console.log(num); // 0, 1, 1, 2, 3, 5, 8, 13\n}",
        explanation: "Кастомный iterable: бесконечная последовательность Фибоначчи с лимитом."
      }
    ],
    commonMistakes: [
      {
        wrong: "Путать iterable и iterator",
        why: "Iterable — объект с Symbol.iterator. Iterator — объект с next(). Разные роли.",
        right: "Iterable возвращает iterator. Iterator возвращает значения."
      },
      {
        wrong: "Думать, что for...of работает с объектами {}",
        why: "Обычные объекты НЕ iterable. Только Array, String, Map, Set, NodeList и т.д.",
        right: "Для объектов используйте Object.keys/values/entries + for...of."
      },
      {
        wrong: "Забывать возвращать { value, done } из next()",
        why: "next() должен возвращать объект с свойствами value и done.",
        right: "return { value: ..., done: true/false }."
      }
    ],
    importantToRemember: [
      "Iterable имеет Symbol.iterator, возвращающий iterator",
      "Iterator имеет next(), возвращающий { value, done }",
      "for...of = iterable[Symbol.iterator]() + next() цикл",
      "Обычные {} — НЕ iterable",
      "Array, String, Map, Set — встроенные iterables"
    ],
    connection: {
      back: "Вы знаете Map и Set (JI18) — они тоже итерируемые! Теперь вы знаете, почему.",
      forward: "Вы завершили JS Intermediate! Дальше — JS Async: промисы и async/await."
    }
  }
] as const;
