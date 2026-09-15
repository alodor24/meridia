import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface CustomButtomProps {
  onAction?: () => void;
  children: React.ReactNode;
}

const CustomButtom = ({ onAction, children }: CustomButtomProps) => {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onAction}
      sx={{
        background: (theme) =>
          `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
        textTransform: "capitalize",
        px: 3,
      }}>
      {children}
    </Button>
  );
};

export default CustomButtom;
