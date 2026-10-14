import { queryOptions, useQuery } from "@tanstack/react-query";
import { authKeys } from "../authKeys";
import { authApi } from "../services/api";

export const getCurrentUserQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: authApi.getMe,
    retry: false,
  });

export const useCurrentUser = () => {
  return useQuery(getCurrentUserQueryOptions());
};
