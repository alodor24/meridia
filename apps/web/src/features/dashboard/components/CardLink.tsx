import { Box, Link as MuiLink } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";

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
