import { createFileRoute } from '@tanstack/react-router';
import { routeHead } from '@/lib/seo';
import { LegalPage } from '@/components/legal-page';
export const Route = createFileRoute('/{-$lang}/(root)/terms')({
  head: routeHead('terms'), component: () => <LegalPage pageKey="terms" />,
});
