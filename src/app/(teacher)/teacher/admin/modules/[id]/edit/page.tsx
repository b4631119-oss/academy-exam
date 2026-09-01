"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  getAllModules,
  saveModule,
  type ModuleRecord,
} from "@/lib/admin/actions";

export default function EditModulePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllModules();
        setModules(data);
        const mod = data.find((m) => m.id === id);
        if (mod) {
          setTitle(mod.title);
          setOrder(mod.order);
        }
      } catch {
        setError("Ошибка загрузки модуля");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const mod = modules.find((m) => m.id === id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const result = await saveModule({ id, title, order });
      if (result.success) {
        router.push("/teacher/admin/modules");
        router.refresh();
      } else {
        setError(result.error || "Ошибка сохранения");
      }
    } catch {
      setError("Ошибка сохранения модуля");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        Загрузка модуля...
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Модуль не найден
        </h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teacher/admin/modules">
          <Button variant="ghost" type="button" className="gap-1">
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Редактирование: Модуль {id}
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Card className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="title">Название модуля</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
        <Link href="/teacher/admin/modules">
          <Button variant="outline" type="button">
            Отмена
          </Button>
        </Link>
      </div>
    </form>
  );
}
