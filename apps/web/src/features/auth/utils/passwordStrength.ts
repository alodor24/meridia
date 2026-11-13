export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 64;

export interface PasswordChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  symbol: boolean;
}

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;
export type PasswordStrengthColor = "error" | "warning" | "success";

export interface PasswordStrength {
  checks: PasswordChecks;
  satisfied: number;
  level: PasswordStrengthLevel;
  label: string;
  color: PasswordStrengthColor;
}

const LEVELS: Array<{
  label: string;
  color: PasswordStrengthColor;
}> = [
  { label: "Muy débil", color: "error" },
  { label: "Débil", color: "error" },
  { label: "Media", color: "warning" },
  { label: "Fuerte", color: "success" },
  { label: "Muy fuerte", color: "success" },
];

export const PASSWORD_REQUIREMENTS: Array<{
  key: keyof PasswordChecks;
  label: string;
}> = [
  {
    key: "length",
    label: `${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} caracteres (sin espacios)`,
  },
  { key: "lowercase", label: "Una minúscula" },
  { key: "uppercase", label: "Una mayúscula" },
  { key: "number", label: "Un número" },
  { key: "symbol", label: "Un símbolo (!@#$%)" },
];

export const getPasswordChecks = (password: string): PasswordChecks => ({
  length:
    password.replace(/\s/g, "").length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH,
  lowercase: /[a-z]/.test(password),
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  symbol: /[^A-Za-z0-9\s]/.test(password),
});

export const getPasswordStrength = (password: string): PasswordStrength => {
  const checks = getPasswordChecks(password);
  const satisfied = Object.values(checks).filter(Boolean).length;

  let level: PasswordStrengthLevel = 0;

  if (password) {
    if (!checks.length) {
      level = satisfied >= 3 ? 2 : satisfied === 2 ? 1 : 0;
    } else if (satisfied === 5) {
      level = password.length >= 16 ? 4 : 3;
    } else if (satisfied === 4) {
      level = 2;
    } else if (satisfied === 3) {
      level = 1;
    }
  }

  const meta = LEVELS[level]!;

  return {
    checks,
    satisfied,
    level,
    label: meta.label,
    color: meta.color,
  };
};
