import { useEffect, useState } from "react";

import { EventCard } from "../components/EventCard/EventCard";
import { eventService } from "../services/eventService";
import { categoryService } from "../services/categoryService";

import type { Event } from "../types/event";
import type { Category } from "../types/category";

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <main>
      <h1>Eventos</h1>

      <section>
        <label htmlFor="search">Buscar eventos</label>

        <input
          id="search"
          type="search"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <label htmlFor="category">
          Filtrar por categoría
        </label>

        <select
          id="category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Todas las categorías</option>

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

      {loading && <p>Cargando eventos...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p>No se encontraron eventos.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <section>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}
        </section>
      )}
    </main>
  );
}