import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { AnalyticsMonthlyTotal } from "@meridia/shared";
import { EmptyState } from "@/components/ui/States";
import { SHADOW } from "@/theme/globalStyles";
import IncomeExpenseMonthlyChart from "./IncomeExpenseMonthlyChart";

interface IncomeExpenseMonthlyCardProps {
  items: AnalyticsMonthlyTotal[];
  currency: string;
  year: number;
}

const IncomeExpenseMonthlyCard = ({
  items,
  currency,
  year,
}: IncomeExpenseMonthlyCardProps) => {
  const hasData = items.some((item) => item.income > 0 || item.expenses > 0);

  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Ingresos y gastos por mes
        </Typography>

        <Box sx={{ height: 340 }}>
          {hasData ? (
            <IncomeExpenseMonthlyChart items={items} currency={currency} />
          ) : (
            <EmptyState message={`Sin movimientos en ${year}.`} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseMonthlyCard;
