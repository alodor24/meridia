const amountFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 1,
});

export const formatAmountPlain = (value: number): string =>
  amountFormatter.format(value);

export const formatAmount = (value: number, currency: string): string =>
  `${currency.toUpperCase()} ${amountFormatter.format(value)}`;

export const formatCompactAmount = (value: number): string => {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absolute >= 1_000_000_000) {
    return `${sign}${compactFormatter.format(absolute / 1_000_000_000)}B`;
  }
  if (absolute >= 1_000_000) {
    return `${sign}${compactFormatter.format(absolute / 1_000_000)}M`;
  }
  if (absolute >= 1_000) {
    return `${sign}${compactFormatter.format(absolute / 1_000)}k`;
  }
  return `${sign}${compactFormatter.format(absolute)}`;
};

export const formatPercent = (value: number): string =>
  `${compactFormatter.format(value)}%`;
