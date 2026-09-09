import { SetStateAction, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAsyncAction } from "@/hooks/useAsync";
import { useUiStore } from "@/stores/uiStore";
import { deleteTransaction } from "../services/api";
import { TransactionFormDialog } from "../components/TransactionFormDialog";
import TransactionTable from "../components/TransactionTable";
import useGetDataByFilter from "../hooks/useGetDataByFilter";
import TransactionFilter from "../components/TransactionFilter";
import { Transaction } from "@meridia/shared";

const TransactionsPage = () => {
  useDocumentTitle("Movimientos");
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const [formOpen, setFormOpen] = useState(false);
  const { loading: deletingLoading, run: runDelete } = useAsyncAction();
  const {
    deleting,
    setDeleting,
    refetch,
    setEditing,
    loading,
    data,
    error,
    items,
    editing,
    categories,
    accounts,
    accountsByCurrency,
    total,
    filters,
    setFilters,
    hasFilters,
    resetFilters,
    setLimit,
  } = useGetDataByFilter();

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await runDelete(async () => {
      await deleteTransaction(deleting.id);
      return "Movimiento eliminado";
    });
    if (result) {
      showSnackbar(result);
      setDeleting(null);
      refetch();
    }
  };

  const actions = {
    onClickEditar: (transaction: SetStateAction<Transaction | null>) => {
      setEditing(transaction);
      setFormOpen(true);
    },
    onClickEliminar: (transaction: SetStateAction<Transaction | null>) =>
      setDeleting(transaction),
  };

  return (
    <>
      <PageHeader
        title="Movimientos"
        subtitle="Tus ingresos y gastos, con filtros por fecha"
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
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && items.length === 0 && (
        <EmptyState message="No hay movimientos que coincidan con los filtros." />
      )}

      {data && items.length > 0 && (
        <TransactionTable
          actions={actions}
          items={items}
          accountsByCurrency={accountsByCurrency}
          total={total}
          setLimit={setLimit}
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
        loading={deletingLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default TransactionsPage;
