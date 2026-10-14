import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { NAVBAR_DARK, NAVBAR_LIGHT, SHADOW } from "@/theme/globalStyles";
import { Link } from "@tanstack/react-router";
import { PATHS } from "@/conts";
import { useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import LogoApp from "./LogoApp";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";

const NavbarApp = () => {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const toggleDrawer = useUiStore((s) => s.toggleDrawer);
  const themeMode = useUiStore((s) => s.themeMode);

  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    logout.mutate();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        backgroundColor: themeMode === "light" ? NAVBAR_LIGHT : NAVBAR_DARK,
        color: "text.primary",
        backdropFilter: "saturate(180%) blur(5px)",
        boxShadow: SHADOW,
      }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleDrawer}
          sx={{ mr: 2, display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            width: "fit-content",
            alignItems: "center",
            py: 1,
          }}>
          <LogoApp />
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 600, fontSize: 13 }}>
            Hola,
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{
              ml: 0.5,
              fontWeight: 600,
              fontSize: 13,
              background: (theme) => theme.palette.primary.main,
              backgroundImage: (theme) =>
                `linear-gradient(to right, ${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            {user?.name}
          </Typography>
        </Box>

        <IconButton
          onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
          sx={{ ml: 1 }}
          data-testid="profile-menu">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "secondary.main",
              fontSize: 14,
              color: "primary.contrastText",
              fontWeight: 700,
            }}>
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={() => setProfileMenuAnchor(null)}>
          <MenuItem
            component={Link}
            to={PATHS.PROFILE}
            onClick={() => setProfileMenuAnchor(null)}
            sx={{ mx: 1, borderRadius: 1, width: 200 }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Mi perfil
          </MenuItem>

          <MenuItem
            disabled={logout.isPending}
            onClick={handleLogout}
            sx={{ mx: 1, borderRadius: 1, width: 200 }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarApp;
