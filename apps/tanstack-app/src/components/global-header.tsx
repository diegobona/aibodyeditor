/**
 * Known Issue: Radix UI Hydration Mismatch
 *
 * DropdownMenu components may cause hydration warnings due to Radix UI
 * generating different IDs on server vs client with React 19.2's useId hook.
 * This is a known upstream issue and does not affect functionality.
 *
 * @see https://github.com/radix-ui/primitives/issues/3700
 */

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Check, Globe } from "lucide-react";
import { Button } from "@libs/react-shared/ui/button";
import { authClientReact } from "@libs/auth/authClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@libs/react-shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@libs/react-shared/ui/avatar";
import { getLocaleLabel, type RoutableLocale } from "@libs/i18n";
import { useTranslation } from "@/hooks/use-translation";
import { localizedPath } from "@/lib/i18n-path";
import { TOOL_PAGES } from "@/lib/tools";

interface HeaderProps {
  className?: string;
}

/**
 * Language switcher. Only rendered when more than one locale is routable.
 * Switching is a plain URL change (`/` <-> `/de/`); no cookie is written.
 */
function LanguageMenu() {
  const { locale: currentLocale, locales, changeLocale } = useTranslation();
  if (locales.length < 2) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 px-3">
          <Globe className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{getLocaleLabel(currentLocale)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale: RoutableLocale) => (
          <DropdownMenuItem key={locale} onClick={() => locale !== currentLocale && changeLocale(locale)}>
            <span>{getLocaleLabel(locale)}</span>
            {currentLocale === locale && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * "Try it free" CTA. Home and every tool page carry their own upload widget
 * (`#try`), so there it is an in-page jump — no extra cross-page link with a
 * non-keyword anchor. Elsewhere (dashboard, payment pages) it goes to `/#try`.
 */
function TryFreeCta({ className, onClick }: { className: string; onClick?: () => void }) {
  const { t, locale, langParam } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const contentPaths = ["/", ...TOOL_PAGES.map((tool) => tool.to.replace("/{-$lang}", ""))].map((path) =>
    localizedPath(path, locale),
  );
  const onContentPage = contentPaths.includes(pathname);

  return (
    <Button asChild className={className}>
      {onContentPage ? (
        <a href="#try" onClick={onClick}>
          {t.home.nav.tryFree}
        </a>
      ) : (
        <Link to="/{-$lang}" params={{ lang: langParam }} hash="try" onClick={onClick}>
          {t.home.nav.tryFree}
        </Link>
      )}
    </Button>
  );
}

export default function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t, locale: currentLocale, langParam } = useTranslation();

  const { data: session, isPending } = authClientReact.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClientReact.signOut();
    navigate({ to: "/{-$lang}", params: { lang: langParam } });
  };

  const navLinkClass =
    "text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground";

  return (
    <header className={`sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md ${className ?? ""}`}>
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link
            to="/{-$lang}"
            params={{ lang: langParam }}
            className="font-display text-[22px] font-semibold tracking-tight text-foreground"
          >
            {t.toolPages.common.homeName}
          </Link>

          {/* Main nav: one link per published tool page, anchor = its core keyword (lib/tools.ts). */}
          <nav aria-label={t.home.footer.siteNavLabel} className="hidden items-center gap-8 md:flex">
            {TOOL_PAGES.map((tool) => (
              <Link key={tool.key} to={tool.to} params={{ lang: langParam }} className={navLinkClass}>
                {t.toolPages[tool.key].hero.title}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageMenu />
            {isPending ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="flex items-center gap-2 rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user.image || ""} alt={user.name || user.email || "User"} />
                      <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-foreground">{user.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href={localizedPath("/dashboard", currentLocale)}>{t.header.userMenu.personalSettings}</a>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <a href={localizedPath("/admin", currentLocale)}>{t.header.userMenu.adminPanel}</a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                    {t.header.auth.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" className="h-11 rounded-full px-4 text-[15px]">
                <Link to="/{-$lang}/signin" params={{ lang: langParam }}>
                  {t.header.auth.signIn}
                </Link>
              </Button>
            )}
            <TryFreeCta className="h-11 rounded-full bg-foreground px-5 text-[15px] text-background hover:bg-foreground/90" />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden"
          >
            <span className="sr-only">{t.header.mobile.openMenu}</span>
            {isMenuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav aria-label={t.home.footer.siteNavLabel} className="container flex flex-col gap-1 px-4 py-3">
            {TOOL_PAGES.map((tool) => (
              <Link
                key={tool.key}
                to={tool.to}
                params={{ lang: langParam }}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-foreground hover:bg-muted aria-[current=page]:bg-muted"
              >
                {t.toolPages[tool.key].hero.title}
              </Link>
            ))}
          </nav>
          <div className="container flex flex-col gap-2 border-t border-border px-4 py-4">
            {user ? (
              <>
                <a href={localizedPath("/dashboard", currentLocale)} className="rounded-xl px-3 py-3 text-base font-medium hover:bg-muted">
                  {t.header.userMenu.personalSettings}
                </a>
                {user.role === "admin" && (
                  <a href={localizedPath("/admin", currentLocale)} className="rounded-xl px-3 py-3 text-base font-medium hover:bg-muted">
                    {t.header.userMenu.adminPanel}
                  </a>
                )}
                <button type="button" onClick={handleSignOut} className="rounded-xl px-3 py-3 text-left text-base font-medium text-destructive hover:bg-destructive/10">
                  {t.header.auth.signOut}
                </button>
              </>
            ) : (
              <Button asChild variant="outline" className="h-12 rounded-full">
                <Link to="/{-$lang}/signin" params={{ lang: langParam }}>
                  {t.header.auth.signIn}
                </Link>
              </Button>
            )}
            <TryFreeCta
              className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setIsMenuOpen(false)}
            />
            <LanguageMenu />
          </div>
        </div>
      )}
    </header>
  );
}
