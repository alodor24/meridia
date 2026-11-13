import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, Formik } from "formik";
import type { Goal } from "@meridia/shared";
import { FormTextField } from "@/components/ui/FormTextField";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { formatCurrency } from "@/utils/format";
import { useReleaseGoalAmount } from "../hooks/useReleaseGoalAmount";
import type { GoalReleaseFormValues } from "../types";
import { buildReleaseValidationSchema } from "../validations";

interface GoalReleaseDialogProps {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
  onSaved: () => void;
}

export const GoalReleaseDialog = ({
  open,
  goal,
  onClose,
  onSaved,
}: GoalReleaseDialogProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: releaseGoalAmount, isPending } = useReleaseGoalAmount();

  if (!goal) return null;

  const initialValues: GoalReleaseFormValues = { amount: "" };
  const validationSchema = buildReleaseValidationSchema(goal.currentAmount);

  const handleSubmit = async (values: GoalReleaseFormValues) => {
    try {
      await releaseGoalAmount({
        id: goal.id,
        payload: { amount: Number(values.amount) },
      });
      showSnackbar("Reserva liberada");
      onSaved();
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle>Liberar reserva de {goal.name}</DialogTitle>
      <Formik
        key={goal.id}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form>
          <DialogContent>
            <DialogContentText sx={{ mb: 1 }}>
              La meta tiene{" "}
              <strong>
                {formatCurrency(goal.currentAmount, goal.currency)}
              </strong>{" "}
              reservados. El monto liberado seguirá disponible en{" "}
              {goal.accountName}.
            </DialogContentText>

            <FormTextField
              name="amount"
              label="Monto a liberar"
              type="number"
              placeholder="0,00"
              slotProps={{
                htmlInput: {
                  min: 0.01,
                  max: goal.currentAmount,
                  step: 0.01,
                },
              }}
              autoFocus
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} disabled={isPending} color="inherit">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={isPending}
              loadingPosition="start">
              Liberar
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
