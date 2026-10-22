import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import { useField } from "formik";

export interface SelectOption {
  value: string;
  label: string | React.ReactNode;
}

export interface FormSelectProps extends Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "select"
> {
  name: string;
  options: SelectOption[];
}

export const FormSelect = ({ name, options, ...props }: FormSelectProps) => {
  const [field, meta] = useField<string>(name);
  const showError = meta.touched && Boolean(meta.error);

  return (
    <TextField
      {...props}
      {...field}
      select
      fullWidth
      margin="normal"
      error={showError}
      helperText={showError ? meta.error : props.helperText}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
