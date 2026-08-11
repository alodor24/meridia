const UNIT_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function expiresInToMs(expiresIn: string): number {
  const match = /^(\d+)([smhd])$/.exec(expiresIn.trim());
  if (!match) {
    throw new Error(`Expiración inválida: "${expiresIn}" (usa formato como 15m, 30d)`);
  }
  const value = Number(match[1]);
  const unit = UNIT_MS[match[2]!];
  if (Number.isNaN(value) || unit === undefined) {
    throw new Error(`Expiración inválida: "${expiresIn}"`);
  }
  return value * unit;
}
