import { useCallback, useMemo } from "react";
import type { Account } from "@meridia/shared";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import type { TransferFormValues } from "../types";
import { buildTransferValidationSchema } from "../validations";
import {
  getInitialTransferValues,
  toCreateTransferPayload,
} from "../utils/transfer";
import { useCreateTransfer } from "./useCreateTransfer";

interface UseTransferFormOptions {
  accounts: Account[];
  onSaved: () => void;
}

export const useTransferForm = ({
  accounts,
  onSaved,
}: UseTransferFormOptions) => {
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { mutateAsync: createTransfer, isPending } = useCreateTransfer();

  const initialValues = useMemo(
    () => getInitialTransferValues(accounts),
    [accounts],
  );

  const validationSchema = useMemo(
    () => buildTransferValidationSchema(accounts),
    [accounts],
  );

  const handleSubmit = useCallback(
    async (values: TransferFormValues) => {
      try {
        await createTransfer(toCreateTransferPayload(values));
        showSnackbar("Transferencia realizada");
        onSaved();
      } catch (error) {
        showSnackbar(toApiError(error).message, "error");
      }
    },
    [createTransfer, onSaved, showSnackbar],
  );

  return { initialValues, validationSchema, handleSubmit, isPending };
};
