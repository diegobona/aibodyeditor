import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '../../..');
const script = resolve(root, 'scripts/body-editor-smoke-test.ts');
const guard = pathToFileURL(resolve(import.meta.dirname, 'fixtures/body-edit-network-guard.mjs')).href;
const TEST_KEY = 'sk-body-edit-cli-test-only';
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
const WEBP = Buffer.from('UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AA/v89WAAAAA==', 'base64');

let directory: string;
let input: string;
let requestLog: string;
const testTempRoot = resolve(tmpdir());

beforeEach(() => {
  directory = mkdtempSync(join(testTempRoot, 'body-edit-cli-test-'));
  input = join(directory, 'source.png');
  requestLog = join(directory, 'requests.ndjson');
  writeFileSync(input, PNG);
});

afterEach(() => {
  if (!directory) return;
  const cleanupPath = resolve(directory);
  if (dirname(cleanupPath) !== testTempRoot || !basename(cleanupPath).startsWith('body-edit-cli-test-')) {
    throw new Error('Refusing to remove a path outside this CLI test temporary directory.');
  }
  rmSync(cleanupPath, { recursive: true, force: true });
});

function run(args: string[], execute = false) {
  const result = spawnSync(process.execPath, ['--import', guard, '--import', 'tsx', script, ...args], {
    cwd: root,
    encoding: 'utf8',
    timeout: 10_000,
    maxBuffer: 1024 * 1024,
    env: {
      ...process.env,
      NODE_OPTIONS: '',
      OPENAI_API_KEY: execute ? TEST_KEY : '',
      OPENAI_BASE_URL: 'https://body-edit.test/v1',
      BODY_EDIT_TEST_REQUEST_LOG: requestLog,
      BODY_EDIT_TEST_ALLOW_FETCH: execute ? '1' : '0',
      BODY_EDIT_TEST_RESPONSE_B64: WEBP.toString('base64'),
    },
  });
  expect(result.error).toBeUndefined();
  expect(result.signal).toBeNull();
  expect(`${result.stdout}${result.stderr}`).not.toContain(TEST_KEY);
  const requests = readFileSync(requestLog, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
  return { ...result, requests };
}

describe('body editor smoke test CLI', () => {
  test('defaults to a valid dry run without a key or network request', () => {
    const result = run(['--input', input, '--mode', 'breast']);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('"dryRun": true');
    expect(result.stdout).toContain('"endpoint": "https://body-edit.test/v1/images/edits"');
    expect(result.stdout).toContain('"model": "gpt-image-2.5-1k"');
    expect(result.stdout).toContain('"mode": "breast"');
    expect(result.stdout).toContain('"intensity": 70');
    expect(result.stdout).toContain('Dry run passed.');
    expect(result.requests).toEqual([]);
  });

  test.each([
    ['mode', ['--mode', 'face']],
    ['intensity', ['--mode', 'slim', '--intensity', 'maximum']],
  ])('rejects unsupported %s before a request', (_name, args) => {
    const result = run(['--input', input, ...args]);

    expect(result.status).toBe(1);
    expect(JSON.parse(result.stderr)).toMatchObject({ code: 'INVALID_INPUT' });
    expect(result.requests).toEqual([]);
  });

  test.each(['unsupported-extension', 'invalid-image', 'directory'])('rejects an invalid input file: %s', (invalid) => {
    let invalidInput = input;
    if (invalid === 'unsupported-extension') {
      invalidInput = join(directory, 'source.gif');
      writeFileSync(invalidInput, PNG);
    } else if (invalid === 'invalid-image') {
      writeFileSync(input, 'This is not an image.');
    } else {
      invalidInput = directory;
    }
    const result = run(['--input', invalidInput, '--mode', 'slim']);

    expect(result.status).toBe(1);
    expect(JSON.parse(result.stderr)).toMatchObject({ code: 'INVALID_INPUT' });
    expect(result.requests).toEqual([]);
  });

  test('requires a configured key for execution and leaves no output image', () => {
    const prefix = join(directory, 'edited');
    const result = run(['--input', input, '--mode', 'slim', '--execute', '--output', prefix]);

    expect(result.status).toBe(1);
    expect(JSON.parse(result.stderr)).toMatchObject({ code: 'NOT_CONFIGURED' });
    expect(result.requests).toEqual([]);
    expect(existsSync(`${prefix}.png`)).toBe(false);
    expect(existsSync(`${prefix}.jpeg`)).toBe(false);
    expect(existsSync(`${prefix}.webp`)).toBe(false);
  });

  test('makes one multipart edit, saves the actual format, and refuses to overwrite it', () => {
    const prefix = join(directory, 'edited');
    const args = ['--input', input, '--mode', 'muscle', '--intensity', '20', '--execute', '--output', prefix];
    const result = run(args, true);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.requests).toHaveLength(1);
    expect(result.requests[0]).toMatchObject({
      kind: 'fetch', url: 'https://body-edit.test/v1/images/edits', method: 'POST', multipart: true,
      keys: ['image', 'model', 'n', 'prompt'], model: 'gpt-image-2.5-1k', n: '1', mimeType: 'image/png',
      sourceHash: createHash('sha256').update(PNG).digest('hex'),
      authorizationMatches: true, contentTypeWasForced: false,
    });
    expect(result.requests[0].prompt).toMatch(/shoulders.*arms/i);
    expect(result.requests[0].prompt).toMatch(/Editing strength: 20 out of 100/i);
    expect(result.stdout).toContain(`Edited image saved: ${prefix}.webp`);
    expect(readFileSync(`${prefix}.webp`)).toEqual(WEBP);
    expect(existsSync(`${prefix}.png`)).toBe(false);

    const repeated = run(args, true);
    expect(repeated.status).toBe(1);
    expect(repeated.stderr).toContain('An output file already exists.');
    expect(repeated.requests).toEqual([]);
    expect(readFileSync(`${prefix}.webp`)).toEqual(WEBP);
  });
});
