import { describe, expect, test } from 'vitest';
import { bodyEditConfig } from '../../../config/body-editor';
import { normalizeBodyEditInstructions } from '../../../libs/ai/body-edit-instructions';

describe('optional body edit instructions', () => {
  test('uses one shared 500 UTF-16 unit limit', () => {
    expect(bodyEditConfig.maxInstructionsLength).toBe(500);
  });

  test.each([undefined, '', ' \t\r\n '])('normalizes an absent or blank value to an empty string', (value) => {
    expect(normalizeBodyEditInstructions(value)).toBe('');
  });

  test('trims surrounding whitespace and normalizes line endings while preserving tabs and internal spacing', () => {
    expect(normalizeBodyEditInstructions(' \tOnly my waist.\r\nKeep  arms.\rKeep\tlegs. \n'))
      .toBe('Only my waist.\nKeep  arms.\nKeep\tlegs.');
  });

  test('counts the normalized value in UTF-16 units, including surrogate pairs', () => {
    expect(normalizeBodyEditInstructions(`  ${'x'.repeat(500)}\r\n`)).toHaveLength(500);
    expect(normalizeBodyEditInstructions('😀'.repeat(250))).toHaveLength(500);
    expect(() => normalizeBodyEditInstructions('x'.repeat(501))).toThrow(TypeError);
    expect(() => normalizeBodyEditInstructions('😀'.repeat(251))).toThrow(TypeError);
  });

  test.each([null, 1, true, [], {}, new String('waist')])('rejects a non-string value', (value) => {
    expect(() => normalizeBodyEditInstructions(value)).toThrow(TypeError);
  });

  test.each(Array.from({ length: 33 }, (_, code) => code === 32 ? 127 : code)
    .filter((code) => ![9, 10, 13].includes(code)))('rejects ASCII control %i before trimming', (code) => {
    expect(() => normalizeBodyEditInstructions(`${String.fromCharCode(code)}Only my waist.`)).toThrow(TypeError);
    expect(() => normalizeBodyEditInstructions(String.fromCharCode(code))).toThrow(TypeError);
  });
});
