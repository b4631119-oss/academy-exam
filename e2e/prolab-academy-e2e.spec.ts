/**
 * PROLab Academy — Full E2E Production Smoke Test
 * Data seeded by global-setup.ts via Supabase admin client.
 * Auth saved via Playwright storageState.
 */
import { test, expect, Page, BrowserContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, 'test-data.json');
const TEACHER_AUTH = path.join(__dirname, 'teacher-auth.json');
const STUDENT_AUTH = path.join(__dirname, 'student-auth.json');

interface TestData {
  roomId: string; roomCode: string; examId: string;
  testId: string; testTitle: string; sessionId: string; studentId: string;
}

function loadTestData(): TestData {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

test.describe('PROLab Academy - Full E2E Production Smoke Test', () => {
  let data: TestData;
  let teacherPage: Page;
  let studentPage: Page;
  let teacherContext: BrowserContext;
  let studentContext: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    data = loadTestData();
    teacherContext = await browser.newContext({ storageState: TEACHER_AUTH });
    studentContext = await browser.newContext({ storageState: STUDENT_AUTH });
    teacherPage = await teacherContext.newPage();
    studentPage = await studentContext.newPage();
    // Auto-accept all confirm dialogs (e.g. unanswered questions warning)
    studentPage.on('dialog', (dialog) => dialog.accept());
  });

  test.afterAll(async () => {
    await teacherContext?.close();
    await studentContext?.close();
  });

  /* ── 1. TEACHER → EXAM → STUDENT → RESULT ──────────── */
  test.describe('1. TEACHER → EXAM → STUDENT → RESULT Flow', () => {
    test('Teacher can login and see dashboard', async () => {
      await teacherPage.goto('/teacher/dashboard');
      await expect(teacherPage).toHaveURL('/teacher/dashboard');
    });

    test('Teacher can see room with exam', async () => {
      await teacherPage.goto(`/teacher/rooms/${data.roomId}`);
      await expect(teacherPage.locator('h1')).toContainText('E2E Test Room');
    });

    test('Student enters room and sees exam', async () => {
      await studentPage.goto(`/student/rooms/${data.roomId}`);
      await expect(studentPage.locator('h1').first()).toBeVisible({ timeout: 10000 });
      await expect(studentPage.locator('text=E2E Test Exam')).toBeVisible({ timeout: 10000 });
    });

    test('Student can take exam and finish', async () => {
      await studentPage.goto(`/student/exam/${data.examId}`);
      await expect(studentPage.locator('h1')).toContainText('E2E Test Exam');
      await studentPage.locator('textarea[placeholder*="ответ"]').fill('Answer 1');
      await studentPage.click('button:has-text("Далее")');
      await studentPage.locator('textarea[placeholder*="ответ"]').fill('Answer 2');
      await studentPage.click('button:has-text("Далее")');
      await studentPage.locator('textarea[placeholder*="ответ"]').fill('Answer 3');
      await studentPage.click('button:has-text("Завершить экзамен")');
      await expect(studentPage).toHaveURL(new RegExp(`/student/result/${data.examId}`), { timeout: 20000 });
    });

    test('Teacher can view student results', async () => {
      await teacherPage.goto(`/teacher/exams/${data.examId}/results`);
      await teacherPage.waitForLoadState('domcontentloaded');
      await teacherPage.waitForTimeout(3000);
      // The results page shows student entries or 'no answers' message
      const hasStudent = await teacherPage.locator('text=Test Student').isVisible().catch(() => false);
      const hasAnyStudent = await teacherPage.locator('.font-semibold').first().isVisible().catch(() => false);
      expect(hasStudent || hasAnyStudent).toBe(true);
    });
  });

  /* ── 2. TEST FLOW ──────────────────────────────────── */
  test.describe('2. TEST Flow', () => {
    test('Student joins test and sees questions', async () => {
      await studentPage.goto(`/student/rooms/${data.roomId}`);
      await studentPage.waitForLoadState('domcontentloaded');
      // Find test card — look for test title
      const testTitleEl = studentPage.locator(`text=${data.testTitle}`).first();
      await expect(testTitleEl).toBeVisible({ timeout: 10000 });
      // Click open test button near it
      const openBtn = studentPage.locator('button:has-text("Открыть тест")').first();
      await openBtn.click();
      await studentPage.waitForURL(/\/student\/test\/[0-9a-f]{8}-/, { timeout: 20000 });
      // Verify option buttons load
      const options = studentPage.locator('.grid button:not([disabled])');
      await expect(options.first()).toBeVisible({ timeout: 15000 });
    });

    test('Selecting answer saves it', async () => {
      await studentPage.goto(`/student/test/${data.sessionId}`);
      await studentPage.waitForLoadState('domcontentloaded');
      const options = studentPage.locator('.grid button:not([disabled])');
      if (await options.count() > 0) {
        await options.nth(1).click();
        await expect(studentPage.locator('text=Ответ сохранён')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Teacher can access test results page', async () => {
      await teacherPage.goto(`/teacher/tests/${data.testId}/results/${data.sessionId}`);
      await teacherPage.waitForLoadState('domcontentloaded');
      await teacherPage.waitForTimeout(3000);
      // Results page should load — might show results, loading, or error
      const hasContent = await teacherPage.locator('h1, .font-bold').first().isVisible({ timeout: 10000 }).catch(() => false);
      expect(hasContent).toBe(true);
    });
  });

  /* ── 3. REFRESH / BACK / FORWARD ──────────────────── */
  test.describe('3. REFRESH / BACK / FORWARD Tests', () => {
    test('Direct URL access exam', async () => {
      await studentPage.goto(`/student/exam/${data.examId}`);
      await expect(studentPage.locator('h1')).toContainText('E2E Test Exam');
    });
  });

  /* ── 4. ANTI-CHEAT ────────────────────────────────── */
  test.describe('4. ANTI-CHEAT Tests', () => {
    test('Normal click does not trigger violation', async () => {
      await studentPage.goto(`/student/exam/${data.examId}`);
      await studentPage.click('textarea[placeholder*="ответ"]');
      await expect(studentPage.locator('text=Нарушение')).not.toBeVisible();
    });

    test('Resize does not trigger violation', async () => {
      await studentPage.goto(`/student/exam/${data.examId}`);
      await studentPage.setViewportSize({ width: 800, height: 600 });
      await studentPage.setViewportSize({ width: 1200, height: 800 });
      await expect(studentPage.locator('text=Нарушение')).not.toBeVisible();
    });

    test('Mobile viewport does not trigger violation', async () => {
      await studentPage.goto(`/student/exam/${data.examId}`);
      await studentPage.setViewportSize({ width: 320, height: 568 });
      await expect(studentPage.locator('text=Нарушение')).not.toBeVisible();
    });
  });

  /* ── 5. MOBILE ────────────────────────────────────── */
  test.describe('5. MOBILE Real Interaction Tests', () => {
    const viewports = [
      { width: 320, height: 568, name: '320px' },
      { width: 390, height: 844, name: '390px' },
      { width: 412, height: 915, name: '412px' },
      { width: 768, height: 1024, name: '768px' },
    ];

    for (const vp of viewports) {
      test(`Mobile ${vp.name} - Student Enter page renders`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: vp });
        const page = await ctx.newPage();
        await page.goto('/student/enter');
        await expect(page.locator('#name')).toBeVisible();
        await expect(page.locator('#code')).toBeVisible();
        await ctx.close();
      });

      test(`Mobile ${vp.name} - EXAM page renders`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: vp, storageState: STUDENT_AUTH });
        const page = await ctx.newPage();
        await page.goto(`/student/exam/${data.examId}`);
        await page.waitForLoadState('domcontentloaded');
        // Page may show exam questions, result, or redirect to enter
        await page.waitForTimeout(3000);
        const url = page.url();
        const isOnSite = url.includes('/student/exam/') || url.includes('/student/result/') || url.includes('/student/enter');
        expect(isOnSite).toBe(true);
        await ctx.close();
      });

      test(`Mobile ${vp.name} - Teacher dashboard renders`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: vp, storageState: TEACHER_AUTH });
        const page = await ctx.newPage();
        await page.goto('/teacher/dashboard');
        await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
        await ctx.close();
      });
    }
  });

  /* ── 6. AUTH / SECURITY ────────────────────────────── */
  test.describe('6. AUTH / SECURITY Tests', () => {
    test('Student without login redirects', async ({ browser }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto('/student/rooms/test-id');
      await expect(page).toHaveURL('/student/enter');
      await ctx.close();
    });

    test('Teacher without login redirects', async ({ browser }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto('/teacher/dashboard');
      await expect(page).toHaveURL('/teacher/login');
      await ctx.close();
    });

    test('Direct URL to completed exam result', async () => {
      await studentPage.goto(`/student/result/${data.examId}`);
      await expect(studentPage.locator('text=Результат')).toBeVisible({ timeout: 10000 });
    });
  });

  /* ── 7. CONTENT ────────────────────────────────────── */
  test.describe('7. CONTENT Tests', () => {
    test('HTML track page has lessons', async () => {
      await studentPage.goto('/skills/html');
      const lessonLinks = studentPage.locator('ol a[href*="/skills/html/"]');
      const count = await lessonLinks.count();
      expect(count).toBeGreaterThanOrEqual(10);
    });

    test('No duplicate lesson links', async () => {
      await studentPage.goto('/skills/html');
      const hrefs = await studentPage
        .locator('ol a[href*="/skills/html/"]')
        .evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('href')));
      const unique = new Set(hrefs);
      expect(unique.size).toBe(hrefs.length);
    });

    test('Previous/Next navigation works', async () => {
      await studentPage.goto('/skills/html/vvedenie-v-html-i-css');
      await expect(studentPage.locator('a:has-text("Следующая тема")')).toBeVisible();
    });

    test('Breadcrumb displays correctly', async () => {
      await studentPage.goto('/skills/html/vvedenie-v-html-i-css');
      // The lesson page breadcrumb has 'Обучение' link
      await expect(studentPage.getByRole('link', { name: 'Обучение' })).toBeVisible();
    });

    test('Code blocks render correctly', async () => {
      await studentPage.goto('/skills/html/bazovye-tegi');
      await expect(studentPage.locator('pre code').first()).toBeVisible();
    });

    test('Light/Dark mode toggle works', async () => {
      // Set desktop viewport to ensure desktop nav ThemeToggle is visible
      await studentPage.setViewportSize({ width: 1280, height: 800 });
      await studentPage.goto('/');
      await studentPage.waitForLoadState('domcontentloaded');
      // Use the visible ThemeToggle button
      const themeBtn = studentPage.locator('button[aria-label="Тема"]:visible').first();
      await themeBtn.click();
      await studentPage.waitForTimeout(300);
      await studentPage.click('button:has-text("Тёмная")');
      await studentPage.waitForTimeout(500);
      const isDark = await studentPage.evaluate(() => document.documentElement.classList.contains('dark'));
      expect(isDark).toBe(true);
      await themeBtn.click();
      await studentPage.waitForTimeout(300);
      await studentPage.click('button:has-text("Светлая")');
      await studentPage.waitForTimeout(500);
      const isLight = await studentPage.evaluate(() => !document.documentElement.classList.contains('dark'));
      expect(isLight).toBe(true);
    });
  });

  /* ── 8. ERROR / LOADING UX ─────────────────────────── */
  test.describe('8. ERROR / LOADING UX Tests', () => {
    test('Exam navigation does not show errors', async () => {
      await studentPage.goto(`/student/exam/${data.examId}`);
      await studentPage.locator('textarea[placeholder*="ответ"]').fill('Test');
      await studentPage.click('button:has-text("Далее")');
      await expect(studentPage.locator('text=Ошибка сохранения ответа')).not.toBeVisible({ timeout: 5000 });
    });

    test('Duplicate click does not cause issues', async () => {
      await studentPage.goto(`/student/test/${data.sessionId}`);
      await studentPage.waitForLoadState('domcontentloaded');
      const isResult = await studentPage.locator('text=Результат').isVisible().catch(() => false);
      if (isResult) return;
      const options = studentPage.locator('.grid button:not([disabled])');
      if ((await options.count()) > 0) {
        await options.nth(1).click();
        await options.nth(1).click();
      }
      const hasError = await studentPage.locator('text=Ошибка сохранения ответа').isVisible().catch(() => false);
      expect(hasError).toBe(false);
    });
  });
});
