import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

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
