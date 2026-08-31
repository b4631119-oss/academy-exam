#!/usr/bin/env node
/**
 * check-file-lines.mjs
 *
 * Recursively checks that all source files are <= 250 lines.
 * Excludes: node_modules, .next, dist, build, .git, lockfiles,
 * generated files, content JSON data files, and E2E test scripts.
 *
 * Exit code 1 if any file exceeds the limit.
 */
import { readdirSync, statSync, readFileSync } from "fs"
import { join, extname, relative } from "path"

const LIMIT = 250
const ROOT = process.cwd()

const INCLUDE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".css"])
const EXCLUDE_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", ".agents"])
const EXCLUDE_FILES = new Set([
  "package-lock.json", "pnpm-lock.yaml", "yarn.lock",
  "bun.lockb", ".DS_Store"
])
// Exclude E2E test scripts and content JSON data files
const EXCLUDE_PATTERNS = [
  /scripts\/e2e-.*\.js$/,
  /src\/lib\/skills\/content\/.*\.json$/,
]

function shouldExclude(filePath) {
  const rel = relative(ROOT, filePath)
  return EXCLUDE_PATTERNS.some(p => p.test(rel))
}

function checkDir(dir, results) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry)) continue
    const fullPath = join(dir, entry)
    let stat
    try { stat = statSync(fullPath) } catch { continue }
    if (stat.isDirectory()) {
      checkDir(fullPath, results)
    } else if (stat.isFile()) {
      const ext = extname(entry)
      if (!INCLUDE_EXTS.has(ext)) continue
      if (EXCLUDE_FILES.has(entry)) continue
      if (shouldExclude(fullPath)) continue
      const content = readFileSync(fullPath, "utf8")
      const lineCount = content.split("\n").length
      if (lineCount > LIMIT) {
        results.push({ file: relative(ROOT, fullPath), lines: lineCount })
      }
    }
  }
}

const results = []
checkDir(join(ROOT, "src"), results)

if (results.length === 0) {
  console.log("✅ All source files are within the 250-line limit.")
  process.exit(0)
}

console.log(`\n❌ Found ${results.length} file(s) exceeding ${LIMIT} lines:\n`)
for (const r of results.sort((a, b) => b.lines - a.lines)) {
  console.log(`  ${r.file.padEnd(60)} ${r.lines} lines  (LIMIT ${LIMIT})`)
}
console.log()
process.exit(1)
