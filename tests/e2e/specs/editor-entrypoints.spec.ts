import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TIMEOUTS } from '../helpers/constants';

/** Public, read-only coverage. Run with E2E_SKIP_CLEANUP=true. */
const SITE_URL = 'https://aibodyeditor.net';
const EDITOR_ID = `${SITE_URL}#editor`;
const TOOLS = [
  { path: '/body-editor', name: 'Body Editor' },
  { path: '/skinny-filter', name: 'Skinny Filter' },
  { path: '/breast-expansion', name: 'AI Breast Expansion' },
] as const;
const INDEXABLE_PAGES = [{ path: '/', name: 'AI Body Editor' }, ...TOOLS];
const AVAILABILITY = 'Choose a mode and intensity. Your first guest edit is free without signing in.';
const SHARED_EDITOR_INTRO = 'Every guide uses the same AI Body Editor with Slim, Muscle, Proportions and Breast modes, plus a continuous intensity slider.';
const PREVIEW_NOTICE = 'Sign in to continue with account credits. Your selected photo will stay here.';
const PREVIEW_PNG = readFileSync(resolve(__dirname, '../../../apps/tanstack-app/public/favicon-32x32.png'));

async function visit(page: Page, path: string) {
  // English URLs have no prefix; the older shared PAGES constants still use /en.
  await page.goto(path, { timeout: TIMEOUTS.navigation });
  // The anonymous auth control appears after hydration and session resolution.
  await expect(page.locator('header a[href="/signin"]')).toHaveCount(1);
}

