# aibodyeditor.net Pre-Launch SEO Checklist

> Go through every item before each launch and each new page. `PROD=https://aibodyeditor.net`; for local checks replace it with `http://localhost:7001`.
> Any "❌" means rework. Do not ship.

---

## A. SSR and source-code visibility (hard constraint 1)

- [ ] Content pages have SSR enabled (no `ssr: false` / `ssr: 'data-only'` on content routes). Only `/dashboard` and `/admin/*` may be `ssr: false`.
- [ ] `curl -s $PROD/<path>` output contains the page's **`<h1>`** with text.
- [ ] Body paragraphs appear as plain text in the curl output (not only after JS renders).
- [ ] Internal links are `<a href="/...">` and visible in the source (no navigation that only exists as an `onClick`).
- [ ] Every content image has a meaningful `alt` attribute, and it is visible in the source.
- [ ] No `"use client"` component carries body copy (check: `grep -rn "use client" apps/tanstack-app/src` returns nothing, or only interaction-only components).
- [ ] Body copy is not wrapped in animation that starts at `opacity: 0` (framer-motion `initial`), so the server-rendered text is visible.
- [ ] Error pages return a real status code: a nonexistent path returns **404**, not "200 + Not Found page".

## B. Unique URL (hard constraint 2)

- [ ] `curl -I http://aibodyeditor.net/` → **301** `Location: https://aibodyeditor.net/`
- [ ] `curl -I https://www.aibodyeditor.net/foo` → **301** `Location: https://aibodyeditor.net/foo`
- [ ] `curl -I http://www.aibodyeditor.net/` → **301** (lands directly on `https://aibodyeditor.net/`, at most one hop)
- [ ] `curl -I $PROD/signin/` (trailing slash) → **301** to `/signin`
- [ ] `curl -I $PROD/en` and `$PROD/en/signin` → **301** to the unprefixed URL
- [ ] Cloudflare dashboard: SSL/TLS → Edge Certificates → **Always Use HTTPS** is on
- [ ] Cloudflare dashboard: Redirect Rule `www.aibodyeditor.net/*` → `https://aibodyeditor.net/${1}` (301) is configured (edge layer; the in-app middleware `src/start.ts` is the fallback)
- [ ] Every page has **exactly one** `<link rel="canonical">`
- [ ] canonical is an absolute URL, starts with `https://aibodyeditor.net`, **has no trailing slash, no `?query`, no `#hash`** (the home page canonical is `https://aibodyeditor.net`)
- [ ] With query parameters (`$PROD/?utm_source=x`), the canonical is still the bare URL
- [ ] `og:url` matches canonical

## C. Language and `<html lang>` (hard constraint 3 + i18n)

- [ ] `curl -s $PROD/ | head -c 200` contains `<html lang="en">`
- [ ] `curl -I $PROD/` is **200** (not 301/302/307 to `/en` or `/zh-CN`)
- [ ] `curl -I -H "Accept-Language: zh-CN" -H "Cookie: NEXT_LOCALE=zh-CN" $PROD/` is still **200** and returns English (language is not decided by cookie or Accept-Language)
- [ ] `/zh-CN` and `/zh-CN/*` return **404** (Chinese is disabled)
- [ ] `config.ts` → `app.i18n.locales` contains only languages that are actually live (currently `['en']`)
- [ ] When adding a language (e.g. `de`): the dictionary is complete → `locales` gets `'de'` → `/de` returns 200 with `<html lang="de">` → hreflang and the sitemap include `de` automatically
- [ ] Language switching navigates by URL only (`/` ↔ `/de/`). The code writes no locale cookie

## D. `<head>` content (lib/seo.ts)

