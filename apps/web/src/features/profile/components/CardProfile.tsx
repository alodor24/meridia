import { useMemo } from "react";
import { SHADOW } from "@/theme/globalStyles";
import { formatDate, getCurrencySymbol } from "@/utils/format";
import { getCountryName } from "@/utils/labels";
import { User } from "@meridia/shared";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReactCountryFlag from "react-country-flag";
import Stack from "@mui/material/Stack";

interface CardProfileProps {
  user: User;
}

const CardProfile = ({ user }: CardProfileProps) => {
  const USER_INFO = useMemo(
    () => [
      {
        label: "País",
        value: getCountryName(user.country),
        icon: LocationPinIcon,
        extra: (
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
        ),
      },
      {
        label: "Moneda",
        value: getCurrencySymbol(user.currency),
        icon: AccountBalanceWalletIcon,
      },
      {
        label: "Miembro desde",
        value: formatDate(user.createdAt, "d 'de' MMMM 'de' yyyy"),
        icon: CalendarMonthIcon,
      },
    ],
    [user],
  );

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent sx={{ p: 3 }}>
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
              sx={{
                fontWeight: 600,
                fontSize: { xs: 20, md: 26 },
                mb: 0.7,
                background: (theme) => theme.palette.primary.main,
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 80%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
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
          {USER_INFO.map((item, index) => {
            const Icon = item.icon;

            return (
              <>
                <Box key={index}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "flex-start" }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "background.default",
                      }}>
                      <Icon color="primary" fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.value} {item.extra}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {index < USER_INFO.length - 1 && (
                  <Divider orientation="vertical" variant="middle" flexItem />
                )}
              </>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardProfile;
