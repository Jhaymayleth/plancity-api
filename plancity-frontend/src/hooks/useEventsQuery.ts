import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eventKeys, favoriteKeys } from "../api/queryClient";
import { categoryService } from "../services/categoryService";
import { eventService } from "../services/eventService";
import { favoriteService } from "../services/favoriteService";
import { getErrorMessage } from "../utils/errors";
import type { Event } from "../types/event";

export function useEventsQuery(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: eventKeys.list(search, categoryId),
    queryFn: () =>
      eventService.getAll({
        search: search || undefined,
        categoryId: categoryId || undefined,
      }),
  });
}

export function useEventQuery(id: string | undefined) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? ""),
    queryFn: () => eventService.getById(id as string),
    enabled: Boolean(id),
  });
}

/** Categorías para el filtro. La API solo expone el listado completo. */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
    staleTime: 5 * 60_000,
  });
}

/** Favoritos del usuario. Solo se consulta si hay sesión. */
export function useFavoritesQuery(enabled: boolean) {
  return useQuery({
    queryKey: favoriteKeys.all,
    queryFn: () => favoriteService.getAll(),
    enabled,
  });
}

export function useFavoriteIds(enabled: boolean): Set<string> {
  const { data } = useFavoritesQuery(enabled);
  return new Set((data ?? []).map((event: Event) => event.id));
}

interface ToggleFavoriteVariables {
  eventId: string;
  eventName: string;
  isFavorite: boolean;
}

/**
 * Alta/baja de favorito con actualización optimista del caché.
 * 409 (ya en favoritos) y 404 (evento inexistente) se muestran con toast.
 */
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, isFavorite }: ToggleFavoriteVariables) =>
      isFavorite
        ? favoriteService.remove(eventId)
        : favoriteService.add(eventId),

    onMutate: async ({ eventId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: favoriteKeys.all });
      const previous = queryClient.getQueryData<Event[]>(favoriteKeys.all);

      queryClient.setQueryData<Event[]>(favoriteKeys.all, (current) => {
        if (!current) return current;
        // La remoción optimista necesita el evento completo; si no está,
        // se deja que el refetch lo resuelva.
        return isFavorite
          ? current.filter((event) => event.id !== eventId)
          : current;
      });

      return { previous };
    },

    onSuccess: (_, { eventName, isFavorite }) => {
      toast.success(
        isFavorite
          ? `"${eventName}" eliminado de favoritos`
          : `"${eventName}" guardado en favoritos`,
      );
    },

    onError: (error, { eventName, isFavorite }) => {
      toast.error(
        getErrorMessage(
          error,
          isFavorite
            ? `No se pudo quitar "${eventName}" de favoritos.`
            : `No se pudo guardar "${eventName}" en favoritos.`,
        ),
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.remove(eventId),

    onSuccess: () => {
      toast.success("Evento eliminado correctamente.");
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(error, "No se pudo eliminar el evento."),
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.all });
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}
