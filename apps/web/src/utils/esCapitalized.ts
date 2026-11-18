import { Month } from "date-fns";
import { es } from "date-fns/locale";

export const esCapitalized = {
  ...es,
  localize: {
    ...es.localize,
    month: (month: Month, options?: Parameters<typeof es.localize.month>[1]) =>
      es.localize
        .month(month, options)
        .replace(/^./, (char) => char.toLocaleUpperCase("es")),
  },
};
