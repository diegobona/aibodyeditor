import { test, expect, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TIMEOUTS } from '../helpers/constants';

/** Public preview coverage. Run with E2E_SKIP_CLEANUP=true; no account is created. */
const SITE_URL = 'https://aibodyeditor.net';
const CONCEPT_LABEL = 'AI-generated concept';
const CONCEPT_NOTICE = 'Concept images illustrate editing directions. They are not results from this app.';
const SAMPLE_NOTICE = 'Samples are AI-generated concepts. Select Edit Photo to generate a new edit.';
const AVAILABILITY = 'Choose a mode and intensity. Your first guest edit is free without signing in.';
const COMPARE_LABEL = 'Compare original and edited concepts';
const PREVIEW_PNG = readFileSync(resolve(__dirname, '../../../apps/tanstack-app/public/favicon-32x32.png'));
const MODES = [
  {
    id: 'slim', label: 'Slim', title: 'A slimmer silhouette',
    description: 'Explore a visibly slimmer waist, abdomen and upper arms in a clothed portrait.',
    primarySubject: 'cream T-shirt', secondarySubject: 'mauve',
    primarySource: '/examples/v3/slim-editorial.webp',
  },
  {
    id: 'muscle', label: 'Muscle', title: 'A more defined athletic look',
    description: 'Explore fuller shoulders, chest and upper arms for a more defined athletic silhouette.',
    primarySubject: 'athletic tank top', secondarySubject: 'blue T-shirt',
    primarySource: '/examples/v3/muscle-editorial.webp',
  },
  {
    id: 'proportions', label: 'Proportions', title: 'A clearer waist-to-hip balance',
    description: 'Explore a more defined waist and balanced hip line with a clear contrast in the overall silhouette.',
    primarySubject: 'navy jumpsuit', secondarySubject: 'sage',
    primarySource: '/examples/v3/proportions-editorial.webp',
  },
] as const;

async function visit(page: Page, path = '/') {
  await page.goto(path, { timeout: TIMEOUTS.navigation });
  // Session resolution provides a stable signal that the interactive page hydrated.
  await expect(page.locator('header a[href="/signin"]')).toHaveCount(1);
}

async function expectDecoded(image: Locator) {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await image.evaluate((node) => (node as HTMLImageElement).decode());
}

async function expectUploadControlsInViewport(page: Page) {
  const editor = page.locator('#try');
  const viewport = page.viewportSize()!;
  const header = (await page.locator('header').boundingBox())!;
  const controls = [
    editor.getByRole('heading', { level: 1 }), editor.getByRole('button', { name: 'Upload a photo to edit', exact: true }),
    ...await editor.locator('fieldset label').all(),
    editor.getByRole('button', { name: 'Edit Photo', exact: true }),
    editor.getByText(AVAILABILITY, { exact: true }),
  ];
  expect(controls).toHaveLength(8);
  for (const control of controls) {
    await expect(control).toBeVisible();
    const box = (await control.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  }
}

async function preventMutations(page: Page) {
  const requests: string[] = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (new URL(request.url()).pathname === '/api/body-edit/guest-session') return route.fulfill({ json: { ownerId: 'guest:preview', remaining: 1 } });
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) {
      requests.push(`${request.method()} ${request.url()}`);
      await route.abort('blockedbyclient');
    } else {
      await route.continue();
    }
  });
  return requests;
}

async function expectPhotoHalf(image: Locator, side: 'original' | 'edited') {
  const framing = await image.evaluate((node) => {
    const photo = node as HTMLImageElement;
    const style = getComputedStyle(photo);
    const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
    return {
      width: parseFloat(style.width), parentWidth: parseFloat(getComputedStyle(photo.parentElement!).width),
      transform: style.transform, shiftX: matrix.m41, shiftY: matrix.m42, scaleX: matrix.m11, scaleY: matrix.m22,
    };
  });
  expect(framing.width).toBeCloseTo(framing.parentWidth * 2, 1);
  expect(framing.shiftY).toBe(0);
  expect(framing.scaleX).toBe(1);
  expect(framing.scaleY).toBe(1);
  if (side === 'original') {
    expect(framing.transform).toBe('none');
    expect(framing.shiftX).toBe(0);
  } else {
    expect(framing.shiftX).toBeCloseTo(-framing.width / 2, 1);
  }
}

