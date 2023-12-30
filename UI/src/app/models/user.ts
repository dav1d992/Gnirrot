import { DateTime } from 'luxon';

export interface User {
  id: number;
  shortName: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  created: Date;
  dateOfBirth: Date;
  workplace: string;
  role: string;
}
