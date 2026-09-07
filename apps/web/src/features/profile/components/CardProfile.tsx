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
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ReactCountryFlag from "react-country-flag";

interface CardProfileProps {
  user: User;
}

const CardProfile = ({ user }: CardProfileProps) => {
  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
              fontSize: 24,
              color: "primary.contrastText",
            }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <List dense>
          <ListItem>
            <ListItemText
              primary="País"
              secondary={
                <>
                  <ReactCountryFlag
                    countryCode={user.country}
                    svg
                    style={{
                      width: "1.7em",
                      height: "1.7em",
                      marginRight: "0.5em",
                    }}
                    title={user.country}
                  />
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ position: "relative", top: "2px" }}>
                    {getCountryName(user.country)}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Moneda"
              secondary={getCurrencySymbol(user.currency)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Miembro desde"
              secondary={formatDate(user.createdAt)}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default CardProfile;
