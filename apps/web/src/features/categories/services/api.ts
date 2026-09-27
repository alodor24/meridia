import type { Category, Paginated, TransactionType } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export const listCategories = async (type?: TransactionType) => {
  const result = await http.get<Paginated<Category>>(ENDPOINT_ROUTES.CATEGORIES, {
    params: type ? { type } : undefined,
  });
  return result.items;
};

export const createCategory = async (payload: CreateCategoryPayload) => {
  const result = await http.post<{ category: Category }>(
    ENDPOINT_ROUTES.CATEGORIES,
    payload,
  );
  return result.category;
};

export const updateCategory = async (
  id: string,
  payload: Partial<CreateCategoryPayload>,
) => {
  const result = await http.patch<{ category: Category }>(
    `${ENDPOINT_ROUTES.CATEGORIES}/${id}`,
    payload,
  );
  return result.category;
};

export const deleteCategory = (id: string) =>
  http.delete<null>(`${ENDPOINT_ROUTES.CATEGORIES}/${id}`);
