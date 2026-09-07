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

interface CategoryTableProps {
  categories: Category[];
  title: string;
  actions: ActionProps<Category>[];
}

const CategoryTable = ({ categories, title, actions }: CategoryTableProps) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
                    <ActionTable data={category} actions={actions} />
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
