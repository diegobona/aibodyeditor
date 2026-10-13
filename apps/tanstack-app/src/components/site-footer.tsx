import { Link } from '@tanstack/react-router'
import { useTranslation } from '@/hooks/use-translation'
import { TOOL_PAGES } from '@/lib/tools'

/**
 * Site-wide footer for every content page in the (root) layout.
 * Contains the full site navigation: one keyword-anchored link to EVERY
 * indexable page (home + each published tool from lib/tools.ts).
 * When a page ships, it appears here automatically via TOOL_PAGES.
 */
export function SiteFooter() {
  const { t, langParam } = useTranslation()
  const footer = t.home.footer
  const linkClass = 'text-muted-foreground hover:text-foreground'

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="flex flex-col gap-3">
          <p className="font-display text-xl font-semibold text-foreground">{footer.homeLinkText}</p>
          <p className="text-sm text-muted-foreground">
            {footer.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
        <nav aria-label={footer.siteNavLabel}>
          <p className="text-sm font-semibold text-foreground">{footer.toolsTitle}</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <li>
              <Link to="/{-$lang}" params={{ lang: langParam }} className={linkClass}>
                {footer.homeLinkText}
              </Link>
            </li>
            {TOOL_PAGES.map((tool) => (
              <li key={tool.key}>
                <Link to={tool.to} params={{ lang: langParam }} className={linkClass}>
                  {t.toolPages[tool.key].hero.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
