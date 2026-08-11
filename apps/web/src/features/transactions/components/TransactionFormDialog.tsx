import { useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { Account, Category, Transaction, TransactionType } from '@meridia/shared';
import { FormTextField } from '@/components/ui/FormTextField';
import { FormSelect } from '@/components/ui/FormSelect';
import { useAsyncAction } from '@/hooks/useAsync';
import { useUiStore } from '@/stores/uiStore';
import { today } from '@/utils/format';
import { createTransaction, updateTransaction } from '../api';

interface FormValues {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: string;
  date: string;
  note: string;
}

function buildValidationSchema() {
  return Yup.object({
    accountId: Yup.string().required('Seleccioná una cuenta'),
    categoryId: Yup.string().required('Seleccioná una categoría'),
    type: Yup.mixed<TransactionType>().oneOf(['income', 'expense']).required(),
    amount: Yup.number()
      .typeError('El monto debe ser un número')
      .positive('El monto debe ser mayor a cero')
      .max(9_999_999_999.99, 'Monto demasiado grande')
      .required('El monto es requerido'),
    date: Yup.string().required('La fecha es requerida'),
    note: Yup.string().max(255, 'La nota no puede superar los 255 caracteres'),
  });
}

export interface TransactionFormDialogProps {
  open: boolean;
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export function TransactionFormDialog({
  open,
  transaction,
  accounts,
  categories,
  onClose,
  onSaved,
}: TransactionFormDialogProps) {
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { loading, run } = useAsyncAction();

  const initialValues: FormValues = transaction
    ? {
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type,
        amount: String(transaction.amount),
        date: transaction.date,
        note: transaction.note ?? '',
      }
    : {
        accountId: accounts[0]?.id ?? '',
        categoryId: '',
        type: 'expense',
        amount: '',
        date: today(),
        note: '',
      };

  useEffect(() => {
    if (!open) return;
  }, [open]);

  const handleSubmit = async (values: FormValues) => {
    const payload = {
      accountId: values.accountId,
      categoryId: values.categoryId,
      type: values.type,
      amount: Number(values.amount),
      date: values.date,
      note: values.note.trim() || undefined,
    };
    const result = await run(async () => {
      if (transaction) {
        await updateTransaction(transaction.id, payload);
        return 'Movimiento actualizado';
      }
      await createTransaction(payload);
      return 'Movimiento creado';
    });
    if (result) {
      showSnackbar(result);
      onSaved();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{transaction ? 'Editar movimiento' : 'Nuevo movimiento'}</DialogTitle>
      <Formik
        key={transaction?.id ?? 'new'}
        initialValues={initialValues}
        validationSchema={buildValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <DialogContent>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={values.type}
                onChange={(_, next: TransactionType | null) => {
                  if (next) {
                    void setFieldValue('type', next);
                    void setFieldValue('categoryId', '');
                  }
                }}
                aria-label="Tipo de movimiento"
                sx={{ mb: 2, mt: 1 }}
              >
                <ToggleButton value="expense" color="error">
                  Gasto
                </ToggleButton>
                <ToggleButton value="income" color="success">
                  Ingreso
                </ToggleButton>
              </ToggleButtonGroup>

              <FormSelect
                name="accountId"
                label="Cuenta"
                options={accounts.map((a) => ({ value: a.id, label: `${a.name} (${a.currency})` }))}
              />

              <FormSelect
                name="categoryId"
                label="Categoría"
                options={categories
                  .filter((c) => c.type === values.type)
                  .map((c) => ({ value: c.id, label: c.name }))}
              />

              <Box display="flex" gap={1}>
                <FormTextField
                  name="amount"
                  label="Monto"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    },
                  }}
                />
                <FormTextField name="date" label="Fecha" type="date" InputLabelProps={{ shrink: true }} />
              </Box>

              <FormTextField name="note" label="Nota (opcional)" placeholder="Ej: supermercado" multiline rows={2} />
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
