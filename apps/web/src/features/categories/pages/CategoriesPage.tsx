import { SetStateAction, useState } from "react";
import Grid from "@mui/material/Grid";
import type { Category, TransactionType } from "@meridia/shared";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useUiStore } from "@/stores/uiStore";
import { CategoryFormDialog } from "../components/CategoryFormDialog";
import CategoryTable from "../components/CategoryTable";
import CategoryCard from "../components/CategoryCard";
import CategoryIcon from "@mui/icons-material/Category";
import TrendDownIcon from "@mui/icons-material/TrendingDown";
import TrendUpIcon from "@mui/icons-material/TrendingUp";
import { useListCategories } from "../hooks/useListCategories";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { toApiError } from "@/services/api/errors";

const CategoriesPage = () => {
  useDocumentTitle("Categorías");
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { data, isLoading, error, refetch } = useListCategories();
  const { mutateAsync: deleteCategory, isPending } = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [defaultType] = useState<TransactionType>("expense");
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const income = data?.filter((c) => c.type === "income") ?? [];
  const expense = data?.filter((c) => c.type === "expense") ?? [];

  const actionOptions = {
    onClickEditar: (category: SetStateAction<Category | null>) => {
      setEditing(category);
      setFormOpen(true);
    },
    onClickEliminar: (category: SetStateAction<Category | null>) =>
      setDeletingCategory(category),
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id);
      showSnackbar("Categoría eliminada");
      setDeletingCategory(null);
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <>
      <PageHeader
        title="Categorías"
        subtitle="Organiza tus movimientos por categorías de ingresos y gastos."
        actionLabel="Nueva categoría"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {data && data.length === 0 && (
        <EmptyState message="No tienes categorías. Crea tus primeras categorías para organizar tus finanzas." />
      )}

      {data && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CategoryCard
                icon={<TrendDownIcon />}
                total={expense.length}
                subtitle="Categorías de gastos"
                color="error.main"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CategoryCard
                icon={<TrendUpIcon />}
                total={income.length}
                subtitle="Categorías de ingresos"
                color="success.main"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CategoryCard
                icon={<CategoryIcon />}
                total={data.length}
                subtitle="Categorías totales"
                color="primary.main"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CategoryTable
                categories={expense}
                title="Gastos"
                actions={actionOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CategoryTable
                categories={income}
                title="Ingresos"
                actions={actionOptions}
              />
            </Grid>
          </Grid>
        </>
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
        loading={isPending}
        onConfirm={handleDelete}
        onClose={() => setDeletingCategory(null)}
      />
    </>
  );
};

export default CategoriesPage;
