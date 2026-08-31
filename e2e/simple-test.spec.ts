import { test, expect } from '@playwright/test';

test.describe('Simple E2E Tests', () => {
  test('Teacher can login', async ({ page }) => {
    await page.goto('/teacher/login');
    await page.waitForLoadState('domcontentloaded');
    await page.fill('#email', 'teacher@test.com');
    await page.fill('#password', 'teacher123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/teacher/dashboard', { timeout: 15000 });
  });

  test('Teacher can create room and student can enter', async ({ browser }) => {
    test.setTimeout(120000);
    const teacherPage = await browser.newPage();
    await teacherPage.goto('/teacher/login');
    await teacherPage.waitForLoadState('domcontentloaded');
    await teacherPage.fill('#email', 'teacher@test.com');
    await teacherPage.fill('#password', 'teacher123');
    await teacherPage.click('button[type="submit"]');
    await expect(teacherPage).toHaveURL('/teacher/dashboard', { timeout: 15000 });

    await teacherPage.goto('/teacher/rooms/create');
    await teacherPage.waitForLoadState('domcontentloaded');
    await teacherPage.fill('input#name', 'Test Room');
    await teacherPage.click('button[type="submit"]');
    // Must match UUID pattern, NOT /rooms/create
    await teacherPage.waitForURL(/\/teacher\/rooms\/[0-9a-f]{8}-/, { timeout: 15000 });

    const codeElement = teacherPage.locator('span.font-mono.font-bold');
    await expect(codeElement).toBeVisible({ timeout: 15000 });
    const roomCode = (await codeElement.textContent())?.trim() || '';

    // Now login as student in a new context
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    await studentPage.goto('/student/enter');
    await studentPage.waitForLoadState('domcontentloaded');
    await studentPage.fill('#name', 'Test Student');
    await studentPage.fill('#code', roomCode);
    await studentPage.click('button[type="submit"]');
    await studentPage.waitForURL(/\/student\/rooms\/[0-9a-f]{8}-/, { timeout: 15000 });

    await expect(studentPage).toHaveURL(/\/student\/rooms\//);

    await studentContext.close();
    await teacherPage.close();
  });
});
