import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { EventCard } from "../components/EventCard/EventCard";
import { favoriteService } from "../services/favoriteService";
import type { Event } from "../types/event";

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await favoriteService.getAll();

        setFavorites(data);
      } catch {
        setError("No se pudieron cargar tus favoritos.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleFavoriteChange = (
    eventId: string,
    isFavorite: boolean,
  ) => {
    if (!isFavorite) {
      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (event) => event.id !== eventId,
        ),
      );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-500">
          Cargando favoritos...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
          >
            {error}
          </div>

          <Link
            to="/events"
            className="mt-6 inline-flex font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            ← Explorar eventos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Tus eventos guardados
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Mis favoritos
          </h1>

          <p className="mt-2 text-slate-500">
            Aquí encontrarás los eventos que guardaste para
            consultar después.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-4 text-5xl">
              ♡
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Aún no tienes favoritos
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Guarda los eventos que más te interesen y
              aparecerán aquí.
            </p>

            <Link
              to="/events"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Explorar eventos
            </Link>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={true}
                onFavoriteChange={(isFavorite) =>
                  handleFavoriteChange(
                    event.id,
                    isFavorite,
                  )
                }
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
