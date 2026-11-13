import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { Form, Formik } from "formik";
import { FormTextField } from "@/components/ui/FormTextField";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  forgotPasswordValidationSchema,
  type ForgotPasswordFormValues,
} from "../validations";

const FormForgotPassword = () => {
  const forgotPassword = useForgotPassword();
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const [successMessage, setSuccessMessage] = useState("");

  const initialValues: ForgotPasswordFormValues = { email: "" };

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const result = await forgotPassword.mutateAsync({
        email: values.email.trim().toLowerCase(),
      });
      setSuccessMessage(result.message);
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  if (successMessage) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        {successMessage}
      </Alert>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordValidationSchema}
      onSubmit={handleSubmit}>
      {() => (
        <Form>
          <FormTextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            loading={forgotPassword.isPending}
            loadingPosition="start"
            sx={{
              mt: 2,
              background: (theme) =>
                `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
            }}>
            Enviar enlace
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormForgotPassword;
