import { useId } from 'react';
import { BODY_EDIT_INTENSITY } from '../../../config/body-editor';

export function BodyEditIntensitySlider({ value, onChange, disabled, label, lowLabel, highLabel, valueLabel, description, hint }: {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  label: string;
  lowLabel: string;
  highLabel: string;
  valueLabel: string;
  description: string;
  hint: string;
}) {
  const id = useId();
  return (
    <div className="w-full min-w-0 space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold">{label}</label>
        <output htmlFor={id} className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold tabular-nums text-primary" aria-hidden="true">
          {value}/100
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={BODY_EDIT_INTENSITY.min}
        max={BODY_EDIT_INTENSITY.max}
        step={BODY_EDIT_INTENSITY.step}
        value={value}
        disabled={disabled}
        aria-valuetext={valueLabel}
        aria-describedby={id + '-description'}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="block h-8 w-full cursor-pointer rounded-full accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-50"
      />
      <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
        <span>{lowLabel}</span><span>{highLabel}</span>
      </div>
      <p id={id + '-description'} className="text-xs leading-relaxed text-muted-foreground">{description} {hint}</p>
    </div>
  );
}
