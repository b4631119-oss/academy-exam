const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/register');
  await page.fill('#email', 'teacher@test.com');
  await page.fill('#password', 'teacher123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('/teacher/dashboard', { timeout: 10000 });
  console.log('Teacher registered successfully!');
  
  await browser.close();
})();