async function expectComparisonDirection(comparison: Locator, source: string, screenshotPrefix?: string) {
  const range = comparison.getByRole('slider');
  const original = comparison.locator('img[alt^="Original"]');
  const edited = comparison.locator('img[alt^="Edited"]');
  const originalLabel = comparison.getByText('Original concept', { exact: true });
  const editedLabel = comparison.getByText('Edited concept', { exact: true });
  const clip = comparison.locator('[data-comparison-before]');
  for (const image of [original, edited]) await expect(image).toHaveAttribute('src', source);
  await expectPhotoHalf(original, 'original');
  await expectPhotoHalf(edited, 'edited');
  await expect(range).toHaveValue('50');
  await expect(clip).toHaveCSS('clip-path', 'inset(0px 50% 0px 0px)');
  await expect(originalLabel).toBeVisible();
  await expect(editedLabel).toBeVisible();

  await range.press('Home');
  await expect(range).toHaveValue('0');
  await expect(clip).toHaveCSS('clip-path', 'inset(0px 100% 0px 0px)');
  await expect(originalLabel).toBeHidden();
  await expect(editedLabel).toBeVisible();
  if (screenshotPrefix) await comparison.screenshot({ path: `${screenshotPrefix}-edited.png` });

  await range.press('End');
  await expect(range).toHaveValue('100');
  await expect(clip).toHaveCSS('clip-path', 'inset(0px 0% 0px 0px)');
  await expect(originalLabel).toBeVisible();
  await expect(editedLabel).toBeHidden();
  if (screenshotPrefix) await comparison.screenshot({ path: `${screenshotPrefix}-original.png` });

  const frame = (await range.boundingBox())!;
  await range.click({ position: { x: frame.width / 2, y: frame.height / 2 } });
  await expect(range).toHaveValue('50');
  await expect(clip).toHaveCSS('clip-path', 'inset(0px 50% 0px 0px)');
  await expect(originalLabel).toBeVisible();
  await expect(editedLabel).toBeVisible();
  if (screenshotPrefix) await comparison.screenshot({ path: `${screenshotPrefix}-compare.png` });
}

