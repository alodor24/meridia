import { useEffect, useMemo, useState } from "react";
import { PAGE_SIZE } from "@/conts";
import type {
  Account,
  Category,
  Transaction,
  TransactionType,
} from "@meridia/shared";
import { useFetch } from "@/hooks/useAsync";
import { listTransactions } from "../services/api";
import { listAccounts } from "@/features/accounts/services/api";
import { listCategories } from "@/features/categories/services/api";

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

const useGetDataByFilter = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const activeFilters = {
    from: filters.from || undefined,
    to: filters.to || undefined,
    accountId: filters.accountId || undefined,
    categoryId: filters.categoryId || undefined,
    type: filters.type || undefined,
  };

  const { data, loading, error, refetch } = useFetch(
    () => listTransactions({ ...activeFilters, limit }),
    [
      filters.from,
      filters.to,
      filters.accountId,
      filters.categoryId,
      filters.type,
      limit,
    ],
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [accountList, categoryList] = await Promise.all([
        listAccounts(),
        listCategories(),
      ]);
      if (!active) return;
      setAccounts(accountList);
      setCategories(categoryList);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const resetFilters = () => {
    setFilters(emptyFilters);
    setLimit(PAGE_SIZE);
  };

  const hasFilters = Object.values(filters).some((value) => value !== "");

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const accountsByCurrency = useMemo(
    () => new Map(accounts.map((a) => [a.id, a.currency])),
    [accounts],
  );

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
    refetch,
    filters,
    setFilters,
    resetFilters,
    hasFilters,
    total,
    items,
    accountsByCurrency,
    setLimit,
  };
};

export default useGetDataByFilter;
