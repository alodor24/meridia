import InputAdornment from "@mui/material/InputAdornment";
import { FormTextField } from "@/components/ui/FormTextField";
import { getCurrencySymbol } from "@/utils/format";

interface TransferDetailsFieldsProps {
  currency?: string;
}

export const TransferDetailsFields = ({
  currency,
}: TransferDetailsFieldsProps) => (
  <>
    <FormTextField
      name="amount"
      label="Monto"
      type="number"
      slotProps={{
        htmlInput: { step: "0.01", min: "0" },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              {getCurrencySymbol(currency ?? "")}
            </InputAdornment>
          ),
        },
      }}
    />

    <FormTextField
      name="note"
      label="Nota (opcional)"
      placeholder="Ej: Depósito"
      multiline
      rows={2}
    />
  </>
);
