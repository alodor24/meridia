import { useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import type { Account } from "@meridia/shared";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch, useAsyncAction } from "@/hooks/useAsync";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { deleteAccount, listAccounts } from "../services/api";
import { AccountFormDialog } from "../components/AccountFormDialog";
import AccountTable from "../components/AccountTable";
import { SHADOW } from "@/theme/globalStyles";

const AccountsPage = () => {
  useDocumentTitle("Cuentas");
  const currency = useAuthStore((s) => s.user?.currency ?? "USD");
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { data, loading, error, refetch } = useFetch(listAccounts);
  const { loading: deleting, run: runDelete } = useAsyncAction();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const handleDelete = async () => {
    if (!deletingAccount) return;
    const result = await runDelete(async () => {
      await deleteAccount(deletingAccount.id);
      return "Cuenta eliminada";
    });

    if (result) {
      showSnackbar(result);
      setDeletingAccount(null);
      refetch();
    }
  };

  return (
    <>
      <PageHeader
        title="Cuentas"
        subtitle="Administra el saldo disponible de tus cuentas."
        actionLabel="Nueva cuenta"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && data.length === 0 && (
        <EmptyState message="Todavía no tienes cuentas. Crea la primera para empezar." />
      )}

      {data && data.length > 0 && (
        <Card sx={{ boxShadow: SHADOW }}>
          <CardContent>
            <Box sx={{ overflowX: "auto", maxHeight: 450 }}>
              <AccountTable
                data={data || []}
                actions={{
                  onClickEditar: (account) => {
                    setEditing(account);
                    setFormOpen(true);
                  },
                  onClickEliminar: (account) => {
                    setDeletingAccount(account);
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
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

      <ConfirmDialog
        open={Boolean(deletingAccount)}
        title="Eliminar cuenta"
        description={
          deletingAccount
            ? `¿Eliminar la cuenta "${deletingAccount.name}"? Solo se puede eliminar si no tiene movimientos.`
            : undefined
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeletingAccount(null)}
      />
    </>
  );
};

export default AccountsPage;
