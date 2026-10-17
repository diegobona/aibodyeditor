import handler from '@tanstack/react-start/server-entry';

export default {
  fetch: handler.fetch,
  async scheduled() {
    const { withDbContext } = await import('./lib/with-request-db');
    const { getBodyEditHandlers } = await import('./lib/body-edit-server');
    const count = await withDbContext(async () => {
      const handlers = await getBodyEditHandlers();
      let total = 0;
      // Bounded batches keep database and object-store work predictable.
      for (let batch = 0; batch < 10; batch++) {
        const removed = await handlers.cleanupHistory(); total += removed;
        if (removed < 100) break;
      }
      return total;
    });
    console.info('[body-edit-history] expired results removed', { count });
  },
};
