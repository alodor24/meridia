import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import type { CategoryTotal } from "@meridia/shared";
import CategoryBreakdownChart from "@/components/charts/CategoryBreakdownChart";
import CustomTabs from "@/components/ui/CustomTabs";
import { SHADOW } from "@/theme/globalStyles";

interface CategoryBreakdownTabsProps {
  expenses: CategoryTotal[];
  incomes: CategoryTotal[];
  currency: string;
  year: number;
}

const labels = ["Gastos por categoría", "Ingresos por categoría"];

const CategoryBreakdownTabs = ({
  expenses,
  incomes,
  currency,
  year,
}: CategoryBreakdownTabsProps) => {
  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
      <CardContent>
        <CustomTabs labels={labels}>
          <CategoryBreakdownChart
            items={expenses}
            currency={currency}
            emptyMessage={`Sin gastos en ${year}.`}
          />
          <CategoryBreakdownChart
            items={incomes}
            currency={currency}
            emptyMessage={`Sin ingresos en ${year}.`}
          />
        </CustomTabs>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownTabs;
