import type { Transaction } from "@meridia/shared";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import { PATHS } from "@/conts";
import RowTransaction from "./Transaction";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

export const RecentTransactions = ({
  transactions = [],
  currency,
}: RecentTransactionsProps) => {
  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Últimos movimientos
        </Typography>

        {transactions.length > 0 ? (
          <Box
            sx={{
              maxHeight: 400,
              overflow: "hidden",
              overflowY: "auto",
              px: 2,
              backgroundColor: "background.paper",
            }}>
            {transactions.map((transaction, index) => (
              <RowTransaction
                key={transaction.id}
                transaction={transaction}
                currency={currency}
                index={index}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay movimientos aún.
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <MuiLink component={Link} to={PATHS.TRANSACTIONS} variant="body2">
            Ver todos los movimientos
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
};
