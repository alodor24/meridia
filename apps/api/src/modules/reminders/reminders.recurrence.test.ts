import { describe, expect, it } from 'vitest';
import {
  expandOccurrences,
  isIsoDate,
  isOccurrenceDate,
  isoDateRangeInDays,
} from './reminders.recurrence';
import type { ReminderSchedule } from './reminders.recurrence';

const oneOff = (startDate: string): ReminderSchedule => ({
  startDate,
  recurrenceUnit: null,
  recurrenceInterval: null,
  recurrenceEndDate: null,
});

const recurring = (
  startDate: string,
  recurrenceUnit: ReminderSchedule['recurrenceUnit'],
  recurrenceInterval: number,
  recurrenceEndDate: string | null = null,
): ReminderSchedule => ({
  startDate,
  recurrenceUnit,
  recurrenceInterval,
  recurrenceEndDate,
});

describe('expandOccurrences', () => {
  it('incluye un recordatorio único solo dentro del rango', () => {
    expect(expandOccurrences(oneOff('2026-10-23'), '2026-10-01', '2026-10-31')).toEqual([
      '2026-10-23',
    ]);
    expect(expandOccurrences(oneOff('2026-10-23'), '2026-11-01', '2026-11-30')).toEqual(
      [],
    );
  });

  it('expande días con intervalo', () => {
    expect(
      expandOccurrences(
        recurring('2026-10-01', 'day', 3),
        '2026-10-01',
        '2026-10-10',
      ),
    ).toEqual([
      '2026-10-01',
      '2026-10-04',
      '2026-10-07',
      '2026-10-10',
    ]);
  });

  it('expande semanas con intervalo', () => {
    expect(
      expandOccurrences(
        recurring('2026-10-05', 'week', 2),
        '2026-10-01',
        '2026-11-05',
      ),
    ).toEqual(['2026-10-05', '2026-10-19', '2026-11-02']);
  });

  it('mantiene el día ancla en meses con menos días', () => {
    expect(
      expandOccurrences(
        recurring('2026-01-31', 'month', 1),
        '2026-01-01',
        '2026-05-31',
      ),
    ).toEqual([
      '2026-01-31',
      '2026-02-28',
      '2026-03-31',
      '2026-04-30',
      '2026-05-31',
    ]);
  });

  it('respeta el intervalo mensual', () => {
    expect(
      expandOccurrences(
        recurring('2026-01-31', 'month', 2),
        '2026-01-01',
        '2026-07-31',
      ),
    ).toEqual(['2026-01-31', '2026-03-31', '2026-05-31', '2026-07-31']);
  });

  it('maneja el 29 de febrero en años bisiestos y no bisiestos', () => {
    expect(
      expandOccurrences(
        recurring('2024-02-29', 'year', 1),
        '2024-01-01',
        '2027-12-31',
      ),
    ).toEqual(['2024-02-29', '2025-02-28', '2026-02-28', '2027-02-28']);
  });

  it('incluye la fecha de fin', () => {
    expect(
      expandOccurrences(
        recurring('2026-10-23', 'month', 1, '2026-12-23'),
        '2026-10-01',
        '2027-12-31',
      ),
    ).toEqual(['2026-10-23', '2026-11-23', '2026-12-23']);
  });

  it('no genera ocurrencias antes del inicio', () => {
    expect(
      expandOccurrences(
        recurring('2026-10-23', 'month', 1),
        '2026-01-01',
        '2026-11-30',
      ),
    ).toEqual(['2026-10-23', '2026-11-23']);
  });

  it('salta rangos lejanos sin recorrer toda la serie', () => {
    expect(
      expandOccurrences(
        recurring('2000-01-01', 'day', 1),
        '2026-10-01',
        '2026-10-03',
      ),
    ).toEqual(['2026-10-01', '2026-10-02', '2026-10-03']);
  });
});

describe('isOccurrenceDate', () => {
  it('reconoce fechas válidas de la serie', () => {
    const schedule = recurring('2026-01-31', 'month', 1);
    expect(isOccurrenceDate(schedule, '2026-02-28')).toBe(true);
    expect(isOccurrenceDate(schedule, '2026-03-31')).toBe(true);
    expect(isOccurrenceDate(schedule, '2026-03-30')).toBe(false);
  });

  it('reconoce el inicio de un recordatorio único', () => {
    expect(isOccurrenceDate(oneOff('2026-10-23'), '2026-10-23')).toBe(true);
    expect(isOccurrenceDate(oneOff('2026-10-23'), '2026-10-24')).toBe(false);
  });
});

describe('date helpers', () => {
  it('valida fechas ISO reales', () => {
    expect(isIsoDate('2024-02-29')).toBe(true);
    expect(isIsoDate('2026-02-29')).toBe(false);
    expect(isIsoDate('2026-13-01')).toBe(false);
    expect(isIsoDate('23/10/2026')).toBe(false);
  });

  it('calcula la cantidad de días del rango', () => {
    expect(isoDateRangeInDays('2026-10-01', '2026-10-31')).toBe(31);
    expect(isoDateRangeInDays('2026-10-31', '2026-10-31')).toBe(1);
  });
});
