import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";

import { EventCard } from "../components/EventCard/EventCard";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/useAuth";
import {
  useEventQuery,
  useEventsQuery,
  useFavoritesQuery,
} from "../hooks/useEventsQuery";
import {
  formatEventDate,
  formatPriceCOP,
  getEventStatus,
  isFreeEvent,
} from "../utils/formatters";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const eventQuery = useEventQuery(id);
  const event = eventQuery.data;

  // Relacionados: misma categoría, sin incluir el actual. Todo en cliente
  // porque la API no expone endpoint de relacionados.
  const relatedQuery = useEventsQuery(undefined, event?.categoryId);
  const favoritesQuery = useFavoritesQuery(Boolean(user));
  const favoriteIds = useMemo(
    () => new Set((favoritesQuery.data ?? []).map((item) => item.id)),
    [favoritesQuery.data],
  );

  const related = useMemo(
    () =>
      (relatedQuery.data ?? [])
        .filter((item) => item.id !== id)
        .slice(0, 3),
    [relatedQuery.data, id],
  );

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles.");
    } catch {
      toast.info(`Copia el enlace manualmente: ${url}`);
    }
  };

  if (eventQuery.isPending) {
    return (
      <main
        aria-label="Cargando evento"
        className="min-h-screen bg-slate-50 px-6 py-12"
      >
        <div className="mx-auto max-w-6xl space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-[400px] w-full rounded-3xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </main>
    );
  }

  if (eventQuery.isError || !event) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-red-700"
          >
            No se pudo cargar el evento.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => eventQuery.refetch()}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reintentar
            </button>
            <Link
              to="/events"
              className="inline-flex font-semibold text-indigo-600 hover:text-indigo-800"
            >
              ← Volver a eventos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const status = getEventStatus(event.date);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/events"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a eventos
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
                      loading="lazy"
                      className="max-h-[500px] w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center text-slate-300">
                  <Ticket className="h-24 w-24" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="category">{event.category.name}</Badge>
                {isFreeEvent(event.price) ? (
                  <Badge tone="success">Gratis</Badge>
                ) : null}
                {status === "finalizado" ? (
                  <Badge tone="neutral">Finalizado</Badge>
                ) : null}
                {status === "hoy" ? <Badge tone="warning">Hoy</Badge> : null}
              </div>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {event.name}
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-600">
                {event.description}
              </p>

              <dl className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-sm font-semibold text-slate-500">
                      Fecha
                    </dt>
                    <dd className="mt-1 text-slate-900">
                      {formatEventDate(event.date)}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-sm font-semibold text-slate-500">
                      Ubicación
                    </dt>
                    <dd className="mt-1 text-slate-900">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {event.location}
                      </a>
                    </dd>
                  </div>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-slate-500">
                    Precio
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">
                    {formatPriceCOP(event.price)}
                  </dd>
                </div>

                <div className="flex items-start gap-3">
                  <Users
                    className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-sm font-semibold text-slate-500">
                      Capacidad
                    </dt>
                    <dd className="mt-1 text-slate-900">
                      {event.capacity} personas
                    </dd>
                  </div>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleShare}
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Compartir evento
              </button>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-12" aria-label="Eventos relacionados">
            <h2 className="text-2xl font-bold text-slate-900">
              También te puede interesar
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <EventCard
                  key={item.id}
                  event={item}
                  isFavorite={favoriteIds.has(item.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
