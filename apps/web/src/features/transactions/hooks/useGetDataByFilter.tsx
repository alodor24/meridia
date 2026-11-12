import { useMemo, useState } from "react";
import { PAGE_SIZE } from "@/consts";
import type {
  Account,
  AccountId,
  Category,
  CategoryId,
  Transaction,
  TransactionFilters,
  TransactionType,
} from "@meridia/shared";
import { useListTransactions } from "./useListTransactions";
import { useListAccounts } from "@/features/accounts/hooks/useListAccounts";
import { useListCategories } from "@/features/categories/hooks/useListCategories";

export interface Filters {
  from: string;
  to: string;
  accountId: string;
  categoryId: string;
  type: "" | TransactionType;
}

const emptyFilters: Filters = {
  from: "",
  to: "",
  accountId: "",
  categoryId: "",
  type: "",
};

const EMPTY_ACCOUNTS: Account[] = [];
const EMPTY_CATEGORIES: Category[] = [];

const useGetDataByFilter = () => {
  const [filters, setFiltersState] = useState<Filters>(emptyFilters);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useListAccounts();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useListCategories();

  const activeFilters: TransactionFilters = {
    from: filters.from || undefined,
    to: filters.to || undefined,
    accountId: filters.accountId ? (filters.accountId as AccountId) : undefined,
    categoryId: filters.categoryId
      ? (filters.categoryId as CategoryId)
      : undefined,
    type: filters.type || undefined,
  };

  const offset = page * limit;

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
    refetch: transactionsQueryRefetch,
  } = useListTransactions({
    ...activeFilters,
    limit,
    offset,
  });

  const accounts = accountsData ?? EMPTY_ACCOUNTS;
  const categories = categoriesData ?? EMPTY_CATEGORIES;

  const data = transactionsData;
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const accountsByCurrency = useMemo(
    () => new Map(accounts.map((account) => [account.id, account.currency])),
    [accounts],
  );

  const hasFilters = Object.values(filters).some((value) => value !== "");

  const setFilters: React.Dispatch<React.SetStateAction<Filters>> = (value) => {
    setFiltersState(value);
    setPage(0);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(0);
  };

  const resetFilters = () => {
    setFiltersState(emptyFilters);
    setPage(0);
    setLimit(PAGE_SIZE);
  };

  const loading =
    isTransactionsLoading || isAccountsLoading || isCategoriesLoading;

  const error = transactionsError ?? accountsError ?? categoriesError;

  return {
    data,
    accounts,
    categories,
    editing,
    setEditing,
    deleting,
    setDeleting,
    loading,
    error,
    refetch: transactionsQueryRefetch,
    filters,
    setFilters,
    resetFilters,
    hasFilters,
    total,
    items,
    accountsByCurrency,
    page,
    setPage,
    limit,
    handleLimitChange,
  };
};

export default useGetDataByFilter;
