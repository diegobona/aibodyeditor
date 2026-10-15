import { bodyGuestConfig } from '../../config/body-guest';

const encoder = new TextEncoder();
const hex = (value: ArrayBuffer) => Array.from(new Uint8Array(value), b => b.toString(16).padStart(2, '0')).join('');

/** The opaque cookie is the capability. The public owner ID alone cannot authorize access. */
export async function guestIdentity(request: Request, create: boolean): Promise<{ id: string; cookie?: string } | null> {
  const values = (request.headers.get('Cookie') ?? '').split(';').map(v => v.trim())
    .filter(v => v.startsWith(bodyGuestConfig.cookieName + '='));
  let token = values.length === 1 ? values[0].slice(bodyGuestConfig.cookieName.length + 1) : '';
  let cookie: string | undefined;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    if (!create) return null;
    token = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    cookie = `${bodyGuestConfig.cookieName}=${token}; Path=/api/body-edit; Max-Age=${bodyGuestConfig.cookieMaxAgeSeconds}; HttpOnly; SameSite=Lax${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
  }
  return { id: 'guest:' + hex(await crypto.subtle.digest('SHA-256', encoder.encode(token))), ...(cookie ? { cookie } : {}) };
}

/** Never trust browser-supplied forwarding headers on a directly accessible Node server. */
export async function guestNetworkHash(request: Request, secret: string, workers: boolean): Promise<string | undefined> {
  if (!secret.trim()) return undefined;
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname);
  const ip = local ? 'localhost-development' : workers ? request.headers.get('CF-Connecting-IP') : null;
  if (!ip || ip.length > 64 || /[\s,]/.test(ip)) return undefined;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode('body-guest-network\0' + ip)));
}
