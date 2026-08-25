import type { Transaction } from "@meridia/shared";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Link } from "@tanstack/react-router";
import { PATHS } from "@/conts";
import RowTransaction from "./Transaction";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

export const RecentTransactions = ({ transactions = [], currency }: RecentTransactionsProps) => {
  if (transactions.length === 0) {
    return (
      <Card elevation={3} sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Últimos movimientos
          </Typography>

          <Typography variant="body2" color="text.secondary">
            No hay movimientos aún.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Últimos movimientos
        </Typography>

        <Box sx={{ maxHeight: "400px", overflow: "hidden", overflowY: "auto", px: 2, backgroundColor: "background.paper" }}>
          {transactions.map((transaction, index) => (
            <RowTransaction key={transaction.id} transaction={transaction} currency={currency} index={index} />
          ))}
        </Box>

        <Box sx={{ mt: 2 }}>
          <MuiLink component={Link} to={PATHS.TRANSACTIONS} variant="body2">
            Ver todos los movimientos
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
};
