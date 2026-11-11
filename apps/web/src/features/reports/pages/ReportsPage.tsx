import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { PageHeader } from "@/components/ui/PageHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SHADOW } from "@/theme/globalStyles";
import ReportFilters from "../components/ReportFilters";
import ReportPeriodSelector from "../components/ReportPeriodSelector";
import useReports from "../hooks/useReports";

const ReportsPage = () => {
  useDocumentTitle("Reportes");
  const {
    selection,
    yearOptions,
    accounts,
    categories,
    isRangeInvalid,
    isBusy,
    pendingFormat,
    updateSelection,
    updateFilters,
    handleViewPdf,
    handleDownloadCsv,
  } = useReports();

  return (
    <>
      <PageHeader
        title="Reportes"
        subtitle="Genera tus reportes de movimientos."
      />

      <Card sx={{ boxShadow: SHADOW }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Período
              </Typography>
              <ReportPeriodSelector
                selection={selection}
                yearOptions={yearOptions}
                onChange={updateSelection}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Filtros
              </Typography>
              <ReportFilters
                filters={selection.filters}
                accounts={accounts}
                categories={categories}
                onChange={updateFilters}
              />
            </Box>

            {isRangeInvalid && (
              <Alert severity="warning">
                La fecha desde no puede ser mayor que la fecha hasta.
              </Alert>
            )}

            <Alert severity="info">
              El PDF se abre en una nueva pestaña e incluye gráficos. El CSV
              descarga el detalle de los movimientos.
            </Alert>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                disabled={isBusy}
                startIcon={
                  pendingFormat === "pdf" ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PictureAsPdfIcon />
                  )
                }
                onClick={handleViewPdf}>
                Ver PDF
              </Button>

              <Button
                variant="outlined"
                disabled={isBusy}
                startIcon={
                  pendingFormat === "csv" ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={handleDownloadCsv}>
                Descargar CSV
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default ReportsPage;
