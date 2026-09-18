import CustomTabs from "@/components/ui/CustomTabs";
import { SHADOW } from "@/theme/globalStyles";
import { Card, CardContent, Divider } from "@mui/material";
import { ExpensesByCategory } from "./ExpensesByCategory";
import IncomesByCategory from "./IncomesByCategory";
import { DashboardSummary } from "@meridia/shared";
import { useAuthStore } from "@/stores/authStore";
import { PATHS } from "@/conts";
import CardLink from "./CardLink";

interface AnalyticsByCategoryProps {
  data: DashboardSummary | null;
}

const labels = ["Gastos por categoría", "Ingresos por categoría"];

const AnalyticsByCategory = ({ data }: AnalyticsByCategoryProps) => {
  const currency = useAuthStore((s) => s.user?.currency ?? "USD");

  if (!data) return null;

  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
      <CardContent>
        <CustomTabs labels={labels}>
          <ExpensesByCategory
            items={data.expensesByCategory}
            currency={currency}
          />
          <IncomesByCategory
            items={data.incomesByCategory}
            currency={currency}
          />
        </CustomTabs>

        <Divider />
        <CardLink label="Ver todos las categorías" path={PATHS.CATEGORIES} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsByCategory;
