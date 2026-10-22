import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import { Link } from "@tanstack/react-router";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CardLinkProps {
  label: string;
  path: string;
}

const CardLink = ({ label, path }: CardLinkProps) => {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        justifyContent: "center",
      }}>
      <MuiLink
        sx={{
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
        component={Link}
        to={path}
        variant="body2"
        underline="none">
        {label} <ChevronRightIcon />
      </MuiLink>
    </Box>
  );
};

export default CardLink;
