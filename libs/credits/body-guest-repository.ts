import { bodyGuestConfig as limits } from '../../config/body-guest';
import { normalizeBodyEditIntensity } from '../../config/body-editor';
import type { BodyEditRepositoryOptions } from './body-edit-repository';
import { BodyEditError, type BodyEditJob, type BodyEditOutcome, type BodyEditRepository } from './body-edit-types';

type Row = Record<string, any>;
type Options = BodyEditRepositoryOptions & { networkHash?: string };
export interface BodyGuestRepository extends BodyEditRepository { allowance(guestId: string, now: Date): Promise<number> }
const hour = 3_600_000, day = 24 * hour;
function outcome(row: Row | undefined, sqlite: boolean, reused = false): BodyEditOutcome {
  if (!row) throw new BodyEditError('NOT_FOUND', 404);
  // The shared pipeline calls this identifier userId; guest ownership never uses an auth user or ledger.
  const date = (v: unknown) => new Date(sqlite ? Number(v) : v as string);
  const job: BodyEditJob = { id: row.id, userId: row.guest_id, requestId: row.request_id, inputHash: row.input_hash,
    mode: row.mode, intensity: normalizeBodyEditIntensity(row.intensity), model: row.model, status: row.status,
    costCredits: 0, resultKey: row.result_key, resultMimeType: row.result_mime_type, errorCode: row.error_code,
    refunded: Boolean(row.refunded), createdAt: date(row.created_at), updatedAt: date(row.updated_at), deadlineAt: date(row.deadline_at) };
  return { job, balance: 0, reused };
}
function checkQuota(active: Row | undefined, guestAttempts: number, networkAttempts: number, networkTrials: number) {
  if (active) throw new BodyEditError(active.status === 'succeeded' ? 'TRIAL_EXHAUSTED' : 'TRIAL_IN_PROGRESS', active.status === 'succeeded' ? 403 : 409);
  if (guestAttempts >= limits.maxAttemptsPerGuestHour || networkAttempts >= limits.maxAttemptsPerNetworkHour || networkTrials >= limits.maxTrialsPerNetworkDay)
    throw new BodyEditError('RATE_LIMITED', 429);
}

