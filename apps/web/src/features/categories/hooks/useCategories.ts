import { useState } from "react";
import { useListCategories } from "./useListCategories";
import { Category, TransactionType } from "@meridia/shared";

const useCategories = () => {
  const { data, isLoading, error, refetch } = useListCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [defaultType] = useState<TransactionType>("expense");
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const income = data?.filter((c) => c.type === "income") ?? [];
  const expense = data?.filter((c) => c.type === "expense") ?? [];

  return {
    data,
    isLoading,
    error,
    refetch,
    formOpen,
    setFormOpen,
    editing,
    setEditing,
    defaultType,
    deletingCategory,
    setDeletingCategory,
    income,
    expense,
  };
};

export default useCategories;
