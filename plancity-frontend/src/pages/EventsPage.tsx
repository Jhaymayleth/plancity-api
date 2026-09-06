import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { EventCard } from "../components/EventCard/EventCard";
import {
  ConfirmDialog,
  EmptyState,
  EventCardSkeleton,
  SectionHeader,
} from "../components/ui";
import { useAuth } from "../context/useAuth";
import { useDebounce } from "../hooks/useDebounce";
import {
  useCategoriesQuery,
  useDeleteEventMutation,
  useEventsQuery,
  useFavoritesQuery,
} from "../hooks/useEventsQuery";

/**
 * La API solo soporta `search` + `categoryId` en servidor y no pagina:
 * devuelve el arreglo completo ordenado por fecha ASC.
 * El "Ver más" es paginación en cliente para no inventar query params.
 */
const PAGE_SIZE = 9;

export function EventsPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 300);

  const eventsQuery = useEventsQuery(debouncedSearch, categoryId);
  const categoriesQuery = useCategoriesQuery();
  const favoritesQuery = useFavoritesQuery(Boolean(user));
  const deleteMutation = useDeleteEventMutation();

  const events = useMemo(
    () => eventsQuery.data ?? [],
    [eventsQuery.data],
  );
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const serverFavoriteIds = useMemo(
    () => new Set((favoritesQuery.data ?? []).map((event) => event.id)),
    [favoritesQuery.data],
  );

  const visibleEvents = useMemo(
    () => events.slice(0, visibleCount),
    [events, visibleCount],
  );

  const pendingDeleteEvent = useMemo(
    () => events.find((event) => event.id === pendingDeleteId) ?? null,
    [events, pendingDeleteId],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setVisibleCount(PAGE_SIZE);
  };

  /**
   * La tarjeta ya actualizó su estado optimista y disparó la invalidación
   * del caché; aquí se fuerza el refetch para reflejar el servidor cuanto
   * antes sin capas intermedias de estado.
   */
  const handleFavoriteChange = (): void => {
    void favoritesQuery.refetch();
  };

  const isFavorite = (eventId: string): boolean =>
    serverFavoriteIds.has(eventId);

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId, {
      onSuccess: () => setPendingDeleteId(null),
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Descubre algo nuevo"
          title="Eventos"
          description="Encuentra conciertos, talleres, actividades y mucho más."
          action={
            user?.role === "admin" ? (
              <Link
                to="/admin/events/new"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                + Crear evento
              </Link>
            ) : undefined
          }
        />

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_280px]">
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Buscar eventos
              </label>

              <input
                id="search"
                type="search"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Filtrar por categoría
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) => handleCategoryChange(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Todas las categorías</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {eventsQuery.isPending && (
          <section
            aria-label="Cargando eventos"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </section>
        )}

        {eventsQuery.isError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p>No se pudieron cargar los eventos.</p>
            <button
              type="button"
              onClick={() => eventsQuery.refetch()}
              className="mt-2 font-semibold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {eventsQuery.isSuccess && events.length === 0 && (
          <EmptyState
            title="No se encontraron eventos"
            description="Intenta cambiar tu búsqueda o el filtro."
            action={
              search || categoryId ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Limpiar filtros
                </button>
              ) : undefined
            }
          />
        )}

        {eventsQuery.isSuccess && events.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-500" aria-live="polite">
              {events.length}{" "}
              {events.length === 1
                ? "evento encontrado"
                : "eventos encontrados"}
            </p>

            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={isFavorite(event.id)}
                  onFavoriteChange={handleFavoriteChange}
                  onDelete={(eventId) => setPendingDeleteId(eventId)}
                />
              ))}
            </section>

            {visibleCount < events.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) => count + PAGE_SIZE)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Ver más eventos
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Eliminar evento"
        description={
          pendingDeleteEvent
            ? `¿Estás seguro de que quieres eliminar "${pendingDeleteEvent.name}"? Esta acción no se puede deshacer.`
            : "¿Estás seguro de que quieres eliminar este evento?"
        }
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDeleteId(null)}
      />
    </main>
  );
}
