import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form } from "formik";
import type { Account, AccountType } from "@meridia/shared";
import { ACCOUNT_TYPE_OPTIONS } from "@/utils/labels";
import { FormTextField } from "@/components/ui/FormTextField";
import { FormSelect } from "@/components/ui/FormSelect";
import { useUiStore } from "@/stores/uiStore";
import { validationSchema } from "../validations";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useUpdateAccount } from "../hooks/useUpdateAccount";
import { toApiError } from "@/services/api/errors";

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
  const { mutateAsync: createAccount, isPending: isCreating } =
    useCreateAccount();
  const { mutateAsync: updateAccount, isPending: isUpdating } =
    useUpdateAccount();

  const initialValues: FormValues = account
    ? { name: account.name, type: account.type, currency: account.currency }
    : { name: "", type: "bank", currency: defaultCurrency };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (account) {
        await updateAccount({
          id: account.id,
          payload: values,
        });
        showSnackbar("Cuenta actualizada");
        onSaved();
        return;
      }
      await createAccount(values);
      showSnackbar("Cuenta creada");
      onSaved();
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isCreating || isUpdating ? undefined : onClose}
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
              <Button
                onClick={onClose}
                disabled={isCreating || isUpdating}
                color="inherit">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                loading={isCreating || isUpdating}
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
