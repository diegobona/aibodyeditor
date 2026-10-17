import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { en } from '../../../libs/i18n/locales/en';
import { enEditingTopics } from '../../../libs/i18n/locales/en-editing-topics';

const TOPICS = [
  { path: '/ai-muscle-generator', key: 'muscleGenerator', mode: 'muscle', intensity: 70, instructionCase: undefined, cases: ['muscle', 'shoulders', 'customCombination'] },
  { path: '/leg-lengthener', key: 'legLengthener', mode: 'proportions', intensity: 80, instructionCase: 'legProportions', cases: ['legProportions', 'proportions'] },
  { path: '/waist-slimmer', key: 'waistSlimmer', mode: 'slim', intensity: 70, instructionCase: 'waistOnly', cases: ['waistOnly', 'naturalSlim'] },
] as const;
const recipes = JSON.parse(readFileSync('apps/tanstack-app/public/examples/results-2026-10-16/provenance.json', 'utf8')) as { case: string; mode: string; intensity: number; instructions: string }[];
const png = readFileSync('apps/tanstack-app/public/favicon-32x32.png');
const jobId = '81000000-0000-4000-8000-000000000001';
const editor = (page: Page) => page.locator('[data-body-editor]');

async function fixture(page: Page) {
  const posts: FormData[] = [];
  await page.route('**/*', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    if (path.startsWith('/api/auth/')) return route.fulfill({ json: null });
    if (path === '/api/body-edit/guest-session') return route.fulfill({ json: { ownerId: 'guest:topic-fixture', remaining: 1 } });
    if (path === '/api/body-edit' && request.method() === 'GET') return route.fulfill({ json: { available: true, costCredits: 10, freeTrialEdits: 1 } });
    if (path === '/api/body-edit' && request.method() === 'POST') {
      const form = await new Request(request.url(), { method: 'POST', headers: request.headers(), body: request.postDataBuffer()! }).formData();
      posts.push(form);
      return route.fulfill({ json: { jobId, status: 'succeeded', result: { imageUrl: `/api/body-edit/${jobId}/image`, downloadUrl: `/api/body-edit/${jobId}/image?download=1`, mode: form.get('mode'), intensity: Number(form.get('intensity')) }, credits: { charged: 0, balance: 0 } } });
    }
    if (path === `/api/body-edit/${jobId}/image`) return route.fulfill({ contentType: 'image/png', body: png });
    if (path === '/body-preview/worker.js') return route.fulfill({ contentType: 'application/javascript', body: "self.onmessage=()=>self.postMessage({type:'error',code:'NO_PERSON'});" });
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) throw new Error(`Unexpected mutation: ${path}`);
    return route.continue();
  });
  return posts;
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  return value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
}

test('topic SSR has original content, exact FAQ/breadcrumb, real image alt and discoverable SEO', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const homepage = await (await request.get('/')).text();
  const titles: string[] = [], descriptions: string[] = [];
  for (const topic of TOPICS) {
    const response = await request.get(topic.path + '?utm_source=fixture');
    expect(response.status()).toBe(200);
    const html = await response.text(), copy = enEditingTopics[topic.key];
    expect(html.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(html).toContain(copy.hero.title);
    expect(html).toContain(copy.what.paragraphs[0].slice(0, 50));
    expect(strings(copy).join(' ').split(/\s+/).length).toBeGreaterThan(400);
    expect(html).toContain(`rel="canonical" href="https://aibodyeditor.net${topic.path}"`);
    expect(html).not.toContain('name="keywords"');
    expect(html).toContain(en.home.realResults[topic.cases[0]].beforeAlt);
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const faq = schemas.find(item => item['@type'] === 'FAQPage');
    expect(faq.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({ question: item.name, answer: item.acceptedAnswer.text }))).toEqual(copy.faq.items);
    const breadcrumb = schemas.find(item => item['@type'] === 'BreadcrumbList');
    expect(breadcrumb.itemListElement.map((item: { name: string }) => item.name)).toEqual([en.toolPages.common.homeName, copy.breadcrumb]);
    expect(sitemap).toContain(`https://aibodyeditor.net${topic.path}</loc>`);
    expect(homepage).toContain(`href="${topic.path}"`);
    titles.push(copy.metadata.title); descriptions.push(copy.metadata.description);
    for (const sibling of TOPICS.filter(item => item.path !== topic.path)) expect(html).toContain(`href="${sibling.path}"`);
  }
  expect(new Set(titles).size).toBe(3); expect(new Set(descriptions).size).toBe(3);
});

