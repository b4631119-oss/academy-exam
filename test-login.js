const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/teacher/login');
  await page.fill('#email', 'teacher@test.com');
  await page.fill('#password', 'teacher123');
  await page.click('button[type="submit"]');
  
  await page.waitForLoadState('networkidle');
  const url = page.url();
  console.log('URL after login:', url);
  
  if (url.includes('/teacher/dashboard')) {
    console.log('Teacher login successful!');
  } else {
    console.log('Login failed - not on dashboard');
  }
  
  await browser.close();
})();
