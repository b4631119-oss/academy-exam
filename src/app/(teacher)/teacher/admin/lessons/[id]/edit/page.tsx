"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LessonForm } from "@/components/admin/LessonForm";
import { getLesson, type LessonRecord } from "@/lib/admin/actions";

export default function EditLessonPage() {
  const params = useParams();
  const id = params.id as string;
  const [lesson, setLesson] = useState<LessonRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLesson(id);
        if (data) {
          setLesson(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">Загрузка урока...</div>
    );
  }

  if (notFound || !lesson) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Урок не найден
        </h2>
        <p className="text-slate-500 mt-2">Урок с ID &quot;{id}&quot; не существует.</p>
      </div>
    );
  }

  return <LessonForm mode="edit" initialData={lesson} />;
}
