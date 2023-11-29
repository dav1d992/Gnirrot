import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('https://localhost:4200/');
});

test('Login', async ({ page }) => {
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('LIS');
  await page.getByPlaceholder('Username').press('Tab');
  await page.getByPlaceholder('Password').fill('Pa$$w0rd');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('menuitem', { name: ' Members' }).click();
  // ---------------------
  page.close();
});
