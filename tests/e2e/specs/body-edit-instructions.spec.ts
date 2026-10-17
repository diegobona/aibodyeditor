import { test, expect, type Page, type Route } from '@playwright/test';
import { readFileSync } from 'node:fs';

// UI contract coverage only: auth and the provider-facing HTTP responses are
// fixtures, so these checks never create users, charge credits or call a model.
const PNG = readFileSync('apps/tanstack-app/public/favicon-32x32.png');
const JOB = 'ce500680-80f4-46bd-8a82-6e8dd017223d';
const USER = 'instructions-ui-fixture';
const stamp = '2026-10-15T00:00:00.000Z';
const SESSION = {
  session: { id: 'instructions-session', token: 'fixture', userId: USER, expiresAt: '2099-01-01T00:00:00Z', createdAt: stamp, updatedAt: stamp },
  user: { id: USER, name: 'Instructions Test', email: 'instructions@example.invalid', emailVerified: true, image: null, createdAt: stamp, updatedAt: stamp },
};
const NOTES = 'Only slim my waist; keep my arms and legs unchanged.';
const editor = (page: Page) => page.locator('[data-body-editor]');
const toggle = (page: Page) => editor(page).getByRole('button', { name: 'Extra instructions (optional)', exact: true });
const instructions = (page: Page) => editor(page).getByLabel('Extra body-edit instructions', { exact: true });
const generate = (page: Page) => editor(page).getByRole('button', { name: 'Edit Photo', exact: true });
const json = (route: Route, body: unknown, status = 200) => route.fulfill({ status, json: body });
const success = () => ({ jobId: JOB, status: 'succeeded', result: { imageUrl: `/api/body-edit/${JOB}/image`, downloadUrl: `/api/body-edit/${JOB}/image?download=1`, mode: 'slim', intensity: 70 }, credits: { charged: 10, balance: 40 }, reused: false });

