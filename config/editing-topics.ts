import type { BodyEditMode } from './body-editor';

/** Published topic defaults; case recipes remain the existing gallery's source of truth. */
export const EDITING_TOPICS = {
  muscleGenerator: { mode: 'muscle', intensity: 70, instructionCase: undefined, cases: ['muscle', 'shoulders', 'customCombination'] },
  legLengthener: { mode: 'proportions', intensity: 80, instructionCase: 'legProportions', cases: ['legProportions', 'proportions'] },
  waistSlimmer: { mode: 'slim', intensity: 70, instructionCase: 'waistOnly', cases: ['waistOnly', 'naturalSlim'] },
} as const satisfies Record<string, { mode: BodyEditMode; intensity: number; instructionCase?: string; cases: readonly string[] }>;

export function editingTopic(key: string) {
  return Object.prototype.hasOwnProperty.call(EDITING_TOPICS, key) ? EDITING_TOPICS[key as keyof typeof EDITING_TOPICS] : undefined;
}
