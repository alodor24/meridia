import { Button, Card, CardContent, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { profileValidationSchema } from "../validations";
import { FormTextField } from "@/components/ui/FormTextField";
import { User } from "@meridia/shared";
import SaveIcon from "@mui/icons-material/Save";
import { updateProfile } from "@/features/auth/services/api";
import { toApiError } from "@/services/api/errors";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { useState } from "react";
import { SHADOW } from "@/theme/globalStyles";

interface FormProfileProps {
  user: User;
}

const FormProfile = ({ user }: FormProfileProps) => {
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: { name: string }) => {
    setSubmitting(true);
    try {
      await updateProfile(values.name);
      await refreshProfile();
      showSnackbar("Perfil actualizado");
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Actualizar nombre
        </Typography>
        <Formik
          initialValues={{ name: user.name }}
          validationSchema={profileValidationSchema}
          onSubmit={handleSubmit}>
          {({ values }) => (
            <Form>
              <FormTextField name="name" label="Nombre" />
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={submitting || values.name === user.name}
                sx={{ mt: 1 }}>
                {submitting ? "Guardando…" : "Guardar cambios"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default FormProfile;
