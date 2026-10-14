/* Browser-only worker. MediaPipe 0.10.21 and its model are served by our own origin. */
'use strict';

// The upstream CommonJS browser bundle exports into this object. No bundler/CDN is used.
self.exports = {};
importScripts('/body-preview/mediapipe-0.10.21/vision_bundle.js');

const { FilesetResolver, PoseLandmarker } = self.exports;
const clamp = (value) => Math.min(1, Math.max(0, value));

/** Trace real mask pixel boundaries, including gaps between arms/torso and legs. */
function maskContours(mask) {
  const source = mask.getAsFloat32Array();
  const scale = Math.min(1, 384 / Math.max(mask.width, mask.height));
  const width = Math.max(1, Math.round(mask.width * scale));
  const height = Math.max(1, Math.round(mask.height * scale));
  const pixels = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = Math.min(mask.width - 1, Math.floor((x + 0.5) * mask.width / width));
      const sy = Math.min(mask.height - 1, Math.floor((y + 0.5) * mask.height / height));
      pixels[y * width + x] = source[sy * mask.width + sx] >= 0.5 ? 1 : 0;
    }
  }
  const inside = (x, y) => x >= 0 && x < width && y >= 0 && y < height && pixels[y * width + x];
  const stride = width + 1;
  const edges = new Map();
  const edge = (x1, y1, x2, y2) => {
    const start = y1 * stride + x1;
    const next = y2 * stride + x2;
    const adjacent = edges.get(start);
    if (adjacent) adjacent.push(next);
    else edges.set(start, [next]);
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!inside(x, y)) continue;
      if (!inside(x, y - 1)) edge(x, y, x + 1, y);
      if (!inside(x + 1, y)) edge(x + 1, y, x + 1, y + 1);
      if (!inside(x, y + 1)) edge(x + 1, y + 1, x, y + 1);
      if (!inside(x - 1, y)) edge(x, y + 1, x, y);
    }
  }
  const loops = [];
  while (edges.size) {
    const start = edges.keys().next().value;
    let current = start;
    const points = [];
    for (let steps = 0; steps <= width * height * 4; steps++) {
      points.push({ x: current % stride, y: Math.floor(current / stride) });
      const adjacent = edges.get(current);
      if (!adjacent?.length) break;
      const next = adjacent.pop();
      if (!adjacent.length) edges.delete(current);
      current = next;
      if (current === start) break;
    }
    if (current !== start || points.length < 12) continue;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i + 1) % points.length];
      area += a.x * b.y - b.x * a.y;
    }
    if (Math.abs(area) < width * height * 0.0006) continue;
    // Preserve the measured edge while removing one-pixel stair steps.
    const step = Math.max(1, Math.floor(points.length / 600));
    const smooth = [];
    for (let i = 0; i < points.length; i += step) {
      const a = points[(i + points.length - 1) % points.length];
      const b = points[i];
      const c = points[(i + 1) % points.length];
      smooth.push({ x: (a.x + 2 * b.x + c.x) / (4 * width), y: (a.y + 2 * b.y + c.y) / (4 * height) });
    }
    loops.push({ area: Math.abs(area), points: smooth });
  }
  return loops.sort((a, b) => b.area - a.area).slice(0, 6).map((loop) => loop.points);
}

self.onmessage = async ({ data }) => {
  if (data?.type !== 'analyze') return;
  let bitmap;
  let detector;
  let result;
  try {
    bitmap = await createImageBitmap(data.file);
    const width = bitmap.width;
    const height = bitmap.height;
    if (Math.max(width, height) > 1280) {
      const ratio = 1280 / Math.max(width, height);
      const resized = await createImageBitmap(bitmap, {
        resizeWidth: Math.round(width * ratio), resizeHeight: Math.round(height * ratio), resizeQuality: 'high',
      });
      bitmap.close();
      bitmap = resized;
    }
    const files = await FilesetResolver.forVisionTasks('/body-preview/mediapipe-0.10.21/wasm');
    detector = await PoseLandmarker.createFromOptions(files, {
      baseOptions: { modelAssetPath: '/body-preview/pose_landmarker_lite.task', delegate: 'CPU' },
      canvas: new OffscreenCanvas(bitmap.width, bitmap.height),
      runningMode: 'IMAGE', numPoses: 1,
      minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5,
      outputSegmentationMasks: true,
    });
    result = detector.detect(bitmap);
    const landmarks = result.landmarks[0];
    const mask = result.segmentationMasks?.[0];
    const visibleTorso = landmarks && [11, 12, 23, 24].filter((i) => (landmarks[i]?.visibility ?? 0) > 0.4).length;
    if (!landmarks || !mask || visibleTorso < 3) {
      self.postMessage({ type: 'error', code: 'NO_PERSON' });
      return;
    }
    const contours = maskContours(mask);
    if (!contours.length) {
      self.postMessage({ type: 'error', code: 'NO_PERSON' });
      return;
    }
    self.postMessage({
      type: 'result',
      analysis: {
        width, height,
        landmarks: landmarks.map(({ x, y, visibility }) => ({ x: clamp(x), y: clamp(y), visibility })),
        contours,
      },
    });
  } catch {
    self.postMessage({ type: 'error', code: 'UNAVAILABLE' });
  } finally {
    result?.close();
    detector?.close();
    bitmap?.close();
  }
};
