import { createFileRoute } from '@tanstack/react-router'
import { routeHead } from '@/lib/seo'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@libs/react-shared/ui/button'
import { XCircle } from 'lucide-react'
import { localizedPath } from '@/lib/i18n-path'
import { PLANS_PATH } from '@/lib/paths'

export const Route = createFileRoute('/{-$lang}/(root)/payment-cancel')({
  head: routeHead('paymentCancel'),
  component: PaymentCancelPage,
})

function PaymentCancelPage() {
  const { t, locale } = useTranslation()

  return (
    <div className="container max-w-2xl py-20">
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-red-100 p-3">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold">{t.payment.result.cancel.title}</h1>

        <p className="text-muted-foreground">
          {t.payment.result.cancel.description}
        </p>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row">
          <Button asChild>
            <a href={localizedPath(PLANS_PATH, locale)}>
              {t.payment.result.cancel.actions.tryAgain}
            </a>
          </Button>

          <Button variant="outline" asChild>
            <a href="/support">
              {t.payment.result.cancel.actions.contactSupport}
            </a>
          </Button>

          <Button variant="ghost" asChild>
            <a href={localizedPath('/', locale)}>
              {t.payment.result.cancel.actions.backToHome}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
