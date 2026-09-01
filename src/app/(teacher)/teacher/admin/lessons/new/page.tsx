import { LessonForm } from "@/components/admin/LessonForm";

export const metadata = {
  title: "Новый урок — Админ-панель",
};

export default function NewLessonPage() {
  return <LessonForm mode="create" />;
}
