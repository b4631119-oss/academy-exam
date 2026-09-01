"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Layers, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAllLessons, getAllModules } from "@/lib/admin/actions";

interface Stats {
  totalLessons: number;
  totalModules: number;
  lessonsByTrack: Record<string, number>;
  lessonsByModule: Record<number, number>;
  lessons: { track: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [lessons, modules] = await Promise.all([
          getAllLessons(),
          getAllModules(),
        ]);

        const lessonsByModule: Record<number, number> = {};
        for (const l of lessons) {
          lessonsByModule[l.module] = (lessonsByModule[l.module] || 0) + 1;
        }

        const lessonsByTrack: Record<string, number> = {};
        for (const l of lessons) {
          lessonsByTrack[l.track] = (lessonsByTrack[l.track] || 0) + 1;
        }

        setStats({
          totalLessons: lessons.length,
          totalModules: modules.length,
          lessonsByTrack,
          lessonsByModule,
          lessons,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">Загрузка...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Админ-панель
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Управление курсами (HTML, CSS, JavaScript)
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
            <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats?.totalLessons || 0}
            </p>
            <p className="text-sm text-slate-500">уроков</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats?.totalModules || 0}
            </p>
            <p className="text-sm text-slate-500">модулей</p>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/teacher/admin/lessons">
          <Card className="hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 transition-colors">
                  Управление уроками
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Создавать, редактировать и удалять уроки
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-500 transition-colors" />
            </div>
          </Card>
        </Link>

        <Link href="/teacher/admin/modules">
          <Card className="hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
                  Управление модулями
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Создавать, переименовывать и упорядочивать модули
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Track breakdown */}
      {stats && (
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
            По трекам
          </h3>
          <div className="space-y-2">
            {["html", "css", "js"].map((track) => {
              const count = (stats.lessons || []).filter((l) => l.track === track).length;
              const colors: Record<string, string> = {
                html: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                css: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                js: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
              };
              return (
                <div key={track} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[track]}`}>
                      {track.toUpperCase()}
                    </span>
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {count} ур.
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="text-center">
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/skills/html">
            <Button variant="outline">HTML →</Button>
          </Link>
          <Link href="/skills/css">
            <Button variant="outline">CSS →</Button>
          </Link>
          <Link href="/skills/js">
            <Button variant="outline">JavaScript →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
