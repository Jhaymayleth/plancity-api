import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { favoriteService } from "../../services/favoriteService";
import type { Event } from "../../types/event";

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export function EventCard({
  event,
  isFavorite = false,
  onFavoriteChange,
}: EventCardProps) {
  const { user } = useAuth();

  const image = event.images[0]?.url;

  const handleFavorite = async () => {
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
    <article>
      {image && (
        <img
          src={image}
          alt={event.name}
          width="300"
        />
      )}

      <div>
        <p>{event.category.name}</p>

        <h2>{event.name}</h2>

        <p>{event.description}</p>

        <p>{event.location}</p>

        <p>${event.price}</p>

        {user && (
          <button
            type="button"
            onClick={handleFavorite}
            aria-label={
              isFavorite
                ? `Quitar ${event.name} de favoritos`
                : `Agregar ${event.name} a favoritos`
            }
          >
            {isFavorite
              ? "★ Quitar de favoritos"
              : "☆ Agregar a favoritos"}
          </button>
        )}

        <Link to={`/events/${event.id}`}>
          Ver detalles
        </Link>
      </div>
    </article>
  );
}