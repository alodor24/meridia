import { Box, Drawer, Snackbar, Alert } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "@tanstack/react-router";
import { useUiStore } from "@/stores/uiStore";
import { DRAWER_WIDTH } from "@/theme/globalStyles";
import DrawerContent from "../ui/DrawerContent";
import NavbarApp from "../ui/NavbarApp";

const PrivateLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const drawerOpen = useUiStore((s) => s.drawerOpen);
  const setDrawerOpen = useUiStore((s) => s.setDrawerOpen);
  const snackbar = useUiStore((s) => s.snackbar);
  const hideSnackbar = useUiStore((s) => s.hideSnackbar);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <NavbarApp />

      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}>
          <DrawerContent />
        </Drawer>
      ) : (
        <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <DrawerContent />
        </Drawer>
      )}

      <Box component="main" id="main-content" tabIndex={-1} sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: { xs: 10, md: 12 } }}>
        <Outlet />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert
          onClose={hideSnackbar}
          variant="filled"
          severity={snackbar.severity}
          sx={{ width: "100%", color: "primary.contrastText" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrivateLayout;
