import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../services/api";
import { categoryKeys } from "../categoryKeys";
import { TransactionType } from "@meridia/shared";

export const useListCategories = (type?: TransactionType) => {
  const queryOptions = {
    queryKey: categoryKeys.list(type),
    queryFn: () => categoryApi.listCategories(type),
  };

  return useQuery(queryOptions);
};
