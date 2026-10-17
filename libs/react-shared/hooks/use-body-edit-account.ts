import { useCallback, useEffect, useRef, useState } from 'react';

type Account = { ownerId: string; balance: number; bonusGranted: boolean; welcomeCredits: number };
const initializing = new Map<string, Promise<Account>>();

/** The server owns the one-time welcome grant; only concurrent browser reads are shared. */
export function useBodyEditAccount(accountId?: string, authPending = false) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const owner = useRef(accountId);
  const mounted = useRef(true);
  owner.current = accountId;
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const refresh = useCallback(async () => {
    if (!accountId) return null;
    setLoading(true); setError(false);
    let request = initializing.get(accountId);
    if (!request) {
      request = fetch('/api/body-edit/account', { method: 'POST', credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(30_000) })
        .then(async response => {
          const body = await response.json();
          if (!response.ok || body.ownerId !== accountId || !Number.isFinite(body.balance) || typeof body.bonusGranted !== 'boolean') throw new Error('ACCOUNT_UNAVAILABLE');
          return body as Account;
        }).finally(() => { initializing.delete(accountId); });
      initializing.set(accountId, request);
    }
    try {
      const value = await request;
      if (mounted.current && owner.current === accountId) setAccount(value);
      return value;
    } catch {
      if (mounted.current && owner.current === accountId) setError(true);
      return null;
    } finally {
      if (mounted.current && owner.current === accountId) setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    setAccount(null); setError(false);
    if (accountId && !authPending) void refresh();
  }, [accountId, authPending, refresh]);

  const setBalance = useCallback((balance: number) => {
    if (Number.isFinite(balance)) setAccount(value => value && value.ownerId === owner.current ? { ...value, balance, bonusGranted: false } : value);
  }, []);
  const current = account?.ownerId === accountId ? account : null;
  return { account: current, loading: Boolean(accountId) && (loading || (!current && !error)), error, refresh, setBalance };
}
