const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://localhost:4200/');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.locator('app-register-user').getByPlaceholder('Username').click();
  await page
    .locator('app-register-user')
    .getByPlaceholder('Username')
    .fill('DAV');
  await page
    .locator('app-register-user')
    .getByPlaceholder('Username')
    .press('Tab');
  await page
    .locator('app-register-user')
    .getByPlaceholder('Password')
    .fill('123qweasd');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.locator('app-register-user').getByPlaceholder('Password').click();
  await page
    .locator('app-register-user')
    .getByPlaceholder('Password')
    .fill('123qweas');
  await page.getByRole('button', { name: 'Register' }).click();
  await page
    .locator('p-splitbutton')
    .getByRole('button', { name: 'p' })
    .click();
  await page.locator('a').filter({ hasText: 'Sign out' }).click();
  await page.getByRole('button', { name: 'Register' }).click();
  await page.locator('app-register-user').getByPlaceholder('Username').click();
  await page
    .locator('app-register-user')
    .getByPlaceholder('Username')
    .fill('DADADA');
  await page.locator('.p-card').click();

  // ---------------------
  await context.close();
  await browser.close();
})();
