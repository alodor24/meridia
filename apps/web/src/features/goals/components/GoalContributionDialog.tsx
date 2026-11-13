import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, Formik } from "formik";
import type { Account, Goal } from "@meridia/shared";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextField } from "@/components/ui/FormTextField";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { formatCurrency } from "@/utils/format";
import { useContributeToGoal } from "../hooks/useContributeToGoal";
import type { GoalContributionFormValues } from "../types";
import {
  getGoalAvailableAmount,
  getGoalRemainingAmount,
  getGoalSourceAccounts,
} from "../utils/goals";
import { buildContributionValidationSchema } from "../validations";

interface GoalContributionDialogProps {
  open: boolean;
  goal: Goal | null;
  accounts: Account[];
  goals: Goal[];
  onClose: () => void;
  onSaved: () => void;
}

export const GoalContributionDialog = ({
  open,
  goal,
  accounts,
  goals,
  onClose,
  onSaved,
}: GoalContributionDialogProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: contributeToGoal, isPending } = useContributeToGoal();

  if (!goal) return null;

  const goalAccount = accounts.find((account) => account.id === goal.accountId);
  const internalAvailable = getGoalAvailableAmount(goalAccount, goals);

  const externalSources = getGoalSourceAccounts(accounts, goal)
    .map((account) => ({
      account,
      available: getGoalAvailableAmount(account, goals),
    }))
    .filter((source) => source.available > 0);

  const sourceOptions = [
    ...(internalAvailable > 0
      ? [
          {
            value: goal.accountId,
            label: `Saldo disponible · ${goal.accountName} · ${formatCurrency(
              internalAvailable,
              goal.currency,
            )}`,
            limit: internalAvailable,
          },
        ]
      : []),
    ...externalSources.map(({ account, available }) => ({
      value: account.id,
      label: `${account.name} · disponible ${formatCurrency(
        available,
        account.currency,
      )}`,
      limit: available,
    })),
  ];

  const sourceLimits = Object.fromEntries(
    sourceOptions.map((source) => [source.value, source.limit]),
  );
  const validationSchema = buildContributionValidationSchema({
    sourceLimits,
    remainingAmount: getGoalRemainingAmount(goal),
  });

  const initialValues: GoalContributionFormValues = {
    sourceAccountId: sourceOptions[0]?.value ?? "",
    amount: "",
  };

  const handleSubmit = async (values: GoalContributionFormValues) => {
    try {
      await contributeToGoal({
        id: goal.id,
        payload: {
          amount: Number(values.amount),
          fromAccountId:
            values.sourceAccountId === goal.accountId
              ? undefined
              : values.sourceAccountId,
        },
      });
      showSnackbar("Reserva agregada a la meta");
      onSaved();
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const canSubmit = sourceOptions.length > 0;

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle>Aportar a {goal.name}</DialogTitle>
      <Formik
        key={goal.id}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form>
          <DialogContent>
            <DialogContentText sx={{ mb: 1 }}>
              Puedes reservar saldo disponible de{" "}
              <strong>{goal.accountName}</strong> o transferir desde otra
              cuenta. Faltan{" "}
              {formatCurrency(getGoalRemainingAmount(goal), goal.currency)}.
            </DialogContentText>

            {!canSubmit && (
              <DialogContentText color="warning.main">
                No tienes saldo disponible en la misma moneda para aportar.
                Transfiere o registra un ingreso en la cuenta de ahorro.
              </DialogContentText>
            )}

            <FormSelect
              name="sourceAccountId"
              label="Origen del aporte"
              options={sourceOptions.map(({ value, label }) => ({
                value,
                label,
              }))}
              disabled={!canSubmit}
            />

            <FormTextField
              name="amount"
              label="Monto a reservar"
              type="number"
              placeholder="0,00"
              slotProps={{
                htmlInput: { min: 0.01, step: 0.01 },
              }}
            />

            <DialogContentText variant="caption" component="p">
              El dinero reservado queda apartado para esta meta, pero sigue en
              la cuenta.
            </DialogContentText>
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
              Reservar
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
