import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/api";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
  });
};
