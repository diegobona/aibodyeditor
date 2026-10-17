import { createFileRoute } from '@tanstack/react-router';
import { routeHead } from '@/lib/seo';
import { LegalPage } from '@/components/legal-page';
export const Route = createFileRoute('/{-$lang}/(root)/privacy')({
  head: routeHead('privacy'), component: () => <LegalPage pageKey="privacy" />,
});
