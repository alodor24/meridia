import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { NAV_ITEMS } from "@/consts";
import { useUiStore } from "@/stores/uiStore";
import { Link, useLocation } from "@tanstack/react-router";
import CustomTooltip from "./CustomTooltip";

const DrawerContent = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname } = useLocation();
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const drawerCollapsed = useUiStore((s) => s.drawerCollapsed);

  const collapsed = isDesktop && drawerCollapsed;
  const themeToggleLabel =
    themeMode === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
  const themeToggleText = themeMode === "light" ? "Modo oscuro" : "Modo claro";
  const ThemeIcon = themeMode === "light" ? DarkModeIcon : LightModeIcon;

  const itemSx = {
    justifyContent: collapsed ? "center" : "flex-start",
    px: collapsed ? 1.5 : 0,
    minHeight: 48,
  };

  const iconSx = {
    minWidth: collapsed ? 0 : 56,
    justifyContent: "center",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />

      <List
        component="nav"
        aria-label="Navegación principal"
        sx={{ flexGrow: 1, pt: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;

          const button = (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}
              aria-label={item.label}
              sx={itemSx}>
              <ListItemIcon sx={iconSx}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          );

          return collapsed ? (
            <CustomTooltip key={item.to} title={item.label} placement="right">
              {button}
            </CustomTooltip>
          ) : (
            button
          );
        })}
      </List>

      <Divider />

      <List component="nav" aria-label="Ajustes de la aplicación">
        {collapsed ? (
          <CustomTooltip title={themeToggleLabel} placement="right">
            <ListItemButton
              onClick={toggleTheme}
              aria-label={themeToggleLabel}
              sx={itemSx}>
              <ListItemIcon sx={iconSx}>
                <ThemeIcon fontSize="small" />
              </ListItemIcon>
            </ListItemButton>
          </CustomTooltip>
        ) : (
          <ListItemButton
            onClick={toggleTheme}
            aria-label={themeToggleLabel}
            sx={itemSx}>
            <ListItemIcon sx={iconSx}>
              <ThemeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={themeToggleText} />
          </ListItemButton>
        )}
      </List>
    </Box>
  );
};

export default DrawerContent;
