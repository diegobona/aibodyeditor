import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Download, ImageUp, LoaderCircle, RefreshCw } from "lucide-react";
import { authClientReact } from "@libs/auth/authClient";
import { Button } from "@libs/react-shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@libs/react-shared/ui/dialog";
import { DiptychPhoto } from "@libs/react-shared/components/photo-comparison";
import { BodyEditComparison } from "@libs/react-shared/components/body-edit-comparison";
import { useBodyEdit } from "@libs/react-shared/hooks/use-body-edit";
import { cn } from "@libs/ui/utils/cn";
import {
  BODY_EDIT_MODES,
  BODY_EDIT_INTENSITIES,
  bodyEditConfig,
  type BodyEditMode,
  type BodyEditIntensity,
} from "../../../../../config/body-editor";
import { BODY_EDIT_CREDIT_COST } from "../../../../../config/credits";
import { useTranslation } from "@/hooks/use-translation";
import { LoginForm } from "@/components/login-form";
import type { EditorSample } from "./showcase-data";

/** Send only the original half of a same-origin concept sample. */
async function sampleOriginal(sample: EditorSample): Promise<File> {
  const url = new URL(sample.src, window.location.origin);
  if (
    url.origin !== window.location.origin ||
    !url.pathname.startsWith("/examples/")
  )
    throw new Error("INVALID_INPUT");
  const response = await fetch(url.toString(), { credentials: "same-origin" });
  if (!response.ok) throw new Error("INVALID_INPUT");
  const bitmap = await createImageBitmap(await response.blob());
  try {
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(bitmap.width / 2);
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("INVALID_INPUT");
    context.drawImage(
      bitmap,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) =>
          value ? resolve(value) : reject(new Error("INVALID_INPUT")),
        "image/png",
      ),
    );
    return new File([blob], sample.id + "-original.png", { type: "image/png" });
  } finally {
    bitmap.close();
  }
}