- [ ] Every route's `head` comes from `seo('<pageId>', { lang })` (`apps/tanstack-app/src/lib/seo.ts`). No hand-written title/meta/canonical
- [ ] Each page has its own `<title>` (recommended 50–60 characters), different on every page
- [ ] Each page has its own `<meta name="description">` (recommended 120–160 characters)
- [ ] **No `<meta name="keywords">` anywhere** (`curl -s $PROD/ | grep -c 'name="keywords"'` = 0)
- [ ] OG: `og:title` / `og:description` / `og:url` / `og:image` / `og:type` / `og:site_name` / `og:locale` are all present
- [ ] Twitter: `twitter:card=summary_large_image`, title, description and image are present
- [ ] Indexable pages output hreflang: one `alternate` per live language + `x-default`. All are absolute URLs with no trailing slash
- [ ] JSON-LD: the home page has `WebSite` + `Organization`, and it passes the [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Replace `og:image` with a dedicated 1200×630 social share image (currently the placeholder `android-chrome-512x512.png`)

## E. noindex pages

| Path | Requirement |
|---|---|
| `/dashboard` | `ssr: false` + `<meta name="robots" content="noindex, nofollow">` + `X-Robots-Tag: noindex, nofollow` |
| `/admin` and all children | Same as above (`ssr: false` is set on the `admin.tsx` layout and inherited by children) |
| `/signin`, `/signup` | SSR kept (conversion path) + noindex meta + X-Robots-Tag |
| `/forgot-password`, `/reset-password` | noindex meta + X-Robots-Tag |
| `/payment-success`, `/payment-cancel` | SSR kept + noindex meta + X-Robots-Tag |
| `/api/*` | X-Robots-Tag |
| 404 page | Status 404 + noindex meta |

- [ ] `curl -sI $PROD/dashboard | grep -i x-robots-tag` → `noindex, nofollow` (check each row of the table)
- [ ] `curl -s $PROD/signin | grep 'name="robots"'` → `noindex, nofollow`

## F. sitemap.xml

- [ ] `$PROD/sitemap.xml` returns 200, `Content-Type: application/xml`
- [ ] The sitemap is a **whitelist**: only paths in `SITEMAP_PATHS` (`apps/tanstack-app/src/lib/sitemap.ts`). No crawlLinks or other auto-discovery
- [ ] After each indexable page ships, **add one line by hand** to `SITEMAP_PATHS`
- [ ] The sitemap **never contains** `/dashboard`, `/admin`, `/signin`, `/signup`, `/api` (`getSitemapPaths()` filters out every `NOINDEX_PREFIXES` entry, as a second safeguard)
- [ ] `<loc>` values match each page's canonical character for character (https, apex domain, no trailing slash)
- [ ] Every URL in the sitemap returns 200 directly (not 301/404)
- [ ] Submitted in Google Search Console and Bing Webmaster Tools

## G. robots.txt

- [ ] `$PROD/robots.txt` returns 200 with this content:
  ```
  User-agent: *
  Allow: /
  Disallow: /dashboard
  Disallow: /admin
  Disallow: /api
  Disallow: /signin
  Disallow: /signup

  Sitemap: https://aibodyeditor.net/sitemap.xml
  ```
- [ ] There is no static `apps/tanstack-app/public/robots.txt` overriding the route
- [ ] Note: paths blocked by robots are not crawled, so their noindex meta is never seen. If one of these URLs appears in GSC as "Indexed, though blocked by robots.txt", it only shows the bare URL. That is acceptable for login and back-office pages

## H. Pre-launch verification commands

Automated self-check (run against a running instance; exits 1 on any issue, writes `seo-audit-report.md`):

```bash
pnpm seo:audit http://localhost:7001
```

It checks every sitemap page (unique title / description / canonical / h1, keyword-first title, keyword anchors, required in-body links, footer site nav), the noindex pages, 404 status + noindex on unmatched URLs (incl. nested ones like `/body-editor/extra`) and the 301 rules. Run it again against production after deploy: `pnpm seo:audit https://aibodyeditor.net`.

```bash
curl -I https://aibodyeditor.net/
```
```bash
curl -s https://aibodyeditor.net/ | grep -o '<h1[^>]*>[^<]*</h1>'
```
```bash
curl -I http://www.aibodyeditor.net/
```
```bash
curl -s https://aibodyeditor.net/sitemap.xml
```
```bash
curl -s https://aibodyeditor.net/robots.txt
```

## J. Prices, ratings and internal links (applies from the homepage on)

- [ ] On-page prices and JSON-LD `Offer` come ONLY from `src/lib/public-offer.ts` (→ `config/credits.ts` `publicOffer.packs[].planId` → the same plan in `config/payment.ts`). Never hand-write a price number in a page or in seo.ts
- [ ] A pack whose `planId` is not set shows "Price coming soon" and emits no Offer in JSON-LD
- [ ] `AGGREGATE_RATING` stays `null` until there is a verifiable source of real reviews. While null: no rating block in production, no `aggregateRating` in JSON-LD
- [ ] FAQ text on the page and in `FAQPage` JSON-LD is identical (rendered from the same i18n data)
- [ ] Internal links use `<Link>` with the target page's keyword as anchor text; never "click here" / "learn more"
- [ ] No empty shell pages and no links to unbuilt pages. A tool page ships only with full content: add it to `TOOL_PAGES` (`src/lib/tools.ts`, which drives every tool link), register it in seo.ts with `indexable: true` + `toolPageJsonLd`, then add one line to `SITEMAP_PATHS`
- [ ] Each tool page: one core keyword (title first + the only h1), ≥400 words of original copy (no reworded copy shared between tool pages), visible breadcrumb = BreadcrumbList JSON-LD, an in-body link to `/` with anchor "AI body editor", Related Tools linking to published sibling tools by their keyword
- [ ] /virtual-try-on is out of scope: no route, no links
- [ ] Homepage before/after images are placeholder SVGs (`public/examples/*.svg`). When replacing with real photos, **rewrite the alt to describe the real image**, size ≥300×300

## I. Checklist for adding a new page

1. [ ] Add the page's title / description in `libs/i18n/locales/en.ts` (no keywords)
2. [ ] Add a `PAGES` entry in `src/lib/seo.ts` (path, indexable, meta, optional jsonLd)
3. [ ] The route uses `head: ({ params }) => seo('<id>', { lang: params.lang })`
4. [ ] The page has exactly one `<h1>`, and body copy / links / alt all appear in curl output
5. [ ] If indexable: add one line to `SITEMAP_PATHS`
6. [ ] Link to it from the home page or footer (internal links must exist in the source)
7. [ ] `pnpm typecheck && pnpm build` pass
