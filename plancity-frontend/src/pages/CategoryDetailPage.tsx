import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, LayoutGrid } from "lucide-react";

import { EventCard } from "../components/EventCard/EventCard";
import { EventCardSkeleton, Skeleton } from "../components/ui";
import { useAuth } from "../context/useAuth";
import {
  useCategoryQuery,
  useEventsQuery,
  useFavoritesQuery,
} from "../hooks/useEventsQuery";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getErrorMessage } from "../utils/errors";

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const categoryQuery = useCategoryQuery(id);
  const category = categoryQuery.data;
  useDocumentTitle(category?.name ?? "Detalle de categoría");

  // Eventos de la categoría con el filtro servidor que sí existe.
  const eventsQuery = useEventsQuery(undefined, id);
  const favoritesQuery = useFavoritesQuery(Boolean(user));
  const favoriteIds = useMemo(
    () => new Set((favoritesQuery.data ?? []).map((event) => event.id)),
    [favoritesQuery.data],
  );
  const events = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);

  if (categoryQuery.isPending) {
    return (
      <main
        aria-label="Cargando categoría"
        className="min-h-screen bg-slate-50 px-6 py-12"
      >
        <div className="mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-14 w-2/3 rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </main>
    );
  }

  if (categoryQuery.isError || !category) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p role="alert" className="text-red-600">
            {getErrorMessage(
              categoryQuery.error,
              "No se pudo cargar la categoría.",
            )}
          </p>
          <div className="mt-5 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => categoryQuery.refetch()}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reintentar
            </button>
            <Link
              to="/categories"
              className="font-semibold text-slate-600 hover:text-indigo-600"
            >
              ← Volver a categorías
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/categories"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a categorías
        </Link>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <LayoutGrid className="h-8 w-8" aria-hidden="true" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Categoría
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {category.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {category.description}
          </p>

          <p className="mt-4 text-sm text-slate-500" aria-live="polite">
            {events.length} {events.length === 1 ? "evento" : "eventos"} en
            esta categoría
          </p>
        </article>

        <section aria-label="Eventos de la categoría" className="mt-12">
          {eventsQuery.isPending && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          )}

          {eventsQuery.isError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600"
            >
              No se pudieron cargar los eventos de esta categoría.
            </p>
          )}

          {eventsQuery.isSuccess && events.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Aún no hay eventos en esta categoría.
            </p>
          )}

          {eventsQuery.isSuccess && events.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={favoriteIds.has(event.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
