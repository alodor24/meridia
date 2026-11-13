import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/api";

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
  });
};
