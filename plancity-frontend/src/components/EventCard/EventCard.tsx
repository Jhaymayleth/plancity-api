import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { favoriteService } from "../../services/favoriteService";
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

  const image = event.images[0]?.url;

  const handleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await favoriteService.remove(event.id);
        onFavoriteChange?.(false);
      } else {
        await favoriteService.add(event.id);
        onFavoriteChange?.(true);
      }
    } catch {
      // El estado no cambia si la petición falla.
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={event.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">
            🎉
          </div>
        )}

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={
            isFavorite
              ? `Quitar ${event.name} de favoritos`
              : `Agregar ${event.name} a favoritos`
          }
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-xl shadow-md backdrop-blur transition hover:scale-110 ${
            isFavorite
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-slate-700"
          }`}
        >
          {isFavorite ? "♥" : "♡"}
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
          <p>📍 {event.location}</p>
          <p className="font-semibold text-slate-900">
            ${event.price}
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
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Editar
            </Link>
            <button
              onClick={() => onDelete?.(event.id)}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}