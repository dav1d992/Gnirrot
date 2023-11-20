import { ObjectValues } from '@globals';

export type ToastProps = {
  title: string;
  description: string;
  severity: SeverityLevel;
  lifetime?: number;
};

export const SEVERITY_LEVEL = {
  Info: 'info',
  Error: 'error',
  Warning: 'warn',
  Success: 'success',
} as const;

export type SeverityLevel = ObjectValues<typeof SEVERITY_LEVEL>;
