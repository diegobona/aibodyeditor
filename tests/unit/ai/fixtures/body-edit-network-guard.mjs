import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import { basename } from 'node:path';
import { syncBuiltinESMExports } from 'node:module';
import { createHash } from 'node:crypto';

const requestLog = process.env.BODY_EDIT_TEST_REQUEST_LOG;
if (!requestLog) throw new Error('The CLI test network guard requires a request log.');
fs.writeFileSync(requestLog, '');

const record = (request) => fs.appendFileSync(requestLog, `${JSON.stringify(request)}\n`);

// The production CLI loads dotenv. Tests must never read the workspace's secrets.
const originalReadFileSync = fs.readFileSync;
fs.readFileSync = function (path, ...args) {
  if ((typeof path === 'string' || Buffer.isBuffer(path)) && /^\.env(?:\..*)?$/.test(basename(String(path)))) {
    const error = new Error('Environment files are unavailable in CLI tests.');
    error.code = 'ENOENT';
    throw error;
  }
  return originalReadFileSync.call(this, path, ...args);
};

// Block non-fetch networking too, so a CLI regression cannot reach a real gateway.
for (const [name, module, methods] of [
  ['http', http, ['request', 'get']],
  ['https', https, ['request', 'get']],
  ['net', net, ['connect', 'createConnection']],
  ['tls', tls, ['connect']],
]) {
  for (const method of methods) {
    module[method] = (...args) => {
      // tsx probes its parent's local named pipe. Block that probe without
      // counting loader IPC as gateway traffic; no socket is opened here.
      if (name === 'net' && typeof args[0] === 'string'
        && args[0].endsWith(`${process.ppid}.pipe`)
        && /(?:^|[\\/])tsx-[^\\/]+[\\/]/.test(args[0])) {
        throw new Error('Local loader IPC is disabled in CLI tests.');
      }
      record({ kind: 'unexpected-network', method: `${name}.${method}` });
      throw new Error('Real networking is disabled in CLI tests.');
    };
  }
}
syncBuiltinESMExports();

globalThis.fetch = async (url, init) => {
  const form = init?.body;
  const image = form instanceof FormData ? form.get('image') : undefined;
  const imageBytes = image instanceof Blob ? new Uint8Array(await image.arrayBuffer()) : undefined;
  const headers = new Headers(init?.headers);
  record({
    kind: 'fetch',
    url: String(url),
    method: init?.method,
    multipart: form instanceof FormData,
    keys: form instanceof FormData ? [...form.keys()].sort() : [],
    model: form instanceof FormData ? form.get('model') : undefined,
    n: form instanceof FormData ? form.get('n') : undefined,
    prompt: form instanceof FormData ? form.get('prompt') : undefined,
    mimeType: image?.type,
    sourceHash: imageBytes ? createHash('sha256').update(imageBytes).digest('hex') : undefined,
    authorizationMatches: headers.get('Authorization') === 'Bearer sk-body-edit-cli-test-only',
    contentTypeWasForced: headers.has('Content-Type'),
  });
  if (process.env.BODY_EDIT_TEST_ALLOW_FETCH !== '1') {
    throw new Error('No request was expected in this CLI test.');
  }
  return new Response(JSON.stringify({
    // Deliberately contradict the bytes: the CLI must use the actual output format.
    output_format: 'png',
    data: [{ b64_json: process.env.BODY_EDIT_TEST_RESPONSE_B64 }],
  }), { headers: { 'Content-Type': 'application/json', 'x-request-id': 'req-cli-test' } });
};
