/**
 * Application Configuration
 * 
 * This is the main configuration file.
 * - App configuration is defined here
 * - Other configurations are imported from config/ folder
 */

import { requireEnvForService } from './config/utils';
import { authConfig } from './config/auth';
import { paymentConfig } from './config/payment';
import { creditsConfig } from './config/credits';
import { smsConfig } from './config/sms';
import { emailConfig } from './config/email';
import { captchaConfig } from './config/captcha';
import { databaseConfig } from './config/database';
import { storageConfig } from './config/storage';
import { aiConfig } from './config/ai';
import { aiImageConfig } from './config/aiImage';
import { aiVideoConfig } from './config/aiVideo';
import { affiliateConfig } from './config/affiliate';

// Re-export types for backwards compatibility
export type { RecurringPlan, OneTimePlan, CreditPlan, Plan } from './config/types';

/**
 * Application Configuration
 */
export const config = {
  /**
   * Application Configuration
   */
  app: {
    /**
     * Application Name
     * This will be used throughout the application for branding
     */
    name: 'AI Body Editor',

    /**
     * Logo Configuration
     * Customize your application's logo appearance
     */
    logo: {
      /**
       * Logo icon URL (path relative to public folder or absolute URL)
       * Recommended size: 40x40px for square icon
       * @example '/logo.svg' or 'https://example.com/logo.png'
       */
      iconUrl: '/logo.svg',

      /**
       * Full logo image URL (optional, includes icon and text)
       * Used for scenarios where you want a complete logo image instead of icon + text
       * If not provided, icon + app name text will be used
       * Recommended size: 200x40px
       */
      fullLogoUrl: '' as string | undefined,

      /**
       * Custom CSS classes for the icon container
       * Use this to add background color, border, rounded corners, padding, etc.
       * @example 'bg-primary rounded-full p-1' or 'bg-white shadow-sm rounded-lg'
       */
      iconClassName: 'bg-chart-1 rounded-full p-2' as string,
    },

    /**
     * Base URL Configuration
     * This will be used for all callback URLs and webhooks
     */
    get baseUrl() {
      return requireEnvForService('APP_BASE_URL', 'Application', 'http://localhost:7001');
    },

    /**
     * Theme Configuration
     * Default theme and color scheme for the application
     */
    theme: {
      /**
       * Default theme mode
       * @type {'light' | 'dark'}
       */
      defaultTheme: 'light' as const,

      /**
       * Default color scheme
       * @type {'default' | 'claude' | 'cosmic-night' | 'modern-minimal' | 'ocean-breeze' | 'perplexity' | 'soft-retouch'}
       */
      defaultColorScheme: 'soft-retouch' as const,

      /**
       * Storage key for theme persistence
       */
      storageKey: 'aibodyeditor-ui-theme'
    },

    /**
     * Internationalization Configuration
     * Default language and locale settings
     */
    i18n: {
      /**
       * Default locale. Served WITHOUT a URL prefix: `/` is the English home page (200, no redirect).
       */
      defaultLocale: 'en' as const,
      /**
       * Locales that are routable. Non-default locales live under a sub-directory
       * (e.g. `/de/...`). To launch a language: add its dictionary in `libs/i18n`,
       * then add the code here.
       *
       * Language is resolved ONLY from the URL path. Never from cookies or
       * Accept-Language (crawlers send neither, so every language would get the same HTML).
       */
      locales: ['en'] as const,
    },

    /**
     * Payment Related URLs
     */
    payment: {
      /**
       * Payment Success/Cancel URLs
       * These URLs will be used by payment providers for redirects
       * The locale middleware will automatically add locale prefix
       */
      get successUrl() {
        return `${config.app.baseUrl}/payment-success`;
      },
      get cancelUrl() {
        return `${config.app.baseUrl}/payment-cancel`;
      },
    }
  },

  // Configurations from config/ folder
  auth: authConfig,
  payment: paymentConfig,
  credits: creditsConfig,
  sms: smsConfig,
  email: emailConfig,
  captcha: captchaConfig,
  database: databaseConfig,
  storage: storageConfig,
  ai: aiConfig,
  aiImage: aiImageConfig,
  aiVideo: aiVideoConfig,
  affiliate: affiliateConfig,
} as const;
