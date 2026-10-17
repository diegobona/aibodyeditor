import { createFileRoute } from '@tanstack/react-router';
import { getBodyEditHandlers, withBodyEditDb } from '@/lib/body-edit-server';
export const Route = createFileRoute('/api/body-edit/history')({
  server: { handlers: {
    GET: withBodyEditDb(async ({ request }) => (await getBodyEditHandlers(request)).history(request)),
  } },
});
