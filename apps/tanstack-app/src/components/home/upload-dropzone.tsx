import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { ChevronDown, Download, ImageUp, LoaderCircle, RefreshCw, Sparkles, X } from "lucide-react";
import { authClientReact } from "@libs/auth/authClient";
import { Button } from "@libs/react-shared/ui/button";
import { Textarea } from "@libs/react-shared/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@libs/react-shared/ui/dialog";
import { BodyEditComparison } from "@libs/react-shared/components/body-edit-comparison";
import { ImageFileDetails } from '@libs/react-shared/components/image-file-details';
import type { ImageFileMetadata } from '@libs/react-shared/utils/image-file-metadata';
import { BodyEditIntensitySlider } from "@libs/react-shared/components/body-edit-intensity";
import { BodyContourPreview } from "@libs/react-shared/components/body-contour-preview";
import { useBodyEdit } from "@libs/react-shared/hooks/use-body-edit";
import { cn } from "@libs/ui/utils/cn";
import {
  BODY_EDIT_MODES,
  BODY_EDIT_INTENSITY,
  bodyEditConfig,
  type BodyEditMode,
  type BodyEditIntensity,
} from "../../../../../config/body-editor";
import { BODY_EDIT_CREDIT_COST } from "../../../../../config/credits";
import { useTranslation } from "@/hooks/use-translation";
import { LoginForm } from "@/components/login-form";
import type { EditorPhotoSource, EditorSample, EditorSettings } from "./showcase-data";

