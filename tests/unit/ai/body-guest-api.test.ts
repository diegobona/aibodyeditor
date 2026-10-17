import { expect, test, vi } from 'vitest';
import { createBodyEditHandlers } from '../../../apps/tanstack-app/src/lib/body-edit-api';
import { BodyEditError, type BodyEditOutcome } from '../../../libs/credits/body-edit-types';

const origin = 'https://aibodyeditor.net';
const jobId = '89c2cd5c-1602-4b81-8d96-21b7a79be307';
const requestId = '22a5b5a5-3b3a-47df-a631-a7a58b79c805';
const bytes = new Uint8Array([137,80,78,71,13,10,26,10]);
function setup() {
  const result: BodyEditOutcome = { job: { id: jobId, userId: 'guest:owner', requestId, inputHash: 'hash',
    mode: 'slim', intensity: 70, model: 'unit', status: 'succeeded', costCredits: 0, resultKey: 'private/result',
    resultMimeType: 'image/png', errorCode: null, refunded: false, createdAt: new Date(), updatedAt: new Date(), deadlineAt: new Date() }, balance: 0, reused: false };
  const guestService = { submit: vi.fn(async () => result), getJob: vi.fn(async () => result), getRequest: vi.fn(async () => result) };
  const service = { submit: vi.fn(async () => { throw new BodyEditError('INSUFFICIENT_CREDITS', 402); }),
    getJob: vi.fn(async () => { throw new BodyEditError('NOT_FOUND', 404); }), getRequest: vi.fn(async () => { throw new BodyEditError('NOT_FOUND', 404); }) };
  const getUser = vi.fn(async (): Promise<{ id: string; banned?: boolean; creditBalance?: number } | null> => null);
  const getIdentity = vi.fn(async (_request: Request, create: boolean) => create
    ? { id: 'guest:owner', cookie: 'body_edit_guest=opaque; HttpOnly; Secure; Path=/api/body-edit' }
    : { id: 'guest:owner' });
  const allowance = vi.fn(async () => 1);
  const handlers = createBodyEditHandlers({ getUser, service,
    getConfig: async () => ({ available: true, costCredits: 10, freeTrialEdits: 0, guestTrialEdits: 1 }),
    guest: { service: guestService, getIdentity, allowance }, readImage: async () => ({ bytes, mimeType: 'image/png' }) });
  return { handlers, service, guestService, getUser, getIdentity, allowance };
}
function submit() {
  const body = new FormData(); body.set('image', new Blob([bytes], { type: 'image/png' }), 'photo.png');
  body.set('mode', 'slim'); body.set('intensity', '70'); body.set('requestId', requestId);
  return new Request(origin + '/api/body-edit', { method: 'POST', headers: { Origin: origin }, body });
}
test('guest can submit without authentication using the free service', async () => {
  const { handlers, service, guestService } = setup();
  const response = await handlers.submit(submit());
  expect(response.status).toBe(200); expect(await response.json()).toMatchObject({ credits: { charged: 0 }, jobId });
  expect(guestService.submit).toHaveBeenCalledWith(expect.objectContaining({ userId: 'guest:owner' }));
  expect(service.submit).not.toHaveBeenCalled();
});

test('session database failure never falls back to guest generation or exposes connection details', async () => {
  const { handlers, getUser, getIdentity, guestService, service } = setup();
  getUser.mockRejectedValue(new Error('Connection terminated due to connection timeout: private database details'));
  for (const response of [await handlers.submit(submit()), await handlers.guestSession(new Request(origin + '/api/body-edit/guest-session', { method: 'POST', headers: { Origin: origin } }))]) {
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: { code: 'SESSION_UNAVAILABLE' } });
  }
  expect(getIdentity).not.toHaveBeenCalled();
  expect(guestService.submit).not.toHaveBeenCalled();
  expect(service.submit).not.toHaveBeenCalled();
});

