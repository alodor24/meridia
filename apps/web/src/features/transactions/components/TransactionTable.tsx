import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { SHADOW } from "@/theme/globalStyles";
import { formatCurrency, formatDate } from "@/utils/format";
import ActionTable, { ActionProps } from "@/components/ui/ActionTable";
import { AccountId, Transaction } from "@meridia/shared";
import getCategoryIcon from "@/utils/getCategoryIcon";
import { ROWS_PER_PAGE_OPTIONS } from "@/conts";

interface TransactionTableProps {
  actions: {
    onClickEditar: (data: Transaction) => void;
    onClickEliminar: (data: Transaction) => void;
  };
  items: Transaction[];
  accountsByCurrency: Map<AccountId, string>;
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const TransactionTable = ({
  actions,
  items,
  accountsByCurrency,
  total,
  page,
  limit,
  setPage,
  setLimit,
}: TransactionTableProps) => {
  const optionButtons: ActionProps<Transaction>[] = [
    {
      label: "Editar movimiento",
      icon: EditIcon,
      color: "info" as const,
      onClick: (transaction) => actions.onClickEditar(transaction),
    },
    {
      label: "Eliminar movimiento",
      icon: DeleteIcon,
      color: "error" as const,
      onClick: (transaction) => actions.onClickEliminar(transaction),
    },
  ];

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent sx={{ "&.MuiCardContent-root:last-child": { pb: 1.5 } }}>
        <Box sx={{ overflowX: "auto", maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
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
              {items.map((transaction) => {
                const Icon = transaction.categoryIcon
                  ? getCategoryIcon(transaction.categoryIcon)
                  : undefined;

                return (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: transaction.categoryColor ?? "#607d8b",
                            color: "white",
                            fontSize: 11,
                          }}>
                          {Icon ? (
                            <Icon style={{ fontSize: 13 }} />
                          ) : (
                            transaction.categoryName?.charAt(0)
                          )}
                        </Avatar>
                        <Typography variant="body2">
                          {transaction.categoryName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{transaction.accountName}</TableCell>
                    <TableCell>{transaction.note ?? ""}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={formatCurrency(
                          transaction.amount,
                          accountsByCurrency.get(transaction.accountId) ??
                            "USD",
                        )}
                        color={
                          transaction.type === "income" ? "success" : "error"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <ActionTable data={transaction} actions={optionButtons} />
                  </TableRow>
                );
              })}
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
              setLimit(Number(event.target.value));
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
