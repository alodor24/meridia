import { useMutation } from "@tanstack/react-query";
import { feedbackApi } from "../services/api";

export const useCreateFeedback = () =>
  useMutation({
    mutationFn: feedbackApi.create,
  });
