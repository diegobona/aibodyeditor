import { Link } from '@tanstack/react-router'
import { Button } from '@libs/react-shared/ui/button'
import { useTranslation } from '@/hooks/use-translation'

/**
 * 404 page (server-rendered with HTTP status 404).
 * React 19 hoists the <title>/<meta> below into <head>, so the page is
 * noindex even when no route `head()` ran.
 */
export function NotFound() {
  const { t, langParam } = useTranslation()

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <title>{t.notFound.metadata.title}</title>
      <meta name="robots" content="noindex, nofollow" />
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{t.notFound.title}</h1>
      <p className="max-w-md text-muted-foreground">{t.notFound.description}</p>
      <Button asChild>
        <Link to="/{-$lang}" params={{ lang: langParam }}>
          {t.notFound.backHome}
        </Link>
      </Button>
    </main>
  )
}
