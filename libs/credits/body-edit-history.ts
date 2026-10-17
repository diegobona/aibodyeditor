import { normalizeBodyEditIntensity, bodyEditConfig, type BodyEditMode } from '../../config/body-editor';
import type { BodyEditRepositoryOptions } from './body-edit-repository';
import { BodyEditError, type BodyEditResultStore } from './body-edit-types';

export const BODY_EDIT_HISTORY_PAGE_SIZE = 24;
const lifetime = () => bodyEditConfig.resultRetentionDays * 86_400_000;
export const bodyEditExpiresAt = (createdAt: Date) => new Date(createdAt.getTime() + lifetime());
export interface BodyEditHistoryItem {
  id: string; mode: BodyEditMode; intensity: number; createdAt: string; expiresAt: string;
  imageUrl: string; downloadUrl: string;
}
export interface BodyEditHistory {
  list(userId: string, page: number): Promise<{ items: BodyEditHistoryItem[]; hasMore: boolean; retentionDays: number }>;
  remove(userId: string, jobId: string): Promise<void>;
  cleanup(): Promise<number>;
}

/** Deleting an image preserves job/idempotency records and the credit ledger. */
export function createBodyEditHistory(options: BodyEditRepositoryOptions, storage: BodyEditResultStore, now = () => new Date()): BodyEditHistory {
  type Row = { id: string; user_id: string; result_key: string | null; mode: BodyEditMode; intensity: string; created_at: string | number | Date };
  const query = async (sql: string, values: unknown[] = []): Promise<Row[]> => {
    if (options.dialect === 'sqlite') {
      const statement = options.sqlite.prepare(sql.replace(/\$\d+/g, '?'));
      if (/^SELECT/i.test(sql)) return statement.all(...values) as Row[];
      statement.run(...values); return [];
    }
    const run = async () => {
      const client = await options.pool.connect();
      try { return (await client.query(sql, values)).rows as Row[]; }
      finally { client.release(); }
    };
    return options.withFresh ? options.withFresh(run) : run();
  };
  const dateValue = (date: Date) => options.dialect === 'sqlite' ? date.getTime() : date;
  const created = (row: Row) => new Date(options.dialect === 'sqlite' ? Number(row.created_at) : row.created_at);
  const erase = async (row: Row, guest = false) => {
    if (!row.result_key) return;
    // A storage failure leaves the database reference available for retry.
    await storage.delete(row.result_key);
    const table = guest ? 'body_guest_edit' : 'body_image_edit';
    const owner = guest ? 'guest_id' : 'user_id';
    await query(`UPDATE ${table} SET result_key = NULL, result_mime_type = NULL WHERE ${owner} = $1 AND id = $2 AND result_key = $3`, [row.user_id, row.id, row.result_key]);
  };
  return {
    async list(userId, page) {
      if (!userId || !Number.isSafeInteger(page) || page < 0 || page > 1000) throw new BodyEditError('INVALID_INPUT', 400);
      const cutoff = dateValue(new Date(now().getTime() - lifetime()));
      const expired = await query("SELECT id, user_id, result_key FROM body_image_edit WHERE user_id = $1 AND status = 'succeeded' AND result_key IS NOT NULL AND created_at <= $2 LIMIT 100", [userId, cutoff]);
      for (const row of expired) await erase(row);
      const rows = await query("SELECT id, user_id, result_key, mode, intensity, created_at FROM body_image_edit WHERE user_id = $1 AND status = 'succeeded' AND result_key IS NOT NULL AND created_at > $2 ORDER BY created_at DESC, id DESC LIMIT $3 OFFSET $4", [userId, cutoff, BODY_EDIT_HISTORY_PAGE_SIZE + 1, page * BODY_EDIT_HISTORY_PAGE_SIZE]);
      return { items: rows.slice(0, BODY_EDIT_HISTORY_PAGE_SIZE).map(row => ({
        id: row.id, mode: row.mode, intensity: normalizeBodyEditIntensity(row.intensity), createdAt: created(row).toISOString(),
        expiresAt: bodyEditExpiresAt(created(row)).toISOString(), imageUrl: `/api/body-edit/${row.id}/image`, downloadUrl: `/api/body-edit/${row.id}/image?download=1`,
      })), hasMore: rows.length > BODY_EDIT_HISTORY_PAGE_SIZE, retentionDays: bodyEditConfig.resultRetentionDays };
    },
    async remove(userId, jobId) {
      const [row] = await query("SELECT id, user_id, result_key FROM body_image_edit WHERE user_id = $1 AND id = $2 AND status = 'succeeded'", [userId, jobId]);
      if (!row) throw new BodyEditError('NOT_FOUND', 404);
      await erase(row);
    },
    async cleanup() {
      const cutoff = dateValue(new Date(now().getTime() - lifetime()));
      const rows = await query("SELECT id, user_id, result_key FROM body_image_edit WHERE status = 'succeeded' AND result_key IS NOT NULL AND created_at <= $1 ORDER BY created_at ASC LIMIT 100", [cutoff]);
      for (const row of rows) await erase(row);
      const guests = rows.length < 100 ? await query("SELECT id, guest_id AS user_id, result_key FROM body_guest_edit WHERE status = 'succeeded' AND result_key IS NOT NULL AND created_at <= $1 ORDER BY created_at ASC LIMIT $2", [cutoff, 100 - rows.length]) : [];
      for (const row of guests) await erase(row, true);
      return rows.length + guests.length;
    },
  };
}
