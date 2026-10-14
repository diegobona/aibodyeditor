import { createFileRoute } from '@tanstack/react-router';
import { getBodyEditHandlers, withBodyEditDb } from '@/lib/body-edit-server';

export const Route = createFileRoute('/api/body-edit/$jobId')({
  server: { handlers: {
    GET: withBodyEditDb(async ({ request, params }: { request: Request; params: { jobId: string } }) =>
      (await getBodyEditHandlers()).status(request, params.jobId)),
  } },
});
