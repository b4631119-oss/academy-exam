"use client"

import { useState } from "react"
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  X,
} from "lucide-react"
import { toast } from "sonner"

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const SOCIAL_LINKS = [
  {
    name: "Telegram",
    icon: Send,
    color: "#0088cc",
    url: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "#25D366",
    url: (url: string, text: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`,
  },
  {
    name: "VK",
    icon: Share2,
    color: "#4680C2",
    url: (url: string, text: string) =>
      `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
  {
    name: "Twitter",
    icon: X,
    color: "#000",
    url: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    color: "#1877F2",
    url: (url: string, _text: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
    color: "#0A66C2",
    url: (url: string, _text: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
] as const

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const text = title

  const handleCopy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Ссылка скопирована")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may not be available
      toast.error("Не удалось скопировать ссылку")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Кнопки поделиться">
      {SOCIAL_LINKS.map(({ name, icon: Icon, color, url: getUrl }) => (
        <a
          key={name}
          href={getUrl(url, text)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          style={{ color }}
          aria-label={`Поделиться в ${name}`}
          role="listitem"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        aria-label={copied ? "Ссылка скопирована" : "Копировать ссылку"}
        aria-pressed={copied}
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}