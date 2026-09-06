import { Link } from "react-router-dom";

import { EventCard } from "../components/EventCard/EventCard";
import {
  EmptyState,
  EventCardSkeleton,
  SectionHeader,
} from "../components/ui";
import { useFavoritesQuery } from "../hooks/useEventsQuery";

export function FavoritesPage() {
  const favoritesQuery = useFavoritesQuery(true);
  const favorites = favoritesQuery.data ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Tus eventos guardados"
          title="Mis favoritos"
          description="Aquí encontrarás los eventos que guardaste para consultar después."
        />

        {favoritesQuery.isPending && (
          <section
            aria-label="Cargando favoritos"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </section>
        )}

        {favoritesQuery.isError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
          >
            <p>No se pudieron cargar tus favoritos.</p>
            <button
              type="button"
              onClick={() => favoritesQuery.refetch()}
              className="mt-2 font-semibold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {favoritesQuery.isSuccess && favorites.length === 0 && (
          <EmptyState
            title="Aún no tienes favoritos"
            description="Guarda los eventos que más te interesen y aparecerán aquí."
            action={
              <Link
                to="/events"
                className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Explorar eventos
              </Link>
            }
          />
        )}

        {favoritesQuery.isSuccess && favorites.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-500" aria-live="polite">
              {favorites.length}{" "}
              {favorites.length === 1
                ? "evento guardado"
                : "eventos guardados"}
            </p>

            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={true}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
