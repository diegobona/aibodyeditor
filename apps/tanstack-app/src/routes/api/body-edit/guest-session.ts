import { createFileRoute } from '@tanstack/react-router';
import { getBodyEditHandlers, withBodyEditDb } from '@/lib/body-edit-server';

export const Route = createFileRoute('/api/body-edit/guest-session')({
  server: { handlers: {
    POST: withBodyEditDb(async ({ request }) => (await getBodyEditHandlers(request)).guestSession(request)),
  } },
});
