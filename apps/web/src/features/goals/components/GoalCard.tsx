import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import type { Goal } from "@meridia/shared";
import { SHADOW } from "@/theme/globalStyles";
import categoryIcons from "@/utils/categoryIcons";
import { formatCurrency, formatDate } from "@/utils/format";
import { getGoalProgress, getGoalRemainingAmount } from "../utils/goals";

const goalIconComponents = Object.fromEntries(
  categoryIcons.map((icon) => [icon.name, icon.component]),
) as Record<string, typeof SavingsIcon>;

interface GoalCardProps {
  goal: Goal;
  canContribute: boolean;
  onContribute: (goal: Goal) => void;
  onRelease: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

export const GoalCard = ({
  goal,
  canContribute,
  onContribute,
  onRelease,
  onEdit,
  onDelete,
}: GoalCardProps) => {
  const Icon =
    (goal.icon ? goalIconComponents[goal.icon] : undefined) ?? SavingsIcon;
  const progress = getGoalProgress(goal);
  const isActive = goal.status === "active";

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: SHADOW,
        borderTop: 4,
        borderColor: goal.color,
      }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: goal.color,
              color: "#fff",
              flexShrink: 0,
            }}>
            <Icon />
          </Box>

          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {goal.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {goal.accountName}
              {goal.targetDate
                ? ` · ${formatDate(goal.targetDate, "dd/MM/yyyy")}`
                : ""}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={isActive ? "Activa" : "Completada"}
            color={isActive ? "primary" : "success"}
            variant={isActive ? "outlined" : "filled"}
          />
        </Stack>

        {goal.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: 40 }}>
            {goal.description}
          </Typography>
        )}

        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography variant="body2" color="text.secondary">
            {isActive ? "Reservado" : "Ahorrado"}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {progress}%
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label={`Progreso de ${goal.name}: ${progress}%`}
          sx={{
            height: 10,
            borderRadius: 5,
            my: 1,
            bgcolor: "divider",
            "& .MuiLinearProgress-bar": { bgcolor: goal.color },
          }}
        />

        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {formatCurrency(goal.currentAmount, goal.currency)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            de {formatCurrency(goal.targetAmount, goal.currency)}
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5 }}>
          {isActive
            ? `Faltan ${formatCurrency(getGoalRemainingAmount(goal), goal.currency)}`
            : goal.completedAt
              ? `Completada el ${formatDate(goal.completedAt)}`
              : "Completada"}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
          {isActive && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={!canContribute}
              onClick={() => onContribute(goal)}>
              Aportar
            </Button>
          )}
          {isActive && goal.currentAmount > 0 && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<RemoveCircleOutlinedIcon />}
              onClick={() => onRelease(goal)}>
              Liberar
            </Button>
          )}
          {isActive && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onEdit(goal)}>
              Editar
            </Button>
          )}
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(goal)}>
            Eliminar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
