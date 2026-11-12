import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ClearFiltersIcon from "@mui/icons-material/FilterAltOff";
import { SHADOW } from "@/theme/globalStyles";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { format as dateFnsFormat, parseISO } from "date-fns";
import { Filters } from "../hooks/useGetDataByFilter";
import { Account, Category } from "@meridia/shared";

interface TransactionFilterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  accounts: Account[];
  categories: Category[];
  hasFilters: boolean;
  resetFilters: () => void;
}

const TransactionFilter = ({
  filters,
  setFilters,
  accounts,
  categories,
  hasFilters,
  resetFilters,
}: TransactionFilterProps) => {
  return (
    <Card sx={{ mb: 2, boxShadow: SHADOW }}>
      <CardContent sx={{ pt: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ alignItems: "flex-start" }}>
          <Box sx={{ width: { xs: "100%", md: 150 } }}>
            <DesktopDatePicker
              label="Desde"
              value={filters.from ? parseISO(filters.from) : null}
              onChange={(newDate) => {
                const dateStr = newDate
                  ? dateFnsFormat(newDate, "yyyy-MM-dd")
                  : "";
                setFilters((f) => ({ ...f, from: dateStr }));
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", md: 150 } }}>
            <DesktopDatePicker
              label="Hasta"
              value={filters.to ? parseISO(filters.to) : null}
              onChange={(newDate) => {
                const dateStr = newDate
                  ? dateFnsFormat(newDate, "yyyy-MM-dd")
                  : "";
                setFilters((f) => ({ ...f, to: dateStr }));
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", md: 200 } }}>
            <TextField
              select
              label="Cuenta"
              size="small"
              fullWidth
              value={filters.accountId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, accountId: e.target.value }))
              }>
              <MenuItem value="">Todas</MenuItem>
              {accounts.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 200 } }}>
            <TextField
              select
              label="Categoría"
              size="small"
              fullWidth
              value={filters.categoryId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, categoryId: e.target.value }))
              }>
              <MenuItem value="">Todas</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 130 } }}>
            <TextField
              select
              label="Tipo"
              size="small"
              fullWidth
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  type: e.target.value as Filters["type"],
                }))
              }>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="income">Ingresos</MenuItem>
              <MenuItem value="expense">Gastos</MenuItem>
            </TextField>
          </Box>
          {hasFilters && (
            <Button
              startIcon={<ClearFiltersIcon />}
              onClick={resetFilters}
              sx={{ mt: 1.5 }}>
              Limpiar
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TransactionFilter;
