import { useEffect, useRef, useState } from "react";
import { normalizeBodyEditInstructions } from "../../ai/body-edit-instructions";
import { BODY_EDIT_RECOVERY_KEY } from '../../../config/body-editor';
import type {
  BodyEditMode,
  BodyEditIntensity,
} from "../../../config/body-editor";

export interface BodyEditView {
  jobId: string;
  status: "succeeded";
  result: {
    imageUrl: string;
    downloadUrl: string;
    mode: BodyEditMode;
    intensity: BodyEditIntensity;
  };
  credits: { charged: number; balance: number };
  reused: boolean;
}
type Attempt = {
  image: File;
  mode: BodyEditMode;
  intensity: BodyEditIntensity;
  instructions: string;
  requestId: string;
};
type Recovery = {
  ownerId: string;
  requestId: string;
  jobId?: string;
  startedAt: number;
};
type EditFailure = { code: string; refunded?: boolean; uncertain?: boolean; guest?: boolean };
const savedJobKey = BODY_EDIT_RECOVERY_KEY;
const reservationGraceMs = 15_000;
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Deduplicate initializers across React StrictMode and simultaneously mounted editors.
let guestInitialization: Promise<{ ownerId: string; remaining: number }> | undefined;
function initializeGuest() {
  if (!guestInitialization) {
    guestInitialization = fetch('/api/body-edit/guest-session', { method: 'POST', credentials: 'same-origin', cache: 'no-store' })
      .then(async response => {
        const body = await response.json();
        if (!response.ok || typeof body.ownerId !== 'string' || ![0, 1].includes(body.remaining)) throw new Error(body.error?.code ?? 'NETWORK');
        return body as { ownerId: string; remaining: number };
      }).finally(() => { guestInitialization = undefined; });
  }
  return guestInitialization;
}

