// Main exports for credits library
export { CreditService, creditService } from './service';
export { DuplicatePurchaseOrderError, isPurchaseOrderUniqueViolation } from './errors';
export { 
  calculateCreditConsumption, 
  getFixedConsumptionAmount,
  isDynamicMode,
  getModelMultiplier 
} from './calculator';
export { safeNumber, TransactionTypeCode } from './utils';
export * from './types';
export { createBodyEditRepository } from './body-edit-repository';
export { BodyEditError } from './body-edit-types';
export type { BodyEditJob, BodyEditRepository, BodyEditResultStore, ReserveBodyEdit } from './body-edit-types';

