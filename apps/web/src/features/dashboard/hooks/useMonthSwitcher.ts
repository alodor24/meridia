import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { DashboardRange } from "../types";
import {
  addMonths,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { monthRangeFor } from "../utils/monthRange";
import { esCapitalized } from "@/utils/esCapitalized";

const useMonthSwitcher = ({
  anchor,
  onChange,
}: {
  anchor: Date;
  onChange: (range: DashboardRange) => void;
}) => {
  const { data: user } = useCurrentUser();

  const currentDate = new Date();
  const registrationDate = new Date(user?.createdAt ?? currentDate);
  const label = format(anchor, "LLLL yyyy", { locale: esCapitalized });
  const isCurrentMonth = isSameMonth(anchor, currentDate);

  const isPreviousDisabled =
    startOfMonth(anchor) <= startOfMonth(registrationDate);

  const isNextDisabled = startOfMonth(anchor) >= startOfMonth(currentDate);

  const shift = (delta: number) => {
    const next = delta < 0 ? subMonths(anchor, 1) : addMonths(anchor, 1);
    onChange(monthRangeFor(next));
  };

  const goToCurrentMonth = () => {
    onChange(monthRangeFor(currentDate));
  };

  return {
    label,
    isCurrentMonth,
    isPreviousDisabled,
    isNextDisabled,
    shift,
    goToCurrentMonth,
  };
};

export default useMonthSwitcher;
