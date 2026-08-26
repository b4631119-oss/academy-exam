import { CodeBlock } from "@/components/skills/CodeBlock"
import { InlineText } from "@/components/skills/InlineText"
import type { ContentBlock } from "@/lib/skills/catalog"

export function LessonBody({ blocks }: { blocks: ContentBlock[] }) {
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
            <p key={index} className="text-base leading-7 text-slate-600 dark:text-slate-400">
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

        return (
          <aside
            key={index}
            className="rounded-2xl border border-sky-100 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/50 px-4 py-3 text-sm leading-6 text-sky-900 dark:text-sky-200"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">Важно</p>
            <InlineText text={block.text} />
          </aside>
        )
      })}
    </article>
  )
}
