import { useState } from "react";
import Button from "@mui/material/Button";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import type { Account } from "@meridia/shared";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useUiStore } from "@/stores/uiStore";
import { AccountFormDialog } from "../components/AccountFormDialog";
import AccountTable from "../components/AccountTable";
import { TransferDialog } from "../components/TransferDialog";
import { TransferHistory } from "../components/TransferHistory";
import useGetUserCurrency from "@/hooks/useGetUserCurrency";
import { useListAccounts } from "../hooks/useListAccounts";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { toApiError } from "@/services/api/errors";

const AccountsPage = () => {
  useDocumentTitle("Cuentas");
  const { currency } = useGetUserCurrency();
  const { data, isLoading, error, refetch } = useListAccounts();
  const { mutateAsync: deleteAccount, isPending: isDeleting } =
    useDeleteAccount();
  const showSnackbar = useUiStore((s) => s.showSnackbar);

  const [formOpen, setFormOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const actionOptions = {
    onClickEditar: (account: Account) => {
      setEditing(account);
      setFormOpen(true);
    },
    onClickEliminar: (account: Account) => {
      setDeletingAccount(account);
    },
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;

    try {
      await deleteAccount(deletingAccount.id);
      showSnackbar("Cuenta eliminada");
      setDeletingAccount(null);
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <>
      <PageHeader
        title="Cuentas"
        subtitle="Administra el saldo disponible de tus cuentas."
        secondaryAction={
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            onClick={() => setTransferOpen(true)}
            sx={{ textTransform: "capitalize" }}>
            Transferir Saldo
          </Button>
        }
        actionLabel="Nueva cuenta"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {data && data.length === 0 && (
        <EmptyState message="Todavía no tienes cuentas. Crea la primera para empezar." />
      )}

      {data && data.length > 0 && (
        <>
          <AccountTable data={data} actions={actionOptions} />
          <TransferHistory />
        </>
      )}

      <AccountFormDialog
        open={formOpen}
        account={editing}
        defaultCurrency={currency}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          refetch();
        }}
      />

      <TransferDialog
        open={transferOpen}
        accounts={data ?? []}
        onClose={() => setTransferOpen(false)}
        onSaved={() => {
          setTransferOpen(false);
          refetch();
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingAccount)}
        title="Eliminar cuenta"
        description={
          deletingAccount
            ? `¿Eliminar la cuenta "${deletingAccount.name}"? Solo se puede eliminar si no tiene movimientos ni transferencias.`
            : undefined
        }
        confirmLabel="Eliminar"
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeletingAccount(null)}
      />
    </>
  );
};

export default AccountsPage;
