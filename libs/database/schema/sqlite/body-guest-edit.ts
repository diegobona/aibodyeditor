import { sqliteTable, text, integer, uniqueIndex, index, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const bodyGuestEdit = sqliteTable('body_guest_edit', {
  id: text('id').primaryKey(),
  guestId: text('guest_id').notNull(),
  networkHash: text('network_hash').notNull(),
  requestId: text('request_id').notNull(),
  inputHash: text('input_hash').notNull(),
  mode: text('mode').notNull(),
  intensity: text('intensity').notNull(),
  model: text('model').notNull(),
  status: text('status').notNull().default('processing'),
  costCredits: integer('cost_credits').notNull().default(0),
  resultKey: text('result_key'),
  resultMimeType: text('result_mime_type'),
  errorCode: text('error_code'),
  refunded: integer('refunded', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  deadlineAt: integer('deadline_at', { mode: 'timestamp_ms' }).notNull(),
}, table => [
  uniqueIndex('body_guest_edit_request_idx').on(table.guestId, table.requestId),
  uniqueIndex('body_guest_edit_allowance_idx').on(table.guestId).where(sql`${table.status} IN ('processing', 'succeeded')`),
  index('body_guest_edit_network_time_idx').on(table.networkHash, table.createdAt),
  check('body_guest_edit_status_check', sql`${table.status} IN ('processing', 'succeeded', 'failed')`),
  check('body_guest_edit_cost_check', sql`${table.costCredits} = 0`),
]);
