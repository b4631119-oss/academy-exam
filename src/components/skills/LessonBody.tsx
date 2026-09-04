import { CodeBlock } from "@/components/skills/CodeBlock"
import { InlineText } from "@/components/skills/InlineText"
import type { Lesson } from "@/lib/skills/catalog"

type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "note"; text: string }
  | { type: "links"; items: { title: string; url: string }[] }

function OldBlocksRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <article className="space-y-5 break-words">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <div key={index} className="pt-4">
              {index > 0 ? <hr className="mb-6 border-slate-200 dark:border-slate-700" /> : null}
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                <InlineText text={block.text} />
              </h2>
            </div>
          )
        }

        if (block.type === "p") {
          return (
            <p
              key={index}
              className="text-base leading-7 whitespace-pre-line text-slate-600 dark:text-slate-400"
            >
              <InlineText text={block.text} />
            </p>
          )
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="space-y-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-4">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>
                    <InlineText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === "code") {
          return <CodeBlock key={index} code={block.code} lang={block.lang} />
        }

        if (block.type === "links") {
          return (
            <ul key={index} className="space-y-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-4">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <aside
            key={index}
            className="rounded-2xl border border-sky-100 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/50 px-4 py-3 text-sm leading-6 whitespace-pre-line text-sky-900 dark:text-sky-200"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">Важно</p>
            <InlineText text={block.text} />
          </aside>
        )
      })}
    </article>
  )
}

function detectCodeLanguage(lesson: Lesson, code: string): string {
  // Code examples follow the language of their track. The only exception:
  // JS-family lessons sometimes show a short HTML snippet (markup part of a
  // DOM example) — detect it by the leading tag so it is highlighted as HTML.
  if (lesson.track === "html") return "html"
  if (lesson.track === "css") return "css"
  if (lesson.track === "tools") return "bash"
  if (/^\s*<(!DOCTYPE|html|!--|\/?[a-zA-Z])/.test(code)) return "html"
  return "javascript"
}

function renderMarkdownToBlocks(text: string): ContentBlock[] {
  const lines = text.split("\n")
  const blocks: ContentBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code blocks
    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace(/^```/, "").trim() || "text"
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ type: "code", lang, code: codeLines.join("\n") })
      i++ // skip closing ```
      continue
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({ type: "heading", text: line.replace(/^###\s*/, "") })
      i++
      continue
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.replace(/^##\s*/, "") })
      i++
      continue
    }

    // List items
    if (line.match(/^\d+\.\s/) || line.match(/^[-*]\s/)) {
      const items: string[] = []
      while (i < lines.length && (lines[i].match(/^\d+\.\s/) || lines[i].match(/^[-*]\s/))) {
        items.push(lines[i].replace(/^\d+\.\s|^[-*]\s/, ""))
        i++
      }
      blocks.push({ type: "list", items })
      continue
    }

    // Empty lines
    if (line.trim() === "") {
      i++
      continue
    }

    // Regular paragraphs — collect consecutive non-empty lines
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !lines[i].match(/^\d+\.\s/) && !lines[i].match(/^[-*]\s/)) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", text: paraLines.join("\n") })
    }
  }

  return blocks
}

function StructuredLessonRenderer({ lesson }: { lesson: Lesson }) {
  const blocks: ContentBlock[] = []

  // Example tier labels shown above each example (minimal / simple / real).
  const exampleLevelLabels: Record<string, string> = {
    minimal: "Самый простой",
    simple: "Простой",
    real: "Реальный пример",
  }

  // Short explanation
  if (lesson.shortExplanation) {
    blocks.push({ type: "heading", text: "Кратко" })
    blocks.push({ type: "p", text: lesson.shortExplanation })
  }

  // Learning objective
  if (lesson.learningObjective) {
    blocks.push({ type: "note", text: `Цель урока: ${lesson.learningObjective}` })
  }

  // Detailed explanation
  if (lesson.detailedExplanation) {
    blocks.push({ type: "heading", text: "Подробно" })
    blocks.push(...renderMarkdownToBlocks(lesson.detailedExplanation))
  }

  // Mental model
  if (lesson.mentalModel) {
    blocks.push({ type: "heading", text: "Ментальная модель" })
    blocks.push({ type: "p", text: lesson.mentalModel })
  }

  // Examples
  if (lesson.examples && lesson.examples.length > 0) {
    blocks.push({ type: "heading", text: "Примеры" })
    for (const example of lesson.examples) {
      const label = exampleLevelLabels[example.level] || example.level
      blocks.push({ type: "p", text: `**${label}:**` })
      blocks.push({ type: "code", lang: detectCodeLanguage(lesson, example.code), code: example.code })
      if (example.explanation) {
        blocks.push({ type: "p", text: example.explanation })
      }
    }
  }

  // Common mistakes
  if (lesson.commonMistakes && lesson.commonMistakes.length > 0) {
    blocks.push({ type: "heading", text: "Частые ошибки" })
    for (const mistake of lesson.commonMistakes) {
      blocks.push({ type: "p", text: `**Неправильно:** ${mistake.wrong}` })
      blocks.push({ type: "p", text: `**Почему:** ${mistake.why}` })
      blocks.push({ type: "p", text: `**Правильно:** ${mistake.right}` })
    }
  }

  // Important to remember
  if (lesson.importantToRemember && lesson.importantToRemember.length > 0) {
    blocks.push({ type: "heading", text: "Важно запомнить" })
    blocks.push({ type: "list", items: lesson.importantToRemember })
  }

  // Connection
  if (lesson.connection) {
    blocks.push({ type: "heading", text: "Связь" })
    if (lesson.connection.back) {
      blocks.push({ type: "p", text: `Назад: ${lesson.connection.back}` })
    }
    if (lesson.connection.forward) {
      blocks.push({ type: "p", text: `Вперёд: ${lesson.connection.forward}` })
    }
  }

  // External sources
  if (lesson.sources && lesson.sources.length > 0) {
    blocks.push({ type: "heading", text: "Читайте дальше" })
    blocks.push({ type: "links", items: lesson.sources })
  }

  return <OldBlocksRenderer blocks={blocks} />
}

export function LessonBody({ lesson }: { lesson: Lesson }) {
  // New structured format has shortExplanation or detailedExplanation
  const hasNewFormat = lesson.shortExplanation || lesson.detailedExplanation

  if (hasNewFormat) {
    return <StructuredLessonRenderer lesson={lesson} />
  }

  // Legacy blocks format
  if (lesson.blocks && lesson.blocks.length > 0) {
    return <OldBlocksRenderer blocks={lesson.blocks} />
  }

  // Fallback: render summary
  return (
    <article className="space-y-5 break-words">
      <p className="text-base leading-7 whitespace-pre-line text-slate-600 dark:text-slate-400">
        {lesson.summary || "Содержимое урока загружается..."}
      </p>
    </article>
  )
}
