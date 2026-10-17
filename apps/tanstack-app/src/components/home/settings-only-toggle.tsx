import { useTranslation } from "@/hooks/use-translation";

/** Controlled option reused by the top strip and individual gallery cards. */
export function SettingsOnlyToggle({ checked, disabled, needsPhoto = false, onChange }: {
  checked: boolean;
  disabled: boolean;
  needsPhoto?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  const option = (
    <label className="relative flex min-h-10 shrink-0 cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground has-[:disabled]:cursor-default has-[:disabled]:opacity-50">
      <input type="checkbox" role="switch" checked={checked} disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:pointer-events-none disabled:cursor-default" />
      <span aria-hidden="true" className="relative h-5 w-9 rounded-full bg-input transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2" />
      {t.home.examples.settingsOnly}
    </label>
  );
  if (!disabled || !needsPhoto) return option;
  return (
    <span tabIndex={0} data-settings-only-hint aria-label={t.home.examples.settingsOnlyPhotoRequired}
      className="group relative inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-ring">
      {option}
      <span role="tooltip" className="pointer-events-none absolute right-0 top-full z-50 mt-1 hidden w-64 rounded-lg bg-foreground px-3 py-2 text-xs font-normal leading-relaxed text-background shadow-md group-hover:block group-focus-visible:block">
        {t.home.examples.settingsOnlyPhotoRequired}
      </span>
    </span>
  );
}
