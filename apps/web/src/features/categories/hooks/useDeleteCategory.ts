import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/api";
import { categoryKeys } from "../categoryKeys";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: categoryKeys.details(),
      });
    },
  });
};
