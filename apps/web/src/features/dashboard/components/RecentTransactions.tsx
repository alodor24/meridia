import type { Transaction } from "@meridia/shared";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { PATHS } from "@/conts";
import RowTransaction from "./Transaction";
import { SHADOW } from "@/theme/globalStyles";
import { EmptyState } from "@/components/ui/States";
import CardLink from "./CardLink";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

export const RecentTransactions = ({
  transactions = [],
  currency,
}: RecentTransactionsProps) => {
  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
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
          <EmptyState message=" No hay movimientos aún." />
        )}

        <CardLink label="Ver todos los movimientos" path={PATHS.TRANSACTIONS} />
      </CardContent>
    </Card>
  );
};
