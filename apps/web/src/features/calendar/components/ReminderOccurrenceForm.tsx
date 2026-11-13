import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { format, parseISO } from "date-fns";
import type { ReminderOccurrence } from "@meridia/shared";
import { FormTextField } from "@/components/ui/FormTextField";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { useUpdateReminderOccurrence } from "../hooks/useUpdateReminderOccurrence";
import { formatRecurrence } from "../utils/recurrence";
import { buildOccurrenceValidationSchema } from "../validations";

interface FormValues {
  title: string;
  date: string;
}

interface ReminderOccurrenceFormProps {
  occurrence: ReminderOccurrence;
  onClose: () => void;
  onSaved: () => void;
}

export const ReminderOccurrenceForm = ({
  occurrence,
  onClose,
  onSaved,
}: ReminderOccurrenceFormProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: updateOccurrence, isPending } =
    useUpdateReminderOccurrence();

  const initialValues: FormValues = {
    title: occurrence.title,
    date: occurrence.date,
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await updateOccurrence({
        reminderId: occurrence.reminderId,
        occurrenceDate: occurrence.occurrenceDate,
        payload: {
          title: values.title.trim(),
          date: values.date,
        },
      });
      showSnackbar("Recordatorio actualizado");
      onSaved();
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Formik
      key={`${occurrence.reminderId}:${occurrence.occurrenceDate}`}
      initialValues={initialValues}
      validationSchema={buildOccurrenceValidationSchema()}
      onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <DialogContent>
            {occurrence.recurrence && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}>
                Esta fecha pertenece a la serie «{occurrence.seriesTitle}» (
                {formatRecurrence(occurrence.recurrence)}).
              </Typography>
            )}

            <FormTextField
              name="title"
              label="Título"
              placeholder="Ej: Alquiler"
              autoFocus
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
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} disabled={isPending} color="inherit">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={isPending}
              loadingPosition="start">
              Guardar
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default ReminderOccurrenceForm;
