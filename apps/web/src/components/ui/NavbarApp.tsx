import { NAVBAR_DARK, NAVBAR_LIGHT } from "@/theme/globalStyles";
import { AppBar, Avatar, Box, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "@tanstack/react-router";
import { PATHS } from "@/conts";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

const NavbarApp = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const toggleDrawer = useUiStore((s) => s.toggleDrawer);
  const themeMode = useUiStore((s) => s.themeMode);

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutUser();
    await navigate({ to: PATHS.LOGIN });
  };

  return (
    <AppBar
      position="fixed"
      elevation={5}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        backgroundColor: themeMode === "light" ? NAVBAR_LIGHT : NAVBAR_DARK,
        color: "text.primary",
        backdropFilter: "saturate(180%) blur(5px)",
      }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2, display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", flexGrow: 1, width: "fit-content", alignItems: "center", gap: "0.5rem" }}>
          <PaymentsIcon color="primary" />

          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            Meridia
          </Typography>
        </Box>

        <IconButton onClick={(e) => setProfileMenuAnchor(e.currentTarget)} sx={{ ml: 1 }} data-testid="profile-menu">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: 14,
              color: "primary.contrastText",
            }}>
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={() => setProfileMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <MenuItem component={Link} to={PATHS.PROFILE} onClick={() => setProfileMenuAnchor(null)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Mi perfil
          </MenuItem>

          <MenuItem disabled={loggingOut} onClick={handleLogout}>
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
