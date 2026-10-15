import { BODY_EDIT_MODES, type BodyEditMode } from '../../config/body-editor';
import { getBodyEditTargets, volumeIncreaseToWidthScale } from '../../config/body-editor-targets';
import type { BodyContourPreview, BodyPhotoAnalysis, PreviewPoint, PreviewRegion } from './types';

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const finitePoint = (point: PreviewPoint | undefined): point is PreviewPoint =>
  !!point && Number.isFinite(point.x) && Number.isFinite(point.y);
const mix = (a: PreviewPoint, b: PreviewPoint, t: number): PreviewPoint =>
  ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const distance = (a: PreviewPoint, b: PreviewPoint) => Math.hypot(a.x - b.x, a.y - b.y);
/** Compact, smooth support, unlike a Gaussian which also moves distant head/feet. */
const bell = (distanceRatio: number) => {
  const t = clamp(Math.abs(distanceRatio));
  return (1 - t * t) ** 2;
};

/** Pixel paths from the detected mask, not an invented generic body silhouette. */
function path(contours: PreviewPoint[][]): string {
  return contours.map(points => `M${points.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join('L')}Z`).join('');
}

/**
 * Live geometric target only. Segmentation supplies the actual visible outline;
 * landmarks localize the deformation. Hidden muscles or breast boundaries cannot
 * be recovered from a clothed silhouette and are deliberately never fabricated.
 * Volumetric targets use a fixed-length cross-section approximation for the 2D
 * guide; the generative provider does not promise to follow this contour exactly.
 */
