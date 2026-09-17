import ActionTable, { ActionProps } from "@/components/ui/ActionTable";
import { Category } from "@meridia/shared";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { SHADOW } from "@/theme/globalStyles";

interface CategoryTableProps {
  categories: Category[];
  title: string;
  actions: {
    onClickEditar: (data: Category) => void;
    onClickEliminar: (data: Category) => void;
  };
}

const CategoryTable = ({ categories, title, actions }: CategoryTableProps) => {
  const optionButtons: ActionProps<Category>[] = [
    {
      label: "Editar categoría",
      icon: EditIcon,
      color: "info" as const,
      onClick: (category) => actions.onClickEditar(category),
    },
    {
      label: "Eliminar categoría",
      icon: DeleteIcon,
      color: "error" as const,
      onClick: (category) => actions.onClickEliminar(category),
    },
  ];

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Stack>
        {categories.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 2, textAlign: "center" }}>
            Sin categorías.
          </Typography>
        ) : (
          <Box sx={{ overflowX: "auto", maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: category.color,
                            fontSize: 12,
                            color: "primary.contrastText",
                          }}>
                          {category.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body1">{category.name}</Typography>
                      </Stack>
                    </TableCell>
                    <ActionTable data={category} actions={optionButtons} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryTable;
