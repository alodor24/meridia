import { useMemo, useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { buildYearRange } from "../utils/yearOptions";

const useYearSwitcher = ({
  year,
  onChange,
}: {
  year: number;
  onChange: (year: number) => void;
}) => {
  const { data: user } = useCurrentUser();
  const { min: minYear, max: maxYear } = buildYearRange(user?.createdAt);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const isMenuOpen = Boolean(menuAnchor);

  const years = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => maxYear - index,
      ),
    [minYear, maxYear],
  );

  const selectYear = (nextYear: number) => {
    if (nextYear < minYear || nextYear > maxYear || nextYear === year) return;

    onChange(nextYear);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectYear(year - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectYear(year + 1);
    }
  };

  return {
    setMenuAnchor,
    isMenuOpen,
    years,
    handleKeyDown,
    minYear,
    maxYear,
    selectYear,
    menuAnchor,
  };
};

export default useYearSwitcher;
