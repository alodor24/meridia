import { Stack } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import CardProfile from "../components/CardProfile";
import FormProfile from "../components/FormProfile";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const ProfilePage = () => {
  useDocumentTitle("Perfil");
  const { data: user } = useCurrentUser();

  if (!user) return null;

  return (
    <>
      <PageHeader title="Perfil" subtitle="Tu información personal." />

      <Stack spacing={3} sx={{ maxWidth: 600 }}>
        <CardProfile user={user} />
        <FormProfile user={user} />
      </Stack>
    </>
  );
};

export default ProfilePage;
