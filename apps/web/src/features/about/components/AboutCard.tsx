import { Card, CardContent } from "@mui/material";
import { SHADOW } from "@/theme/globalStyles";

interface AboutCardProps {
  children: React.ReactNode;
}

const AboutCard = ({ children }: AboutCardProps) => {
  return (
    <Card
      sx={{
        boxShadow: SHADOW,
      }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AboutCard;
