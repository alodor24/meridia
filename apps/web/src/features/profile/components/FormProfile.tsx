import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import { profileValidationSchema } from "../validations";
import { FormTextField } from "@/components/ui/FormTextField";
import { User } from "@meridia/shared";
import SaveIcon from "@mui/icons-material/Save";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { SHADOW } from "@/theme/globalStyles";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";

interface FormProfileProps {
  user: User;
}

const FormProfile = ({ user }: FormProfileProps) => {
  const updateProfile = useUpdateProfile();
  const showSnackbar = useUiStore((s) => s.showSnackbar);

  const handleSubmit = async (values: { name: string }) => {
    try {
      await updateProfile.mutateAsync({ name: values.name });
      showSnackbar("Perfil actualizado");
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent sx={{ p: 4 }}>
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
                disabled={updateProfile.isPending || values.name === user.name}
                sx={{ mt: 1 }}>
                {updateProfile.isPending ? "Guardando…" : "Guardar cambios"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default FormProfile;
