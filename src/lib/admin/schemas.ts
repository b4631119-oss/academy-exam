import { z } from "zod";

// ── Lesson schema ──────────────────────────────────────────────
export const lessonSchema = z.object({
  id: z
    .string()
    .min(1, "ID обязателен")
    .regex(/^[a-z0-9-]+$/, "ID может содержать только латиницу, цифры и дефис"),
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  content: z.string().min(1, "Содержимое обязательно"),
  code: z.string().optional(),
  tasks: z.any().optional(),
  links: z.array(z.string()).optional(),
  module: z.number().int().min(1).max(20),
  order: z.number().int().min(1),
});

export type LessonInput = z.infer<typeof lessonSchema>;

// ── Module schema ──────────────────────────────────────────────
export const moduleSchema = z.object({
  id: z.number().int().min(1).max(20),
  title: z.string().min(1, "Название модуля обязательно"),
  order: z.number().int().min(1),
});

export type ModuleInput = z.infer<typeof moduleSchema>;

// ── Admin login schema ─────────────────────────────────────────
export const adminLoginSchema = z.object({
  password: z.string().min(1, "Пароль обязателен"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
