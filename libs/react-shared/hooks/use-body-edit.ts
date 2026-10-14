import { useEffect, useRef, useState } from "react";
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
  requestId: string;
};
type Recovery = {
  ownerId: string;
  requestId: string;
  jobId?: string;
  startedAt: number;
};
type EditFailure = { code: string; refunded?: boolean; uncertain?: boolean };
const savedJobKey = "body-editor-job";
const reservationGraceMs = 15_000;
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Browser orchestration; provider settings, prompts and billing stay on the server. */
export function useBodyEdit(ownerId?: string) {
  const [config, setConfig] = useState<{
    available: boolean;
    costCredits: number;
    freeTrialEdits: number;
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
    mounted.current && recovery.current?.ownerId === currentOwner.current;
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

  async function read(response: Response, expectedRequest: string, expectedOwner: string): Promise<void> {
    const body = await response.json();
    if (!isCurrent() || recovery.current?.requestId !== expectedRequest || currentOwner.current !== expectedOwner) return;
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
      "NOT_CONFIGURED",
      "INSUFFICIENT_CREDITS",
      "NOT_FOUND",
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
    setError({ code, refunded: body.error?.refunded === true });
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
  ) {
    if (busy.current || !ownerId) return;
    const requestId = crypto.randomUUID();
    recovery.current = { ownerId, requestId, startedAt: Date.now() };
    save(); // Persist before starting the paid request, even before the server returns a job ID.
    attempt.current = { image, mode, intensity, requestId };
    await send(attempt.current);
  }
  async function recover() {
    if (busy.current || !recovery.current) return;
    if (!recovery.current.jobId && attempt.current) await send(attempt.current);
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
        saved?.ownerId === ownerId &&
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
  return { config, pending, result, error, submit, recover, reset };
}
