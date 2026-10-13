import { config } from '@config'
import { en, zhCN } from './locales'

// Re-export from config for consistency
export { config }

/**
 * Default locale. Served without a URL prefix (`/`, `/signin`, ...).
 */
export const defaultLocale = config.app.i18n.defaultLocale

/**
 * Routable locales (driven by `config.app.i18n.locales`).
 * Only these may appear as the first URL segment (`/de/...`). The default locale
 * never appears as a prefix.
 */
export const locales = config.app.i18n.locales

export type RoutableLocale = typeof locales[number]

/**
 * Human-readable labels for each locale.
 * When adding a new locale, add its label here so admin UIs can display it.
 * Falls back to the locale code itself if not listed.
 */
export const localeLabels: Record<string, string> = {
  'en': 'English',
  'zh-CN': '中文',
}

export function getLocaleLabel(locale: string): string {
  return localeLabels[locale] || locale
}

// 基于英文翻译自动推断类型
export type Translations = typeof en

/**
 * Translation dictionaries. A dictionary existing here does NOT make the locale
 * routable — see `locales` above. (`zh-CN` is kept for emails / shared libs but is
 * not served on the site.)
 */
export const translations = {
  en,
  'zh-CN': zhCN
} as const

export type SupportedLocale = keyof typeof translations

export function isValidLocale(locale: string): locale is RoutableLocale {
  return (locales as readonly string[]).includes(locale)
}

// 类型安全的翻译函数
export function getTranslation(locale: SupportedLocale): Translations {
  return (translations[locale] ?? translations[defaultLocale]) as Translations
}

export * from './locales'
