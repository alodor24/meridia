import type { Goal, Paginated } from "@meridia/shared";
import { ENDPOINT_ROUTES } from "@/consts";
import { http } from "@/services/api/client";
import type {
  CreateGoalPayload,
  GoalContributionPayload,
  GoalFilters,
  GoalReleasePayload,
  UpdateGoalPayload,
} from "../types";

export const goalApi = {
  listGoals: async (filters: GoalFilters = {}) => {
    const result = await http.get<Paginated<Goal>>(ENDPOINT_ROUTES.GOALS, {
      params: filters.status ? { status: filters.status } : undefined,
    });
    return result.items;
  },

  createGoal: async (payload: CreateGoalPayload) => {
    const result = await http.post<{ goal: Goal }>(
      ENDPOINT_ROUTES.GOALS,
      payload,
    );
    return result.goal;
  },

  updateGoal: async (id: string, payload: UpdateGoalPayload) => {
    const result = await http.patch<{ goal: Goal }>(
      `${ENDPOINT_ROUTES.GOALS}/${id}`,
      payload,
    );
    return result.goal;
  },

  contributeToGoal: async (id: string, payload: GoalContributionPayload) => {
    const result = await http.post<{ goal: Goal }>(
      `${ENDPOINT_ROUTES.GOALS}/${id}/contributions`,
      payload,
    );
    return result.goal;
  },

  releaseGoalAmount: async (id: string, payload: GoalReleasePayload) => {
    const result = await http.post<{ goal: Goal }>(
      `${ENDPOINT_ROUTES.GOALS}/${id}/releases`,
      payload,
    );
    return result.goal;
  },

  deleteGoal: (id: string) =>
    http.delete<null>(`${ENDPOINT_ROUTES.GOALS}/${id}`),
};
