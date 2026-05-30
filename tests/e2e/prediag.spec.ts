import { test, expect, type Page } from '@playwright/test';

// Skip the first-visit language gate by pre-setting its cookie.
async function setGateCookie(page: Page) {
  await page.context().addCookies([
    { name: 'aman_gate_seen', value: '1', url: 'http://localhost:3000' },
  ]);
}

test.describe('Home', () => {
  test('loads the localized home with hero CTA', async ({ page }) => {
    await setGateCookie(page);
    await page.goto('/fr');
    await expect(page.locator('h1.disp')).toContainText('Sécurisez votre projet');
    await expect(page.getByRole('link', { name: /pré-diagnostic gratuit/i }).first()).toBeVisible();
  });

  test('renders Arabic in RTL', async ({ page }) => {
    await setGateCookie(page);
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});

test.describe('Pre-diagnosis', () => {
  test('green path: answer 10 questions → lead capture → verdict', async ({ page }) => {
    await setGateCookie(page);
    await page.goto('/fr/pre-diagnostic');

    // Intro → start
    await page.getByRole('button', { name: /commencer le test/i }).click();

    // Answer all 10 questions by picking the first option (the compliant one).
    for (let i = 0; i < 10; i++) {
      await expect(page.locator('.qcount')).toContainText(`${i + 1} / 10`);
      await page.locator('.opt').first().click();
      // Auto-advances after a short delay.
      await page.waitForTimeout(320);
    }

    // Lead capture screen.
    await expect(page.locator('#pd-nom')).toBeVisible();
    await page.locator('#pd-nom').fill('Test Visiteur');
    await page.locator('#pd-tel').fill('0612345678');

    const submit = page.getByRole('button', { name: /voir mon verdict/i });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Server-computed verdict (all compliant → 🟢 Bon signe).
    await expect(page.locator('.verdict .vbig')).toContainText('Bon signe', { timeout: 15_000 });
    await expect(page.locator('.verdict')).toHaveClass(/v-green/);
  });
});
