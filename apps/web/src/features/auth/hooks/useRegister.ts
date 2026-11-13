import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/api";

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};