test('the same optional instruction contract reaches the guest service', async () => {
  const { handlers, guestService, service } = setup();
  const body = await submit().formData(); body.set('instructions', '  Only change my waist.  ');
  expect((await handlers.submit(new Request(origin + '/api/body-edit', { method: 'POST', headers: { Origin: origin }, body }))).status).toBe(200);
  expect(guestService.submit).toHaveBeenCalledWith(expect.objectContaining({ instructions: 'Only change my waist.' }));
  expect(service.submit).not.toHaveBeenCalled();
});
test('guest session initialization is same-origin and does not generate', async () => {
  const { handlers, guestService } = setup();
  const response = await handlers.guestSession(new Request(origin + '/api/body-edit/guest-session', { method: 'POST', headers: { Origin: origin } }));
  expect(response.status).toBe(200); expect(response.headers.get('Set-Cookie')).toContain('HttpOnly');
  expect(await response.json()).toEqual({ ownerId: 'guest:owner', remaining: 1 });
  expect(guestService.submit).not.toHaveBeenCalled();
  const denied = await handlers.guestSession(new Request(origin + '/api/body-edit/guest-session', { method: 'POST', headers: { Origin: 'https://other.test' } }));
  expect(denied.status).toBe(403);
});
test('an exhausted trial does not fall back to account billing or grant more credits', async () => {
  const { handlers, guestService, service } = setup();
  guestService.submit.mockRejectedValue(new BodyEditError('TRIAL_EXHAUSTED', 403));
  const response = await handlers.submit(submit());
  expect(response.status).toBe(403); expect(await response.json()).toMatchObject({ error: { code: 'TRIAL_EXHAUSTED' } });
  expect(service.submit).not.toHaveBeenCalled();
});
test('signed-in submissions always use paid credits and banned accounts cannot fall back to guest', async () => {
  const { handlers, getUser, guestService, service } = setup();
  getUser.mockResolvedValue({ id: 'account' });
  expect((await handlers.submit(submit())).status).toBe(402);
  expect(service.submit).toHaveBeenCalledOnce(); expect(guestService.submit).not.toHaveBeenCalled();
  getUser.mockResolvedValue({ id: 'account', banned: true });
  expect((await handlers.submit(submit())).status).toBe(403);
  expect(guestService.submit).not.toHaveBeenCalled();
});
test('guest polling, lookup and download use cookie ownership even after signing in', async () => {
  const { handlers, getUser, getIdentity } = setup();
  const req = new Request(origin + '/api/body-edit/' + jobId + '/image?download=1');
  expect((await handlers.image(req, jobId)).status).toBe(200);
  getUser.mockResolvedValue({ id: 'account' });
  const response = await handlers.image(req, jobId);
  expect(response.status).toBe(200); expect(response.headers.get('Content-Disposition')).toContain('attachment');
  expect((await handlers.status(req, jobId)).status).toBe(200);
  expect((await handlers.lookup(new Request(origin + '/api/body-edit?requestId=' + requestId))).status).toBe(200);
  getIdentity.mockResolvedValue({ id: 'guest:other' });
  expect((await handlers.image(req, jobId)).status).toBe(403);
});

test('guest result continuation requires account credits while preview and download remain accessible', async () => {
  const { handlers, getUser, guestService, service } = setup();
  const url = origin + '/api/body-edit/' + jobId + '/image';
  expect((await handlers.image(new Request(url), jobId)).status).toBe(200);
  expect((await handlers.image(new Request(url + '?continue=1'), jobId)).status).toBe(401);
  getUser.mockResolvedValue({ id: 'account', creditBalance: 9 });
  expect((await handlers.image(new Request(url + '?continue=1'), jobId)).status).toBe(402);
  getUser.mockResolvedValue({ id: 'account', creditBalance: 10 });
  expect((await handlers.image(new Request(url + '?continue=1'), jobId)).status).toBe(200);
  expect(guestService.submit).not.toHaveBeenCalled();
  expect(service.submit).not.toHaveBeenCalled();
});
