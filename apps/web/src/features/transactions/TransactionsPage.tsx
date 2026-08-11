import { useEffect, useState } from 'react';import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterAltOff as ClearFiltersIcon,
} from '@mui/icons-material';
import type { Account, Category, Transaction, TransactionType } from '@meridia/shared';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useFetch, useAsyncAction } from '@/hooks/useAsync';import { useUiStore } from '@/stores/uiStore';
import { formatCurrency, formatDate } from '@/utils/format';
import { deleteTransaction, listTransactions } from './api';
import { TransactionFormDialog } from './components/TransactionFormDialog';
import { listAccounts } from '@/features/accounts/api';
import { listCategories } from '@/features/categories/api';

const PAGE_SIZE = 20;

interface Filters {
  from: string;
  to: string;
  accountId: string;
  categoryId: string;
  type: '' | TransactionType;
}

const emptyFilters: Filters = { from: '', to: '', accountId: '', categoryId: '', type: '' };

function TransactionsPage() {
  useDocumentTitle('Movimientos');
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { loading: deletingLoading, run: runDelete } = useAsyncAction();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const activeFilters = {
    from: filters.from || undefined,
    to: filters.to || undefined,
    accountId: filters.accountId || undefined,
    categoryId: filters.categoryId || undefined,
    type: filters.type || undefined,
  };

  const { data, loading, error, refetch } = useFetch(
    () => listTransactions({ ...activeFilters, limit }),
    [filters.from, filters.to, filters.accountId, filters.categoryId, filters.type, limit],
  );

  useEffect(() => {
    let active = true;
    void Promise.all([listAccounts(), listCategories()]).then(([accountList, categoryList]) => {
      if (!active) return;
      setAccounts(accountList);
      setCategories(categoryList);
    });
    return () => {
      active = false;
    };
  }, []);

  const resetFilters = () => {
    setFilters(emptyFilters);
    setLimit(PAGE_SIZE);
  };

  const hasFilters = Object.values(filters).some((value) => value !== '');

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await runDelete(async () => {
      await deleteTransaction(deleting.id);
      return 'Movimiento eliminado';
    });
    if (result) {
      showSnackbar(result);
      setDeleting(null);
      refetch();
    }
  };

  const total = data?.total ?? 0;
  const items = data?.items ?? [];

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

      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="flex-start">
            <Box sx={{ width: { xs: '100%', md: 150 } }}>
              <TextField
                label="Desde"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={filters.from}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: 150 } }}>
              <TextField
                label="Hasta"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={filters.to}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: 200 } }}>
              <TextField
                select
                label="Cuenta"
                size="small"
                fullWidth
                value={filters.accountId}
                onChange={(e) => setFilters((f) => ({ ...f, accountId: e.target.value }))}
              >
                <MenuItem value="">Todas</MenuItem>
                {accounts.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 200 } }}>
              <TextField
                select
                label="Categoría"
                size="small"
                fullWidth
                value={filters.categoryId}
                onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 130 } }}>
              <TextField
                select
                label="Tipo"
                size="small"
                fullWidth
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as Filters['type'] }))}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="income">Ingresos</MenuItem>
                <MenuItem value="expense">Gastos</MenuItem>
              </TextField>
            </Box>
            {hasFilters && (
              <Button startIcon={<ClearFiltersIcon />} onClick={resetFilters} sx={{ mt: 1.5 }}>
                Limpiar
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {loading && !data && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && items.length === 0 && (
        <EmptyState message="No hay movimientos que coincidan con los filtros." />
      )}

      {data && items.length > 0 && (
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Cuenta</TableCell>
                    <TableCell>Nota</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 22, height: 22, bgcolor: transaction.categoryColor ?? '#607d8b', fontSize: 11 }}>
                            {transaction.categoryName?.charAt(0) ?? '?'}
                          </Avatar>
                          <Typography variant="body2">{transaction.categoryName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{transaction.accountName}</TableCell>
                      <TableCell>{transaction.note ?? ''}</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={formatCurrency(transaction.amount, accounts.find((a) => a.id === transaction.accountId)?.currency ?? 'USD')}
                          color={transaction.type === 'income' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton aria-label="Editar movimiento" onClick={() => { setEditing(transaction); setFormOpen(true); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="Eliminar movimiento" color="error" onClick={() => setDeleting(transaction)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            {items.length < total && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={() => setLimit((l) => l + PAGE_SIZE)}>Cargar más</Button>
              </Box>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
              {items.length} de {total} movimientos
            </Typography>
          </CardContent>
        </Card>
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
}

export default TransactionsPage;
