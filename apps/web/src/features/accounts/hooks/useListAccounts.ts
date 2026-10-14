import { useQuery } from "@tanstack/react-query";
import { accountApi } from "../services/api";
import { accountKeys } from "../accountKeys";

export const useListAccounts = () => {
  const queryOptions = {
    queryKey: accountKeys.lists(),
    queryFn: accountApi.listAccounts,
  };

  return useQuery(queryOptions);
};
