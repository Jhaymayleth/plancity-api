import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eventKeys, favoriteKeys } from "../api/queryClient";
import { categoryService } from "../services/categoryService";
import { eventService } from "../services/eventService";
import { favoriteService } from "../services/favoriteService";
import { getErrorMessage } from "../utils/errors";
import type { CategoryData } from "../types/category";
import type { Event, EventData } from "../types/event";

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

/** Categoría por id (edición). Solo se consulta si hay id. */
export function useCategoryQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["categories", id ?? ""],
    queryFn: () => categoryService.getById(id as string),
    enabled: Boolean(id),
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

export function useDeleteEventMutation() {  const queryClient = useQueryClient();

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

interface SaveCategoryVariables {
  id?: string;
  data: CategoryData;
}

/** Crear/actualizar categoría. El mensaje 409 del servidor se muestra tal cual. */
export function useSaveCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: SaveCategoryVariables) =>
      id ? categoryService.update(id, data) : categoryService.create(data),

    onSuccess: (_, { id }) => {
      toast.success(
        id ? "Categoría actualizada correctamente." : "Categoría creada correctamente.",
      );
    },

    onError: (error, { id }) => {
      toast.error(
        getErrorMessage(
          error,
          id ? "No se pudo actualizar la categoría." : "No se pudo crear la categoría.",
        ),
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

interface SaveEventVariables {
  id?: string;
  data: EventData;
}

/** Crear/actualizar evento. Incluye el 409 de nombre duplicado del servidor. */export function useSaveEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: SaveEventVariables) =>
      id ? eventService.update(id, data) : eventService.create(data),

    onSuccess: (_, { id }) => {
      toast.success(
        id ? "Evento actualizado correctamente." : "Evento creado correctamente.",
      );
    },

    onError: (error, { id }) => {
      toast.error(
        getErrorMessage(
          error,
          id ? "No se pudo actualizar el evento." : "No se pudo crear el evento.",
        ),
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

/**
 * Eliminar categoría. Si tiene eventos, la API responde error por
 * ON DELETE RESTRICT y se muestra el mensaje del servidor.
 */
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => categoryService.remove(categoryId),

    onSuccess: () => {
      toast.success("Categoría eliminada correctamente.");
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(error, "No se pudo eliminar la categoría."),
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
