import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const id = '71000000-0000-4000-8000-000000000001';
const ownerId = 'history-continuation-fixture';
const png = readFileSync('apps/tanstack-app/public/favicon-32x32.png');

async function fixture(page: Page, balance = 10, fail = false, options: { photo?: Buffer; realAnalysis?: boolean } = {}) {
  const state = { balance, fail, posts: [] as FormData[], imageReads: 0 };
  await page.addInitScript(({ id, ownerId }) => {
    if (!sessionStorage.getItem('handoff-fixture-seeded')) {
      sessionStorage.setItem('handoff-fixture-seeded', '1');
      sessionStorage.setItem('body-editor-continue-work', JSON.stringify({ jobId: id, ownerId, createdAt: Date.now() }));
    }
  }, { id, ownerId });
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname.startsWith('/api/auth/')) return route.fulfill({ json: { session: { id: 'history-session', userId: ownerId, expiresAt: '2099-01-01T00:00:00Z' }, user: { id: ownerId, name: 'History fixture', email: 'history@example.invalid', emailVerified: true } } });
    if (url.pathname === '/api/body-edit/account') return route.fulfill({ json: { ownerId, balance: state.balance, bonusGranted: false, welcomeCredits: 10 } });
    if (url.pathname === '/api/body-edit/guest-session') return route.fulfill({ json: { ownerId: 'guest:history', remaining: 0 } });
    if (url.pathname === '/api/body-edit' && request.method() === 'GET') return route.fulfill({ json: { available: true, costCredits: 10, freeTrialEdits: 1 } });
    if (url.pathname === '/api/body-edit/' + id) return route.fulfill({ json: { jobId: id, status: 'succeeded', result: { imageUrl: `/api/body-edit/${id}/image`, downloadUrl: `/api/body-edit/${id}/image?download=1`, mode: 'breast', intensity: 83 }, credits: { charged: 10, balance: state.balance } } });
    if (url.pathname === `/api/body-edit/${id}/image`) {
      state.imageReads++;
      if (url.searchParams.get('continue') === '1' && state.balance < 10) return route.fulfill({ status: 402, json: { error: { code: 'INSUFFICIENT_CREDITS' } } });
      return route.fulfill(state.fail ? { status: 404, json: { error: { code: 'NOT_FOUND' } } } : { contentType: 'image/png', body: options.photo ?? png });
    }
    if (url.pathname === '/api/body-edit' && request.method() === 'POST') {
      state.posts.push(await new Request(request.url(), { method: 'POST', headers: request.headers(), body: request.postDataBuffer()! }).formData());
      state.balance -= 10;
      return route.fulfill({ json: { jobId: id, status: 'succeeded', result: { imageUrl: `/api/body-edit/${id}/image`, downloadUrl: `/api/body-edit/${id}/image?download=1`, mode: 'muscle', intensity: 100 }, credits: { charged: 10, balance: state.balance } } });
    }
    if (url.pathname === '/body-preview/worker.js' && !options.realAnalysis) return route.fulfill({ contentType: 'application/javascript', body: "self.onmessage=()=>self.postMessage({type:'error',code:'NO_PERSON'});" });
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) throw new Error('Unexpected mutation: ' + url.pathname);
    return route.continue();
  });
  await page.goto('/#try');
  return state;
}

