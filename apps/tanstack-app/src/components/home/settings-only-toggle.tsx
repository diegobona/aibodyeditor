import { useTranslation } from "@/hooks/use-translation";

/** Controlled option reused by the top strip and individual gallery cards. */
export function SettingsOnlyToggle({ checked, disabled, onChange }: {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <label className="relative flex min-h-10 shrink-0 cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground has-[:disabled]:cursor-default has-[:disabled]:opacity-50">
      <input type="checkbox" role="switch" checked={checked} disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-default" />
      <span aria-hidden="true" className="relative h-5 w-9 rounded-full bg-input transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2" />
      {t.home.examples.settingsOnly}
    </label>
  );
}