/** Reservations finish before provider I/O; failed attempts retain the abuse budget. */
export function createBodyGuestRepository(options: Options): BodyGuestRepository {
  if (options.dialect === 'sqlite') {
    const db = options.sqlite;
    const tx = <T>(fn: () => T) => db.transaction(fn).immediate();
    const find = (owner: string, id: string) => db.prepare('SELECT * FROM body_guest_edit WHERE guest_id = ? AND id = ?').get(owner, id) as Row | undefined;
    const expire = (owner: string, now: Date) => db.prepare("UPDATE body_guest_edit SET status='failed',error_code='TIMEOUT',refunded=1,updated_at=? WHERE guest_id=? AND status='processing' AND deadline_at<=?").run(now.getTime(), owner, now.getTime());
    const count = (sql: string, ...args: unknown[]) => Number((db.prepare(sql).get(...args) as { n: number }).n);
    const read = (owner: string, id: string, now: Date) => { expire(owner, now); return outcome(find(owner, id), true, true); };
    return {
      async allowance(owner, now) { return tx(() => { expire(owner, now); return db.prepare("SELECT id FROM body_guest_edit WHERE guest_id=? AND status IN ('processing','succeeded')").get(owner) ? 0 : 1; }); },
      async reserve(input) {
        return tx(() => {
          if (!options.networkHash) throw new BodyEditError('NOT_CONFIGURED', 503);
          expire(input.userId, input.now);
          const existing = db.prepare('SELECT * FROM body_guest_edit WHERE guest_id=? AND request_id=?').get(input.userId, input.requestId) as Row | undefined;
          if (existing) {
            if (existing.input_hash !== input.inputHash) throw new BodyEditError('IDEMPOTENCY_CONFLICT', 409, existing.id);
            return outcome(existing, true, true);
          }
          db.prepare("UPDATE body_guest_edit SET status='failed',error_code='TIMEOUT',refunded=1,updated_at=? WHERE network_hash=? AND status='processing' AND deadline_at<=?").run(input.now.getTime(), options.networkHash, input.now.getTime());
          const active = db.prepare("SELECT status FROM body_guest_edit WHERE guest_id=? AND status IN ('processing','succeeded')").get(input.userId) as Row | undefined;
          const recent = input.now.getTime() - hour;
          checkQuota(active,
            count('SELECT COUNT(*) n FROM body_guest_edit WHERE guest_id=? AND created_at>?', input.userId, recent),
            count('SELECT COUNT(*) n FROM body_guest_edit WHERE network_hash=? AND created_at>?', options.networkHash, recent),
            count("SELECT COUNT(*) n FROM body_guest_edit WHERE network_hash=? AND created_at>? AND status IN ('processing','succeeded')", options.networkHash, input.now.getTime() - day));
          db.prepare('INSERT INTO body_guest_edit (id,guest_id,network_hash,request_id,input_hash,mode,intensity,model,created_at,updated_at,deadline_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
            .run(input.jobId, input.userId, options.networkHash, input.requestId, input.inputHash, input.mode, String(input.intensity), input.model, input.now.getTime(), input.now.getTime(), input.deadlineAt.getTime());
          return outcome(find(input.userId, input.jobId), true);
        });
      },
      async get(owner, id, now) { return tx(() => read(owner, id, now)); },
      async getByRequest(owner, request, now) { return tx(() => { expire(owner, now); return outcome(db.prepare('SELECT * FROM body_guest_edit WHERE guest_id=? AND request_id=?').get(owner, request) as Row | undefined, true, true); }); },
      async succeed(owner, id, key, mime, now) {
        return tx(() => { read(owner, id, now);
          db.prepare("UPDATE body_guest_edit SET status='succeeded',result_key=?,result_mime_type=?,updated_at=? WHERE guest_id=? AND id=? AND status='processing'").run(key, mime, now.getTime(), owner, id);
          return outcome(find(owner, id), true);
        });
      },
      async fail(owner, id, code, now) {
        return tx(() => { read(owner, id, now);
          db.prepare("UPDATE body_guest_edit SET status='failed',error_code=?,refunded=1,updated_at=? WHERE guest_id=? AND id=? AND status='processing'").run(code, now.getTime(), owner, id);
          return outcome(find(owner, id), true);
        });
      },
    };
  }

  type Client = Awaited<ReturnType<typeof options.pool.connect>>;
  const tx = async <T>(owner: string, reserve: boolean, fn: (client: Client) => Promise<T>): Promise<T> => {
    const execute = async () => {
      const client = await options.pool.connect();
      try {
        await client.query('BEGIN');
        // Network first, then guest, in every reservation. Transaction-scoped locks also cover absent guest rows.
        if (reserve && options.networkHash) await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', ['body-guest-network:' + options.networkHash]);
        await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', ['body-guest-owner:' + owner]);
        const result = await fn(client); await client.query('COMMIT'); return result;
      } catch (error) { await client.query('ROLLBACK').catch(() => undefined); throw error; }
      finally { client.release(); }
    };
    return options.withFresh ? options.withFresh(execute) : execute();
  };
  const expire = (client: Client, owner: string, now: Date) => client.query("UPDATE body_guest_edit SET status='failed',error_code='TIMEOUT',refunded=true,updated_at=$1 WHERE guest_id=$2 AND status='processing' AND deadline_at<=$1", [now, owner]);
  const find = async (client: Client, owner: string, id: string) => (await client.query('SELECT * FROM body_guest_edit WHERE guest_id=$1 AND id=$2', [owner, id])).rows[0];
  return {
    async allowance(owner, now) { return tx(owner, false, async client => { await expire(client, owner, now); return (await client.query("SELECT id FROM body_guest_edit WHERE guest_id=$1 AND status IN ('processing','succeeded')", [owner])).rows.length ? 0 : 1; }); },
    async reserve(input) {
      if (!options.networkHash) throw new BodyEditError('NOT_CONFIGURED', 503);
      return tx(input.userId, true, async client => {
        await expire(client, input.userId, input.now);
        const existing = (await client.query('SELECT * FROM body_guest_edit WHERE guest_id=$1 AND request_id=$2', [input.userId, input.requestId])).rows[0];
        if (existing) {
          if (existing.input_hash !== input.inputHash) throw new BodyEditError('IDEMPOTENCY_CONFLICT', 409, existing.id);
          return outcome(existing, false, true);
        }
        await client.query("UPDATE body_guest_edit SET status='failed',error_code='TIMEOUT',refunded=true,updated_at=$1 WHERE network_hash=$2 AND status='processing' AND deadline_at<=$1", [input.now, options.networkHash]);
        const active = (await client.query("SELECT status FROM body_guest_edit WHERE guest_id=$1 AND status IN ('processing','succeeded')", [input.userId])).rows[0];
        const recent = new Date(input.now.getTime() - hour);
        const counts = (await client.query(`SELECT
          (SELECT COUNT(*) FROM body_guest_edit WHERE guest_id=$1 AND created_at>$3) guest_attempts,
          (SELECT COUNT(*) FROM body_guest_edit WHERE network_hash=$2 AND created_at>$3) network_attempts,
          (SELECT COUNT(*) FROM body_guest_edit WHERE network_hash=$2 AND created_at>$4 AND status IN ('processing','succeeded')) network_trials`,
        [input.userId, options.networkHash, recent, new Date(input.now.getTime() - day)])).rows[0];
        checkQuota(active, Number(counts.guest_attempts), Number(counts.network_attempts), Number(counts.network_trials));
        const created = (await client.query('INSERT INTO body_guest_edit (id,guest_id,network_hash,request_id,input_hash,mode,intensity,model,created_at,updated_at,deadline_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9,$10) RETURNING *',
          [input.jobId, input.userId, options.networkHash, input.requestId, input.inputHash, input.mode, String(input.intensity), input.model, input.now, input.deadlineAt])).rows[0];
        return outcome(created, false);
      });
    },
    async get(owner, id, now) { return tx(owner, false, async client => { await expire(client, owner, now); return outcome(await find(client, owner, id), false, true); }); },
    async getByRequest(owner, request, now) { return tx(owner, false, async client => { await expire(client, owner, now); return outcome((await client.query('SELECT * FROM body_guest_edit WHERE guest_id=$1 AND request_id=$2', [owner, request])).rows[0], false, true); }); },
    async succeed(owner, id, key, mime, now) { return tx(owner, false, async client => {
      await expire(client, owner, now); outcome(await find(client, owner, id), false);
      await client.query("UPDATE body_guest_edit SET status='succeeded',result_key=$1,result_mime_type=$2,updated_at=$3 WHERE guest_id=$4 AND id=$5 AND status='processing'", [key, mime, now, owner, id]);
      return outcome(await find(client, owner, id), false);
    }); },
    async fail(owner, id, code, now) { return tx(owner, false, async client => {
      await expire(client, owner, now); outcome(await find(client, owner, id), false);
      await client.query("UPDATE body_guest_edit SET status='failed',error_code=$1,refunded=true,updated_at=$2 WHERE guest_id=$3 AND id=$4 AND status='processing'", [code, now, owner, id]);
      return outcome(await find(client, owner, id), false);
    }); },
  };
}
