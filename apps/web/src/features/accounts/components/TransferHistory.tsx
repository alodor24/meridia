import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AccountTransfer } from "@meridia/shared";
import ActionTable, { ActionProps } from "@/components/ui/ActionTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from "@/conts";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { SHADOW } from "@/theme/globalStyles";
import { formatCurrency, formatDate } from "@/utils/format";
import { useDeleteTransfer } from "../hooks/useDeleteTransfer";
import { useListTransfers } from "../hooks/useListTransfers";

export const TransferHistory = () => {
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleting, setDeleting] = useState<AccountTransfer | null>(null);
  const { mutateAsync: deleteTransfer, isPending: isDeleting } =
    useDeleteTransfer();
  const { data, isLoading, error, refetch } = useListTransfers({
    limit,
    offset: page * limit,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const actionOptions: ActionProps<AccountTransfer>[] = [
    {
      label: "Eliminar transferencia",
      icon: DeleteIcon,
      color: "error",
      onClick: (transfer) => setDeleting(transfer),
    },
  ];

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await deleteTransfer(deleting.id);

      if (items.length === 1 && page > 0) {
        setPage(page - 1);
      }

      showSnackbar("Transferencia eliminada");
      setDeleting(null);
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(0);
  };

  return (
    <>
      <Card sx={{ boxShadow: SHADOW, mt: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Transferencias internas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Movimientos entre tus cuentas que no afectan ingresos ni gastos.
          </Typography>

          {isLoading && !data && (
            <LoadingState label="Cargando transferencias…" />
          )}
          {error && <ErrorState message={error.message} onRetry={refetch} />}

          {data && items.length === 0 && (
            <EmptyState message="Todavía no hay transferencias internas." />
          )}

          {data && items.length > 0 && (
            <>
              <Box sx={{ overflowX: "auto", maxHeight: 450 }}>
                <Table stickyHeader aria-label="Transferencias internas">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Desde</TableCell>
                      <TableCell>Hacia</TableCell>
                      <TableCell>Nota</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((transfer) => (
                      <TableRow key={transfer.id} hover>
                        <TableCell>
                          {formatDate(transfer.createdAt, "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{transfer.fromAccountName}</TableCell>
                        <TableCell>{transfer.toAccountName}</TableCell>
                        <TableCell>{transfer.note ?? ""}</TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            color="info"
                            label={formatCurrency(
                              transfer.amount,
                              transfer.currency,
                            )}
                            variant="outlined"
                          />
                        </TableCell>
                        <ActionTable data={transfer} actions={actionOptions} />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Box sx={{ mt: 2 }}>
                <TablePagination
                  component="div"
                  count={total}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    handleLimitChange(Number(event.target.value));
                  }}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar transferencia"
        description="¿Eliminar esta transferencia? Los saldos de ambas cuentas se recalcularán."
        confirmLabel="Eliminar"
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};
