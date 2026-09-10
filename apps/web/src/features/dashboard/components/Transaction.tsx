import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Transaction } from "@meridia/shared";
import Avatar from "./Avatar";

interface TransactionProps {
  transaction: Transaction;
  currency: string;
  index: number;
}

const Transaction = ({ transaction, currency, index }: TransactionProps) => {
  return (
    <Box>
      {index > 0 && <Divider />}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
        }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", minWidth: 0 }}>
          <Avatar
            categoryColor={transaction.categoryColor}
            categoryName={transaction.categoryName}
          />

          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              {transaction.categoryName}
            </Typography>

            <Typography variant="caption" color="text.secondary" noWrap>
              {formatDate(transaction.date)} - {transaction.accountName}
            </Typography>
          </Stack>
        </Stack>

        <Chip
          size="small"
          variant="outlined"
          color={transaction.type === "income" ? "success" : "error"}
          label={formatCurrency(transaction.amount, currency)}
        />
      </Stack>
    </Box>
  );
};

export default Transaction;
