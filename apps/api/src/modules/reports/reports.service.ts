import type {
  AccountId,
  CategoryId,
  TransactionId,
  TransactionType,
  User,
  UserId,
} from "@meridia/shared";
import { pool } from "../../database/pool";
import { NotFoundError } from "../../shared/errors";
import * as accountsRepository from "../accounts/accounts.repository";
import * as categoriesRepository from "../categories/categories.repository";
import {
  buildSeriesKeys,
  groupKeyForDate,
  reportKindLabel,
  resolveReportPeriod,
  type ResolvedPeriod,
  type SeriesKey,
} from "./reports.period";
import * as reportsRepository from "./reports.repository";
import type { ReportQuery } from "./reports.schemas";

export interface ReportFiltersSummary {
  accountName?: string;
  categoryName?: string;
  type?: TransactionType;
}

export interface ReportCategoryTotal {
  categoryId: CategoryId;
  name: string;
  color: string;
  total: number;
  count: number;
}

export interface ReportSeriesPoint extends SeriesKey {
  income: number;
  expenses: number;
  balance: number;
  cumulative: number;
}

export interface ReportTotals {
  income: number;
  expenses: number;
  balance: number;
}

export interface ReportCurrencySection {
  currency: string;
  movementCount: number;
  totals: ReportTotals;
  series: ReportSeriesPoint[];
  expensesByCategory: ReportCategoryTotal[];
  incomesByCategory: ReportCategoryTotal[];
}

export interface ReportMovement {
  id: TransactionId;
  date: string;
  type: TransactionType;
  amount: number;
  note: string | null;
  accountName: string;
  accountCurrency: string;
  categoryName: string;
  categoryColor: string;
}

export interface TransactionsReport {
  user: {
    name: string;
    email: string;
    currency: string;
  };
  generatedAt: string;
  period: ResolvedPeriod;
  filters: ReportFiltersSummary;
  movements: ReportMovement[];
  sections: ReportCurrencySection[];
  showMovementTable: boolean;
}

interface MutableCategoryTotal {
  categoryId: CategoryId;
  name: string;
  color: string;
  total: number;
  count: number;
}

interface MutableCurrencySection {
  currency: string;
  movementCount: number;
  points: Map<string, { income: number; expenses: number }>;
  expensesByCategory: Map<string, MutableCategoryTotal>;
  incomesByCategory: Map<string, MutableCategoryTotal>;
}

const roundMoney = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const addCategoryTotal = (
  target: Map<string, MutableCategoryTotal>,
  row: reportsRepository.ReportTransactionRow,
): void => {
  const existing = target.get(row.category_id);
  if (existing) {
    existing.total += row.amount;
    existing.count += 1;
    return;
  }

  target.set(row.category_id, {
    categoryId: row.category_id as CategoryId,
    name: row.category_name,
    color: row.category_color,
    total: row.amount,
    count: 1,
  });
};

const mapCategories = (
  source: Map<string, MutableCategoryTotal>,
): ReportCategoryTotal[] =>
  Array.from(source.values())
    .map((category) => ({
      ...category,
      total: roundMoney(category.total),
    }))
    .sort((a, b) => b.total - a.total);

const buildSeries = (
  keys: SeriesKey[],
  section: MutableCurrencySection,
): ReportSeriesPoint[] => {
  let cumulative = 0;

  return keys.map((key) => {
    const point = section.points.get(key.key) ?? { income: 0, expenses: 0 };
    const income = roundMoney(point.income);
    const expenses = roundMoney(point.expenses);
    const balance = roundMoney(income - expenses);
    cumulative = roundMoney(cumulative + balance);

    return {
      ...key,
      income,
      expenses,
      balance,
      cumulative,
    };
  });
};

const findAccount = async (
  userId: UserId,
  accountId?: string,
): Promise<accountsRepository.AccountRow | undefined> => {
  if (!accountId) return undefined;
  const account = await accountsRepository.findById(
    pool,
    userId,
    accountId as AccountId,
  );
  if (!account) throw new NotFoundError("Cuenta no encontrada");
  return account;
};

const findCategory = async (
  userId: UserId,
  categoryId?: string,
): Promise<categoriesRepository.CategoryRow | undefined> => {
  if (!categoryId) return undefined;
  const category = await categoriesRepository.findById(
    pool,
    userId,
    categoryId as CategoryId,
  );
  if (!category) throw new NotFoundError("Categoría no encontrada");
  return category;
};

export const buildTransactionsReport = async (
  user: User,
  query: ReportQuery,
): Promise<TransactionsReport> => {
  const period = resolveReportPeriod(query);
  const [account, category] = await Promise.all([
    findAccount(user.id, query.accountId),
    findCategory(user.id, query.categoryId),
  ]);

  const rows = await reportsRepository.listForReport(pool, user.id, {
    from: period.from,
    to: period.to,
    accountId: query.accountId as AccountId | undefined,
    categoryId: query.categoryId as CategoryId | undefined,
    type: query.type,
  });

  const keys = buildSeriesKeys(period);
  const sectionsByCurrency = new Map<string, MutableCurrencySection>();

  for (const row of rows) {
    let section = sectionsByCurrency.get(row.account_currency);
    if (!section) {
      section = {
        currency: row.account_currency,
        movementCount: 0,
        points: new Map(),
        expensesByCategory: new Map(),
        incomesByCategory: new Map(),
      };
      sectionsByCurrency.set(row.account_currency, section);
    }

    section.movementCount += 1;

    const pointKey = groupKeyForDate(row.date, period.granularity);
    const point = section.points.get(pointKey) ?? {
      income: 0,
      expenses: 0,
    };

    if (row.type === "income") {
      point.income += row.amount;
      addCategoryTotal(section.incomesByCategory, row);
    } else {
      point.expenses += row.amount;
      addCategoryTotal(section.expensesByCategory, row);
    }

    section.points.set(pointKey, point);
  }

  const sections = Array.from(sectionsByCurrency.values())
    .sort((a, b) => a.currency.localeCompare(b.currency))
    .map<ReportCurrencySection>((section) => {
      const series = buildSeries(keys, section);
      const totals = series.reduce<ReportTotals>(
        (acc, point) => ({
          income: roundMoney(acc.income + point.income),
          expenses: roundMoney(acc.expenses + point.expenses),
          balance: 0,
        }),
        { income: 0, expenses: 0, balance: 0 },
      );

      return {
        currency: section.currency,
        movementCount: section.movementCount,
        totals: {
          ...totals,
          balance: roundMoney(totals.income - totals.expenses),
        },
        series,
        expensesByCategory: mapCategories(section.expensesByCategory),
        incomesByCategory: mapCategories(section.incomesByCategory),
      };
    });

  const movements = rows.map<ReportMovement>((row) => ({
    id: row.id as TransactionId,
    date: row.date,
    type: row.type,
    amount: roundMoney(row.amount),
    note: row.note,
    accountName: row.account_name,
    accountCurrency: row.account_currency,
    categoryName: row.category_name,
    categoryColor: row.category_color,
  }));

  return {
    user: {
      name: user.name,
      email: user.email,
      currency: user.currency,
    },
    generatedAt: new Date().toISOString(),
    period,
    filters: {
      accountName: account?.name,
      categoryName: category?.name,
      type: query.type,
    },
    movements,
    sections,
    showMovementTable: period.granularity === "day",
  };
};

export const reportFileName = (report: TransactionsReport): string =>
  `meridia_reporte_${reportKindLabel(report.period.kind)}_${report.period.shortLabel}`;
