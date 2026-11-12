import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "@tanstack/react-router";
import { USER_MENU_ITEMS } from "@/consts";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { User } from "@meridia/shared";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { SHADOW } from "@/theme/globalStyles";

interface UserMenuProps {
  user?: User;
  isLoading: boolean;
}

const UserMenu = ({ user, isLoading }: UserMenuProps) => {
  const logout = useLogout();
  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    logout.mutate();
  };

  return (
    <>
      <IconButton
        onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
        sx={{ ml: 1 }}
        data-testid="profile-menu">
        {!isLoading ? (
          <Avatar
            src={user?.avatar ?? undefined}
            alt={user ? `Avatar de ${user.name}` : "Avatar"}
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
        ) : (
          <Skeleton variant="circular" width={32} height={32} />
        )}
      </IconButton>

      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={() => setProfileMenuAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              boxShadow: SHADOW,
            },
          },
        }}>
        <Box sx={{ px: 2, py: 1 }}>
          {USER_MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <MenuItem
                key={index}
                component={Link}
                to={item.to}
                onClick={() => setProfileMenuAnchor(null)}
                sx={{ borderRadius: 1, width: 200, px: 1.5, py: 1.3 }}>
                <ListItemIcon>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {item.label}
              </MenuItem>
            );
          })}

          <Divider />

          <MenuItem
            disabled={logout.isPending}
            onClick={handleLogout}
            sx={{ borderRadius: 1, width: 200, p: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default UserMenu;
