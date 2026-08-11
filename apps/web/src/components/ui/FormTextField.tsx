import { TextField, type TextFieldProps } from '@mui/material';
import { useField } from 'formik';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: string;
}

export function FormTextField({ name, ...props }: FormTextFieldProps) {
  const [field, meta] = useField<string>(name);
  const showError = meta.touched && Boolean(meta.error);

  return (
    <TextField
      {...props}
      {...field}
      fullWidth
      margin="normal"
      error={showError}
      helperText={showError ? meta.error : props.helperText}
    />
  );
}