export function buildBodyContourPreview(
  analysis: BodyPhotoAnalysis,
  mode: BodyEditMode,
  intensity: number,
  adjustedRegion?: PreviewRegion,
): BodyContourPreview {
  if (!BODY_EDIT_MODES.includes(mode)) throw new TypeError('Unsupported body edit mode');
  const targets = getBodyEditTargets(intensity);
  const { width, height } = analysis;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new TypeError('Invalid photo dimensions');
  }
  const pixels = (point: PreviewPoint): PreviewPoint => ({ x: clamp(point.x) * width, y: clamp(point.y) * height });
  const contours = analysis.contours.map(points => points.filter(finitePoint).map(pixels)).filter(points => points.length >= 3);
  const points = contours.flat();
  if (!points.length) {
    const region = { x: .5, y: .5, radiusX: .25, radiusY: .25 };
    return { originalPath: '', targetPath: '', targetAvailable: false, region, guideRegion: region };
  }
  const xs = points.map(point => point.x), ys = points.map(point => point.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
  const centerX = (minX + maxX) / 2;
  const bodyHeight = Math.max(1, bottom - top), bodyWidth = Math.max(1, maxX - minX);
  // Low-confidence landmarks only fall back to visible mask bounds. These locate
  // an adjustable guide; they do not claim that anatomy was detected there.
  const landmark = (index: number, x: number, y: number): PreviewPoint => {
    const point = analysis.landmarks[index];
    return finitePoint(point) && (point.visibility === undefined || point.visibility >= .35)
      ? pixels(point) : { x, y };
  };
  const shoulders = [landmark(11, centerX - bodyWidth * .22, top + bodyHeight * .23), landmark(12, centerX + bodyWidth * .22, top + bodyHeight * .23)];
  const hips = [landmark(23, centerX - bodyWidth * .15, top + bodyHeight * .55), landmark(24, centerX + bodyWidth * .15, top + bodyHeight * .55)];
  const elbows = [landmark(13, minX + bodyWidth * .1, top + bodyHeight * .4), landmark(14, maxX - bodyWidth * .1, top + bodyHeight * .4)];
  const knees = [landmark(25, hips[0].x, top + bodyHeight * .75), landmark(26, hips[1].x, top + bodyHeight * .75)];
  const ankles = [landmark(27, hips[0].x, top + bodyHeight * .95), landmark(28, hips[1].x, top + bodyHeight * .95)];
  const shoulder = mix(shoulders[0], shoulders[1], .5), hip = mix(hips[0], hips[1], .5);
  const ankle = mix(ankles[0], ankles[1], .5);
  const torsoHeight = Math.max(bodyHeight * .12, Math.abs(hip.y - shoulder.y));
  const torsoWidth = Math.max(bodyWidth * .3, distance(shoulders[0], shoulders[1]));
  const waist = mix(shoulder, hip, .7), chest = mix(shoulder, hip, .3);
  const defaultRegions: Record<BodyEditMode, PreviewRegion> = {
    slim: { x: waist.x / width, y: (waist.y + hip.y) / (2 * height), radiusX: Math.max(bodyWidth * .6, torsoWidth) / width, radiusY: torsoHeight * 1.2 / height },
    muscle: { x: chest.x / width, y: chest.y / height, radiusX: Math.max(bodyWidth * .65, torsoWidth) / width, radiusY: torsoHeight * .85 / height },
    proportions: { x: hip.x / width, y: hip.y / height, radiusX: bodyWidth * .7 / width, radiusY: Math.max(torsoHeight, ankle.y - hip.y) / height },
    breast: { x: chest.x / width, y: chest.y / height, radiusX: torsoWidth * .8 / width, radiusY: torsoHeight * .32 / height },
  };
  const normalizeRegion = (region: PreviewRegion, fallback: PreviewRegion): PreviewRegion => ({
    x: Number.isFinite(region.x) ? clamp(region.x) : fallback.x,
    y: Number.isFinite(region.y) ? clamp(region.y) : fallback.y,
    radiusX: Number.isFinite(region.radiusX) ? clamp(region.radiusX, .02, 1) : fallback.radiusX,
    radiusY: Number.isFinite(region.radiusY) ? clamp(region.radiusY, .02, 1) : fallback.radiusY,
  });
  const base = normalizeRegion(defaultRegions[mode], defaultRegions[mode]);
  const region = normalizeRegion(adjustedRegion ?? base, base);
  // Retain the default-strength size, using the same fullness-to-width scale as
  // the contour. Keep this display size out of saved alignment to avoid drift.
  const guideScale = mode === 'breast'
    ? volumeIncreaseToWidthScale(targets.breast.fullnessIncreasePercent)
      / volumeIncreaseToWidthScale(getBodyEditTargets().breast.fullnessIncreasePercent)
    : 1;
  const guideRegion = { ...region, radiusX: region.radiusX * guideScale, radiusY: region.radiusY * guideScale };

  // A person mask includes arms and occluders; chest height alone does not make
  // an edge a visible torso boundary. Breast never uses guessed pose anchors.
  const trusted = (index: number, minimum = .6) => {
    const point = analysis.landmarks[index];
    return finitePoint(point) && (point.visibility ?? 0) >= minimum;
  };
  const axis = { x: hip.x - shoulder.x, y: hip.y - shoulder.y };
  const axisLength = Math.hypot(axis.x, axis.y);
  const along = { x: axis.x / Math.max(axisLength, 1), y: axis.y / Math.max(axisLength, 1) };
  const across = { x: along.y, y: -along.x };
  const halfWidth = (pair: PreviewPoint[]) => Math.abs((pair[1].x - pair[0].x) * across.x + (pair[1].y - pair[0].y) * across.y) / 2;
  const shoulderHalfWidth = halfWidth(shoulders), hipHalfWidth = halfWidth(hips);
  const chestPoseReliable = [11, 12, 23, 24].every(index => trusted(index)) && axis.y > bodyHeight * .08
    && axisLength > bodyHeight * .12 && shoulderHalfWidth > axisLength * .12 && hipHalfWidth > axisLength * .08;
  const chestCoordinates = (point: PreviewPoint) => {
    const vx = point.x - shoulder.x, vy = point.y - shoulder.y;
    return { t: (vx * along.x + vy * along.y) / Math.max(axisLength, 1), side: vx * across.x + vy * across.y };
  };
  const nearArm = (point: PreviewPoint) => [[11, 13], [13, 15], [12, 14], [14, 16]].some(([start, end]) => {
    if (!trusted(start, .45) || !trusted(end, .45)) return false;
    const a = pixels(analysis.landmarks[start]), b = pixels(analysis.landmarks[end]);
    const vx = b.x - a.x, vy = b.y - a.y, lengthSquared = vx * vx + vy * vy;
    if (lengthSquared < 1) return false;
    const t = clamp(((point.x - a.x) * vx + (point.y - a.y) * vy) / lengthSquared);
    return distance(point, mix(a, b, t)) < torsoWidth * .13;
  });
  const chestEdgeWeight = (point: PreviewPoint) => {
    if (!chestPoseReliable || nearArm(point)) return 0;
    const local = chestCoordinates(point);
    if (local.t < .08 || local.t > .6) return 0;
    const half = shoulderHalfWidth + (hipHalfWidth - shoulderHalfWidth) * local.t;
    const ratio = Math.abs(local.side) / half;
    // Restrict changes to the observed torso sides, not distant arms or small
    // segmentation loops inside the torso. Taper the outer margin smoothly.
    if (ratio < .65 || ratio >= 1.18) return 0;
    return clamp((ratio - .65) / .2) * bell(Math.max(0, ratio - 1) / .18);
  };

  /** Radial limb-width changes taper to zero at both joints. */
  const limbDelta = (point: PreviewPoint, start: PreviewPoint, end: PreviewPoint, scale: number): PreviewPoint => {
    const vx = end.x - start.x, vy = end.y - start.y, lengthSquared = vx * vx + vy * vy;
    if (lengthSquared < 1) return { x: 0, y: 0 };
    const t = ((point.x - start.x) * vx + (point.y - start.y) * vy) / lengthSquared;
    if (t <= 0 || t >= 1) return { x: 0, y: 0 };
    const axis = mix(start, end, t), dx = point.x - axis.x, dy = point.y - axis.y;
    const proximity = bell(Math.hypot(dx, dy) / (torsoWidth * .4));
    const weight = Math.sin(Math.PI * t) ** 2 * proximity;
    return { x: dx * (scale - 1) * weight, y: dy * (scale - 1) * weight };
  };

  const deform = (point: PreviewPoint): PreviewPoint => {
    const xScale = region.radiusX / base.radiusX, yScale = region.radiusY / base.radiusY;
    const p = { x: base.x * width + (point.x - region.x * width) / xScale, y: base.y * height + (point.y - region.y * height) / yScale };
    const regionDistance = Math.hypot((p.x - base.x * width) / (base.radiusX * width), (p.y - base.y * height) / (base.radiusY * height));
    // Full effect in the inner region; smooth edge avoids visible contour seams.
    const regionWeight = regionDistance <= .65 ? 1 : bell((regionDistance - .65) / .35);
    if (regionWeight === 0 || point.y < Math.min(shoulders[0].y, shoulders[1].y) || point.y >= ankle.y) return point;
    let dx = 0, dy = 0;
    const waistWeight = bell((p.y - waist.y) / (torsoHeight * .48));
    // Torso field stops before separate arms to avoid moving an entire arm sideways.
    const torsoWeight = bell(Math.max(0, Math.abs(p.x - waist.x) / torsoWidth - .55) / .35);
    if (mode === 'slim' || mode === 'proportions') {
      const reduction = mode === 'slim' ? targets.slim.waistReductionPercent : targets.proportions.waistReductionPercent;
      dx -= (p.x - waist.x) * reduction / 100 * waistWeight * torsoWeight;
    }
    if (mode === 'slim' || mode === 'muscle') {
      const scale = mode === 'slim' ? 1 - targets.slim.upperArmReductionPercent / 100 : volumeIncreaseToWidthScale(targets.muscle.volumeIncreasePercent);
      for (let side = 0; side < 2; side++) {
        const arm = limbDelta(p, shoulders[side], elbows[side], scale);
        dx += arm.x; dy += arm.y;
        if (mode === 'slim') {
          const thigh = limbDelta(p, hips[side], knees[side], 1 - targets.slim.thighReductionPercent / 100);
          dx += thigh.x; dy += thigh.y;
        }
      }
    }
    if (mode === 'muscle') {
      const yWeight = bell((p.y - shoulder.y - torsoHeight * .1) / (torsoHeight * .5));
      dx += (p.x - shoulder.x) * targets.muscle.shoulderIncreasePercent / 100 * yWeight * torsoWeight;
    }
    if (mode === 'proportions' && ankle.y > hip.y && hip.y > shoulder.y) {
      // Solve L'/T' = (L/T)*(1+target), keeping shoulder and ankle positions fixed.
      const total = ankle.y - shoulder.y, ratio = (ankle.y - hip.y) / (hip.y - shoulder.y);
      const newHipY = shoulder.y + total / (1 + ratio * (1 + targets.proportions.legTorsoIncreasePercent / 100));
      const shift = newHipY - hip.y;
      const verticalWeight = p.y <= hip.y ? clamp((p.y - shoulder.y) / (hip.y - shoulder.y)) : clamp((ankle.y - p.y) / (ankle.y - hip.y));
      dy += shift * verticalWeight;
    }
    if (mode === 'breast') {
      // Only a visible torso side may move. Covered edges and the arm capsules
      // remain fixed even when they fall inside the draggable radial field.
      const scale = volumeIncreaseToWidthScale(targets.breast.fullnessIncreasePercent);
      const local = chestCoordinates(p);
      const delta = local.side * (scale - 1) * bell((local.t - .3) / .32) * chestEdgeWeight(point);
      dx += across.x * delta;
      dy += across.y * delta;
    }
    const jointWeight = mode === 'muscle' || mode === 'slim'
      ? [...elbows, ...knees].reduce((weight, joint) => weight * clamp(distance(point, joint) / (torsoWidth * .12)), 1)
      : 1;
    return { x: clamp(point.x + dx * xScale * regionWeight * jointWeight, 0, width), y: clamp(point.y + dy * yScale * regionWeight * jointWeight, 0, height) };
  };
  const deformed = contours.map(contour => contour.map(deform));
  const originalPath = path(contours), targetPath = path(deformed);
  // An eligible edge elsewhere in the mask is not evidence of a target in the
  // current region. If nothing moves, the UI must show an adjustable area guide
  // instead of two coincident paths presented as a predicted contour change.
  const targetAvailable = mode !== 'breast' || targetPath !== originalPath;
  return { originalPath, targetPath, targetAvailable, region, guideRegion };
}
