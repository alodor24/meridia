import type { GoalStatus } from "@meridia/shared";

export type GoalsTab = "activas" | "finalizadas";

export interface GoalFilters {
  status?: GoalStatus;
}

export interface CreateGoalPayload {
  accountId: string;
  name: string;
  description?: string | null;
  targetAmount: number;
  targetDate?: string | null;
  icon?: string | null;
  color?: string;
}

export type UpdateGoalPayload = Omit<CreateGoalPayload, "accountId">;

export interface GoalFormValues {
  name: string;
  accountId: string;
  targetAmount: string;
  targetDate: string;
  description: string;
  icon: string;
  color: string;
}

export interface GoalContributionPayload {
  amount: number;
  fromAccountId?: string;
}

export interface GoalReleasePayload {
  amount: number;
}

export interface GoalContributionFormValues {
  sourceAccountId: string;
  amount: string;
}

export interface GoalReleaseFormValues {
  amount: string;
}
