export interface YearRange {
  min: number;
  max: number;
}

export const buildYearRange = (
  createdAt?: string,
  now = new Date(),
): YearRange => {
  const max = now.getFullYear();
  const createdDate = createdAt ? new Date(createdAt) : null;
  const registrationYear =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? createdDate.getFullYear()
      : max;

  return { min: Math.min(registrationYear, max), max };
};
