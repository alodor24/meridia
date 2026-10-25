import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AccountIcon from "@mui/icons-material/AccountBalance";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SavingsIcon from "@mui/icons-material/Savings";
import MoneyIcon from "@mui/icons-material/Money";
import TimelineIcon from "@mui/icons-material/Timeline";
import { formatCurrency, getCurrencySymbol } from "@/utils/format";
import { ACCOUNT_TYPE_LABELS } from "@/utils/labels";
import { Account } from "@meridia/shared";
import ActionTable, { ActionProps } from "@/components/ui/ActionTable";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { SHADOW } from "@/theme/globalStyles";

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

  const accountIcons = {
    cash: <MoneyIcon color="success" />,
    bank: <AccountIcon />,
    credit_card: <CreditCardIcon />,
    savings: <SavingsIcon />,
    investment: <TimelineIcon />,
    wallet: <AccountBalanceWalletIcon color="secondary" />,
  };

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent>
        <Box sx={{ overflowX: "auto", maxHeight: 450 }}>
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
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "primary.main",
                          p: 1.5,
                          borderRadius: 10,
                          bgcolor: "background.default",
                        }}>
                        {accountIcons[account.type]}
                      </Box>

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
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "success.main",
                          },
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountTable;
