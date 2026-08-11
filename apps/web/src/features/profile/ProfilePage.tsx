import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PageHeader } from '@/components/ui/PageHeader';
import { FormTextField } from '@/components/ui/FormTextField';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { updateProfile } from '@/features/auth/api';
import { getCountryName } from '@/utils/labels';
import { formatDate } from '@/utils/format';
import { toApiError } from '@/services/api/errors';

const profileValidationSchema = Yup.object({
  name: Yup.string().trim().min(1, 'El nombre es requerido').max(80, 'Demasiado largo').required('El nombre es requerido'),
});

function ProfilePage() {
  useDocumentTitle('Perfil');
  const user = useAuthStore((s) => s.user);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (values: { name: string }) => {
    setSubmitting(true);
    try {
      await updateProfile(values.name);
      await refreshProfile();
      showSnackbar('Perfil actualizado');
    } catch (error) {
      showSnackbar(toApiError(error).message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Perfil" subtitle="Tu información personal" />

      <Stack spacing={3} maxWidth={600}>
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 24 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <List dense>
              <ListItem>
                <ListItemText primary="País" secondary={getCountryName(user.country)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Moneda" secondary={user.currency} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Miembro desde" secondary={formatDate(user.createdAt)} />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Actualizar nombre
            </Typography>
            <Formik
              initialValues={{ name: user.name }}
              validationSchema={profileValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form>
                  <FormTextField name="name" label="Nombre" />
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={submitting || values.name === user.name}
                    sx={{ mt: 1 }}
                  >
                    {submitting ? 'Guardando…' : 'Guardar cambios'}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}

export default ProfilePage;
