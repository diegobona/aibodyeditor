import { describe, expect, test } from 'vitest';
import {
  BODY_EDITOR_MODES,
  BODY_EDIT_MODES,
  BODY_EDIT_INTENSITIES,
  bodyEditConfig,
  type BodyEditMode,
  type BodyEditIntensity,
} from '../../../config/body-editor';
import { buildBodyEditPrompt } from '../../../libs/ai/body-edit-prompts';

const modes = ['slim', 'muscle', 'proportions', 'breast'] as const;
const intensities = ['subtle', 'balanced', 'noticeable'] as const;

describe('body edit configuration', () => {
  test('keeps the public preview choices while exposing breast for the server adapter', () => {
    expect(BODY_EDITOR_MODES).toEqual(['slim', 'muscle', 'proportions']);
    expect(BODY_EDIT_MODES).toEqual(modes);
    expect(BODY_EDIT_INTENSITIES).toEqual(intensities);
  });

  test('sets bounded Tuzi image edit defaults', () => {
    expect(bodyEditConfig.model).toBe('gpt-image-2.5-1k');
    expect(bodyEditConfig.baseURL).toBe('https://api.tu-zi.com/v1');
    expect(bodyEditConfig.maxInputBytes).toBe(10 * 1024 * 1024);
    expect(bodyEditConfig.maxOutputBytes).toBe(10 * 1024 * 1024);
    expect(bodyEditConfig.maxResponseBytes).toBe(20 * 1024 * 1024);
    expect(bodyEditConfig.timeoutMs).toBe(180_000);
    expect(bodyEditConfig.allowedMimeTypes).toEqual(['image/jpeg', 'image/png', 'image/webp']);
  });
});

describe('fixed body edit prompts', () => {
  test.each(modes)('%s preserves the adult subject, scene, outfit, and original frame', (mode) => {
    const prompt = buildBodyEditPrompt({ mode });

    expect(prompt).toMatch(/same adult/i);
    for (const detail of ['face', 'identity', 'hair', 'age', 'expression', 'pose', 'camera angle', 'lighting', 'background', 'outfit']) {
      expect(prompt.toLowerCase()).toContain(detail);
    }
    expect(prompt).toMatch(/preserve/i);
    expect(prompt).toMatch(/clothing coverage/i);
    expect(prompt).toMatch(/neckline/i);
    expect(prompt).toMatch(/fabric/i);
    expect(prompt).toMatch(/realistic anatomy/i);
    expect(prompt).toMatch(/original.*fram/i);
    expect(prompt).toMatch(/do not.*(?:stretch|extend).*canvas/i);
  });

  test.each(modes)('%s requests one edited image without presentation overlays', (mode) => {
    const prompt = buildBodyEditPrompt({ mode });

    expect(prompt).toMatch(/single edited image/i);
    expect(prompt).toMatch(/no text/i);
    expect(prompt).toMatch(/watermarks/i);
    expect(prompt).toMatch(/collages/i);
    expect(prompt).toMatch(/side-by-side comparisons/i);
  });

  test('slim targets the waist and upper-arm outline', () => {
    const prompt = buildBodyEditPrompt({ mode: 'slim' });

    expect(prompt).toMatch(/waist.*upper.arm/i);
    expect(prompt).toMatch(/slimmer|narrower/i);
    expect(prompt).toMatch(/only.*(?:waist|requested)/i);
  });

  test('muscle targets believable shoulder and arm definition under existing clothing', () => {
    const prompt = buildBodyEditPrompt({ mode: 'muscle' });

    expect(prompt).toMatch(/muscle definition/i);
    expect(prompt).toMatch(/shoulders.*arms/i);
    expect(prompt).toMatch(/under.*(?:existing|original).*clothing/i);
    expect(prompt).toMatch(/avoid.*exaggerated/i);
  });

  test('proportions balances shoulders, waist, and legs within the original frame', () => {
    const prompt = buildBodyEditPrompt({ mode: 'proportions' });

    expect(prompt).toMatch(/balance.*shoulder.*waist.*leg/i);
    expect(prompt).toMatch(/within.*original frame/i);
    expect(prompt).toMatch(/do not.*(?:stretch|extend).*canvas/i);
  });

  test('breast is limited to a fuller bust outline on an adult clothed subject', () => {
    const prompt = buildBodyEditPrompt({ mode: 'breast' });

    expect(prompt).toMatch(/adult,? clothed subject/i);
    expect(prompt).toMatch(/bust silhouette.*fuller/i);
    expect(prompt).toMatch(/under.*existing clothing/i);
    expect(prompt).toMatch(/do not remove clothing/i);
    expect(prompt).toMatch(/reveal skin that was covered/i);
    expect(prompt).toMatch(/change other body areas/i);
  });

  test('each mode supplies a different edit instruction', () => {
    const prompts = modes.map((mode) => buildBodyEditPrompt({ mode }));

    expect(new Set(prompts).size).toBe(modes.length);
  });

  test('omitting intensity chooses balanced', () => {
    expect(buildBodyEditPrompt({ mode: 'slim' })).toBe(
      buildBodyEditPrompt({ mode: 'slim', intensity: 'balanced' }),
    );
  });

  test('strength choices describe visibly different degrees while staying natural', () => {
    const subtle = buildBodyEditPrompt({ mode: 'slim', intensity: 'subtle' });
    const balanced = buildBodyEditPrompt({ mode: 'slim', intensity: 'balanced' });
    const noticeable = buildBodyEditPrompt({ mode: 'slim', intensity: 'noticeable' });

    expect(subtle).toMatch(/minimal/i);
    expect(balanced).toMatch(/moderate/i);
    expect(noticeable).toMatch(/clearly visible/i);
    expect(new Set([subtle, balanced, noticeable]).size).toBe(3);
    for (const prompt of [subtle, balanced, noticeable]) {
      expect(prompt).toMatch(/natural/i);
    }
  });

  test.each(modes)('%s never promises numeric body measurements for any intensity', (mode) => {
    for (const intensity of intensities) {
      const prompt = buildBodyEditPrompt({ mode, intensity });

      expect(prompt).not.toMatch(/\b(?:cup[ -]?size|centimet(?:er|re)s?|inches|percentage)\b|%|\b\d+(?:\.\d+)?\s*(?:cm|mm)\b/i);
    }
  });

  test.each(['', 'unknown', 'breastExpansion', '__proto__', 'constructor', null, undefined])(
    'rejects an unsupported runtime mode: %s',
    (mode) => {
      expect(() => buildBodyEditPrompt({ mode: mode as BodyEditMode })).toThrow(TypeError);
      expect(() => buildBodyEditPrompt({ mode: mode as BodyEditMode })).toThrow(/mode/i);
    },
  );

  test.each(['', 'strong', '__proto__', 'constructor', null, 0])(
    'rejects an unsupported runtime intensity: %s',
    (intensity) => {
      expect(() => buildBodyEditPrompt({ mode: 'slim', intensity: intensity as BodyEditIntensity })).toThrow(TypeError);
      expect(() => buildBodyEditPrompt({ mode: 'slim', intensity: intensity as BodyEditIntensity })).toThrow(/intensity/i);
    },
  );
});
