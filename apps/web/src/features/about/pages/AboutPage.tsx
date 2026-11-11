import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import CodeIcon from "@mui/icons-material/Code";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { PageHeader } from "@/components/ui/PageHeader";
import AboutCard from "../components/AboutCard";
import LogoApp from "@/components/ui/LogoApp";
import NodeLogo from "@/assets/images/nodejs-icon.svg";
import ReactLogo from "@/assets/images/reactjs-icon.svg";
import PostgreLogo from "@/assets/images/postgresql-icon.svg";

const VERSION_APP = "1.0.0";
const DEV_WEBSITE_URL = "https://alodor.vercel.app/";
const LOGOS_APPS = [
  {
    label: "React",
    image: ReactLogo,
  },
  {
    label: "Node.js",
    image: NodeLogo,
  },
  {
    label: "PostgreSQL",
    image: PostgreLogo,
  },
];

const AboutPage = () => {
  useDocumentTitle("Acerca de");
  return (
    <>
      <PageHeader
        title="Acerca de"
        subtitle="Conoce más sobre Meridia y su desarrollo."
      />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <AboutCard>
            <Box sx={{ mt: -1, ml: -1 }}>
              <LogoApp width={220} />
            </Box>
            <Typography
              component="h3"
              variant="h5"
              sx={{
                px: 1,
                fontWeight: 700,
                background: (theme) => theme.palette.primary.main,
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 30%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              Tus finanzas, bajo control.
            </Typography>
            <Typography sx={{ mt: 2, px: 1, width: { md: "65%", lg: "40%" } }}>
              Meridia es una aplicación diseñada para ayudarte a gestionar de
              forma sencilla, segura y eficiente, tus finanzas personales.
            </Typography>
            <Chip
              label={`Versión ${VERSION_APP}`}
              variant="outlined"
              color="primary"
              sx={{ mt: 2, ml: 1, fontWeight: 700 }}
            />
          </AboutCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AboutCard>
            <Box sx={{ p: 1 }}>
              <Box sx={{ mb: 4, display: "flex", gap: 3 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "background.default",
                  }}>
                  <PersonIcon color="primary" fontSize="large" />
                </Avatar>
                <Box>
                  <Typography
                    component="h3"
                    variant="h6"
                    sx={{ fontWeight: 700 }}>
                    Desarrollador
                  </Typography>
                  <Typography component="h3" variant="h6">
                    José Alejandro Méndez Sánchez
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 400 }}>
                    Ingeniero de Software
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ mb: 4, width: { lg: "80%" } }}>
                Apasionado por crear soluciones útiles que simplifiquen la vida
                cotidiana a través de la tecnología.
              </Typography>
              <Link
                sx={{
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  width: "fit-content",
                }}
                href={DEV_WEBSITE_URL}
                target="_blank"
                variant="body2"
                underline="none">
                Visitar sitio web <OpenInNewIcon fontSize="small" />
              </Link>
            </Box>
          </AboutCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AboutCard>
            <Box sx={{ p: 1 }}>
              <Box
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "background.default",
                  }}>
                  <CodeIcon color="primary" fontSize="large" />
                </Avatar>
                <Typography
                  component="h3"
                  variant="h6"
                  sx={{ fontWeight: 700 }}>
                  Tecnologías
                </Typography>
              </Box>
              <Typography sx={{ mb: 2, width: { lg: "80%" } }}>
                Meridia está construida con tecnologías modernas para ofrecerte
                una experiencia rápida, segura y confiable.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {LOGOS_APPS.map((logo, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 80,
                      height: 80,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}>
                    <img src={logo.image} width={40} />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, fontSize: 11 }}>
                      {logo.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </AboutCard>
        </Grid>
      </Grid>
    </>
  );
};

export default AboutPage;
