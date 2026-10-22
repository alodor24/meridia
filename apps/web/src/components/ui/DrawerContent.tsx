import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import InfoIcon from "@mui/icons-material/Info";
import { NAV_ITEMS, PATHS } from "@/conts";
import { useUiStore } from "@/stores/uiStore";
import { Link, useLocation } from "@tanstack/react-router";

const DrawerContent = () => {
  const { pathname } = useLocation();
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />

      <List sx={{ flexGrow: 1, pt: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}>
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <List>
        <ListItemButton onClick={toggleTheme}>
          <ListItemIcon>
            {themeMode === "light" ? (
              <DarkModeIcon fontSize="small" />
            ) : (
              <LightModeIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={themeMode === "light" ? "Modo oscuro" : "Modo claro"}
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to={PATHS.ABOUT}
          selected={pathname.startsWith(PATHS.ABOUT)}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Acerca de" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default DrawerContent;
