import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { formatCurrency } from "@/utils/format";
import { EmptyState } from "@/components/ui/States";

export interface ExpensesByCategoryItem {
  categoryId: string;
  name: string;
  color: string;
  total: number;
}

export interface ExpensesByCategoryProps {
  items: ExpensesByCategoryItem[];
  currency: string;
}

export const ExpensesByCategory = ({
  items = [],
  currency,
}: ExpensesByCategoryProps) => {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Box sx={{ mt: 5, minHeight: 352 }}>
      {items.length > 0 ? (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {items.map((item) => (
            <Box key={item.categoryId}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(item.total, currency)}
                  {total > 0
                    ? ` (${Math.round((item.total / total) * 100)}%)`
                    : ""}
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={total > 0 ? (item.total / total) * 100 : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "divider",
                  "& .MuiLinearProgress-bar": { bgcolor: item.color },
                }}
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <EmptyState message="Sin gastos en el mes." />
      )}
    </Box>
  );
};
