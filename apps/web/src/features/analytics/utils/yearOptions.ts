export const buildYearOptions = (
  minYear: number,
  maxYear: number,
): number[] => {
  if (minYear > maxYear) return [];

  return Array.from(
    { length: maxYear - minYear + 1 },
    (_, index) => maxYear - index,
  );
};
