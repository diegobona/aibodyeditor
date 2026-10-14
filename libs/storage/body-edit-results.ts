import { Buffer } from 'node:buffer';
import { existsSync, constants } from 'node:fs';
import { access, lstat, mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { bodyEditConfig } from '../../config/body-editor';
import { BodyEditError, type BodyEditResultStore } from '../credits/body-edit-types';
import { R2BindingProvider } from './providers/r2-binding';

const formats: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpeg', 'image/webp': 'webp' };
const validKey = /^body-edits\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpeg|webp)$/i;
function assertKey(key: string) { if (!validKey.test(key)) throw new BodyEditError('STORAGE_ERROR', 502); }
function imageMime(bytes: Uint8Array): string | undefined {
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.length >= 12 && Buffer.from(bytes.subarray(0, 4)).toString() === 'RIFF' && Buffer.from(bytes.subarray(8, 12)).toString() === 'WEBP') return 'image/webp';
}
function validate(bytes: Uint8Array, mimeType: string) {
  if (!(bytes instanceof Uint8Array) || !bytes.byteLength || bytes.byteLength > bodyEditConfig.maxOutputBytes
    || !Object.hasOwn(formats, mimeType) || imageMime(bytes) !== mimeType) throw new BodyEditError('STORAGE_ERROR', 502);
}
function outputKey(jobId: string, bytes: Uint8Array, mimeType: string) {
  validate(bytes, mimeType); const key = `body-edits/${jobId}.${formats[mimeType]}`; assertKey(key); return key;
}
function defaultDirectory() {
  let directory = process.cwd();
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(directory, 'pnpm-workspace.yaml'))) return join(directory, 'data', 'body-edits');
    const parent = dirname(directory); if (parent === directory) break; directory = parent;
  }
  throw new BodyEditError('NOT_CONFIGURED', 503);
}

/** Node development storage stays outside public assets and never stores the uploaded original. */
export function createNodeBodyEditStore(options: { directory?: string } = {}): BodyEditResultStore {
  const directory = resolve(options.directory ?? defaultDirectory());
  const pathFor = (key: string) => {
    assertKey(key); const target = resolve(directory, key.slice('body-edits/'.length));
    if (!target.startsWith(`${directory}${sep}`)) throw new BodyEditError('STORAGE_ERROR', 502);
    return target;
  };
  return {
    async checkReady() { await mkdir(directory, { recursive: true, mode: 0o700 }); await access(directory, constants.W_OK); },
    async put(jobId, bytes, mimeType) {
      const key = outputKey(jobId, bytes, mimeType);
      await mkdir(directory, { recursive: true, mode: 0o700 });
      await writeFile(pathFor(key), bytes, { flag: 'wx', mode: 0o600 });
      return key;
    },
    async get(key) {
      const target = pathFor(key);
      let info;
      try { info = await lstat(target); } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
      if (!info.isFile() || info.isSymbolicLink() || info.size > bodyEditConfig.maxOutputBytes) throw new BodyEditError('STORAGE_ERROR', 502);
      const bytes = new Uint8Array(await readFile(target));
      const mimeType = imageMime(bytes); if (!mimeType) throw new BodyEditError('STORAGE_ERROR', 502);
      validate(bytes, mimeType); return { bytes, mimeType };
    },
    async delete(key) { await unlink(pathFor(key)).catch((error: NodeJS.ErrnoException) => { if (error.code !== 'ENOENT') throw error; }); },
  };
}

type PrivateBucket = ConstructorParameters<typeof R2BindingProvider>[0]['bucket'] & {
  get(key: string): Promise<{ size: number; arrayBuffer(): Promise<ArrayBuffer>; httpMetadata?: { contentType?: string } } | null>;
};
/** Only a dedicated private bucket binding may be supplied here. */
export function createR2BodyEditStore(bucket: PrivateBucket): BodyEditResultStore {
  const provider = new R2BindingProvider({ bucket });
  return {
    async checkReady() { await bucket.head('body-edits/readiness'); },
    async put(jobId, bytes, mimeType) {
      const key = outputKey(jobId, bytes, mimeType);
      await provider.uploadFile({ file: Buffer.from(bytes), fileName: key.slice('body-edits/'.length), folder: 'body-edits', contentType: mimeType });
      return key;
    },
    async get(key) {
      assertKey(key); const object = await bucket.get(key); if (!object) return null;
      if (object.size > bodyEditConfig.maxOutputBytes) throw new BodyEditError('STORAGE_ERROR', 502);
      const bytes = new Uint8Array(await object.arrayBuffer());
      const mimeType = imageMime(bytes); if (!mimeType) throw new BodyEditError('STORAGE_ERROR', 502);
      validate(bytes, mimeType); return { bytes, mimeType };
    },
    async delete(key) { assertKey(key); await bucket.delete(key); },
  };
}
