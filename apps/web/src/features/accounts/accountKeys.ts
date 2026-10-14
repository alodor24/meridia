export const accountKeys = {
  all: ["accounts"] as const,

  lists: () => [...accountKeys.all, "list"] as const,

  details: () => [...accountKeys.all, "detail"] as const,

  detail: (id: string) => [...accountKeys.details(), id] as const,
};
