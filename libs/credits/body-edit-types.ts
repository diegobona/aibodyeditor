import type { BodyEditMode, BodyEditIntensity } from '../../config/body-editor';

export class BodyEditError extends Error {
  constructor(public readonly code: string, public readonly status = 500, public readonly jobId?: string, public readonly refunded?: boolean) {
    super(code);
    this.name = 'BodyEditError';
  }
}

export interface BodyEditJob {
  id: string;
  userId: string;
  requestId: string;
  inputHash: string;
  mode: BodyEditMode;
  intensity: BodyEditIntensity;
  model: string;
  status: 'processing' | 'succeeded' | 'failed';
  costCredits: number;
  resultKey: string | null;
  resultMimeType: string | null;
  errorCode: string | null;
  refunded: boolean;
  createdAt: Date;
  updatedAt: Date;
  deadlineAt: Date;
}

export interface BodyEditOutcome { job: BodyEditJob; balance: number; reused: boolean }
export interface ReserveBodyEdit {
  jobId: string;
  userId: string;
  requestId: string;
  inputHash: string;
  mode: BodyEditMode;
  intensity: BodyEditIntensity;
  model: string;
  costCredits: number;
  trialCredits: number;
  now: Date;
  deadlineAt: Date;
}
export interface BodyEditRepository {
  reserve(input: ReserveBodyEdit): Promise<BodyEditOutcome>;
  get(userId: string, jobId: string, now: Date): Promise<BodyEditOutcome>;
  getByRequest(userId: string, requestId: string, now: Date): Promise<BodyEditOutcome>;
  succeed(userId: string, jobId: string, resultKey: string, mimeType: string, now: Date): Promise<BodyEditOutcome>;
  fail(userId: string, jobId: string, code: string, now: Date): Promise<BodyEditOutcome>;
}

export interface BodyEditResultStore {
  checkReady?(): Promise<void>;
  put(jobId: string, bytes: Uint8Array, mimeType: string): Promise<string>;
  get(key: string): Promise<{ bytes: Uint8Array; mimeType: string } | null>;
  delete(key: string): Promise<void>;
}
