import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AccountBalance as AccountIcon } from "@mui/icons-material";
import { formatCurrency, getCurrencySymbol } from "@/utils/format";
import { ACCOUNT_TYPE_LABELS } from "@/utils/labels";
import { Account } from "@meridia/shared";
import ActionTable, { ActionProps } from "@/components/ui/ActionTable";

interface AccountTableProps {
  data: Account[];
  actions: ActionProps<Account>[];
}

const AccountTable = ({ data, actions }: AccountTableProps) => {
  return (
    <Table stickyHeader aria-label="sticky table">
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
            <TableCell align="right">
              <Typography
                variant="body1"
                color={account.balance >= 0 ? "success" : "error"}
                sx={{ fontWeight: 600 }}>
                {formatCurrency(account.balance, account.currency)}
              </Typography>
            </TableCell>
            <ActionTable data={account} actions={actions} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccountTable;
