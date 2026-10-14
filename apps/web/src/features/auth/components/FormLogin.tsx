import { Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { Formik, Form } from "formik";
import { FormTextField } from "@/components/ui/FormTextField";
import {
  loginValidationSchema,
  type LoginFormValues,
} from "@/features/auth/validations";
import { useUiStore } from "@/stores/uiStore";
import { toApiError } from "@/services/api/errors";
import { PATHS } from "@/conts";
import useShowPassword from "../hooks/useShowPassword";
import { useLogin } from "../hooks/useLogin";

const FormLogin = () => {
  const loginUser = useLogin();
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const navigate = useNavigate();
  const { showPassword, handleClickShowPassword } = useShowPassword();

  const initialValues: LoginFormValues = { email: "", password: "" };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await loginUser.mutateAsync({
        email: values.email,
        password: values.password,
      });
      await navigate({ to: PATHS.DASHBOARD });
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={handleSubmit}>
      {() => (
        <Form>
          <FormTextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <FormTextField
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            loading={loginUser.isPending}
            loadingPosition="start"
            sx={{
              mt: 2,
              background: (theme) =>
                `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
            }}>
            Ingresar
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormLogin;
