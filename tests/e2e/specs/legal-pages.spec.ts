import { test, expect } from '@playwright/test';

const pages = [
  { path: '/privacy', title: 'Privacy Policy', detail: 'Rabbit API gateway' },
  { path: '/terms', title: 'Terms of Service', detail: 'You must be at least 18 years old.' },
  { path: '/deletion', title: 'Image deletion and retention', detail: 'What Clear photo does' },
];

test('policy pages have SSR content, canonicals, sitemap entries and working footer navigation', async ({ page, request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const item of pages) {
    const response = await request.get(item.path); expect(response.status()).toBe(200);
    const html = await response.text(); expect(html).toContain(item.title); expect(html).toContain(item.detail);
    expect((html.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);
    expect(html).not.toMatch(/\{(?:days|operator|guestDays)\}/);
    expect(html).toContain('mailto:zw83716@gmail.com');
    expect(sitemap).toContain('https://aibodyeditor.net' + item.path);
    await page.goto(item.path);
    await expect(page.getByRole('heading', { name: item.title, exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://aibodyeditor.net' + item.path);
    for (const link of pages) await expect(page.locator('footer').getByRole('link', { name: link.title, exact: true })).toHaveAttribute('href', link.path);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: 'test-results/deletion-policy-mobile.png' });
});

test('auth notices link to actual policy pages instead of placeholders', async ({ request }) => {
  for (const path of ['/signin', '/signup', '/forgot-password']) {
    const response = await request.get(path); expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('href="/terms"'); expect(html).toContain('href="/privacy"');
    expect(html).not.toContain('href="#"');
  }
});
