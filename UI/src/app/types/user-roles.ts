import { ObjectValues } from '../helpers/object-values.helper';

export const USER_ROLES = {
  Admin: 'admin',
  Employer: 'employer',
  Employee: 'employee',
} as const;

export type UserRoles = ObjectValues<typeof USER_ROLES>;
