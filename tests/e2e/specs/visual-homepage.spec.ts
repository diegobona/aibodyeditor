import { test, expect, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TIMEOUTS } from '../helpers/constants';

/** Public fixture coverage. E2E_SKIP_CLEANUP=true; all generation requests are intercepted. */
const SITE_URL = 'https://aibodyeditor.net';
const AVAILABILITY = 'Choose a mode and intensity. Your first guest edit is free without signing in.';
const PREVIEW_ALT = 'Preview of the photo you selected';
const PREVIEW_PNG = readFileSync(resolve(__dirname, '../../../apps/tanstack-app/public/favicon-32x32.png'));
const RECIPES = JSON.parse(readFileSync(resolve(__dirname,
  '../../../apps/tanstack-app/public/examples/results-2026-10-16/provenance.json'), 'utf8')) as {
  case: string; mode: string; intensity: number; instructions: string; subject: string; sourceSha256: string;
}[];
const FILES: Record<string, string> = {
  naturalSlim: 'natural-slim', muscle: 'muscle', proportions: 'proportions', breast: 'breast',
  breastSubtle: 'breast-subtle', legProportions: 'leg-proportions', shoulders: 'shoulders',
  waistOnly: 'waist-only', fullerFigure: 'fuller-figure-unique', customCombination: 'custom-combination-unique',
};
const source = (key: string) => `/examples/results-2026-10-16/${FILES[key]}.webp`;
const recipe = (key: string) => RECIPES.find(item => item.case === key)!;
const mutations = new WeakMap<Page, string[]>();