/** Browser orchestration; provider settings, prompts and billing stay on the server. */
export function useBodyEdit(accountId?: string, authPending = false) {
  // Guest ownership is authenticated by the HttpOnly cookie, never by browser storage.
  const ownerId = accountId ?? 'guest';
  const [guestRemaining, setGuestRemaining] = useState<number | null>(null);
  const [config, setConfig] = useState<{
    available: boolean;
    costCredits: number;
    freeTrialEdits: number;
    guestTrialEdits?: number;
  } | null>(null);
  const [pending, setPending] = useState(false),
    [result, setResult] = useState<BodyEditView | null>(null);
  const [error, setError] = useState<EditFailure | null>(null);
  const attempt = useRef<Attempt | null>(null),
    recovery = useRef<Recovery | null>(null);
  const busy = useRef(false),
    mounted = useRef(true),
    currentOwner = useRef(ownerId);
  const poll = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pollStarted = useRef(0);
  currentOwner.current = ownerId;

  const isCurrent = () =>
    mounted.current && !!recovery.current &&
    (recovery.current.ownerId === currentOwner.current || recovery.current.ownerId === 'guest');
  function save() {
    try {
      if (recovery.current)
        sessionStorage.setItem(savedJobKey, JSON.stringify(recovery.current));
    } catch {
      /* Recovery remains available in this tab's memory. */
    }
  }
  function clearSaved() {
    try {
      sessionStorage.removeItem(savedJobKey);
    } catch {
      /* Optional persistence. */
    }
  }
  function finish() {
    busy.current = false;
    if (mounted.current) setPending(false);
  }
  function networkFailure() {
    if (isCurrent()) setError({ code: "NETWORK", uncertain: true });
    finish();
  }
  function schedule(seconds = 3) {
    if (Date.now() - pollStarted.current > 240_000) {
      networkFailure();
      return;
    }
    poll.current = setTimeout(() => {
      if (isCurrent()) void check();
    }, seconds * 1000);
  }

  useEffect(() => {
    mounted.current = true;
    fetch("/api/body-edit", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (mounted.current && value && typeof value.available === "boolean")
          setConfig(value);
      })
      .catch(() => undefined);
    return () => {
      mounted.current = false;
      clearTimeout(poll.current);
    };
  }, []);

  useEffect(() => {
    let active = true;
    setGuestRemaining(null);
    if (!accountId && !authPending) void initializeGuest().then(value => { if (active) setGuestRemaining(value.remaining); }).catch(() => undefined);
    return () => { active = false; };
  }, [accountId, authPending]);

  async function read(response: Response, expectedRequest: string, expectedOwner: string): Promise<void> {
    const body = await response.json();
    if (!isCurrent() || recovery.current?.requestId !== expectedRequest || recovery.current.ownerId !== expectedOwner) return;
    if (
      typeof body.jobId === "string" &&
      uuid.test(body.jobId) &&
      recovery.current
    ) {
      recovery.current.jobId = body.jobId;
      save();
    }
    if (
      response.status === 202 &&
      body.status === "processing" &&
      recovery.current?.jobId
    ) {
      schedule(Math.min(Math.max(Number(body.retryAfterSeconds) || 3, 1), 10));
      return;
    }
    if (
      response.ok &&
      body.status === "succeeded" &&
      body.result?.imageUrl &&
      body.result?.downloadUrl
    ) {
      setResult(body);
      if (expectedOwner === 'guest') setGuestRemaining(0);
      setError(null);
      attempt.current = null;
      finish();
      return;
    }
    const code =
      typeof body.error?.code === "string" ? body.error.code : "UNKNOWN";
    // Allow a brief upload/reservation race on refresh, then release stale recovery.
    if (
      code === "NOT_FOUND" &&
      !recovery.current?.jobId &&
      recovery.current &&
      Date.now() - recovery.current.startedAt < reservationGraceMs
    ) {
      schedule();
      return;
    }
    const precharge = new Set([
      "UNAUTHORIZED",
      "FORBIDDEN",
      "INVALID_ORIGIN",
      "INVALID_INPUT",
      "INVALID_INSTRUCTIONS",
      "NOT_CONFIGURED",
      "INSUFFICIENT_CREDITS",
      "NOT_FOUND",
      "TRIAL_EXHAUSTED",
      "TRIAL_IN_PROGRESS",
      "RATE_LIMITED",
    ]);
    const terminal =
      typeof body.jobId === "string" && body.error?.refunded === true;
    if (code === "IDEMPOTENCY_CONFLICT" && recovery.current?.jobId) {
      schedule(1);
      return;
    }
    if (!precharge.has(code) && !terminal) {
      setError({ code, uncertain: true });
      finish();
      return;
    }
    setError({ code, refunded: body.error?.refunded === true, guest: expectedOwner === 'guest' });
    if (code === 'TRIAL_EXHAUSTED') setGuestRemaining(0);
    else if (expectedOwner === 'guest' && terminal) setGuestRemaining(1);
    attempt.current = null;
    recovery.current = null;
    clearSaved();
    finish();
  }
  async function check() {
    const saved = recovery.current;
    if (!saved) {
      networkFailure();
      return;
    }
    try {
      const url = saved.jobId
        ? "/api/body-edit/" + saved.jobId
        : "/api/body-edit?requestId=" + saved.requestId;
      await read(
        await fetch(url, { credentials: "same-origin", cache: "no-store" }),
        saved.requestId, saved.ownerId,
      );
    } catch {
      networkFailure();
    }
  }
  async function send(value: Attempt) {
    const sendingOwner = ownerId!;
    busy.current = true;
    setPending(true);
    setError(null);
    setResult(null);
    pollStarted.current = Date.now();
    const form = new FormData();
    form.set("image", value.image);
    form.set("mode", value.mode);
    form.set("intensity", String(value.intensity));
    if (value.instructions) form.set("instructions", value.instructions);
    form.set("requestId", value.requestId);
    try {
      await read(
        await fetch("/api/body-edit", {
          method: "POST",
          body: form,
          credentials: "same-origin",
          cache: "no-store",
        }), value.requestId, sendingOwner,
      );
    } catch {
      networkFailure();
    }
  }
  async function submit(
    image: File,
    mode: BodyEditMode,
    intensity: BodyEditIntensity,
    instructions?: string,
  ) {
    if (busy.current || authPending) return;
    let normalizedInstructions: string;
    try {
      normalizedInstructions = normalizeBodyEditInstructions(instructions);
    } catch {
      setError({ code: "INVALID_INSTRUCTIONS" });
      return;
    }
    if (!accountId) {
      busy.current = true; setPending(true); setError(null);
      try {
        const session = await initializeGuest();
        if (!mounted.current || currentOwner.current !== ownerId) { finish(); return; }
        setGuestRemaining(session.remaining);
        if (!session.remaining) { setError({ code: 'TRIAL_EXHAUSTED' }); finish(); return; }
      } catch (error) {
        if (mounted.current) setError({ code: error instanceof Error ? error.message : 'NETWORK' });
        finish(); return;
      }
    }
    const requestId = crypto.randomUUID();
    recovery.current = { ownerId, requestId, startedAt: Date.now() };
    save(); // Persist before starting the paid request, even before the server returns a job ID.
    attempt.current = { image, mode, intensity, instructions: normalizedInstructions, requestId };
    await send(attempt.current);
  }
  async function recover() {
    if (busy.current || !recovery.current) return;
    // A guest upload with an uncertain response must never be replayed as a paid
    // account request after login. Cookie-owned lookup can still recover it.
    if (!recovery.current.jobId && attempt.current && recovery.current.ownerId === ownerId) await send(attempt.current);
    else {
      busy.current = true;
      setPending(true);
      setError(null);
      pollStarted.current = Date.now();
      await check();
    }
  }
  useEffect(() => {
    clearTimeout(poll.current);
    busy.current = false;
    attempt.current = null;
    recovery.current = null;
    setPending(false);
    setError(null);
    setResult(null);
    if (!ownerId) return;
    try {
      const raw = sessionStorage.getItem(savedJobKey);
      const saved = raw ? (JSON.parse(raw) as Recovery) : null;
      if (
        (saved?.ownerId === ownerId || saved?.ownerId === 'guest') &&
        uuid.test(saved.requestId) &&
        Number.isFinite(saved.startedAt) &&
        (!saved.jobId || uuid.test(saved.jobId))
      ) {
        recovery.current = saved;
        busy.current = true;
        setPending(true);
        pollStarted.current = Date.now();
        void check();
      }
    } catch {
      /* Ignore malformed optional recovery data. */
    }
    return () => {
      clearTimeout(poll.current);
    };
  }, [ownerId]);
  function reset() {
    if (busy.current) return;
    clearTimeout(poll.current);
    attempt.current = null;
    recovery.current = null;
    setError(null);
    setResult(null);
    clearSaved();
  }
  return { config, pending, result, error, submit, recover, reset, guestRemaining, isGuest: !accountId };
}
