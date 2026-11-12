import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useUiStore } from "@/stores/uiStore";
import { DRAWER_COLLAPSED_WIDTH, DRAWER_WIDTH } from "@/theme/globalStyles";
import DrawerContent from "../ui/DrawerContent";
import NavbarApp from "../ui/NavbarApp";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const drawerOpen = useUiStore((s) => s.drawerOpen);
  const drawerCollapsed = useUiStore((s) => s.drawerCollapsed);
  const setDrawerOpen = useUiStore((s) => s.setDrawerOpen);
  const snackbar = useUiStore((s) => s.snackbar);
  const hideSnackbar = useUiStore((s) => s.hideSnackbar);

  const collapsed = isDesktop && drawerCollapsed;
  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <NavbarApp />

      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.standard,
            }),
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              px: collapsed ? 1.5 : 2,
              overflowX: "hidden",
              transition: theme.transitions.create(["width", "padding"], {
                duration: theme.transitions.duration.standard,
              }),
            },
          }}>
          <DrawerContent />
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              px: 2,
            },
          }}>
          <DrawerContent />
        </Drawer>
      )}

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
          pt: { xs: 10, md: 12 },
        }}>
        {children}
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
