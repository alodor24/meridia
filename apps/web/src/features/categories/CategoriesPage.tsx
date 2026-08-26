import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Category, TransactionType } from "@meridia/shared";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch, useAsyncAction } from "@/hooks/useAsync";
import { useUiStore } from "@/stores/uiStore";
import { deleteCategory, listCategories } from "./api";
import { CategoryFormDialog } from "./components/CategoryFormDialog";
import { Grid } from "@mui/material";
import CustomTooltip from "@/components/ui/CustomTooltip";

const CategoriesPage = () => {
  useDocumentTitle("Categorías");
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { data, loading, error, refetch } = useFetch(() => listCategories());
  const { loading: deleting, run: runDelete } = useAsyncAction();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [defaultType] = useState<TransactionType>("expense");
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

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

  const renderTable = (categories: Category[], title: string) => (
    <Card elevation={3}>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Stack>
        {categories.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
            Sin categorías.
          </Typography>
        ) : (
          <Box sx={{ overflowX: "auto", maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-head": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: category.color,
                            fontSize: 12,
                            color: "primary.contrastText",
                          }}>
                          {category.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body1">{category.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <CustomTooltip title="Editar categoría">
                        <IconButton
                          aria-label="Editar categoría"
                          color="info"
                          onClick={() => {
                            setEditing(category);
                            setFormOpen(true);
                          }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </CustomTooltip>

                      <CustomTooltip title="Eliminar categoría">
                        <IconButton aria-label="Eliminar categoría" color="error" onClick={() => setDeletingCategory(category)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CustomTooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </Card>
  );

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
          <Grid size={{ xs: 12, md: 6 }}>{renderTable(expense, "Gastos")}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{renderTable(income, "Ingresos")}</Grid>
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
