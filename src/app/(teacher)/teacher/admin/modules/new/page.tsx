"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { saveModule } from "@/lib/admin/actions";

export default function NewModulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [id, setId] = useState(1);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
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
          Новый модуль
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
            <Label htmlFor="id">ID модуля</Label>
            <Input
              id="id"
              type="number"
              min={1}
              max={20}
              value={id}
              onChange={(e) => setId(Number(e.target.value))}
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

        <div className="space-y-2">
          <Label htmlFor="title">Название модуля</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Продвинутые функции"
            required
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          <Save className="w-4 h-4" />
          {loading ? "Сохранение..." : "Создать"}
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
