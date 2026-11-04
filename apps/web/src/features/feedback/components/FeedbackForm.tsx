import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import { Form, Formik, type FormikHelpers } from "formik";
import { FEEDBACK_TYPE_LABELS, FEEDBACK_TYPES } from "@meridia/shared";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextField } from "@/components/ui/FormTextField";
import { useUiStore } from "@/stores/uiStore";
import { toApiError } from "@/services/api/errors";
import { feedbackValidationSchema } from "../validations";
import type { FeedbackFormValues } from "../types";
import { useCreateFeedback } from "../hooks/useCreateFeedback";

const TYPE_OPTIONS = FEEDBACK_TYPES.map((type) => ({
  value: type,
  label: FEEDBACK_TYPE_LABELS[type],
}));

const INITIAL_VALUES: FeedbackFormValues = {
  type: "suggestion",
  subject: "",
  message: "",
};

const FeedbackForm = () => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: createFeedback, isPending } = useCreateFeedback();

  const handleSubmit = async (
    values: FeedbackFormValues,
    helpers: FormikHelpers<FeedbackFormValues>,
  ) => {
    try {
      await createFeedback({
        ...values,
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      helpers.resetForm();
      showSnackbar("¡Gracias! Tu mensaje ha sido enviado.");
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={feedbackValidationSchema}
      onSubmit={handleSubmit}>
      {({ values }) => (
        <Form noValidate>
          <FormSelect
            name="type"
            label="Tipo de mensaje"
            options={TYPE_OPTIONS}
          />
          <FormTextField
            name="subject"
            label="Asunto"
            placeholder="Ej: Escribe el asunto del mensaje"
            helperText={`${values.subject.length}/120`}
          />
          <FormTextField
            name="message"
            label="Mensaje"
            placeholder="Comparteme con detalles tus opiniones o sugerencias."
            multiline
            minRows={6}
            helperText={`${values.message.length}/4000`}
          />

          <Stack sx={{ mt: 1, alignItems: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              loading={isPending}
              loadingPosition="start"
              startIcon={<SendIcon />}>
              Enviar mensaje
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default FeedbackForm;
