import { SetStateAction, useState } from "react";
import { Grid } from "@mui/material";
import type { Category, TransactionType } from "@meridia/shared";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch, useAsyncAction } from "@/hooks/useAsync";
import { useUiStore } from "@/stores/uiStore";
import { deleteCategory, listCategories } from "../services/api";
import { CategoryFormDialog } from "../components/CategoryFormDialog";
import CategoryTable from "../components/CategoryTable";

const CategoriesPage = () => {
  useDocumentTitle("Categorías");
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { data, loading, error, refetch } = useFetch(() => listCategories());
  const { loading: deleting, run: runDelete } = useAsyncAction();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [defaultType] = useState<TransactionType>("expense");
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const handleDelete = async () => {
    if (!deletingCategory) return;
    const result = await runDelete(async () => {
      await deleteCategory(deletingCategory.id);
      return "Categoría eliminada";
    });
    if (result) {
      showSnackbar(result);
      setDeletingCategory(null);
      refetch();
    }
  };

  const income = data?.filter((c) => c.type === "income") ?? [];
  const expense = data?.filter((c) => c.type === "expense") ?? [];

  const actions = {
    onClickEditar: (category: SetStateAction<Category | null>) => {
      setEditing(category);
      setFormOpen(true);
    },
    onClickEliminar: (category: SetStateAction<Category | null>) =>
      setDeletingCategory(category),
  };

  return (
    <>
      <PageHeader
        title="Categorías"
        subtitle="Organiza tus movimientos por categorías de ingresos y gastos"
        actionLabel="Nueva categoría"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && data.length === 0 && (
        <EmptyState message="No tienes categorías. Crea tus primeras categorías para organizar tus finanzas." />
      )}

      {data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryTable
              categories={expense}
              title="Gastos"
              actions={actions}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryTable
              categories={income}
              title="Ingresos"
              actions={actions}
            />
          </Grid>
        </Grid>
      )}

      <CategoryFormDialog
        open={formOpen}
        category={editing}
        defaultType={defaultType}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          refetch();
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        title="Eliminar categoría"
        description={
          deletingCategory
            ? `¿Eliminar "${deletingCategory.name}"? Solo se puede eliminar si no está en uso por movimientos.`
            : undefined
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeletingCategory(null)}
      />
    </>
  );
};

export default CategoriesPage;