test.describe('One editor, homepage and topic entry points', () => {
  test('desktop Tools supports its links, outside dismissal and the 768px breakpoint', async ({ page }) => {
    for (const width of [1280, 768]) {
      await test.step(`${width}px desktop navigation`, async () => {
        await page.setViewportSize({ width, height: 900 });
        await visit(page, '/');
        const details = page.locator('header details');
        const summary = details.locator('summary');
        await expect(summary).toHaveText('Tools');
        await expect(summary).toBeVisible();
        await expect(page.getByRole('button', { name: 'Open main menu' })).toBeHidden();
        await expect(details).toHaveJSProperty('open', false);

        await summary.click();
        await expect(details).toHaveJSProperty('open', true);
        for (const tool of TOOLS) {
          const link = details.getByRole('link', { name: tool.name, exact: true });
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute('href', tool.path);
        }
        if (width === 1280) {
          await page.screenshot({ path: 'test-results/editor-entrypoints/tools-desktop.png' });
        }

        // A blank edge of the hero is outside the overlapping dropdown panel.
        await page.locator('#home-hero').click({ position: { x: 16, y: 16 } });
        await expect(details).toHaveJSProperty('open', false);

        for (const tool of TOOLS) {
          await summary.click();
          await details.getByRole('link', { name: tool.name, exact: true }).click();
          await expect(page).toHaveURL(new RegExp(`${tool.path}$`));
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(tool.name);
          await expect(details).toHaveJSProperty('open', false);
        }
      });
    }
  });

  test('Tools can be opened, dismissed and followed with the keyboard', async ({ page }) => {
    await visit(page, '/');
    const details = page.locator('header details');
    const summary = details.locator('summary');
    const bodyEditor = details.getByRole('link', { name: 'Body Editor', exact: true });

    await summary.focus();
    await summary.press('Enter');
    await expect(details).toHaveJSProperty('open', true);
    await summary.press('Tab');
    await expect(bodyEditor).toBeFocused();
    await bodyEditor.press('Escape');
    await expect(details).toHaveJSProperty('open', false);
    await expect(summary).toBeFocused();

    await summary.press('Space');
    await expect(details).toHaveJSProperty('open', true);
    await summary.press('Tab');
    await expect(bodyEditor).toBeFocused();
    await bodyEditor.press('Enter');
    await expect(page).toHaveURL(/\/body-editor$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Body Editor');
    await expect(details).toHaveJSProperty('open', false);
  });

  test('mobile groups the tool links and collapses after navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, '/');
    const header = page.locator('header');
    const toggle = header.getByRole('button', { name: 'Open main menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const navigation = header.getByRole('navigation');
    await expect(navigation.getByText('Tools', { exact: true })).toBeVisible();
    for (const tool of TOOLS) {
      const link = navigation.getByRole('link', { name: tool.name, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', tool.path);
    }
    await navigation.getByRole('link', { name: 'Body Editor', exact: true }).click();
    await expect(page).toHaveURL(/\/body-editor$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Body Editor');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(header.getByRole('navigation')).toHaveCount(0);
  });

  for (const path of ['/', '/body-editor']) {
    test(`${path} offers the same modes and local-only photo preview`, async ({ page }) => {
      const mutationRequests: string[] = [];
      // Block mutations so a regression cannot upload a fixture or write data.
      await page.route('**/*', async (route) => {
        const request = route.request();
        if (new URL(request.url()).pathname === '/api/body-edit/guest-session') {
          return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ownerId: 'guest:entrypoint', remaining: 0 }) });
        }
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) {
          mutationRequests.push(`${request.method()} ${request.url()}`);
          await route.abort('blockedbyclient');
        } else {
          await route.continue();
        }
      });
      await visit(page, path);
      const editor = page.locator('#try');
      await expect(editor.getByText(AVAILABILITY, { exact: true })).toBeVisible();
      await expect(editor.getByRole('radio')).toHaveCount(4);
      for (const mode of ['Slim', 'Muscle', 'Proportions', 'Breast']) {
        await expect(editor.locator('fieldset').getByText(mode, { exact: true })).toBeVisible();
      }
      await expect(editor.locator('input[value="slim"]')).toBeChecked();
      await expect(editor.getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('70');

      const input = editor.locator('input[type="file"]');
      await input.setInputFiles({ name: 'local-preview.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
      const preview = editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true });
      await expect(preview).toBeVisible();
      await expect(preview).toHaveAttribute('src', /^blob:/);
      await expect.poll(() => preview.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(editor.getByText('Choose another photo', { exact: true })).toBeVisible();
      const originalPreviewUrl = await preview.getAttribute('src');

      await editor.locator('fieldset').getByText('Muscle', { exact: true }).click();
      await expect(editor.locator('input[value="muscle"]')).toBeChecked();
      await expect(editor.locator('input[value="slim"]')).not.toBeChecked();
      await editor.locator('fieldset').getByText('Proportions', { exact: true }).click();
      await expect(editor.locator('input[value="proportions"]')).toBeChecked();
      await expect(editor.locator('input[value="muscle"]')).not.toBeChecked();

      await input.setInputFiles({ name: 'replacement-preview.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
      await expect(preview).not.toHaveAttribute('src', originalPreviewUrl!);
      await expect(preview).toHaveAttribute('src', /^blob:/);
      await expect.poll(() => preview.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await editor.getByRole('button', { name: 'Sign in to continue', exact: true }).click();
      await expect(page.getByText(PREVIEW_NOTICE, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
      expect(mutationRequests, 'Preview selection, replacement and submission must not send mutations').toEqual([]);
    });
  }

  test('the homepage is an overview and Body Editor is a substantial guide to the same editor', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await visit(page, '/');
    await expect(page.locator('#features h2')).toHaveText('Choose what to edit');
    await expect(page.locator('#pricing h2')).toBeVisible();
    const homeTitle = await page.title();

    await visit(page, '/body-editor');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Body Editor');
    expect(await page.title()).not.toBe(homeTitle);
    await expect(page.locator('#try').getByText(SHARED_EDITOR_INTRO, { exact: true })).toBeVisible();
    await expect(page.locator('#what h2')).toHaveText('What is a body editor?');
    await expect(page.locator('#how-to h2')).toHaveText('How to edit a body photo');
    await expect(page.locator('#tips h2')).toHaveText('Body editor photo tips');
    await expect(page.locator('#faq h2')).toHaveText('Body editor FAQ');
    const guideText = (await page.locator('#what, #how-to, #tips, #faq').allTextContents()).join(' ');
    expect(guideText.trim().split(/\s+/).length).toBeGreaterThanOrEqual(400);
    await expect(page.locator('#what').getByRole('link', { name: 'AI body editor', exact: true })).toHaveAttribute('href', '/');
    await page.screenshot({ path: 'test-results/editor-entrypoints/body-editor-desktop.png' });
  });

  test('all four pages preserve SSR content, keyword links and one application identity', async ({ page, request }) => {
    const titles = new Set<string>();
    for (const entry of INDEXABLE_PAGES) {
      await test.step(`SSR ${entry.path}`, async () => {
        const response = await request.get(entry.path);
        expect(response.status()).toBe(200);
        // Parse the HTTP response, never the hydrated application document.
        const html = await response.text();
        const rendered = await page.evaluate((source) => {
          const document = new DOMParser().parseFromString(source, 'text/html');
          const text = (selector: string) => document.querySelector(selector)?.textContent?.trim() ?? '';
          return {
            title: text('head title'),
            headings: Array.from(document.querySelectorAll('h1'), (heading) => heading.textContent?.trim()),
            canonicals: Array.from(document.querySelectorAll('head link[rel="canonical"]'), (link) => link.getAttribute('href')),
            description: document.querySelector('head meta[name="description"]')?.getAttribute('content'),
            ogUrl: document.querySelector('head meta[property="og:url"]')?.getAttribute('content'),
            robots: document.querySelector('head meta[name="robots"]')?.getAttribute('content'),
            keywordsCount: document.querySelectorAll('head meta[name="keywords"]').length,
            toolsOpen: document.querySelector('header details')?.hasAttribute('open'),
            headerLinks: Array.from(document.querySelectorAll('header details a'), (link) => ({
              href: link.getAttribute('href'), text: link.textContent?.trim(),
            })),
            intro: text('#try'),
            guideText: ['#what', '#how-to', '#tips', '#faq'].map(text).join(' '),
            hasFeatures: !!document.querySelector('#features'),
            hasPricing: !!document.querySelector('#pricing'),
            jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), (script) => JSON.parse(script.textContent ?? 'null')),
          };
        }, html);
        const canonical = entry.path === '/' ? SITE_URL : `${SITE_URL}${entry.path}`;
        expect(rendered.headings).toEqual([entry.name]);
        expect(rendered.title).toMatch(new RegExp(`^${entry.name}\\b`, 'i'));
        titles.add(rendered.title);
        expect(rendered.canonicals).toEqual([canonical]);
        expect(rendered.ogUrl).toBe(canonical);
        expect(rendered.description?.length).toBeGreaterThan(50);
        expect(rendered.robots).toMatch(/^index, follow/);
        expect(rendered.keywordsCount).toBe(0);
        expect(rendered.toolsOpen).toBe(false);
        expect(rendered.headerLinks).toEqual(TOOLS.map((tool) => ({ href: tool.path, text: tool.name })));
        expect(rendered.intro).toContain(AVAILABILITY);

        const applications = rendered.jsonLd.filter((item) => item['@type'] === 'SoftwareApplication');
        expect(applications).toHaveLength(1);
        expect(applications[0]).toMatchObject({ '@id': EDITOR_ID, name: 'AI Body Editor', url: SITE_URL });
        // Configured credit packs may have offers; the planned free edit must not.
        const offers = applications[0].offers ?? [];
        expect(offers.some((offer: { name?: string }) => offer.name === 'Planned free trial')).toBe(false);
        if (entry.path === '/') {
          expect(rendered.hasFeatures).toBe(true);
          expect(rendered.hasPricing).toBe(true);
        } else {
          expect(rendered.intro).toContain(SHARED_EDITOR_INTRO);
          const topic = rendered.jsonLd.find((item) => item['@type'] === 'WebPage');
          expect(topic).toMatchObject({ name: entry.name, url: canonical, about: { '@id': EDITOR_ID } });
          if (entry.path === '/body-editor') {
            expect(rendered.guideText.trim().split(/\s+/).length).toBeGreaterThanOrEqual(400);
          }
        }
      });
    }
    expect(titles.size).toBe(INDEXABLE_PAGES.length);
  });

  test('the sitemap retains the homepage and all published topic pages', async ({ page, request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const locations = await page.evaluate((xml) => {
      const document = new DOMParser().parseFromString(xml, 'application/xml');
      if (document.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
      return Array.from(document.querySelectorAll('url > loc'), (location) => location.textContent?.trim());
    }, await response.text());
    for (const entry of INDEXABLE_PAGES) {
      const canonical = entry.path === '/' ? SITE_URL : `${SITE_URL}${entry.path}`;
      expect(locations.filter((location) => location === canonical)).toHaveLength(1);
    }
  });
});
