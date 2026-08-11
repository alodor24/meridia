import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/app/dashboard', icon: <DashboardIcon /> },
  { label: 'Cuentas', to: '/app/accounts', icon: <WalletIcon /> },
  { label: 'Movimientos', to: '/app/transactions', icon: <ReceiptIcon /> },
  { label: 'Categorías', to: '/app/categories', icon: <CategoryIcon /> },
  { label: 'Perfil', to: '/app/profile', icon: <PersonIcon /> },
];

export function AppShell() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const drawerOpen = useUiStore((s) => s.drawerOpen);
  const toggleDrawer = useUiStore((s) => s.toggleDrawer);
  const setDrawerOpen = useUiStore((s) => s.setDrawerOpen);
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const snackbar = useUiStore((s) => s.snackbar);
  const hideSnackbar = useUiStore((s) => s.hideSnackbar);

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutUser();
    await navigate({ to: '/login' });
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ gap: 1 }}>
        <PaymentsIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>
          Meridia
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}
              onClick={() => !isDesktop && setDrawerOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={toggleTheme}>
          <ListItemIcon>{themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</ListItemIcon>
          <ListItemText primary={themeMode === 'light' ? 'Modo oscuro' : 'Modo claro'} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Button
        component="a"
        href="#main-content"
        sx={{
          position: 'fixed',
          top: -48,
          left: 16,
          zIndex: (t) => t.zIndex.drawer + 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          transition: 'top 0.2s ease',
          '&:focus': { top: 12 },
        }}
      >
        Saltar al contenido
      </Button>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            {NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label ?? 'Meridia'}
          </Typography>
          <Tooltip title="Cambiar tema">
            <IconButton onClick={toggleTheme} color="inherit">
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Cuenta">
            <IconButton
              onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
              sx={{ ml: 1 }}
              data-testid="profile-menu"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={() => setProfileMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MenuItem component={Link} to="/app/profile" onClick={() => setProfileMenuAnchor(null)}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Mi perfil
            </MenuItem>
            <MenuItem disabled={loggingOut} onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" id="main-content" tabIndex={-1} sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: { xs: 10, md: 12 } }}>
        <Outlet />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={hideSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
