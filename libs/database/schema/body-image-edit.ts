import { getDialect } from '../shared/dialect';
import * as pg from './pg/body-image-edit';
import * as sqlite from './sqlite/body-image-edit';
export type { BodyImageEdit } from './pg/body-image-edit';
export const bodyImageEdit = (getDialect() === 'pg' ? pg : sqlite).bodyImageEdit as typeof pg.bodyImageEdit;
