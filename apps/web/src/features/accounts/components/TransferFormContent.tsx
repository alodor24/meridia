import { useEffect } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useFormikContext } from "formik";
import type { Account } from "@meridia/shared";
import { useTransferAccountOptions } from "../hooks/useTransferAccountOptions";
import type { TransferFormValues } from "../types";
import { TransferAccountFields } from "./TransferAccountFields";
import { TransferDetailsFields } from "./TransferDetailsFields";

interface TransferFormContentProps {
  accounts: Account[];
  isPending: boolean;
  onClose: () => void;
}

export const TransferFormContent = ({
  accounts,
  isPending,
  onClose,
}: TransferFormContentProps) => {
  const { values, setFieldValue } = useFormikContext<TransferFormValues>();
  const { sourceAccount, sourceOptions, destinationOptions } =
    useTransferAccountOptions(accounts, values.fromAccountId);

  useEffect(() => {
    if (
      !destinationOptions.some((option) => option.value === values.toAccountId)
    ) {
      void setFieldValue("toAccountId", destinationOptions[0]?.value ?? "");
    }
  }, [destinationOptions, setFieldValue, values.toAccountId]);

  const canSubmit =
    Boolean(sourceAccount) && destinationOptions.length > 0 && !isPending;

  return (
    <>
      <DialogContent>
        <TransferAccountFields
          sourceAccount={sourceAccount}
          sourceOptions={sourceOptions}
          destinationOptions={destinationOptions}
        />
        <TransferDetailsFields currency={sourceAccount?.currency} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isPending} color="inherit">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={isPending}
          loadingPosition="start"
          disabled={!canSubmit}>
          Transferir
        </Button>
      </DialogActions>
    </>
  );
};
