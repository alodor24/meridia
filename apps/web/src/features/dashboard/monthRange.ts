import { format, startOfMonth as dateFnsStartOfMonth } from 'date-fns';
import type { DashboardRange } from './api';

export function monthRangeFor(date: Date): DashboardRange {
  const first = dateFnsStartOfMonth(date);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { from: format(first, 'yyyy-MM-dd'), to: format(last, 'yyyy-MM-dd') };
}
