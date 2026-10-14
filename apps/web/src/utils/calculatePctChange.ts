export type TrendDirection = "up" | "down" | "neutral";

export type TrendStatus = "positive" | "negative" | "neutral" | "unavailable";

export type ComparisonType = "income" | "expense" | "balance";

export interface PercentageChange {
  percentage: number;
  label: string;
  direction: TrendDirection;
  status: TrendStatus;
}

export const calculatePctChange = (
  current: number,
  previous: number,
  type: ComparisonType,
): PercentageChange => {
  if (previous === 0) {
    return {
      percentage: 0,
      label: "N/A",
      direction: "neutral",
      status: "unavailable",
    };
  }

  const percentage = ((current - previous) / Math.abs(previous)) * 100;

  const direction: TrendDirection =
    percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral";

  let status: TrendStatus = "neutral";

  if (direction !== "neutral") {
    if (type === "expense") {
      status = direction === "down" ? "positive" : "negative";
    } else {
      status = direction === "up" ? "positive" : "negative";
    }
  }

  return {
    percentage,
    label: `${Math.abs(percentage).toFixed(1)}%`,
    direction,
    status,
  };
};
