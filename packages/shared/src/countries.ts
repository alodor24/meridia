export interface CountryOption {
  code: string;
  name: string;
  currency: string;
}

export const DEFAULT_CURRENCY = 'USD';

export const COUNTRIES: CountryOption[] = [
  { code: 'AR', name: 'Argentina', currency: 'ARS' },
  { code: 'BO', name: 'Bolivia', currency: 'BOB' },
  { code: 'BR', name: 'Brasil', currency: 'BRL' },
  { code: 'CA', name: 'Canadá', currency: 'CAD' },
  { code: 'CL', name: 'Chile', currency: 'CLP' },
  { code: 'CO', name: 'Colombia', currency: 'COP' },
  { code: 'CR', name: 'Costa Rica', currency: 'CRC' },
  { code: 'CU', name: 'Cuba', currency: 'CUP' },
  { code: 'DO', name: 'República Dominicana', currency: 'DOP' },
  { code: 'EC', name: 'Ecuador', currency: 'USD' },
  { code: 'SV', name: 'El Salvador', currency: 'USD' },
  { code: 'ES', name: 'España', currency: 'EUR' },
  { code: 'US', name: 'Estados Unidos', currency: 'USD' },
  { code: 'GT', name: 'Guatemala', currency: 'GTQ' },
  { code: 'HN', name: 'Honduras', currency: 'HNL' },
  { code: 'MX', name: 'México', currency: 'MXN' },
  { code: 'NI', name: 'Nicaragua', currency: 'NIO' },
  { code: 'PA', name: 'Panamá', currency: 'PAB' },
  { code: 'PY', name: 'Paraguay', currency: 'PYG' },
  { code: 'PE', name: 'Perú', currency: 'PEN' },
  { code: 'UY', name: 'Uruguay', currency: 'UYU' },
  { code: 'VE', name: 'Venezuela', currency: 'VED' },
  { code: 'DE', name: 'Alemania', currency: 'EUR' },
  { code: 'FR', name: 'Francia', currency: 'EUR' },
  { code: 'IT', name: 'Italia', currency: 'EUR' },
  { code: 'PT', name: 'Portugal', currency: 'EUR' },
  { code: 'GB', name: 'Reino Unido', currency: 'GBP' },
  { code: 'CH', name: 'Suiza', currency: 'CHF' },
  { code: 'JP', name: 'Japón', currency: 'JPY' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
].sort((a, b) => a.name.localeCompare(b.name, 'es'));

export const getCountryByCode = (code: string): CountryOption | undefined =>
  COUNTRIES.find((c) => c.code === code.toUpperCase());
