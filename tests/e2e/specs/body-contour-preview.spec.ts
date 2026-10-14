import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const tinyPhoto = readFileSync(resolve('apps/tanstack-app/public/favicon-32x32.png'));
const editor = (page: Page) => page.locator('[data-body-editor]');
const input = (page: Page) => page.getByLabel('Upload a photo to edit', { exact: true });
const target = (page: Page) => page.locator('[data-contour-target]');
const fixture = {
  width: 100, height: 160,
  landmarks: Array.from({ length: 33 }, (_, i) => ({ x: i % 2 ? .35 : .65, y: i < 11 ? .1 : i < 13 ? .23 : i < 15 ? .4 : i < 23 ? .5 : i < 25 ? .55 : i < 27 ? .75 : .95, visibility: .99 })),
  contours: [[{ x: .45, y: .04 }, { x: .55, y: .04 }, { x: .6, y: .19 }, { x: .7, y: .23 }, { x: .75, y: .4 }, { x: .7, y: .55 }, { x: .65, y: .5 }, { x: .65, y: .7 }, { x: .6, y: .98 }, { x: .53, y: .98 }, { x: .5, y: .65 }, { x: .47, y: .98 }, { x: .4, y: .98 }, { x: .35, y: .7 }, { x: .35, y: .5 }, { x: .3, y: .55 }, { x: .25, y: .4 }, { x: .3, y: .23 }, { x: .4, y: .19 }]],
};

async function openEditor(page: Page) {
  let posts = 0;
  await page.route('**/api/auth/**', route => route.fulfill({ json: null }));
  await page.route('**/api/body-edit**', route => {
    if (route.request().method() === 'POST') posts++;
    return route.fulfill({ json: { available: true, costCredits: 15, freeTrialEdits: 1 } });
  });
  await page.goto('/');
  await expect(editor(page).getByRole('button', { name: 'Edit my photo', exact: true })).toBeEnabled();
  return () => posts;
}

async function mockAnalysis(page: Page, body?: string) {
  await page.route('**/body-preview/worker.js', route => route.fulfill({ contentType: 'application/javascript', body: body ?? `self.onmessage=()=>self.postMessage({type:'result',analysis:${JSON.stringify(fixture)}});` }));
}

async function selectPhoto(page: Page, name = 'portrait.png') {
  await input(page).setInputFiles({ name, mimeType: 'image/png', buffer: tinyPhoto });
}

