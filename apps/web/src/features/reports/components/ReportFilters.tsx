import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { Account, Category, TransactionType } from "@meridia/shared";
import type { ReportFilters as ReportFiltersValue } from "../types";

interface ReportFiltersProps {
  filters: ReportFiltersValue;
  accounts: Account[];
  categories: Category[];
  onChange: (filters: ReportFiltersValue) => void;
}

const ReportFilters = ({
  filters,
  accounts,
  categories,
  onChange,
}: ReportFiltersProps) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      sx={{ alignItems: { xs: "stretch", md: "center" } }}>
      <Box sx={{ width: { xs: "100%", md: 200 } }}>
        <TextField
          select
          fullWidth
          size="small"
          label="Cuenta"
          value={filters.accountId}
          onChange={(event) =>
            onChange({ ...filters, accountId: event.target.value })
          }>
          <MenuItem value="">Todas</MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ width: { xs: "100%", md: 200 } }}>
        <TextField
          select
          fullWidth
          size="small"
          label="Categoría"
          value={filters.categoryId}
          onChange={(event) =>
            onChange({ ...filters, categoryId: event.target.value })
          }>
          <MenuItem value="">Todas</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ width: { xs: "100%", md: 150 } }}>
        <TextField
          select
          fullWidth
          size="small"
          label="Tipo"
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as "" | TransactionType,
            })
          }>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="income">Ingresos</MenuItem>
          <MenuItem value="expense">Gastos</MenuItem>
        </TextField>
      </Box>
    </Stack>
  );
};

export default ReportFilters;
