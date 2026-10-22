import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { tooltipClasses } from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";

interface CustomTooltipProps extends TooltipProps {
  children: React.ReactElement;
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip describeChild {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const CustomTooltip = ({ children, ...props }: CustomTooltipProps) => {
  return <BootstrapTooltip {...props}>{children}</BootstrapTooltip>;
};

export default CustomTooltip;
