import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { NAVBAR_DARK, NAVBAR_LIGHT, SHADOW } from "@/theme/globalStyles";
import { useUiStore } from "@/stores/uiStore";
import LogoApp from "./LogoApp";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { NotificationsBell } from "@/features/notifications/components/NotificationsBell";
import SayHello from "./SayHello";
import UserMenu from "./UserMenu";

const NavbarApp = () => {
  const { data: user, isLoading } = useCurrentUser();
  const toggleDrawer = useUiStore((s) => s.toggleDrawer);
  const themeMode = useUiStore((s) => s.themeMode);

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

        <SayHello user={user} isLoading={isLoading} />
        <NotificationsBell />
        <UserMenu user={user} isLoading={isLoading} />
      </Toolbar>
    </AppBar>
  );
};

export default NavbarApp;
