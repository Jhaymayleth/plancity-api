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

  // Cargar categorías para el filtro
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch {
        // El filtro no debe impedir mostrar los eventos.
      }
    };

    loadCategories();
  }, []);

  // Cargar favoritos cuando existe una sesión
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

  // Cargar eventos cuando cambian los filtros
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
    <main>
      <h1>Eventos</h1>

      {user?.role === "admin" && (
        <p>
          <Link to="/admin/events/new">
            Crear evento
          </Link>
        </p>
      )}

      <section>
        <label htmlFor="search">
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
        />

        <label htmlFor="category">
          Filtrar por categoría
        </label>

        <select
          id="category"
          value={categoryId}
          onChange={(event) =>
            setCategoryId(event.target.value)
          }
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
      </section>

      {loading && (
        <p>Cargando eventos...</p>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        events.length === 0 && (
          <p>
            No se encontraron eventos.
          </p>
        )}

      {!loading &&
        !error &&
        events.length > 0 && (
          <section>
            {events.map((event) => (
              <article key={event.id}>
                <EventCard
                  event={event}
                  isFavorite={favoriteIds.has(
                    event.id,
                  )}
                  onFavoriteChange={(isFavorite) =>
                    handleFavoriteChange(
                      event.id,
                      isFavorite,
                    )
                  }
                />

                {user?.role === "admin" && (
                  <div>
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(event.id)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
    </main>
  );
}
