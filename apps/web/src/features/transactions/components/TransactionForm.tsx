import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Formik, Form } from "formik";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { format as dateFnsFormat, parseISO } from "date-fns";
import { FormTextField } from "@/components/ui/FormTextField";
import { FormSelect } from "@/components/ui/FormSelect";
import { useAsyncAction } from "@/hooks/useAsync";
import { useUiStore } from "@/stores/uiStore";
import { getCurrencySymbol, today } from "@/utils/format";
import { createTransaction, updateTransaction } from "../services/api";
import { buildValidationSchema } from "../validations";
import {
  Account,
  Category,
  Transaction,
  TransactionType,
} from "@meridia/shared";
import CashInAudio from "../../../assets/sounds/cashin.wav";
import CashOutAudio from "../../../assets/sounds/cashout.wav";

interface FormValues {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: string;
  date: string;
  note: string;
}

interface TransactionFormProps {
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

const TransactionForm = ({
  transaction,
  accounts,
  categories,
  onClose,
  onSaved,
}: TransactionFormProps) => {
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { loading, run } = useAsyncAction();

  const cashInAudio = new Audio(CashInAudio);
  const cashOutAudio = new Audio(CashOutAudio);

  const initialValues: FormValues = transaction
    ? {
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type,
        amount: String(transaction.amount),
        date: transaction.date,
        note: transaction.note ?? "",
      }
    : {
        accountId: accounts[0]?.id ?? "",
        categoryId: "",
        type: "expense",
        amount: "",
        date: today(),
        note: "",
      };

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
        return "Movimiento actualizado";
      }
      await createTransaction(payload);
      (values.type === "income" ? cashInAudio : cashOutAudio).play();
      return "Movimiento creado";
    });
    if (result) {
      showSnackbar(result);
      onSaved();
    }
  };

  return (
    <Formik
      key={transaction?.id ?? "new"}
      initialValues={initialValues}
      validationSchema={buildValidationSchema()}
      onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => {
        const selectedAccount = accounts.find((a) => a.id === values.accountId);
        const currencySymbol = getCurrencySymbol(
          selectedAccount?.currency ?? "",
        );

        return (
          <Form>
            <DialogContent>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={values.type}
                onChange={(_, next: TransactionType | null) => {
                  if (next) {
                    void setFieldValue("type", next);
                    void setFieldValue("categoryId", "");
                  }
                }}
                aria-label="Tipo de movimiento"
                sx={{ mb: 2, mt: 1 }}>
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
                options={accounts.map((a) => ({
                  value: a.id,
                  label: `${a.name} (${getCurrencySymbol(a.currency)})`,
                }))}
              />

              <FormSelect
                name="categoryId"
                label="Categoría"
                options={categories
                  .filter((c) => c.type === values.type)
                  .map((c) => ({ value: c.id, label: c.name }))}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <FormTextField
                  name="amount"
                  label="Monto"
                  type="number"
                  slotProps={{
                    htmlInput: { step: "0.01", min: "0" },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          {currencySymbol}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <DesktopDatePicker
                  label="Fecha"
                  value={values.date ? parseISO(values.date) : null}
                  onChange={(newDate) => {
                    const dateStr = newDate
                      ? dateFnsFormat(newDate, "yyyy-MM-dd")
                      : "";
                    void setFieldValue("date", dateStr);
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ mt: 2 }}
                />
              </Box>

              <FormTextField
                name="note"
                label="Nota (opcional)"
                placeholder="Ej: supermercado"
                multiline
                rows={2}
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
        );
      }}
    </Formik>
  );
};

export default TransactionForm;
