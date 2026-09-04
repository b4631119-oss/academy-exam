export const commonKeywords = [
  "PROlab Academy",
  "образовательная платформа",
  "онлайн экзамены",
  "управление студентами",
  "обучение в Оше",
  "Кыргызстан образование",
  "IT курсы Ош",
  "академия программирования",
  "система тестирования",
  "проверка знаний",
  "educational platform",
  "online exams",
  "student management",
  "Osh",
  "Kyrgyzstan",
  "IT courses",
  "programming academy",
  "exam system",
  "knowledge testing",
  "online learning",
  "programming courses",
];

export const trackKeywords: Record<string, string[]> = {
  tools: [
    "терминал",
    "Git",
    "npm",
    "инструменты разработчика",
    "dev-сервер",
    "tools for developers",
    "Git basics",
    "npm tutorial",
  ],
  html: [
    "HTML курс",
    "вёрстка сайтов",
    "семантическая вёрстка",
    "веб-разработка для начинающих",
    "17 тем",
    "HTML course",
    "web development basics",
    "semantic markup",
    "17 topics",
    "HTML tutorial",
    "web development course",
  ],
  css: [
    "CSS обучение",
    "flexbox",
    "grid",
    "адаптивный дизайн",
    "анимации CSS",
    "23 темы",
    "CSS course",
    "flexbox",
    "grid",
    "responsive design",
    "CSS animations",
    "23 topics",
    "CSS tutorial",
    "CSS styling",
  ],
  "js-core": [
    "JavaScript для начинающих",
    "основы JavaScript",
    "JS Core",
    "переменные",
    "функции",
    "массивы",
    "27 тем",
    "JavaScript basics",
    "JS Core course",
    "learn JavaScript",
    "27 topics",
  ],
  "dom-basics": [
    "DOM для начинающих",
    "DOM Basics",
    "DOM дерево",
    "поиск элементов",
    "DOM Basics course",
    "learn DOM",
    "document object model",
  ],
  "js-intermediate": [
    "замыкания JavaScript",
    "this",
    "классы",
    "прототипы",
    "JS Intermediate",
    "closures",
    "JavaScript classes",
    "prototypes",
  ],
  "js-async": [
    "асинхронность JavaScript",
    "промисы",
    "async/await",
    "Fetch API",
    "JS Async",
    "promises JavaScript",
    "async/await JavaScript",
  ],
  "dom-advanced": [
    "события JavaScript",
    "делегирование событий",
    "браузерные API",
    "DOM Advanced",
    "event listeners",
    "browser events",
    "event delegation",
  ],
  "js-advanced": [
    "продвинутый JavaScript",
    "Proxy",
    "генераторы",
    "BigInt",
    "сборка мусора",
    "JS Advanced",
    "advanced JavaScript",
    "Proxy JavaScript",
    "generators",
  ],
};

export function getLessonKeywords(track: string, title: string): string[] {
  const trackWords = trackKeywords[track] || [];
  const titleWords = title
    .split(/[\s\-_]+/)
    .slice(0, 4)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 2);
  const englishTitleWords = title
    .split(/[\s\-_]+/)
    .slice(0, 4)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 2);

  return [
    ...trackWords.slice(0, 8),
    ...titleWords.slice(0, 3),
    ...englishTitleWords.slice(0, 3),
    ...commonKeywords.slice(0, 4),
  ];
}

export function getTrackTitle(track: string): { ru: string; en: string } {
  const titles: Record<string, { ru: string; en: string }> = {
    tools: { ru: "Инструменты", en: "Developer Tools" },
    html: { ru: "HTML", en: "HTML" },
    css: { ru: "CSS", en: "CSS" },
    "js-core": { ru: "JavaScript Core", en: "JavaScript Core" },
    "dom-basics": { ru: "DOM Basics", en: "DOM Basics" },
    "js-intermediate": { ru: "JavaScript Intermediate", en: "JavaScript Intermediate" },
    "js-async": { ru: "JavaScript Async", en: "JavaScript Async" },
    "dom-advanced": { ru: "DOM Advanced", en: "DOM Advanced" },
    "js-advanced": { ru: "JavaScript Advanced", en: "JavaScript Advanced" },
    js: { ru: "JavaScript", en: "JavaScript" },
    dom: { ru: "DOM и браузер", en: "DOM & Browser" },
  };
  return titles[track] || { ru: track, en: track };
}

export function getTrackDescription(track: string): { ru: string; en: string } {
  const descriptions: Record<string, { ru: string; en: string }> = {
    tools: {
      ru: "Терминал, Git, GitHub, npm и dev-сервер: инструменты, с которых начинается веб-разработка.",
      en: "Terminal, Git, GitHub, npm and dev server: the tools every web developer starts with.",
    },
    html: {
      ru: "Изучите HTML с нуля: структура документа, теги, формы, семантическая разметка и мультимедиа. 17 тем для начинающих.",
      en: "Learn HTML from scratch: document structure, tags, forms, semantic markup and multimedia. 17 topics for beginners.",
    },
    css: {
      ru: "Полный курс CSS: селекторы, блочная модель, flexbox, grid, анимации и адаптивный дизайн. 23 темы.",
      en: "Complete CSS course: selectors, box model, flexbox, grid, animations and responsive design. 23 topics.",
    },
    "js-core": {
      ru: "Основы JavaScript: переменные, типы, функции, массивы и объекты. 27 тем для начинающих.",
      en: "JavaScript basics: variables, types, functions, arrays and objects. 27 topics for beginners.",
    },
    "dom-basics": {
      ru: "Работа с веб-страницей: DOM-дерево, поиск элементов, навигация и изменение содержимого. 8 тем.",
      en: "Working with the web page: DOM tree, element search, navigation and content changes. 8 topics.",
    },
    "js-intermediate": {
      ru: "Средний уровень JavaScript: области видимости, замыкания, this, классы и прототипы. 19 тем.",
      en: "Intermediate JavaScript: scopes, closures, this, classes and prototypes. 19 topics.",
    },
    "js-async": {
      ru: "Асинхронность в JavaScript: промисы, async/await, таймеры и Fetch API. 7 тем.",
      en: "Async JavaScript: promises, async/await, timers and Fetch API. 7 topics.",
    },
    "dom-advanced": {
      ru: "События, делегирование, формы, клавиатура и продвинутые браузерные API. 11 тем.",
      en: "Events, delegation, forms, keyboard and advanced browser APIs. 11 topics.",
    },
    "js-advanced": {
      ru: "Дополнительный курс для углубления: Proxy, генераторы, память, BigInt и другие продвинутые темы. 26 тем.",
      en: "Optional deep-dive: Proxy, generators, memory, BigInt and other advanced topics. 26 topics.",
    },
    js: {
      ru: "JavaScript: от основ до продвинутых тем.",
      en: "JavaScript: from basics to advanced topics.",
    },
    dom: {
      ru: "DOM и браузер: от основ до продвинутых тем.",
      en: "DOM and browser: from basics to advanced topics.",
    },
  };
  return descriptions[track] || { ru: "", en: "" };
}