export function UploadDropzone({
  className,
  selectedMode,
  defaultMode = "slim",
  onModeChange,
  sample,
  onSampleClear,
  onPendingChange,
}: {
  className?: string;
  selectedMode?: BodyEditMode;
  defaultMode?: BodyEditMode;
  onModeChange?: (mode: BodyEditMode) => void;
  sample?: EditorSample;
  onSampleClear?: () => void;
  onPendingChange?: (pending: boolean) => void;
}) {
  const { t } = useTranslation();
  const copy = t.home.upload,
    editCopy = t.home.editing;
  const session = authClientReact.useSession();
  const editing = useBodyEdit(session.data?.user?.id);
  const inputId = useId(),
    inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localMode, setLocalMode] = useState<BodyEditMode>(defaultMode);
  const [intensity, setIntensity] = useState<BodyEditIntensity>("balanced");
  const [error, setError] = useState(""),
    [dragging, setDragging] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false),
    [preparing, setPreparing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const startLock = useRef(false);
  const mode = selectedMode ?? localMode,
    pending = editing.pending || preparing;
  const unresolved = editing.error?.uncertain === true,
    locked = pending || unresolved;
  const available = editing.config?.available,
    cost = editing.config?.costCredits ?? BODY_EDIT_CREDIT_COST;
  const aliases: Record<string, string> = {
    UNAUTHORIZED: "UNAUTHENTICATED",
    INVALID_ORIGIN: "FORBIDDEN",
    IDEMPOTENCY_CONFLICT: "CONFLICT",
    INTERNAL_ERROR: "UNKNOWN",
    STORAGE_ERROR: "RESULT_UNAVAILABLE",
  };
  const code = editing.error
    ? (aliases[editing.error.code] ?? editing.error.code)
    : "";
  const editError = code
    ? (editCopy.errors[code as keyof typeof editCopy.errors] ??
      editCopy.errors.UNKNOWN)
    : "";
  useEffect(() => {
    onPendingChange?.(locked);
  }, [locked, onPendingChange]);
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    if (!sample || locked) return;
    setFile(null);
    setPreviewUrl(null);
    setError("");
    editing.reset();
    if (inputRef.current) inputRef.current.value = "";
  }, [sample]);
  useEffect(() => {
    if (code === "UNAUTHENTICATED") setSigninOpen(true);
  }, [code]);
  const pickFile = (candidate: File | undefined) => {
    if (!candidate || locked) return;
    if (
      !bodyEditConfig.allowedMimeTypes.includes(
        candidate.type as (typeof bodyEditConfig.allowedMimeTypes)[number],
      )
    ) {
      setError(copy.errors.type);
      return;
    }
    if (candidate.size > bodyEditConfig.maxInputBytes) {
      setError(copy.errors.size);
      return;
    }
    setError("");
    editing.reset();
    setFile(candidate);
    onSampleClear?.();
  };
  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    pickFile(event.dataTransfer.files?.[0]);
  };
  const handleSubmit = async () => {
    if (locked || startLock.current) return;
    if (!file && !sample) {
      inputRef.current?.click();
      return;
    }
    if (!session.data?.user) {
      setSigninOpen(true);
      return;
    }
    if (available === false) {
      setError(editCopy.errors.NOT_CONFIGURED);
      return;
    }
    startLock.current = true;
    setPreparing(true);
    setError("");
    try {
      const source = file ?? (await sampleOriginal(sample!));
      if (!file) {
        setFile(source);
        onSampleClear?.();
      }
      await editing.submit(source, mode, intensity);
    } catch {
      setError(editCopy.errors.INVALID_INPUT);
    } finally {
      setPreparing(false);
      startLock.current = false;
    }
  };
  const downloadResult = async () => {
    if (!editing.result || downloading) return;
    setDownloading(true); setError('');
    try {
      const response = await fetch(editing.result.result.downloadUrl, { credentials: 'same-origin', cache: 'no-store' });
      const mime = response.headers.get('Content-Type')?.split(';')[0] ?? '';
      if (!response.ok || !(bodyEditConfig.allowedMimeTypes as readonly string[]).includes(mime)) throw new Error('RESULT_UNAVAILABLE');
      const blob = await response.blob();
      if (!blob.size || blob.size > bodyEditConfig.maxOutputBytes) throw new Error('RESULT_UNAVAILABLE');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url;
      link.download = `ai-body-edit-${editing.result.jobId}.${mime.slice('image/'.length)}`;
      link.click(); setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch { setError(editCopy.errors.RESULT_UNAVAILABLE); }
    finally { setDownloading(false); }
  };
  return (
    <div
      className={cn(
        "rounded-[28px] bg-card p-3 shadow-[0_1px_2px_rgb(30_26_46/0.06),0_12px_40px_-12px_rgb(30_26_46/0.18)]",
        className,
      )}
      data-body-editor
    >
      {editing.result ? (
        <div className="px-1 pb-2">
          <p className="mb-3 text-sm font-semibold" role="status">
            {editCopy.resultTitle}
          </p>
          <BodyEditComparison
            key={editing.result.jobId}
            beforeSrc={previewUrl}
            afterSrc={editing.result.result.imageUrl}
            beforeAlt={editCopy.beforeAlt}
            afterAlt={editCopy.afterAlt}
            beforeLabel={editCopy.before}
            afterLabel={editCopy.after}
            controlLabel={editCopy.compareLabel}
            hint={editCopy.compareHint}
            loadingLabel={editCopy.loadingResult}
            loadErrorLabel={editCopy.resultLoadError}
            reloadLabel={editCopy.reloadResult}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                editing.reset();
                setFile(null);
                onSampleClear?.();
              }}
            >
              {editCopy.editAnother}
            </Button>
            <Button asChild className="rounded-full">
              <a href={editing.result.result.downloadUrl} download aria-disabled={downloading} onClick={event => { event.preventDefault(); void downloadResult(); }}>
                <Download className="size-4" aria-hidden="true" />
                {editCopy.download}
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              if (!locked) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "relative flex min-h-64 flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed p-6 text-center transition-colors",
              locked ? "cursor-wait" : "cursor-pointer",
              dragging
                ? "border-primary bg-accent"
                : "border-input bg-background hover:border-primary/60",
            )}
          >
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept={bodyEditConfig.allowedMimeTypes.join(",")}
              disabled={locked}
              className="sr-only"
              aria-label={copy.inputLabel}
              onChange={(event) => pickFile(event.target.files?.[0])}
            />
            {previewUrl || sample ? (
              <>
                {sample && !file ? (
                  <DiptychPhoto
                    src={sample.src}
                    alt={sample.alt}
                    className="w-36 rounded-xl"
                  />
                ) : (
                  <img
                    src={previewUrl ?? undefined}
                    alt={copy.previewAlt}
                    className="max-h-56 rounded-xl object-contain"
                  />
                )}
                {!locked && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <RefreshCw className="size-4" aria-hidden="true" />
                    {copy.replace}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                  <ImageUp className="size-7" aria-hidden="true" />
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {copy.dropTitle}
                </span>
                <span className="text-sm text-muted-foreground">
                  {copy.dropHint}
                </span>
              </>
            )}
            {pending && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[20px] bg-background/90"
                role="status"
              >
                <LoaderCircle
                  className="size-7 animate-spin text-primary"
                  aria-hidden="true"
                />
                <p className="max-w-xs text-sm font-medium">
                  {editCopy.pending}
                </p>
              </div>
            )}
          </label>
          <fieldset
            disabled={locked}
            className="mt-3 flex flex-wrap items-center gap-2 px-1"
          >
            <legend className="sr-only">{copy.modeLabel}</legend>
            {BODY_EDIT_MODES.map((value) => (
              <label
                key={value}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  locked ? "cursor-default" : "cursor-pointer",
                  mode === value
                    ? "border-primary bg-accent text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  name={"edit-mode-" + inputId}
                  value={value}
                  checked={mode === value}
                  onChange={() => {
                    setLocalMode(value);
                    onModeChange?.(value);
                    editing.reset();
                  }}
                  className="sr-only"
                />
                {copy.modes[value]}
              </label>
            ))}
          </fieldset>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3 px-1">
            <fieldset disabled={locked} className="min-w-0">
              <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
                {editCopy.intensityLabel}
              </legend>
              <div className="flex gap-1 rounded-full bg-background p-1">
                {BODY_EDIT_INTENSITIES.map((value) => (
                  <label
                    key={value}
                    className={cn(
                      "rounded-full px-3 py-2 text-xs font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                      intensity === value
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground",
                      !locked && "cursor-pointer",
                    )}
                  >
                    <input
                      type="radio"
                      name={"edit-intensity-" + inputId}
                      value={value}
                      checked={intensity === value}
                      onChange={() => {
                        setIntensity(value);
                        editing.reset();
                      }}
                      className="sr-only"
                    />
                    {editCopy.intensities[value]}
                  </label>
                ))}
              </div>
            </fieldset>
            <Button
              type="button"
              size="lg"
              className="h-12 rounded-full px-6 text-base"
              disabled={pending || session.isPending}
              onClick={
                unresolved
                  ? () => {
                      void editing.recover();
                    }
                  : () => {
                      void handleSubmit();
                    }
              }
            >
              {pending && (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {unresolved ? editCopy.checkEdit : copy.submit}
            </Button>
          </div>
          {sample && !file && (
            <div className="mt-3 flex items-start gap-3 px-2">
              <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
                {t.home.showcase.sampleNotice}
              </p>
              <button
                type="button"
                disabled={locked}
                onClick={onSampleClear}
                className="min-h-10 shrink-0 text-xs font-semibold text-primary underline underline-offset-4"
              >
                {t.home.showcase.clearSample}
              </button>
            </div>
          )}
        </>
      )}
      {(error || editError) && (
        <p
          role="alert"
          className="mt-3 px-2 text-sm font-medium text-destructive"
        >
          {error || editError}
          {editing.error?.refunded && (
            <span className="mt-1 block">{editCopy.refunded}</span>
          )}
        </p>
      )}
      <p className="mt-3 px-2 text-xs leading-relaxed text-muted-foreground">
        {editCopy.costNote.replace("{credits}", String(cost))}{" "}
        {editCopy.trialNote}
      </p>
      <p className="mt-1 px-2 pb-1 text-xs leading-relaxed text-muted-foreground">
        {copy.availability}
      </p>
      <Dialog open={signinOpen} onOpenChange={setSigninOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editCopy.signinTitle}</DialogTitle>
            <DialogDescription>{editCopy.signinDescription}</DialogDescription>
          </DialogHeader>
          <LoginForm
            onSuccess={async () => {
              await session.refetch();
              setSigninOpen(false);
              editing.reset();
              setError("");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
