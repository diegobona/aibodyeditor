import { pgTable, text, timestamp, integer, boolean, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const bodyGuestEdit = pgTable('body_guest_edit', {
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
  refunded: boolean('refunded').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deadlineAt: timestamp('deadline_at', { withTimezone: true }).notNull(),
}, table => [
  uniqueIndex('body_guest_edit_request_idx').on(table.guestId, table.requestId),
  uniqueIndex('body_guest_edit_allowance_idx').on(table.guestId).where(sql`${table.status} IN ('processing', 'succeeded')`),
  index('body_guest_edit_network_time_idx').on(table.networkHash, table.createdAt),
  check('body_guest_edit_status_check', sql`${table.status} IN ('processing', 'succeeded', 'failed')`),
  check('body_guest_edit_cost_check', sql`${table.costCredits} = 0`),
]);
