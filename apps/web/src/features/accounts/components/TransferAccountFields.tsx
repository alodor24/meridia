import Alert from "@mui/material/Alert";
import type { Account } from "@meridia/shared";
import { FormSelect } from "@/components/ui/FormSelect";
import type { TransferAccountOption } from "../types";

interface TransferAccountFieldsProps {
  sourceAccount?: Account;
  sourceOptions: TransferAccountOption[];
  destinationOptions: TransferAccountOption[];
}

export const TransferAccountFields = ({
  sourceAccount,
  sourceOptions,
  destinationOptions,
}: TransferAccountFieldsProps) => {
  const hasSource = Boolean(sourceAccount);
  const hasDestination = destinationOptions.length > 0;

  return (
    <>
      {!hasSource && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Necesitas una cuenta de efectivo, banco o billetera con saldo
          disponible.
        </Alert>
      )}

      <FormSelect
        name="fromAccountId"
        label="Desde"
        options={sourceOptions}
        disabled={sourceOptions.length === 0}
      />

      {hasSource && !hasDestination && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Necesitas otra cuenta de la misma moneda para transferir.
        </Alert>
      )}

      <FormSelect
        name="toAccountId"
        label="Hacia"
        options={destinationOptions}
        disabled={!hasDestination}
      />
    </>
  );
};
