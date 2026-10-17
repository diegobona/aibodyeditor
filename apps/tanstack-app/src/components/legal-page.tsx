import { bodyEditConfig } from '../../../../config/body-editor';
import { bodyGuestConfig } from '../../../../config/body-guest';
import { legalConfig } from '../../../../config/legal';
import { useTranslation } from '@/hooks/use-translation';
import { localizedPath } from '@/lib/i18n-path';

export const LEGAL_PAGES = [
  { key: 'privacy', path: '/privacy' },
  { key: 'terms', path: '/terms' },
  { key: 'deletion', path: '/deletion' },
] as const;
type LegalPageKey = typeof LEGAL_PAGES[number]['key'];

export function PolicyNotice() {
  const { t, locale } = useTranslation();
  return <>{t.legal.acceptTerms}{' '}<a href={localizedPath('/terms', locale)}>{t.legal.terms.title}</a>{' '}{t.legal.acknowledgePrivacy}{' '}<a href={localizedPath('/privacy', locale)}>{t.legal.privacy.title}</a>.</>;
}

/** Public policy content is rendered in server HTML, including all cross-links. */
export function LegalPage({ pageKey }: { pageKey: LegalPageKey }) {
  const { t, locale } = useTranslation();
  const copy = t.legal[pageKey];
  const format = (text: string) => text.replaceAll('{operator}', legalConfig.operatorName)
    .replaceAll('{days}', String(bodyEditConfig.resultRetentionDays))
    .replaceAll('{guestDays}', String(bodyGuestConfig.cookieMaxAgeSeconds / 86_400));
  const updated = new Date(legalConfig.lastUpdated + 'T00:00:00Z').toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  return <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
    <a href={localizedPath('/', locale)} className="text-sm font-medium text-primary underline-offset-4 hover:underline">{t.toolPages.common.homeName}</a>
    <header className="mt-5 border-b pb-6"><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground"><time dateTime={legalConfig.lastUpdated}>{t.legal.updated.replace('{date}', updated)}</time></p>
      <p className="mt-5 text-base leading-7 text-muted-foreground">{format(copy.intro)}</p>
    </header>
    <nav aria-label={t.legal.navigation} className="my-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">{LEGAL_PAGES.map(page => <a key={page.key} href={localizedPath(page.path, locale)} aria-current={page.key === pageKey ? 'page' : undefined} className="text-muted-foreground underline-offset-4 hover:underline aria-[current=page]:text-primary">{t.legal[page.key].title}</a>)}</nav>
    <div className="space-y-7">{copy.sections.map((section: { title: string; paragraphs: string[] }, index: number) => <section key={index}>
      <h2 className="text-lg font-semibold">{section.title}</h2>
      {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex} className="mt-3 text-sm leading-7 text-muted-foreground">{format(paragraph)}</p>)}
    </section>)}
    {legalConfig.privacyEmail && <section id="contact" className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">{t.legal.contactTitle}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{format(t.legal.contact)}</p>
      <a className="mt-2 inline-block font-medium text-primary underline underline-offset-4" href={'mailto:' + legalConfig.privacyEmail}>{legalConfig.privacyEmail}</a>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{t.legal.requestDetails}</p>
    </section>}
    </div>
    {pageKey === 'deletion' && <a href={localizedPath('/my-works', locale)} className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">{t.myWorks.title}</a>}
  </article>;
}
