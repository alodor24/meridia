import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/api";
import { categoryKeys } from "../categoryKeys";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};
