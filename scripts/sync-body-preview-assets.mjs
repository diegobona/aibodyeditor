import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../apps/tanstack-app/public/body-preview/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('assets.json', root), 'utf8'));
const digest = (data) => createHash('sha256').update(data).digest('hex');
const download = process.argv.includes('--download');

for (const asset of manifest) {
  const destination = new URL(asset.file, root);
  let current;
  try { current = await readFile(destination); } catch { /* A missing file can be restored below. */ }
  if (current?.length === asset.bytes && digest(current) === asset.sha256) {
    console.log(`OK ${asset.file}`);
    continue;
  }
  if (!download) throw new Error(`Missing or changed asset: ${asset.file}. Re-run with --download to restore.`);
  const response = await fetch(asset.url, { signal: AbortSignal.timeout(180_000) });
  if (!response.ok) throw new Error(`Asset download failed: ${asset.file} (${response.status})`);
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length !== asset.bytes || digest(data) !== asset.sha256) {
    throw new Error(`Asset checksum mismatch: ${asset.file}`);
  }
  await mkdir(dirname(fileURLToPath(destination)), { recursive: true });
  await writeFile(destination, data);
  console.log(`Restored ${asset.file}`);
}
