import { SHADOW } from "@/theme/globalStyles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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
