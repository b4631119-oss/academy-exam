"use server";

import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { revalidatePath } from "next/cache";
import { lessonSchema, moduleSchema, type LessonInput, type ModuleInput } from "./schemas";
import {
  getFileContent,
  updateFileContent,
  deleteFile,
} from "./github";

// ── Constants ──────────────────────────────────────────────────

const ADMIN_EMAIL = "devroot007@gmail.com";
const CONTENT_DIR = "src/lib/skills/content";
const CONTENT_ABS_DIR = path.join(process.cwd(), CONTENT_DIR);
const MODULES_FILE = `${CONTENT_DIR}/modules.json`;
const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ── JWT helpers ────────────────────────────────────────────────

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET env var");
  return new TextEncoder().encode(secret);
}

type AdminPayload = Record<string, unknown> & {
  isAdmin: boolean;
  email: string;
};

async function signAdminToken(): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ isAdmin: true, email: ADMIN_EMAIL } as AdminPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return (payload as unknown as AdminPayload).isAdmin === true;
  } catch {
    return false;
  }
}

// ── Auth helpers ───────────────────────────────────────────────

export async function checkAdminAccess(): Promise<void> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!adminToken || !(await verifyAdminToken(adminToken))) {
    throw new Error("ADMIN_LOGIN_REQUIRED");
  }
}

// ── Server Actions: Admin Session ──────────────────────────────

export async function setAdminSession(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get("password") as string;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { error: "Server configuration error" };
  }

  if (password !== adminPassword) {
    return { error: "Неверный пароль" };
  }

  const token = await signAdminToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return { success: true };
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

// ── Server Actions: Lessons CRUD ───────────────────────────────

/**
 * Resolve the file path for a lesson based on its track.
 * JS lessons: src/lib/skills/content/js-lesson-{id}.json
 * HTML/CSS lessons: src/lib/skills/content/{track}-{order}.json (module file)
 *
 * For HTML/CSS, we write to the individual module file that contains them.
 */
export interface LessonRecord {
  id: string;
  track: string;
  title: string;
  summary?: string;
  description?: string;
  content: string;
  code?: string;
  tasks?: unknown;
  links?: string[];
  module: number;
  order: number;
  /** For HTML/CSS: the source file name */
  sourceFile?: string;
}

