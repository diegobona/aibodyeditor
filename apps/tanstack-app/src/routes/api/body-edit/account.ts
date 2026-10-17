import { createFileRoute } from '@tanstack/react-router';
import { getBodyEditHandlers, withBodyEditDb } from '@/lib/body-edit-server';

export const Route = createFileRoute('/api/body-edit/account')({
  server: { handlers: {
    POST: withBodyEditDb(async ({ request }) => (await getBodyEditHandlers(request)).account(request)),
  } },
});