test.describe('Upload-first homepage and honest local previews', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/body-edit/guest-session', route => route.fulfill({ json: { ownerId: 'guest:preview', remaining: 1 } }));
  });
  test('SSR contains the primary photo, original alt, concepts and SEO links', async ({ page, request }) => {
    const response = await request.get('/?campaign=preview', {
      headers: { 'Accept-Language': 'zh-CN,zh;q=0.9' },
    });
    expect(response.status()).toBe(200);
    const rendered = await page.evaluate((html) => {
      const document = new DOMParser().parseFromString(html, 'text/html');
      const text = (selector: string) => document.querySelector(selector)?.textContent?.trim() ?? '';
      return {
        h1: Array.from(document.querySelectorAll('h1'), (node) => node.textContent?.trim()),
        hero: text('#home-hero'), editor: text('#try'), pricing: text('#pricing'), faq: text('#faq'),
        canonical: Array.from(document.querySelectorAll('head link[rel="canonical"]'), (node) => node.getAttribute('href')),
        keywords: document.querySelectorAll('head meta[name="keywords"]').length,
        images: Array.from(document.querySelectorAll('img[src^="/examples/"]'), (node) => ({
          src: node.getAttribute('src'), alt: node.getAttribute('alt'),
        })),
        heroImages: Array.from(document.querySelectorAll('#hero-showcase img'), (node) => ({
          src: node.getAttribute('src'), alt: node.getAttribute('alt'), loading: node.getAttribute('loading'),
        })),
        toolsOpen: document.querySelector('header details')?.hasAttribute('open'),
        headerLinks: Array.from(document.querySelectorAll('header details a'), (node) => ({
          href: node.getAttribute('href'), text: node.textContent?.trim(),
        })),
        guideLinks: Array.from(document.querySelectorAll('#tools a'), (node) => ({
          href: node.getAttribute('href'), text: node.textContent?.trim(),
        })),
        jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), (node) => JSON.parse(node.textContent ?? 'null')),
      };
    }, await response.text());

    expect(rendered.h1).toEqual(['AI Body Editor']);
    expect(rendered.canonical).toEqual([SITE_URL]);
    expect(rendered.keywords).toBe(0);
    expect(rendered.hero).toContain(CONCEPT_LABEL);
    expect(rendered.hero).not.toContain(CONCEPT_NOTICE);
    expect(rendered.hero).not.toContain(SAMPLE_NOTICE);
    expect(rendered.hero).toContain(AVAILABILITY);
    expect(rendered.editor).toContain(AVAILABILITY);
    expect(rendered.pricing).toContain('Try one guest edit free without signing in. Further edits require an account with credits.');
    expect(rendered.faq).not.toContain('coming soon');
    expect(rendered.faq).toContain('compare and download');
    expect(rendered.heroImages).toHaveLength(2);
    for (const image of rendered.heroImages) {
      expect(image.src).toBe(MODES[0].primarySource);
      expect(image.alt).toContain('cream T-shirt');
      expect(image.loading).toBe('eager');
    }
    const expectedAssets = MODES.flatMap((mode) => [
      mode.primarySource, `/examples/v3/${mode.id}-lifestyle.webp`,
    ]).sort();
    expect([...new Set(rendered.images.map((image) => image.src))].sort()).toEqual(expectedAssets);
    for (const image of rendered.images) {
      expect(image.alt?.length).toBeGreaterThan(70);
      expect(image.alt).toMatch(/^(Original|Edited) (Slim|Muscle|Proportions) concept:/);
    }
    const tools = [
      { href: '/body-editor', text: 'Body Editor' },
      { href: '/skinny-filter', text: 'Skinny Filter' },
      { href: '/breast-expansion', text: 'AI Breast Expansion' },
    ];
    expect(rendered.toolsOpen).toBe(false);
    expect(rendered.headerLinks).toEqual(tools);
    expect(rendered.guideLinks).toEqual(expect.arrayContaining(tools));
    const application = rendered.jsonLd.find((item) => item['@type'] === 'SoftwareApplication');
    expect(application).toMatchObject({ '@id': `${SITE_URL}#editor`, name: 'AI Body Editor', url: SITE_URL });
    expect(application.aggregateRating).toBeUndefined();
    expect((application.offers ?? []).some((offer: { name?: string }) => offer.name === 'Planned free trial')).toBe(false);
    const prefixed = await request.get('/en', { maxRedirects: 0 });
    expect(prefixed.status()).toBe(301);
    const target = new URL(prefixed.headers().location, prefixed.url());
    expect(target.origin).toBe(new URL(prefixed.url()).origin);
    expect(`${target.pathname}${target.search}${target.hash}`).toBe('/');
  });

  test('upload comes first while the concept photo remains available on desktop and mobile', async ({ page }) => {
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await visit(page);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI Body Editor');
      await expectUploadControlsInViewport(page);
      const showcase = page.locator('#hero-showcase');
      await expect(showcase.getByText(CONCEPT_LABEL, { exact: true })).toBeVisible();
      const control = showcase.getByRole('slider', { name: COMPARE_LABEL, exact: true });
      const frame = await control.boundingBox();
      expect(frame).not.toBeNull();
      expect(frame!.y).toBeGreaterThanOrEqual(0);
      if (viewport.width >= 1024) expect(frame!.y + Math.min(100, frame!.height)).toBeLessThan(viewport.height);
      await showcase.scrollIntoViewIfNeeded();
      for (const image of await showcase.getByRole('img').all()) await expectDecoded(image);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.screenshot({
        path: viewport.width === 1280
          ? 'test-results/upload-first-homepage/home-desktop.png'
          : 'test-results/upload-first-homepage/home-mobile.png',
        fullPage: false,
      });
    }
  });

  test('the three hero controls change the photo, caption and editor mode', async ({ page }) => {
    const requests = await preventMutations(page);
    await visit(page);
    const showcase = page.locator('#hero-showcase');
    const group = showcase.getByRole('group', { name: 'Explore editing concepts', exact: true });
    await expect(group.getByRole('button')).toHaveCount(3);
    await expect(group.getByRole('button', { name: 'Slim', exact: true })).toHaveAttribute('aria-pressed', 'true');
    for (const mode of [MODES[1], MODES[2], MODES[0]]) {
      await group.getByRole('button', { name: mode.label, exact: true }).click();
      for (const other of MODES) {
        await expect(group.getByRole('button', { name: other.label, exact: true })).toHaveAttribute('aria-pressed', String(other.id === mode.id));
      }
      await expect(showcase.locator('[data-mode-caption]')).toContainText(mode.title);
      await expect(showcase.locator('[data-mode-caption]')).toHaveText(mode.title);
      for (const image of await showcase.getByRole('img').all()) {
        await expect(image).toHaveAttribute('src', mode.primarySource);
        await expect(image).toHaveAttribute('alt', new RegExp(mode.primarySubject));
        await expectDecoded(image);
      }
      await expect(page.locator(`#try input[type="radio"][value="${mode.id}"]`)).toBeChecked();
    }
    expect(requests).toEqual([]);
  });

  test('the native comparison supports keyboard focus and keeps both portraits aligned', async ({ page }) => {
    await visit(page);
    const showcase = page.locator('#hero-showcase');
    const range = showcase.getByRole('slider', { name: COMPARE_LABEL, exact: true });
    await expect(range).toHaveAttribute('type', 'range');
    await expect(range).toHaveValue('50');
    await range.focus();
    await range.press('Home');
    await expect(range).toHaveValue('0');
    await range.press('ArrowRight');
    await expect(range).toHaveValue('1');
    await range.press('End');
    await expect(range).toHaveValue('100');
    await range.press('ArrowLeft');
    await expect(range).toHaveValue('99');
    await expect(range).toBeFocused();
    await expect(range).toHaveAttribute('aria-valuetext', '99% Original concept');
    await expect(showcase.locator('[data-comparison-before]')).toHaveCSS('clip-path', 'inset(0px 1% 0px 0px)');
    expect(await range.evaluate((node) => getComputedStyle(node.parentElement!).boxShadow)).not.toBe('none');
    const dimensions = await showcase.locator('img').evaluateAll((images) => images.map((image) => {
      const rect = image.getBoundingClientRect();
      const photo = image as HTMLImageElement;
      return { width: rect.width, height: rect.height, naturalRatio: photo.naturalWidth / photo.naturalHeight };
    }));
    expect(dimensions).toHaveLength(2);
    expect(dimensions[0].width).toBeCloseTo(dimensions[1].width, 1);
    expect(dimensions[0].height).toBeCloseTo(dimensions[1].height, 1);
    for (const image of dimensions) expect(image.width / image.height).toBeCloseTo(image.naturalRatio, 2);
    await expect(showcase.getByText('Original concept', { exact: true })).toBeVisible();
    await expect(showcase.getByText('Edited concept', { exact: true })).toBeVisible();
  });

  test('comparison endpoints preserve original-left and edited-right through mode changes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await visit(page);
    const showcase = page.locator('#hero-showcase');
    const group = showcase.getByRole('group', { name: 'Explore editing concepts', exact: true });
    for (const mode of [MODES[0], MODES[1], MODES[2], MODES[0]]) {
      await group.getByRole('button', { name: mode.label, exact: true }).click();
      for (const image of await showcase.getByRole('img').all()) await expectDecoded(image);
      await expectComparisonDirection(showcase, mode.primarySource,
        mode.id === 'slim' ? 'test-results/concept-direction/slim' : undefined);
    }
    for (const mode of MODES) {
      const example = page.locator(`#examples figure[data-secondary-mode="${mode.id}"]`);
      await example.scrollIntoViewIfNeeded();
      for (const image of await example.getByRole('img').all()) await expectDecoded(image);
      await expectComparisonDirection(example, `/examples/v3/${mode.id}-lifestyle.webp`);
    }
  });

  test('cards, closeups and samples use the current primary image with the original half by default', async ({ page }) => {
    const requests = await preventMutations(page);
    await visit(page);
    await expect(page.locator('img[src="/examples/v2/slim-editorial.webp"]')).toHaveCount(0);
    for (const mode of MODES) {
      const card = page.locator(`#features article[data-showcase-mode="${mode.id}"]`);
      await card.scrollIntoViewIfNeeded();
      const original = card.locator('img[alt^="Original"]');
      const edited = card.locator('img[alt^="Edited"]');
      await expect(original).toHaveAttribute('src', mode.primarySource);
      await expect(edited).toHaveAttribute('src', mode.primarySource);
      await expectPhotoHalf(original, 'original');
      await expectPhotoHalf(edited, 'edited');

      const sample = page.locator('#samples').getByRole('link', { name: `Preview ${mode.label}`, exact: true });
      await sample.scrollIntoViewIfNeeded();
      await expect(sample.getByRole('img')).toHaveAttribute('src', mode.primarySource);
      await expectPhotoHalf(sample.getByRole('img'), 'original');
      await sample.click();
      const preview = page.locator('#try').getByRole('img', { name: 'Preview of the photo you selected', exact: true });
      await expect(preview).toHaveAttribute('src', /^blob:/);
      await expectDecoded(preview);
    }
    for (const mode of [MODES[0], MODES[1]]) {
      const original = page.locator(`#details img[alt^="Original ${mode.label} concept:"]`);
      const edited = page.locator(`#details img[alt^="Edited ${mode.label} concept:"]`);
      await original.scrollIntoViewIfNeeded();
      await expect(original).toHaveAttribute('src', mode.primarySource);
      await expect(edited).toHaveAttribute('src', mode.primarySource);
      await expectPhotoHalf(original, 'original');
      await expectPhotoHalf(edited, 'edited');
    }
    expect(requests).toEqual([]);
  });

  test('a phone touch gesture changes the native comparison position', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    try {
      await visit(page);
      const range = page.locator('#hero-showcase').getByRole('slider', { name: COMPARE_LABEL, exact: true });
      await range.scrollIntoViewIfNeeded();
      const frame = (await range.boundingBox())!;
      const session = await context.newCDPSession(page);
      const point = (fraction: number) => ({ x: frame.x + frame.width * fraction, y: frame.y + frame.height / 2 });
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(0.5)] });
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(0.8)] });
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect.poll(async () => Number(await range.inputValue())).toBeGreaterThan(65);
      await range.tap({ position: { x: frame.width * 0.2, y: frame.height / 2 } });
      await expect.poll(async () => Number(await range.inputValue())).toBeLessThan(35);
      await session.detach();
    } finally {
      await context.close();
    }
  });

  test('all six photo resources decode with distinct subjects and proportional framing', async ({ page }) => {
    await visit(page);
    const decodedSources = new Set<string>();
    for (const mode of MODES) {
      const card = page.locator(`#features article[data-showcase-mode="${mode.id}"]`);
      await card.scrollIntoViewIfNeeded();
      await expect(card.getByRole('heading', { level: 3 })).toHaveText(mode.title);
      await expect(card.getByText(mode.description, { exact: true })).toBeVisible();
      const example = page.locator(`#examples figure[data-secondary-mode="${mode.id}"]`);
      for (const [container, source, subject] of [
        [card, mode.primarySource, mode.primarySubject],
        [example, `/examples/v3/${mode.id}-lifestyle.webp`, mode.secondarySubject],
      ] as const) {
        await container.scrollIntoViewIfNeeded();
        await expect(container.getByRole('img')).toHaveCount(2);
        for (const image of await container.getByRole('img').all()) {
          await expect(image).toHaveAttribute('src', source);
          await expect(image).toHaveAttribute('alt', new RegExp(subject));
          await expectDecoded(image);
          const framing = await image.evaluate((node) => {
            const photo = node as HTMLImageElement;
            const rect = photo.getBoundingClientRect();
            return { displayed: rect.width / rect.height, natural: photo.naturalWidth / photo.naturalHeight };
          });
          expect(framing.displayed).toBeCloseTo(framing.natural, 2);
          decodedSources.add((await image.getAttribute('src'))!);
        }
      }
      await expect(example.getByRole('slider')).toHaveAttribute('aria-label', `${mode.label}: ${COMPARE_LABEL}`);
    }
    expect(decodedSources.size).toBe(6);
    await expect(page.locator('#features').getByText(CONCEPT_NOTICE, { exact: true })).toBeVisible();
    await expect(page.locator('#examples').getByText(CONCEPT_NOTICE, { exact: true })).toBeVisible();
  });

  test('primary and lifestyle sample links carry their photo and mode into the editor', async ({ page }) => {
    const requests = await preventMutations(page);
    await visit(page);
    const editor = page.locator('#try [data-body-editor]');
    const preview = editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true });
    for (const mode of MODES) {
      for (const [selector, attribute] of [
        ['#features article', 'data-showcase-mode'],
        ['#examples figure', 'data-secondary-mode'],
      ] as const) {
        const container = page.locator(`${selector}[${attribute}="${mode.id}"]`);
        const link = container.getByRole('link', { name: `Preview ${mode.label}`, exact: true });
        await expect(link).toHaveAttribute('href', '#try');
        const previousPreview = await preview.count() ? await preview.getAttribute('src') : null;
        await link.click();
        await expect(page).toHaveURL(/\/#try$/);
        await expect(preview).toHaveAttribute('src', /^blob:/);
        if (previousPreview) await expect(preview).not.toHaveAttribute('src', previousPreview);
        await expectDecoded(preview);
        await expect(editor.getByRole('radio', { name: mode.label, exact: true })).toBeChecked();
        await expect(editor.getByRole('button', { name: 'Clear sample', exact: true })).toHaveCount(0);
        await expect(editor.getByText(SAMPLE_NOTICE, { exact: true })).toHaveCount(0);
        await expect(editor.getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled();
        await expect(editor.getByText(AVAILABILITY, { exact: true })).toBeVisible();
      }
    }
    expect(requests).toEqual([]);
  });

  test('samples and local files can replace one another without uploads', async ({ page }) => {
    const requests = await preventMutations(page);
    await visit(page);
    const editor = page.locator('#try [data-body-editor]');
    const samples = page.locator('#samples');
    const input = editor.getByLabel('Upload a photo to edit', { exact: true });
    const preview = editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true });
    const clear = editor.getByRole('button', { name: 'Clear sample', exact: true });

    for (const mode of MODES) {
      const link = samples.getByRole('link', { name: `Preview ${mode.label}`, exact: true });
      const previousPreview = await preview.count() ? await preview.getAttribute('src') : null;
      await link.click();
      await expect(link).toHaveAttribute('aria-current', 'true');
      await expect(editor.getByRole('radio', { name: mode.label, exact: true })).toBeChecked();
      await expect(preview).toHaveAttribute('src', /^blob:/);
      if (previousPreview) await expect(preview).not.toHaveAttribute('src', previousPreview);
      await expectDecoded(preview);
    }
    const sampleBlob = await preview.getAttribute('src');
    await editor.locator('fieldset').getByText('Muscle', { exact: true }).click();
    await expect(editor.getByRole('radio', { name: 'Muscle', exact: true })).toBeChecked();
    await expect(preview).toHaveAttribute('src', sampleBlob!);
    await expect(clear).toHaveCount(0);
    await expect(editor.getByText(SAMPLE_NOTICE, { exact: true })).toHaveCount(0);

    await input.setInputFiles({ name: 'local-preview.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
    await expect(preview).toHaveAttribute('alt', 'Preview of the photo you selected');
    await expect(preview).toHaveAttribute('src', /^blob:/);
    await expectDecoded(preview);
    const firstBlob = await preview.getAttribute('src');
    await expect(clear).toHaveCount(0);
    await expect(samples.locator('a[aria-current="true"]')).toHaveCount(0);
    await input.setInputFiles({ name: 'replacement-preview.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
    await expect(preview).not.toHaveAttribute('src', firstBlob!);
    await expect(preview).toHaveAttribute('src', /^blob:/);
    await expectDecoded(preview);

    const uploadedBlob = await preview.getAttribute('src');
    await samples.getByRole('link', { name: 'Preview Muscle', exact: true }).click();
    await expect(preview).toHaveAttribute('src', /^blob:/);
    await expect(preview).not.toHaveAttribute('src', uploadedBlob!);
    await expectDecoded(preview);
    await expect(input).toHaveValue('');
    await expect(clear).toHaveCount(0);
    await expect(editor.getByText(SAMPLE_NOTICE, { exact: true })).toHaveCount(0);
    await expect(editor.getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled();
    await expect(samples.getByText(SAMPLE_NOTICE, { exact: true })).toHaveCount(0);
    expect(requests, 'Concept and file previews must never upload or create an edit task').toEqual([]);
  });

  test('header, pricing and closing CTAs reach the same usable hero editor', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await visit(page);
    await expect(page.locator('#home-hero').getByRole('link', { name: 'Edit a photo', exact: true })).toHaveCount(0);
    for (const container of ['header', '#pricing', '#tools']) {
      const link = page.locator(container).getByRole('link', { name: 'Edit a photo', exact: true }).first();
      await expect(link).toHaveAttribute('href', '#try');
      await link.click();
      await expect(page).toHaveURL(/\/#try$/);
      await expect(page.locator('#try').getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('#try').getByLabel('Upload a photo to edit', { exact: true })).toBeAttached();
      await expect(page.locator('#try').getByRole('radio')).toHaveCount(4);
    }
  });

  test('320, 390, 768 and 1280px layouts stay inside the viewport', async ({ page }) => {
    for (const width of [320, 390, 768, 1280]) {
      await test.step(`${width}px`, async () => {
        await page.setViewportSize({ width, height: 900 });
        await visit(page);
        for (const section of ['#home-hero', '#features', '#try', '#samples', '#examples', '#details', '#pricing', '#faq', '#tools']) {
          await page.locator(section).scrollIntoViewIfNeeded();
          const size = await page.evaluate(() => ({
            content: document.documentElement.scrollWidth,
            viewport: document.documentElement.clientWidth,
          }));
          expect(size.content, `${section} at ${width}px must not overflow`).toBeLessThanOrEqual(size.viewport + 1);
        }
        const modes = page.locator('#hero-showcase').getByRole('group').getByRole('button');
        for (const button of await modes.all()) {
          const box = (await button.boundingBox())!;
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
        await page.locator('#faq summary').first().click();
        await expect(page.locator('#faq details').first()).toHaveJSProperty('open', true);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
  });

  test('the only file input and editor are in the hero with desktop controls fully visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await visit(page);
    await expect(page.locator('#try')).toHaveCount(1);
    await expect(page.locator('input[type="file"]')).toHaveCount(1);
    await expect(page.locator('#home-hero #try input[type="file"]')).toHaveCount(1);
    await expect(page.locator('#home-hero h2')).toHaveText('Try a sample photo');
    await expectUploadControlsInViewport(page);
    const editor = (await page.locator('#try').boundingBox())!;
    const concept = (await page.locator('#hero-showcase').boundingBox())!;
    expect(editor.x + editor.width).toBeLessThan(concept.x);
    expect(Math.abs(editor.y - concept.y)).toBeLessThanOrEqual(2);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('320, 390 and 768px put the complete upload controls before the concept photo', async ({ page }) => {
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await visit(page);
      await expectUploadControlsInViewport(page);
      const follows = await page.locator('#try').evaluate((editor) => {
        const concept = document.querySelector('#hero-showcase')!;
        return Boolean(editor.compareDocumentPosition(concept) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      expect(follows).toBe(true);
      const editor = (await page.locator('#try').boundingBox())!;
      const concept = (await page.locator('#hero-showcase').boundingBox())!;
      expect(concept.y).toBeGreaterThanOrEqual(editor.y + editor.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
  });

  test('mode changes preserve a selected local file and sample links return to the hero without uploads', async ({ page }) => {
    const requests = await preventMutations(page);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await visit(page);
      const editor = page.locator('#try');
      const input = editor.getByLabel('Upload a photo to edit', { exact: true });
      const preview = editor.getByRole('img', { name: 'Preview of the photo you selected', exact: true });
      await input.setInputFiles({ name: 'keep-local-preview.png', mimeType: 'image/png', buffer: PREVIEW_PNG });
      await expectDecoded(preview);
      const blob = await preview.getAttribute('src');
      expect(blob).toMatch(/^blob:/);
      for (const mode of MODES) {
        await editor.locator('fieldset').getByText(mode.label, { exact: true }).click();
        await expect(preview).toHaveAttribute('src', blob!);
        await page.locator('#hero-showcase').getByRole('button', { name: mode.label, exact: true }).click();
        await expect(preview).toHaveAttribute('src', blob!);
        await expect(editor.getByRole('radio', { name: mode.label, exact: true })).toBeChecked();
        expect(await input.evaluate((node) => (node as HTMLInputElement).files?.[0]?.name)).toBe('keep-local-preview.png');
      }
      for (const mode of MODES) {
        const link = page.locator('#samples').getByRole('link', { name: `Preview ${mode.label}`, exact: true });
        await expect(link).toHaveAttribute('href', '#try');
        await link.click();
        await expect(page).toHaveURL(/\/#try$/);
        await expect(link).toHaveAttribute('aria-current', 'true');
        await expect(page.locator('#samples a[aria-current="true"]')).toHaveCount(1);
        await expect(preview).toHaveAttribute('src', /^blob:/);
        await expect(input).toHaveValue('');
        await expect(editor.getByRole('radio', { name: mode.label, exact: true })).toBeChecked();
        const header = (await page.locator('header').boundingBox())!;
        await expect.poll(async () => {
          const top = (await editor.boundingBox())!.y;
          return top >= header.y + header.height && top <= 128;
        }, { message: 'Sample links must finish scrolling the hero beneath the header' }).toBe(true);
        await expectUploadControlsInViewport(page);
      }
    }
    expect(requests, 'Changing modes and jumping from samples must not upload the local file').toEqual([]);
  });
});
