import { expect, test } from 'vitest';
import { guestIdentity, guestNetworkHash } from '../../../libs/ai/body-guest-session';

test('initialization issues an unguessable HttpOnly cookie and exposes only its hash', async () => {
  const first = await guestIdentity(new Request('https://aibodyeditor.net/api/body-edit/guest-session'), true);
  expect(first?.cookie).toContain('HttpOnly'); expect(first?.cookie).toContain('Secure');
  expect(first?.cookie).toContain('SameSite=Lax'); expect(first?.cookie).toContain('Path=/api/body-edit');
  expect(first?.id).toMatch(/^guest:[a-f0-9]{64}$/);
  const cookie = first!.cookie!.split(';')[0];
  expect(cookie).not.toContain(first!.id);
  const again = await guestIdentity(new Request('https://aibodyeditor.net/api/body-edit', { headers: { Cookie: cookie } }), false);
  expect(again?.id).toBe(first?.id); expect(again?.cookie).toBeUndefined();
  expect((await guestIdentity(new Request('https://aibodyeditor.net'), true))?.id).not.toBe(first?.id);
});
test('missing, malformed or duplicate cookies do not authorize guest access', async () => {
  expect(await guestIdentity(new Request('https://aibodyeditor.net'), false)).toBeNull();
  for (const cookie of ['body_edit_guest=short', 'body_edit_guest=' + 'x'.repeat(43) + '; body_edit_guest=' + 'y'.repeat(43)]) {
    expect(await guestIdentity(new Request('https://aibodyeditor.net', { headers: { Cookie: cookie } }), false)).toBeNull();
  }
});
test('network keys are secret-keyed hashes and ignore client forwarding headers outside Workers', async () => {
  const req = new Request('https://aibodyeditor.net', { headers: { 'CF-Connecting-IP': '203.0.113.5', 'X-Forwarded-For': '1.2.3.4' } });
  expect(await guestNetworkHash(req, 'unit-secret', false)).toBeUndefined();
  const key = await guestNetworkHash(req, 'unit-secret', true);
  expect(key).toMatch(/^[a-f0-9]{64}$/); expect(key).not.toContain('203.0.113');
  expect(await guestNetworkHash(req, 'other-secret', true)).not.toBe(key);
  expect(await guestNetworkHash(req, '', true)).toBeUndefined();
});
test('localhost works without trusting spoofed forwarding headers', async () => {
  const req = new Request('http://localhost:7003', { headers: { 'CF-Connecting-IP': '203.0.113.5' } });
  const plain = new Request('http://localhost:7003');
  expect(await guestNetworkHash(req, 'unit-secret', false)).toBe(await guestNetworkHash(plain, 'unit-secret', false));
  expect(await guestNetworkHash(plain, 'unit-secret', false)).toMatch(/^[a-f0-9]{64}$/);
});
