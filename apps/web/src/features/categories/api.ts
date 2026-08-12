import type { Category, Paginated, TransactionType } from "@meridia/shared";
import { http } from "@/services/api/client";

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  color?: string;
}

export const listCategories = async (type?: TransactionType) => {
  const result = await http.get<Paginated<Category>>("/api/categories", {
    params: type ? { type } : undefined,
  });
  return result.items;
};

export const createCategory = async (payload: CreateCategoryPayload) => {
  const result = await http.post<{ category: Category }>(
    "/api/categories",
    payload,
  );
  return result.category;
};

export const updateCategory = async (
  id: string,
  payload: Partial<CreateCategoryPayload>,
) => {
  const result = await http.patch<{ category: Category }>(
    `/api/categories/${id}`,
    payload,
  );
  return result.category;
};

export const deleteCategory = (id: string) =>
  http.delete<null>(`/api/categories/${id}`);
