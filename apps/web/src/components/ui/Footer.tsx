import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 4, px: 2, backgroundColor: "#000" }}>
      <Typography sx={{ color: "#e0e0e0", opacity: 0.5 }} align="center">
        {new Date().getFullYear()} Meridia - Finanzas Personales | Desarrollado con
        <FavoriteIcon sx={{ fontSize: "1.4rem", pt: 1, color: "#2196f3" }} />
        por Alodor.
      </Typography>
    </Box>
  );
};

export default Footer;
