import { Box } from "@mui/material";

interface AvatarProps {
  categoryColor?: string;
  categoryName?: string;
}

const Avatar = ({ categoryColor, categoryName }: AvatarProps) => {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        bgcolor: categoryColor ?? "#607d8b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 14,
        flexShrink: 0,
      }}>
      {categoryName?.charAt(0) ?? "?"}
    </Box>
  );
};

export default Avatar;
