/**
 * Converts src/data/javascript-course.json (theory/code_examples/pitfalls/tasks format)
 * into individual src/lib/skills/content/js-XX.json files matching the existing
 * html/css lesson block format used by LessonBody.tsx.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const src = JSON.parse(
  readFileSync("src/data/javascript-course.json", "utf-8")
);

const OUT_DIR = "src/lib/skills/content";

/** Convert a markdown-ish string into an array of blocks */
function theoryToBlocks(theory) {
  const blocks = [];
  const lines = theory.split("\n");
  let currentParagraph = [];
  let inCode = false;
  let codeLang = "";
  let codeLines = [];

  function flushParagraph() {
    const text = currentParagraph.join("\n").trim();
    if (text) {
      blocks.push({ type: "p", text });
    }
    currentParagraph = [];
  }

  for (const line of lines) {
    // Code block start/end
    if (line.trimStart().startsWith("```")) {
      if (inCode) {
        // End code block
        blocks.push({ type: "code", lang: codeLang || "javascript", code: codeLines.join("\n") });
        codeLines = [];
        inCode = false;
      } else {
        // Start code block — flush any pending paragraph first
        flushParagraph();
        inCode = true;
        codeLang = line.trimStart().slice(3).trim() || "javascript";
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    // Heading: ## Title
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "heading", text: line.slice(3).trim() });
      continue;
    }

    // Sub-heading: ### Title
    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "heading", text: line.slice(4).trim() });
      continue;
    }

    // List item: - text  or  * text  or  1. text
    const listMatch = line.match(/^\s*[-*]\s+(.*)/);
    if (listMatch) {
      flushParagraph();
      blocks.push({ type: "list", items: [listMatch[1]] });
      continue;
    }

    // Numbered list item: 1. text
    const numListMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (numListMatch) {
      flushParagraph();
      blocks.push({ type: "list", items: [numListMatch[1]] });
      continue;
    }

    // Empty line — flush paragraph
    if (line.trim() === "") {
      flushParagraph();
      continue;
    }

    // Regular text — accumulate into paragraph
    currentParagraph.push(line);
  }

  flushParagraph();
  return blocks;
}

/** Merge consecutive single-item list blocks into multi-item lists */
function mergeLists(blocks) {
  const merged = [];
  for (const block of blocks) {
    if (block.type === "list" && block.items.length === 1 && merged.length > 0) {
      const prev = merged[merged.length - 1];
      if (prev.type === "list") {
        prev.items.push(...block.items);
        continue;
      }
    }
    merged.push(block);
  }
  return merged;
}

/** Convert code_examples array into code blocks */
function codeExamplesToBlocks(examples) {
  return examples.map((ex) => ({
    type: "code",
    lang: "javascript",
    code: ex.code,
  }));
}

/** Convert pitfalls array into a list block */
function pitfallsToBlocks(pitfalls) {
  return [
    {
      type: "list",
      items: pitfalls.map((p) => `⚠️ ${p}`),
    },
  ];
}

/** Convert tasks object into blocks */
function tasksToBlocks(tasks) {
  const blocks = [];
  if (tasks.basic) {
    blocks.push({ type: "heading", text: "📝 Задания — Базовый уровень" });
    blocks.push({ type: "p", text: tasks.basic });
  }
  if (tasks.medium) {
    blocks.push({ type: "heading", text: "📝 Задания — Средний уровень" });
    blocks.push({ type: "p", text: tasks.medium });
  }
  if (tasks.hardcore) {
    blocks.push({ type: "heading", text: "🔥 Задания — Хардкор" });
    blocks.push({ type: "p", text: tasks.hardcore });
  }
  return blocks;
}

/** Convert a single lesson from JS course format to blocks format */
function convertLesson(lesson, sourceUrl) {
  const blocks = [];

  // Theory blocks
  const theoryBlocks = theoryToBlocks(lesson.theory);
  blocks.push(...mergeLists(theoryBlocks));

  // Sources comparison
  blocks.push({ type: "heading", text: "📊 Сравнение источников" });
  blocks.push({ type: "p", text: lesson.sources_comparison });

  // Code examples
  if (lesson.code_examples?.length) {
    blocks.push({ type: "heading", text: "💻 Примеры кода" });
    for (const ex of lesson.code_examples) {
      blocks.push({ type: "heading", text: ex.title });
      blocks.push({ type: "code", lang: "javascript", code: ex.code });
    }
  }

  // Pitfalls
  if (lesson.pitfalls?.length) {
    blocks.push({ type: "heading", text: "⚠️ Подводные камни" });
    blocks.push(...pitfallsToBlocks(lesson.pitfalls));
  }

  // Tasks
  blocks.push({ type: "heading", text: "🎯 Практические задания" });
  blocks.push(...tasksToBlocks(lesson.tasks));

  // Summary
  blocks.push({ type: "heading", text: "📌 Итог" });
  blocks.push({ type: "p", text: lesson.summary });

  const slugMap = {
    "1.1": "chto-takoe-javascript",
    "1.2": "peremennye-i-znacheniya",
    "1.3": "tipy-dannykh",
    "1.4": "operatory-i-preobrazovanie-tipov",
    "2.1": "uslovnye-konstruktsii",
    "2.2": "tsikly",
    "2.3": "funktsii",
    "2.4": "oblast-vidimosti-i-zamykaniya",
    "2.5": "funktsii-vyrazheniya-i-strelochnye",
    "3.1": "massivy",
    "3.2": "bazovye-metody-massivov",
    "3.3": "iteratsiya-po-massivu",
    "3.4": "funktsii-vysshego-poryadka",
    "3.5": "obekty",
    "4.1": "dom-struktura-stranitsy",
    "4.2": "poisk-elementov",
    "4.3": "sobytiya",
    "4.4": "khranenie-dannykh-na-kliente",
    "5.1": "sinkhronnyy-kod-i-blokirovka",
    "5.2": "callback-funktsii-i-settimeout",
    "5.3": "promisy",
    "5.4": "async-await",
  };

  return {
    slug: slugMap[lesson.id],
    track: "js",
    order: parseInt(lesson.id.split(".")[1]),
    title: lesson.title,
    summary: lesson.goal,
    sourceTitle: `Урок ${lesson.id}. ${lesson.title}`,
    blocks,
  };
}

// Process each lesson
const sourceUrl = src[0]?.source || "";
let fileIndex = 1;

for (const lesson of src) {
  const converted = convertLesson(lesson, sourceUrl);
  const fileNum = String(fileIndex).padStart(2, "0");
  const filename = `js-${fileNum}.json`;
  const filePath = join(OUT_DIR, filename);

  const fileContent = {
    source: "https://prolab-academy.site",
    lessons: [converted],
  };

  writeFileSync(filePath, JSON.stringify(fileContent, null, 2) + "\n");
  console.log(`✅ ${filename} — ${converted.title} (${converted.slug})`);
  fileIndex++;
}

console.log(`\n🎉 Generated ${fileIndex - 1} JS lesson files in ${OUT_DIR}`);
