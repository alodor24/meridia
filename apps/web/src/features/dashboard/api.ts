import type { DashboardSummary } from '@meridia/shared';
import { http } from '@/services/api/client';

export interface DashboardRange {
  from: string;
  to: string;
}

export const getDashboard = (range?: DashboardRange) =>
  http
    .get<{ dashboard: DashboardSummary }>('/api/dashboard', { params: range })
    .then((r) => r.dashboard);
