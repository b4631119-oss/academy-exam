type Token = { text: string; className?: string }

function pushPlain(tokens: Token[], text: string) {
  if (text) tokens.push({ text })
}

function highlightCss(code: string): Token[] {
  const tokens: Token[] = []
  const re =
    /(\/\*[\s\S]*?\*\/)|(:root\b|[.#]?[a-zA-Z_][\w-]*|@[\w-]+)|(:[a-zA-Z-]+)|("[^"]*"|'[^']*')|([0-9.]+(?:px|rem|em|%|vh|vw|s|ms)?)|([{};:,])/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(code))) {
    pushPlain(tokens, code.slice(last, match.index))
    if (match[1]) tokens.push({ text: match[1], className: "text-slate-400 italic" })
    else if (match[2]) tokens.push({ text: match[2], className: "text-sky-300" })
    else if (match[3]) tokens.push({ text: match[3], className: "text-violet-300" })
    else if (match[4]) tokens.push({ text: match[4], className: "text-emerald-300" })
    else if (match[5]) tokens.push({ text: match[5], className: "text-amber-300" })
    else tokens.push({ text: match[6], className: "text-slate-400" })
    last = match.index + match[0].length
  }
  pushPlain(tokens, code.slice(last))
  return tokens
}

function highlightHtml(code: string): Token[] {
  const tokens: Token[] = []
  const re =
    /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z0-9!-]+)|(\s+[a-zA-Z-:]+(?==))|("[^"]*"|'[^']*')|(>)/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(code))) {
    pushPlain(tokens, code.slice(last, match.index))
    if (match[1]) tokens.push({ text: match[1], className: "text-slate-400 italic" })
    else if (match[2]) tokens.push({ text: match[2], className: "text-sky-300" })
    else if (match[3]) tokens.push({ text: match[3], className: "text-amber-300" })
    else if (match[4]) tokens.push({ text: match[4], className: "text-emerald-300" })
    else tokens.push({ text: match[5], className: "text-sky-300" })
    last = match.index + match[0].length
  }
  pushPlain(tokens, code.slice(last))
  return tokens
}

function highlightGeneric(code: string): Token[] {
  const tokens: Token[] = []
  const re = /(\/\/.*$|\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(\b(?:const|let|var|function|return|true|false|null)\b)/gm
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(code))) {
    pushPlain(tokens, code.slice(last, match.index))
    if (match[1]) tokens.push({ text: match[1], className: "text-slate-400 italic" })
    else if (match[2]) tokens.push({ text: match[2], className: "text-emerald-300" })
    else tokens.push({ text: match[3], className: "text-violet-300" })
    last = match.index + match[0].length
  }
  pushPlain(tokens, code.slice(last))
  return tokens
}

function tokenize(code: string, lang: string): Token[] {
  const normalized = lang.toLowerCase()
  if (normalized === "html" || normalized === "xml") return highlightHtml(code)
  if (normalized === "css") return highlightCss(code)
  if (normalized === "json" || normalized === "javascript" || normalized === "js") {
    return highlightGeneric(code)
  }
  return [{ text: code }]
}

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const tokens = tokenize(code, lang)
  const label = lang || "code"

  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <figcaption className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      </figcaption>
      <div className="overflow-x-auto -mx-4 px-4">
        <pre className="p-4 text-[13px] leading-6 min-w-max">
          <code className="font-mono text-slate-100 whitespace-pre">
            {tokens.map((token, index) => (
              <span key={index} className={token.className}>
                {token.text}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  )
}
