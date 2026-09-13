export type TrendDirection = "up" | "down" | "neutral";

export interface PercentageChange {
  percentage: number;
  label: string;
  direction: TrendDirection;
}

export const calculatePctChange = (
  current: number,
  previous: number
): PercentageChange => {
  if (current === 0 && previous === 0) {
    return {
      percentage: 0,
      label: "0.0%",
      direction: "neutral",
    };
  }

  if (previous === 0) {
    return {
      percentage: 0,
      label: "0.0%",
      direction: current > 0 ? "up" : "down",
    };
  }

  const percentage = ((current - previous) / Math.abs(previous)) * 100;

  const direction: TrendDirection =
    percentage > 0
      ? "up"
      : percentage < 0
        ? "down"
        : "neutral";

  return {
    percentage,
    label: `${Math.abs(percentage).toFixed(1)}%`,
    direction,
  };
};