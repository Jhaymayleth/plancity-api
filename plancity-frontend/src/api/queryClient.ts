import { QueryClient } from "@tanstack/react-query";

/**
 * Cliente React Query.
 * La API no pagina ni expone filtros avanzados en servidor
 * (solo `search` + `categoryId`), así que el caché vive por
 * combinación de filtros y los filtros extra se aplican en cliente.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const eventKeys = {
  all: ["events"] as const,
  list: (search?: string, categoryId?: string) =>
    ["events", search ?? "", categoryId ?? ""] as const,
  detail: (id: string) => ["events", id] as const,
};

export const favoriteKeys = {
  all: ["favorites"] as const,
};
