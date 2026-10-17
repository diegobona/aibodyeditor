import type Database from 'better-sqlite3';
import { normalizeBodyEditIntensity } from '../../config/body-editor';
import { BODY_EDIT_WELCOME_CREDITS } from '../../config/credits';
import { TransactionTypeCode } from './utils';
import { BodyEditError, type BodyEditJob, type BodyEditOutcome, type BodyEditRepository, type ReserveBodyEdit } from './body-edit-types';

interface PgClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
interface PgOptions {
  dialect: 'pg';
  pool: { connect(): Promise<PgClient> };
  withFresh?: <T>(fn: () => Promise<T>) => Promise<T>;
}
type Options = PgOptions | { dialect: 'sqlite'; sqlite: Database.Database };
export type BodyEditRepositoryOptions = Options;
const trialId = (userId: string) => `body_edit_trial:${userId}`;
function record(row: any, sqlite: boolean): BodyEditJob {
  return { id: row.id, userId: row.user_id, requestId: row.request_id, inputHash: row.input_hash,
    mode: row.mode, intensity: normalizeBodyEditIntensity(row.intensity), model: row.model, status: row.status, costCredits: Number(row.cost_credits),
    resultKey: row.result_key, resultMimeType: row.result_mime_type, errorCode: row.error_code, refunded: Boolean(row.refunded),
    createdAt: new Date(sqlite ? Number(row.created_at) : row.created_at),
    updatedAt: new Date(sqlite ? Number(row.updated_at) : row.updated_at),
    deadlineAt: new Date(sqlite ? Number(row.deadline_at) : row.deadline_at) };
}
function assertUser(row: any, checkBan = false) {
  if (!row) throw new BodyEditError('UNAUTHORIZED', 401);
  if (checkBan && row.banned) throw new BodyEditError('FORBIDDEN', 403);
}
function assertJob(row: any) { if (!row) throw new BodyEditError('NOT_FOUND', 404); }
function metadata(job: Pick<BodyEditJob, 'id' | 'model' | 'mode' | 'intensity'>) {
  return JSON.stringify({ operation: 'body_edit', jobId: job.id, provider: 'openai', model: job.model, mode: job.mode, intensity: job.intensity });
}

