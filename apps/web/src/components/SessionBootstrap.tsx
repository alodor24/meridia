import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

const SessionBootstrap = () => {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    if (status === "idle") {
      void bootstrap();
    }
  }, [status, bootstrap]);

  return null;
};

export default SessionBootstrap;
