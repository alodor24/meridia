import Grid from "@mui/material/Grid";
import { PageHeader } from "@/components/ui/PageHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import AvatarUploader from "../components/AvatarUploader";
import CardProfile from "../components/CardProfile";
import FormProfile from "../components/FormProfile";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const ProfilePage = () => {
  useDocumentTitle("Perfil");
  const { data: user } = useCurrentUser();

  if (!user) return null;

  return (
    <>
      <PageHeader title="Perfil" subtitle="Gestiona tu información personal." />

      <Grid container spacing={2}>
        <Grid size={12}>
          <CardProfile user={user} />
        </Grid>

        <Grid size={{ md: 6 }}>
          <FormProfile user={user} />
        </Grid>

        <Grid size={{ md: 6 }}>
          <AvatarUploader user={user} />
        </Grid>
      </Grid>
    </>
  );
};

export default ProfilePage;
