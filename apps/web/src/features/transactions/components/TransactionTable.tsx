import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { SHADOW } from "@/theme/globalStyles";
import { formatCurrency, formatDate } from "@/utils/format";
import ActionTable, { ActionProps } from "@/components/ui/ActionTable";
import { AccountId, Transaction } from "@meridia/shared";
import { PAGE_SIZE } from "@/conts";
import getCategoryIcon from "@/utils/getCategoryIcon";

interface TransactionTableProps {
  actions: {
    onClickEditar: (data: Transaction) => void;
    onClickEliminar: (data: Transaction) => void;
  };
  items: Transaction[];
  accountsByCurrency: Map<AccountId, string>;
  total: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

const TransactionTable = ({
  actions,
  items,
  accountsByCurrency,
  total,
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
      <CardContent>
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
        {items.length < total && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button onClick={() => setLimit((l) => l + PAGE_SIZE)}>
              Cargar más
            </Button>
          </Box>
        )}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "right", mt: 1 }}>
          {items.length} de {total} movimientos
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
