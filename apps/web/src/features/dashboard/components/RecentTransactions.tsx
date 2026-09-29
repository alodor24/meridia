import type { Transaction } from "@meridia/shared";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { PATHS } from "@/conts";
import RowTransaction from "./Transaction";
import { SHADOW } from "@/theme/globalStyles";
import { EmptyState } from "@/components/ui/States";
import CardLink from "./CardLink";
import getCategoryIcon from "@/utils/getCategoryIcon";

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
              minHeight: 400,
              maxHeight: 400,
              overflow: "hidden",
              overflowY: "auto",
              px: 2,
              backgroundColor: "background.paper",
            }}>
            {transactions.map((transaction, index) => {
              const Icon = transaction.categoryIcon
                ? getCategoryIcon(transaction.categoryIcon)
                : undefined;

              return (
                <RowTransaction
                  key={transaction.id}
                  transaction={transaction}
                  currency={currency}
                  index={index}
                  icon={
                    Icon ? (
                      <Icon style={{ fontSize: 16 }} />
                    ) : (
                      transaction.categoryName?.charAt(0)
                    )
                  }
                />
              );
            })}
          </Box>
        ) : (
          <Box sx={{ minHeight: 400 }}>
            <EmptyState message=" No hay movimientos aún." />
          </Box>
        )}

        <CardLink label="Ver todos los movimientos" path={PATHS.TRANSACTIONS} />
      </CardContent>
    </Card>
  );
};