for (const topic of TOPICS) {
  test(`${topic.path} starts empty, tries exact recipes and submits fresh settings after upload`, async ({ page }) => {
    const posts = await fixture(page);
    await page.goto(topic.path);
    await expect(editor(page).getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled({ timeout: 15_000 });
    await expect(editor(page)).toHaveAttribute('data-photo-source', 'empty');
    await expect(editor(page).getByRole('img')).toHaveCount(0);
    await expect(editor(page).locator(`input[type=radio][value=${topic.mode}]`)).toBeChecked();
    await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue(String(topic.intensity));
    const initialInstructions = topic.instructionCase ? en.home.realResults[topic.instructionCase].instructions : '';
    if (initialInstructions) await expect(editor(page).locator('textarea')).toHaveValue(initialInstructions);
    else await expect(editor(page).getByRole('button', { name: 'Extra instructions (optional)', exact: true })).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-real-result]')).toHaveCount(topic.cases.length);
    for (const key of topic.cases) {
      const recipe = recipes.find(item => item.case === key)!;
      const article = page.locator(`[data-real-result=${key}]`);
      await article.getByRole('slider').fill('25');
      await expect(article.getByRole('slider')).toHaveValue('25');
      await article.getByRole('link', { name: new RegExp('^Try ') }).click();
      await expect(editor(page)).toHaveAttribute('data-photo-source', 'sample');
      await expect(editor(page).getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toBeVisible();
      await expect(editor(page).locator(`input[type=radio][value=${recipe.mode}]`)).toBeChecked();
      await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue(String(recipe.intensity));
      if (recipe.instructions) await expect(editor(page).locator('textarea')).toHaveValue(recipe.instructions);
      else await expect(editor(page).getByRole('button', { name: 'Extra instructions (optional)', exact: true })).toHaveAttribute('aria-expanded', 'false');
    }
    expect(posts).toHaveLength(0);
    const lastRecipe = recipes.find(item => item.case === topic.cases[topic.cases.length - 1])!;
    await page.getByLabel('Upload a photo to edit', { exact: true }).setInputFiles({ name: 'own.png', mimeType: 'image/png', buffer: png });
    await expect(editor(page)).toHaveAttribute('data-photo-source', 'local');
    await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue(String(lastRecipe.intensity));
    if (lastRecipe.instructions) await expect(editor(page).locator('textarea')).toHaveValue(lastRecipe.instructions);
    await editor(page).getByText('Breast', { exact: true }).click();
    await expect(editor(page).getByRole('radio', { name: 'Breast', exact: true })).toBeChecked();
    await editor(page).getByRole('slider', { name: 'Intensity', exact: true }).fill('37');
    const extra = editor(page).getByRole('button', { name: 'Extra instructions (optional)', exact: true });
    if (await extra.getAttribute('aria-expanded') !== 'true') await extra.click();
    await editor(page).locator('textarea').fill('Keep the same pose and outfit.');
    await editor(page).getByRole('button', { name: 'Edit Photo', exact: true }).click();
    await expect(editor(page).getByRole('link', { name: 'Download photo', exact: true })).toBeVisible();
    expect(posts).toHaveLength(1);
    expect(posts[0].get('mode')).toBe('breast'); expect(posts[0].get('intensity')).toBe('37');
    expect(posts[0].get('instructions')).toBe('Keep the same pose and outfit.');
    expect(Buffer.from(await (posts[0].get('image') as File).arrayBuffer())).toEqual(png);
  });
}

test('topic navigation and cases fit a narrow mobile viewport', async ({ page }) => {
  const posts = await fixture(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/waist-slimmer');
  await expect(editor(page).getByRole('button', { name: 'Edit Photo', exact: true })).toBeEnabled({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Open main menu', exact: true }).click();
  for (const topic of TOPICS) await expect(page.locator('header').getByRole('link', { name: enEditingTopics[topic.key].hero.title, exact: true })).toBeVisible();
  await page.locator('header').getByRole('link', { name: 'AI Muscle Generator', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI Muscle Generator');
  await expect(editor(page).locator('input[value=muscle]')).toBeChecked();
  await page.locator('[data-try-example=shoulders]').click();
  await expect(editor(page).getByRole('slider', { name: 'Intensity', exact: true })).toHaveValue('80');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: 'test-results/editing-topics/mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('#real-results').screenshot({ path: 'test-results/editing-topics/muscle-cases.png' });
  expect(posts).toHaveLength(0);
});
