import { SHADOW } from "@/theme/globalStyles";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface CategoryCardProps {
  icon: React.ReactNode;
  total: number;
  subtitle: string;
  color: string;
}

const CategoryCard = ({ icon, total, subtitle, color }: CategoryCardProps) => {
  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: color,
              p: 1.5,
              borderRadius: 10,
              bgcolor: "background.default",
            }}>
            {icon}
          </Box>
          <Box>
            <Typography component="h3" variant="h5" sx={{ fontWeight: 800 }}>
              {total}
            </Typography>
            <Typography>{subtitle}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
