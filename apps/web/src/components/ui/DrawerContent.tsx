import { NAV_ITEMS } from "@/conts";
import { useUiStore } from "@/stores/uiStore";
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link, useLocation } from "@tanstack/react-router";

const DrawerContent = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const setDrawerOpen = useUiStore((s) => s.setDrawerOpen);
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />

      <List sx={{ flexGrow: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}
              onClick={() => !isDesktop && setDrawerOpen(false)}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <List>
        <ListItemButton onClick={toggleTheme}>
          <ListItemIcon>{themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}</ListItemIcon>
          <ListItemText primary={themeMode === "light" ? "Modo oscuro" : "Modo claro"} />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default DrawerContent;
