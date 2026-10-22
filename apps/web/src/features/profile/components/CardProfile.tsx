import { SHADOW } from "@/theme/globalStyles";
import { formatDate, getCurrencySymbol } from "@/utils/format";
import { getCountryName } from "@/utils/labels";
import { User } from "@meridia/shared";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import {
  LocationPin as LocationPinIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import ReactCountryFlag from "react-country-flag";

interface CardProfileProps {
  user: User;
}

const CardProfile = ({ user }: CardProfileProps) => {
  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={user.avatar ?? undefined}
            alt={`Avatar de ${user.name}`}
            sx={{
              width: { xs: 48, md: 90 },
              height: { xs: 48, md: 90 },
              bgcolor: "primary.main",
              fontSize: { xs: 18, md: 34 },
              color: "primary.contrastText",
            }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, fontSize: { xs: 20, md: 26 }, mb: 0.7 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: { xs: 1, md: 9 },
          }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}>
              <LocationPinIcon fontSize="small" />
              País
            </Typography>

            <Box>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 300, ml: 3.5 }}>
                {getCountryName(user.country)}
              </Typography>
              <ReactCountryFlag
                countryCode={user.country}
                svg
                style={{
                  width: "26px",
                  height: "26px",
                  marginLeft: "0.5em",
                  borderRadius: "100%",
                }}
                title={user.country}
              />
            </Box>
          </Box>

          <Divider orientation="vertical" variant="middle" flexItem />

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}>
              <AccountBalanceWalletIcon fontSize="small" />
              Moneda
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 300, ml: 3.5 }}>
              {getCurrencySymbol(user.currency)}
            </Typography>
          </Box>

          <Divider orientation="vertical" variant="middle" flexItem />

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}>
              <CalendarMonthIcon fontSize="small" />
              Miembro desde
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 300, ml: 3.5 }}>
              {formatDate(user.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardProfile;
