import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateGoalQueries } from "@/services/query/invalidations";
import { accountKeys } from "../accountKeys";
import { transferApi } from "../services/api";
import { transferKeys } from "../transferKeys";

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transferApi.deleteTransfer(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transferKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: accountKeys.all,
      });

      void invalidateGoalQueries(queryClient);
    },
  });
};
