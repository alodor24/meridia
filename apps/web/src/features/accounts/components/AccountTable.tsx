import {
  Box,
  Chip,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  AccountBalance as AccountIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { formatCurrency, getCurrencySymbol } from "@/utils/format";
import { ACCOUNT_TYPE_LABELS } from "@/utils/labels";
import { Account } from "@meridia/shared";
import ActionTable, { ActionProps } from "@/components/ui/ActionTable";

interface AccountTableProps {
  data: Account[];
  actions: {
    onClickEditar: (data: Account) => void;
    onClickEliminar: (data: Account) => void;
  };
}

const AccountTable = ({ data, actions }: AccountTableProps) => {
  const total = data.reduce((sum, account) => sum + account.balance, 0);

  const optionButtons: ActionProps<Account>[] = [
    {
      label: "Editar cuenta",
      icon: EditIcon,
      color: "info" as const,
      onClick: (account) => actions.onClickEditar(account),
    },
    {
      label: "Eliminar cuenta",
      icon: DeleteIcon,
      color: "error" as const,
      onClick: (account) => actions.onClickEliminar(account),
    },
  ];

  return (
    <Table stickyHeader aria-label="sticky table">
      <TableHead>
        <TableRow>
          <TableCell>Cuenta</TableCell>
          <TableCell>Tipo</TableCell>
          <TableCell></TableCell>
          <TableCell align="right">Balance</TableCell>
          <TableCell align="right">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((account) => (
          <TableRow key={account.id} hover>
            <TableCell>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <AccountIcon color="primary" />
                <Box>
                  <Typography variant="body1">{account.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getCurrencySymbol(account.currency)}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell>
              <Chip
                size="small"
                label={ACCOUNT_TYPE_LABELS[account.type]}
                variant="outlined"
              />
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}>
                <LinearProgress
                  variant="determinate"
                  value={total > 0 ? (account.balance / total) * 100 : 0}
                  sx={{
                    height: 6,
                    width: 150,
                    borderRadius: 4,
                    bgcolor: "divider",
                    "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
                  }}
                />
                <Typography variant="caption">
                  {(total > 0
                    ? Math.round((account.balance / total) * 100)
                    : 0) + "%"}
                </Typography>
              </Box>
            </TableCell>
            <TableCell align="right">
              <Chip
                size="small"
                color={account.balance >= 0 ? "success" : "error"}
                label={formatCurrency(account.balance, account.currency)}
                variant="outlined"
              />
            </TableCell>
            <ActionTable data={account} actions={optionButtons} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccountTable;
