import { describe, expect, test } from 'vitest';
import {
  BODY_EDITOR_MODES,
  BODY_EDIT_MODES,
  BODY_EDIT_INTENSITY,
  normalizeBodyEditIntensity,
  bodyEditConfig,
  type BodyEditMode,
  type BodyEditIntensity,
} from '../../../config/body-editor';
import { buildBodyEditPrompt } from '../../../libs/ai/body-edit-prompts';

const modes = ['slim', 'muscle', 'proportions', 'breast'] as const;
const intensities = [1, 20, 37, 50, 70, 73, 90, 100] as const;

describe('body edit configuration', () => {
  test('keeps the public preview choices while exposing breast for the server adapter', () => {
    expect(BODY_EDITOR_MODES).toEqual(['slim', 'muscle', 'proportions']);
    expect(BODY_EDIT_MODES).toEqual(modes);
    expect(BODY_EDIT_INTENSITY).toEqual({ min: 1, max: 100, step: 1, default: 70 });
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
    expect(prompt).toMatch(/bodybuilder/i);
    expect(prompt).toMatch(/never paint abs onto fabric/i);
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

  test('omitting intensity chooses a strong default of 70', () => {
    expect(buildBodyEditPrompt({ mode: 'slim' })).toBe(
      buildBodyEditPrompt({ mode: 'slim', intensity: 70 }),
    );
  });

  test('strength choices describe visibly different degrees while staying natural', () => {
    const subtle = buildBodyEditPrompt({ mode: 'slim', intensity: 20 });
    const balanced = buildBodyEditPrompt({ mode: 'slim', intensity: 50 });
    const noticeable = buildBodyEditPrompt({ mode: 'slim', intensity: 90 });

    expect(subtle).toMatch(/light, subtle/i);
    expect(balanced).toMatch(/moderate/i);
    expect(noticeable).toMatch(/dramatic/i);
    expect(new Set([subtle, balanced, noticeable]).size).toBe(3);
    for (const prompt of [subtle, balanced, noticeable]) {
      expect(prompt).toMatch(/natural/i);
    }
  });

  test.each(modes)('%s treats numeric targets as relative visual guides, not body measurements', (mode) => {
    for (const intensity of intensities) {
      const prompt = buildBodyEditPrompt({ mode, intensity });

      expect(prompt).toContain('approximate guidance');
      expect(prompt).toContain('not real-world body measurements');
      expect(prompt).not.toMatch(/\b(?:cup[ -]?size|centimet(?:er|re)s?|inches)\b|\b\d+(?:\.\d+)?\s*(?:cm|mm)\b/i);
    }
  });

  test.each(['', 'unknown', 'breastExpansion', '__proto__', 'constructor', null, undefined])(
    'rejects an unsupported runtime mode: %s',
    (mode) => {
      expect(() => buildBodyEditPrompt({ mode: mode as BodyEditMode })).toThrow(TypeError);
      expect(() => buildBodyEditPrompt({ mode: mode as BodyEditMode })).toThrow(/mode/i);
    },
  );

  test.each(['', 'strong', '__proto__', 'constructor', null, 0, -1, 101, 37.5, NaN, Infinity, '070', '70.5', ' 70 ', true])(
    'rejects an unsupported runtime intensity: %s',
    (intensity) => {
      expect(() => buildBodyEditPrompt({ mode: 'slim', intensity: intensity as BodyEditIntensity })).toThrow(TypeError);
      expect(() => buildBodyEditPrompt({ mode: 'slim', intensity: intensity as BodyEditIntensity })).toThrow(/intensity/i);
    },
  );

  test.each(modes)('%s has 100 distinct monotonically increasing shape targets', (mode) => {
    const prompts = Array.from({ length: 100 }, (_, i) => buildBodyEditPrompt({ mode, intensity: i + 1 }));
    expect(new Set(prompts).size).toBe(100);
    const targets = prompts.map(prompt => [...prompt.matchAll(/(\d+\.\d+)%/g)].map(match => Number(match[1])));
    expect(targets[0].length).toBeGreaterThan(0);
    for (let i = 1; i < targets.length; i++) {
      expect(targets[i].length).toBe(targets[0].length);
      targets[i].forEach((value, index) => expect(value).toBeGreaterThan(targets[i - 1][index]));
    }
  });

  test.each([['subtle', 25], ['balanced', 50], ['noticeable', 80]] as const)('maps historical %s to %i', (name, value) => {
    expect(normalizeBodyEditIntensity(name)).toBe(value);
    expect(buildBodyEditPrompt({ mode: 'slim', intensity: name })).toBe(buildBodyEditPrompt({ mode: 'slim', intensity: value }));
  });
});
