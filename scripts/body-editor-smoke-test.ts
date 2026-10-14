import { Buffer } from 'node:buffer';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { config as loadEnv } from 'dotenv';
import { bodyEditConfig, type BodyEditMode, type BodyEditIntensity } from '../config/body-editor';
import { editBodyImage, prepareBodyImageEdit, BodyImageEditError, type BodyImageEditOptions } from '../libs/ai/body-edit';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
loadEnv({ path: resolve(projectRoot, '.env') });

async function main() {
  const { values } = parseArgs({ options: {
    input: { type: 'string' }, mode: { type: 'string' }, intensity: { type: 'string' },
    output: { type: 'string' }, execute: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h' },
  } });
  if (values.help) {
    console.log('Usage: pnpm exec tsx scripts/body-editor-smoke-test.ts --input <photo> --mode <slim|muscle|proportions|breast> [--intensity subtle|balanced|noticeable] [--execute --output <file-prefix>]');
    console.log('Default: dry run, no network call. --execute makes one potentially billable request. Output gets the actual .png/.jpeg/.webp extension; URL results are printed without downloading.');
    return;
  }
  if (!values.input || !values.mode) throw new Error('ARGUMENTS');
  const inputPath = resolve(values.input);
  const inputInfo = await stat(inputPath);
  if (!inputInfo.isFile() || inputInfo.size > bodyEditConfig.maxInputBytes) {
    throw new BodyImageEditError('INVALID_INPUT', 'Input must be an image file up to 10 MB.');
  }
  const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' } as const;
  const extension = extname(inputPath).toLowerCase() as keyof typeof mimeTypes;
  const options: BodyImageEditOptions = {
    sourceImage: { bytes: new Uint8Array(await readFile(inputPath)), mimeType: mimeTypes[extension] },
    mode: values.mode as BodyEditMode, intensity: values.intensity as BodyEditIntensity | undefined,
  };
  const prepared = prepareBodyImageEdit(options);
  console.log(JSON.stringify({
    dryRun: !values.execute, endpoint: prepared.endpoint, model: prepared.model,
    mode: prepared.mode, intensity: prepared.intensity, mimeType: prepared.mimeType,
    inputBytes: prepared.inputBytes, prompt: prepared.prompt,
  }, null, 2));
  if (!values.execute) {
    console.log('Dry run passed. No image or API key was sent to the gateway.');
    return;
  }
  if (!values.output) throw new Error('OUTPUT_REQUIRED');
  const outputPrefix = resolve(values.output);
  if (extname(outputPrefix)) throw new Error('OUTPUT_PREFIX');
  // Check collisions before a paid call. Never overwrite an existing local result.
  for (const format of ['png', 'jpeg', 'webp']) {
    const exists = await stat(`${outputPrefix}.${format}`).then(() => true, (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return false;
      throw error;
    });
    if (exists) throw new Error('OUTPUT_EXISTS');
  }
  await mkdir(dirname(outputPrefix), { recursive: true });
  const result = await editBodyImage(options);
  console.log(JSON.stringify({ model: result.model, mode: result.mode, intensity: result.intensity, requestId: result.requestId }));
  if (result.imageUrl.startsWith('data:') && result.outputFormat) {
    const outputPath = `${outputPrefix}.${result.outputFormat}`;
    await writeFile(outputPath, Buffer.from(result.imageUrl.slice(result.imageUrl.indexOf(',') + 1), 'base64'), { flag: 'wx' });
    console.log(`Edited image saved: ${outputPath}`);
  } else {
    console.log(`Gateway image URL (temporary; not downloaded): ${result.imageUrl}`);
  }
}

main().catch((error: unknown) => {
  if (error instanceof BodyImageEditError) {
    console.error(JSON.stringify({ code: error.code, message: error.message, status: error.status, requestId: error.requestId }));
  } else {
    const messages: Record<string, string> = {
      ARGUMENTS: 'Provide --input and --mode. Use --help for examples.',
      OUTPUT_REQUIRED: '--execute requires --output with a file prefix.',
      OUTPUT_PREFIX: '--output is a file prefix without an extension.',
      OUTPUT_EXISTS: 'An output file already exists. Choose a new --output prefix.',
    };
    console.error(messages[error instanceof Error ? error.message : ''] ?? 'Unable to read input, parse arguments or write output. Use --help and check local file permissions.');
  }
  process.exitCode = 1;
});