test('saved work becomes the left input with server settings; only explicit generation sends its exact bytes', async ({ page }) => {
  const state = await fixture(page);
  const editor = page.locator('[data-body-editor]');
  await expect(editor).toHaveAttribute('data-photo-source', 'generated');
  await expect(page.locator('input[type="radio"][value="breast"]')).toBeChecked();
  await expect(page.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('83');
  await expect(editor.locator('textarea')).toHaveValue('');
  await expect(page.locator('#hero-showcase img')).toHaveCount(0);
  await expect(editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toBeVisible();
  expect(state.posts).toHaveLength(0);
  expect(await page.evaluate(() => sessionStorage.getItem('body-editor-continue-work'))).toBeNull();
  await editor.getByRole('radio', { name: 'Muscle', exact: true }).check({ force: true });
  await page.getByRole('slider', { name: 'Intensity', exact: true }).press('End');
  await editor.getByRole('button', { name: 'Extra instructions (optional)', exact: true }).click();
  await editor.locator('textarea').fill('Keep my pose unchanged.');
  const original = await editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true }).getAttribute('src');
  await editor.getByRole('button', { name: 'Edit Photo', exact: true }).click();
  await expect(editor.getByRole('button', { name: 'Get credits', exact: true })).toBeVisible();
  expect(state.posts).toHaveLength(1);
  expect(state.posts[0].get('mode')).toBe('muscle'); expect(state.posts[0].get('intensity')).toBe('100');
  expect(Buffer.from(await (state.posts[0].get('image') as File).arrayBuffer())).toEqual(png);
  await editor.getByRole('button', { name: 'Clear result', exact: true }).click();
  await expect(page.locator('#hero-showcase img')).toHaveCount(0);
  await expect(editor.getByRole('button', { name: 'Clear result', exact: true })).toHaveCount(0);
  await expect(editor.getByRole('link', { name: 'Download photo', exact: true })).toHaveCount(0);
  await expect(editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toHaveAttribute('src', original!);
  await expect(page.locator('input[type="radio"][value="muscle"]')).toBeChecked();
  await expect(page.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('100');
  await expect(editor.locator('textarea')).toHaveValue('Keep my pose unchanged.');
  expect(await page.evaluate(() => sessionStorage.getItem('body-editor-job'))).toBeNull();
  expect(state.posts).toHaveLength(1); expect(state.balance).toBe(0);
});

test('clearing the original preserves the result and each clear action remains independent', async ({ page }) => {
  const state = await fixture(page, 20);
  const editor = page.locator('[data-body-editor]');
  await expect(editor).toHaveAttribute('data-photo-source', 'generated');
  await editor.getByRole('button', { name: 'Extra instructions (optional)', exact: true }).click();
  await editor.locator('textarea').fill('Keep the same pose.');
  await editor.getByRole('button', { name: 'Edit Photo', exact: true }).click();
  const result = editor.getByRole('img', { name: 'AI-edited result of your selected photo', exact: true });
  await expect(result).toBeVisible();
  const resultUrl = await result.getAttribute('src');
  await editor.getByRole('button', { name: 'Clear photo', exact: true }).click();
  await expect(editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toHaveCount(0);
  await expect(editor).toHaveAttribute('data-photo-source', 'empty');
  await expect(result).toHaveAttribute('src', resultUrl!);
  await expect(editor.getByRole('link', { name: 'Download photo', exact: true })).toBeVisible();
  await expect(editor.getByRole('button', { name: 'Continue editing', exact: true })).toBeVisible();
  await expect(page.locator('input[type="radio"][value="breast"]')).toBeChecked();
  await expect(page.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('83');
  await expect(editor.locator('textarea')).toHaveValue('Keep the same pose.');
  expect(await page.evaluate(() => sessionStorage.getItem('body-editor-job'))).not.toBeNull();
  await editor.getByRole('button', { name: 'Clear result', exact: true }).click();
  await expect(result).toHaveCount(0);
  await expect(editor.getByRole('button', { name: 'Clear result', exact: true })).toHaveCount(0);
  expect(state.posts).toHaveLength(1); expect(state.balance).toBe(10);
});

for (const [width, height] of [[1184, 1328], [1141, 1280]]) {
  test(`continued ${width}×${height} image has a real outline without generation`, async ({ page }) => {
    test.setTimeout(70_000);
    const source = sharp('apps/tanstack-app/public/examples/v2/slim-editorial-v2.webp');
    const metadata = await source.metadata();
    const photo = await source.extract({ left: 0, top: 0, width: Math.floor(metadata.width! / 2), height: metadata.height! })
      .resize(width, height, { fit: 'fill' }).png().toBuffer();
    const state = await fixture(page, 10, false, { photo, realAnalysis: true });
    const editor = page.locator('[data-body-editor]');
    await expect(editor).toHaveAttribute('data-photo-source', 'generated');
    await expect(editor.locator('[data-contour-original]')).toBeVisible({ timeout: 50_000 });
    expect((await editor.locator('[data-contour-original]').getAttribute('d'))!.length).toBeGreaterThan(1000);
    const image = editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true });
    expect(await image.evaluate((element: HTMLImageElement) => [element.naturalWidth, element.naturalHeight])).toEqual([width, height]);
    await expect(page.locator('#hero-showcase img')).toHaveCount(0);
    await expect(page.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('83');
    expect(state.balance).toBe(10);
    expect(state.posts).toHaveLength(0);
    await editor.locator('[data-body-contour-preview]').screenshot({ path: `test-results/continued-outline-${width}x${height}.png` });
  });
}

test('insufficient balance preserves the history reference and loading after a top-up does not charge', async ({ page }) => {
  const state = await fixture(page, 9);
  await expect(page.getByRole('dialog')).toContainText('Credit packs aren’t available yet.');
  expect(state.imageReads).toBe(0); expect(state.posts).toHaveLength(0);
  state.balance = 10;
  await page.reload();
  await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'generated');
  expect(state.balance).toBe(10); expect(state.posts).toHaveLength(0);
});

test('unavailable saved image can be retried without a generation or debit', async ({ page }) => {
  const state = await fixture(page, 10, true);
  await expect(page.getByRole('alert')).toContainText('This saved photo couldn’t be loaded.');
  state.fail = false;
  await page.locator('[data-body-editor]').getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'generated');
  expect(state.balance).toBe(10); expect(state.posts).toHaveLength(0);
});