async function publicFixtures(page: Page) {
  const requests: string[] = [];
  mutations.set(page, requests);
  await page.route('**/*', async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/api/auth/')) return route.fulfill({ json: null });
    if (path === '/api/body-edit/guest-session') return route.fulfill({ json: { ownerId: 'guest:presets', remaining: 1 } });
    if (path === '/api/body-edit' && request.method() === 'GET') {
      return route.fulfill({ json: { available: true, costCredits: 15, guestTrialEdits: 1, freeTrialEdits: 0 } });
    }
    // Keep contour analysis local and deterministic; these tests exercise preset selection.
    if (path === '/body-preview/worker.js') {
      return route.fulfill({ contentType: 'application/javascript', body: "self.onmessage=()=>self.postMessage({type:'error',code:'NO_PERSON'});" });
    }
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) {
      requests.push(`${request.method()} ${request.url()}`);
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
}

async function visit(page: Page) {
  await page.goto('/', { timeout: TIMEOUTS.navigation });
  await expect(page.locator('header a[href="/signin"]')).toHaveCount(1);
  await expect(page.locator('#try').getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled({ timeout: 15_000 });
}

async function expectDecoded(image: Locator) {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await image.evaluate(node => (node as HTMLImageElement).decode());
}

async function expectRecipe(page: Page, key: string) {
  const expected = recipe(key);
  const editor = page.locator('[data-body-editor]');
  await expect(page.locator(`#samples [data-example="${key}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#samples [aria-pressed="true"]')).toHaveCount(1);
  await expect(editor.locator(`input[type="radio"][value="${expected.mode}"]`)).toBeChecked();
  await expect(editor.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue(String(expected.intensity));
  await expect(editor.locator('textarea')).toHaveValue(expected.instructions);
  await expect(editor.getByRole('button', { name: 'Extra instructions (optional)', exact: true }))
    .toHaveAttribute('aria-expanded', String(Boolean(expected.instructions)));
}
const choose = (page: Page, key: string) => page.locator(`#samples [data-example="${key}"]`).click();
const preview = (page: Page) => page.getByRole('img', { name: PREVIEW_ALT, exact: true });
const toggle = (page: Page) => page.getByRole('switch', { name: 'Only apply settings', exact: true });

test.describe('Editor workbench and explicit example selection', () => {
  test.beforeEach(async ({ page }) => publicFixtures(page));
  test.afterEach(async ({ page }) => {
    expect(mutations.get(page), 'Preset browsing must not generate images').toEqual([]);
  });

  test('SSR and hydrated initial state are empty with ten distinct examples and the existing SEO links', async ({ page, request }) => {
    const response = await request.get('/?campaign=preview', { headers: { 'Accept-Language': 'zh-CN' } });
    expect(response.status()).toBe(200);
    const rendered = await page.evaluate(html => {
      const document = new DOMParser().parseFromString(html, 'text/html');
      return {
        h1: Array.from(document.querySelectorAll('h1'), n => n.textContent),
        canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href'),
        keywords: document.querySelectorAll('meta[name=keywords]').length,
        examples: Array.from(document.querySelectorAll('[data-example]'), n => ({
          key: n.getAttribute('data-example'), subject: n.getAttribute('data-subject'), selected: n.getAttribute('aria-pressed'),
          src: n.querySelector('img')?.getAttribute('src'), alt: n.querySelector('img')?.getAttribute('alt'),
        })),
        links: Array.from(document.querySelectorAll('#tools a'), n => n.getAttribute('href')),
        text: document.querySelector('#try')?.textContent,
        source: document.querySelector('[data-body-editor]')?.getAttribute('data-photo-source'),
        editorImages: document.querySelectorAll('[data-body-editor] img').length,
      };
    }, await response.text());
    expect(rendered.h1).toEqual(['AI Body Editor']);
    expect(rendered.canonical).toBe(SITE_URL);
    expect(rendered.keywords).toBe(0);
    expect(rendered.source).toBe('empty');
    expect(rendered.editorImages).toBe(0);
    expect(rendered.text).toContain(AVAILABILITY);
    expect(rendered.examples).toHaveLength(10);
    expect(new Set(rendered.examples.map(x => x.subject)).size).toBe(10);
    expect(rendered.examples.map(x => x.subject)).toContain('city-woman');
    expect(rendered.examples.map(x => x.key).sort()).toEqual(RECIPES.map(x => x.case).sort());
    expect(rendered.links).toEqual(expect.arrayContaining(['/body-editor', '/skinny-filter', '/breast-expansion']));
    for (const item of rendered.examples) {
      expect(item.selected).toBe('false'); expect(item.src).toBe(source(item.key!)); expect(item.alt!.length).toBeGreaterThan(70);
    }
    for (const description of [/Black man/, /East Asian woman/, /white man/]) {
      expect(rendered.examples.some(x => description.test(x.alt ?? ''))).toBe(true);
    }
    const provenance = await (await request.get('/examples/results-2026-10-16/provenance.json')).json();
    expect(new Set(provenance.map((x: {sourceSha256: string}) => x.sourceSha256)).size).toBe(10);
    await visit(page);
    await expect(toggle(page)).not.toBeChecked(); await expect(toggle(page)).toBeDisabled();
    await expect(page.getByRole('radio', { name: 'Slim', exact: true })).toBeChecked();
    await expect(page.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('70');
    await expect(page.locator('[data-body-editor] textarea')).toHaveValue('');
    await expect(page.locator('#samples [aria-pressed="true"]')).toHaveCount(0);
    await expect(page.locator('[data-photo-panel]')).toHaveCount(0);
    await expect(page.locator('[data-comparison-before], [data-real-result], #features img, #details img')).toHaveCount(0);
  });

  test('every case loads its exact recipe and original with a direct edited image and no duplicated settings', async ({ page }) => {
    await visit(page);
    for (const row of RECIPES) {
      await choose(page, row.case); await expectRecipe(page, row.case);
      await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'sample');
      await expect(page.locator('[data-body-editor]')).toHaveAttribute('aria-busy', 'false');
      await expectDecoded(preview(page));
      expect(await preview(page).evaluate(n => ({ w: (n as HTMLImageElement).naturalWidth, h: (n as HTMLImageElement).naturalHeight }))).toEqual({ w: 768, h: 1024 });
      await expect(page.locator('#hero-showcase')).toHaveAttribute('data-result-example', row.case);
      await expect(page.locator('#hero-showcase image')).toHaveAttribute('href', source(row.case));
      await expect(page.locator('#hero-showcase image')).toHaveAttribute('x', '-768');
      await expect(page.locator('#hero-showcase svg')).toHaveAttribute('viewBox', '0 0 768 1024');
      await expect(page.locator('[data-photo-panel="result"] input, [data-example-settings], [data-example-instructions]')).toHaveCount(0);
    }
    await expect(page.getByRole('button', { name: 'Use this sample photo', exact: true })).toHaveCount(0);
    await expect(page.getByRole('slider')).toHaveCount(1);
  });

  test('the default replaces a device photo; settings-only retains its current photo and corresponding result', async ({ page }) => {
    await visit(page);
    const input = page.getByLabel('Upload a photo to edit', { exact: true });
    const editor = page.locator('[data-body-editor]');
    await input.setInputFiles({ name: 'own.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
    await expect(editor).toHaveAttribute('data-photo-source', 'local');
    const own = await preview(page).getAttribute('src');
    await choose(page, 'shoulders'); await expectRecipe(page, 'shoulders');
    await expect(editor).toHaveAttribute('data-photo-source', 'sample');
    await expect(preview(page)).not.toHaveAttribute('src', own!);
    const original = await preview(page).getAttribute('src');
    await toggle(page).check();
    await expect(preview(page)).toHaveAttribute('src', original!);
    await choose(page, 'breast'); await expectRecipe(page, 'breast');
    await expect(preview(page)).toHaveAttribute('src', original!);
    await expect(page.locator('#hero-showcase')).toHaveAttribute('data-result-example', 'shoulders');
    await expect(page.locator('[data-photo-panel="result"]').getByRole('status')).toHaveText('Settings changed. Generate again to update this result.');
    await input.setInputFiles({ name: 'another.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
    await expect(editor).toHaveAttribute('data-photo-source', 'local');
    await expect(page.locator('#hero-showcase image')).toHaveCount(0);
    await expect(page.locator('#hero-showcase')).toContainText('Your edited photo will appear here');
    const another = await preview(page).getAttribute('src');
    await choose(page, 'customCombination'); await expectRecipe(page, 'customCombination');
    await expect(preview(page)).toHaveAttribute('src', another!);
    await expect(page.locator('#hero-showcase image')).toHaveCount(0);
    await toggle(page).uncheck();
    await expect(preview(page)).toHaveAttribute('src', another!);
    await choose(page, 'fullerFigure'); await expectRecipe(page, 'fullerFigure');
    await expect(editor).toHaveAttribute('data-photo-source', 'sample');
    await expect(page.locator('#hero-showcase')).toHaveAttribute('data-result-example', 'fullerFigure');
    await page.getByRole('slider', { name: 'Intensity', exact: true }).fill('33');
    await page.getByRole('textbox', { name: 'Extra body-edit instructions', exact: true }).fill('Only change my waist.');
    await expect(page.locator('#hero-showcase')).toHaveAttribute('data-result-example', 'fullerFigure');
  });

  test('desktop panels align and mobile tabs and the case strip fit 320–1440px without page overflow', async ({ page }) => {
    await visit(page); await choose(page, 'naturalSlim');
    await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'sample');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1100 });
      const group = page.locator('#samples [role=group]');
      expect(await group.evaluate(n => n.scrollWidth > n.clientWidth)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      if (width >= 1024) {
        const a = (await page.locator('[data-photo-panel="original"]').boundingBox())!;
        const b = (await page.locator('[data-photo-panel="result"]').boundingBox())!;
        const c = (await page.locator('[data-editor-settings]').boundingBox())!;
        expect(a.y).toBe(b.y); expect(b.y).toBe(c.y); expect(a.height).toBe(b.height); expect(b.height).toBe(c.height);
        expect(a.x + a.width).toBeLessThanOrEqual(b.x + 1); expect(b.x + b.width).toBeLessThanOrEqual(c.x + 1);
        expect(a.width).toBeCloseTo(b.width, 0);
      } else {
        const original = page.getByRole('tab', { name: 'Original', exact: true });
        const result = page.getByRole('tab', { name: 'Result', exact: true });
        await result.click(); await expect(page.locator('[data-photo-panel="result"]')).toBeVisible();
        await expect(page.locator('[data-photo-panel="original"]')).toBeHidden();
        await expect(result).toHaveAttribute('aria-selected', 'true');
        await original.click(); await expect(page.locator('[data-photo-panel="original"]')).toBeVisible();
        await expect(page.locator('[data-photo-panel="result"]')).toBeHidden();
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: `test-results/workbench/home-${width}.png` });
    }
    const group = page.locator('#samples [role=group]');
    await group.evaluate(n => { n.scrollLeft = 0; });
    await page.getByRole('button', { name: 'More examples', exact: true }).click();
    await expect.poll(() => group.evaluate(n => n.scrollLeft)).toBeGreaterThan(100);
  });

  test('a slow sample response cannot overwrite a newer case', async ({ page }) => {
    await visit(page);
    let release!: () => void; const held = new Promise<void>(resolve => { release = resolve; });
    let started!: () => void; const fetched = new Promise<void>(resolve => { started = resolve; });
    await page.route(`**${source('waistOnly')}`, async route => {
      if (route.request().resourceType() !== 'fetch') return route.fallback();
      started(); await held; return route.fallback();
    });
    await choose(page, 'waistOnly'); await fetched;
    await expect(page.locator('[data-body-editor]')).toHaveAttribute('aria-busy', 'true');
    await choose(page, 'muscle'); await expectRecipe(page, 'muscle');
    await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'sample');
    const latest = await preview(page).getAttribute('src');
    const returned = page.waitForResponse(r => new URL(r.url()).pathname === source('waistOnly') && r.request().resourceType() === 'fetch');
    release(); await (await returned).finished();
    await expect(preview(page)).toHaveAttribute('src', latest!);
    await expect(page.locator('#hero-showcase')).toHaveAttribute('data-result-example', 'muscle');
  });

  test('only Edit Photo submits the cropped original and recipe; pending locks all changes until a mocked refund', async ({ page }) => {
    await visit(page); await choose(page, 'customCombination'); await expectRecipe(page, 'customCombination');
    await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'sample');
    let release!: () => void; const held = new Promise<void>(resolve => { release = resolve; });
    let posted!: (form: FormData) => void; const submitted = new Promise<FormData>(resolve => { posted = resolve; });
    let count = 0;
    await page.route('**/api/body-edit', async route => {
      if (route.request().method() !== 'POST') return route.fallback();
      count++; const request = route.request();
      posted(await new Response(new Uint8Array(request.postDataBuffer()!), { headers: { 'content-type': request.headers()['content-type'] } }).formData());
      await held;
      return route.fulfill({ status: 502, json: { jobId: '11111111-1111-4111-8111-111111111111', status: 'failed', error: { code: 'PROVIDER_ERROR', refunded: true } } });
    });
    expect(count).toBe(0);
    await page.getByRole('button', { name: 'Edit Photo', exact: true }).click();
    const form = await submitted; const expected = recipe('customCombination');
    expect(form.get('mode')).toBe(expected.mode); expect(form.get('intensity')).toBe(String(expected.intensity));
    expect(form.get('instructions')).toBe(expected.instructions);
    const image = form.get('image') as File;
    expect(image.name).toBe('customCombination-original.png'); expect(image.type).toBe('image/png');
    const png = Buffer.from(await image.arrayBuffer()); expect(png.readUInt32BE(16)).toBe(768); expect(png.readUInt32BE(20)).toBe(1024);
    for (const button of await page.locator('#samples [data-example]').all()) await expect(button).toBeDisabled();
    await expect(toggle(page)).toBeDisabled(); await expect(page.locator('input[type=file]')).toBeDisabled();
    await expect(page.getByRole('slider', { name: 'Intensity', exact: true })).toBeDisabled();
    await expect(page.getByRole('textbox', { name: 'Extra body-edit instructions', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Edit Photo', exact: true })).toBeDisabled();
    release();
    await expect(page.getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled();
    await expect(page.getByRole('alert')).toContainText('Your free edit is still available. You can try again within the retry limits.');
    await expectRecipe(page, 'customCombination'); expect(count).toBe(1);
  });

  test('a successful generated result stays paired through settings-only changes and clears on upload', async ({ page }) => {
    await page.route('**/mock-workbench-result.png*', route => route.fulfill({ contentType: 'image/png', body: PREVIEW_PNG }));
    await page.route('**/api/body-edit', async route => {
      if (route.request().method() !== 'POST') return route.fallback();
      return route.fulfill({ json: { jobId: '11111111-1111-4111-8111-111111111111', status: 'succeeded',
        result: { imageUrl: '/mock-workbench-result.png', downloadUrl: '/mock-workbench-result.png', mode: 'muscle', intensity: 80 },
        credits: { charged: 0, balance: 0 }, reused: false } });
    });
    await visit(page); await choose(page, 'shoulders');
    await expect(page.locator('[data-body-editor]')).toHaveAttribute('data-photo-source', 'sample');
    await page.getByRole('button', { name: 'Edit Photo', exact: true }).click();
    const generated = page.locator('#hero-showcase img'); await expectDecoded(generated);
    await expect(generated).toHaveAttribute('src', '/mock-workbench-result.png');
    const download = page.getByRole('link', { name: 'Download photo', exact: true });
    await expect(download).toBeVisible();
    const downloaded = page.waitForEvent('download'); await download.click();
    expect((await downloaded).suggestedFilename()).toBe('ai-body-edit-11111111-1111-4111-8111-111111111111.png');
    const current = await preview(page).getAttribute('src');
    await toggle(page).check(); await choose(page, 'waistOnly'); await expectRecipe(page, 'waistOnly');
    await expect(generated).toHaveAttribute('src', '/mock-workbench-result.png');
    await expect(preview(page)).toHaveAttribute('src', current!);
    await expect(page.locator('[data-photo-panel="result"]').getByRole('status')).toContainText('Settings changed.');
    await page.getByLabel('Upload a photo to edit', { exact: true }).setInputFiles({ name: 'new.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
    await expect(generated).toHaveCount(0); await expect(download).toHaveCount(0);
    await expect(page.locator('#hero-showcase')).toContainText('Your edited photo will appear here');
  });
});
