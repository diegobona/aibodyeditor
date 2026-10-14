import {
  BODY_EDIT_MODES,
  normalizeBodyEditIntensity,
  type BodyEditMode,
  type BodyEditIntensityInput,
} from '../../config/body-editor';
import { getBodyEditTargets } from '../../config/body-editor-targets';

const PRESERVATION_INSTRUCTIONS =
  'Edit the provided photograph of the same adult. ' +
  'Preserve their face, identity, hair, age, expression, pose, camera angle, lighting, background, and original outfit. ' +
  'Keep the original neckline, fabric, and clothing coverage. ' +
  'Preserve realistic anatomy and natural fabric folds; change only the requested body silhouette. ' +
  'Allow the outfit contour, fit and folds to adapt to the changed physique without changing its design. ' +
  'Keep the original image framing and aspect ratio; do not crop, stretch, or extend the canvas.';

const percent = (value: number) => value.toFixed(1);

const MODE_INSTRUCTIONS: Record<BodyEditMode, (strength: number) => string> = {
  slim: (s) =>
    'Make the waist and upper-arm silhouette look slimmer, including the abdomen and visible thighs for a coherent slimmer physique. ' +
    `Aim for approximately ${percent(getBodyEditTargets(s).slim.waistReductionPercent)}% less waist silhouette width, ${percent(getBodyEditTargets(s).slim.upperArmReductionPercent)}% less upper-arm thickness, and ${percent(getBodyEditTargets(s).slim.thighReductionPercent)}% less visible thigh thickness relative to the original. ` +
    'Reduce abdominal fullness and adapt the same garments to the new outline. Preserve shoulder structure, bust size and leg length; leave unrelated body areas unchanged.',
  muscle: (s) =>
    'Add athletic muscle definition to the shoulders and arms, chest and visible core, with believable volume under the existing clothing. ' +
    `Aim for approximately ${percent(getBodyEditTargets(s).muscle.shoulderIncreasePercent)}% broader shoulder contours and ${percent(getBodyEditTargets(s).muscle.volumeIncreasePercent)}% greater upper-arm and chest muscle volume relative to the original. ` +
    'Build rounded deltoids, fuller biceps and triceps, substantial pectorals and a defined athletic V-shaped torso. ' +
    'If the abdomen is already visible, add coherent abdominal muscle definition; otherwise preserve coverage and express the build through garment fit, never paint abs onto fabric. ' +
    'At high strength allow a powerful muscular or bodybuilder physique; preserve joints and limb lengths, avoiding exaggerated anatomical distortions.',
  proportions: (s) =>
    'Balance the shoulder, waist, and leg proportions toward a visibly longer-legged, defined-waist fashion silhouette within the original frame. ' +
    `Aim for approximately ${percent(getBodyEditTargets(s).proportions.legTorsoIncreasePercent)}% greater leg-to-torso proportion and ${percent(getBodyEditTargets(s).proportions.waistReductionPercent)}% narrower waist silhouette relative to the original. ` +
    'Redistribute torso and leg proportions coherently, keeping head size, foot placement, stance and camera perspective consistent. ' +
    'Adapt garment seams, knees and hips to the new proportions; do not merely raise a waistband, change shoes or stretch the background. Preserve original bust size.',
  breast: (s) =>
    'On this adult, clothed subject only, make the bust silhouette appear fuller under the existing clothing. ' +
    `Aim for approximately ${percent(getBodyEditTargets(s).breast.fullnessIncreasePercent)}% greater visible bust fullness and forward projection relative to the original. ` +
    'Increase the actual clothed bust contour and corresponding garment volume, not just shading, posture or neckline. ' +
    'Preserve clothing coverage, the original neckline, fabric, and outfit; use believable garment volume and folds. ' +
    'Keep the waist, shoulders and overall torso scale unchanged. Do not remove clothing, reveal skin that was covered, or change other body areas.',
};

const OUTPUT_INSTRUCTIONS =
  'Return a single edited image only, with no text, captions, logos, watermarks, side-by-side comparisons, or collages.';

/** Fixed server instructions with continuous mode-specific visual targets. */
export function buildBodyEditPrompt(options: {
  mode: BodyEditMode;
  intensity?: BodyEditIntensityInput;
}): string {
  if (!BODY_EDIT_MODES.includes(options.mode)) {
    throw new TypeError('Unsupported body edit mode');
  }

  const strength = normalizeBodyEditIntensity(options.intensity);
  const degree = strength <= 25 ? 'a light, subtle refinement' : strength <= 50 ? 'a moderate visible change'
    : strength <= 80 ? 'a strong, clearly visible transformation' : 'a dramatic, high-impact transformation';

  return [
    PRESERVATION_INSTRUCTIONS,
    `Editing strength: ${strength} out of 100. Apply ${degree}; the target silhouette must change, not only shadows or contrast.`,
    MODE_INSTRUCTIONS[options.mode](strength),
    options.mode === 'proportions' && strength > 50
      ? 'Make an unmistakable long-legged editorial transformation: anatomically lengthen the thigh and lower-leg segments and shorten the torso-to-leg relationship. Move the actual hip and knee landmarks upward while keeping the feet planted. Keeping the same stance does not mean keeping the original limb segment lengths. The waist and hip level must visibly shift, rather than leaving the leg length effectively unchanged.' : '',
    options.mode === 'breast' && strength > 50
      ? 'Produce a substantially larger, very full bust, even if the starting bust is already full. Reconstruct the underlying breast volume with visibly wider and deeper clothed contours. Let the same shirt project and drape over the increased volume. A tighter-looking shirt or a small shadow change alone does not satisfy this edit.' : '',
    'The relative visual targets are approximate guidance for this photograph, not real-world body measurements. ' +
      'Scale the change to the source anatomy and visibility. Keep realistic anatomy and natural rendering at every strength. ' +
      (strength > 50 ? 'The requested difference must be immediately apparent at normal viewing size; do not settle for a barely changed duplicate.' : ''),
    OUTPUT_INSTRUCTIONS,
  ].join(' ');
}
