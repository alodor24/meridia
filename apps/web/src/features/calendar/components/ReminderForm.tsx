import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { format, parseISO } from "date-fns";
import type { ReminderOccurrence } from "@meridia/shared";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextField } from "@/components/ui/FormTextField";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { useCreateReminder } from "../hooks/useCreateReminder";
import { useUpdateReminder } from "../hooks/useUpdateReminder";
import type { ReminderFormValues } from "../types";
import {
  describeRecurrence,
  RECURRENCE_UNIT_OPTIONS,
} from "../utils/recurrence";
import { buildReminderValidationSchema } from "../validations";

interface ReminderFormProps {
  occurrence: ReminderOccurrence | null;
  defaultDate: string;
  onClose: () => void;
  onSaved: () => void;
}

export const ReminderForm = ({
  occurrence,
  defaultDate,
  onClose,
  onSaved,
}: ReminderFormProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: createReminder, isPending: isCreating } =
    useCreateReminder();
  const { mutateAsync: updateReminder, isPending: isUpdating } =
    useUpdateReminder();

  const initialValues: ReminderFormValues = occurrence
    ? {
        title: occurrence.seriesTitle,
        date: occurrence.seriesStartDate,
        repeat: Boolean(occurrence.recurrence),
        unit: occurrence.recurrence?.unit ?? "month",
        interval: String(occurrence.recurrence?.interval ?? 1),
        endDate: occurrence.recurrence?.endDate ?? "",
      }
    : {
        title: "",
        date: defaultDate,
        repeat: false,
        unit: "month",
        interval: "1",
        endDate: "",
      };

  const handleSubmit = async (values: ReminderFormValues) => {
    const recurrence = values.repeat
      ? {
          unit: values.unit,
          interval: Number(values.interval),
          endDate: values.endDate || null,
        }
      : null;

    try {
      if (occurrence) {
        await updateReminder({
          id: occurrence.reminderId,
          payload: {
            title: values.title.trim(),
            date: values.date,
            recurrence,
          },
        });
        showSnackbar("Recordatorio actualizado");
        onSaved();
        return;
      }

      await createReminder({
        title: values.title.trim(),
        date: values.date,
        recurrence,
      });
      showSnackbar("Recordatorio creado");
      onSaved();
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Formik
      key={occurrence?.reminderId ?? `new:${defaultDate}`}
      initialValues={initialValues}
      validationSchema={buildReminderValidationSchema()}
      onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => {
        const interval = Number(values.interval);

        return (
          <Form>
            <DialogContent>
              <FormTextField
                name="title"
                label="Título"
                placeholder="Ej: Alquiler"
              />

              <DesktopDatePicker
                label="Fecha"
                value={values.date ? parseISO(values.date) : null}
                onChange={(newDate) =>
                  void setFieldValue(
                    "date",
                    newDate ? format(newDate, "yyyy-MM-dd") : "",
                  )
                }
                slotProps={{
                  textField: { fullWidth: true, margin: "normal" },
                }}
              />

              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Switch
                    checked={values.repeat}
                    onChange={(_, checked) =>
                      void setFieldValue("repeat", checked)
                    }
                  />
                }
                label="Repetir"
              />

              {values.repeat && (
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: "flex-start" }}>
                    <FormTextField
                      name="interval"
                      label="Cada"
                      type="number"
                      slotProps={{
                        htmlInput: { min: 1, max: 999, step: 1 },
                      }}
                      sx={{ flex: 1 }}
                    />
                    <FormSelect
                      name="unit"
                      label="Frecuencia"
                      options={[...RECURRENCE_UNIT_OPTIONS]}
                      sx={{ flex: 1 }}
                    />
                  </Stack>

                  <DesktopDatePicker
                    label="Hasta (opcional)"
                    value={values.endDate ? parseISO(values.endDate) : null}
                    minDate={values.date ? parseISO(values.date) : undefined}
                    onChange={(newDate) =>
                      void setFieldValue(
                        "endDate",
                        newDate ? format(newDate, "yyyy-MM-dd") : "",
                      )
                    }
                    slotProps={{
                      field: {
                        clearable: true,
                        onClear: () => void setFieldValue("endDate", ""),
                      },
                      textField: { fullWidth: true, margin: "normal" },
                    }}
                  />

                  <Box
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      bgcolor: "action.hover",
                    }}>
                    <Typography variant="body2" color="text.secondary">
                      {describeRecurrence(
                        values.date,
                        Number.isFinite(interval) && interval > 0
                          ? {
                              unit: values.unit,
                              interval,
                              endDate: values.endDate || null,
                            }
                          : null,
                      )}
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={onClose}
                disabled={isCreating || isUpdating}
                color="inherit">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                loading={isCreating || isUpdating}
                loadingPosition="start">
                Guardar
              </Button>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ReminderForm;
