import { describe, expect, test } from 'vitest';
import { getBodyEditTargets, volumeIncreaseToWidthScale } from '../../../config/body-editor-targets';
import { buildBodyContourPreview } from '../../../libs/body-preview/geometry';
import type { BodyPhotoAnalysis, PreviewPoint } from '../../../libs/body-preview/types';
import { buildBodyEditPrompt } from '../../../libs/ai/body-edit-prompts';

const modes = ['slim', 'muscle', 'proportions', 'breast'] as const;
function analysis(): BodyPhotoAnalysis {
  const landmarks = Array.from({ length: 33 }, () => ({ x: .5, y: .15, visibility: 1 }));
  for (const [index, x, y] of [[11,.35,.25],[12,.65,.25],[13,.25,.45],[14,.75,.45],[23,.4,.55],[24,.6,.55],[25,.4,.75],[26,.6,.75],[27,.4,.95],[28,.6,.95]]) {
    landmarks[index] = { x, y, visibility: 1 };
  }
  // Contour includes head, shoulder, chest, waist, hip, leg and foot samples.
  const left: PreviewPoint[] = [
    {x:.5,y:.05},{x:.43,y:.1},{x:.43,y:.2},{x:.3,y:.25},
    {x:.25,y:.33},{x:.22,y:.4},{x:.25,y:.45},{x:.35,y:.34},
    {x:.37,y:.46},{x:.35,y:.55},{x:.34,y:.65},{x:.35,y:.75},
    {x:.36,y:.9},{x:.34,y:.95},{x:.32,y:.99},
  ];
  return { width: 800, height: 1200, landmarks, contours: [left.concat(left.slice().reverse().map(p => ({ x: 1 - p.x, y: p.y })))] };
}
const coordinates = (path: string) => [...path.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(match => ({x:Number(match[1]),y:Number(match[2])}));
const displacement = (original: string, target: string) => {
  const before = coordinates(original), after = coordinates(target);
  return before.reduce((sum, point, i) => sum + Math.hypot(point.x-after[i].x,point.y-after[i].y),0);
};

describe('real-photo target contour', () => {
  test.each(modes)('%s uses the detected contour and preserves its image coordinate system', mode => {
    const photo = analysis();
    const result = buildBodyContourPreview(photo, mode, 70);
    coordinates(result.originalPath).forEach((point,index) => {
      expect(point.x).toBeCloseTo(photo.contours[0][index].x*800,2);
      expect(point.y).toBeCloseTo(photo.contours[0][index].y*1200,2);
    });
    expect(coordinates(result.targetPath)).toHaveLength(photo.contours[0].length);
    expect(displacement(result.originalPath, result.targetPath)).toBeGreaterThan(1);
    for (const point of coordinates(result.targetPath)) {
      expect(Number.isFinite(point.x) && Number.isFinite(point.y)).toBe(true);
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(800);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(1200);
    }
  });

  test.each(modes)('%s stays unchanged above shoulders and at feet at every strength', mode => {
    for (const strength of [1,25,70,100]) {
      const result = buildBodyContourPreview(analysis(), mode, strength);
      const before = coordinates(result.originalPath), after = coordinates(result.targetPath);
      before.forEach((point,index) => {
        if (point.y < .25*1200 || point.y >= .95*1200) expect(after[index]).toEqual(point);
      });
    }
  });

  test.each(modes)('%s increases total contour displacement continuously with strength', mode => {
    const photo = analysis();
    let previous = 0;
    for (let value = 1; value <= 100; value++) {
      const result = buildBodyContourPreview(photo,mode,value);
      const change = displacement(result.originalPath,result.targetPath);
      expect(change).toBeGreaterThan(previous);
      previous = change;
    }
  });

  test('modes produce distinct target contours from the same photo', () => {
    expect(new Set(modes.map(mode => buildBodyContourPreview(analysis(), mode, 70).targetPath)).size).toBe(4);
  });

  test('slim narrows the actual waist and muscle broadens the actual upper arm', () => {
    const photo = analysis();
    const slim = buildBodyContourPreview(photo,'slim',100);
    const before = coordinates(slim.originalPath), after = coordinates(slim.targetPath);
    expect(after[8].x).toBeGreaterThan(before[8].x);
    const muscle = coordinates(buildBodyContourPreview(photo,'muscle',100).targetPath);
    expect(muscle[4].x).toBeLessThan(before[4].x);
    expect(muscle[6]).toEqual(before[6]); // Actual elbow anchor is not displaced.
  });

  test('proportions move actual hip and knee heights upward, preserving planted feet', () => {
    const result = buildBodyContourPreview(analysis(),'proportions',100);
    const before = coordinates(result.originalPath), after = coordinates(result.targetPath);
    expect(after[9].y).toBeLessThan(before[9].y);
    expect(after[11].y).toBeLessThan(before[11].y);
    expect(after[13]).toEqual(before[13]);
    expect(after[14]).toEqual(before[14]);
  });

  test('a user adjustment relocates the target area without inventing contour segments', () => {
    const first = buildBodyContourPreview(analysis(),'breast',100);
    const moved = buildBodyContourPreview(analysis(),'breast',100,{...first.region,y:first.region.y+.15});
    expect(moved.targetPath).not.toEqual(first.targetPath);
    expect(moved.originalPath).toEqual(first.originalPath);
    expect(coordinates(moved.targetPath)).toHaveLength(coordinates(first.originalPath).length);
  });

  test('invalid optional regions are normalized to finite bounded controls', () => {
    const result = buildBodyContourPreview(analysis(),'muscle',100,{x:NaN,y:Infinity,radiusX:-1,radiusY:100});
    expect(Number.isFinite(result.region.x) && Number.isFinite(result.region.y)).toBe(true);
    expect(result.region.radiusX).toBe(.02);
    expect(result.region.radiusY).toBe(1);
    expect(result.targetPath).not.toMatch(/NaN|Infinity/);
  });

  test('missing landmarks fall back to visible mask bounds without generating hidden anatomy', () => {
    const photo = analysis(); photo.landmarks = [];
    for (const mode of modes) {
      const result = buildBodyContourPreview(photo,mode,70);
      expect(result.targetPath).not.toMatch(/NaN|Infinity/);
      expect(coordinates(result.targetPath)).toHaveLength(photo.contours[0].length);
    }
  });

  test('empty detection does not fabricate a generic person', () => {
    const photo = analysis(); photo.contours = [];
    const result = buildBodyContourPreview(photo,'muscle',70);
    expect(result.originalPath).toBe(''); expect(result.targetPath).toBe('');
  });

  test('rejects unsupported strength and invalid dimensions', () => {
    expect(() => buildBodyContourPreview(analysis(),'muscle',101)).toThrow();
    expect(() => buildBodyContourPreview({...analysis(),width:0},'muscle',70)).toThrow();
  });
});

describe('shared preview and prompt targets', () => {
  test('uses the same numeric muscle target and explicitly converts volume to width', () => {
    const targets = getBodyEditTargets(73);
    expect(buildBodyEditPrompt({mode:'muscle',intensity:73})).toContain(`${targets.muscle.volumeIncreasePercent.toFixed(1)}% greater upper-arm`);
    expect(volumeIncreaseToWidthScale(65)).toBeCloseTo(Math.sqrt(1.65));
  });

  test('preserves the existing endpoint targets of all four modes', () => {
    expect(getBodyEditTargets(1).slim.waistReductionPercent).toBe(2);
    expect(getBodyEditTargets(100).slim.waistReductionPercent).toBe(32);
    expect(getBodyEditTargets(100).muscle.volumeIncreasePercent).toBe(65);
    expect(getBodyEditTargets(100).proportions.legTorsoIncreasePercent).toBe(40);
    expect(getBodyEditTargets(100).breast.fullnessIncreasePercent).toBe(150);
  });
});
