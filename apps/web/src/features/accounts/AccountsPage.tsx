import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, AccountBalance as AccountIcon } from '@mui/icons-material';
import type { Account } from '@meridia/shared';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useFetch, useAsyncAction } from '@/hooks/useAsync';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { formatCurrency } from '@/utils/format';
import { ACCOUNT_TYPE_LABELS } from '@/utils/labels';
import { deleteAccount, listAccounts } from './api';
import { AccountFormDialog } from './components/AccountFormDialog';

function AccountsPage() {
  useDocumentTitle('Cuentas');
  const currency = useAuthStore((s) => s.user?.currency ?? 'USD');
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
      return 'Cuenta eliminada';
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
        subtitle="Efectivo, bancos, tarjetas, ahorros e inversiones"
        actionLabel="Nueva cuenta"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && data.length === 0 && (
        <EmptyState message="Todavía no tenés cuentas. Creá la primera para empezar." />
      )}

      {data && data.length > 0 && (
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cuenta</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((account) => (
                    <TableRow key={account.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccountIcon color="primary" />
                          <Box>
                            <Typography variant="body1">{account.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {account.currency}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={ACCOUNT_TYPE_LABELS[account.type]} variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600} color={account.balance >= 0 ? 'success.main' : 'error.main'}>
                          {formatCurrency(account.balance, account.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="Editar cuenta"
                          onClick={() => {
                            setEditing(account);
                            setFormOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="Eliminar cuenta"
                          color="error"
                          onClick={() => setDeletingAccount(account)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
}

export default AccountsPage;
