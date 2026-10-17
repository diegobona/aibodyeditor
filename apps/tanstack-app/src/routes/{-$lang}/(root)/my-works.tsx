import { createFileRoute } from '@tanstack/react-router';
import { requireAuth } from '@/lib/auth-guard';
import { routeHead } from '@/lib/seo';
import { MyWorks } from '@/components/my-works';
export const Route = createFileRoute('/{-$lang}/(root)/my-works')({
  beforeLoad: async ({ params }) => { await requireAuth({ params }); },
  head: routeHead('myWorks'),
  component: MyWorks,
});
