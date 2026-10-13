/**
 * Public offer (free trial + credit packs) shown on marketing pages AND
 * declared in JSON-LD. Both read from here, so on-page prices and structured
 * data can never diverge. Source of truth: `config.credits.publicOffer`
 * -> plan ids -> `config.payment.plans` (the same plan checkout charges).
 */
import { config } from '@config'

export interface CreditPack {
  key: string
  planId: string | null
  /** null until the payment plan is configured */
  price: number | null
  currency: string
  credits: number | null
}

interface PlanLike {
  amount?: number
  currency?: string
  credits?: number
  duration?: { type?: string }
}

export const FREE_TRIAL_EDITS = config.credits.publicOffer.freeTrialEdits
export const CREDITS_PER_EDIT = config.credits.publicOffer.creditsPerEdit

export function getCreditPacks(): CreditPack[] {
  const plans = config.payment.plans as unknown as Record<string, PlanLike>
  return config.credits.publicOffer.packs.map(({ key, planId }) => {
    const plan = planId ? plans[planId] : undefined
    const isCreditPlan = plan?.duration?.type === 'credits'
    return {
      key,
      planId,
      price: isCreditPlan && typeof plan?.amount === 'number' ? plan.amount : null,
      currency: plan?.currency ?? 'USD',
      credits: isCreditPlan && typeof plan?.credits === 'number' ? plan.credits : null,
    }
  })
}

/** Formats a price exactly as it is shown on the page (and reused in JSON-LD text). */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

/**
 * Aggregate rating. Reserved: stays `null` until there are REAL reviews from a
 * verifiable source. While null, nothing is rendered in production and no
 * `aggregateRating` is emitted in JSON-LD (fabricated ratings violate Google's
 * structured-data policy).
 */
export const AGGREGATE_RATING: null | {
  ratingValue: number
  ratingCount: number
  bestRating: 5
  sourceName: string
} = null
