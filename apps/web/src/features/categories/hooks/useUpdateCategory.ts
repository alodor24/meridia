import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCategoryPayload } from "../types";
import { categoryApi } from "../services/api";
import { categoryKeys } from "../categoryKeys";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCategoryPayload) =>
      categoryApi.updateCategory(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};
