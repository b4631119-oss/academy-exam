"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  getAllModules,
  deleteModule,
  reorderModules,
  type ModuleRecord,
} from "@/lib/admin/actions";
import { toast } from "sonner";

export default function AdminModulesPage() {
  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getAllModules();
        if (!cancelled) setModules(data);
      } catch (err) {
        console.error("Failed to load modules:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      `Удалить модуль ${id}? Уроки в этом модуле будут потеряны.`
    )
    if (!confirmed) return;
    setDeleting(id);
    try {
      const result = await deleteModule(id);
      if (result.success) {
        setModules((prev) => prev.filter((m) => m.id !== id));
        toast.success("Модуль удалён");
      } else {
        toast.error(result.error || "Ошибка удаления");
      }
    } catch {
      toast.error("Ошибка удаления модуля");
    } finally {
      setDeleting(null);
    }
  }

  async function handleMove(id: number, direction: "up" | "down") {
    const sorted = [...modules].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((m) => m.id === id);
    if (idx < 0) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    // Swap order values
    const newOrder = sorted.map((m) => m.id);
    const temp = newOrder[idx];
    newOrder[idx] = newOrder[swapIdx];
    newOrder[swapIdx] = temp;

    const result = await reorderModules(newOrder);
    if (result.success) {
      setModules((prev) =>
        prev
          .map((m) => {
            const newIdx = newOrder.indexOf(m.id);
            return { ...m, order: newIdx + 1 };
          })
          .sort((a, b) => a.order - b.order)
      );
    }
  }

  const sorted = [...modules].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        Загрузка модулей...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Модули ({modules.length})
          </h1>
          <p className="text-slate-500 mt-1">
            Управление модулями курсов
          </p>
        </div>
        <Link href="/teacher/admin/modules/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Новый модуль
          </Button>
        </Link>
      </div>

      {sorted.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-slate-500">Модулей пока нет</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map((mod, index) => (
            <Card
              key={mod.id}
              className="flex items-center gap-4 !p-4 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => handleMove(mod.id, "up")}
                  disabled={index === 0}
                  className="p-0.5 text-slate-400 hover:text-sky-600 disabled:opacity-30 transition-colors"
                  title="Переместить вверх"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(mod.id, "down")}
                  disabled={index === sorted.length - 1}
                  className="p-0.5 text-slate-400 hover:text-sky-600 disabled:opacity-30 transition-colors"
                  title="Переместить вниз"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-mono text-slate-400 w-8 shrink-0">
                #{mod.id}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Порядок: {mod.order}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/teacher/admin/modules/${mod.id}/edit`}>
                  <Button variant="ghost" className="h-8 px-2">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDelete(mod.id)}
                  disabled={deleting === mod.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
