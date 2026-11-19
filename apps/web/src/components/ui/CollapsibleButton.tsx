import { useUiStore } from "@/stores/uiStore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import CustomTooltip from "./CustomTooltip";

const CollapsibleButton = () => {
  const collapsed = useUiStore((s) => s.drawerCollapsed);
  const toggleDrawerCollapsed = useUiStore((s) => s.toggleDrawerCollapsed);

  return (
    <CustomTooltip
      title={collapsed ? "Expandir menú" : "Contraer menú"}
      placement="bottom">
      <IconButton
        onClick={toggleDrawerCollapsed}
        aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        aria-expanded={!collapsed}
        sx={{
          display: { xs: "none", md: "inline-flex" },
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}>
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </CustomTooltip>
  );
};

export default CollapsibleButton;
