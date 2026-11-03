import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { User } from "@meridia/shared";

interface SayHelloProps {
  user?: User;
  isLoading: boolean;
}

const SayHello = ({ user, isLoading }: SayHelloProps) => {
  return (
    <Box sx={{ display: { xs: "none", md: "flex" } }}>
      {!isLoading ? (
        <>
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 600, fontSize: 13 }}>
            Hola,
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{
              ml: 0.5,
              fontWeight: 600,
              fontSize: 13,
              background: (theme) => theme.palette.primary.main,
              backgroundImage: (theme) =>
                `linear-gradient(to right, ${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            {user?.name}
          </Typography>
        </>
      ) : (
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={230} />
      )}
    </Box>
  );
};

export default SayHello;