test.describe('Live local body contour preview', () => {
  for (const asset of ['muscle-editorial.webp', 'slim-editorial-v2.webp']) {
    test(`real local inference on ${asset} updates all modes without generating`, async ({ page }) => {
      test.setTimeout(70_000);
      let workers = 0;
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (request.url().endsWith('/body-preview/worker.js')) workers++; });
      const posts = await openEditor(page);
      expect(workers).toBe(0);
      const source = resolve('apps/tanstack-app/public/examples/v2', asset);
      const metadata = await sharp(source).metadata();
      const photo = await sharp(source).extract({ left: 0, top: 0, width: Math.floor(metadata.width! / 2), height: metadata.height! }).png().toBuffer();
      await input(page).setInputFiles({ name: 'adult-portrait.png', mimeType: 'image/png', buffer: photo });
      await expect(target(page)).toBeVisible({ timeout: 50_000 });
      const original = await page.locator('[data-contour-original]').getAttribute('d');
      expect(original!.length).toBeGreaterThan(1000);
      const values: string[] = [];
      for (const mode of ['Slim', 'Muscle', 'Proportions', 'Breast']) {
        await editor(page).getByText(mode, { exact: true }).click();
        const slider = editor(page).getByRole('slider', { name: 'Intensity', exact: true });
        await slider.fill('20');
        const low = await target(page).getAttribute('d');
        await slider.fill('90');
        await expect(target(page)).not.toHaveAttribute('d', low!);
        values.push((await target(page).getAttribute('d'))!);
        await expect(page.locator('[data-contour-original]')).toHaveAttribute('d', original!);
      }
      expect(new Set(values).size).toBe(4);
      expect(workers).toBe(1);
      expect(posts()).toBe(0);
      expect(errors).toEqual([]);
      await page.locator('[data-body-contour-preview]').screenshot({ path: `test-results/contour-real-${asset}.png` });
    });
  }

  test('hide, align with keyboard/pointer and reset reuse analysis and never open the file picker', async ({ page }) => {
    let workers = 0, pickers = 0;
    page.on('request', request => { if (request.url().endsWith('/body-preview/worker.js')) workers++; });
    page.on('filechooser', () => pickers++);
    await mockAnalysis(page);
    const posts = await openEditor(page);
    await selectPhoto(page);
    await expect(target(page)).toBeVisible();
    const initial = await target(page).getAttribute('d');
    await editor(page).getByRole('button', { name: 'Hide outline', exact: true }).click();
    await expect(target(page)).toHaveCount(0);
    await editor(page).getByRole('button', { name: 'Show outline', exact: true }).click();
    await expect(target(page)).toHaveAttribute('d', initial!);
    await editor(page).getByRole('button', { name: 'Adjust outline alignment', exact: true }).click();
    const handle = page.getByRole('button', { name: 'Outline alignment: drag or use arrow keys', exact: true });
    await handle.press('ArrowRight');
    await expect(target(page)).not.toHaveAttribute('d', initial!);
    const circle = handle.locator('circle');
    const center = await circle.boundingBox();
    await page.mouse.move(center!.x + center!.width / 2, center!.y + center!.height / 2);
    await page.mouse.down(); await page.mouse.move(center!.x + center!.width / 2 + 15, center!.y + center!.height / 2 + 10); await page.mouse.up();
    await editor(page).getByRole('button', { name: 'Reset alignment', exact: true }).click();
    await expect(target(page)).toHaveAttribute('d', initial!);
    expect(workers).toBe(1); expect(posts()).toBe(0); expect(pickers).toBe(0);
  });

  test('replacing a photo cancels the old analysis and discards its late result', async ({ page }) => {
    await mockAnalysis(page, `self.onmessage=({data})=>setTimeout(()=>self.postMessage({type:'result',analysis:{...${JSON.stringify(fixture)},width:data.file.name==='old.png'?100:200}}),data.file.name==='old.png'?1200:20);`);
    const posts = await openEditor(page);
    await selectPhoto(page, 'old.png');
    await expect(editor(page).getByText('Finding your body outline…')).toBeVisible();
    await selectPhoto(page, 'new.png');
    await expect(page.locator('[data-contour-overlay]')).toHaveAttribute('viewBox', '0 0 200 160');
    await page.waitForTimeout(1400);
    await expect(page.locator('[data-contour-overlay]')).toHaveAttribute('viewBox', '0 0 200 160');
    expect(posts()).toBe(0);
  });

  for (const [code, copy] of [
    ['NO_PERSON', 'No clear body outline found. Try a clearer photo, or continue to generate.'],
    ['UNAVAILABLE', 'Outline preview is unavailable. You can still generate your edit.'],
  ]) {
    test(`${code} keeps photo and normal generation available`, async ({ page }) => {
      await mockAnalysis(page, `self.onmessage=()=>self.postMessage({type:'error',code:'${code}'});`);
      const posts = await openEditor(page);
      await selectPhoto(page);
      await expect(editor(page).getByText(copy, { exact: true })).toBeVisible();
      await expect(target(page)).toHaveCount(0);
      await expect(editor(page).getByRole('img', { name: 'Preview of the photo you selected', exact: true })).toBeVisible();
      await editor(page).getByRole('button', { name: 'Edit my photo', exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      expect(posts()).toBe(0);
    });
  }

  test('mobile slider and outline fit, and a new photo resets alignment', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockAnalysis(page);
    const posts = await openEditor(page);
    await selectPhoto(page);
    await expect(target(page)).toBeVisible();
    await editor(page).getByRole('button', { name: 'Adjust outline alignment', exact: true }).click();
    await page.getByRole('button', { name: 'Outline alignment: drag or use arrow keys', exact: true }).press('ArrowDown');
    await expect(editor(page).getByRole('button', { name: 'Reset alignment', exact: true })).toBeVisible();
    await selectPhoto(page, 'replacement.png');
    await expect(target(page)).toBeVisible();
    await expect(editor(page).getByRole('button', { name: 'Reset alignment', exact: true })).toHaveCount(0);
    await editor(page).getByText('Muscle', { exact: true }).click();
    const slider = editor(page).getByRole('slider', { name: 'Intensity', exact: true });
    const before = await target(page).getAttribute('d');
    await slider.press('End');
    await expect(slider).toHaveValue('100');
    await expect(target(page)).not.toHaveAttribute('d', before!);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(posts()).toBe(0);
  });
});
