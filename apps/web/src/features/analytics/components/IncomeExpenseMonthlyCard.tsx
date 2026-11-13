import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { AnalyticsMonthlyTotal } from "@meridia/shared";
import { EmptyState } from "@/components/ui/States";
import { SHADOW } from "@/theme/globalStyles";
import IncomeExpenseMonthlyChart from "./IncomeExpenseMonthlyChart";
import LegendsChart from "./LegendsChart";

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
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Evolución anual de ingresos y gastos
        </Typography>

        <Box
          sx={{
            mt: 2,
            px: 1,
            pt: 2,
            pb: 7,
            height: 350,
            bgcolor: "background.paper",
          }}>
          {hasData ? (
            <>
              <LegendsChart />
              <IncomeExpenseMonthlyChart items={items} currency={currency} />
            </>
          ) : (
            <EmptyState message={`Sin movimientos en ${year}.`} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseMonthlyCard;
