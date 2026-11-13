import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Account, Goal } from "@meridia/shared";
import { useCreateGoal } from "../hooks/useCreateGoal";
import { useUpdateGoal } from "../hooks/useUpdateGoal";
import { GoalForm } from "./GoalForm";

export interface GoalFormDialogProps {
  open: boolean;
  goal: Goal | null;
  accounts: Account[];
  onClose: () => void;
  onSaved: () => void;
}

export const GoalFormDialog = ({
  open,
  goal,
  accounts,
  onClose,
  onSaved,
}: GoalFormDialogProps) => {
  const { isPending: isCreating } = useCreateGoal();
  const { isPending: isUpdating } = useUpdateGoal();

  return (
    <Dialog
      open={open}
      onClose={isCreating || isUpdating ? undefined : onClose}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>{goal ? "Editar meta" : "Nueva meta"}</DialogTitle>
      <GoalForm
        goal={goal}
        accounts={accounts}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Dialog>
  );
};
