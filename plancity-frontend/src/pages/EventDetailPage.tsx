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
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-600">Cargando evento...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>

          <Link
            to="/events"
            className="mt-6 inline-flex font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Volver a eventos
          </Link>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-700">
            Evento no encontrado.
          </p>

          <Link
            to="/events"
            className="mt-6 inline-flex font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Volver a eventos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/events"
          className="mb-8 inline-flex font-semibold text-indigo-600 hover:text-indigo-800"
        >
          ← Volver a eventos
        </Link>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="bg-slate-100">
              {event.images.length > 0 ? (
                <div className="grid gap-3 p-4">
                  {event.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={event.name}
                      className="max-h-[500px] w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center text-7xl">
                  🎉
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                {event.category.name}
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {event.name}
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-600">
                {event.description}
              </p>

              <dl className="mt-8 space-y-5">
                <div>
                  <dt className="text-sm font-semibold text-slate-500">
                    Fecha
                  </dt>
                  <dd className="mt-1 text-slate-900">
                    {new Date(event.date).toLocaleString()}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-slate-500">
                    Ubicación
                  </dt>
                  <dd className="mt-1 text-slate-900">
                    {event.location}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-slate-500">
                    Precio
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">
                    ${event.price}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-slate-500">
                    Capacidad
                  </dt>
                  <dd className="mt-1 text-slate-900">
                    {event.capacity} personas
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}