type Fixture = {
  account: boolean;
  remaining: number;
  posts: FormData[];
  lookups: string[];
  respond: (route: Route) => Promise<void>;
};
async function setup(page: Page, options: { account?: boolean; remaining?: number } = {}) {
  const state: Fixture = { account: options.account ?? true, remaining: options.remaining ?? 1, posts: [], lookups: [], respond: route => json(route, success()) };
  await page.route('**/api/auth/**', async route => {
    if (new URL(route.request().url()).pathname.endsWith('/sign-in/email')) {
      state.account = true;
      return json(route, { redirect: false, token: 'fixture', user: SESSION.user });
    }
    return json(route, state.account ? SESSION : null);
  });
  await page.route('**/body-preview/worker.js', route => route.fulfill({ contentType: 'application/javascript', body: 'self.onmessage=()=>self.postMessage({type:"error"});' }));
  await page.route('**/api/body-edit**', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname.endsWith('/account')) return json(route, { ownerId: USER, balance: 50, bonusGranted: false, welcomeCredits: 10 });
    if (url.pathname.endsWith('/guest-session')) return json(route, { ownerId: 'guest:instructions', remaining: state.remaining });
    if (url.pathname.endsWith('/image')) return route.fulfill({ body: PNG, contentType: 'image/png' });
    if (request.method() === 'GET' && url.pathname === '/api/body-edit' && !url.search)
      return json(route, { available: true, costCredits: 10, freeTrialEdits: 1, guestTrialEdits: 1 });
    if (request.method() === 'POST') {
      state.posts.push(await new Request(request.url(), { method: 'POST', headers: request.headers(), body: request.postDataBuffer()! }).formData());
    } else state.lookups.push(url.pathname + url.search);
    await state.respond(route);
  });
  const ready = !state.account ? page.waitForResponse(response => response.url().endsWith('/api/body-edit/guest-session')) : undefined;
  await page.goto('/');
  await ready;
  const action = state.account || state.remaining > 0 ? 'Edit Photo' : 'Sign in for a free edit';
  await expect(editor(page).getByRole('button', { name: action, exact: true })).toBeEnabled();
  return state;
}
async function upload(page: Page, name = 'portrait.png') {
  await editor(page).getByLabel('Upload a photo to edit', { exact: true }).setInputFiles({ name, mimeType: 'image/png', buffer: PNG });
  await expect(editor(page).getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toBeVisible();
}
async function openInstructions(page: Page) {
  if (await toggle(page).getAttribute('aria-expanded') !== 'true') await toggle(page).click();
  await expect(instructions(page)).toBeVisible();
}

test.describe('Optional body-edit instructions', () => {
  test('the default stays collapsed; typing and changing settings never generate, and the limit is visible', async ({ page }) => {
    const state = await setup(page);
    await upload(page);
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(instructions(page)).toBeHidden();
    await openInstructions(page);
    await expect(instructions(page)).toHaveAttribute('placeholder', NOTES);
    await expect(instructions(page)).toHaveAttribute('maxlength', '500');
    await expect(editor(page)).toContainText('Example: Make my shoulders slightly wider.');
    await expect(editor(page)).toContainText('The outline only reflects the mode and intensity.');
    await instructions(page).fill(NOTES);
    await editor(page).locator('fieldset').getByText('Muscle', { exact: true }).click();
    await editor(page).getByRole('slider', { name: 'Intensity', exact: true }).press('ArrowLeft');
    await expect(instructions(page)).toHaveValue(NOTES);
    await instructions(page).fill('a'.repeat(500));
    await instructions(page).press('b');
    await expect(instructions(page)).toHaveValue('a'.repeat(500));
    await expect(editor(page).getByText('500/500 characters', { exact: true })).toBeVisible();
    await toggle(page).click();
    await openInstructions(page);
    await expect(instructions(page)).toHaveValue('a'.repeat(500));
    expect(state.posts).toHaveLength(0);
  });

  for (const value of [undefined, '   \n\t  ', '  Only slim my waist;\r\nkeep my arms and legs unchanged.  ']) {
    test(`${value === undefined ? 'omitted' : value.trim() ? 'normalized' : 'blank'} instructions use the expected multipart payload`, async ({ page }) => {
      const state = await setup(page, { account: false });
      await upload(page);
      if (value !== undefined) { await openInstructions(page); await instructions(page).fill(value); }
      await generate(page).click();
      await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
      expect(state.posts).toHaveLength(1);
      const form = state.posts[0];
      expect(form.get('mode')).toBe('slim');
      expect(form.get('intensity')).toBe('70');
      expect(form.get('requestId')).toMatch(/^[0-9a-f-]{36}$/);
      expect(form.has('prompt')).toBe(false);
      // Browsers encode normalized textarea line breaks as CRLF in multipart.
      // The shared HTTP normalizer converts those wire line breaks back to LF.
      if (value?.trim()) expect(form.get('instructions')).toBe('Only slim my waist;\r\nkeep my arms and legs unchanged.');
      else expect(form.has('instructions')).toBe(false);
      await editor(page).getByRole('button', { name: 'Edit another photo', exact: true }).click();
      await openInstructions(page);
      await expect(instructions(page)).toHaveValue('');
    });
  }

  test('pending and uncertain edits lock inputs; retry keeps its text snapshot and UUID, while storage contains only recovery data', async ({ page }) => {
    const state = await setup(page);
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    state.respond = async route => {
      if (state.posts.length === 1) { await held; return json(route, { error: { code: 'INTERNAL_ERROR' } }, 500); }
      return json(route, success());
    };
    try {
      await upload(page); await openInstructions(page); await instructions(page).fill(`  ${NOTES}  `);
      await generate(page).click();
      await expect(instructions(page)).toBeDisabled();
      await expect(toggle(page)).toBeDisabled();
      await expect(generate(page)).toBeDisabled();
      await expect.poll(() => state.posts.length).toBe(1);
      const saved = await page.evaluate(() => sessionStorage.getItem('body-editor-job'));
      expect(JSON.parse(saved!)).toMatchObject({ ownerId: USER, requestId: state.posts[0].get('requestId') });
      expect(Object.keys(JSON.parse(saved!)).sort()).toEqual(['ownerId', 'requestId', 'startedAt']);
      expect(saved).not.toContain(NOTES);
      release();
      await expect(editor(page).getByRole('button', { name: 'Check edit status', exact: true })).toBeEnabled();
      await expect(instructions(page)).toBeDisabled();
      await expect(toggle(page)).toBeDisabled();
      expect(state.posts).toHaveLength(1);
      await editor(page).getByRole('button', { name: 'Check edit status', exact: true }).click();
      await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
      expect(state.posts).toHaveLength(2);
      expect(state.posts.map(form => form.get('instructions'))).toEqual([NOTES, NOTES]);
      expect(state.posts[1].get('requestId')).toBe(state.posts[0].get('requestId'));
    } finally { release(); }
  });

  test('INVALID_INSTRUCTIONS 400 preserves the text, unlocks correction and never polls or retries automatically', async ({ page }) => {
    const state = await setup(page);
    state.respond = route => state.posts.length === 1 ? json(route, { error: { code: 'INVALID_INSTRUCTIONS' } }, 400) : json(route, success());
    await upload(page); await openInstructions(page); await instructions(page).fill(NOTES);
    await generate(page).click();
    await expect(editor(page).getByRole('alert')).toContainText('500 characters of plain text');
    await expect(instructions(page)).toHaveValue(NOTES);
    await expect(instructions(page)).toBeEnabled();
    await expect(instructions(page)).toHaveAttribute('aria-invalid', 'true');
    await expect(toggle(page)).toBeEnabled();
    await expect(editor(page).getByRole('radio', { name: 'Muscle', exact: true })).toBeEnabled();
    await expect(generate(page)).toBeEnabled();
    expect(await page.evaluate(() => sessionStorage.getItem('body-editor-job'))).toBeNull();
    // Let a poll-sized interval elapse: this 400 must end the request locally.
    await page.waitForTimeout(1200);
    expect(state.lookups).toEqual([]); expect(state.posts).toHaveLength(1);
    await instructions(page).fill('Make my shoulders slightly wider.');
    await expect(instructions(page)).not.toHaveAttribute('aria-invalid', 'true');
    await generate(page).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    expect(state.posts).toHaveLength(2);
    expect(state.posts[1].get('instructions')).toBe('Make my shoulders slightly wider.');
    expect(state.posts[1].get('requestId')).not.toBe(state.posts[0].get('requestId'));
  });

  test('selecting another local photo or sample clears photo-specific instructions', async ({ page }) => {
    const state = await setup(page);
    await upload(page); await openInstructions(page); await instructions(page).fill(NOTES);
    await upload(page, 'replacement.png');
    await expect(instructions(page)).toHaveValue('');
    await instructions(page).fill(NOTES);
    await page.locator('#samples').getByRole('link', { name: 'Preview Muscle', exact: true }).click();
    await expect(editor(page).getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toBeVisible();
    await expect(instructions(page)).toHaveValue('');
    expect(state.posts).toHaveLength(0);
  });

  test('the sign-in dialog and successful login preserve photo, settings and instructions', async ({ page }) => {
    const state = await setup(page, { account: false, remaining: 0 });
    await upload(page); await openInstructions(page); await instructions(page).fill(NOTES);
    await editor(page).locator('fieldset').getByText('Breast', { exact: true }).click();
    await editor(page).getByRole('slider', { name: 'Intensity', exact: true }).press('End');
    const photo = await editor(page).getByRole('img', { name: 'Preview of the photo you selected', exact: true }).getAttribute('src');
    await editor(page).getByRole('button', { name: 'Sign in for a free edit', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(instructions(page)).toHaveValue(NOTES);
    await editor(page).getByRole('button', { name: 'Sign in for a free edit', exact: true }).click();
    await dialog.locator('#email').fill('instructions@example.invalid');
    await dialog.locator('#password').fill('FixturePass123!');
    await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(generate(page)).toBeEnabled();
    await expect(instructions(page)).toHaveValue(NOTES);
    await expect(editor(page).getByRole('radio', { name: 'Breast', exact: true })).toBeChecked();
    await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('100');
    await expect(editor(page).getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toHaveAttribute('src', photo!);
    expect(state.posts).toHaveLength(0);
  });

  test('320, 390 and 768px keep the collapsed controls in view and expanded input before the action without overflow', async ({ page }) => {
    const state = await setup(page, { account: false });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/');
      await expect(generate(page)).toBeEnabled();
      const viewport = page.viewportSize()!;
      for (const control of [generate(page), toggle(page), editor(page).getByText('Choose a mode and intensity. Your first guest edit is free without signing in.', { exact: true })]) {
        const box = (await control.boundingBox())!;
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      }
      await openInstructions(page); await instructions(page).fill(NOTES);
      expect(await instructions(page).evaluate(node => Boolean(node.compareDocumentPosition(document.querySelector('[data-body-editor] button.h-12')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: `test-results/instructions-mobile-${width}.png` });
    }
    expect(state.posts).toHaveLength(0);
  });

});
