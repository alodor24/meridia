import { SetStateAction, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useUiStore } from "@/stores/uiStore";
import { TransactionFormDialog } from "../components/TransactionFormDialog";
import TransactionTable from "../components/TransactionTable";
import useGetDataByFilter from "../hooks/useGetDataByFilter";
import TransactionFilter from "../components/TransactionFilter";
import { Transaction } from "@meridia/shared";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";
import { toApiError } from "@/services/api/errors";

const TransactionsPage = () => {
  useDocumentTitle("Movimientos");
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const [formOpen, setFormOpen] = useState(false);
  const { mutateAsync: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();
  const {
    data,
    accounts,
    categories,
    editing,
    setEditing,
    deleting,
    setDeleting,
    loading,
    error,
    refetch,
    filters,
    setFilters,
    resetFilters,
    hasFilters,
    total,
    items,
    accountsByCurrency,
    page,
    setPage,
    limit,
    handleLimitChange,
  } = useGetDataByFilter();

  const actionOptions = {
    onClickEditar: (transaction: SetStateAction<Transaction | null>) => {
      setEditing(transaction);
      setFormOpen(true);
    },
    onClickEliminar: (transaction: SetStateAction<Transaction | null>) =>
      setDeleting(transaction),
  };

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await deleteTransaction(deleting.id);

      if (items.length === 1 && page > 0) {
        setPage(page - 1);
      }

      showSnackbar("Movimiento eliminado");
      setDeleting(null);
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <>
      <PageHeader
        title="Movimientos"
        subtitle="Registra y consulta todos tus ingresos y gastos."
        actionLabel="Nuevo movimiento"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      <TransactionFilter
        filters={filters}
        setFilters={setFilters}
        accounts={accounts}
        categories={categories}
        hasFilters={hasFilters}
        resetFilters={resetFilters}
      />

      {loading && !data && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {data && items.length === 0 && (
        <EmptyState message="No hay movimientos que coincidan con los filtros." />
      )}

      {data && items.length > 0 && (
        <TransactionTable
          actions={actionOptions}
          items={items}
          accountsByCurrency={accountsByCurrency}
          total={total}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={handleLimitChange}
        />
      )}

      <TransactionFormDialog
        open={formOpen}
        transaction={editing}
        accounts={accounts}
        categories={categories}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          refetch();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar movimiento"
        description="¿Eliminar este movimiento? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default TransactionsPage;
