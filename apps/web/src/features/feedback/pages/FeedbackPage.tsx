import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { PageHeader } from "@/components/ui/PageHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SHADOW } from "@/theme/globalStyles";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import FeedbackForm from "../components/FeedbackForm";

const OPTIONS_MESSAGE = [
  {
    icon: LightbulbOutlinedIcon,
    title: "Una idea",
    description: "Una función nueva o una mejora para las que ya usas.",
  },
  {
    icon: ChatBubbleOutlinedIcon,
    title: "Un comentario",
    description: "Cómo fue tu experiencia o qué te resultó difícil.",
  },
  {
    icon: RocketLaunchOutlinedIcon,
    title: "Un caso de uso",
    description:
      "Una necesidad concreta que Meridia podría ayudarte a resolver.",
  },
  {
    icon: SecurityIcon,
    title: "Un problema de seguridad",
    description:
      "Reporta cualquier vulnerabilidad o problema de seguridad que encuentres.",
  },
  {
    icon: ThumbUpAltIcon,
    title: "Un Testimonio",
    description: "Comparte tu experiencia de como Meridia te ha ayudado.",
  },
];

const FeedbackPage = () => {
  useDocumentTitle("Sugerencias");
  const { data: user } = useCurrentUser();
  const initial = user?.name.trim().charAt(0).toUpperCase();

  return (
    <>
      <PageHeader
        title="Sugerencias"
        subtitle="Ayúdame a brindarte una mejor experiencia."
      />

      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ boxShadow: SHADOW }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2, alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "secondary.main",
                    color: "primary.contrastText",
                  }}>
                  <ChatBubbleOutlinedIcon />
                </Avatar>
                <Box>
                  <Typography
                    component="h2"
                    variant="h6"
                    sx={{ fontWeight: 700 }}>
                    Comparte tu opinión
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tu mensaje llega directamente al desarrollador.
                  </Typography>
                </Box>
              </Stack>

              <FeedbackForm />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Card sx={{ boxShadow: SHADOW }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Tu mensaje viaja con contexto
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ mt: 2, alignItems: "center" }}>
                  <Avatar
                    src={user?.avatar ?? undefined}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}>
                    {initial || <PersonIcon />}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        background: (theme) => theme.palette.primary.main,
                        backgroundImage: (theme) =>
                          `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 90%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                      noWrap>
                      {user?.name ?? "Tu cuenta"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {user?.email ?? ""}
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}>
                  Son incluídos estos datos en el mensaje para brindarte una
                  mejor experiencia y poder contactarte si es necesario. Tu
                  información no será compartida con terceros.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: SHADOW }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Puedes enviar
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {OPTIONS_MESSAGE.map(({ icon: Icon, title, description }) => (
                    <Stack
                      key={title}
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "flex-start" }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "background.default",
                        }}>
                        <Icon color="primary" fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Alert severity="info" icon={<LockOutlinedIcon />}>
              Tu nombre, email y foto de perfil solo se usan para gestionar este
              mensaje.
            </Alert>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default FeedbackPage;
