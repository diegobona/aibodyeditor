import { test, expect, type Page, type Route } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const PNG = readFileSync(resolve('apps/tanstack-app/public/favicon-32x32.png'));
const JOB = '89c2cd5c-1602-4b81-8d96-21b7a79be307';
const USER = 'body-edit-ui-fixture';
const SESSION = { session: { id: 'session-ui', token: 'fixture', userId: USER, expiresAt: '2099-01-01T00:00:00Z', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, user: { id: USER, name: 'Editor Test', email: 'ui@example.invalid', emailVerified: true, image: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
const success = (mode = 'slim', intensity = 70) => ({ jobId: JOB, status: 'succeeded', result: { imageUrl: '/api/body-edit/' + JOB + '/image', downloadUrl: '/api/body-edit/' + JOB + '/image?download=1', mode, intensity }, credits: { charged: 15, balance: 0 }, reused: false });
const json = (route: Route, body: unknown, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
const formOf = (route: Route) => new Request(route.request().url(), { method: 'POST', headers: { 'Content-Type': route.request().headers()['content-type'] }, body: route.request().postDataBuffer()! }).formData();
async function setup(page: Page, handler: (route: Route) => Promise<void>, signedIn = true) {
  await page.route('**/api/auth/**', route => json(route, route.request().url().includes('get-session') && signedIn ? SESSION : null));
  await page.context().route('**/api/body-edit**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/image')) return route.fulfill({ body: PNG, contentType: 'image/png', headers: { 'Cache-Control': 'private, no-store', ...(url.searchParams.has('download') ? { 'Content-Disposition': 'attachment; filename="edited.png"' } : {}) } });
    if (route.request().method() === 'GET' && url.pathname === '/api/body-edit' && !url.search) return json(route, { available: true, costCredits: 15, freeTrialEdits: 1 });
    return handler(route);
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Edit my photo', exact: true })).toBeEnabled();
}
async function upload(page: Page) { await page.getByLabel('Upload a photo to edit', { exact: true }).setInputFiles({ name: 'portrait.png', mimeType: 'image/png', buffer: PNG }); }
const editor = (page: Page) => page.locator('[data-body-editor]');
async function selectStrength(page: Page, target: number) {
  const slider = editor(page).getByRole('slider', { name: 'Intensity', exact: true });
  const current = Number(await slider.inputValue());
  const key = target > current ? 'ArrowRight' : 'ArrowLeft';
  for (let i = 0; i < Math.abs(target - current); i++) await slider.press(key);
  await expect(slider).toHaveValue(String(target));
}

test.describe('Actual editing UI contract (provider requests are mocked)', () => {
  test('continuous strength updates exact values and mode guidance without generating', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    let posts = 0;
    await setup(page, async route => { posts++; await json(route, success()); });
    const slider = editor(page).getByRole('slider', { name: 'Intensity', exact: true });
    await expect(slider).toHaveValue('70');
    await expect(slider).toHaveAttribute('min', '1');
    await expect(slider).toHaveAttribute('max', '100');
    await expect(slider).toHaveAttribute('step', '1');
    await selectStrength(page, 73);
    await expect(slider).toHaveAttribute('aria-valuetext', '73 out of 100');
    await editor(page).getByText('Muscle', { exact: true }).click();
    await expect(editor(page)).toContainText('Increase shoulder, arm and chest muscle definition and volume.');
    await expect(slider).toHaveValue('73');
    await slider.press('Home'); await expect(slider).toHaveValue('1');
    await slider.press('End'); await expect(slider).toHaveValue('100');
    const box = await slider.boundingBox();
    await page.mouse.click(box!.x + box!.width * 0.4, box!.y + box!.height / 2);
    expect(Number(await slider.inputValue())).toBeGreaterThan(25);
    expect(Number(await slider.inputValue())).toBeLessThan(55);
    expect(posts).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.screenshot({ path: 'test-results/body-intensity-mobile.png' });
  });
  for (const [mode, label] of [['slim','Slim'], ['muscle','Muscle'], ['proportions','Proportions'], ['breast','Breast']]) {
    test(label + ' sends the image and settings, then offers comparison and private download', async ({ page }) => {
      const requests: FormData[] = [];
      await setup(page, async route => { expect(route.request().method()).toBe('POST'); requests.push(await formOf(route)); await json(route, success(mode, 37)); });
      await upload(page);
      await editor(page).getByText(label, { exact: true }).click();
      await selectStrength(page, 37);
      await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
      await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
      expect(requests).toHaveLength(1);
      expect(requests[0].get('mode')).toBe(mode); expect(requests[0].get('intensity')).toBe('37');
      expect(requests[0].get('requestId')).toMatch(/^[0-9a-f-]{36}$/);
      expect(requests[0].has('prompt')).toBe(false);
      expect(Buffer.from(await (requests[0].get('image') as File).arrayBuffer())).toEqual(PNG);
      await expect(editor(page).getByRole('slider', { name: 'Compare your original and edited photo' })).toBeVisible();
      await expect.poll(() => editor(page).getByRole('img', { name: 'AI-edited result of your selected photo', exact: true })
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0)).toBe(true);
      const downloadEvent = page.waitForEvent('download');
      await editor(page).getByRole('link', { name: 'Download photo' }).click();
      const download = await downloadEvent; expect(download.suggestedFilename()).toMatch(/\.png$/);
      await editor(page).getByRole('button', { name: 'Edit another photo' }).click();
      await expect(page.getByLabel('Upload a photo to edit', { exact: true })).toBeAttached();
    });
  }
  test('pending edits lock settings and repeated clicks while status polling completes', async ({ page }) => {
    let posts = 0, statusCalls = 0;
    await setup(page, async route => {
      if (route.request().method() === 'POST') { posts++; await json(route, { jobId: JOB, status: 'processing', retryAfterSeconds: 1 }, 202); }
      else { statusCalls++; await json(route, success()); }
    });
    await upload(page);
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByText('Editing your photo…')).toBeVisible();
    await expect(editor(page).getByRole('radio', { name: 'Breast', exact: true })).toBeDisabled();
    await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toBeDisabled();
    await expect(editor(page).getByRole('button', { name: 'Edit my photo', exact: true })).toBeDisabled();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    expect(posts).toBe(1); expect(statusCalls).toBe(1);
  });
  test('a failed result image GET recovers without collapsing or generating again', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    let posts = 0, imageGets = 0;
    await page.route('**/api/body-edit/*/image*', async route => {
      imageGets++;
      // Nitro dev treats an <img> request as a static asset and skips this private API.
      // The result viewer must use an authenticated fetch, then display its blob URL.
      if (route.request().resourceType() !== 'fetch') return json(route, { error: { code: 'NOT_FOUND' } }, 404);
      if (imageGets === 1) return json(route, { error: { code: 'INTERNAL_ERROR' } }, 500);
      await route.fulfill({ body: PNG, contentType: 'image/png', headers: { 'Cache-Control': 'private, no-store' } });
    });
    await setup(page, async route => { posts++; await json(route, success()); });
    await upload(page);
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    const resultImage = editor(page).locator('img[alt="AI-edited result of your selected photo"]');
    await expect.poll(() => resultImage.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 7000 }).toBeGreaterThan(0);
    expect(await resultImage.evaluate(img => img.parentElement!.getBoundingClientRect().height)).toBeGreaterThanOrEqual(256);
    await expect(editor(page).getByRole('slider', { name: 'Compare your original and edited photo' })).toBeVisible();
    expect(posts).toBe(1); expect(imageGets).toBe(2);
  });
  test('persistent preview failure offers a bounded manual reload without another edit', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    let posts = 0, imageGets = 0, recover = false;
    const imageRequests: string[] = [];
    await page.route('**/api/body-edit/*/image*', async route => {
      imageGets++;
      imageRequests.push(`${Date.now()} ${route.request().resourceType()} ${route.request().method()} ${route.request().url()}`);
      if (!recover) return json(route, { error: { code: 'INTERNAL_ERROR' } }, 200);
      await route.fulfill({ body: PNG, contentType: 'image/png' });
    });
    await setup(page, async route => { posts++; await json(route, success()); });
    await upload(page);
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByRole('button', { name: 'Reload image', exact: true })).toBeVisible({ timeout: 8000 });
    await expect(editor(page).getByRole('alert')).toContainText('Your edit is saved');
    expect(imageGets, imageRequests.join('\n')).toBe(3);
    expect(await editor(page).locator('[data-result-frame]').evaluate(el => el.getBoundingClientRect().height)).toBe(320);
    await expect(editor(page).getByRole('slider')).toHaveCount(0);
    recover = true;
    await editor(page).getByRole('button', { name: 'Reload image', exact: true }).click();
    await expect(editor(page).getByRole('slider', { name: 'Compare your original and edited photo' })).toBeVisible();
    expect(imageGets).toBe(4); expect(posts).toBe(1);
    await expect(editor(page).getByRole('img', { name: 'Original photo selected for this edit', exact: true })).toBeVisible();
  });
  test('a slow result reserves the preview area until the image is decoded', async ({ page }) => {
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/api/body-edit/*/image*', async route => {
      await held;
      await route.fulfill({ body: PNG, contentType: 'image/png' });
    });
    try {
      await setup(page, route => json(route, success()));
      await upload(page);
      await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
      await expect(editor(page).getByText('Loading your edited photo…', { exact: true })).toBeVisible();
      expect(await editor(page).locator('[data-result-frame]').evaluate(el => el.getBoundingClientRect().height)).toBe(420);
      await expect(editor(page).getByRole('slider')).toHaveCount(0);
      release();
      await expect(editor(page).getByRole('slider', { name: 'Compare your original and edited photo' })).toBeVisible();
    } finally { release(); }
  });
  test('ambiguous server failures preserve the request ID when checking again', async ({ page }) => {
    const ids: string[] = [];
    const strengths: string[] = [];
    await setup(page, async route => {
      const form = await formOf(route); ids.push(String(form.get('requestId')));
      strengths.push(String(form.get('intensity')));
      await json(route, ids.length === 1 ? { error: { code: 'INTERNAL_ERROR' } } : success(), ids.length === 1 ? 500 : 200);
    });
    await upload(page); await selectStrength(page, 73);
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByRole('radio', { name: 'Muscle', exact: true })).toBeDisabled();
    await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toBeDisabled();
    await editor(page).getByRole('button', { name: 'Check edit status' }).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    expect(ids).toHaveLength(2); expect(ids[1]).toBe(ids[0]);
    expect(strengths).toEqual(['73', '73']);
  });
  test('reload finds the paid request even if the POST never returned its job ID', async ({ page }) => {
    let id = '', posts = 0, lookedUp = '';
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    await setup(page, async route => {
      if (route.request().method() === 'POST') {
        posts++; id = String((await formOf(route)).get('requestId'));
        await held; await json(route, success()).catch(() => undefined);
      } else { lookedUp = new URL(route.request().url()).searchParams.get('requestId') ?? ''; await json(route, success()); }
    });
    await upload(page); await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect.poll(() => id).not.toBe('');
    await page.reload();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    expect(lookedUp).toBe(id); expect(posts).toBe(1); release();
    await expect(editor(page).getByRole('link', { name: 'Download photo' })).toBeVisible();
  });
  test('a refunded provider failure allows a fresh explicit attempt', async ({ page }) => {
    const ids: string[] = [];
    await setup(page, async route => {
      ids.push(String((await formOf(route)).get('requestId')));
      await json(route, ids.length === 1 ? { jobId: JOB, error: { code: 'UPSTREAM_ERROR', refunded: true } } : success(), ids.length === 1 ? 502 : 200);
    });
    await upload(page); await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByRole('alert')).toContainText('The credits for this edit were returned.');
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    expect(ids[0]).not.toBe(ids[1]);
  });
  test('insufficient credits is visible without losing the selected photo', async ({ page }) => {
    await setup(page, route => json(route, { error: { code: 'INSUFFICIENT_CREDITS' } }, 402));
    await upload(page); const preview = editor(page).getByRole('img', { name: 'Preview of the photo you selected' });
    const source = await preview.getAttribute('src');
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByRole('alert')).toContainText('You need more credits for this edit.');
    await expect(preview).toHaveAttribute('src', source!);
  });
  test('samples send only the original portrait half', async ({ page }) => {
    let dimensions: { width?: number; height?: number } | undefined;
    await setup(page, async route => { const form = await formOf(route); dimensions = await sharp(Buffer.from(await (form.get('image') as File).arrayBuffer())).metadata(); await json(route, success()); });
    await page.locator('#samples').getByRole('link', { name: 'Preview Slim', exact: true }).click();
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    expect(dimensions).toMatchObject({ width: 768, height: 1024 });
  });
  test('anonymous submission opens sign in and keeps photo, mode and strength', async ({ page }) => {
    let posts = 0;
    await setup(page, async route => { posts++; await route.abort(); }, false);
    await upload(page); await editor(page).getByText('Breast', { exact: true }).click();
    await selectStrength(page, 93);
    const source = await editor(page).getByRole('img').getAttribute('src');
    await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText('Your selected photo will stay here while you sign in.');
    await expect(page.getByRole('dialog').getByRole('link', { name: 'Sign up', exact: true })).toHaveAttribute('target', '_blank');
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(editor(page).getByRole('img')).toHaveAttribute('src', source!);
    await expect(editor(page).getByRole('radio', { name: 'Breast', exact: true })).toBeChecked();
    await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('93');
    expect(posts).toBe(0);
    await page.screenshot({ path: 'test-results/live-body-editing/homepage.png' });
  });
});
