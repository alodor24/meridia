import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "@tanstack/react-router";
import { useUiStore } from "@/stores/uiStore";
import CustomTooltip from "./CustomTooltip";
import { NAV_LINKS, PATHS } from "@/conts";
import { NAVBAR_DARK, NAVBAR_LIGHT, SHADOW } from "@/theme/globalStyles";
import LogoApp from "./LogoApp";

const Navbar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const { pathname } = useLocation();

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: themeMode === "light" ? NAVBAR_LIGHT : NAVBAR_DARK,
        color: "text.primary",
        backdropFilter: "saturate(180%) blur(5px)",
        boxShadow: SHADOW,
      }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", width: "fit-content" }}>
            <Link to={PATHS.HOME}>
              <Box sx={{ py: 0.5 }}>
                <LogoApp />
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
                {NAV_LINKS.map((link) => {
                  const active = pathname.startsWith(link.to);

                  return (
                    <Button
                      key={link.to}
                      component={Link}
                      to={link.to}
                      variant="text"
                      color={active ? "secondary" : "inherit"}
                      sx={{
                        textTransform: "capitalize",
                        letterSpacing: 0.5,
                        fontSize: 15,
                        transition: "all 0.3s ease-in-out",
                        "&:hover": { color: "secondary.main" },
                      }}>
                      {link.label}
                    </Button>
                  );
                })}
              </Stack>
            ) : (
              <IconButton
                color="inherit"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                data-testid="public-nav-menu">
                <MenuIcon />
              </IconButton>
            )}

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}>
              {NAV_LINKS.map((link) => (
                <MenuItem
                  key={link.to}
                  component={Link}
                  selected={pathname.startsWith(link.to)}
                  to={link.to}
                  onClick={() => setMenuAnchor(null)}>
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
