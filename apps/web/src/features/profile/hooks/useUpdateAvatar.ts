import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/authKeys";
import { authApi } from "@/features/auth/services/api";
import { UpdateAvatarInput } from "../types";

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ avatar, avatarPublicId }: UpdateAvatarInput) =>
      authApi.updateProfile({ avatar, avatarPublicId }),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
    },
  });
};
