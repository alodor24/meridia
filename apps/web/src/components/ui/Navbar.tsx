import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Link } from "@tanstack/react-router";
import { useUiStore } from "@/stores/uiStore";
import CustomTooltip from "./CustomTooltip";
import { NAV_LINKS, PATHS } from "@/conts";
import { Container } from "@mui/material";
import { NAVBAR_DARK, NAVBAR_LIGHT } from "@/styles/globalStyles";

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
        backgroundColor: themeMode === "light" ? NAVBAR_LIGHT : NAVBAR_DARK,
        color: "text.primary",
        backdropFilter: "saturate(180%) blur(5px)",
      }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", width: "fit-content" }}>
            <Link to={PATHS.HOME}>
              <Box sx={{ display: "flex", width: "fit-content", alignItems: "center", gap: "0.5rem" }}>
                <PaymentsIcon color="primary" />

                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                  Meridia
                </Typography>
              </Box>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 0, display: "flex", width: "fit-content" }}>
            <CustomTooltip title="Cambiar tema">
              <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                {themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </CustomTooltip>

            {isDesktop ? (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.to}
                    component={Link}
                    to={link.to}
                    variant="text"
                    color="inherit"
                    sx={{
                      textTransform: "capitalize",
                      letterSpacing: 0.5,
                      fontSize: 15,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": { color: "primary.main" },
                    }}>
                    {link.label}
                  </Button>
                ))}
              </Stack>
            ) : (
              <IconButton color="inherit" onClick={(e) => setMenuAnchor(e.currentTarget)} data-testid="public-nav-menu">
                <MenuIcon />
              </IconButton>
            )}

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              {NAV_LINKS.map((link) => (
                <MenuItem key={link.to} component={Link} to={link.to} onClick={() => setMenuAnchor(null)}>
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
