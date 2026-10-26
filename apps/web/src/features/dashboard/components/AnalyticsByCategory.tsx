import CategoryBreakdownChart from "@/components/charts/CategoryBreakdownChart";
import CustomTabs from "@/components/ui/CustomTabs";
import { SHADOW } from "@/theme/globalStyles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { DashboardSummary } from "@meridia/shared";
import { PATHS } from "@/conts";
import CardLink from "./CardLink";
import useGetUserCurrency from "@/hooks/useGetUserCurrency";

interface AnalyticsByCategoryProps {
  data: DashboardSummary | null;
}

const labels = ["Gastos por categoría", "Ingresos por categoría"];

const AnalyticsByCategory = ({ data }: AnalyticsByCategoryProps) => {
  const { currency } = useGetUserCurrency();

  if (!data) return null;

  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
      <CardContent>
        <CustomTabs labels={labels}>
          <CategoryBreakdownChart
            items={data.expensesByCategory}
            currency={currency}
            emptyMessage="Sin gastos en el mes."
          />
          <CategoryBreakdownChart
            items={data.incomesByCategory}
            currency={currency}
            emptyMessage="Sin ingresos en el mes."
          />
        </CustomTabs>

        <Divider />
        <CardLink label="Ver todos las categorías" path={PATHS.CATEGORIES} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsByCategory;
