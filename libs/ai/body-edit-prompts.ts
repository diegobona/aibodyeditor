import {
  BODY_EDIT_MODES,
  BODY_EDIT_INTENSITIES,
  type BodyEditMode,
  type BodyEditIntensity,
} from '../../config/body-editor';

const PRESERVATION_INSTRUCTIONS =
  'Edit the provided photograph of the same adult. ' +
  'Preserve their face, identity, hair, age, expression, pose, camera angle, lighting, background, and original outfit. ' +
  'Keep the original neckline, fabric, and clothing coverage. ' +
  'Preserve realistic anatomy and natural fabric folds; change only the requested body silhouette. ' +
  'Keep the original image framing and aspect ratio; do not crop, stretch, or extend the canvas.';

const MODE_INSTRUCTIONS: Record<BodyEditMode, string> = {
  slim:
    'Make the waist and upper-arm silhouette look slimmer through restrained contour changes. ' +
    'Leave all other body areas unchanged.',
  muscle:
    'Add athletic muscle definition to the shoulders and arms, with believable volume under the existing clothing. ' +
    'Avoid exaggerated bodybuilding bulk and leave all other body areas unchanged.',
  proportions:
    'Balance the shoulder, waist, and leg proportions with believable silhouette adjustments within the original frame. ' +
    'Keep body landmarks and garment folds coherent, without changing the pose or lengthening the canvas.',
  breast:
    'On this adult, clothed subject only, make the bust silhouette appear fuller under the existing clothing. ' +
    'Preserve clothing coverage, the original neckline, fabric, and outfit; use believable garment volume and folds. ' +
    'Do not remove clothing, reveal skin that was covered, or change other body areas.',
};

const INTENSITY_INSTRUCTIONS: Record<BodyEditIntensity, string> = {
  subtle:
    'Use a subtle intensity: keep changes minimal, natural, and close to the original photograph.',
  balanced:
    'Use a balanced intensity: make a moderate, natural change while retaining believable proportions.',
  noticeable:
    'Use a noticeable intensity: make the requested change clearly visible while keeping natural proportions and realistic anatomy.',
};

const OUTPUT_INSTRUCTIONS =
  'Return a single edited image only, with no text, captions, logos, watermarks, side-by-side comparisons, or collages.';

/** Fixed server-side editing instructions; intensity expresses visual intent, not a measurement. */
export function buildBodyEditPrompt(options: {
  mode: BodyEditMode;
  intensity?: BodyEditIntensity;
}): string {
  if (!BODY_EDIT_MODES.includes(options.mode)) {
    throw new TypeError('Unsupported body edit mode');
  }

  const intensity = options.intensity === undefined ? 'balanced' : options.intensity;
  if (!BODY_EDIT_INTENSITIES.includes(intensity)) {
    throw new TypeError('Unsupported body edit intensity');
  }

  return [
    PRESERVATION_INSTRUCTIONS,
    MODE_INSTRUCTIONS[options.mode],
    INTENSITY_INSTRUCTIONS[intensity],
    OUTPUT_INSTRUCTIONS,
  ].join(' ');
}
