/**
 * Legacy content index (ARCHIVE).
 *
 * The old per-lesson JSON files (html-01.json … html-21.json,
 * css-22.json … css-51.json) are intentionally KEPT on disk as
 * archive / source material, but they are no longer imported by
 * the active runtime.
 *
 * Active lesson data lives in the structured modules:
 *   src/lib/skills/content/<track>-lessons.ts
 * which are imported directly by src/lib/skills/catalog.ts.
 *
 * This file is kept only for reference; nothing in the app imports it.
 */

export const source = ""
export const lessons = []