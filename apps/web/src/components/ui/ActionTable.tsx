import { IconButton, TableCell } from "@mui/material";
import CustomTooltip from "@/components/ui/CustomTooltip";

export interface ActionProps<T> {
  label: string;
  icon: React.ElementType;
  color?: "primary" | "secondary" | "error" | "info";
  onClick: (data: T) => void;
}

interface ActionTableProps<T> {
  data: T;
  actions: ActionProps<T>[];
}

const ActionTable = <T,>({ data, actions }: ActionTableProps<T>) => {
  return (
    <TableCell align="right">
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <CustomTooltip title={action.label} key={index}>
            <IconButton
              aria-label={action.label}
              color={action.color}
              onClick={() => action.onClick(data)}>
              <Icon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        );
      })}
    </TableCell>
  );
};

export default ActionTable;
