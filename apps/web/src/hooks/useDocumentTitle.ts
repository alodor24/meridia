import { useEffect } from "react";
import useNotificationsBell from "@/features/notifications/hooks/useNotificationsBell";

export const useDocumentTitle = (title: string): void => {
  const { total } = useNotificationsBell();
  const notificationPrefix = total > 0 ? `(${total}) ` : "";

  useEffect(() => {
    document.title = title
      ? `${notificationPrefix}${title} | Meridia`
      : "Meridia";
  }, [title, notificationPrefix]);
};
