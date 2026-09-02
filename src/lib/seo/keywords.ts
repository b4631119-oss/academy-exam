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
  js: [
    "JavaScript курс",
    "JS обучение",
    "программирование на JS",
    "109 уроков",
    "ООП JavaScript",
    "асинхронность JavaScript",
    "промисы JavaScript",
    "JavaScript course",
    "learn JavaScript",
    "JS programming",
    "109 lessons",
    "OOP JavaScript",
    "async/await JavaScript",
    "promises JavaScript",
    "JavaScript tutorial",
  ],
  html: [
    "HTML курс",
    "вёрстка сайтов",
    "семантическая вёрстка",
    "веб-разработка для начинающих",
    "21 тема",
    "HTML course",
    "web development basics",
    "semantic markup",
    "21 topics",
    "HTML tutorial",
    "web development course",
  ],
  css: [
    "CSS обучение",
    "flexbox",
    "grid",
    "адаптивный дизайн",
    "анимации CSS",
    "30 тем",
    "CSS course",
    "flexbox",
    "grid",
    "responsive design",
    "CSS animations",
    "30 topics",
    "CSS tutorial",
    "CSS styling",
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
    js: { ru: "JavaScript", en: "JavaScript" },
    html: { ru: "HTML и CSS", en: "HTML & CSS" },
    css: { ru: "CSS", en: "CSS" },
  };
  return titles[track] || { ru: track, en: track };
}

export function getTrackDescription(track: string): { ru: string; en: string } {
  const descriptions: Record<string, { ru: string; en: string }> = {
    js: {
      ru: "Полный курс JavaScript от основ до продвинутых тем: промисы, async/await, ООП, прототипы. 109 уроков с практическими заданиями.",
      en: "Complete JavaScript course from basics to advanced topics: promises, async/await, OOP, prototypes. 109 lessons with practical exercises.",
    },
    html: {
      ru: "Изучите HTML и CSS с нуля: семантическая вёрстка, flexbox, grid, адаптивный дизайн. 21 тема для начинающих веб-разработчиков.",
      en: "Learn HTML and CSS from scratch: semantic markup, flexbox, grid, responsive design. 21 topics for beginner web developers.",
    },
    css: {
      ru: "Полный курс CSS: flexbox, grid, анимации, адаптивный дизайн, CSS-переменные. 30 тем для профессиональной вёрстки.",
      en: "Complete CSS course: flexbox, grid, animations, responsive design, CSS variables. 30 topics for professional web development.",
    },
  };
  return descriptions[track] || { ru: "", en: "" };
}