// ── In-memory cache ────────────────────────────────────────────
let lessonsCache: LessonRecord[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

function readContentFile(filename: string): string | null {
  try {
    return fs.readFileSync(path.join(CONTENT_ABS_DIR, filename), "utf-8");
  } catch {
    return null;
  }
}

function listContentFiles(): string[] {
  try {
    return fs.readdirSync(CONTENT_ABS_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
}

function parseJsLessonFile(filename: string, data: Record<string, unknown>): LessonRecord {
  const id = filename.replace("js-lesson-", "").replace(".json", "");
  return {
    id,
    track: "js",
    title: (data.title as string) || "",
    summary: (data.summary as string) || "",
    description: (data.description as string) || "",
    content: (data.content as string) || "",
    code: (data.code as string) || "",
    tasks: data.tasks,
    links: (data.links as string[]) || [],
    module: (data.module as number) || 1,
    order: (data.order as number) || 0,
    sourceFile: filename,
  };
}

function parseModuleFile(
  filename: string,
  data: Record<string, unknown>,
  track: string
): LessonRecord[] {
  const lessons = data.lessons as Record<string, unknown>[] | undefined;
  if (!Array.isArray(lessons)) return [];

  return lessons.map((l, idx) => {
    const order = (l.order as number) || idx + 1;
    return {
      id: `${track}-${String(order).padStart(2, "0")}`,
      track,
      title: (l.title as string) || "",
      summary: (l.summary as string) || "",
      content: JSON.stringify(l.blocks || []),
      module: (l.module as number) || 1,
      order,
      sourceFile: filename,
    };
  });
}

export async function getAllLessons(): Promise<LessonRecord[]> {
  await checkAdminAccess();

  if (lessonsCache && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return lessonsCache;
  }

  const files = listContentFiles();
  const lessons: LessonRecord[] = [];

  for (const file of files) {
    try {
      const raw = readContentFile(file);
      if (!raw) continue;
      const data = JSON.parse(raw) as Record<string, unknown>;

      if (file.startsWith("js-lesson-")) {
        lessons.push(parseJsLessonFile(file, data));
      } else if (file.startsWith("html-") || file.startsWith("css-")) {
        const track = file.startsWith("html-") ? "html" : "css";
        lessons.push(...parseModuleFile(file, data, track));
      }
    } catch {
      // Skip malformed files
    }
  }

  const sorted = lessons.sort((a, b) => a.order - b.order);
  lessonsCache = sorted;
  cacheTimestamp = Date.now();
  return sorted;
}

function invalidateCache() {
  lessonsCache = null;
  cacheTimestamp = 0;
}

export async function getLesson(
  id: string
): Promise<LessonRecord | null> {
  await checkAdminAccess();

  // Try JS lesson file first
  const jsFile = `js-lesson-${id}.json`;
  const raw = readContentFile(jsFile);
  if (raw) {
    const data = JSON.parse(raw);
    return {
      id,
      track: "js",
      title: data.title || "",
      summary: data.summary || "",
      description: data.description || "",
      content: data.content || "",
      code: data.code || "",
      tasks: data.tasks,
      links: data.links || [],
      module: data.module || 1,
      order: data.order || 0,
      sourceFile: jsFile,
    };
  }

  // Search HTML/CSS module files
  const files = listContentFiles();
  for (const file of files) {
    if (file.startsWith("html-") || file.startsWith("css-")) {
      const raw = readContentFile(file);
      if (!raw) continue;
      const data = JSON.parse(raw) as Record<string, unknown>;
      const lessons = data.lessons as Record<string, unknown>[] | undefined;
      if (!Array.isArray(lessons)) continue;
      const track = file.startsWith("html-") ? "html" : "css";
      for (let idx = 0; idx < lessons.length; idx++) {
        const l = lessons[idx];
        const order = (l.order as number) || idx + 1;
        const lessonId = `${track}-${String(order).padStart(2, "0")}`;
        if (lessonId === id) {
          return {
            id,
            track,
            title: (l.title as string) || "",
            summary: (l.summary as string) || "",
            content: JSON.stringify(l.blocks || []),
            module: (l.module as number) || 1,
            order,
            sourceFile: file,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Save a lesson. For JS lessons, creates/updates js-lesson-{id}.json.
 * For HTML/CSS lessons, updates the containing module file.
 */
export async function saveLesson(data: LessonInput): Promise<{ success: boolean; error?: string }> {
  await checkAdminAccess();

  const parsed = lessonSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const lesson = parsed.data;
  const track = lesson.id.match(/^(html|css)-/) ? (lesson.id.startsWith("html") ? "html" : "css") : "js";

  if (track === "js") {
    // JS lesson: create/update individual file
    const file = `js-lesson-${lesson.id}.json`;
    const filePath = `${CONTENT_DIR}/${file}`;

    const jsonContent = JSON.stringify(
      {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || "",
        content: lesson.content,
        code: lesson.code || "",
        tasks: lesson.tasks || null,
        links: lesson.links || [],
        module: lesson.module,
        order: lesson.order,
      },
      null,
      2
    );

    const existing = readContentFile(file);
    const message = existing
      ? `feat: update lesson ${lesson.id}`
      : `feat: create lesson ${lesson.id}`;

    await updateFileContent(filePath, jsonContent, message);
  } else {
    // HTML/CSS lesson: update the containing module file
    const order = parseInt(lesson.id.split("-")[1], 10);
    const fileNum = Math.ceil(order / 7);
    const sourceFile = `${track}-${String(fileNum).padStart(2, "0")}.json`;
    const filePath = `${CONTENT_DIR}/${sourceFile}`;

    const raw = readContentFile(sourceFile);
    if (!raw) {
      return { success: false, error: `Файл ${sourceFile} не найден` };
    }

    const moduleData = JSON.parse(raw) as Record<string, unknown>;
    const lessons = (moduleData.lessons || []) as Record<string, unknown>[];

    // Find and update the lesson in the array
    const idx = lessons.findIndex((l) => {
      const lOrder = (l.order as number) || 0;
      return lOrder === order;
    });

    if (idx >= 0) {
      lessons[idx] = {
        ...lessons[idx],
        title: lesson.title,
        summary: lesson.description || "",
        blocks: JSON.parse(lesson.content || "[]"),
      };
    } else {
      lessons.push({
        order,
        title: lesson.title,
        summary: lesson.description || "",
        blocks: JSON.parse(lesson.content || "[]"),
      });
    }

    moduleData.lessons = lessons;
    const json = JSON.stringify(moduleData, null, 2);
    const message = `feat: update ${track} lesson ${lesson.id}`;
    await updateFileContent(filePath, json, message);
  }

  revalidatePath("/skills");
  revalidatePath("/skills/html");
  revalidatePath("/skills/css");
  revalidatePath("/skills/js");
  revalidatePath("/skills/dom");
  invalidateCache();

  return { success: true };
}

/**
 * Delete a lesson.
 */
export async function deleteLesson(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await checkAdminAccess();

  const track = id.match(/^(html|css)-/) ? (id.startsWith("html") ? "html" : "css") : "js";

  if (track === "js") {
    const file = `js-lesson-${id}.json`;
    const filePath = `${CONTENT_DIR}/${file}`;

    const existing = readContentFile(file);
    if (!existing) {
      return { success: false, error: "Урок не найден" };
    }

    await deleteFile(filePath, `feat: delete lesson ${id}`);
  } else {
    // For HTML/CSS: find and remove from the module file
    const order = parseInt(id.split("-")[1], 10);
    const fileNum = Math.ceil(order / 7);
    const sourceFile = `${track}-${String(fileNum).padStart(2, "0")}.json`;
    const filePath = `${CONTENT_DIR}/${sourceFile}`;

    const raw = readContentFile(sourceFile);
    if (!raw) {
      return { success: false, error: "Урок не найден" };
    }

    const moduleData = JSON.parse(raw) as Record<string, unknown>;
    const lessons = (moduleData.lessons || []) as Record<string, unknown>[];
    const filtered = lessons.filter((l) => {
      const lOrder = (l.order as number) || 0;
      return lOrder !== order;
    });

    if (filtered.length === lessons.length) {
      return { success: false, error: "Урок не найден" };
    }

    moduleData.lessons = filtered;
    const json = JSON.stringify(moduleData, null, 2);
    await updateFileContent(filePath, json, `feat: delete ${track} lesson ${id}`);
  }

  revalidatePath("/skills");
  revalidatePath("/skills/html");
  revalidatePath("/skills/css");
  revalidatePath("/skills/js");
  revalidatePath("/skills/dom");
  invalidateCache();

  return { success: true };
}

// ── Server Actions: Modules CRUD ───────────────────────────────

export interface ModuleRecord {
  id: number;
  title: string;
  order: number;
  track?: string;
}

const DEFAULT_MODULES: ModuleRecord[] = [
  { id: 1, title: "Основы языка", order: 1, track: "js" },
  { id: 2, title: "Поток и функции", order: 2, track: "js" },
  { id: 3, title: "Массивы, объекты + Качество кода", order: 3, track: "js" },
  { id: 4, title: "Браузер + Объекты (углублённо)", order: 4, track: "js" },
  { id: 5, title: "Асинхронность + Типы данных", order: 5, track: "js" },
  { id: 6, title: "Продвинутые функции", order: 6, track: "js" },
  { id: 7, title: "Прототипы, классы, ООП", order: 7, track: "js" },
  { id: 8, title: "Ошибки, async+, генераторы, модули", order: 8, track: "js" },
  { id: 9, title: "DOM и события (расширенный)", order: 9, track: "js" },
  { id: 10, title: "Продвинутые возможности", order: 10, track: "js" },
];

export async function getAllModules(): Promise<ModuleRecord[]> {
  await checkAdminAccess();

  // Try local fs first
  const raw = readContentFile("modules.json");
  if (raw) {
    try {
      return JSON.parse(raw) as ModuleRecord[];
    } catch {
      // Fall through
    }
  }

  // Fallback to GitHub API
  const rawApi = await getFileContent(MODULES_FILE);
  if (rawApi) {
    try {
      return JSON.parse(rawApi) as ModuleRecord[];
    } catch {
      // Fall through
    }
  }

  return DEFAULT_MODULES;
}

export async function saveModule(data: ModuleInput): Promise<{ success: boolean; error?: string }> {
  await checkAdminAccess();

  const parsed = moduleSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const moduleData = parsed.data;
  const modules = await getAllModules();
  const idx = modules.findIndex((m) => m.id === moduleData.id);

  if (idx >= 0) {
    modules[idx] = { ...modules[idx], ...moduleData };
  } else {
    modules.push(moduleData as ModuleRecord);
  }

  modules.sort((a, b) => a.order - b.order);

  const json = JSON.stringify(modules, null, 2);
  const message = idx >= 0
    ? `feat: update module ${moduleData.id}`
    : `feat: create module ${moduleData.id}`;

  await updateFileContent(MODULES_FILE, json, message);
  revalidatePath("/skills");
  invalidateCache();

  return { success: true };
}

export async function deleteModule(
  id: number
): Promise<{ success: boolean; error?: string }> {
  await checkAdminAccess();

  const lessons = await getAllLessons();
  const lessonsInModule = lessons.filter((l) => l.module === id);
  if (lessonsInModule.length > 0) {
    return {
      success: false,
      error: `Невозможно удалить модуль ${id}: в нём ${lessonsInModule.length} урок(ов). Сначала удалите или переместите уроки.`,
    };
  }

  const modules = await getAllModules();
  const filtered = modules.filter((m) => m.id !== id);

  if (filtered.length === modules.length) {
    return { success: false, error: "Модуль не найден" };
  }

  const json = JSON.stringify(filtered, null, 2);
  await updateFileContent(MODULES_FILE, json, `feat: delete module ${id}`);
  revalidatePath("/skills");
  invalidateCache();

  return { success: true };
}

export async function reorderModules(
  newOrder: number[]
): Promise<{ success: boolean; error?: string }> {
  await checkAdminAccess();

  const modules = await getAllModules();
  const reordered: ModuleRecord[] = [];

  for (let i = 0; i < newOrder.length; i++) {
    const mod = modules.find((m) => m.id === newOrder[i]);
    if (mod) {
      reordered.push({ ...mod, order: i + 1 });
    }
  }

  const json = JSON.stringify(reordered, null, 2);
  await updateFileContent(MODULES_FILE, json, "feat: reorder modules");
  revalidatePath("/skills");
  invalidateCache();

  return { success: true };
}
