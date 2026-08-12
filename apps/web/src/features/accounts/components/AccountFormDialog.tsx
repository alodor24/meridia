import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { Account, AccountType } from '@meridia/shared';
import { ACCOUNT_TYPE_OPTIONS } from '@/utils/labels';
import { FormTextField } from '@/components/ui/FormTextField';
import { FormSelect } from '@/components/ui/FormSelect';
import { useAsyncAction } from '@/hooks/useAsync';
import { useUiStore } from '@/stores/uiStore';
import { createAccount, updateAccount } from '../api';

interface FormValues {
  name: string;
  type: AccountType;
  currency: string;
}

  const validationSchema = Yup.object({
    name: Yup.string().trim().min(1, 'El nombre es requerido').max(80, 'Demasiado largo').required('El nombre es requerido'),
    type: Yup.mixed<AccountType>().oneOf(ACCOUNT_TYPE_OPTIONS.map((o) => o.value)).required('Seleccioná un tipo'),
    currency: Yup.string().trim().length(3, 'Moneda inválida').required('La moneda es requerida'),
  });

export interface AccountFormDialogProps {
  open: boolean;
  account: Account | null;
  defaultCurrency: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AccountFormDialog({ open, account, defaultCurrency, onClose, onSaved }: AccountFormDialogProps) {
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { loading, run } = useAsyncAction();

  const initialValues: FormValues = account
    ? { name: account.name, type: account.type, currency: account.currency }
    : { name: '', type: 'bank', currency: defaultCurrency };

  const handleSubmit = async (values: FormValues) => {
    const result = await run(async () => {
      if (account) {
        await updateAccount(account.id, values);
        return 'Cuenta actualizada';
      }
      await createAccount(values);
      return 'Cuenta creada';
    });
    if (result) {
      showSnackbar(result);
      onSaved();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{account ? 'Editar cuenta' : 'Nueva cuenta'}</DialogTitle>
      <Formik
        key={account?.id ?? 'new'}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <DialogContent>
              <FormTextField name="name" label="Nombre" autoFocus placeholder="Ej: Banco Santander" />
              <FormSelect name="type" label="Tipo" options={ACCOUNT_TYPE_OPTIONS} />
              <FormTextField name="currency" label="Moneda (ISO 4217)" placeholder="ARS" slotProps={{ htmlInput: { maxLength: 3, style: { textTransform: 'uppercase' } } }} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onClose} disabled={loading} color="inherit">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Guardando…' : 'Guardar'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
