import queryClient from "@/services/query/queryClient";
import { router } from "@/app/router/router";
import { PATHS } from "@/conts";
import { tokenManager } from "@/services/api/tokenManager";
import {
  isHandlingUnauthorized,
  startHandlingUnauthorized,
} from "./authSessionState";

tokenManager.setOnUnauthorized(() => {
  if (isHandlingUnauthorized()) return;

  startHandlingUnauthorized();

  tokenManager.clear();
  queryClient.clear();

  if (router.state.location.pathname !== PATHS.LOGIN) {
    void router.navigate({
      to: PATHS.LOGIN,
      replace: true,
    });
  }
});
