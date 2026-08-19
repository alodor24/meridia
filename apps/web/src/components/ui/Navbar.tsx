import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Link } from "@tanstack/react-router";
import { useUiStore } from "@/stores/uiStore";

const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Iniciar sesión", to: "/login" },
  { label: "Crear cuenta", to: "/register" },
];

// TODO: Tooltip with arrow and custom styles
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip describeChild {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="sticky"
      elevation={5}
      sx={{
        backgroundColor: themeMode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(14, 19, 26, 0.9)",
        color: "text.primary",
        backdropFilter: "saturate(180%) blur(5px)",
      }}>
      <Toolbar>
        <Button
          component={Link}
          to="/"
          sx={{
            textTransform: "none",
            color: "inherit",
            gap: 1,
            mr: 2,
            minWidth: 0,
          }}>
          <PaymentsIcon color="primary" />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Meridia
          </Typography>
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {isDesktop ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                color="inherit"
                variant={link.to === "/register" ? "contained" : "text"}>
                {link.label}
              </Button>
            ))}
          </Stack>
        ) : (
          <IconButton color="inherit" onClick={(e) => setMenuAnchor(e.currentTarget)} data-testid="public-nav-menu">
            <MenuIcon />
          </IconButton>
        )}

        {/*// TODO: Move this component to global component */}
        <BootstrapTooltip title="Cambiar tema">
          <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
            {themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </BootstrapTooltip>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          {NAV_LINKS.map((link) => (
            <MenuItem key={link.to} component={Link} to={link.to} onClick={() => setMenuAnchor(null)}>
              {link.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
