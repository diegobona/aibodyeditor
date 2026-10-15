import { createFileRoute } from '@tanstack/react-router';
import { getBodyEditHandlers, withBodyEditDb } from '@/lib/body-edit-server';
import { BODY_EDIT_CREDIT_COST, creditsConfig } from '../../../../../config/credits';

export const Route = createFileRoute('/api/body-edit')({
  server: { handlers: {
    GET: async ({ request }) => {
      if (new URL(request.url).searchParams.has('requestId')) {
        return withBodyEditDb(async ({ request }: { request: Request }) => (await getBodyEditHandlers(request)).lookup(request))({ request });
      }
      try { return (await getBodyEditHandlers()).config(request); }
      catch { return Response.json({ available: false, costCredits: BODY_EDIT_CREDIT_COST, freeTrialEdits: creditsConfig.publicOffer.freeTrialEdits }, { headers: { 'Cache-Control': 'no-store' } }); }
    },
    POST: withBodyEditDb(async ({ request }) => (await getBodyEditHandlers(request)).submit(request)),
  } },
});
