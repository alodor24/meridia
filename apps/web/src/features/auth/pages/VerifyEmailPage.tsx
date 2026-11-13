import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PATHS } from "@/consts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { toApiError } from "@/services/api/errors";
import { useResendVerification } from "../hooks/useResendVerification";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

const verifyEmailRoute = getRouteApi("/(public)/verify-email");

const RESEND_COOLDOWN_SECONDS = 60;

type VerificationStatus = "idle" | "loading" | "success" | "error";

const VerifyEmailPage = () => {
  useDocumentTitle("Verificar email");

  const { token, email } = verifyEmailRoute.useSearch();
  const navigate = useNavigate();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  const verificationStarted = useRef(false);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(token ? "loading" : "idle");
  const [verificationError, setVerificationError] = useState("");
  const [resendEmail, setResendEmail] = useState(email ?? "");
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [cooldown, setCooldown] = useState(email ? RESEND_COOLDOWN_SECONDS : 0);

  useEffect(() => {
    if (!token || verificationStarted.current) return;

    verificationStarted.current = true;
    verifyEmail.mutate(
      { token },
      {
        onSuccess: () => setVerificationStatus("success"),
        onError: (error) => {
          setVerificationError(toApiError(error).message);
          setVerificationStatus("error");
        },
      },
    );
  }, [token, verifyEmail]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(
      () => setCooldown((current) => Math.max(0, current - 1)),
      1000,
    );

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = resendEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setResendError("Ingresa tu email");
      return;
    }

    setResendError("");
    setResendMessage("");

    try {
      const result = await resendVerification.mutateAsync({
        email: normalizedEmail,
      });
      setResendMessage(result.message);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setResendError(toApiError(error).message);
    }
  };

  const title = token
    ? verificationStatus === "success"
      ? "Cuenta verificada"
      : verificationStatus === "error"
        ? "No pudimos verificar tu cuenta"
        : "Verificando tu cuenta"
    : "Verifica tu correo";

  const subtitle = token
    ? "Estamos confirmando tu email."
    : "Necesitamos confirmar tu email para activar tu cuenta.";

  const showResendForm = !token || verificationStatus === "error";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {verificationStatus === "loading" ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 2,
          }}>
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">
            Verificando tu cuenta...
          </Typography>
        </Box>
      ) : null}

      {verificationStatus === "success" ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Tu cuenta fue verificada correctamente. Ya puedes iniciar sesión.
        </Alert>
      ) : null}

      {verificationStatus === "error" ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {verificationError}
        </Alert>
      ) : null}

      {!token ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {email
            ? `Tu cuenta aún no está verificada. Revisa el correo de ${email} o solicita un nuevo enlace.`
            : "Tu cuenta aún no está verificada. Ingresa tu email para recibir un nuevo enlace."}
        </Alert>
      ) : null}

      {showResendForm ? (
        <Box component="form" onSubmit={handleResend} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            autoComplete="email"
            value={resendEmail}
            onChange={(event) => setResendEmail(event.target.value)}
            error={Boolean(resendError)}
            helperText={resendError || " "}
          />

          {resendMessage ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resendMessage}
            </Alert>
          ) : null}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            loading={resendVerification.isPending}
            loadingPosition="start"
            disabled={cooldown > 0}
            sx={{
              mt: 1,
              background: (theme) =>
                `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
            }}>
            {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar correo"}
          </Button>
        </Box>
      ) : null}

      <Button
        variant="text"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => void navigate({ to: PATHS.LOGIN })}>
        Volver a iniciar sesión
      </Button>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
