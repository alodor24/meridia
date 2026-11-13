import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { format, parseISO } from "date-fns";
import type { Account, Goal } from "@meridia/shared";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextField } from "@/components/ui/FormTextField";
import { ColorField } from "@/components/ui/ColorField";
import IconField from "@/components/ui/IconField";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { useCreateGoal } from "../hooks/useCreateGoal";
import { useUpdateGoal } from "../hooks/useUpdateGoal";
import type { GoalFormValues } from "../types";
import { getGoalSavingsAccounts } from "../utils/goals";
import { goalValidationSchema } from "../validations";

interface GoalFormProps {
  goal: Goal | null;
  accounts: Account[];
  onClose: () => void;
  onSaved: () => void;
}

export const GoalForm = ({
  goal,
  accounts,
  onClose,
  onSaved,
}: GoalFormProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: createGoal, isPending: isCreating } = useCreateGoal();
  const { mutateAsync: updateGoal, isPending: isUpdating } = useUpdateGoal();

  const savingsAccounts = getGoalSavingsAccounts(accounts);
  const availableAccounts = goal
    ? savingsAccounts.filter((account) => account.id === goal.accountId)
    : savingsAccounts;

  const accountOptions = availableAccounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const initialValues: GoalFormValues = goal
    ? {
        name: goal.name,
        accountId: goal.accountId,
        targetAmount: String(goal.targetAmount),
        targetDate: goal.targetDate ?? "",
        description: goal.description ?? "",
        icon: goal.icon ?? "",
        color: goal.color,
      }
    : {
        name: "",
        accountId: availableAccounts[0]?.id ?? "",
        targetAmount: "",
        targetDate: "",
        description: "",
        icon: "",
        color: "#2e7d32",
      };

  const handleSubmit = async (values: GoalFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
      targetAmount: Number(values.targetAmount),
      targetDate: values.targetDate || null,
      icon: values.icon || null,
      color: values.color,
    };

    try {
      if (goal) {
        await updateGoal({ id: goal.id, payload });
        showSnackbar("Meta actualizada");
        onSaved();
        return;
      }

      await createGoal({ ...payload, accountId: values.accountId });
      showSnackbar("Meta creada");
      onSaved();
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const canSubmit = accountOptions.length > 0;

  return (
    <Formik
      key={goal?.id ?? "new"}
      initialValues={initialValues}
      validationSchema={goalValidationSchema}
      onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <DialogContent>
            <FormTextField
              name="name"
              label="Nombre"
              placeholder="Ej: Auto, casa, viaje"
              autoFocus
            />

            <FormSelect
              name="accountId"
              label="Cuenta de ahorro"
              options={accountOptions}
              disabled={Boolean(goal) || !canSubmit}
              helperText="El dinero reservado se descuenta del saldo disponible de esta cuenta."
            />

            {!canSubmit && (
              <DialogContentText color="warning.main" sx={{ mt: 1 }}>
                Necesitas una cuenta de ahorro. Crea una cuenta de tipo ahorro
                para vincular tus metas.
              </DialogContentText>
            )}

            <FormTextField
              name="targetAmount"
              label="Monto objetivo"
              type="number"
              placeholder="0,00"
              slotProps={{
                htmlInput: { min: 0.01, step: 0.01 },
              }}
            />

            <DesktopDatePicker
              label="Fecha objetivo (opcional)"
              value={values.targetDate ? parseISO(values.targetDate) : null}
              onChange={(newDate) =>
                void setFieldValue(
                  "targetDate",
                  newDate ? format(newDate, "yyyy-MM-dd") : "",
                )
              }
              slotProps={{
                textField: { fullWidth: true, margin: "normal" },
              }}
            />

            <FormTextField
              name="description"
              label="Descripción (opcional)"
              placeholder="Ej: Para el enganche"
              multiline
              minRows={2}
            />

            <ColorField name="color" />
            <IconField name="icon" label="Ícono" />

            <Typography variant="caption" color="text.secondary" component="p">
              La meta se completa cuando reserves el monto objetivo.
            </Typography>
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
              loadingPosition="start"
              disabled={!canSubmit}>
              Guardar
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
