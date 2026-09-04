// JavaScript Async Lessons — JA1 through JA7
// Following Knowledge Map v3 and Stage 3 Lesson Blueprint

export const jsAsyncLessons = [
  // ============================================
  // JA1 — Synchronous Code and Blocking
  // ============================================
  {
    slug: "sync-vs-async",
    track: "js-async",
    order: 1,
    title: "Синхронный код и блокировка",
    summary: "Понять, как JavaScript выполняет код последовательно, что такое call stack, и почему долгие операции блокируют интерфейс.",
    level: "Intermediate",
    prerequisites: ["code-style"],
    learningObjective: "После этого урока вы сможете объяснить, что такое стек вызовов, описать, почему синхронная блокировка — это проблема, и понять, зачем существуют асинхронные подходы.",
    shortExplanation: "JavaScript выполняет код построчно в одном потоке. Каждый вызов функции добавляется в стек вызовов (call stack). Если операция занимает много времени — она блокирует весь интерфейс. Асинхронные механизмы позволяют запускать долгие операции, не блокируя основной поток.",
    detailedExplanation: "Call Stack (стек вызовов):\n\nКогда JavaScript выполняет функцию, он помещает её в стек. Когда функция завершается — она удаляется из стека.\n\nfunction first() { console.log('first'); }\nfunction second() { first(); console.log('second'); }\nsecond();\n\n// Стек: [second] → [second, first] → [second] → []\n// Вывод: first, second\n\nСинхронный код выполняется последовательно. Если функция выполняется долго — весь код «ждёт».\n\nПример блокировки:\nfunction heavyComputation() {\n  // Цикл на 5 секунд\n  const start = Date.now();\n  while (Date.now() - start < 5000) {}\n  console.log('Готово!');\n}\n\nheavyComputation(); // 5 секунд блокировки!\nconsole.log('Это выведется ПОСЛЕ'); // через 5 секунд\n\nПочему это проблема:\n- Браузер не может обрабатывать клики\n- Анимации останавливаются\n- Страница «зависает»\n\nВ браузере есть один основной поток (main thread). JavaScript-код и обработка событий работают в одном потоке. Поэтому долгая синхронная операция блокирует всё.\n\nАсинхронные механизмы:\nБраузер предоставляет механизмы для неблокирующего выполнения:\n- Таймеры (setTimeout)\n- Сетевые запросы (fetch)\n- События (addEventListener)\n\nЭти операции выполняются параллельно основному потоку, а результат передаётся обратно через callback.",
    mentalModel: "Call stack — как стопка тарелок. Каждый вызов функции — новая тарелка сверху. Когда функция завершается — тарелка убирается. Если стопка слишком высокая — она падает (Stack Overflow). Блокирующий код — как тяжёлая тарелка, которую невозможно убрать, пока она не «прогрузится».",
    examples: [
      {
        level: "minimal",
        code: "console.log('1');\nconsole.log('2');\nconsole.log('3');\n// Вывод: 1, 2, 3\n// Синхронный код: строки выполняются по порядку.",
        explanation: "Синхронный код выполняется последовательно, строка за строкой."
      },
      {
        level: "simple",
        code: "function a() { console.log('a'); }\nfunction b() { a(); console.log('b'); }\nfunction c() { b(); console.log('c'); }\n\n// Стек: [c] → [c, b] → [c, b, a] → [c, b] → [c] → []\n// Вывод: a, b, c",
        explanation: "Вложенные вызовы: стек растёт при входе и уменьшается при выходе."
      },
      {
        level: "real",
        code: "// Блокировка UI:\nconst button = document.querySelector('#myButton');\nbutton.addEventListener('click', () => {\n  console.log('Клик!');\n  // Блокирующий цикл:\n  const start = Date.now();\n  while (Date.now() - start < 3000) {}\n  console.log('Готово!');\n  // 3 секунды: кнопка не реагирует, анимации стоят\n});",
        explanation: "Блокирующий код в обработчике событий «замораживает» интерфейс."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что JavaScript многопоточный",
        why: "JavaScript — однопоточный (main thread). Браузер может выполнять JS-код только в одном потоке.",
        right: "JavaScript — один поток. Браузер использует Web Workers и APIs для параллельной работы."
      },
      {
        wrong: "Использовать циклы для ожидания",
        why: "while (Date.now() < target) {} — блокирует весь поток.",
        right: "Используйте setTimeout, Promises или async/await для неблокирующего ожидания."
      },
      {
        wrong: "Путать setTimeout(fn, 0) с немедленным выполнением",
        why: "setTimeout(fn, 0) планирует выполнение на следующий тик, а не выполняет немедленно.",
        right: "setTimeout(fn, 0) — «выполни, когда будет возможность», а не «прямо сейчас»."
      }
    ],
    importantToRemember: [
      "JavaScript — однопоточный (main thread)",
      "Call stack — стек вызовов: функция вверх, завершение — вниз",
      "Синхронный код блокирует выполнение следующих строк",
      "Блокирующие операции «замораживают» интерфейс",
      "Асинхронные механизмы позволяют работать без блокировки"
    ],
    connection: {
      back: "Вы знаете JavaScript Core и Intermediate (J0-JI19) — теперь вы понимаете, как выполнение устроено внутри.",
      forward: "Следующий урок (JA2) — callback-функции и setTimeout: первый асинхронный механизм."
    }
  },

  // ============================================
  // JA2 — Callbacks and setTimeout
  // ============================================
  {
    slug: "callbacks-settimeout",
    track: "js-async",
    order: 2,
    title: "Callback-функции и setTimeout",
    summary: "Понять, что callback — это функция, переданная другой функции для вызова позже, и как setTimeout планирует выполнение.",
    level: "Intermediate",
    prerequisites: ["sync-vs-async"],
    learningObjective: "После этого урока вы сможете писать callback-функции, использовать setTimeout для отложенного выполнения и предсказывать порядок вывода в смешанном синхронном/асинхронном коде.",
    shortExplanation: "Callback — функция, которую передают другой функции как аргумент. Она вызывается позже, когда «пришло время». setTimeout(callback, delay) планирует вызов callback через delay миллисекунд. callback не блокирует выполнение — он просто ждёт в очереди.",
    detailedExplanation: "Что такое callback?\n\nCallback — это функция, переданная как аргумент другой функции. Она будет вызвана «обратно» (callback) позже.\n\nfunction doSomething(callback) {\n  console.log('Делаю...');\n  callback(); // вызываем callback\n}\n\ndoSomething(() => console.log('Готово!'));\n// Вывод: Делаю... → Готово!\n\nsetTimeout:\n\nsetTimeout(() => {\n  console.log('Через 2 секунды');\n}, 2000);\n\nsetTimeout НЕ «останавливает» JavaScript. Он:\n1. Регистрирует callback в таймере\n2. Продолжает выполнять следующий код\n3. Когда время приходит — callback добавляется в очередь\n4. Когда стек пуст — callback выполняется\n\nПорядок выполнения:\nconsole.log('1');\nsetTimeout(() => console.log('2'), 0);\nconsole.log('3');\n// Вывод: 1, 3, 2\n\nsetTimeout(fn, 0) НЕ означает «выполнить немедленно». Это значит: «выполни, когда стек будет пуст».\n\nПочему callback-и существуют:\n- Таймеры (setTimeout, setInterval)\n- События (addEventListener)\n- Сетевые запросы (fetch)\n- Файловые операции\n\nВезде, где результат приходит не сразу — используется callback.",
    mentalModel: "Callback — как записка «когда будешь свободен, сделай это». Вы передаёте записку (callback) и идёте дальше. Когда освобождаетесь — читаете записку и выполняете.",
    examples: [
      {
        level: "minimal",
        code: "function greet(name, callback) {\n  console.log(`Привет, ${name}!`);\n  callback();\n}\n\ngreet('Анна', () => console.log('До свидания!'));\n// Вывод: Привет, Анна! → До свидания!",
        explanation: "Callback вызывается после основной логики."
      },
      {
        level: "simple",
        code: "console.log('Начало');\n\nsetTimeout(() => {\n  console.log('Таймер сработал');\n}, 1000);\n\nconsole.log('Конец');\n// Вывод: Начало → Конец → (через 1 сек) Таймер сработал",
        explanation: "setTimeout не блокирует: сначала выполняется весь синхронный код."
      },
      {
        level: "real",
        code: "function loadUser(userId, onSuccess, onError) {\n  // Имитация сетевого запроса\n  setTimeout(() => {\n    if (userId > 0) {\n      onSuccess({ id: userId, name: 'Анна' });\n    } else {\n      onError('Неверный ID');\n    }\n  }, 500);\n}\n\nloadUser(\n  1,\n  (user) => console.log(`Загружен: ${user.name}`),\n  (error) => console.log(`Ошибка: ${error}`)\n);",
        explanation: "Два callback: onSuccess для успеха, onError для ошибки."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что setTimeout(fn, 0) выполняется немедленно",
        why: "setTimeout(fn, 0) планирует callback на следующий тик event loop, после завершения текущего синхронного кода.",
        right: "setTimeout(fn, 0) = «выполни, когда стек пуст»."
      },
      {
        wrong: "Вызывать callback немедленно вместо передачи",
        why: "doSomething(greet()) — вызов greet() немедленно, результат передаётся. doSomething(greet) — передаётся сама функция.",
        right: "Передавайте функцию без скобок: doSomething(greet)."
      },
      {
        wrong: "Забывать, что callback — это просто функция",
        why: "Callback не магия. Это обычный аргумент-функция.",
        right: "Callback = функция как аргумент. Ничего особенного."
      }
    ],
    importantToRemember: [
      "Callback — функция, переданная как аргумент",
      "setTimeout планирует вызов, но не блокирует",
      "setTimeout(fn, 0) ≠ немедленное выполнение",
      "Порядок: синхронный код → callback'и",
      "Callback — основа для таймеров, событий, запросов"
    ],
    connection: {
      back: "Вы понимаете стек вызовов и блокировку (JA1) — теперь вы видите, как асинхронность её обходит.",
      forward: "Следующий урок (JA3) — таймеры: setTimeout и setInterval подробнее."
    }
  },

  // ============================================
  // JA3 — Timers: setTimeout / setInterval
  // ============================================
  {
    slug: "timers",
    track: "js-async",
    order: 3,
    title: "Таймеры: setTimeout и setInterval",
    summary: "Научиться использовать setTimeout для отложенного выполнения и setInterval для повторяющихся действий, а также отменять таймеры.",
    level: "Intermediate",
    prerequisites: ["callbacks-settimeout"],
    learningObjective: "После этого урока вы сможете использовать setTimeout и setInterval, отменять таймеры через clearTimeout/clearInterval и объяснять, почему setInterval может давать сдвиг по времени.",
    shortExplanation: "setTimeout(fn, delay) выполняет fn через delay миллисекунд. setInterval(fn, interval) повторяет fn каждые interval миллисекунд. clearTimeout/id clearTimeout отменяют таймеры. Важно: setInterval не компенсирует время выполнения callback.",
    detailedExplanation: "setTimeout:\nconst id = setTimeout(() => {\n  console.log('Через 1 секунду');\n}, 1000);\n\nclearTimeout(id); // отмена — callback не вызовется\n\nsetInterval:\nconst intervalId = setInterval(() => {\n  console.log('Каждую секунду');\n}, 1000);\n\n// Остановить через 5 секунд:\nsetTimeout(() => clearInterval(intervalId), 5000);\n\nПроблема setInterval:\nsetInterval(() => {\n  // операция занимает 300мс\n  console.log(new Date().toISOString());\n}, 1000);\n\n// Интервал: 1000мс + 300мс выполнения = 1300мс между вызовами\n// Таймер «дрейфует»\n\nПравильный способ — рекурсивный setTimeout:\nfunction repeat() {\n  // операция\n  setTimeout(repeat, 1000); // следующий вызов ПОСЛЕ завершения\n}\nsetTimeout(repeat, 1000);\n\nМинимальная задержка:\n- В браузере: минимум ~4мс (для вложенных таймеров)\n- setTimeout(fn, 0) ≈ 0-4мс\n- В фоновых вкладках: может быть увеличена до ~1000мс",
    mentalModel: "setTimeout — как будильник: поставьте на конкретное время — он зазвонит один раз. setInterval — как метроном: повторяет звук каждые N секунд. Но метроном не знает, сколько времени занял каждый удар — он просто ждёт интервал.",
    examples: [
      {
        level: "minimal",
        code: "setTimeout(() => console.log('1'), 0);\nsetTimeout(() => console.log('2'), 0);\nconsole.log('3');\n// Вывод: 3, 1, 2\n// setTimeout(fn, 0) выполняется после синхронного кода",
        explanation: "Таймеры с delay=0 выполняются после текущего синхронного кода."
      },
      {
        level: "simple",
        code: "let count = 0;\nconst id = setInterval(() => {\n  count++;\n  console.log(`Счётчик: ${count}`);\n  if (count >= 5) clearInterval(id);\n}, 1000);\n// Вывод: 1, 2, 3, 4, 5 (через каждую секунду)",
        explanation: "setInterval + clearInterval для ограничения повторений."
      },
      {
        level: "real",
        code: "// Рекурсивный setTimeout (без дрейфа)\nfunction countdown(seconds) {\n  if (seconds <= 0) {\n    console.log('Время вышло!');\n    return;\n  }\n  console.log(`Осталось: ${seconds}с`);\n  setTimeout(() => countdown(seconds - 1), 1000);\n}\ncountdown(5);\n// Вывод: 5, 4, 3, 2, 1, Время вышло!",
        explanation: "Рекурсивный setTimeout гарантирует точный интервал."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать setInterval для точных интервалов",
        why: "setInterval не учитывает время выполнения callback — интервал «дрейфует».",
        right: "Используйте рекурсивный setTimeout для точных интервалов."
      },
      {
        wrong: "Забывать clearInterval",
        why: "setInterval работает бесконечно — утечка памяти и ненужная нагрузка.",
        right: "Всегда планируйте остановку setInterval."
      },
      {
        wrong: "Думать, что delay возвращает точное время",
        why: "Браузер может увеличить задержку (фоновые вкладки, нагрузка CPU).",
        right: "setTimeout/setInterval — «не раньше», а не «точно в»."
      }
    ],
    importantToRemember: [
      "setTimeout(fn, delay) — одноразовый таймер",
      "setInterval(fn, interval) — повторяющийся таймер",
      "clearTimeout/clearInterval отменяют таймер",
      "Рекурсивный setTimeout точнее setInterval",
      "Минимальная задержка ~4мс в браузере"
    ],
    connection: {
      back: "Вы понимаете callback-функции (JA2) — теперь вы применяете их вместе с таймерами.",
      forward: "Следующий урок (JA4) — промисы: лучший способ обрабатывать асинхронные результаты."
    }
  },

  // ============================================
  // JA4 — Promises
  // ============================================
  {
    slug: "promises",
    track: "js-async",
    order: 4,
    title: "Промисы (Promises)",
    summary: "Понять, что Promise — это объект, представляющий будущий результат операции, и научиться создавать и использовать промисы с then/catch/finally.",
    level: "Intermediate",
    prerequisites: ["timers"],
    learningObjective: "После этого урока вы сможете создавать промисы через resolve/reject, выстраивать цепочки .then/.catch/.finally и объяснять три состояния промиса.",
    shortExplanation: "Promise — объект, представляющий результат операции, который станет известен позже. У него три состояния: pending (ожидание), fulfilled (выполнено), rejected (ошибка). then обрабатывает успех, catch — ошибку, finally — завершение в любом случае.",
    detailedExplanation: "Создание Promise:\nconst promise = new Promise((resolve, reject) => {\n  // Асинхронная операция\n  setTimeout(() => {\n    resolve('Успех!'); // fulfilled\n    // или reject('Ошибка!'); // rejected\n  }, 1000);\n});\n\nТри состояния:\n1. Pending — операция выполняется\n2. Fulfilled — resolve вызван → результат доступен\n3. Rejected — reject вызван → ошибка доступна\n\nПосле fulfilled/rejected состояние НЕ меняется.\n\nИспользование:\npromise\n  .then(result => console.log(result)) // 'Успех!'\n  .catch(error => console.log(error))\n  .finally(() => console.log('Завершено'));\n\nЦепочка then:\nfetchUser(1)\n  .then(user => fetchPosts(user.id))\n  .then(posts => console.log(posts))\n  .catch(error => console.log(error));\n\nКаждый .then возвращает НОВЫЙ Promise.\n\nPromise.all:\nconst p1 = fetch('/api/users');\nconst p2 = fetch('/api/posts');\nPromise.all([p1, p2])\n  .then(([users, posts]) => { /* оба готовы */ })\n  .catch(error => { /* хотя бы один отклонён */ });",
    mentalModel: "Promise — как квитанция в ресторане. Вы сделали заказ (вызвали Promise). Вам дали квитанцию (Promise object). Когда еда готова (resolve) — вам принесут блюдо (result). Если кухня закрылась (reject) — вам сообщат об ошибке. Вы можете пойти гулять (другий код выполняется) пока ждёте.",
    examples: [
      {
        level: "minimal",
        code: "const promise = new Promise((resolve) => {\n  setTimeout(() => resolve('Готово!'), 1000);\n});\n\npromise.then(result => console.log(result));\n// Через 1 сек: 'Готово!'",
        explanation: "Простейший Promise: resolve через 1 секунду."
      },
      {
        level: "simple",
        code: "function divide(a, b) {\n  return new Promise((resolve, reject) => {\n    if (b === 0) {\n      reject(new Error('Деление на ноль!'));\n    } else {\n      resolve(a / b);\n    }\n  });\n}\n\ndivide(10, 2)\n  .then(result => console.log(result))  // 5\n  .catch(error => console.log(error.message));\n\ndivide(10, 0)\n  .then(result => console.log(result))\n  .catch(error => console.log(error.message)); // 'Деление на ноль!'",
        explanation: "Promise с валидацией: resolve для успеха, reject для ошибки."
      },
      {
        level: "real",
        code: "function fetchUserData(userId) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (userId > 0) {\n        resolve({ id: userId, name: 'Анна', email: 'anna@test.com' });\n      } else {\n        reject(new Error('Неверный ID'));\n      }\n    }, 500);\n  });\n}\n\n// Цепочка промисов:\nfetchUserData(1)\n  .then(user => {\n    console.log(`Загружен: ${user.name}`);\n    return fetchUserData(2);\n  })\n  .then(user => {\n    console.log(`Загружен: ${user.name}`);\n  })\n  .catch(error => {\n    console.log(`Ошибка: ${error.message}`);\n  })\n  .finally(() => {\n    console.log('Загрузка завершена');\n  });",
        explanation: "Цепочка then: каждый шаг возвращает новый Promise."
      }
    ],
    commonMistakes: [
      {
        wrong: "Забывать catch в цепочке then",
        why: "Без catch ошибка промиса «зависает» — не обрабатывается.",
        right: "Всегда завершайте цепочку .catch() или используйте try/catch с async/await."
      },
      {
        wrong: "Думать, что Promise автоматически делает код async",
        why: "Promise — это ОБЪЕКТ, представляющий результат. Код внутри new Promise выполняется синхронно до первого асинхронного действия.",
        right: "Promise — обёртка для результата, который приходит позже."
      },
      {
        wrong: "Вызывать resolve/reject несколько раз",
        why: "Только первый вызов имеет эффект. Остальные игнорируются.",
        right: "resolve/reject — одноразовые. Один промис — одно решение."
      }
    ],
    importantToRemember: [
      "Promise: pending → fulfilled или rejected",
      "resolve(result) — успешное завершение",
      "reject(error) — ошибка",
      ".then() — обработка успеха",
      ".catch() — обработка ошибки",
      ".finally() — завершение в любом случае",
      "Каждый .then возвращает новый Promise"
    ],
    sources: [
      { title: "MDN: Promise", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise" }
    ],
    connection: {
      back: "Вы понимаете callback-функции и таймеры (JA1-JA3) — промисы это структурированный способ обработки асинхронных результатов.",
      forward: "Следующий урок (JA5) — async/await: синтаксический сахар над промисами."
    }
  },

  // ============================================
  // JA5 — async/await
  // ============================================
  {
    slug: "async-await",
    track: "js-async",
    order: 5,
    title: "async/await",
    summary: "Научиться писать асинхронный код в синхронном стиле с помощью async/await и обрабатывать ошибки через try/catch.",
    level: "Intermediate",
    prerequisites: ["promises"],
    learningObjective: "После этого урока вы сможете писать async-функции с await, обрабатывать ошибки через try/catch и объяснять, что async/await — это синтаксический сахар над промисами.",
    shortExplanation: "async function всегда возвращает Promise. await приостанавливает выполнение ЭТОЙ async-функции до завершения Promise. await НЕ блокирует весь JavaScript — он блокирует только текущую async-функцию. try/catch с await ловит ошибки reject.",
    detailedExplanation: "async/await — синтаксический сахар над Promises:\n\nasync function getUser() {\n  const response = await fetch('/api/user');\n  const user = await response.json();\n  return user;\n}\n\nЭто эквивалентно:\nfunction getUser() {\n  return fetch('/api/user')\n    .then(response => response.json());\n}\n\nЧто делает async:\n- Возвращает Promise\n- Позволяет использовать await внутри\n\nЧто делает await:\n- Приостанавливает выполнение ЭТОЙ функции\n- Ждёт settlement Promise\n- Возвращает результат (resolve) или выбрасывает ошибку (reject)\n- НЕ блокирует весь поток!\n\ntry/catch с await:\nasync function loadData() {\n  try {\n    const response = await fetch('/api/data');\n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}`);\n    }\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.log(`Ошибка: ${error.message}`);\n  } finally {\n    console.log('Завершено');\n  }\n}\n\nПараллельные операции:\n// Последовательно (медленно):\nconst users = await fetchUsers();\nconst posts = await fetchPosts(); // ждём users!\n\n// Параллельно (быстро):\nconst [users, posts] = await Promise.all([\n  fetchUsers(),\n  fetchPosts()\n]);",
    mentalModel: "await — как очередь в магазине. Вы встаёте в очередь (await), но это НЕ значит, что весь мир замер. Другие люди (другой код) продолжают работать. Вы просто ждёте свою очередь. Когда кассир готов (Promise resolved) — вы получаете результат.",
    examples: [
      {
        level: "minimal",
        code: "async function greet() {\n  return 'Привет!'; // автоматически оборачивается в Promise\n}\n\ngreet().then(msg => console.log(msg)); // 'Привет!'",
        explanation: "async функция всегда возвращает Promise."
      },
      {
        level: "simple",
        code: "function delay(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\nasync function main() {\n  console.log('Начало');\n  await delay(1000); // ждём 1 секунду\n  console.log('Через секунду');\n  await delay(1000);\n  console.log('Ещё секунду');\n}\n\nmain();\n// Вывод: Начало → (1сек) Через секунду → (1сек) Ещё секунду",
        explanation: "await приостанавливает только текущую async-функцию."
      },
      {
        level: "real",
        code: "async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    \n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n    }\n    \n    const user = await response.json();\n    console.log(`Имя: ${user.name}`);\n    return user;\n    \n  } catch (error) {\n    if (error.name === 'TypeError') {\n      console.log('Проблема с сетью');\n    } else {\n      console.log(`Ошибка: ${error.message}`);\n    }\n    throw error; // пробрасываем дальше\n  }\n}\n\n// Вызываем внутри другой async-функции:\nasync function init() {\n  await fetchUserData(1);\n}\ninit();\n\n// Top-level await (await вне функции) работает только в ES-модулях\n// или в консоли DevTools — в обычном скрипте так писать нельзя.",
        explanation: "try/catch с await для обработки ошибок сети и HTTP."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что await блокирует весь браузер",
        why: "await блокирует ТОЛЬКО текущую async-функцию. Другой код продолжает выполняться.",
        right: "await = пауза в async-функции, не во всём приложении."
      },
      {
        wrong: "Забывать await перед fetch",
        why: "fetch возвращает Promise, а не Response. Без await response — это Promise, не объект.",
        right: "const response = await fetch(...);"
      },
      {
        wrong: "Использовать await вне async-функции",
        why: "await работает только внутри async-функций (или в top-level в модулях).",
        right: "Оберните в async функцию или используйте .then()."
      },
      {
        wrong: "Забывать проверять response.ok",
        why: "fetch НЕ reject на HTTP 404/500! Он resolve с response.ok = false.",
        right: "Всегда проверяйте response.ok или response.status."
      }
    ],
    importantToRemember: [
      "async функция всегда возвращает Promise",
      "await приостанавливает только свою async-функцию",
      "await НЕ блокирует весь JavaScript",
      "try/catch для обработки ошибок с await",
      "fetch resolve даже на HTTP 404/500 — проверяйте response.ok"
    ],
    sources: [
      { title: "MDN: async function", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/async_function" }
    ],
    connection: {
      back: "Вы понимаете промисы (JA4) — async/await делает их чтение проще.",
      forward: "Следующий урок (JA6) — комбинаторы промисов для параллельного выполнения."
    }
  },

  // ============================================
  // JA6 — Promise Combinators
  // ============================================
  {
    slug: "promise-combinators",
    track: "js-async",
    order: 6,
    title: "Promise.all / race / allSettled / any",
    summary: "Научиться выполнять несколько промисов параллельно и выбирать правильный комбинатор в зависимости от ситуации.",
    level: "Intermediate",
    prerequisites: ["async-await"],
    learningObjective: "После этого урока вы сможете использовать Promise.all, Promise.race, Promise.allSettled и Promise.any и выбирать подходящий для каждого сценария.",
    shortExplanation: "Promise.all — все должны выполниться (reject при первом reject). Promise.race — первый завершённый (fulfilled или rejected). Promise.allSettled — ждём все, получаем статус каждого. Promise.any — первый fulfilled (игнорирует rejected).",
    detailedExplanation: "Promise.all([p1, p2, p3]):\n- Все промисы запускаются параллельно\n- Результат: массив всех результатов\n- reject: сразу отклоняется с ошибкой первого rejected\n\nconst [users, posts] = await Promise.all([\n  fetch('/api/users').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json())\n]);\n\nPromise.race([p1, p2, p3]):\n- Первый завершённый определяет результат\n- Остальные игнорируются\n- Может вернуть reject!\n\nconst result = await Promise.race([\n  fetch('/api/fast'),\n  fetch('/api/slow')\n]);\n\nPromise.allSettled([p1, p2, p3]):\n- Ждёт ВСЕ промисы\n- Результат: [{status: 'fulfilled', value}, {status: 'rejected', reason}]\n- Никогда не reject\n\nconst results = await Promise.allSettled([\n  fetch('/api/a'),\n  fetch('/api/b')\n]);\nresults.forEach(r => {\n  if (r.status === 'fulfilled') console.log(r.value);\n  else console.log(r.reason);\n});\n\nPromise.any([p1, p2, p3]):\n- Первый fulfilled определяет результат\n- rejected игнорируются\n- Reject только если ВСЕ rejected\n\nconst result = await Promise.any([\n  Promise.reject('Ошибка 1'),\n  fetch('/api/primary'),\n  fetch('/api/fallback')\n]);",
    mentalModel: "Promise.all — команда из 3 спортсменов: все должны финишировать. Promise.race — кто первый добежал, тот и победил. Promise.allSettled — судья записывает результат каждого, независимо от падений. Promise.any — кто первый доставил приз, того и берём.",
    examples: [
      {
        level: "minimal",
        code: "const p1 = Promise.resolve(1);\nconst p2 = Promise.resolve(2);\nconst p3 = Promise.resolve(3);\n\nconst results = await Promise.all([p1, p2, p3]);\nconsole.log(results); // [1, 2, 3]",
        explanation: "Promise.all возвращает массив результатов."
      },
      {
        level: "simple",
        code: "const slow = new Promise(resolve => setTimeout(() => resolve('медленный'), 2000));\nconst fast = new Promise(resolve => setTimeout(() => resolve('быстрый'), 1000));\n\nconst winner = await Promise.race([slow, fast]);\nconsole.log(winner); // 'быстрый' (через 1 сек)",
        explanation: "Promise.race: первый завершённый побеждает."
      },
      {
        level: "real",
        code: "async function fetchWithFallback(urls) {\n  try {\n    // Пробуем все URL параллельно, берём первый успешный\n    return await Promise.any(\n      urls.map(url => fetch(url).then(r => {\n        if (!r.ok) throw new Error(r.status);\n        return r.json();\n      }))\n    );\n  } catch (error) {\n    // Все URL failed\n    throw new Error('Все серверы недоступны');\n  }\n}\n\nconst data = await fetchWithFallback([\n  'https://api-primary.example.com/data',\n  'https://api-backup.example.com/data'\n]);",
        explanation: "Promise.any для fallback-стратегии: основной + запасной сервер."
      }
    ],
    commonMistakes: [
      {
        wrong: "Использовать Promise.all когда нужен частичный успех",
        why: "Promise.all отклоняется при первом reject — даже если 9 из 10 успешны.",
        right: "Для частичного успеха используйте Promise.allSettled."
      },
      {
        wrong: "Забывать, что Promise.race может reject",
        why: "Первый завершённый может быть rejected.",
        right: "Обрабатывайте reject в Promise.race."
      },
      {
        wrong: "Путать Promise.any и Promise.all",
        why: "Promise.all — все обязательны. Promise.any — нужен хотя бы один.",
        right: "all = все. any = хотя бы один."
      }
    ],
    importantToRemember: [
      "Promise.all — все fulfilled → массив результатов; reject при первом reject",
      "Promise.race — первый settled определяет результат",
      "Promise.allSettled — все settled, массив {status, value/reason}",
      "Promise.any — первый fulfilled; reject если все rejected",
      "Выбирайте комбинатор по сценарию, а не по привычке"
    ],
    connection: {
      back: "Вы понимаете async/await (JA5) — теперь вы можете управлять параллельными асинхронными операциями.",
      forward: "Следующий урок (JA7) — Fetch API для реальных HTTP-запросов."
    }
  },

  // ============================================
  // JA7 — Fetch API
  // ============================================
  {
    slug: "fetch-api",
    track: "js-async",
    order: 7,
    title: "Fetch API",
    summary: "Научиться делать HTTP-запросы с помощью fetch: GET, POST, обработка ответа, проверка ошибок и понимание CORS на beginner-уровне.",
    level: "Intermediate",
    prerequisites: ["async-await", "json"],
    learningObjective: "После этого урока вы сможете отправлять GET и POST запросы через fetch, разбирать JSON-ответы, корректно обрабатывать HTTP-ошибки и объяснять основы CORS.",
    shortExplanation: "fetch(url) возвращает Promise с Response. Response содержит: status, ok, headers. Для получения данных вызовите response.json() (тоже Promise). fetch НЕ reject на HTTP 404/500 — проверяйте response.ok. CORS — ограничение браузера для cross-origin запросов.",
    detailedExplanation: "Простейший GET:\nconst response = await fetch('https://api.example.com/users');\nconst users = await response.json();\nconsole.log(users);\n\nFetch возвращает Promise<Response>.\nResponse — это не данные, а «обёртка» с метаданными.\n\nПроверка ошибок:\nconst response = await fetch('/api/data');\n\nif (!response.ok) {\n  throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n}\n\nconst data = await response.json();\n\nВажно: fetch НЕ reject автоматически на HTTP 404/500!\nОн reject ТОЛЬКО при сетевой ошибке (нет соединения, DNS).\n\nPOST запрос:\nconst response = await fetch('/api/users', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ name: 'Анна', email: 'anna@test.com' })\n});\n\nif (!response.ok) throw new Error('Ошибка');\nconst result = await response.json();\n\nResponse свойства:\n- response.ok — true если status 200-299\n- response.status — HTTP статус (200, 404, 500)\n- response.headers — заголовки ответа\n- response.url — итоговый URL (после редиректов)\n\nHTTP основы:\n- GET — получить данные\n- POST — создать данные\n- PUT — обновить данные целиком\n- PATCH — обновить частично\n- DELETE — удалить данные\n\nCORS (Cross-Origin Resource Sharing):\nБраузер блокирует запросы к другому домену (origin),\nесли сервер не разрешает это через заголовки.\n\norigin = protocol + domain + port\nhttps://example.com:443\n\nsame-origin: https://example.com/page\ncross-origin: https://other.com/api\n\nСервер разрешает через:\nAccess-Control-Allow-Origin: https://example.com\n\nCORS — НЕ ошибка сервера. Это ограничение браузера для безопасности.",
    mentalModel: "fetch — как отправка письма. Вы пишете запрос (URL + метод), отправляете (fetch), получаете конверт (Response). Конверт содержит не только письмо (данные), но и служебную информацию (status, headers). Чтобы прочитать письмо, нужно вскрыть конверт (response.json()).",
    examples: [
      {
        level: "minimal",
        code: "const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');\nconst todo = await response.json();\nconsole.log(todo.title); // 'delectus aut autem'",
        explanation: "Простейший GET запрос с парсингом JSON."
      },
      {
        level: "simple",
        code: "async function getUsers() {\n  try {\n    const response = await fetch('https://jsonplaceholder.typicode.com/users');\n    \n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}`);\n    }\n    \n    const users = await response.json();\n    users.forEach(user => console.log(user.name));\n    \n  } catch (error) {\n    console.log(`Ошибка: ${error.message}`);\n  }\n}\n\nawait getUsers();",
        explanation: "GET с проверкой response.ok и обработкой ошибок."
      },
      {
        level: "real",
        code: "async function createPost(title, body) {\n  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({ title, body, userId: 1 })\n  });\n  \n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}`);\n  }\n  \n  const post = await response.json();\n  console.log(`Создан пост #${post.id}`);\n  return post;\n}\n\nawait createPost('Новый пост', 'Текст поста');",
        explanation: "POST запрос с JSON телом и обработкой ответа."
      }
    ],
    commonMistakes: [
      {
        wrong: "Думать, что fetch reject на HTTP 404/500",
        why: "fetch resolve с Response даже на 404/500. Reject только при сетевой ошибке.",
        right: "Всегда проверяйте response.ok или response.status."
      },
      {
        wrong: "Забывать await перед response.json()",
        why: "response.json() возвращает Promise, а не объект.",
        right: "const data = await response.json();"
      },
      {
        wrong: "Не устанавливать Content-Type для POST",
        why: "Сервер может не распознать тело запроса без правильного Content-Type.",
        right: "headers: { 'Content-Type': 'application/json' }"
      },
      {
        wrong: "Путать CORS с ошибкой сервера",
        why: "CORS — ограничение браузера. Сервер может работать нормально, но браузер блокирует ответ.",
        right: "CORS = браузерное ограничение, не серверная ошибка."
      }
    ],
    importantToRemember: [
      "fetch возвращает Promise<Response>",
      "response.json() — тоже Promise, нужен await",
      "fetch НЕ reject на HTTP 404/500 — проверяйте response.ok",
      "POST: method, headers, body (JSON.stringify)",
      "CORS — ограничение браузера для cross-origin запросов",
      "GET — получение, POST — создание, PUT/PATCH — обновление, DELETE — удаление"
    ],
    sources: [
      { title: "MDN: Fetch API", url: "https://developer.mozilla.org/ru/docs/Web/API/Fetch_API" }
    ],
    connection: {
      back: "Вы понимаете async/await и промисы (JA4-JA6) — теперь вы применяете их к реальным HTTP-запросам.",
      forward: "Вы завершили JS Async! Дальше — DOM Advanced: события, делегирование и браузерные API."
    }
  }
] as const;
