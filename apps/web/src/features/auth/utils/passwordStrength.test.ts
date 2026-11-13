import { describe, expect, it } from "vitest";
import { getPasswordChecks, getPasswordStrength } from "./passwordStrength";

describe("getPasswordChecks", () => {
  it("detecta cada requisito", () => {
    expect(getPasswordChecks("Meridia2026!Segura")).toEqual({
      length: true,
      lowercase: true,
      uppercase: true,
      number: true,
      symbol: true,
    });
  });

  it("detecta requisitos faltantes", () => {
    expect(getPasswordChecks("meridia2026segura").uppercase).toBe(false);
    expect(getPasswordChecks("MERIDIA2026SEGURA").lowercase).toBe(false);
    expect(getPasswordChecks("Meridia!Segura").number).toBe(false);
    expect(getPasswordChecks("Meridia2026Segura").symbol).toBe(false);
    expect(getPasswordChecks("Corta1!").length).toBe(false);
    expect(getPasswordChecks("Meridia1!    ").length).toBe(false);
  });
});

describe("getPasswordStrength", () => {
  it("marca una contraseña vacía como muy débil", () => {
    const strength = getPasswordStrength("");
    expect(strength.level).toBe(0);
    expect(strength.label).toBe("Muy débil");
  });

  it("marca fuerte una contraseña que cumple la política", () => {
    const strength = getPasswordStrength("Meridia2026!");
    expect(strength.level).toBe(3);
    expect(strength.label).toBe("Fuerte");
  });

  it("marca muy fuerte desde 16 caracteres", () => {
    const strength = getPasswordStrength("Meridia2026!Segura");
    expect(strength.level).toBe(4);
    expect(strength.label).toBe("Muy fuerte");
  });

  it("no sube de media si falta el largo mínimo", () => {
    const strength = getPasswordStrength("Meridia2026");
    expect(strength.checks.length).toBe(false);
    expect(strength.level).toBe(2);
  });

  it("no sube de media si falta una clase de caracteres", () => {
    const strength = getPasswordStrength("meridia2026!segura");
    expect(strength.level).toBe(2);
  });
});
