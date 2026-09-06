import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { EventCard } from "../components/EventCard/EventCard";
import { useAuth } from "../context/useAuth";
import { categoryService } from "../services/categoryService";
import { eventService } from "../services/eventService";
import { favoriteService } from "../services/favoriteService";

import type { Category } from "../types/category";
import type { Event } from "../types/event";

export function EventsPage() {
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    new Set(),
  );

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch {
        // El filtro puede continuar aunque las categorías fallen.
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavoriteIds(new Set());
        return;
      }

      try {
        const favorites = await favoriteService.getAll();

        setFavoriteIds(
          new Set(favorites.map((event) => event.id)),
        );
      } catch {
        setFavoriteIds(new Set());
      }
    };

    loadFavorites();
  }, [user]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await eventService.getAll({
          search: search || undefined,
          categoryId: categoryId || undefined,
        });

        setEvents(data);
      } catch {
        setError("No se pudieron cargar los eventos.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [search, categoryId]);

  const handleFavoriteChange = (
    eventId: string,
    isFavorite: boolean,
  ) => {
    setFavoriteIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (isFavorite) {
        nextIds.add(eventId);
      } else {
        nextIds.delete(eventId);
      }

      return nextIds;
    });
  };

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este evento?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await eventService.remove(eventId);

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => event.id !== eventId,
        ),
      );

      setFavoriteIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(eventId);
        return nextIds;
      });
    } catch {
      setError("No se pudo eliminar el evento.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Descubre algo nuevo
            </p>

            <h1 className="text-4xl font-bold text-slate-900">
              Eventos
            </h1>

            <p className="mt-2 text-slate-500">
              Encuentra conciertos, talleres, actividades y mucho más.
            </p>
          </div>

          {user?.role === "admin" && (
            <Link
              to="/admin/events/new"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              + Crear evento
            </Link>
          )}
        </div>

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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
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
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">
                  Todas las categorías
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {loading && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">
              Cargando eventos...
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mb-4 text-5xl">
                🎭
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                No se encontraron eventos
              </h2>

              <p className="mt-2 text-slate-500">
                Intenta cambiar tu búsqueda o el filtro.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          events.length > 0 && (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={favoriteIds.has(event.id)}
                  onFavoriteChange={(isFavorite) =>
                    handleFavoriteChange(
                      event.id,
                      isFavorite,
                    )
                  }
                  onDelete={handleDelete}
                />
              ))}
            </section>
          )}

      </div>
    </main>
  );
}