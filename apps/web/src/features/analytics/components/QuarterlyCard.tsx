import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { AnalyticsQuarterlyTotal } from "@meridia/shared";
import { EmptyState } from "@/components/ui/States";
import { SHADOW } from "@/theme/globalStyles";
import QuarterlyChart from "./QuarterlyChart";
import LegendsChart from "./LegendsChart";

interface QuarterlyCardProps {
  items: AnalyticsQuarterlyTotal[];
  currency: string;
  year: number;
}

const QuarterlyCard = ({ items, currency, year }: QuarterlyCardProps) => {
  const hasData = items.some((item) => item.income > 0 || item.expenses > 0);

  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Comparación trimestral
        </Typography>

        <Box
          sx={{
            mt: 2,
            px: 1,
            pt: 2,
            pb: 7,
            height: 400,
            bgcolor: "background.paper",
          }}>
          {hasData ? (
            <>
              <LegendsChart />
              <QuarterlyChart items={items} currency={currency} year={year} />
            </>
          ) : (
            <EmptyState message={`Sin movimientos en ${year}.`} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuarterlyCard;
