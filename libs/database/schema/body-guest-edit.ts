import { getDialect } from '../shared/dialect';
import * as pg from './pg/body-guest-edit';
import * as sqlite from './sqlite/body-guest-edit';
export const bodyGuestEdit = (getDialect() === 'pg' ? pg : sqlite).bodyGuestEdit as typeof pg.bodyGuestEdit;
