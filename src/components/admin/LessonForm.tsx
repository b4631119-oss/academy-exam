"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { saveLesson, type LessonRecord } from "@/lib/admin/actions";

interface LessonFormProps {
  initialData?: LessonRecord;
  mode: "create" | "edit";
}

export function LessonForm({ initialData, mode }: LessonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [track, setTrack] = useState<string>(
    initialData?.track || (initialData?.id?.startsWith("html-") ? "html" : initialData?.id?.startsWith("css-") ? "css" : "js")
  );
  const [id, setId] = useState(initialData?.id || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [module, setModule] = useState(initialData?.module || 1);
  const [order, setOrder] = useState(initialData?.order || 1);
  const [linksText, setLinksText] = useState(
    (initialData?.links || []).join("\n")
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await saveLesson({
        id,
        title,
        description: description || undefined,
        content,
        code: code || undefined,
        module,
        order,
        links: linksText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      });

      if (result.success) {
        router.push("/teacher/admin/lessons");
        router.refresh();
      } else {
        setError(result.error || "Ошибка сохранения");
      }
    } catch {
      setError("Ошибка сохранения урока");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teacher/admin/lessons">
          <Button variant="ghost" type="button" className="gap-1" aria-label="Вернуться к списку уроков">
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {mode === "create" ? "Новый урок" : `Редактирование: ${initialData?.id}`}
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Card className="space-y-4">
        {/* Track selector */}
        <div className="space-y-2">
          <Label htmlFor="track">Трек</Label>
          <select
            id="track"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            disabled={mode === "edit"}
            className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            aria-disabled={mode === "edit"}
          >
            <option value="js">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          {mode === "edit" && (
            <p className="text-sm text-slate-500 dark:text-slate-400">Трек нельзя изменить при редактировании</p>
          )}
        </div>

        {/* ID + Title row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID урока</Label>
            <Input
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={track === "js" ? "5.6" : `${track}-01`}
              required
              disabled={mode === "edit"}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {track === "js"
                ? "Латиница, цифры, дефисы. Пример: 5.6 или proxy-reflect"
                : `Формат: ${track}-XX`}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название урока"
              required
            />
          </div>
        </div>

        {/* Module + Order row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="module">Модуль</Label>
            <Input
              id="module"
              type="number"
              min={1}
              max={20}
              value={module}
              onChange={(e) => setModule(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Порядок</Label>
            <Input
              id="order"
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Описание (summary)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание урока"
          />
        </div>

        {/* Content (main body) */}
        <div className="space-y-2">
          <Label htmlFor="content">Содержимое урока (Markdown)</Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y min-h-[280px] sm:min-h-[320px]"
            placeholder="# Урок 5.6. Пример&#10;&#10;## Цель урока&#10;&#10;Текст урока..."
          />
        </div>

        {/* Code */}
        <div className="space-y-2">
          <Label htmlFor="code">Код (необязательно)</Label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            placeholder="// Пример кода из урока"
          />
        </div>

        {/* Links */}
        <div className="space-y-2">
          <Label htmlFor="links">Ссылки (по одной на строку)</Label>
          <textarea
            id="links"
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            rows={3}
            className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            placeholder="https://developer.mozilla.org/...&#10;https://learn.javascript.ru/..."
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          <Save className="w-4 h-4" />
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
        <Link href="/teacher/admin/lessons">
          <Button variant="outline" type="button">
            Отмена
          </Button>
        </Link>
      </div>
    </form>
  );
}
