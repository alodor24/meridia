import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Formik, Form } from "formik";
import type { Account, AccountType } from "@meridia/shared";
import { ACCOUNT_TYPE_OPTIONS } from "@/utils/labels";
import { FormTextField } from "@/components/ui/FormTextField";
import { FormSelect } from "@/components/ui/FormSelect";
import { useAsyncAction } from "@/hooks/useAsync";
import { useUiStore } from "@/stores/uiStore";
import { createAccount, updateAccount } from "../services/api";
import { validationSchema } from "../validations";

interface FormValues {
  name: string;
  type: AccountType;
  currency: string;
}

export interface AccountFormDialogProps {
  open: boolean;
  account: Account | null;
  defaultCurrency: string;
  onClose: () => void;
  onSaved: () => void;
}

export const AccountFormDialog = ({
  open,
  account,
  defaultCurrency,
  onClose,
  onSaved,
}: AccountFormDialogProps) => {
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { loading, run } = useAsyncAction();

  const initialValues: FormValues = account
    ? { name: account.name, type: account.type, currency: account.currency }
    : { name: "", type: "bank", currency: defaultCurrency };

  const handleSubmit = async (values: FormValues) => {
    const result = await run(async () => {
      if (account) {
        await updateAccount(account.id, values);
        return "Cuenta actualizada";
      }
      await createAccount(values);
      return "Cuenta creada";
    });
    if (result) {
      showSnackbar(result);
      onSaved();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle>{account ? "Editar cuenta" : "Nueva cuenta"}</DialogTitle>
      <Formik
        key={account?.id ?? "new"}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {() => (
          <Form>
            <DialogContent>
              <FormTextField
                name="name"
                label="Nombre"
                placeholder="Ej: Banco Santander"
              />
              <FormSelect
                name="type"
                label="Tipo"
                options={ACCOUNT_TYPE_OPTIONS}
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={onClose} disabled={loading} color="inherit">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                loading={loading}
                loadingPosition="start">
                Guardar
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
