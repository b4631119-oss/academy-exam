/**
 * Aggregates all individual js-XX.json files into a single js-lessons.json
 * to avoid Turbopack JSON import resolution issues.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DIR = "src/lib/skills/content";
const allLessons = [];

for (let i = 1; i <= 22; i++) {
  const file = join(DIR, `js-${String(i).padStart(2, "0")}.json`);
  const data = JSON.parse(readFileSync(file, "utf-8"));
  for (const lesson of data.lessons) {
    allLessons.push(lesson);
  }
}

const output = {
  source: "https://prolab-academy.site",
  lessons: allLessons,
};

writeFileSync(join(DIR, "js-lessons.json"), JSON.stringify(output, null, 2) + "\n");
console.log(`✅ Created js-lessons.json with ${allLessons.length} lessons`);
