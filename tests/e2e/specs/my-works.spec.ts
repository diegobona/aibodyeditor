import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createAndSignIn } from '../helpers/auth';

test('My works requires login', async ({ page, request }) => {
  expect((await request.get('/api/body-edit/history')).status()).toBe(401);
  await page.goto('/my-works'); await expect(page).toHaveURL(/\/signin/);
});

test('saved results can be viewed, downloaded and deleted with confirmation, with empty and retry states', async ({ page }) => {
  await createAndSignIn(page, { name: 'E2E My Works', email: `e2e-works-${Date.now()}@example.com`, password: 'WorksFixture-2026!pass' });
  try {
  const ownerId = (await (await page.request.get('/api/auth/get-session')).json()).user.id as string;
  const id = '71000000-0000-4000-8000-000000000001';
  let items = [{ id, mode: 'breast', intensity: 70, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 86_400_000).toISOString(), imageUrl: `/api/body-edit/${id}/image`, downloadUrl: `/api/body-edit/${id}/image?download=1` }];
  let deleted = 0, fail = false, generated = 0;
  const image = readFileSync(resolve('apps/tanstack-app/public/favicon-32x32.png'));
  await page.route('**/api/body-edit**', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname.endsWith('/account')) return route.fulfill({ json: { ownerId, balance: 20, bonusGranted: false, welcomeCredits: 10 } });
    if (request.method() === 'POST') { generated++; return route.abort(); }
    if (url.pathname === '/api/body-edit/history') return route.fulfill(fail ? { status: 503, json: { error: { code: 'INTERNAL_ERROR' } } } : { json: { items, hasMore: false, retentionDays: 30 } });
    if (request.method() === 'DELETE') { deleted++; items = []; return route.fulfill({ json: { deleted: true } }); }
    if (url.pathname.endsWith('/image')) return route.fulfill({ contentType: 'image/png', body: image });
    if (url.pathname === '/api/body-edit') return route.fulfill({ json: { available: true, costCredits: 10, freeTrialEdits: 1, guestTrialEdits: 1 } });
    if (url.pathname === '/api/body-edit/' + id) return route.fulfill({ json: { jobId: id, status: 'succeeded', result: { imageUrl: `/api/body-edit/${id}/image`, mode: 'breast', intensity: 70 }, credits: { charged: 10, balance: 20 } } });
    return route.continue();
  });
  await page.goto('/my-works');
  await expect(page.getByRole('heading', { name: 'My works', exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('[data-work-id]')).toHaveCount(1);
  await expect(page.getByText('Intensity 70/100', { exact: true })).toBeVisible();
  const specifications = page.locator('[data-work-id] [data-image-details]');
  await expect(specifications).toContainText('32 × 32 px · PNG');
  await expect(specifications).toHaveAttribute('data-byte-length', String(image.length));
  await page.getByRole('button', { name: 'View image', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('[data-image-details]')).toHaveText(await specifications.innerText());
  await page.keyboard.press('Escape');
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download', exact: true }).click();
  const downloaded = await download; expect(downloaded.suggestedFilename()).toContain(id);
  expect(readFileSync((await downloaded.path())!)).toEqual(image);
  await page.getByRole('button', { name: 'Continue editing', exact: true }).click();
  await expect(page).toHaveURL(/\/#try$/);
  await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'generated');
  await expect(page.locator('input[type="radio"][value="breast"]')).toBeChecked();
  await expect(page.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('70');
  await expect(page.locator('#hero-showcase img')).toHaveCount(0);
  expect(generated).toBe(0); expect(deleted).toBe(0);
  await page.goto('/my-works');
  await expect(page.locator('[data-work-id]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click(); expect(deleted).toBe(0);
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByText('No saved edits yet', { exact: true })).toBeVisible(); expect(deleted).toBe(1);
  fail = true; await page.reload(); await expect(page.getByRole('alert')).toContainText('Your works couldn’t load');
  fail = false; await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.getByText('No saved edits yet', { exact: true })).toBeVisible(); expect(generated).toBe(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/my-works-mobile.png' });
  } finally {
    await page.request.post('/api/auth/delete-user', { data: { password: 'WorksFixture-2026!pass' }, headers: { Origin: 'http://localhost:7001' } });
  }
});
