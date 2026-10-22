import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useField } from "formik";
import categoryIcons from "@/utils/categoryIcons";

interface CategoryIconPickerProps {
  name: string;
  label: string;
}

const CategoryIconPicker = ({ name, label }: CategoryIconPickerProps) => {
  const [field, meta, helpers] = useField<string>(name);
  const showError = meta.touched && Boolean(meta.error);

  const [colorField] = useField<string>("color");

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 0.2,
          flexWrap: "wrap",
          justifyContent: "center",
          maxHeight: 120,
          overflowY: "auto",
        }}>
        {categoryIcons.map((icon) => {
          const selected = field.value === icon.name;
          const Icon = icon.component;

          return (
            <IconButton
              key={icon.name}
              aria-label={icon.name}
              disabled={selected}
              onClick={() => helpers.setValue(icon.name)}>
              <Icon sx={{ color: selected ? colorField.value : "action" }} />
            </IconButton>
          );
        })}
      </Box>

      {showError && <FormHelperText error>{meta.error}</FormHelperText>}
    </Box>
  );
};

export default CategoryIconPicker;