/** Load the original half as a photo for the shared outline and editing flow. */
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
  layout = "card",
  selectedMode,
  defaultMode = "slim",
  defaultIntensity = BODY_EDIT_INTENSITY.default,
  onModeChange,
  sample,
  onSampleClear,
  onPendingChange,
  onPhotoChange,
  onSettingsChange,
  preserveSettingsOnPhotoChange = false,
}: {
  className?: string;
  layout?: "card" | "workbench";
  selectedMode?: BodyEditMode;
  defaultMode?: BodyEditMode;
  defaultIntensity?: BodyEditIntensity;
  onModeChange?: (mode: BodyEditMode) => void;
  sample?: EditorSample;
  onSampleClear?: () => void;
  onPendingChange?: (pending: boolean) => void;
  onPhotoChange?: (source: EditorPhotoSource) => void;
  onSettingsChange?: (settings: EditorSettings) => void;
  preserveSettingsOnPhotoChange?: boolean;
}) {
  const { t, locale } = useTranslation();
  const copy = t.home.upload,
    editCopy = t.home.editing;
  const session = authClientReact.useSession();
  const editing = useBodyEdit(session.data?.user?.id, session.isPending);
  const inputId = useId(),
    inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [photoSource, setPhotoSource] = useState<EditorPhotoSource>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localMode, setLocalMode] = useState<BodyEditMode>(defaultMode);
  const [intensity, setIntensity] = useState<BodyEditIntensity>(defaultIntensity);
  const [instructions, setInstructions] = useState("");
  const inheritedInstructions = useRef<{ mode: BodyEditMode } | undefined>(undefined);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [error, setError] = useState(""),
    [dragging, setDragging] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false),
    [preparing, setPreparing] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [reference, setReference] = useState<EditorSample>();
  const [sampleNeedsGeneration, setSampleNeedsGeneration] = useState(false);
  const [generatedSettings, setGeneratedSettings] = useState<EditorSettings>();
  const [resultMetadata, setResultMetadata] = useState<{ jobId: string; metadata: ImageFileMetadata } | null>(null);
  const [mobileView, setMobileView] = useState<"original" | "result">("original");
  const workbench = layout === "workbench";
  const workspace = t.home.examples;
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
    onPhotoChange?.(photoSource);
  }, [photoSource, onPhotoChange]);
  useEffect(() => {
    onSettingsChange?.({ mode, intensity, instructions });
  }, [mode, intensity, instructions, onSettingsChange]);
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
    if (!sample) {
      setLoadingSample(false);
      return;
    }
    if (locked) return;
    let active = true;
    setError("");
    setLocalMode(sample.mode);
    onModeChange?.(sample.mode);
    setIntensity(sample.intensity ?? BODY_EDIT_INTENSITY.default);
    inheritedInstructions.current = sample.instructions ? { mode: sample.mode } : undefined;
    setInstructions(sample.instructions ?? "");
    setInstructionsOpen(Boolean(sample.instructions));
    if (sample.loadPhoto === false) {
      setLoadingSample(false);
      return;
    }
    editing.reset();
    setReference(undefined);
    setSampleNeedsGeneration(false);
    setMobileView("original");
    setFile(null);
    setPreviewUrl(null);
    setPhotoSource(null);
    setLoadingSample(true);
    if (inputRef.current) inputRef.current.value = "";
    void sampleOriginal(sample)
      .then((source) => { if (active) { setFile(source); setPhotoSource("sample"); setReference(sample); } })
      .catch(() => { if (active) setError(editCopy.errors.INVALID_INPUT); })
      .finally(() => { if (active) setLoadingSample(false); });
    return () => { active = false; };
  }, [sample]);
  useEffect(() => {
    if (inheritedInstructions.current && inheritedInstructions.current.mode !== mode) {
      inheritedInstructions.current = undefined;
      setInstructions("");
    }
  }, [mode]);
  useEffect(() => {
    if (code === "UNAUTHENTICATED" || code === "TRIAL_EXHAUSTED") setSigninOpen(true);
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
    if (!preserveSettingsOnPhotoChange) {
      inheritedInstructions.current = undefined;
      setInstructions("");
      setInstructionsOpen(false);
    }
    setReference(undefined);
    setSampleNeedsGeneration(false);
    setGeneratedSettings(undefined);
    setMobileView("original");
    setFile(candidate);
    setPhotoSource("local");
    onSampleClear?.();
  };
  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragging(false);
    pickFile(event.dataTransfer.files?.[0]);
  };
  const handleSubmit = async () => {
    if (locked || loadingSample || startLock.current) return;
    if (!file) {
      inputRef.current?.click();
      return;
    }
    if (!session.data?.user && editing.guestRemaining === 0) {
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
      setGeneratedSettings({ mode, intensity, instructions });
      setReference(undefined);
      setSampleNeedsGeneration(false);
      setMobileView("result");
      await editing.submit(file, mode, intensity, instructions);
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
  const clearPhoto = () => {
    if (locked) return;
    editing.reset(); setReference(undefined); setGeneratedSettings(undefined);
    setSampleNeedsGeneration(false);
    setError("");
    inheritedInstructions.current = undefined;
    setInstructions(""); setInstructionsOpen(false); setFile(null); setPhotoSource(null);
    setMobileView("original"); onSampleClear?.();
    if (inputRef.current) inputRef.current.value = "";
  };
  const savedSettings = editing.result ? generatedSettings : reference;
  const settingsChanged = !!savedSettings && (savedSettings.mode !== mode || savedSettings.intensity !== intensity ||
    (savedSettings.instructions ?? "").trim() !== instructions.trim());
  const changedSample = !!reference && settingsChanged;
  const needsSampleResult = !editing.result && (sampleNeedsGeneration || changedSample);
  useEffect(() => {
    if (changedSample) {
      setReference(undefined);
      setSampleNeedsGeneration(true);
    }
  }, [changedSample]);
  const resetOnChange = () => { if (!workbench) editing.reset(); };
  const resultExists = !!editing.result || !!reference;
  const resultSettings = editing.result?.result ?? (needsSampleResult ? { mode, intensity } : generatedSettings && (pending || editing.error || error) ? generatedSettings : reference);
  const generationIncomplete = !!generatedSettings && !editing.result && !!(editing.error || error);
  const input = <input ref={inputRef} id={inputId} type="file" accept={bodyEditConfig.allowedMimeTypes.join(",")}
    disabled={locked} className="sr-only" aria-label={copy.inputLabel}
    onChange={(event) => pickFile(event.target.files?.[0])} />;
  const photoActions = <div className="flex shrink-0 items-center gap-1.5">
    <button type="button" disabled={locked} aria-label={copy.replace} title={copy.replace} onClick={() => inputRef.current?.click()}
      className={cn("flex items-center justify-center gap-1.5 rounded-full border border-primary bg-primary text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50", workbench ? "min-h-9 px-2.5" : "min-h-10 px-3")}>
      <RefreshCw className="size-4 shrink-0" aria-hidden="true" /><span className={workbench ? "hidden sm:inline" : undefined}>{copy.replace}</span>
    </button>
    <button type="button" disabled={locked} aria-label={copy.clear} title={copy.clear} onClick={clearPhoto}
      className={cn("flex items-center justify-center gap-1.5 rounded-full bg-card/95 text-xs font-medium text-muted-foreground shadow-sm hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50", workbench ? "min-h-8 border px-2 text-[11px]" : "min-h-10 px-3")}>
      <X className="size-3.5" aria-hidden="true" /><span className={workbench ? "hidden sm:inline lg:hidden xl:inline" : undefined}>{copy.clear}</span>
    </button>
  </div>;
  const photo = (
    <div className={cn("relative", workbench && "h-full min-h-0")} onDragOver={(event) => {
      event.preventDefault(); if (!locked) setDragging(true);
    }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
      {file && previewUrl ? <>
        <BodyContourPreview file={file} previewUrl={previewUrl} mode={mode} intensity={intensity}
          disabled={locked} alt={copy.previewAlt} copy={editCopy.contourPreview}
          className={workbench ? "flex h-full flex-col rounded-none border-0 [&>div:last-child]:min-h-20" : undefined}
          frameClassName={workbench ? "h-[420px] sm:h-[480px] lg:h-auto lg:min-h-0 lg:flex-1" : undefined} />
        {!workbench && <div className="absolute right-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap justify-end gap-2">{photoActions}</div>}
      </> : <label htmlFor={inputId} className={cn(
        "flex min-h-80 flex-col items-center justify-center gap-4 border-2 border-dashed p-8 text-center transition-colors",
        workbench ? "h-full min-h-0 rounded-2xl" : "rounded-[20px]",
        locked ? "cursor-wait" : "cursor-pointer", dragging ? "border-primary bg-accent" : "border-input bg-background hover:border-primary/60") }>
        <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-primary">
          {loadingSample ? <LoaderCircle className="size-8 animate-spin" aria-hidden="true" /> : <ImageUp className="size-8" aria-hidden="true" />}
        </span>
        <span className="max-w-md text-xl font-semibold">{loadingSample ? workspace.loadingSample : copy.dropTitle}</span>
        <span className="text-sm text-muted-foreground">{copy.dropHint}</span>
        {workbench && <span className="max-w-sm text-xs leading-relaxed text-muted-foreground">{workspace.emptyHint}</span>}
      </label>}
      {pending && !workbench && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[20px] bg-background/90" role="status">
        <LoaderCircle className="size-7 animate-spin text-primary" aria-hidden="true" /><p className="max-w-xs text-sm font-medium">{editCopy.pending}</p>
      </div>}
    </div>
  );
  const controls = <>
    <fieldset disabled={locked} className={cn("flex flex-wrap items-center gap-2", workbench ? "grid grid-cols-2" : "mt-3 px-1")}>
      <legend className={workbench ? "mb-3 text-xs font-semibold text-muted-foreground" : "sr-only"}>{copy.modeLabel}</legend>
      {BODY_EDIT_MODES.map((value) => <label key={value} className={cn(
        "rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
        locked ? "cursor-default" : "cursor-pointer", mode === value ? "border-primary bg-accent text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground")}>
        <input type="radio" name={"edit-mode-" + inputId} value={value} checked={mode === value} className="sr-only"
          onChange={() => { setLocalMode(value); onModeChange?.(value); resetOnChange(); }} />{copy.modes[value]}
      </label>)}
    </fieldset>
    <div className={cn("mt-5 min-w-0", !workbench && "px-1")}>
      <BodyEditIntensitySlider value={intensity} onChange={(value) => { setIntensity(value); resetOnChange(); }} disabled={locked}
        label={editCopy.intensityLabel} lowLabel={editCopy.intensityLow} highLabel={editCopy.intensityHigh}
        valueLabel={editCopy.intensityValue.replace('{value}', String(intensity))}
        description={editCopy.intensityDescriptions[mode]} hint={editCopy.intensityHint} />
      <div className="mt-4 min-w-0">
        <button type="button" disabled={locked} aria-expanded={instructionsOpen} aria-controls={inputId + "-instructions-panel"}
          onClick={() => setInstructionsOpen(value => !value)}
          className="flex min-h-9 max-w-full items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50">
          <ChevronDown className={cn("size-3.5 shrink-0 transition-transform", instructionsOpen && "rotate-180")} aria-hidden="true" />{editCopy.instructionsToggle}
        </button>
        <div id={inputId + "-instructions-panel"} hidden={!instructionsOpen} className="min-w-0 space-y-1.5 pt-1">
          <label htmlFor={inputId + "-instructions"} className="text-xs font-semibold">{editCopy.instructionsLabel}</label>
          <Textarea id={inputId + "-instructions"} value={instructions} onChange={event => { inheritedInstructions.current = undefined; setInstructions(event.currentTarget.value); resetOnChange(); }}
            disabled={locked} maxLength={bodyEditConfig.maxInstructionsLength} rows={workbench ? 5 : 2} placeholder={editCopy.instructionsPlaceholder}
            aria-invalid={code === "INVALID_INSTRUCTIONS" || undefined}
            aria-describedby={inputId + "-instructions-hint " + inputId + "-instructions-counter" + (code === "INVALID_INSTRUCTIONS" ? " " + inputId + "-error" : "")}
            className="min-h-20 resize-y rounded-xl" />
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {!workbench && <p>{editCopy.instructionsExample}</p>}
            <span id={inputId + "-instructions-counter"} className="ml-auto shrink-0 tabular-nums">{editCopy.instructionsCounter.replace("{count}", String(instructions.length)).replace("{max}", String(bodyEditConfig.maxInstructionsLength))}</span>
          </div>
          <p id={inputId + "-instructions-hint"} className="text-xs leading-relaxed text-muted-foreground">{editCopy.instructionsHint}</p>
        </div>
      </div>
    </div>
  </>;
  const action = <Button type="button" size="lg" className={cn("h-12 rounded-full px-6 text-base", workbench && "w-full")}
    disabled={pending || loadingSample || session.isPending}
    onClick={unresolved ? () => { void editing.recover(); } : () => { void handleSubmit(); }}>
    {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
    {unresolved ? editCopy.checkEdit : editing.isGuest && editing.guestRemaining === 0 ? editCopy.signinRequired : copy.submit}
  </Button>;
  const notices = <>
    {(error || editError) && <p role="alert" id={inputId + "-error"} className="mt-3 text-sm font-medium text-destructive">
      {error || editError}{editing.error?.refunded && <span className="mt-1 block">{editing.error.guest ? editCopy.guestRetryNote : editCopy.refunded}</span>}
    </p>}
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{editing.isGuest ? editing.guestRemaining === 0 ? editCopy.guestUsedNote : editCopy.trialNote : editCopy.costNote.replace("{credits}", String(cost))}</p>
    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy.availability}</p>
  </>;
  const download = editing.result && <Button asChild variant="outline" size="sm" className="rounded-full">
    <a href={editing.result.result.downloadUrl} download title={t.imageDetails.downloadOriginal} aria-disabled={downloading} onClick={event => { event.preventDefault(); void downloadResult(); }}>
      <Download className="size-4" aria-hidden="true" />{editCopy.download}
    </a>
  </Button>;
  return (
    <div className={cn(workbench ? "overflow-hidden rounded-3xl border bg-card shadow-sm" : "rounded-[28px] bg-card p-3 shadow-sm", className)}
      data-body-editor data-layout={layout} data-photo-source={photoSource ?? "empty"} aria-busy={loadingSample}>
      {input}
      {workbench ? <div className="grid min-w-0 lg:h-[calc(100dvh-236px)] lg:min-h-[320px] lg:max-h-[720px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_288px]">
        <div className="min-w-0 lg:col-span-2 lg:min-h-0">
          {(file && previewUrl) || editing.result ? <>
            <div role="tablist" aria-label={workspace.photoViews} className="flex border-b p-2 lg:hidden">
              {(["original", "result"] as const).map(view => <button key={view} type="button" role="tab" id={inputId + "-" + view + "-tab"}
                aria-selected={mobileView === view} aria-controls={inputId + "-" + view} onClick={() => setMobileView(view)}
                className={cn("min-h-10 flex-1 rounded-xl text-sm font-semibold", mobileView === view ? "bg-accent text-primary" : "text-muted-foreground")}>{view === "original" ? workspace.original : workspace.result}</button>)}
            </div>
            <div className="grid h-full min-w-0 lg:grid-cols-2">
              <section id={inputId + "-original"} aria-label={workspace.original} data-photo-panel="original"
                className={cn("min-h-0 min-w-0 flex-col lg:flex lg:border-r", mobileView === "original" ? "flex" : "hidden")}>
                <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b px-4 text-xs font-semibold"><span>{workspace.original}</span>{file && previewUrl && photoActions}</div>
                <div className="min-h-0 flex-1">{photo}</div>
              </section>
              <section id={inputId + "-result"} aria-label={workspace.result} data-photo-panel="result"
                className={cn("min-h-0 min-w-0 flex-col lg:flex", mobileView === "result" ? "flex" : "hidden")}>
                <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b px-4 text-xs font-semibold">
                  <span>{editing.result ? editCopy.resultTitle : pending ? editCopy.pending : generationIncomplete ? workspace.generationIncomplete : reference && !needsSampleResult ? workspace.sampleResult : workspace.result}</span>{download}
                </div>
                <div id="editor-result" className="contents"><div id="hero-showcase" data-result-example={!editing.result && !needsSampleResult ? reference?.id : undefined}
                  className="relative flex h-[420px] min-h-0 items-center justify-center bg-background sm:h-[480px] lg:h-auto lg:flex-1">
                  {pending ? <div role="status" className="flex max-w-xs flex-col items-center gap-3 p-6 text-center"><LoaderCircle className="size-7 animate-spin text-primary" /><p className="text-sm">{editCopy.pending}</p></div>
                    : editing.result ? <BodyEditComparison key={editing.result.jobId} beforeSrc={null} afterSrc={editing.result.result.imageUrl}
                      beforeAlt={editCopy.beforeAlt} afterAlt={editCopy.afterAlt} beforeLabel={editCopy.before} afterLabel={editCopy.after}
                      controlLabel={editCopy.compareLabel} hint={editCopy.compareHint} loadingLabel={editCopy.loadingResult}
                      loadErrorLabel={editCopy.resultLoadError} reloadLabel={editCopy.reloadResult}
                      onMetadataChange={metadata => setResultMetadata(metadata && { jobId: editing.result!.jobId, metadata })}
                      className="absolute inset-0" frameClassName="h-full rounded-none bg-background sm:h-full" />
                    : generationIncomplete ? <div role="status" className="flex max-w-sm flex-col items-center gap-3 p-6 text-center">
                      <RefreshCw className="size-7 text-muted-foreground" aria-hidden="true" />
                      <p className="text-sm font-semibold">{workspace.generationIncomplete}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{error || editError}</p>
                    </div> : needsSampleResult ? <div role="status" className="flex max-w-xs flex-col items-center gap-3 p-6 text-center text-muted-foreground">
                      <Sparkles className="size-7 text-primary/60" aria-hidden="true" /><p className="text-sm font-medium">{workspace.sampleSettingsChanged}</p>
                    </div> : reference ? <svg role="img" aria-label={reference.afterAlt ?? editCopy.afterAlt} viewBox="0 0 768 1024" preserveAspectRatio="xMidYMid meet" className="h-full w-full overflow-hidden">
                      <defs><clipPath id={inputId + "-sample-result-clip"}><rect width={768} height={1024} /></clipPath></defs>
                      <image href={reference.src} x={-768} width={1536} height={1024} clipPath={`url(#${inputId}-sample-result-clip)`} />
                    </svg>
                    : <div className="flex max-w-xs flex-col items-center gap-3 p-6 text-center text-muted-foreground"><Sparkles className="size-7 text-primary/60" /><p className="text-sm font-medium">{workspace.resultPlaceholder}</p><p className="text-xs leading-relaxed">{workspace.resultPlaceholderHint}</p></div>}
                </div></div>
                <div className="flex min-h-20 shrink-0 flex-col justify-center gap-1 border-t px-4 py-2 text-xs leading-relaxed text-muted-foreground" aria-live="polite">
                  {resultSettings && <p data-result-settings className="font-semibold text-foreground">{copy.modes[resultSettings.mode]} · {t.home.realResults.intensity.replace("{value}", String(resultSettings.intensity ?? BODY_EDIT_INTENSITY.default))}</p>}
                  {editing.result && resultMetadata?.jobId === editing.result.jobId && <ImageFileDetails metadata={resultMetadata.metadata} copy={t.imageDetails} locale={locale} />}
                  {settingsChanged && resultExists ? <p role="status" className="text-primary">{workspace.currentSettingsDiffer}</p> : <p>{editing.result ? workspace.reviewResult : pending ? editCopy.pending : unresolved ? editCopy.checkEdit : reference ? workspace.sampleNote : workspace.resultPlaceholderHint}</p>}
                </div>
              </section>
            </div>
          </> : <div className="h-full min-h-[380px] p-4 sm:min-h-[460px] sm:p-6 lg:min-h-0 lg:p-4">{photo}</div>}
        </div>
        <aside data-editor-settings className="flex min-h-0 min-w-0 flex-col border-t lg:border-l lg:border-t-0">
          <h2 className="flex h-11 shrink-0 items-center border-b px-4 text-sm font-semibold">{workspace.settingsTitle}</h2>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{controls}</div>
          <div className="shrink-0 border-t p-4">{action}{notices}</div>
        </aside>
      </div> : <>
        {editing.result ? <div className="px-1 pb-2">
          <p className="mb-3 text-sm font-semibold" role="status">{editCopy.resultTitle}</p>
          <BodyEditComparison key={editing.result.jobId} beforeSrc={previewUrl} afterSrc={editing.result.result.imageUrl}
            beforeAlt={editCopy.beforeAlt} afterAlt={editCopy.afterAlt} beforeLabel={editCopy.before} afterLabel={editCopy.after}
            controlLabel={editCopy.compareLabel} hint={editCopy.compareHint} loadingLabel={editCopy.loadingResult}
            loadErrorLabel={editCopy.resultLoadError} reloadLabel={editCopy.reloadResult}
            onMetadataChange={metadata => setResultMetadata(metadata && { jobId: editing.result!.jobId, metadata })} />
          {resultMetadata?.jobId === editing.result.jobId && <ImageFileDetails metadata={resultMetadata.metadata} copy={t.imageDetails} locale={locale} className="mt-3" />}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><Button type="button" variant="outline" className="rounded-full" onClick={clearPhoto}>{editCopy.editAnother}</Button>{download}</div>
        </div> : <>{photo}{controls}<div className="mt-4 flex justify-end">{action}</div></>}
        <div className="px-2 pb-1">{notices}</div>
      </>}
      <Dialog open={signinOpen} onOpenChange={setSigninOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editCopy.signinTitle}</DialogTitle><DialogDescription>{editCopy.signinDescription}</DialogDescription></DialogHeader>
          <LoginForm onSuccess={async () => { await session.refetch(); setSigninOpen(false); editing.reset(); setError(""); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
