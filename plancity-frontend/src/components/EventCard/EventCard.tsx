import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Heart, MapPin, Ticket } from "lucide-react";

import { useAuth } from "../../context/useAuth";
import { useToggleFavoriteMutation } from "../../hooks/useEventsQuery";
import { Badge } from "../ui/Badge";
import { cn } from "../../utils/cn";
import {
  formatEventDate,
  formatPriceCOP,
  getEventStatus,
  isFreeEvent,
} from "../../utils/formatters";
import type { Event } from "../../types/event";

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({
  event,
  isFavorite = false,
  onFavoriteChange,
  onDelete,
}: EventCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toggleFavorite = useToggleFavoriteMutation();
  /** Optimista local: evita parpadeo mientras el refetch confirma. */
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(
    null,
  );

  const image = event.images[0]?.url;
  const status = getEventStatus(event.date);
  const finished = status === "finalizado";
  const effectiveFavorite = optimisticFavorite ?? isFavorite;

  const handleFavorite = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    toggleFavorite.mutate(
      {
        eventId: event.id,
        eventName: event.name,
        isFavorite: effectiveFavorite,
      },
      {
        onSuccess: () => {
          const next = !effectiveFavorite;
          setOptimisticFavorite(next);
          onFavoriteChange?.(next);
        },
      },
    );
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={event.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Ticket className="h-16 w-16" aria-hidden="true" />
          </div>
        )}

        <div className="absolute left-4 top-4 flex gap-2">
          {isFreeEvent(event.price) ? (
            <Badge tone="success">Gratis</Badge>
          ) : null}
          {finished ? <Badge tone="neutral">Finalizado</Badge> : null}
          {status === "hoy" ? <Badge tone="warning">Hoy</Badge> : null}
        </div>

        <button
          type="button"
          onClick={handleFavorite}
          disabled={toggleFavorite.isPending}
          aria-label={
            effectiveFavorite
              ? `Quitar ${event.name} de favoritos`
              : `Agregar ${event.name} a favoritos`
          }
          aria-pressed={effectiveFavorite}
          className={cn(
            "absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full shadow-md backdrop-blur transition hover:scale-110 disabled:opacity-60",
            effectiveFavorite
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-slate-700",
          )}
        >
          <Heart
            className="h-5 w-5"
            aria-hidden="true"
            fill={effectiveFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="p-6">
        <p className="text-sm font-semibold text-indigo-600">
          {event.category.name}
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          {event.name}
        </h2>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {event.description}
        </p>

        <div className="mt-5 space-y-2 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <CalendarDays
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            {formatEventDate(event.date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            {event.location}
          </p>
          <p className="font-semibold text-slate-900">
            {formatPriceCOP(event.price)}
          </p>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="mt-6 inline-flex items-center font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          Ver detalles →
        </Link>

        {user?.role === "admin" && (
          <div className="mt-4 flex gap-2">
            <Link
              to={`/admin/events/${event.id}/edit`}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Editar
            </Link>
            <button
              type="button"
              onClick={() => onDelete?.(event.id)}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
