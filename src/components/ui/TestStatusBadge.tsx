// Shared status badge for Test Mode — consistent text, ё and style everywhere.
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: "Черновик", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  lobby: { label: "Лобби", cls: "bg-sky-100 text-sky-700 border-sky-200" },
  running: { label: "Активен", cls: "bg-green-100 text-green-700 border-green-200" },
  finished: { label: "Завершён", cls: "bg-purple-100 text-purple-700 border-purple-200" }
}

export default function TestStatusBadge({ status }: { status?: string | null }) {
  const s = STATUS_MAP[status || ""] || STATUS_MAP.draft
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  )
}
