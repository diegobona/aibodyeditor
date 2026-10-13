import { useEffect, useId, useRef, useState, type DragEvent } from 'react'
import { ImageUp, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@libs/react-shared/ui/button'
import { cn } from '@libs/ui/utils/cn'
import { useTranslation } from '@/hooks/use-translation'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024
const MODES = ['slim', 'muscle', 'proportions'] as const
type Mode = (typeof MODES)[number]

/**
 * Hero upload widget (interactive island). It carries NO indexable body copy:
 * all SEO text lives in the server-rendered sections around it.
 *
 * TODO(editor): wire `handleSubmit` to the anonymous free-trial edit flow once
 * the AI pipeline exists. Until then it only validates and previews locally.
 */
export function UploadDropzone({ className }: { className?: string }) {
  const { t } = useTranslation()
  const copy = t.home.upload
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('slim')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const pickFile = (candidate: File | undefined) => {
    if (!candidate) return
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError(copy.errors.type)
      return
    }
    if (candidate.size > MAX_BYTES) {
      setError(copy.errors.size)
      return
    }
    setError('')
    setFile(candidate)
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    pickFile(event.dataTransfer.files?.[0])
  }

  const handleSubmit = () => {
    if (!file) {
      inputRef.current?.click()
      return
    }
    toast.info(copy.comingSoon)
  }

  return (
    <div className={cn('rounded-[28px] bg-card p-3 shadow-[0_1px_2px_rgb(30_26_46/0.06),0_12px_40px_-12px_rgb(30_26_46/0.18)]', className)}>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed p-6 text-center transition-colors',
          dragging ? 'border-primary bg-accent' : 'border-input bg-background hover:border-primary/60',
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="sr-only"
          aria-label={copy.inputLabel}
          onChange={(event) => pickFile(event.target.files?.[0])}
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt={copy.previewAlt} className="max-h-56 rounded-xl object-contain" />
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <RefreshCw className="size-4" aria-hidden="true" />
              {copy.replace}
            </span>
          </>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
              <ImageUp className="size-7" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold text-foreground">{copy.dropTitle}</span>
            <span className="text-sm text-muted-foreground">{copy.dropHint}</span>
          </>
        )}
      </label>

      {error && (
        <p role="alert" className="mt-3 px-2 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-3 px-1 pb-1 sm:flex-row sm:items-center sm:justify-between">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{copy.modeLabel}</legend>
          {MODES.map((value) => (
            <label
              key={value}
              className={cn(
                'cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                mode === value
                  ? 'border-primary bg-accent text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              <input
                type="radio"
                name="edit-mode"
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
                className="sr-only"
              />
              {copy.modes[value]}
            </label>
          ))}
        </fieldset>
        <Button type="button" size="lg" className="h-12 rounded-full px-7 text-base" onClick={handleSubmit}>
          {copy.submit}
        </Button>
      </div>
    </div>
  )
}
