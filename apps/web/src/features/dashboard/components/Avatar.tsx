import Box from "@mui/material/Box";

interface AvatarProps {
  icon: React.ReactNode;
  color?: string;
}

const Avatar = ({ icon, color }: AvatarProps) => {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        bgcolor: color ?? "#607d8b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 14,
        flexShrink: 0,
      }}>
      {icon}
    </Box>
  );
};

export default Avatar;
