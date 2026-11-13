import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import type { Goal } from "@meridia/shared";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import CustomTabs from "@/components/ui/CustomTabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { useListAccounts } from "@/features/accounts/hooks/useListAccounts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { GoalCard } from "../components/GoalCard";
import { GoalContributionDialog } from "../components/GoalContributionDialog";
import { GoalFormDialog } from "../components/GoalFormDialog";
import { GoalReleaseDialog } from "../components/GoalReleaseDialog";
import { useDeleteGoal } from "../hooks/useDeleteGoal";
import { useListGoals } from "../hooks/useListGoals";
import type { GoalsTab } from "../types";
import { canContributeToGoal, splitGoals } from "../utils/goals";

interface GoalsPageProps {
  initialTab?: GoalsTab;
}

const GoalsPage = ({ initialTab }: GoalsPageProps) => {
  useDocumentTitle("Metas");
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const goalsQuery = useListGoals();
  const accountsQuery = useListAccounts();
  const { mutateAsync: deleteGoal, isPending: isDeleting } = useDeleteGoal();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [contributing, setContributing] = useState<Goal | null>(null);
  const [releasing, setReleasing] = useState<Goal | null>(null);
  const [deleting, setDeleting] = useState<Goal | null>(null);

  const goals = goalsQuery.data ?? [];
  const accounts = accountsQuery.data ?? [];
  const { active, completed } = splitGoals(goals);

  const isLoading = goalsQuery.isLoading || accountsQuery.isLoading;
  const error = goalsQuery.error ?? accountsQuery.error;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    void goalsQuery.refetch();
  };

  const handleContributionSaved = () => {
    setContributing(null);
    void Promise.all([goalsQuery.refetch(), accountsQuery.refetch()]);
  };

  const handleReleaseSaved = () => {
    setReleasing(null);
    void goalsQuery.refetch();
  };

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await deleteGoal(deleting.id);
      showSnackbar("Meta eliminada");
      setDeleting(null);
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const renderGoals = (items: Goal[], emptyMessage: string) => {
    if (items.length === 0) {
      return (
        <EmptyState
          message={emptyMessage}
          action={
            <Button variant="outlined" onClick={openCreate}>
              Crear meta
            </Button>
          }
        />
      );
    }

    return (
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {items.map((goal) => (
          <Grid key={goal.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <GoalCard
              goal={goal}
              canContribute={canContributeToGoal(accounts, goals, goal)}
              onContribute={setContributing}
              onRelease={setReleasing}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <PageHeader
        title="Metas"
        subtitle="Ahorra para lo que más te importa y sigue tu progreso."
        actionLabel="Nueva meta"
        onAction={openCreate}
      />

      {isLoading && <LoadingState />}
      {error && (
        <ErrorState
          message={error.message}
          onRetry={() => {
            void goalsQuery.refetch();
            void accountsQuery.refetch();
          }}
        />
      )}

      {!isLoading && !error && (
        <CustomTabs
          key={initialTab ?? "activas"}
          labels={["Activas", "Finalizadas"]}
          initialValue={initialTab === "finalizadas" ? 1 : 0}>
          {renderGoals(
            active,
            "Todavía no tienes metas activas. Crea la primera para empezar a ahorrar.",
          )}
          {renderGoals(
            completed,
            "Todavía no hay metas finalizadas. Cuando alcanzas el objetivo, la meta se archiva aquí.",
          )}
        </CustomTabs>
      )}

      <GoalFormDialog
        open={formOpen}
        goal={editing}
        accounts={accounts}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <GoalContributionDialog
        open={Boolean(contributing)}
        goal={contributing}
        accounts={accounts}
        goals={goals}
        onClose={() => setContributing(null)}
        onSaved={handleContributionSaved}
      />

      <GoalReleaseDialog
        open={Boolean(releasing)}
        goal={releasing}
        onClose={() => setReleasing(null)}
        onSaved={handleReleaseSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar meta"
        description={
          deleting
            ? `¿Eliminar la meta "${deleting.name}"? Se liberará el dinero reservado y el saldo de la cuenta no se modificará.`
            : undefined
        }
        confirmLabel="Eliminar"
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default GoalsPage;
