import { BODY_EDIT_INTENSITY, normalizeBodyEditIntensity, type BodyEditIntensityInput } from './body-editor';

/**
 * Shared visual intent for the live outline and the image-edit prompt.
 * Percentages describe relative changes, not measurements or a provider guarantee.
 * Keep the underlying interpolation unrounded; only prompt presentation rounds it.
 */
export function getBodyEditTargets(intensity: BodyEditIntensityInput = BODY_EDIT_INTENSITY.default) {
  const strength = normalizeBodyEditIntensity(intensity);
  const interpolate = (low: number, high: number) => low + ((strength - 1) / 99) * (high - low);
  return {
    strength,
    slim: {
      waistReductionPercent: interpolate(2, 32),
      upperArmReductionPercent: interpolate(1, 20),
      thighReductionPercent: interpolate(1, 22),
    },
    muscle: {
      shoulderIncreasePercent: interpolate(3, 28),
      volumeIncreasePercent: interpolate(5, 65),
    },
    proportions: {
      legTorsoIncreasePercent: interpolate(1, 40),
      waistReductionPercent: interpolate(2, 24),
    },
    breast: { fullnessIncreasePercent: interpolate(5, 150) },
  };
}

/** Fixed limb length, approximately cylindrical cross-section: volume ∝ width². */
export function volumeIncreaseToWidthScale(percent: number): number {
  return Math.sqrt(1 + Math.max(0, percent) / 100);
}
