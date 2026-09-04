// Tools Lessons — T1 through T6
// Following Knowledge Map v3 and Stage 3 Lesson Blueprint

export const toolsLessons = [
  // ============================================
  // T1 — Terminal Basics
  // ============================================
  {
    slug: "terminal-basics",
    track: "tools",
    order: 1,
    title: "Основы терминала",
    summary: "Научиться открывать терминал, перемещаться по файловой системе, запускать команды и понимать, зачем разработчику нужен терминал.",
    level: "Foundation",
    prerequisites: [],
    learningObjective: "После этого урока вы сможете открыть терминал, перемещаться по папкам, просматривать файлы, создавать и удалять файлы и каталоги, а также понимать, зачем терминал нужен разработчику.",
    shortExplanation: "Терминал — программа, через которую вы общаетесь с компьютером текстовыми командами вместо мыши. Он позволяет запускать программы, управлять файлами, устанавливать пакеты. Все инструменты разработки (git, npm, vite) запускаются из терминала.",
    detailedExplanation: "Зачем нужен терминал?\n\nБольшинство инструментов разработки работают через терминал:\n- Git — управление версиями\n- npm — установка библиотек\n- Vite — запуск dev-сервера\n- Node.js — запуск JavaScript-кода\n\nБез терминала невозможно полноценно работать как веб-разработчик.\n\nКак открыть терминал:\n- Windows: Win+R → cmd → Enter (или PowerShell, или Windows Terminal)\n- Mac: Cmd+Space → Terminal → Enter\n- Linux: Ctrl+Alt+T (на большинстве дистрибутивов)\n\nОсновные команды:\n\n1. Навигация по папкам:\npwd — показать текущую папку\nls (или dir на Windows) — список файлов\ncd путь — перейти в папку\ncd .. — вернуться на уровень выше\ncd ~ — перейти в домашнюю папку\n\n2. Управление файлами:\nmkdir имя_папки — создать папку\ntouch имя_файла — создать файл (Mac/Linux)\necho text > file.txt — создать файл (Windows)\nrm имя_файла — удалить файл\nrmdir имя_папки — удалить папку\n\n3. Просмотр содержимого:\ncat файл (или type на Windows) — показать содержимое файла\n\n4. Очистка экрана:\nclear (или cls на Windows)\n\nАбсолютный путь vs относительный:\n- Абсолютный: /Users/name/project (от корня диска)\n- Относительный: ./src/index.js (от текущей папки)\n\nПример навигации:\npwd                     # /Users/name\ncd project              # /Users/name/project\nls                      # src  package.json  README.md\ncd src                  # /Users/name/project/src\nls                      # index.js  components\ncd ..                   # /Users/name/project",
    mentalModel: "Терминал — как файловый менеджер, только вместо мыши вы используете клавиатуру. Представьте, что вы открываете папку, кликаете на другую, удаляете файл — только всё делается текстовыми командами.",
    examples: [
      {
        level: "minimal",
        code: "# Откройте терминал и попробуйте:\npwd              # Покажет текущую папку\nls               # Покажет файлы в текущей папке\ncd Desktop       # Перейти на рабочий стол",
        explanation: "Базовые команды навигации: где вы находитесь и что вокруг."
      },
      {
        level: "simple",
        code: "# Создайте проектную папку:\nmkdir my-project\ncd my-project\ntouch index.html\ntouch style.css\nls                  # index.html  style.css\nrm style.css\nls                  # index.html",
        explanation: "Создание и удаление файлов — основа работы с проектом."
      },
      {
        level: "real",
        code: "# Переход к существующему проекту:\ncd ~/projects/prolab-academy\nls                  # src  package.json  next.config.ts  ...\ncd src\nls                  # app  lib  components  ...\npwd                 # /Users/name/projects/prolab-academy/src\ncd ../..            # Вернуться в корень проекта",
        explanation: "Навигация в реальном проекте: переход между папками."
      }
    ],
    commonMistakes: [
      {
        wrong: "Не знать, где вы находитесь",
        why: "Если не знать текущую папку, команды могут работать не в той директории.",
        right: "Всегда начинайте с pwd и ls, чтобы понять, где вы и что вокруг."
      },
      {
        wrong: "Удалять файлы без проверки",
        why: "rm удаляет без корзины. Невозможно восстановить.",
        right: "Проверяйте текущую папку перед удалением. Будьте аккуратны с rm."
      },
      {
        wrong: "Путать абсолютные и относительные пути",
        why: "Абсолютный путь начинается от корня (/, C:\\). Относительный — от текущей папки (./).",
        right: "Используйте pwd для проверки. ./ означает «текущая папка»."
      }
    ],
    importantToRemember: [
      "pwd — текущая папка, ls — список файлов",
      "cd — переход между папками",
      "mkdir — создать папку, touch — создать файл",
      "Всегда проверяйте текущую папку перед командами",
      "Все инструменты разработки запускаются из терминала"
    ],
    connection: {
      back: "Это один из первых уроков — предварительные знания не требуются.",
      forward: "Следующий урок (T2) — Git: система контроля версий для отслеживания изменений."
    }
  },

  // ============================================
  // T2 — Git Basics
  // ============================================
  {
    slug: "git-basics",
    track: "tools",
    order: 2,
    title: "Основы Git",
    summary: "Понять, зачем нужен Git, научиться инициализировать репозиторий, добавлять файлы, делать коммиты и просматривать историю.",
    level: "Foundation",
    prerequisites: ["terminal-basics"],
    learningObjective: "После этого урока вы сможете инициализировать Git-репозиторий, добавлять изменения в индекс, создавать коммиты, просматривать историю и понимать базовый рабочий процесс Git.",
    shortExplanation: "Git — система контроля версий. Она запоминает каждое изменение в коде и позволяет вернуться к любой точке в истории. Git работает локально: все данные хранятся на вашем компьютере. Основной workflow: изменить файлы → git add → git commit.",
    detailedExplanation: "Зачем нужен Git?\n\nGit запоминает ВСЕ изменения вашего кода:\n- Вы можете вернуться к любой версии файла\n- Вы можете сравнить две версии\n- Вы можете отменить изменения\n- Вы можете работать в команде, не затрагивая чужой код\n\nУстановка:\n- Windows: https://git-scm.com/download/win\n- Mac: git (уже установлен) или Xcode Command Line Tools\n- Linux: sudo apt install git\n\nПроверка:\ngit --version\n\nИнициализация:\ncd my-project\ngit init          # Создаёт скрытую папку .git\n\nОсновной workflow:\n\n1. Сделали изменения в файлах\n2. Проверили: git status (видит изменённые файлы)\n3. Добавили в «индекс»: git add файл\n4. Закоммитили: git commit -m \"описание\"\n\nПример:\ngit status              # Показывает изменённые файлы\ngit add index.html      # Добавить файл в индекс\ngit commit -m \"Добавил заголовок\"  # Закоммитить\n\nКоммит — это «снимок» ваших файлов в определённый момент.\n\nПросмотр истории:\ngit log                  # Список коммитов\ngit log --oneline        # Краткий формат\n\nЧто хранит Git:\n- Имена файлов\n- Содержимое файлов\n- Автор и время коммита\n- Описание коммита\n\nЧто НЕ хранит Git:\n- Пароли\n- Огромные бинарные файлы\n- node_modules (обычно)",
    mentalModel: "Git — как «машина времени» для вашего кода. Каждый коммит — это точка в времени, к которой можно вернуться. Вы можете путешествовать в прошлое (git checkout), сравнивать эпохи (git diff) и создавать новые ветки (параллельные реальности).",
    examples: [
      {
        level: "minimal",
        code: "# Инициализация репозитория\ngit init\ngit status              # Видит untracked файлы\ngit add index.html      # Добавить в индекс\ngit commit -m \"Первый коммит\"\ngit log --oneline       # abc1234 First commit",
        explanation: "Базовый workflow: init → add → commit."
      },
      {
        level: "simple",
        code: "# Создайте файл, внесите изменения\necho \"Hello\" > greeting.txt\ngit status              # modified: greeting.txt\ngit add greeting.txt\ngit commit -m \"Добавил приветствие\"\n\n# Посмотрите историю\ngit log --oneline\n# def5678 Добавил приветствие\n# abc1234 Первый коммит",
        explanation: "Коммит с описанием и просмотр истории."
      },
      {
        level: "real",
        code: "# Работа с проектом\ngit status\ngit add src/index.js src/app.js\ngit commit -m \"Добавил главный компонент\"\n\n# Проверяем что коммитнули\ngit log --oneline -2\n# 9f8e7d6 Добавил главный компонент\n# def5678 Добавил приветствие\n\n# Смотрим разницу\ngit diff HEAD~1         # Что изменилось в последнем коммите",
        explanation: "Реальный workflow: добавление нескольких файлов и проверка изменений."
      }
    ],
    commonMistakes: [
      {
        wrong: "Коммитить без add",
        why: "git commit коммитит только файлы из индекса (staged). Без add изменения не попадут в коммит.",
        right: "Сначала git add, потом git commit."
      },
      {
        wrong: "Не писать осмысленные описания коммитов",
        why: "\"fix\", \"update\", \"поменял\" — бесполезные описания. Они не помогут понять, что было сделано.",
        right: "Пишите КАКЧЕ именно изменилось: \"Добавил форму регистрации\"."
      },
      {
        wrong: "Коммитить всё подряд",
        why: "Коммит должен содержать одно логическое изменение. Смешивать исправление бага и новую фичу — плохо.",
        right: "Один коммит = одно логическое изменение."
      }
    ],
    importantToRemember: [
      "git init — создать репозиторий",
      "git add — добавить в индекс",
      "git commit -m \"описание\" — сохранить снимок",
      "git status — посмотреть текущее состояние",
      "git log --oneline — история коммитов",
      "Один коммит = одно логическое изменение"
    ],
    connection: {
      back: "Вы умеете пользоваться терминалом (T1). Git запускается через терминал.",
      forward: "Следующий урок (T3) — GitHub: хостинг вашего Git-репозитория в интернете."
    }
  },

  // ============================================
  // T3 — GitHub Basics
  // ============================================
  {
    slug: "github-basics",
    track: "tools",
    order: 3,
    title: "Основы GitHub",
    summary: "Понять, что такое GitHub, создать аккаунт, создать репозиторий, отправить (push) локальный проект и получить ссылку.",
    level: "Foundation",
    prerequisites: ["git-basics"],
    learningObjective: "После этого урока вы сможете создать аккаунт GitHub, создать удалённый репозиторий, отправить туда локальный код и склонировать чужой репозиторий.",
    shortExplanation: "GitHub — веб-сервис для хранения Git-репозиториев в облаке. Он позволяет: делиться кодом, работать в команде, развернуть сайт (GitHub Pages), участвовать в open-source. Ключевые команды: git remote, git push, git clone, git pull.",
    detailedExplanation: "Зачем нужен GitHub?\n\n1. Резервное копирование — ваш код в облаке\n2. Публикация — покажите проект миру\n3. Командная работа — несколько человек работают над кодом\n4. GitHub Pages — бесплатный хостинг статических сайтов\n5. Open Source — участвуйте в проектах сообщества\n\nАккаунт:\n1. Зайдите на github.com\n2. Нажмите \"Sign up\"\n3. Создайте аккаунт (имя пользователя — ваша визитка)\n\nСоздание репозитория:\n1. Нажмите \"+\" → \"New repository\"\n2. Введите имя (prolab-academy)\n3. Нажмите \"Create repository\"\n\nОтправка локального проекта:\n\ngit remote add origin https://github.com/username/repo.git\ngit branch -M main\ngit push -u origin main\n\nПолучение (clone):\ngit clone https://github.com/username/repo.git\n\nОбновление:\ngit pull origin main\n\nСтруктура GitHub:\n- Repository — папка с кодом\n- README.md — описание проекта\n- Branches — параллельные версии\n- Issues — задачи и баги\n- Pull Requests — предложения изменений",
    mentalModel: "GitHub — как облачный диск для кода. Локальный Git хранит историю на вашем компьютере. GitHub хранит её в облаке и добавляет социальные функции: forks, stars, pull requests, issues.",
    examples: [
      {
        level: "minimal",
        code: "# Отправка проекта на GitHub\ngit remote add origin https://github.com/user/project.git\ngit push -u origin main\n\n# Клонирование чужого проекта\ngit clone https://github.com/user/project.git",
        explanation: "Отправка и получение кода через GitHub."
      },
      {
        level: "simple",
        code: "# Полный workflow:\ngit init\ngit add .\ngit commit -m \"Initial commit\"\ngit remote add origin https://github.com/user/my-project.git\ngit branch -M main\ngit push -u origin main\n\n# Теперь ваш проект на GitHub!",
        explanation: "Создание проекта и отправка на GitHub."
      },
      {
        level: "real",
        code: "# Клонирование и работа\ngit clone https://github.com/facebook/react.git\ncd react\nnpm install              # Установить зависимости\n\n# Создание форка (на GitHub)\n# Fork → ваша копия чужого проекта\n# Клонируете свой fork, вносите изменения\n# Создаёте Pull Request",
        explanation: "Реальный workflow: клонирование проекта и fork для вклада."
      }
    ],
    commonMistakes: [
      {
        wrong: "Публиковать пароли и API-ключи",
        why: "GitHub — публичный сервис. Пароли, токены, ключи в коде — уязвимость.",
        right: "Используйте .gitignore и переменные окружения (.env) для секретов."
      },
      {
        wrong: "Не писать README.md",
        why: "Без описания другие люди (и вы через месяц) не поймут, зачем этот проект.",
        right: "README.md — визитная карточка проекта. Обязательно."
      },
      {
        wrong: "Путать git push и git pull",
        why: "push — отправить в облако. pull — получить из облака.",
        right: "push = вверх. pull = вниз."
      }
    ],
    importantToRemember: [
      "GitHub — облачное хранилище Git-репозиториев",
      "git remote add origin — привязать локальный к удалённому",
      "git push — отправить, git pull — получить",
      "README.md — описание проекта",
      ".gitignore — исключить файлы из Git"
    ],
    connection: {
      back: "Вы знаете Git (T2). GitHub добавляет облачное хранилище и возможности для совместной работы.",
      forward: "Следующий урок (T4) — npm: менеджер пакетов для JavaScript."
    }
  },

  // ============================================
  // T4 — npm Basics
  // ============================================
  {
    slug: "npm-basics",
    track: "tools",
    order: 4,
    title: "Основы npm",
    summary: "Понять, что такое npm, устанавливать пакеты, использовать скрипты и управлять зависимостями проекта.",
    level: "Foundation",
    prerequisites: ["terminal-basics"],
    learningObjective: "После этого урока вы сможете устанавливать npm-пакеты, понимать разницу между dependencies и devDependencies, запускать npm-скрипты и знать, что находится в папке node_modules.",
    shortExplanation: "npm — менеджер пакетов для JavaScript. Он скачивает готовые библиотеки (пакеты) с npmjs.com и устанавливает их в ваш проект. Основные команды: npm init, npm install, npm run. Все библиотеки хранятся в папке node_modules.",
    detailedExplanation: "Что такое npm?\n\nnpm (Node Package Manager) — это:\n1. Реестр (registry) — коллекция миллиона готовых библиотек\n2. Менеджер — инструмент для установки этих библиотек\n3. Скрипт-раннер — запуск команд из package.json\n\nУстановка пакетов:\nnpm install lodash       # установить lodash\nnpm install --save-dev jest  # установить как devDependency\n\nЧто создаётся:\n- папка node_modules/ — файлы библиотек\n- package-lock.json — точные версии всех пакетов\n\nЗачем нужен package-lock.json?\nОн фиксирует ТОЧНЫЕ версии всех пакетов. Без него другой разработчик может установить другую версию и код сломается.\n\nnode_modules — НЕ коммитится!\nДобавьте в .gitignore:\nnode_modules/\n\nЭту папку можно восстановить через npm install.\n\nПолезные команды:\nnpm install — установить все зависимости из package.json\nnpm uninstall lodash — удалить пакет\nnpm outdated — показать устаревшие пакеты\nnpm update — обновить пакеты\nnpm ls — дерево зависимостей\n\nnpm scripts:\nВ package.json можно определить скрипты:\n\"scripts\": {\n  \"start\": \"vite\",\n  \"build\": \"vite build\",\n  \"test\": \"jest\"\n}\n\nЗапуск:\nnpm run start\nnpm run build\nnpm test",
    mentalModel: "npm — как магазин приложений для вашего проекта. Вы заходите в магазин (npmjs.com), выбираете приложение (пакет), устанавливаете (npm install). Оно появляется в папке node_modules. Остальные разработчики могут установить те же приложения через package.json.",
    examples: [
      {
        level: "minimal",
        code: "# Установка пакета\nnpm install lodash\n\n# В package.json появится:\n# \"dependencies\": { \"lodash\": \"^4.17.21\" }\n\n# Проверка, что пакет установлен:\nnpm ls lodash",
        explanation: "Базовая установка пакета: npm скачивает библиотеку и записывает её в package.json."
      },
      {
        level: "simple",
        code: "# Установка devDependency\nnpm install --save-dev prettier\n\n# В package.json:\n# \"devDependencies\": { \"prettier\": \"^3.0.0\" }\n\n# devDependencies — только для разработки,\n# не попадают в production сборку",
        explanation: "Разница dependencies и devDependencies."
      },
      {
        level: "real",
        code: "# Инициализация нового проекта\nnpm init -y              # Создаёт package.json\n\n# Установка зависимостей\nnpm install react react-dom\nnpm install --save-dev typescript @types/react\n\n# Проверка\nnpm ls                   # Дерево зависимостей\nnpm outdated             # Устаревшие пакеты",
        explanation: "Инициализация проекта и установка всех зависимостей."
      }
    ],
    commonMistakes: [
      {
        wrong: "Коммитить node_modules",
        why: "node_modules может весить гигабайты. Восстановить через npm install.",
        right: "Добавьте node_modules в .gitignore."
      },
      {
        wrong: "Устанавливать пакеты без package.json",
        why: "Без package.json пакеты не привязаны к проекту и будут потеряны.",
        right: "Сначала npm init, потом npm install."
      },
      {
        wrong: "Не использовать package-lock.json",
        why: "Без lock-файла версии могут отличаться между разработчиками.",
        right: "Коммитите package-lock.json. Не удаляйте его."
      }
    ],
    importantToRemember: [
      "npm install — установить пакет",
      "npm init -y — создать package.json",
      "node_modules — НЕ коммитить",
      "package-lock.json — коммитить",
      "dependencies vs devDependencies",
      "npm run — запуск скриптов"
    ],
    sources: [
      { title: "Документация npm", url: "https://docs.npmjs.com/" },
      { title: "npm CLI: основные команды", url: "https://docs.npmjs.com/cli/" }
    ],
    connection: {
      back: "Вы знаете терминал (T1). npm запускается через терминал.",
      forward: "Следующий урок (T5) — package.json: файл конфигурации вашего проекта."
    }
  },

  // ============================================
  // T5 — package.json
  // ============================================
  {
    slug: "package-json",
    track: "tools",
    order: 5,
    title: "package.json",
    summary: "Понять структуру package.json: зависимости, скрипты, метаданные проекта, и как его редактировать.",
    level: "Foundation",
    prerequisites: ["npm-basics"],
    learningObjective: "После этого урока вы сможете читать и редактировать package.json, понимать все его поля, создавать собственные скрипты и управлять зависимостями.",
    shortExplanation: "package.json — конфигурационный файл проекта. Он содержит: имя проекта, версию, зависимости (dependencies), devDependencies, скрипты (scripts), и настройки. Это «паспорт» вашего проекта.",
    detailedExplanation: "Структура package.json:\n\n{\n  \"name\": \"my-project\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Описание проекта\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"start\": \"vite\",\n    \"build\": \"vite build\",\n    \"test\": \"jest\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\"\n  },\n  \"devDependencies\": {\n    \"vite\": \"^5.0.0\"\n  }\n}\n\nОсновные поля:\n\n1. name — имя проекта (обязательное)\n2. version — версия в формате SemVer (major.minor.patch)\n3. scripts — команды для запуска\n4. dependencies — библиотеки для production\n5. devDependencies — библиотеки для разработки\n\nВерсионирование (SemVer):\n^1.2.3 — любая версия >= 1.2.3 и < 2.0.0\n~1.2.3 — любая версия >= 1.2.3 и < 1.3.0\n1.2.3 — только точная версия\n\nСкрипты:\n\"scripts\": {\n  \"start\": \"vite\",\n  \"dev\": \"vite --port 3000\",\n  \"build\": \"vite build\",\n  \"preview\": \"vite preview\"\n}\n\nЗапуск: npm run start, npm run dev\n\nСокращения:\nnpm start  — работает без run\nnpm test   — работает без run\nnpm run build — нужен run для кастомных",
    mentalModel: "package.json — как паспорт проекта. В нём написано: кто вы (name), какая у вас версия (version), с кем вы дружите (dependencies), и что вы умеете (scripts).",
    examples: [
      {
        level: "minimal",
        code: "// package.json — минимальная версия\n{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"start\": \"echo Hello\"\n  }\n}\n\n// Запуск: npm start",
        explanation: "Минимальный package.json с одним скриптом."
      },
      {
        level: "simple",
        code: "// package.json с зависимостями\n{\n  \"name\": \"my-project\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview\"\n  },\n  \"devDependencies\": {\n    \"vite\": \"^6.0.0\"\n  }\n}\n\n// Запуск: npm run dev (инструмент сборки Vite — следующий урок T6)",
        explanation: "Типичный package.json на основе Vite: команды-скрипты и зависимости для разработки."
      },
      {
        level: "real",
        code: "// Проверка зависимостей\n// В терминале:\nnpm ls                   # Дерево зависимостей\nnpm outdated             # Устаревшие пакеты\nnpm install              # Установить из package.json\nnpm install lodash@4.17  # Конкретная версия",
        explanation: "Управление версиями и проверка зависимостей. В реальных проектах встречаются и другие стеки (React, Next.js, TypeScript) — это отдельные технологии, которые в этом курсе не разбираются."
      }
    ],
    commonMistakes: [
      {
        wrong: "Вручную менять version при каждом обновлении",
        why: "npm version major/minor/patch делает это автоматически и создаёт коммит.",
        right: "Используйте npm version patch/minor/major."
      },
      {
        wrong: "Использовать * для версий",
        why: "\"lodash\": \"*\" — установит последнюю версию, которая может сломать код.",
        right: "Используйте ^ или ~ для безопасного обновления."
      },
      {
        wrong: "Не коммитить package-lock.json",
        why: "Без lock-файла версии могут отличаться между разработчиками.",
        right: "Всегда коммитите package-lock.json."
      }
    ],
    importantToRemember: [
      "package.json — конфигурация проекта",
      "dependencies — для production, devDependencies — для разработки",
      "scripts — команды для запуска",
      "^version — обновлять minor/patch",
      "package-lock.json — коммитить всегда"
    ],
    connection: {
      back: "Вы знаете npm (T4). package.json — это конфигурационный файл npm.",
      forward: "Следующий урок (T6) — Vite: dev-сервер и инструмент сборки."
    }
  },

  // ============================================
  // T6 — Vite / Dev Server
  // ============================================
  {
    slug: "vite-dev-server",
    track: "tools",
    order: 6,
    title: "Vite и dev-сервер",
    summary: "Понять, что такое dev-сервер, зачем нужен Vite, как запускать проект локально и собирать для production.",
    level: "Foundation",
    prerequisites: ["npm-basics", "package-json"],
    learningObjective: "После этого урока вы сможете создать проект на Vite, запустить dev-сервер, понять, как работает HMR, и собрать проект для продакшена.",
    shortExplanation: "Vite — быстрый инструмент сборки и dev-сервер для современных веб-проектов. Dev-сервер запускает ваш проект локально в браузере. HMR (Hot Module Replacement) обновляет страницу мгновенно при изменении файлов. npm run build создаёт production-сборку.",
    detailedExplanation: "Что такое dev-сервер?\n\nКогда вы разрабатываете сайт, вам нужен способ видеть его в браузере. Dev-сервер:\n1. Запускает ваш код локально\n2. Показывает результат в браузере\n3. Автоматически обновляет страницу при изменениях\n\nСоздание проекта:\nnpm create vite@latest my-app -- --template vanilla\ncd my-app\nnpm install\nnpm run dev\n\nОткроется http://localhost:5173\n\nВариант с React (--template react) — это уже отдельная технология; в этом курсе она не изучается. Для наших примеров подходит vanilla.\n\nЧто делает Vite:\n- Dev-сервер — быстрое обновление при изменениях\n- HMR — Hot Module Replacement (обновление без перезагрузки)\n- Сборка — оптимизация кода для production\n\nnpm run dev — dev-сервер:\n- Порт: 5173 (по умолчанию)\n- Автообновление при сохранении файлов\n- Ошибки показываются в браузере\n\nnpm run build — production-сборка:\n- Создаёт папку dist/\n- Оптимизирует JS, CSS, картинки\n- Минификация и сжатие\n\nnpm run preview — предпросмотр сборки:\n- Запускает production-сборку локально\n- Проверяет, как сайт будет работать на сервере\n\nVite vs другие:\n- Webpack — старый, медленнее настройка\n- Vite — новый, быстрый, современный\n- Next.js — framework поверх Vite (или Webpack)\n\nКонфигурация (для vanilla-проекта):\n// vite.config.js\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  server: { port: 3000 }\n});\n\nЕсли встретите @vitejs/plugin-react в чужом проекте — это плагин для React, отдельная технология (в этот курс не входит).",
    mentalModel: "Dev-сервер — как черновик для художника. Вы рисуете (пишете код), сразу видите результат (в браузере), и можете быстро исправить (HMR). Production-сборка — как финальная версия картины: оптимизированная, отредактированная, готовая к выставке.",
    examples: [
      {
        level: "minimal",
        code: "# Создание нового проекта Vite:\nnpm create vite@latest my-app -- --template vanilla\ncd my-app\nnpm install\nnpm run dev\n\n# Откроется http://localhost:5173",
        explanation: "Создание и запуск проекта с нуля."
      },
      {
        level: "simple",
        code: "# Команды Vite:\nnpm run dev       # Dev-сервер (автообновление)\nnpm run build    # Production-сборка в dist/\nnpm run preview  # Предпросмотр сборки\n\n# Измените любой файл — браузер обновится автоматически!\n# Без перезагрузки страницы!",
        explanation: "Основные команды: dev, build, preview."
      },
      {
        level: "real",
        code: "// vite.config.js — настройка проекта\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  server: {\n    port: 3000,\n    open: true  // автоматически открыть браузер\n  },\n  build: {\n    outDir: 'dist'\n  }\n});",
        explanation: "Конфигурация Vite: порт и настройки сборки. Если встретите @vitejs/plugin-react в чужом проекте — это плагин для React, отдельная технология (в этот курс не входит)."
      }
    ],
    commonMistakes: [
      {
        wrong: "Коммитить папку dist",
        why: "dist — это build output. Восстановить через npm run build.",
        right: "Добавьте dist в .gitignore."
      },
      {
        wrong: "Запускать dev-сервер на production",
        why: "Dev-сервер не оптимизирован, медленный, небезопасный для прода.",
        right: "npm run build → npm run preview (или deploy на сервер)."
      },
      {
        wrong: "Путать dev и build",
        why: "dev — быстрый dev-сервер для разработки. build — оптимизированная сборка.",
        right: "dev = разработка. build = production."
      }
    ],
    importantToRemember: [
      "npm run dev — dev-сервер с автообновлением",
      "npm run build — production-сборка в dist/",
      "npm run preview — предпросмотр сборки",
      "HMR — обновление без перезагрузки",
      "dist/ — НЕ коммитить",
      "Vite — быстрый modern dev-сервер"
    ],
    sources: [
      { title: "Документация Vite", url: "https://vite.dev/guide/" }
    ],
    connection: {
      back: "Вы знаете npm (T4) и package.json (T5). Vite использует оба инструмента для запуска проекта.",
      forward: "Вы завершили все уроки раздела «Инструменты»! Дальше — раздел HTML."
    }
  }
] as const;
