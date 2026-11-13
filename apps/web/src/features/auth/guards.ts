import { redirect } from "@tanstack/react-router";
import { PATHS } from "@/consts";
import queryClient from "@/services/query/queryClient";
import { toApiError } from "@/services/api/errors";
import { getCurrentUserQueryOptions } from "./hooks/useCurrentUser";

export const redirectIfAuthenticated = async (): Promise<void> => {
  let user;

  try {
    user = await queryClient.query(getCurrentUserQueryOptions());
  } catch (error) {
    if (toApiError(error).code === "EMAIL_NOT_VERIFIED") {
      throw redirect({ to: PATHS.VERIFY_EMAIL });
    }

    return;
  }

  if (!user.emailVerified) {
    throw redirect({
      to: PATHS.VERIFY_EMAIL,
      search: { email: user.email },
    });
  }

  throw redirect({ to: PATHS.DASHBOARD });
};
