import { describe, expect, test, vi } from 'vitest';
import { queueSavedBodyEdit, readSavedBodyEdit, clearSavedBodyEdit } from '../../../libs/react-shared/utils/body-edit-history-handoff';

const id = '71000000-0000-4000-8000-000000000001';
function storage() {
  const values = new Map<string, string>();
  return { values, getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}
describe('saved-work continuation reference', () => {
  test('stores only an owner-bound job reference and prevents previous result recovery', () => {
    const tab = storage(); tab.setItem('body-editor-job', 'old result');
    queueSavedBodyEdit(id, 'owner', tab, 1000);
    expect(readSavedBodyEdit('owner', tab, 1001)).toBe(id);
    expect(tab.getItem('body-editor-job')).toBeNull();
    expect([...tab.values.values()].map(value => JSON.parse(value))).toEqual([{ ownerId: 'owner', jobId: id, createdAt: 1000 }]);
    clearSavedBodyEdit(tab); expect(readSavedBodyEdit('owner', tab, 1001)).toBeNull();
  });
  test.each(['other', 'guest'])('rejects and clears a reference after account change to %s', owner => {
    const tab = storage(); queueSavedBodyEdit(id, 'owner', tab, 1000);
    expect(readSavedBodyEdit(owner, tab, 1001)).toBeNull(); expect(tab.values.size).toBe(0);
  });
  test.each([999, 301000])('rejects future or expired references at %s', now => {
    const tab = storage(); queueSavedBodyEdit(id, 'owner', tab, 1000);
    expect(readSavedBodyEdit('owner', tab, now)).toBeNull();
  });
  test('ignores malformed optional storage and rejects invalid queue inputs', () => {
    const tab = storage(); tab.setItem('body-editor-continue-work', '{');
    expect(readSavedBodyEdit('owner', tab)).toBeNull();
    expect(() => queueSavedBodyEdit('../foreign', 'owner', tab)).toThrow();
    expect(() => queueSavedBodyEdit(id, 'guest', tab)).toThrow();
    const unavailable = { getItem: vi.fn(() => { throw new Error('denied'); }), setItem: vi.fn(() => { throw new Error('denied'); }), removeItem: vi.fn(() => { throw new Error('denied'); }) };
    expect(readSavedBodyEdit('owner', unavailable)).toBeNull();
    expect(() => queueSavedBodyEdit(id, 'owner', unavailable)).toThrow();
  });
});
