import type { BodyEditMode, BodyEditIntensity } from './body-editor';

/** Topic entry defaults; choosing an example replaces these with its exact recipe. */
export const EDITING_TOPICS = {
  bodyEditor: { mode: 'slim', intensity: 70, cases: undefined },
  skinnyFilter: { mode: 'slim', intensity: 60, cases: ['naturalSlim', 'waistOnly'] },
  breastExpansion: { mode: 'breast', intensity: 40, cases: ['breast', 'breastSubtle'] },
  muscleGenerator: { mode: 'muscle', intensity: 60, cases: ['muscle', 'shoulders', 'customCombination'] },
  legLengthener: { mode: 'proportions', intensity: 60, cases: ['legProportions'] },
  waistSlimmer: { mode: 'slim', intensity: 60, cases: ['waistOnly'] },
} as const satisfies Record<string, { mode: BodyEditMode; intensity: BodyEditIntensity; cases?: readonly string[] }>;

export function editingTopic(key: string) {
  return Object.prototype.hasOwnProperty.call(EDITING_TOPICS, key) ? EDITING_TOPICS[key as keyof typeof EDITING_TOPICS] : undefined;
}
