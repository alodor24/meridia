import type { Category, Paginated, TransactionType } from '@meridia/shared';
import { http } from '@/services/api/client';

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  color?: string;
}

export const listCategories = (type?: TransactionType) =>
  http
    .get<Paginated<Category>>('/api/categories', { params: type ? { type } : undefined })
    .then((r) => r.items);

export const createCategory = (payload: CreateCategoryPayload) =>
  http.post<{ category: Category }>('/api/categories', payload).then((r) => r.category);

export const updateCategory = (id: string, payload: Partial<CreateCategoryPayload>) =>
  http.patch<{ category: Category }>(`/api/categories/${id}`, payload).then((r) => r.category);

export const deleteCategory = (id: string) =>
  http.delete<null>(`/api/categories/${id}`);