/** Each transition owns its transaction; provider work never holds a DB transaction open. */
export function createBodyEditRepository(options: Options): BodyEditRepository & {
  initializeAccount(userId: string, now: Date): Promise<{ balance: number; bonusGranted: boolean; welcomeCredits: number }>;
} {
  if (options.dialect === 'sqlite') {
    const db = options.sqlite;
    const transaction = <T>(fn: () => T): T => db.transaction(fn).immediate();
    const account = (userId: string) => db.prepare('SELECT * FROM user WHERE id = ?').get(userId) as any;
    const job = (userId: string, id: string) => db.prepare('SELECT * FROM body_image_edit WHERE user_id = ? AND id = ?').get(userId, id) as any;
    const outcome = (row: any, reused = false): BodyEditOutcome => ({ job: record(row, true), balance: Number(account(row.user_id).credit_balance), reused });
    const ledger = (id: string, userId: string, type: string, amount: number, description: string, info: string, now: Date) => {
      db.prepare('INSERT INTO credit_transaction (id,user_id,type,amount,balance,description,metadata,created_at) VALUES (?,?,?,?,?,?,?,?)')
        .run(id, userId, type, String(amount), String(account(userId).credit_balance), description, info, Math.floor(now.getTime() / 1000));
    };
    const refund = (row: any, code: string, now: Date) => {
      if (row.status !== 'processing') return row;
      db.prepare('UPDATE user SET credit_balance = credit_balance + ?, updated_at = ? WHERE id = ?')
        .run(row.cost_credits, Math.floor(now.getTime() / 1000), row.user_id);
      ledger(`body_edit_refund:${row.id}`, row.user_id, 'refund', Number(row.cost_credits), TransactionTypeCode.REFUND, metadata(record(row, true)), now);
      db.prepare("UPDATE body_image_edit SET status = 'failed', error_code = ?, refunded = 1, updated_at = ? WHERE id = ? AND status = 'processing'")
        .run(code, now.getTime(), row.id);
      return job(row.user_id, row.id);
    };
    const expire = (row: any, now: Date) => row.status === 'processing' && Number(row.deadline_at) <= now.getTime() ? refund(row, 'TIMEOUT', now) : row;
    const welcome = (userId: string, amount: number, now: Date) => {
      if (amount <= 0 || db.prepare('SELECT id FROM credit_transaction WHERE id = ?').get(trialId(userId))) return false;
      db.prepare('UPDATE user SET credit_balance = credit_balance + ?, updated_at = ? WHERE id = ?')
        .run(amount, Math.floor(now.getTime() / 1000), userId);
      ledger(trialId(userId), userId, 'bonus', amount, TransactionTypeCode.BODY_EDIT_TRIAL, JSON.stringify({ operation: 'body_edit', edits: 1 }), now);
      return true;
    };
    return {
      async initializeAccount(userId, now) {
        return transaction(() => {
          assertUser(account(userId), true);
          const bonusGranted = welcome(userId, BODY_EDIT_WELCOME_CREDITS, now);
          return { balance: Number(account(userId).credit_balance), bonusGranted, welcomeCredits: BODY_EDIT_WELCOME_CREDITS };
        });
      },
      async reserve(input) {
        return transaction(() => {
          assertUser(account(input.userId), true);
          const existing = db.prepare('SELECT * FROM body_image_edit WHERE user_id = ? AND request_id = ?').get(input.userId, input.requestId) as any;
          if (existing) {
            if (existing.input_hash !== input.inputHash) throw new BodyEditError('IDEMPOTENCY_CONFLICT', 409, existing.id);
            return outcome(expire(existing, input.now), true);
          }
          welcome(input.userId, input.trialCredits, input.now);
          const debit = db.prepare('UPDATE user SET credit_balance = credit_balance - ?, updated_at = ? WHERE id = ? AND CAST(credit_balance AS REAL) >= ?')
            .run(input.costCredits, Math.floor(input.now.getTime() / 1000), input.userId, input.costCredits);
          if (!debit.changes) throw new BodyEditError('INSUFFICIENT_CREDITS', 402);
          db.prepare('INSERT INTO body_image_edit (id,user_id,request_id,input_hash,mode,intensity,model,cost_credits,created_at,updated_at,deadline_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
            .run(input.jobId, input.userId, input.requestId, input.inputHash, input.mode, String(input.intensity), input.model, input.costCredits, input.now.getTime(), input.now.getTime(), input.deadlineAt.getTime());
          const created = job(input.userId, input.jobId);
          ledger(`body_edit_debit:${input.jobId}`, input.userId, 'consumption', -input.costCredits, TransactionTypeCode.AI_BODY_EDIT, metadata(record(created, true)), input.now);
          return outcome(created);
        });
      },
      async get(userId, jobId, now) {
        return transaction(() => { assertUser(account(userId), true); const row = job(userId, jobId); assertJob(row); return outcome(expire(row, now), true); });
      },
      async getByRequest(userId, requestId, now) {
        return transaction(() => {
          assertUser(account(userId), true);
          const row = db.prepare('SELECT * FROM body_image_edit WHERE user_id = ? AND request_id = ?').get(userId, requestId) as any;
          assertJob(row); return outcome(expire(row, now), true);
        });
      },
      async succeed(userId, jobId, key, mime, now) {
        return transaction(() => {
          assertUser(account(userId)); const original = job(userId, jobId); assertJob(original); const row = expire(original, now);
          if (row.status === 'processing') db.prepare("UPDATE body_image_edit SET status = 'succeeded', result_key = ?, result_mime_type = ?, updated_at = ? WHERE id = ? AND status = 'processing'")
            .run(key, mime, now.getTime(), jobId);
          return outcome(job(userId, jobId));
        });
      },
      async fail(userId, jobId, code, now) {
        return transaction(() => { assertUser(account(userId)); const row = job(userId, jobId); assertJob(row); return outcome(refund(row, code, now)); });
      },
    };
  }

  const transaction = async <T>(fn: (client: PgClient) => Promise<T>): Promise<T> => {
    const execute = async () => {
      const client = await options.pool.connect();
      try { await client.query('BEGIN'); const result = await fn(client); await client.query('COMMIT'); return result; }
      catch (error) { await client.query('ROLLBACK').catch(() => undefined); throw error; }
      finally { client.release(); }
    };
    return options.withFresh ? options.withFresh(execute) : execute();
  };
  const account = async (client: PgClient, userId: string, lock = false) => (await client.query(`SELECT * FROM "user" WHERE id = $1${lock ? ' FOR UPDATE' : ''}`, [userId])).rows[0];
  const job = async (client: PgClient, userId: string, jobId: string) => (await client.query('SELECT * FROM body_image_edit WHERE user_id = $1 AND id = $2 FOR UPDATE', [userId, jobId])).rows[0];
  const outcome = async (client: PgClient, row: any, reused = false): Promise<BodyEditOutcome> => ({ job: record(row, false), balance: Number((await account(client, row.user_id)).credit_balance), reused });
  const ledger = async (client: PgClient, id: string, userId: string, type: string, amount: number, description: string, info: string, now: Date) => {
    const balance = (await account(client, userId)).credit_balance;
    await client.query('INSERT INTO credit_transaction (id,user_id,type,amount,balance,description,metadata,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [id, userId, type, String(amount), String(balance), description, info, now]);
  };
  const refund = async (client: PgClient, row: any, code: string, now: Date) => {
    if (row.status !== 'processing') return row;
    await client.query('UPDATE "user" SET credit_balance = credit_balance + $1, updated_at = $2 WHERE id = $3', [row.cost_credits, now, row.user_id]);
    await ledger(client, `body_edit_refund:${row.id}`, row.user_id, 'refund', Number(row.cost_credits), TransactionTypeCode.REFUND, metadata(record(row, false)), now);
    return (await client.query("UPDATE body_image_edit SET status = 'failed', error_code = $1, refunded = true, updated_at = $2 WHERE id = $3 AND status = 'processing' RETURNING *", [code, now, row.id])).rows[0];
  };
  const expire = (client: PgClient, row: any, now: Date) => row.status === 'processing' && new Date(row.deadline_at).getTime() <= now.getTime() ? refund(client, row, 'TIMEOUT', now) : row;
  const welcome = async (client: PgClient, userId: string, amount: number, now: Date) => {
    if (amount <= 0 || (await client.query('SELECT id FROM credit_transaction WHERE id = $1', [trialId(userId)])).rows.length) return false;
    await client.query('UPDATE "user" SET credit_balance = credit_balance + $1, updated_at = $2 WHERE id = $3', [amount, now, userId]);
    await ledger(client, trialId(userId), userId, 'bonus', amount, TransactionTypeCode.BODY_EDIT_TRIAL, JSON.stringify({ operation: 'body_edit', edits: 1 }), now);
    return true;
  };
  return {
    async initializeAccount(userId, now) {
      return transaction(async client => {
        assertUser(await account(client, userId, true), true);
        const bonusGranted = await welcome(client, userId, BODY_EDIT_WELCOME_CREDITS, now);
        return { balance: Number((await account(client, userId)).credit_balance), bonusGranted, welcomeCredits: BODY_EDIT_WELCOME_CREDITS };
      });
    },
    async reserve(input) {
      return transaction(async (client) => {
        assertUser(await account(client, input.userId, true), true);
        const existing = (await client.query('SELECT * FROM body_image_edit WHERE user_id = $1 AND request_id = $2 FOR UPDATE', [input.userId, input.requestId])).rows[0];
        if (existing) {
          if (existing.input_hash !== input.inputHash) throw new BodyEditError('IDEMPOTENCY_CONFLICT', 409, existing.id);
          return outcome(client, await expire(client, existing, input.now), true);
        }
        await welcome(client, input.userId, input.trialCredits, input.now);
        const debit = await client.query('UPDATE "user" SET credit_balance = credit_balance - $1, updated_at = $2 WHERE id = $3 AND credit_balance >= $1 RETURNING credit_balance', [input.costCredits, input.now, input.userId]);
        if (!debit.rows.length) throw new BodyEditError('INSUFFICIENT_CREDITS', 402);
        const created = (await client.query('INSERT INTO body_image_edit (id,user_id,request_id,input_hash,mode,intensity,model,cost_credits,created_at,updated_at,deadline_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9,$10) RETURNING *',
          [input.jobId, input.userId, input.requestId, input.inputHash, input.mode, String(input.intensity), input.model, input.costCredits, input.now, input.deadlineAt])).rows[0];
        await ledger(client, `body_edit_debit:${input.jobId}`, input.userId, 'consumption', -input.costCredits, TransactionTypeCode.AI_BODY_EDIT, metadata(record(created, false)), input.now);
        return outcome(client, created);
      });
    },
    async get(userId, jobId, now) {
      return transaction(async (client) => { assertUser(await account(client, userId, true), true); const row = await job(client, userId, jobId); assertJob(row); return outcome(client, await expire(client, row, now), true); });
    },
    async getByRequest(userId, requestId, now) {
      return transaction(async (client) => {
        assertUser(await account(client, userId, true), true);
        const row = (await client.query('SELECT * FROM body_image_edit WHERE user_id = $1 AND request_id = $2 FOR UPDATE', [userId, requestId])).rows[0];
        assertJob(row); return outcome(client, await expire(client, row, now), true);
      });
    },
    async succeed(userId, jobId, key, mime, now) {
      return transaction(async (client) => {
        assertUser(await account(client, userId, true)); const original = await job(client, userId, jobId); assertJob(original);
        const row = await expire(client, original, now);
        if (row.status !== 'processing') return outcome(client, row);
        const updated = (await client.query("UPDATE body_image_edit SET status = 'succeeded', result_key = $1, result_mime_type = $2, updated_at = $3 WHERE id = $4 AND status = 'processing' RETURNING *", [key, mime, now, jobId])).rows[0];
        return outcome(client, updated);
      });
    },
    async fail(userId, jobId, code, now) {
      return transaction(async (client) => { assertUser(await account(client, userId, true)); const row = await job(client, userId, jobId); assertJob(row); return outcome(client, await refund(client, row, code, now)); });
    },
  };
}
