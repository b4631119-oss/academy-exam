"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  getAllLessons,
  deleteLesson,
  type LessonRecord,
} from "@/lib/admin/actions";
import { toast } from "sonner";

const TRACKS = [
  { id: "all", label: "Все", color: "slate" },
  { id: "html", label: "HTML", color: "orange" },
  { id: "css", label: "CSS", color: "blue" },
  { id: "js", label: "JavaScript", color: "yellow" },
] as const;

const TRACK_COLORS: Record<string, string> = {
  html: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  css: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  js: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const TRACK_TAB_ACTIVE: Record<string, string> = {
  all: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
  html: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  css: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  js: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
};

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getAllLessons();
        if (!cancelled) setLessons(data);
      } catch (err) {
        console.error("Failed to load lessons:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter by track
  const trackLessons = useMemo(() => {
    if (activeTrack === "all") return lessons;
    return lessons.filter((l) => l.track === activeTrack);
  }, [lessons, activeTrack]);

  // Group by module
  const groupedByModule = useMemo(() => {
    const groups: Record<number, LessonRecord[]> = {};
    for (const lesson of trackLessons) {
      const mod = lesson.module || 1;
      if (!groups[mod]) groups[mod] = [];
      groups[mod].push(lesson);
    }
    // Sort lessons within each module by order
    for (const mod of Object.keys(groups)) {
      groups[Number(mod)].sort((a, b) => a.order - b.order);
    }
    return groups;
  }, [trackLessons]);

  const modules = Object.keys(groupedByModule)
    .map(Number)
    .sort((a, b) => a - b);

  function toggleModule(mod: number) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(String(mod))) {
        next.delete(String(mod));
      } else {
        next.add(String(mod));
      }
      return next;
    });
  }

  function expandAll() {
    setExpandedModules(new Set(modules.map(String)));
  }

  function collapseAll() {
    setExpandedModules(new Set());
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const result = await deleteLesson(id);
      if (result.success) {
        setLessons((prev) => prev.filter((l) => l.id !== id));
        setDeleteConfirm(null);
        toast.success("Урок удалён");
      } else {
        toast.error(result.error || "Ошибка удаления");
      }
    } catch {
      toast.error("Ошибка удаления урока");
    } finally {
      setDeleting(null);
    }
  }

  // Counts per track
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: lessons.length };
    for (const l of lessons) {
      c[l.track] = (c[l.track] || 0) + 1;
    }
    return c;
  }, [lessons]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">Загрузка уроков...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Уроки
          </h1>
          <p className="text-slate-500 mt-1">
            {lessons.length} уроков во всех курсах
          </p>
        </div>
        <Link href="/teacher/admin/lessons/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Новый урок
          </Button>
        </Link>
      </div>

      {/* Track tabs */}
      <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Фильтр по треку">
        {TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => setActiveTrack(track.id)}
            role="tab"
            aria-selected={activeTrack === track.id}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[40px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
              activeTrack === track.id
                ? TRACK_TAB_ACTIVE[track.id]
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {track.label}
            <span className="ml-1.5 text-xs opacity-60">
              {counts[track.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Expand/Collapse controls */}
      {modules.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-sm text-sky-600 dark:text-sky-400 hover:underline px-2 py-1.5 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded"
          >
            Развернуть все
          </button>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <button
            onClick={collapseAll}
            className="text-sm text-sky-600 dark:text-sky-400 hover:underline px-2 py-1.5 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded"
          >
            Свернуть все
          </button>
        </div>
      )}

      {/* Module groups */}
      {modules.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-slate-500">Уроков не найдено</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => {
            const modLessons = groupedByModule[mod];
            const isExpanded = expandedModules.has(String(mod));
            const track =
              modLessons.length > 0 ? modLessons[0].track : "js";

            return (
              <Card key={mod} className="!p-0 overflow-hidden">
                {/* Module header */}
                <button
                  onClick={() => toggleModule(mod)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`px-2.5 py-1 rounded text-sm font-medium ${TRACK_COLORS[track] || TRACK_COLORS.js}`}
                  >
                    {track.toUpperCase()}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Модуль {mod}
                  </span>
                  <span className="text-sm text-slate-400">
                    ({modLessons.length} ур.)
                  </span>
                </button>

                {/* Lessons in module */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800">
                    {modLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 min-h-[48px]"
                      >
                        <span className="text-sm font-mono text-slate-400 w-20 shrink-0">
                          {lesson.id}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {lesson.title}
                          </h4>
                        </div>
                        <span className="text-sm text-slate-400 shrink-0">
                          #{lesson.order}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link
                            href={`/teacher/admin/lessons/${lesson.id}/edit`}
                          >
                            <Button
                              variant="ghost"
                              className="h-9 px-2.5"
                              title="Редактировать"
                              aria-label={`Редактировать урок: ${lesson.title}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>

                          {deleteConfirm === lesson.id ? (
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="ghost"
                                className="h-9 px-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => handleDelete(lesson.id)}
                                disabled={deleting === lesson.id}
                              >
                                {deleting === lesson.id ? "..." : "Да, удалить"}
                              </Button>
                              <Button
                                variant="ghost"
                                className="h-9 px-3 text-sm"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                Отмена
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              className="h-9 px-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => setDeleteConfirm(lesson.id)}
                              aria-label={`Удалить урок: ${lesson.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
