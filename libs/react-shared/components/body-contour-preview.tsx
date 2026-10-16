import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Eye, EyeOff, LoaderCircle, Move, RotateCcw } from 'lucide-react';
import type { BodyEditMode } from '../../../config/body-editor';
import { buildBodyContourPreview } from '../../body-preview/geometry';
import type { BodyPhotoAnalysis, PreviewRegion } from '../../body-preview/types';
import { cn } from '../../ui/utils/cn';

export interface BodyContourPreviewCopy {
  analyzing: string;
  unavailable: string;
  noPerson: string;
  chestUnclear: string;
  area: string;
  original: string;
  target: string;
  note: string;
  show: string;
  hide: string;
  adjust: string;
  adjustShort: string;
  done: string;
  doneShort: string;
  reset: string;
  alignmentHint: string;
  alignmentHandle: string;
}

type AnalysisState = { file: Blob; analysis?: BodyPhotoAnalysis; error?: 'NO_PERSON' | 'UNAVAILABLE' };
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Local, non-destructive outline guide. Only changing the source runs inference. */
export function BodyContourPreview({ file, previewUrl, mode, intensity, disabled, alt, copy, className, frameClassName }: {
  file: Blob;
  previewUrl: string;
  mode: BodyEditMode;
  intensity: number;
  disabled: boolean;
  alt: string;
  copy: BodyContourPreviewCopy;
  className?: string;
  frameClassName?: string;
}) {
  const [state, setState] = useState<AnalysisState>();
  const [visible, setVisible] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [adjustment, setAdjustment] = useState<{ file: Blob; mode: BodyEditMode; region: PreviewRegion }>();
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; region: PreviewRegion } | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    setState({ file });
    setAdjustment(undefined);
    setAdjusting(false);
    setVisible(true);
    void import('../../body-preview/analyze')
      .then(({ analyzeBodyPhoto }) => analyzeBodyPhoto(file, controller.signal))
      .then(analysis => { if (!controller.signal.aborted) setState({ file, analysis }); })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const code = error && typeof error === 'object' && 'code' in error ? error.code : error instanceof Error ? error.message : '';
        setState({ file, error: code === 'NO_PERSON' ? 'NO_PERSON' : 'UNAVAILABLE' });
      });
    return () => controller.abort();
  }, [file]);

  useEffect(() => { setAdjusting(false); dragRef.current = undefined; }, [mode]);
  const analysis = state?.file === file ? state.analysis : undefined;
  const error = state?.file === file ? state.error : undefined;
  const region = adjustment?.file === file && adjustment.mode === mode ? adjustment.region : undefined;
  const contour = useMemo(() => analysis ? buildBodyContourPreview(analysis, mode, intensity, region) : undefined,
    [analysis, mode, intensity, region]);
  const targetAvailable = contour?.targetAvailable !== false;
  const showChestArea = mode === 'breast';
  const setRegion = (next: PreviewRegion) => setAdjustment({ file, mode, region: next });

  const photoPoint = (clientX: number, clientY: number) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box || !analysis) return undefined;
    const scale = Math.min(box.width / analysis.width, box.height / analysis.height);
    const width = analysis.width * scale, height = analysis.height * scale;
    return { x: (clientX - box.left - (box.width - width) / 2) / width, y: (clientY - box.top - (box.height - height) / 2) / height };
  };
  const startDrag = (event: PointerEvent<SVGGElement>) => {
    if (disabled || !contour || !adjusting) return;
    const point = photoPoint(event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    dragRef.current = { pointerId: event.pointerId, ...point, region: contour.region };
  };
  const moveDrag = (event: PointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || disabled || drag.pointerId !== event.pointerId) return;
    const point = photoPoint(event.clientX, event.clientY);
    if (point) setRegion({ ...drag.region, x: clamp(drag.region.x + point.x - drag.x), y: clamp(drag.region.y + point.y - drag.y) });
  };
  const nudge = (event: KeyboardEvent<SVGGElement>) => {
    if (disabled || !contour || !adjusting) return;
    const steps: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    const amount = event.shiftKey ? 0.03 : 0.01;
    setRegion({ ...contour.region, x: clamp(contour.region.x + step[0] * amount), y: clamp(contour.region.y + step[1] * amount) });
  };

  return (
    <div data-body-contour-preview className={cn("overflow-hidden rounded-[20px] border border-border bg-background", className)}>
      <div className={cn("relative h-80 w-full sm:h-[420px]", frameClassName)} data-contour-frame>
        <img src={previewUrl} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
        {analysis && contour && visible && (
          <svg ref={svgRef} viewBox={`0 0 ${analysis.width} ${analysis.height}`} preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full" aria-label={showChestArea ? copy.area : copy.target} data-contour-overlay>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" aria-hidden="true">
              <path d={contour.originalPath} stroke="white" strokeWidth="4" vectorEffect="non-scaling-stroke" opacity="0.8" />
              <path d={contour.originalPath} stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" data-contour-original />
              {targetAvailable && <>
                <path d={contour.targetPath} stroke="white" strokeWidth="4.5" vectorEffect="non-scaling-stroke" opacity="0.9" />
                <path d={contour.targetPath} stroke="#7047eb" strokeWidth="2.5" vectorEffect="non-scaling-stroke" data-contour-target />
              </>}
            </g>
            {(adjusting || showChestArea) && (
              <g role={adjusting ? 'button' : undefined} tabIndex={adjusting ? disabled ? -1 : 0 : undefined}
                aria-label={adjusting ? copy.alignmentHandle : undefined} aria-disabled={adjusting ? disabled : undefined}
                className={cn('rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring', adjusting ? 'cursor-move touch-none' : 'pointer-events-none')}
                data-contour-alignment={adjusting ? '' : undefined}
                onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { dragRef.current = undefined; }}
                onPointerCancel={() => { dragRef.current = undefined; }} onLostPointerCapture={() => { dragRef.current = undefined; }} onKeyDown={nudge}>
                <ellipse cx={contour.region.x * analysis.width} cy={contour.region.y * analysis.height}
                  rx={contour.guideRegion.radiusX * analysis.width} ry={contour.guideRegion.radiusY * analysis.height}
                  fill="#7047eb" fillOpacity="0.09" stroke="#7047eb" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke"
                  data-contour-area={showChestArea ? '' : undefined} />
                {adjusting && <circle cx={contour.region.x * analysis.width} cy={contour.region.y * analysis.height}
                  r={Math.min(analysis.width, analysis.height) * 0.024} fill="white" stroke="#7047eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
              </g>
            )}
          </svg>
        )}
        {!analysis && !error && (
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-xl bg-card/95 px-3 py-2 text-xs font-medium shadow-sm" role="status">
            <LoaderCircle className="size-4 animate-spin text-primary" aria-hidden="true" />{copy.analyzing}
          </div>
        )}
      </div>
      <div className="border-t border-border bg-card px-3 py-1.5">
        {analysis && contour ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-slate-500" />{copy.original}</span>
                {targetAvailable && <span className="inline-flex items-center gap-1.5 text-primary"><span className="w-4 border-t-2 border-primary" />{copy.target}</span>}
                {showChestArea && <span className="inline-flex items-center gap-1.5 text-primary"><span className="w-4 border-t-2 border-dashed border-primary" />{copy.area}</span>}
              </div>
              <button type="button" disabled={disabled} onClick={() => { setVisible(!visible); setAdjusting(false); }}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-1 text-xs font-medium text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50">
                {visible ? <EyeOff className="size-3.5" aria-hidden="true" /> : <Eye className="size-3.5" aria-hidden="true" />}{visible ? copy.hide : copy.show}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {visible && <>
                <button type="button" disabled={disabled} aria-pressed={adjusting} aria-label={adjusting ? copy.done : copy.adjust}
                  title={adjusting ? copy.done : copy.adjust} onClick={() => setAdjusting(!adjusting)}
                  className={cn('inline-flex min-h-9 items-center gap-1.5 rounded-lg px-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50', adjusting ? 'text-primary' : 'text-muted-foreground')}>
                  <Move className="size-3.5" aria-hidden="true" />{adjusting ? copy.doneShort : copy.adjustShort}
                </button>
                {region && <button type="button" disabled={disabled} onClick={() => setAdjustment(undefined)}
                  className="inline-flex min-h-9 items-center gap-1 rounded-lg px-1 text-xs text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50">
                  <RotateCcw className="size-3" aria-hidden="true" />{copy.reset}
                </button>}
              </>}
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground" role={!targetAvailable ? 'status' : undefined}>
                {adjusting && visible ? copy.alignmentHint : !targetAvailable ? copy.chestUnclear : copy.note}
              </p>
            </div>
          </>
        ) : <p className="text-xs leading-relaxed text-muted-foreground" role="status">{error ? error === 'NO_PERSON' ? copy.noPerson : copy.unavailable : copy.note}</p>}
      </div>
    </div>
  );
}
