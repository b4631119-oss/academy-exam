#!/usr/bin/env node
/**
 * Batch-fix remaining @typescript-eslint/no-explicit-any errors.
 * Strategy:
 *   - catch (err: any) → catch (err: unknown)
 *   - err.message → (err as Error).message in catch blocks
 *   - useState<any>(x) → useState<Record<string, unknown> | null>(null) etc
 *   - .map((x: any) => ...) → .map((x: Record<string, unknown>) => ...)
 *   - .forEach((x: any) => ...) → .forEach((x: Record<string, unknown>) => ...)
 *   - (x as any) → (x as Record<string, unknown>)
 *   - .sort((a: any, b: any) => ...) → keep as is (needs specific types)
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get all files with no-explicit-any from ESLint JSON
let raw;
try {
  raw = execSync('npx eslint . --format json', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
} catch (e) {
  raw = e.stdout;
}
const data = JSON.parse(raw);

const filesToFix = {};
for (const file of data) {
  const anyMessages = file.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');
  if (anyMessages.length > 0) {
    filesToFix[file.filePath] = anyMessages.map(m => m.line);
  }
}

let totalFixed = 0;

for (const [filePath, lines] of Object.entries(filesToFix)) {
  let content = readFileSync(filePath, 'utf8');
  const linesBefore = content;
  
  for (const line of lines) {
    const lineContent = content.split('\n')[line - 1];
    if (!lineContent) continue;
    
    // Pattern 1: useState<any>(null) → useState<Record<string, unknown> | null>(null)
    if (/useState<any>\(null\)/.test(lineContent)) {
      content = content.replace(/useState<any>\(null\)/, 'useState<Record<string, unknown> | null>(null)');
      totalFixed++;
      continue;
    }
    
    // Pattern 2: useState<any[]>([]) → useState<Record<string, unknown>[]>([])
    if (/useState<any\[\]>\(\[\]\)/.test(lineContent)) {
      content = content.replace(/useState<any\[\]>\(\[\]\)/, 'useState<Record<string, unknown>[]>([])');
      totalFixed++;
      continue;
    }
    
    // Pattern 3: (.map/.forEach/etc)((x: any) => → ((x: Record<string, unknown>) =>
    const anyParamMatch = lineContent.match(/(\(\w+:\s*)any(\))/);
    if (anyParamMatch && !lineContent.includes('catch')) {
      content = content.replace(anyParamMatch[0], anyParamMatch[1] + 'Record<string, unknown>' + anyParamMatch[2]);
      totalFixed++;
      continue;
    }
    
    // Pattern 4: (x: any, y: number) in sort → (x: Record<string, unknown>, y: number)
    // Already handled by pattern 3 above
    
    // Pattern 5: any[] in variable declarations
    if (lineContent.includes(': any[]')) {
      content = content.replace(/:\s*any\[\]/, ': Record<string, unknown>[]');
      totalFixed++;
      continue;
    }
  }
  
  if (content !== linesBefore) {
    writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath.split('/academy-exam/')[1]} (${lines.length} any)`);
  }
}

console.log(`\nTotal fixed: ${totalFixed}`);
console.log(`Files with remaining any: ${Object.keys(filesToFix).length}`);
