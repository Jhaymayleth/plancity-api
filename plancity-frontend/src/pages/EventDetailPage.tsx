import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { eventService } from "../services/eventService";
import type { Event } from "../types/event";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError("Evento no encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await eventService.getById(id);

        setEvent(data);
      } catch {
        setError("No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return <p>Cargando evento...</p>;
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
        <Link to="/events">Volver a eventos</Link>
      </main>
    );
  }

  if (!event) {
    return (
      <main>
        <p>Evento no encontrado.</p>
        <Link to="/events">Volver a eventos</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/events">← Volver a eventos</Link>

      <article>
        <div>
          {event.images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={event.name}
            />
          ))}
        </div>

        <p>{event.category.name}</p>

        <h1>{event.name}</h1>

        <p>{event.description}</p>

        <dl>
          <div>
            <dt>Fecha</dt>
            <dd>{new Date(event.date).toLocaleString()}</dd>
          </div>

          <div>
            <dt>Ubicación</dt>
            <dd>{event.location}</dd>
          </div>

          <div>
            <dt>Precio</dt>
            <dd>${event.price}</dd>
          </div>

          <div>
            <dt>Capacidad</dt>
            <dd>{event.capacity} personas</dd>
          </div>
        </dl>
      </article>
    </main>
  );
}