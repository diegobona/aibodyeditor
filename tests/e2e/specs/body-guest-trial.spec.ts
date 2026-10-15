import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { createBodyEditHandlers } from '../../../apps/tanstack-app/src/lib/body-edit-api';
import { createBodyEditorService } from '../../../libs/ai/body-editor-service';
import { guestIdentity } from '../../../libs/ai/body-guest-session';
import { createBodyGuestRepository } from '../../../libs/credits/body-guest-repository';
import { createBodyEditRepository } from '../../../libs/credits/body-edit-repository';
import type { BodyEditResultStore } from '../../../libs/credits/body-edit-types';

// Real HTTP handlers, service, cookie and transactional repository; only the
// external image provider/private object store and auth session are fixtures.
const PNG = readFileSync('apps/tanstack-app/public/favicon-32x32.png');
const editor = (page: Page) => page.locator('[data-body-editor]');
function backend() {
  const db = new Database(':memory:');
  db.exec(`CREATE TABLE user (id TEXT PRIMARY KEY,banned INTEGER DEFAULT 0,credit_balance TEXT DEFAULT '0',updated_at INTEGER);
    CREATE TABLE credit_transaction (id TEXT PRIMARY KEY,user_id TEXT,type TEXT,amount TEXT,balance TEXT,description TEXT,metadata TEXT,created_at INTEGER);
    INSERT INTO user (id) VALUES ('account');`);
  for (const migration of ['0006_body_image_edit.sql', '0007_body_guest_edit.sql'])
    db.exec(readFileSync('libs/database/drizzle-sqlite/' + migration, 'utf8'));
  const objects = new Map<string, { bytes: Uint8Array; mimeType: string }>();
  const state = { calls: 0, failNext: false, account: false };
  const storage: BodyEditResultStore = {
    put: async (id, bytes, mimeType) => { objects.set(id, { bytes, mimeType }); return id; },
    get: async key => objects.get(key) ?? null,
    delete: async key => { objects.delete(key); },
  };
  const pipeline = { storage, checkAvailable: () => true, editImage: async () => {
    state.calls++;
    if (state.failNext) { state.failNext = false; throw new Error('fixture failure'); }
    return { imageUrl: 'data:image/png;base64,' + PNG.toString('base64'), outputFormat: 'png' as const,
      provider: 'openai' as const, model: 'gpt-image-2.5-1k', mode: 'slim' as const, intensity: 70 };
  } };
  const guestRepo = createBodyGuestRepository({ dialect: 'sqlite', sqlite: db, networkHash: 'e2e-network' });
  const handlers = createBodyEditHandlers({
    getUser: async () => state.account ? { id: 'account' } : null,
    service: createBodyEditorService({ ...pipeline, repository: createBodyEditRepository({ dialect: 'sqlite', sqlite: db }) }),
    getConfig: () => ({ available: true, costCredits: 15, freeTrialEdits: 0, guestTrialEdits: 1 }),
    guest: { service: createBodyEditorService({ ...pipeline, repository: guestRepo }),
      getIdentity: guestIdentity, allowance: (id, now) => guestRepo.allowance(id, now) },
    readImage: storage.get,
  });
  async function install(context: BrowserContext) {
    await context.route('**/api/auth/**', async route => {
      const stamp = new Date().toISOString();
      const body = state.account ? { session: { id: 'session', token: 'fixture', userId: 'account', expiresAt: '2099-01-01T00:00:00Z' },
        user: { id: 'account', name: 'Fixture', email: 'fixture@example.invalid', emailVerified: true, createdAt: stamp, updatedAt: stamp } } : null;
      await route.fulfill({ json: body });
    });
    await context.route('**/api/body-edit**', async route => {
      const req = route.request(), url = new URL(req.url());
      const request = new Request(req.url(), { method: req.method(), headers: await req.allHeaders(),
        ...(req.method() === 'POST' ? { body: req.postDataBuffer() ?? undefined } : {}) });
      let response: Response;
      if (url.pathname.endsWith('/guest-session')) response = await handlers.guestSession(request);
      else if (url.pathname === '/api/body-edit') response = req.method() === 'POST' ? await handlers.submit(request)
        : url.searchParams.has('requestId') ? await handlers.lookup(request) : await handlers.config();
      else {
        const id = url.pathname.split('/')[3];
        response = url.pathname.endsWith('/image') ? await handlers.image(request, id) : await handlers.status(request, id);
      }
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
    });
  }
  return { db, state, install, close: () => db.close() };
}
async function openGuest(page: Page) {
  const initialized = page.waitForResponse(r => r.url().endsWith('/api/body-edit/guest-session') && r.status() === 200);
  await page.goto('/'); await initialized;
}
async function upload(page: Page) {
  await page.getByLabel('Upload a photo to edit', { exact: true }).setInputFiles({ name: 'portrait.png', mimeType: 'image/png', buffer: PNG });
  await expect(editor(page).getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toBeVisible();
}

test('one guest edit, private download and refresh persist the exhausted quota', async ({ page, context, browser }) => {
  const fixture = backend();
  try {
    await fixture.install(context); await page.setViewportSize({ width: 390, height: 844 }); await openGuest(page);
    await upload(page); await editor(page).getByRole('button', { name: 'Edit Photo', exact: true }).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(fixture.state.calls).toBe(1);
    const downloadEvent = page.waitForEvent('download');
    await editor(page).getByRole('link', { name: 'Download photo' }).click();
    expect((await downloadEvent).suggestedFilename()).toMatch(/\.png$/);
    const job = fixture.db.prepare('SELECT id FROM body_guest_edit').get() as { id: string };
    const stranger = await browser.newContext({ baseURL: new URL(page.url()).origin });
    try {
      await fixture.install(stranger); const other = await stranger.newPage(); await openGuest(other);
      expect(await other.evaluate(async id => (await fetch('/api/body-edit/' + id + '/image')).status, job.id)).toBe(404);
    } finally { await stranger.close(); }
    const initialized = page.waitForResponse(r => r.url().endsWith('/api/body-edit/guest-session') && r.status() === 200);
    await page.reload(); await initialized;
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    await editor(page).getByRole('button', { name: 'Edit another photo', exact: true }).click();
    await expect(editor(page).getByRole('button', { name: 'Sign in to continue', exact: true })).toBeVisible();
    await upload(page); await editor(page).getByRole('button', { name: 'Sign in to continue', exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText('Your selected photo will stay here.');
    expect(fixture.state.calls).toBe(1);
    expect(fixture.db.prepare('SELECT * FROM credit_transaction').all()).toHaveLength(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  } finally { fixture.close(); }
});

test('provider failure keeps the guest opportunity and a retry succeeds', async ({ page, context }) => {
  const fixture = backend(); fixture.state.failNext = true;
  try {
    await fixture.install(context); await openGuest(page); await upload(page);
    await editor(page).getByRole('button', { name: 'Edit Photo', exact: true }).click();
    await expect(editor(page).getByRole('alert')).toContainText('Your free edit is still available');
    await expect(editor(page).getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled();
    await editor(page).getByRole('button', { name: 'Edit Photo', exact: true }).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    expect(fixture.state.calls).toBe(2);
    expect(fixture.db.prepare("SELECT * FROM body_guest_edit WHERE status='succeeded'").all()).toHaveLength(1);
  } finally { fixture.close(); }
});

test('signing in and reloading still recovers the cookie-owned guest result', async ({ page, context }) => {
  const fixture = backend();
  try {
    await fixture.install(context); await openGuest(page); await upload(page);
    await editor(page).getByRole('button', { name: 'Edit Photo', exact: true }).click();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    fixture.state.account = true;
    await page.reload();
    await expect(editor(page).getByText('Your edited photo', { exact: true })).toBeVisible();
    const downloadEvent = page.waitForEvent('download');
    await editor(page).getByRole('link', { name: 'Download photo' }).click();
    expect((await downloadEvent).suggestedFilename()).toMatch(/\.png$/);
    expect(fixture.state.calls).toBe(1);
    expect(fixture.db.prepare('SELECT * FROM credit_transaction').all()).toHaveLength(0);
  } finally { fixture.close(); }
});

test('signed-in account with zero balance gets no extra trial', async ({ page, context }) => {
  const fixture = backend(); fixture.state.account = true;
  try {
    await fixture.install(context); await page.goto('/');
    await expect(editor(page).getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled();
    await upload(page); await editor(page).getByRole('button', { name: 'Edit Photo', exact: true }).click();
    await expect(editor(page).getByRole('alert')).toContainText('credits');
    expect(fixture.state.calls).toBe(0);
    expect(fixture.db.prepare('SELECT * FROM credit_transaction').all()).toHaveLength(0);
    expect(fixture.db.prepare('SELECT * FROM body_guest_edit').all()).toHaveLength(0);
  } finally { fixture.close(); }
});
