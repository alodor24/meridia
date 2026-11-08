import { useEffect, useState } from "react";
import { today } from "@/utils/format";

const millisecondsUntilNextMidnight = (): number => {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    1,
  );

  return nextMidnight.getTime() - now.getTime();
};

export const useTodayKey = (): string => {
  const [todayKey, setTodayKey] = useState(today);

  useEffect(() => {
    let timeoutId: number | undefined;

    const scheduleNextUpdate = () => {
      timeoutId = window.setTimeout(() => {
        setTodayKey(today());
        scheduleNextUpdate();
      }, millisecondsUntilNextMidnight());
    };

    const syncToday = () => setTodayKey(today());

    scheduleNextUpdate();
    window.addEventListener("focus", syncToday);
    document.addEventListener("visibilitychange", syncToday);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.removeEventListener("focus", syncToday);
      document.removeEventListener("visibilitychange", syncToday);
    };
  }, []);

  return todayKey;
};
