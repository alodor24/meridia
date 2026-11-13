import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
};
