import { pgTable, text, timestamp, integer, boolean, uniqueIndex, check } from 'drizzle-orm/pg-core';
import { sql, type InferSelectModel } from 'drizzle-orm';
import { user } from './user';

export const bodyImageEdit = pgTable('body_image_edit', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(),
  inputHash: text('input_hash').notNull(),
  mode: text('mode').notNull(),
  intensity: text('intensity').notNull(),
  model: text('model').notNull(),
  status: text('status').notNull().default('processing'),
  costCredits: integer('cost_credits').notNull(),
  resultKey: text('result_key'),
  resultMimeType: text('result_mime_type'),
  errorCode: text('error_code'),
  refunded: boolean('refunded').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deadlineAt: timestamp('deadline_at', { withTimezone: true }).notNull(),
}, (table) => [
  uniqueIndex('body_image_edit_user_request_idx').on(table.userId, table.requestId),
  check('body_image_edit_status_check', sql`${table.status} IN ('processing', 'succeeded', 'failed')`),
  check('body_image_edit_cost_check', sql`${table.costCredits} > 0`),
]);
export type BodyImageEdit = InferSelectModel<typeof bodyImageEdit>;
